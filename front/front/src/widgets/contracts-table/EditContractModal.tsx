import { useState } from 'react';
import { useAuth } from '@app/providers';
import { DEPARTMENTS } from '@shared/mock';
import type { Contract } from '@shared/types';
import s from './AddContractModal.module.scss';

interface Props {
  contract: Contract;
  onClose: () => void;
  onSave: (updated: Contract) => void;
}

const hasInnKpp     = (c: Contract) => c.consumerType === 'Юридическое лицо' || c.consumerType === 'Индивидуальный предприниматель';
const hasPassport   = (c: Contract) => c.consumerType === 'Физическое лицо'  || c.consumerType === 'Частный бытовой сектор';
const hasBank       = (c: Contract) => c.consumerType === 'Юридическое лицо' || c.consumerType === 'Индивидуальный предприниматель';
const hasAccountant = (c: Contract) => c.consumerType === 'Юридическое лицо' || c.consumerType === 'Индивидуальный предприниматель';

export const EditContractModal = ({ contract, onClose, onSave }: Props) => {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin ?? false;

  const [deptId, setDeptId] = useState(contract.departmentId);
  const [form, setForm] = useState({
    abonentName:          contract.name,
    repName:              contract.representativeName  ?? '',
    repPhone:             contract.representativePhone ?? '',
    address:              contract.address,
    inn:                  contract.inn                 ?? '',
    kpp:                  contract.kpp                 ?? '',
    passportSeries:       contract.passportSeries      ?? '',
    passportNumber:       contract.passportNumber      ?? '',
    passportIssuedBy:     contract.passportIssuedBy    ?? '',
    passportIssuedDate:   contract.passportIssuedDate  ?? '',
    bankName:             contract.bankName             ?? '',
    bankBik:              contract.bankBik              ?? '',
    bankAccount:          contract.bankAccount          ?? '',
    smsPhone:             contract.smsPhone             ?? '',
    contactPhone:         contract.contactPhone         ?? '',
    consumerCategory:     contract.consumerCategory,
    chiefAccountant:      contract.chiefAccountant      ?? '',
    chiefAccountantPhone: contract.chiefAccountantPhone ?? '',
    responsibleEpu:       contract.responsibleEpu       ?? '',
    responsibleEpuPhone:  contract.responsibleEpuPhone  ?? '',
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const dept = DEPARTMENTS.find(d => d.id === deptId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...contract,
      departmentId:          deptId,
      name:                  form.abonentName,
      address:               form.address,
      representativeName:    form.repName   || undefined,
      representativePhone:   form.repPhone  || undefined,
      inn:                   form.inn       || undefined,
      kpp:                   form.kpp       || undefined,
      passportSeries:        form.passportSeries     || undefined,
      passportNumber:        form.passportNumber     || undefined,
      passportIssuedBy:      form.passportIssuedBy   || undefined,
      passportIssuedDate:    form.passportIssuedDate  || undefined,
      bankName:              form.bankName   || undefined,
      bankBik:               form.bankBik   || undefined,
      bankAccount:           form.bankAccount || undefined,
      smsPhone:              form.smsPhone   || undefined,
      contactPhone:          form.contactPhone || undefined,
      consumerCategory:      form.consumerCategory as Contract['consumerCategory'],
      chiefAccountant:       form.chiefAccountant      || undefined,
      chiefAccountantPhone:  form.chiefAccountantPhone || undefined,
      responsibleEpu:        form.responsibleEpu       || undefined,
      responsibleEpuPhone:   form.responsibleEpuPhone  || undefined,
    });
  };

  return (
    <div className={s.overlay}>
      <div className={s.modal} role="dialog" aria-modal="true">
        <div className={s.modalHead}>
          <div>
            <h2 className={s.modalTitle}>Редактирование договора</h2>
            <p className={s.modalSub}>{contract.id} · {contract.consumerType}</p>
          </div>
        </div>

        <form className={s.form} onSubmit={handleSubmit}>
          <div className={s.sections}>

            <section className={s.section}>
              <h3 className={s.sectionTitle}>Отделение</h3>
              <div className={s.row}>
                {isAdmin ? (
                  <div className={s.fieldFull}>
                    <label className={s.label}>Отделение</label>
                    <select className={s.input} value={deptId} onChange={e => setDeptId(e.target.value)} required>
                      {DEPARTMENTS.map(d => (
                        <option key={d.id} value={d.id}>{d.name} (код {d.code})</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className={s.fieldFull}>
                    <label className={s.label}>Отделение</label>
                    <input className={s.input} value={dept ? `${dept.name} (код ${dept.code})` : ''} readOnly />
                  </div>
                )}
              </div>
            </section>

            <section className={s.section}>
              <h3 className={s.sectionTitle}>Абонент</h3>
              <div className={s.row}>
                <div className={s.fieldFull}>
                  <label className={s.label}>Наименование</label>
                  <input className={s.input} value={form.abonentName} onChange={set('abonentName')} placeholder="Полное наименование" required />
                </div>
              </div>
            </section>

            <section className={s.section}>
              <h3 className={s.sectionTitle}>Представитель</h3>
              <div className={s.row}>
                <div className={s.field}>
                  <label className={s.label}>ФИО</label>
                  <input className={s.input} value={form.repName} onChange={set('repName')} placeholder="Иванов Иван Иванович" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Телефон</label>
                  <input className={s.input} value={form.repPhone} onChange={set('repPhone')} placeholder="+7 (900) 000-00-00" />
                </div>
              </div>
            </section>

            <section className={s.section}>
              <h3 className={s.sectionTitle}>Адрес</h3>
              <div className={s.row}>
                <div className={s.fieldFull}>
                  <label className={s.label}>Адрес абонента</label>
                  <input className={s.input} value={form.address} onChange={set('address')} placeholder="Республика Дагестан, г. Махачкала, ул. ..." required />
                </div>
              </div>
            </section>

            {hasInnKpp(contract) && (
              <section className={s.section}>
                <h3 className={s.sectionTitle}>ИНН / КПП</h3>
                <div className={s.row}>
                  <div className={s.field}>
                    <label className={s.label}>ИНН</label>
                    <input className={s.input} value={form.inn} onChange={set('inn')} placeholder="1234567890" maxLength={12} />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>КПП</label>
                    <input className={s.input} value={form.kpp} onChange={set('kpp')} placeholder="123456789" maxLength={9} />
                  </div>
                </div>
              </section>
            )}

            {hasPassport(contract) && (
              <section className={s.section}>
                <h3 className={s.sectionTitle}>Паспортные данные</h3>
                <div className={s.row}>
                  <div className={s.field}>
                    <label className={s.label}>Серия</label>
                    <input className={s.input} value={form.passportSeries} onChange={set('passportSeries')} placeholder="0000" maxLength={4} />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Номер</label>
                    <input className={s.input} value={form.passportNumber} onChange={set('passportNumber')} placeholder="000000" maxLength={6} />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Кем выдан</label>
                    <input className={s.input} value={form.passportIssuedBy} onChange={set('passportIssuedBy')} placeholder="МВД по РД" />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Дата выдачи</label>
                    <input className={s.input} type="date" value={form.passportIssuedDate} onChange={set('passportIssuedDate')} />
                  </div>
                </div>
              </section>
            )}

            {hasBank(contract) && (
              <section className={s.section}>
                <h3 className={s.sectionTitle}>Банковские реквизиты</h3>
                <div className={s.row}>
                  <div className={s.field}>
                    <label className={s.label}>Наименование банка</label>
                    <input className={s.input} value={form.bankName} onChange={set('bankName')} placeholder="ПАО «Сбербанк»" />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>БИК</label>
                    <input className={s.input} value={form.bankBik} onChange={set('bankBik')} placeholder="044525225" maxLength={9} />
                  </div>
                  <div className={s.fieldFull}>
                    <label className={s.label}>Расчётный счёт</label>
                    <input className={s.input} value={form.bankAccount} onChange={set('bankAccount')} placeholder="40702810938000000001" maxLength={20} />
                  </div>
                </div>
              </section>
            )}

            <section className={s.section}>
              <h3 className={s.sectionTitle}>Контакты</h3>
              <div className={s.row}>
                <div className={s.field}>
                  <label className={s.label}>Телефон для СМС-уведомлений</label>
                  <input className={s.input} value={form.smsPhone} onChange={set('smsPhone')} placeholder="+7 (900) 000-00-00" />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Контактный телефон</label>
                  <input className={s.input} value={form.contactPhone} onChange={set('contactPhone')} placeholder="+7 (900) 000-00-00" />
                </div>
              </div>
            </section>

            <section className={s.section}>
              <h3 className={s.sectionTitle}>Категория потребителя</h3>
              <div className={s.row}>
                <div className={s.field}>
                  <label className={s.label}>Категория</label>
                  <select className={s.input} value={form.consumerCategory} onChange={set('consumerCategory')}>
                    <option>Прочие потребители</option>
                    <option>Население городское</option>
                    <option>Население сельское</option>
                    <option>Приравненные к городскому населению</option>
                    <option>Приравненные к сельскому населению</option>
                  </select>
                </div>
              </div>
            </section>

            <section className={s.section}>
              <h3 className={s.sectionTitle}>Прочее</h3>
              {hasAccountant(contract) && (
                <div className={s.row}>
                  <div className={s.field}>
                    <label className={s.label}>ФИО главного бухгалтера</label>
                    <input className={s.input} value={form.chiefAccountant} onChange={set('chiefAccountant')} placeholder="Петрова А.И." />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Телефон главного бухгалтера</label>
                    <input className={s.input} value={form.chiefAccountantPhone} onChange={set('chiefAccountantPhone')} placeholder="+7 (900) 000-00-00" />
                  </div>
                </div>
              )}
              <div className={s.row}>
                <div className={s.field}>
                  <label className={s.label}>ФИО ответственного за ЭПУ</label>
                  <input className={s.input} value={form.responsibleEpu} onChange={set('responsibleEpu')} placeholder="Иванов А.С." />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Телефон ответственного за ЭПУ</label>
                  <input className={s.input} value={form.responsibleEpuPhone} onChange={set('responsibleEpuPhone')} placeholder="+7 (900) 000-00-00" />
                </div>
              </div>
            </section>
          </div>

          <div className={s.footer}>
            <button type="button" className={s.cancelBtn} onClick={onClose}>Отмена</button>
            <button type="submit" className={s.saveBtn}>Сохранить изменения</button>
          </div>
        </form>
      </div>
    </div>
  );
};
