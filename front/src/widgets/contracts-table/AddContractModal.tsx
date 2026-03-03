import { useState, useEffect } from 'react';
import { useAuth } from '@app/providers';
import { getDepartments, createContract } from '@shared/api';
import type { CreateContractPayload } from '@shared/api';
import type { ConsumerType, ConsumerCategory, Department } from '@shared/types';
import s from './AddContractModal.module.scss';

interface Props {
  consumerType: ConsumerType;
  onClose: () => void;
  onSaved: () => void;
}

const isCorpType  = (t: ConsumerType) => t === 'Юридическое лицо' || t === 'Индивидуальный предприниматель';
const isPrivType  = (t: ConsumerType) => t === 'Физическое лицо'  || t === 'Частный бытовой сектор';

const CATEGORIES: ConsumerCategory[] = [
  'Прочие потребители','Население городское','Население сельское',
  'Приравненные к городскому населению','Приравненные к сельскому населению',
];

export const AddContractModal = ({ consumerType, onClose, onSaved }: Props) => {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin ?? false;

  const [departments, setDepartments] = useState<Department[]>([]);
  const [deptId,  setDeptId]  = useState(isAdmin ? '' : String(user?.departmentId ?? ''));
  const [saving,  setSaving]  = useState(false);
  const [apiError,setApiError]= useState('');

  useEffect(() => { getDepartments().then(setDepartments).catch(() => {}); }, []);

  const [f, setF] = useState({
    name: '', address: '',
    consumerCategory: '' as ConsumerCategory | '',
    repName: '', repPhone: '',
    inn: '', kpp: '',
    passportSeries: '', passportNumber: '', passportIssuedBy: '', passportIssuedDate: '',
    bankName: '', bankBik: '', bankAccount: '',
    smsPhone: '', contactPhone: '',
    chiefAccountant: '', chiefAccountantPhone: '',
    responsibleEpu: '', responsibleEpuPhone: '',
  });

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF(prev => ({ ...prev, [k]: e.target.value }));

  const selectedDeptId = isAdmin ? deptId : String(user?.departmentId ?? '');
  const deptDisplay = departments.find(d => String(d.id) === selectedDeptId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim()) return setApiError('Введите наименование абонента');
    if (!f.address.trim()) return setApiError('Введите адрес');
    if (!f.consumerCategory) return setApiError('Выберите категорию потребителя');
    if (isAdmin && !deptId) return setApiError('Выберите отделение');

    setSaving(true);
    setApiError('');

    const payload: CreateContractPayload = {
      name:             f.name,
      address:          f.address,
      consumerType,
      consumerCategory: f.consumerCategory as ConsumerCategory,
      status:           'Новая',                                    // всегда Новая
      date:             new Date().toISOString().slice(0, 10),      // сегодня
      responsible:      user?.name ?? '',                           // текущий пользователь
      departmentId:     Number(selectedDeptId) || null,
      representativeName:   f.repName    || undefined,
      representativePhone:  f.repPhone   || undefined,
      inn:                  f.inn        || undefined,
      kpp:                  f.kpp        || undefined,
      passportSeries:       f.passportSeries    || undefined,
      passportNumber:       f.passportNumber    || undefined,
      passportIssuedBy:     f.passportIssuedBy  || undefined,
      passportIssuedDate:   f.passportIssuedDate || undefined,
      bankName:             f.bankName    || undefined,
      bankBik:              f.bankBik     || undefined,
      bankAccount:          f.bankAccount || undefined,
      smsPhone:             f.smsPhone    || undefined,
      contactPhone:         f.contactPhone|| undefined,
      chiefAccountant:      f.chiefAccountant      || undefined,
      chiefAccountantPhone: f.chiefAccountantPhone || undefined,
      responsibleEpu:       f.responsibleEpu       || undefined,
      responsibleEpuPhone:  f.responsibleEpuPhone  || undefined,
    };

    try {
      await createContract(payload);
      onSaved();
    } catch (err) {
      setApiError(String(err));
      setSaving(false);
    }
  };

  return (
    <div className={s.overlay}>
      <div className={s.modal} role="dialog" aria-modal="true">
        <div className={s.modalHead}>
          <div><h2 className={s.modalTitle}>Новый договор</h2><p className={s.modalSub}>{consumerType}</p></div>
        </div>
        <form className={s.form} onSubmit={handleSubmit}>
          {apiError && <p style={{color:'red',fontSize:'13px',margin:'0 0 8px'}}>{apiError}</p>}
          <div className={s.sections}>

            {/* Отделение — только для администратора выбор, остальным показываем своё */}
            <section className={s.section}>
              <h3 className={s.sectionTitle}>Отделение</h3>
              <div className={s.row}>
                {isAdmin ? (
                  <div className={s.fieldFull}>
                    <label className={s.label}>Отделение <span style={{color:'#ef4444'}}>*</span></label>
                    <select className={s.input} value={deptId} onChange={e => setDeptId(e.target.value)} required>
                      <option value="">— Выберите —</option>
                      {departments.map(d => <option key={d.id} value={String(d.id)}>{d.name} (код {d.code})</option>)}
                    </select>
                  </div>
                ) : (
                  <div className={s.fieldFull}>
                    <label className={s.label}>Отделение</label>
                    <input className={s.input} readOnly value={deptDisplay ? `${deptDisplay.name} (код ${deptDisplay.code})` : '—'} />
                  </div>
                )}
              </div>
            </section>

            <section className={s.section}>
              <h3 className={s.sectionTitle}>Абонент</h3>
              <div className={s.row}>
                <div className={s.fieldFull}>
                  <label className={s.label}>Наименование <span style={{color:'#ef4444'}}>*</span></label>
                  <input className={s.input} value={f.name} onChange={set('name')} placeholder="Полное наименование" required />
                </div>
              </div>
            </section>

            <section className={s.section}>
              <h3 className={s.sectionTitle}>Категория потребителя</h3>
              <div className={s.row}>
                <div className={s.field}>
                  <label className={s.label}>Категория <span style={{color:'#ef4444'}}>*</span></label>
                  <select className={s.input} value={f.consumerCategory} onChange={set('consumerCategory')} required>
                    <option value="">— Выберите —</option>
                    {CATEGORIES.map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
            </section>

            <section className={s.section}>
              <h3 className={s.sectionTitle}>Адрес</h3>
              <div className={s.row}>
                <div className={s.fieldFull}>
                  <label className={s.label}>Адрес абонента <span style={{color:'#ef4444'}}>*</span></label>
                  <input className={s.input} value={f.address} onChange={set('address')} placeholder="Республика Дагестан, г. Махачкала, ул. ..." required />
                </div>
              </div>
            </section>

            <section className={s.section}>
              <h3 className={s.sectionTitle}>Представитель</h3>
              <div className={s.row}>
                <div className={s.field}><label className={s.label}>ФИО</label><input className={s.input} value={f.repName} onChange={set('repName')} placeholder="Иванов Иван Иванович" /></div>
                <div className={s.field}><label className={s.label}>Телефон</label><input className={s.input} value={f.repPhone} onChange={set('repPhone')} placeholder="+7 (900) 000-00-00" /></div>
              </div>
            </section>

            {isCorpType(consumerType) && (
              <section className={s.section}>
                <h3 className={s.sectionTitle}>ИНН / КПП</h3>
                <div className={s.row}>
                  <div className={s.field}><label className={s.label}>ИНН</label><input className={s.input} value={f.inn} onChange={set('inn')} placeholder="1234567890" maxLength={12} /></div>
                  <div className={s.field}><label className={s.label}>КПП</label><input className={s.input} value={f.kpp} onChange={set('kpp')} placeholder="123456789" maxLength={9} /></div>
                </div>
              </section>
            )}

            {isPrivType(consumerType) && (
              <section className={s.section}>
                <h3 className={s.sectionTitle}>Паспортные данные</h3>
                <div className={s.row}>
                  <div className={s.field}><label className={s.label}>Серия</label><input className={s.input} value={f.passportSeries} onChange={set('passportSeries')} placeholder="0000" maxLength={4} /></div>
                  <div className={s.field}><label className={s.label}>Номер</label><input className={s.input} value={f.passportNumber} onChange={set('passportNumber')} placeholder="000000" maxLength={6} /></div>
                  <div className={s.field}><label className={s.label}>Кем выдан</label><input className={s.input} value={f.passportIssuedBy} onChange={set('passportIssuedBy')} placeholder="МВД по РД в г. Махачкала" /></div>
                  <div className={s.field}><label className={s.label}>Дата выдачи</label><input className={s.input} type="date" value={f.passportIssuedDate} onChange={set('passportIssuedDate')} /></div>
                </div>
              </section>
            )}

            {isCorpType(consumerType) && (
              <section className={s.section}>
                <h3 className={s.sectionTitle}>Банковские реквизиты</h3>
                <div className={s.row}>
                  <div className={s.field}><label className={s.label}>Банк</label><input className={s.input} value={f.bankName} onChange={set('bankName')} placeholder="ПАО «Сбербанк»" /></div>
                  <div className={s.field}><label className={s.label}>БИК</label><input className={s.input} value={f.bankBik} onChange={set('bankBik')} placeholder="044525225" maxLength={9} /></div>
                  <div className={s.fieldFull}><label className={s.label}>Расчётный счёт</label><input className={s.input} value={f.bankAccount} onChange={set('bankAccount')} placeholder="40702810938000000001" maxLength={20} /></div>
                </div>
              </section>
            )}

            <section className={s.section}>
              <h3 className={s.sectionTitle}>Контакты</h3>
              <div className={s.row}>
                <div className={s.field}><label className={s.label}>Телефон для СМС</label><input className={s.input} value={f.smsPhone} onChange={set('smsPhone')} placeholder="+7 (900) 000-00-00" /></div>
                <div className={s.field}><label className={s.label}>Контактный телефон</label><input className={s.input} value={f.contactPhone} onChange={set('contactPhone')} placeholder="+7 (900) 000-00-00" /></div>
              </div>
            </section>

            <section className={s.section}>
              <h3 className={s.sectionTitle}>Прочее</h3>
              {isCorpType(consumerType) && (
                <div className={s.row}>
                  <div className={s.field}><label className={s.label}>Гл. бухгалтер</label><input className={s.input} value={f.chiefAccountant} onChange={set('chiefAccountant')} placeholder="Петрова А.И." /></div>
                  <div className={s.field}><label className={s.label}>Телефон бухгалтера</label><input className={s.input} value={f.chiefAccountantPhone} onChange={set('chiefAccountantPhone')} placeholder="+7 (900) 000-00-00" /></div>
                </div>
              )}
              <div className={s.row}>
                <div className={s.field}><label className={s.label}>Ответственный за ЭПУ</label><input className={s.input} value={f.responsibleEpu} onChange={set('responsibleEpu')} placeholder="Иванов А.С." /></div>
                <div className={s.field}><label className={s.label}>Телефон ЭПУ</label><input className={s.input} value={f.responsibleEpuPhone} onChange={set('responsibleEpuPhone')} placeholder="+7 (900) 000-00-00" /></div>
              </div>
            </section>

          </div>
          <div className={s.footer}>
            <button type="button" className={s.cancelBtn} onClick={onClose}>Отмена</button>
            <button type="submit" className={s.saveBtn} disabled={saving}>{saving ? 'Сохранение...' : 'Сохранить договор'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
