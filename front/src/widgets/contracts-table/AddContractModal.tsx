import { useState } from 'react';
import { useAuth } from '@app/providers';
import { DEPARTMENTS } from '@shared/mock';
import type { ConsumerType } from '@shared/types';
import s from './AddContractModal.module.scss';

interface Props {
  consumerType: ConsumerType;
  onClose: () => void;
}

const hasInnKpp = (t: ConsumerType) => t === 'Юридическое лицо' || t === 'Индивидуальный предприниматель';
const hasPassport = (t: ConsumerType) => t === 'Физическое лицо' || t === 'Частный бытовой сектор';
const hasBank = (t: ConsumerType) => t === 'Юридическое лицо' || t === 'Индивидуальный предприниматель';
const hasAccountant = (t: ConsumerType) => t === 'Юридическое лицо' || t === 'Индивидуальный предприниматель';

export const AddContractModal = ({ consumerType, onClose }: Props) => {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin ?? false;

  const defaultDept = isAdmin ? '' : (user?.departmentId ?? '');
  const [deptId, setDeptId] = useState(defaultDept);

  const [form, setForm] = useState({
    abonentName: '',
    repName: '', repPhone: '',
    address: '',
    inn: '', kpp: '',
    passportSeries: '', passportNumber: '', passportIssuedBy: '', passportIssuedDate: '',
    bankName: '', bankBik: '', bankAccount: '',
    smsPhone: '', contactPhone: '',
    consumerCategory: '',
    chiefAccountant: '', chiefAccountantPhone: '',
    responsibleEpu: '', responsibleEpuPhone: '',
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const dept = DEPARTMENTS.find(d => d.id === (isAdmin ? deptId : defaultDept));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Договор сохранён (mock)');
    onClose();
  };

  return (
    <div className={s.overlay}>
      <div className={s.modal} role="dialog" aria-modal="true">
        <div className={s.modalHead}>
          <div>
            <h2 className={s.modalTitle}>Новый договор</h2>
            <p className={s.modalSub}>{consumerType}</p>
          </div>
        </div>

        <form className={s.form} onSubmit={handleSubmit}>
          <div className={s.sections}>

            {/* Отделение */}
            <section className={s.section}>
              <h3 className={s.sectionTitle}>Отделение</h3>
              <div className={s.row}>
                {isAdmin ? (
                  <div className={s.fieldFull}>
                    <label className={s.label}>Отделение</label>
                    <select className={s.input} value={deptId} onChange={e => setDeptId(e.target.value)} required>
                      <option value="">— Выберите отделение —</option>
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

            {/* Абонент */}
            <section className={s.section}>
              <h3 className={s.sectionTitle}>Абонент</h3>
              <div className={s.row}>
                <div className={s.fieldFull}>
                  <label className={s.label}>Наименование</label>
                  <input className={s.input} value={form.abonentName} onChange={set('abonentName')} placeholder="Полное наименование" required />
                </div>
              </div>
            </section>

            {/* Представитель */}
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

            {/* Адрес */}
            <section className={s.section}>
              <h3 className={s.sectionTitle}>Адрес</h3>
              <div className={s.row}>
                <div className={s.fieldFull}>
                  <label className={s.label}>Адрес абонента</label>
                  <input className={s.input} value={form.address} onChange={set('address')} placeholder="Республика Дагестан, г. Махачкала, ул. ..." required />
                </div>
              </div>
            </section>

            {/* ИНН/КПП (ЮЛ, ИП) */}
            {hasInnKpp(consumerType) && (
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

            {/* Паспорт (ФЛ, ЧБС) */}
            {hasPassport(consumerType) && (
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
                    <input className={s.input} value={form.passportIssuedBy} onChange={set('passportIssuedBy')} placeholder="МВД по РД в г. Махачкала" />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>Дата выдачи</label>
                    <input className={s.input} type="date" value={form.passportIssuedDate} onChange={set('passportIssuedDate')} />
                  </div>
                </div>
              </section>
            )}

            {/* Банк (ЮЛ, ИП) */}
            {hasBank(consumerType) && (
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

            {/* Контакты */}
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

            {/* Категория потребителя */}
            <section className={s.section}>
              <h3 className={s.sectionTitle}>Категория потребителя</h3>
              <div className={s.row}>
                <div className={s.field}>
                  <label className={s.label}>Категория</label>
                  <select className={s.input} value={form.consumerCategory} onChange={set('consumerCategory')}>
                    <option value="">— Выберите категорию —</option>
                    <option>Прочие потребители</option>
                    <option>Население городское</option>
                    <option>Население сельское</option>
                    <option>Приравненные к городскому населению</option>
                    <option>Приравненные к сельскому населению</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Прочее */}
            <section className={s.section}>
              <h3 className={s.sectionTitle}>Прочее</h3>
              {hasAccountant(consumerType) && (
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
                  <label className={s.label}>ФИО ответственного за состояние ЭПУ</label>
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
            <button type="submit" className={s.saveBtn}>Сохранить договор</button>
          </div>
        </form>
      </div>
    </div>
  );
};
