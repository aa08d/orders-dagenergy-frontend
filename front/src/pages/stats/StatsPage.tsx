import { useState, useEffect } from 'react';
import { getStats } from '@shared/api';
import type { StatsData } from '@shared/api';
import type { Status } from '@shared/types';
import s from './styles.module.scss';

const STATUSES: Status[] = ['Новая','В работе','Согласование','Завершена','Отклонена'];
const STATUS_COLORS: Record<Status, string> = {
  'Новая':        '#6366f1',
  'В работе':     '#f59e0b',
  'Согласование': '#3b82f6',
  'Завершена':    '#10b981',
  'Отклонена':    '#ef4444',
};
const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь',
                'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

export const StatsPage = () => {
  const now = new Date();
  const [year,  setYear]  = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-indexed
  const [data,    setData]    = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    setLoading(true); setError('');
    getStats(year, month).then(setData).catch(e => setError(String(e))).finally(() => setLoading(false));
  }, [year, month]);

  const maxDept = Math.max(...(data?.byDept.map(d => d.total) ?? []), 1);

  return (
    <main className={s.page}>
      <div className={s.header}>
        <div>
          <h1 className={s.title}>Статистика</h1>
          <p className={s.subtitle}>Аналитика по договорам за выбранный период</p>
        </div>
        <div className={s.periodPicker}>
          <select className={s.periodSelect} value={month - 1} onChange={e => setMonth(+e.target.value + 1)}>
            {MONTHS.map((m,i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select className={s.periodSelect} value={year} onChange={e => setYear(+e.target.value)}>
            {[2024,2025,2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {loading && <p className={s.subtitle}>Загрузка...</p>}
      {error   && <p className={s.subtitle} style={{color:'red'}}>Ошибка: {error}</p>}

      {!loading && data && (
        <>
          <div className={s.summary}>
            <div className={s.summaryCard}>
              <p className={s.summaryValue}>{data.total}</p>
              <p className={s.summaryLabel}>Всего за период</p>
            </div>
            {STATUSES.map(st => (
              <div key={st} className={s.summaryCard} style={{ borderTopColor: STATUS_COLORS[st] }}>
                <p className={s.summaryValue} style={{ color: STATUS_COLORS[st] }}>{data.byStatus[st] ?? 0}</p>
                <p className={s.summaryLabel}>{st}</p>
              </div>
            ))}
          </div>

          <section className={s.chartSection}>
            <h2 className={s.chartTitle}>По отделениям</h2>
            <div className={s.deptChart}>
              {data.byDept.map(dept => (
                <div key={dept.id} className={s.deptRow}>
                  <div className={s.deptName}>{dept.name}</div>
                  <div className={s.deptBarWrap}>
                    <div className={s.deptSegments}>
                      {STATUSES.map(st => {
                        const count = dept.byStatus[st] ?? 0;
                        return count > 0 ? (
                          <div key={st} className={s.deptSegment}
                            title={`${st}: ${count}`}
                            style={{ width: `${(count / maxDept) * 100}%`, background: STATUS_COLORS[st] }} />
                        ) : null;
                      })}
                    </div>
                    <span className={s.deptTotal}>{dept.total}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className={s.legend}>
              {STATUSES.map(st => (
                <div key={st} className={s.legendItem}>
                  <span className={s.legendDot} style={{ background: STATUS_COLORS[st] }} />{st}
                </div>
              ))}
            </div>
          </section>

          <section className={s.chartSection}>
            <h2 className={s.chartTitle}>Активность сотрудников</h2>
            {data.byEmp.filter(e => e.total > 0).length === 0
              ? <p className={s.subtitle}>Нет данных за период</p>
              : (
              <div className={s.empTable}>
                <div className={s.empHeader}>
                  <div className={s.empName}>Сотрудник</div>
                  {STATUSES.map(st => <div key={st} className={s.empStat} style={{color: STATUS_COLORS[st]}}>{st}</div>)}
                  <div className={s.empStat}>Итого</div>
                </div>
                {data.byEmp.filter(e => e.total > 0).sort((a,b) => b.total - a.total).map(emp => (
                  <div key={emp.id} className={s.empRow}>
                    <div className={s.empName}>
                      <span className={s.empAvatar}>{emp.name[0]}</span>
                      <div><p className={s.empFullName}>{emp.name}</p><p className={s.empRole}>{emp.role}</p></div>
                    </div>
                    {STATUSES.map(st => (
                      <div key={st} className={s.empStat}>
                        <span className={(emp.byStatus[st]??0)>0 ? s.empCount : s.empCountZero}>{emp.byStatus[st]??0}</span>
                      </div>
                    ))}
                    <div className={s.empStat}><span className={s.empTotal}>{emp.total}</span></div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
};
