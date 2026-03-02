import { DEPARTMENTS, EMPLOYEES } from '@shared/mock';
import { StatusBadge } from '@shared/ui';
import { useAuth } from '@app/providers';
import type { Contract } from '@shared/types';
import s from './ContractDetailModal.module.scss';

interface Props {
  contract: Contract;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const hasInnKpp   = (c: Contract) => c.consumerType === 'Юридическое лицо' || c.consumerType === 'Индивидуальный предприниматель';
const hasPassport = (c: Contract) => c.consumerType === 'Физическое лицо'  || c.consumerType === 'Частный бытовой сектор';
const hasBank     = (c: Contract) => c.consumerType === 'Юридическое лицо' || c.consumerType === 'Индивидуальный предприниматель';
const hasAccountant = (c: Contract) => c.consumerType === 'Юридическое лицо' || c.consumerType === 'Индивидуальный предприниматель';

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className={s.field}>
      <span className={s.fieldLabel}>{label}</span>
      <span className={s.fieldValue}>{value}</span>
    </div>
  );
}

export const ContractDetailModal = ({ contract, onClose, onEdit, onDelete }: Props) => {
  const { user } = useAuth();
  const canModify = user?.isAdmin || user?.id === contract.createdBy;

  const dept = DEPARTMENTS.find(d => d.id === contract.departmentId);
  const creator = EMPLOYEES.find(e => e.id === contract.createdBy);

  const handleDelete = () => {
    if (confirm(`Удалить договор ${contract.id}?`)) {
      onDelete();
    }
  };

  return (
    <div className={s.overlay}>
      <div className={s.modal} role="dialog" aria-modal="true">

        {/* Header */}
        <div className={s.modalHead}>
          <div className={s.headLeft}>
            <div className={s.headId}>{contract.id}</div>
            <h2 className={s.modalTitle}>{contract.name}</h2>
            <div className={s.headMeta}>
              <StatusBadge status={contract.status} />
              <span className={s.headType}>{contract.consumerType}</span>
            </div>
          </div>
          {canModify && (
            <div className={s.headActions}>
              <button className={s.editBtn} onClick={onEdit}>
                Изменить
              </button>
              <button className={s.deleteBtn} onClick={handleDelete}>
                Удалить
              </button>
            </div>
          )}
        </div>

        {/* Body */}
        <div className={s.body}>

          <div className={s.section}>
            <h3 className={s.sectionTitle}>Отделение</h3>
            <div className={s.row}>
              <Field label="Отделение" value={dept ? `${dept.name} (код ${dept.code})` : contract.departmentId} />
              <Field label="Дата" value={contract.date} />
              <Field label="Ответственный" value={contract.responsible} />
              {creator && <Field label="Создал" value={creator.name} />}
            </div>
          </div>

          <div className={s.section}>
            <h3 className={s.sectionTitle}>Абонент</h3>
            <div className={s.row}>
              <Field label="Наименование" value={contract.name} />
              <Field label="Адрес" value={contract.address} />
              <Field label="Категория потребителя" value={contract.consumerCategory} />
            </div>
          </div>

          {(contract.representativeName || contract.representativePhone) && (
            <div className={s.section}>
              <h3 className={s.sectionTitle}>Представитель</h3>
              <div className={s.row}>
                <Field label="ФИО" value={contract.representativeName} />
                <Field label="Телефон" value={contract.representativePhone} />
              </div>
            </div>
          )}

          {hasInnKpp(contract) && (contract.inn || contract.kpp) && (
            <div className={s.section}>
              <h3 className={s.sectionTitle}>ИНН / КПП</h3>
              <div className={s.row}>
                <Field label="ИНН" value={contract.inn} />
                <Field label="КПП" value={contract.kpp} />
              </div>
            </div>
          )}

          {hasPassport(contract) && (contract.passportSeries || contract.passportNumber) && (
            <div className={s.section}>
              <h3 className={s.sectionTitle}>Паспортные данные</h3>
              <div className={s.row}>
                <Field label="Серия" value={contract.passportSeries} />
                <Field label="Номер" value={contract.passportNumber} />
                <Field label="Кем выдан" value={contract.passportIssuedBy} />
                <Field label="Дата выдачи" value={contract.passportIssuedDate} />
              </div>
            </div>
          )}

          {hasBank(contract) && (contract.bankName || contract.bankBik) && (
            <div className={s.section}>
              <h3 className={s.sectionTitle}>Банковские реквизиты</h3>
              <div className={s.row}>
                <Field label="Банк" value={contract.bankName} />
                <Field label="БИК" value={contract.bankBik} />
                <Field label="Расчётный счёт" value={contract.bankAccount} />
              </div>
            </div>
          )}

          {(contract.smsPhone || contract.contactPhone) && (
            <div className={s.section}>
              <h3 className={s.sectionTitle}>Контакты</h3>
              <div className={s.row}>
                <Field label="Телефон для СМС" value={contract.smsPhone} />
                <Field label="Контактный телефон" value={contract.contactPhone} />
              </div>
            </div>
          )}

          {(contract.responsibleEpu || (hasAccountant(contract) && contract.chiefAccountant)) && (
            <div className={s.section}>
              <h3 className={s.sectionTitle}>Прочее</h3>
              {hasAccountant(contract) && (contract.chiefAccountant || contract.chiefAccountantPhone) && (
                <div className={s.row}>
                  <Field label="Главный бухгалтер" value={contract.chiefAccountant} />
                  <Field label="Телефон бухгалтера" value={contract.chiefAccountantPhone} />
                </div>
              )}
              {(contract.responsibleEpu || contract.responsibleEpuPhone) && (
                <div className={s.row}>
                  <Field label="Ответственный за ЭПУ" value={contract.responsibleEpu} />
                  <Field label="Телефон ответственного" value={contract.responsibleEpuPhone} />
                </div>
              )}
            </div>
          )}
        </div>

        <div className={s.footer}>
          <button className={s.closeBtn} onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  );
};
