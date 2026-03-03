import { useState, useEffect, useRef } from 'react';
import { getDepartments, uploadScan, approveContract, rejectContract } from '@shared/api';
import { StatusBadge } from '@shared/ui';
import { useAuth } from '@app/providers';
import { printContractPDF } from '@shared/lib/printContract';
import type { Contract, Department } from '@shared/types';
import s from './ContractDetailModal.module.scss';

interface Props {
  contract: Contract;
  onClose:  () => void;
  onEdit:   () => void;
  onDelete: () => void;
  onUpdated?: (updated: Contract) => void;
}

const isCorpType = (c: Contract) => c.consumerType === 'Юридическое лицо' || c.consumerType === 'Индивидуальный предприниматель';
const isPrivType = (c: Contract) => c.consumerType === 'Физическое лицо'  || c.consumerType === 'Частный бытовой сектор';

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className={s.field}>
      <span className={s.fieldLabel}>{label}</span>
      <span className={s.fieldValue}>{value}</span>
    </div>
  );
}

export const ContractDetailModal = ({ contract, onClose, onEdit, onDelete, onUpdated }: Props) => {
  const { user } = useAuth();
  const isManager  = user?.role === 'Менеджер' || user?.isAdmin;
  const canModify  = user?.isAdmin || String(user?.id) === String(contract.createdBy);
  const canApprove = isManager && contract.status === 'Согласование';

  const [departments, setDepartments] = useState<Department[]>([]);
  const [current, setCurrent]         = useState<Contract>(contract);
  const [uploading,  setUploading]    = useState(false);
  const [approving,  setApproving]    = useState(false);
  const [showReject, setShowReject]   = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionError, setActionError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { getDepartments().then(setDepartments).catch(() => {}); }, []);
  const dept = departments.find(d => String(d.id) === String(current.departmentId));

  // Печать PDF
  const handlePrint = () => {
    printContractPDF(current, dept?.name ?? '', dept?.code ?? '');
  };

  // Загрузить скан и отправить на согласование
  const handleUploadScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setActionError('');
    try {
      const updated = await uploadScan(current.id, file);
      setCurrent(updated);
      onUpdated?.(updated);
    } catch (err) {
      setActionError(String(err));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  // Согласовать
  const handleApprove = async () => {
    setApproving(true);
    setActionError('');
    try {
      const updated = await approveContract(current.id);
      setCurrent(updated);
      onUpdated?.(updated);
    } catch (err) {
      setActionError(String(err));
    } finally {
      setApproving(false);
    }
  };

  // Отклонить
  const handleReject = async () => {
    setApproving(true);
    setActionError('');
    try {
      const updated = await rejectContract(current.id, rejectReason);
      setCurrent(updated);
      onUpdated?.(updated);
      setShowReject(false);
    } catch (err) {
      setActionError(String(err));
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className={s.overlay}>
      <div className={s.modal} role="dialog" aria-modal="true">

        {/* Header */}
        <div className={s.modalHead}>
          <div className={s.headLeft}>
            <div className={s.headId}>#{current.id}</div>
            <h2 className={s.modalTitle}>{current.name}</h2>
            <div className={s.headMeta}>
              <StatusBadge status={current.status} />
              <span className={s.headType}>{current.consumerType}</span>
            </div>
          </div>
          <div className={s.headActions}>
            {/* Печать — доступна всегда */}
            <button className={s.editBtn} onClick={handlePrint} title="Распечатать заявление">
              🖨 Печать
            </button>

            {/* Редактировать / удалить — только для создателя или админа */}
            {canModify && current.status === 'Новая' && (
              <>
                <button className={s.editBtn} onClick={onEdit}>Изменить</button>
                <button className={s.deleteBtn} onClick={onDelete}>Удалить</button>
              </>
            )}
          </div>
        </div>

        <div className={s.body}>

          {/* ── Основные данные ─────────────────────────────────────── */}
          <div className={s.section}>
            <h3 className={s.sectionTitle}>Отделение</h3>
            <div className={s.row}>
              <Field label="Отделение" value={dept ? `${dept.name} (код ${dept.code})` : String(current.departmentId ?? '—')} />
              <Field label="Дата" value={current.date} />
              <Field label="Ответственный" value={current.responsible} />
            </div>
          </div>

          <div className={s.section}>
            <h3 className={s.sectionTitle}>Абонент</h3>
            <div className={s.row}>
              <Field label="Наименование" value={current.name} />
              <Field label="Адрес" value={current.address} />
              <Field label="Категория" value={current.consumerCategory} />
            </div>
          </div>

          {(current.representativeName || current.representativePhone) && (
            <div className={s.section}>
              <h3 className={s.sectionTitle}>Представитель</h3>
              <div className={s.row}>
                <Field label="ФИО" value={current.representativeName} />
                <Field label="Телефон" value={current.representativePhone} />
              </div>
            </div>
          )}

          {isCorpType(current) && (current.inn || current.kpp) && (
            <div className={s.section}>
              <h3 className={s.sectionTitle}>ИНН / КПП</h3>
              <div className={s.row}>
                <Field label="ИНН" value={current.inn} />
                <Field label="КПП" value={current.kpp} />
              </div>
            </div>
          )}

          {isPrivType(current) && (current.passportSeries || current.passportNumber) && (
            <div className={s.section}>
              <h3 className={s.sectionTitle}>Паспортные данные</h3>
              <div className={s.row}>
                <Field label="Серия" value={current.passportSeries} />
                <Field label="Номер" value={current.passportNumber} />
                <Field label="Кем выдан" value={current.passportIssuedBy} />
                <Field label="Дата выдачи" value={current.passportIssuedDate} />
              </div>
            </div>
          )}

          {isCorpType(current) && (current.bankName || current.bankBik) && (
            <div className={s.section}>
              <h3 className={s.sectionTitle}>Банковские реквизиты</h3>
              <div className={s.row}>
                <Field label="Банк" value={current.bankName} />
                <Field label="БИК" value={current.bankBik} />
                <Field label="Расчётный счёт" value={current.bankAccount} />
              </div>
            </div>
          )}

          {(current.smsPhone || current.contactPhone) && (
            <div className={s.section}>
              <h3 className={s.sectionTitle}>Контакты</h3>
              <div className={s.row}>
                <Field label="Телефон для СМС" value={current.smsPhone} />
                <Field label="Контактный телефон" value={current.contactPhone} />
              </div>
            </div>
          )}

          {(current.responsibleEpu || current.chiefAccountant) && (
            <div className={s.section}>
              <h3 className={s.sectionTitle}>Прочее</h3>
              {isCorpType(current) && (
                <div className={s.row}>
                  <Field label="Главный бухгалтер" value={current.chiefAccountant} />
                  <Field label="Телефон бухгалтера" value={current.chiefAccountantPhone} />
                </div>
              )}
              <div className={s.row}>
                <Field label="Ответственный за ЭПУ" value={current.responsibleEpu} />
                <Field label="Телефон ЭПУ" value={current.responsibleEpuPhone} />
              </div>
            </div>
          )}

          {/* ── Скан договора ──────────────────────────────────────── */}
          <div className={s.section}>
            <h3 className={s.sectionTitle}>Скан подписанного договора</h3>

            {current.scanFile ? (
              <div className={s.row}>
                <div className={s.field}>
                  <span className={s.fieldLabel}>Файл</span>
                  <a href={current.scanFile} target="_blank" rel="noopener noreferrer"
                    className={s.fieldValue} style={{ color: 'var(--accent)', textDecoration: 'underline' }}>
                    Открыть скан
                  </a>
                </div>
                <Field label="Загружен" value={current.scanUploadedAt ? new Date(current.scanUploadedAt).toLocaleString('ru') : undefined} />
              </div>
            ) : (
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Скан ещё не загружен
              </p>
            )}

            {/* Загрузка доступна только когда статус Новая */}
            {current.status === 'Новая' && canModify && (
              <div style={{ marginTop: '8px' }}>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  style={{ display: 'none' }}
                  onChange={handleUploadScan}
                />
                <button
                  className={s.editBtn}
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? 'Загрузка...' : '📎 Прикрепить скан и отправить на согласование'}
                </button>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  После загрузки скана статус изменится на «Согласование»
                </p>
              </div>
            )}
          </div>

          {/* ── Причина отклонения ─────────────────────────────────── */}
          {current.status === 'Отклонена' && current.rejectionReason && (
            <div className={s.section}>
              <h3 className={s.sectionTitle} style={{ color: '#ef4444' }}>Причина отклонения</h3>
              <p style={{ fontSize: '13px', padding: '8px', background: '#fef2f2', borderRadius: '6px', color: '#991b1b' }}>
                {current.rejectionReason}
              </p>
            </div>
          )}

          {/* ── Действия менеджера ─────────────────────────────────── */}
          {canApprove && (
            <div className={s.section}>
              <h3 className={s.sectionTitle}>Согласование</h3>
              {current.scanFile && (
                <div style={{ marginBottom: '8px' }}>
                  <a href={current.scanFile} target="_blank" rel="noopener noreferrer"
                    style={{ color: 'var(--accent)', fontSize: '13px' }}>
                    📄 Просмотреть скан договора
                  </a>
                </div>
              )}
              {actionError && <p style={{ color: 'red', fontSize: '13px', marginBottom: '8px' }}>{actionError}</p>}

              {!showReject ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleApprove}
                    disabled={approving}
                    style={{
                      padding: '8px 20px', borderRadius: '8px', border: 'none',
                      background: '#10b981', color: '#fff', fontWeight: 600,
                      cursor: 'pointer', fontSize: '13px',
                    }}
                  >
                    {approving ? 'Обработка...' : '✓ Согласовать'}
                  </button>
                  <button
                    onClick={() => setShowReject(true)}
                    disabled={approving}
                    style={{
                      padding: '8px 20px', borderRadius: '8px', border: 'none',
                      background: '#ef4444', color: '#fff', fontWeight: 600,
                      cursor: 'pointer', fontSize: '13px',
                    }}
                  >
                    ✕ Отклонить
                  </button>
                </div>
              ) : (
                <div>
                  <textarea
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    placeholder="Укажите причину отклонения..."
                    style={{
                      width: '100%', minHeight: '80px', padding: '8px',
                      borderRadius: '6px', border: '1px solid var(--border)',
                      fontSize: '13px', resize: 'vertical', marginBottom: '8px',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={handleReject}
                      disabled={approving || !rejectReason.trim()}
                      style={{
                        padding: '8px 20px', borderRadius: '8px', border: 'none',
                        background: '#ef4444', color: '#fff', fontWeight: 600,
                        cursor: 'pointer', fontSize: '13px',
                      }}
                    >
                      {approving ? 'Обработка...' : 'Подтвердить отклонение'}
                    </button>
                    <button
                      onClick={() => { setShowReject(false); setRejectReason(''); }}
                      style={{
                        padding: '8px 20px', borderRadius: '8px',
                        border: '1px solid var(--border)',
                        background: 'transparent', cursor: 'pointer', fontSize: '13px',
                      }}
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {actionError && !canApprove && (
            <p style={{ color: 'red', fontSize: '13px' }}>{actionError}</p>
          )}
        </div>

        <div className={s.footer}>
          <button className={s.closeBtn} onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  );
};
