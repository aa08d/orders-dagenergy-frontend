import { useState, useEffect } from 'react';
import { useAuth } from '@app/providers';
import { getDepartments, updateContract } from '@shared/api';
import type { ConsumerCategory, Status, Department, Contract } from '@shared/types';
import s from './AddContractModal.module.scss';

interface Props {
  contract: Contract;
  onClose: () => void;
  onSave:  () => void;
}

const isCorpType  = (c: Contract) => c.consumerType === 'Юридическое лицо' || c.consumerType === 'Индивидуальный предприниматель';
const isPrivType  = (c: Contract) => c.consumerType === 'Физическое лицо'  || c.consumerType === 'Частный бытовой сектор';

const CATEGORIES: ConsumerCategory[] = [
  'Прочие потребители','Население городское','Население сельское',
  'Приравненные к городскому населению','Приравненные к сельскому населению',
];
const STATUSES: Status[] = ['Новая','В работе','Согласование','Завершена','Отклонена'];

export const EditContractModal = ({ contract, onClose, onSave }: Props) => {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin ?? false;

  const [departments, setDepartments] = useState<Department[]>([]);
  const [deptId,  setDeptId]  = useState(String(contract.departmentId ?? ''));
  const [saving,  setSaving]  = useState(false);
  const [apiError,setApiError]= useState('');

  useEffect(() => { getDepartments().then(setDepartments).catch(() => {}); }, []);

  const [f, setF] = useState({
    name:                 contract.name,
    address:              contract.address,
    responsible:          contract.responsible,
    date:                 contract.date,
    status:               contract.status,
    consumerCategory:     contract.consumerCategory,
    repName:              contract.representativeName   ?? '',
    repPhone:             contract.representativePhone  ?? '',
    inn:                  contract.inn                  ?? '',
    kpp:                  contract.kpp                  ?? '',
    passportSeries:       contract.passportSeries       ?? '',
    passportNumber:       contract.passportNumber       ?? '',
    passportIssuedBy:     contract.passportIssuedBy     ?? '',
    passportIssuedDate:   contract.passportIssuedDate   ?? '',
    bankName:             contract.bankName             ?? '',
    bankBik:              contract.bankBik              ?? '',
    bankAccount:          contract.bankAccount          ?? '',
    smsPhone:             contract.smsPhone             ?? '',
    contactPhone:         contract.contactPhone         ?? '',
    chiefAccountant:      contract.chiefAccountant      ?? '',
    chiefAccountantPhone: contract.chiefAccountantPhone ?? '',
    responsibleEpu:       contract.responsibleEpu       ?? '',
    responsibleEpuPhone:  contract.responsibleEpuPhone  ?? '',
  });

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF(prev => ({ ...prev, [k]: e.target.value }));

  const deptDisplay = departments.find(d => String(d.id) === deptId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setApiError('');
    try {
      await updateContract(contract.id, {
        name:                 f.name,
        address:              f.address,
        responsible:          f.responsible,
        date:                 f.date,
        status:               f.status,
        consumerCategory:     f.consumerCategory as ConsumerCategory,
        departmentId:         Number(deptId) || null,
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
      });
      onSave();
    } catch (err) {
      setApiError(String(err));
      setSaving(false);
    }
  };

  return (
    <div className={s.overlay}>
      <div className={s.modal} role="dialog" aria-modal="true">
        <div className={s.modalHead}>
          <div><h2 className={s.modalTitle}>Редактирование договора</h2><p className={s.modalSub}>#{contract.id} · {contract.consumerType}</p></div>
        </div>
        <form className={s.form} onSubmit={handleSubmit}>
          {apiError && <p style={{color:'red',fontSize:'13px',margin:'0 0 8px'}}>{apiError}</p>}
          <div className={s.sections}>

            <section className={s.section}>
              <h3 className={s.sectionTitle}>Отделение и дата</h3>
              <div className={s.row}>
                {isAdmin ? (
                  <div className={s.field}>
                    <label className={s.label}>Отделение</label>
                    <select className={s.input} value={deptId} onChange={e => setDeptId(e.target.value)}>
                      {departments.map(d => <option key={d.id} value={String(d.id)}>{d.name} (код {d.code})</option>)}
                    </select>
                  </div>
                ) : (
                  <div className={s.field}>
                    <label className={s.label}>Отделение</label>
                    <input className={s.input} readOnly value={deptDisplay ? `${deptDisplay.name} (код ${deptDisplay.code})` : '—'} />
                  </div>
                )}
                <div className={s.field}><label className={s.label}>Дата</label><input className={s.input} type="date" value={f.date} onChange={set('date')} /></div>
                <div className={s.field}><label className={s.label}>Ответственный</label><input className={s.input} value={f.responsible} onChange={set('responsible')} /></div>
                <div className={s.field}>
                  <label className={s.label}>Статус</label>
                  <select className={s.input} value={f.status} onChange={set('status')}>
                    {STATUSES.map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
            </section>

            <section className={s.section}>
              <h3 className={s.sectionTitle}>Абонент</h3>
              <div className={s.row}>
                <div className={s.fieldFull}><label className={s.label}>Наименование</label><input className={s.input} value={f.name} onChange={set('name')} required /></div>
              </div>
            </section>

            <section className={s.section}>
              <h3 className={s.sectionTitle}>Категория потребителя</h3>
              <div className={s.row}>
                <div className={s.field}>
                  <label className={s.label}>Категория</label>
                  <select className={s.input} value={f.consumerCategory} onChange={set('consumerCategory')}>
                    {CATEGORIES.map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
            </section>

            <section className={s.section}>
              <h3 className={s.sectionTitle}>Адрес</h3>
              <div className={s.row}>
                <div className={s.fieldFull}><label className={s.label}>Адрес абонента</label><input className={s.input} value={f.address} onChange={set('address')} required /></div>
              </div>
            </section>

            <section className={s.section}>
              <h3 className={s.sectionTitle}>Представитель</h3>
              <div className={s.row}>
                <div className={s.field}><label className={s.label}>ФИО</label><input className={s.input} value={f.repName} onChange={set('repName')} /></div>
                <div className={s.field}><label className={s.label}>Телефон</label><input className={s.input} value={f.repPhone} onChange={set('repPhone')} /></div>
              </div>
            </section>

            {isCorpType(contract) && (
              <section className={s.section}>
                <h3 className={s.sectionTitle}>ИНН / КПП</h3>
                <div className={s.row}>
                  <div className={s.field}><label className={s.label}>ИНН</label><input className={s.input} value={f.inn} onChange={set('inn')} maxLength={12} /></div>
                  <div className={s.field}><label className={s.label}>КПП</label><input className={s.input} value={f.kpp} onChange={set('kpp')} maxLength={9} /></div>
                </div>
              </section>
            )}

            {isPrivType(contract) && (
              <section className={s.section}>
                <h3 className={s.sectionTitle}>Паспортные данные</h3>
                <div className={s.row}>
                  <div className={s.field}><label className={s.label}>Серия</label><input className={s.input} value={f.passportSeries} onChange={set('passportSeries')} maxLength={4} /></div>
                  <div className={s.field}><label className={s.label}>Номер</label><input className={s.input} value={f.passportNumber} onChange={set('passportNumber')} maxLength={6} /></div>
                  <div className={s.field}><label className={s.label}>Кем выдан</label><input className={s.input} value={f.passportIssuedBy} onChange={set('passportIssuedBy')} /></div>
                  <div className={s.field}><label className={s.label}>Дата выдачи</label><input className={s.input} type="date" value={f.passportIssuedDate} onChange={set('passportIssuedDate')} /></div>
                </div>
              </section>
            )}

            {isCorpType(contract) && (
              <section className={s.section}>
                <h3 className={s.sectionTitle}>Банковские реквизиты</h3>
                <div className={s.row}>
                  <div className={s.field}><label className={s.label}>Банк</label><input className={s.input} value={f.bankName} onChange={set('bankName')} /></div>
                  <div className={s.field}><label className={s.label}>БИК</label><input className={s.input} value={f.bankBik} onChange={set('bankBik')} maxLength={9} /></div>
                  <div className={s.fieldFull}><label className={s.label}>Расчётный счёт</label><input className={s.input} value={f.bankAccount} onChange={set('bankAccount')} maxLength={20} /></div>
                </div>
              </section>
            )}

            <section className={s.section}>
              <h3 className={s.sectionTitle}>Контакты</h3>
              <div className={s.row}>
                <div className={s.field}><label className={s.label}>Телефон для СМС</label><input className={s.input} value={f.smsPhone} onChange={set('smsPhone')} /></div>
                <div className={s.field}><label className={s.label}>Контактный телефон</label><input className={s.input} value={f.contactPhone} onChange={set('contactPhone')} /></div>
              </div>
            </section>

            <section className={s.section}>
              <h3 className={s.sectionTitle}>Прочее</h3>
              {isCorpType(contract) && (
                <div className={s.row}>
                  <div className={s.field}><label className={s.label}>Гл. бухгалтер</label><input className={s.input} value={f.chiefAccountant} onChange={set('chiefAccountant')} /></div>
                  <div className={s.field}><label className={s.label}>Телефон бухгалтера</label><input className={s.input} value={f.chiefAccountantPhone} onChange={set('chiefAccountantPhone')} /></div>
                </div>
              )}
              <div className={s.row}>
                <div className={s.field}><label className={s.label}>Ответственный за ЭПУ</label><input className={s.input} value={f.responsibleEpu} onChange={set('responsibleEpu')} /></div>
                <div className={s.field}><label className={s.label}>Телефон ЭПУ</label><input className={s.input} value={f.responsibleEpuPhone} onChange={set('responsibleEpuPhone')} /></div>
              </div>
            </section>
          </div>
          <div className={s.footer}>
            <button type="button" className={s.cancelBtn} onClick={onClose}>Отмена</button>
            <button type="submit" className={s.saveBtn} disabled={saving}>{saving ? 'Сохранение...' : 'Сохранить изменения'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
