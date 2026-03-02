import { useState, useMemo } from 'react';
import { MOCK_CONTRACTS, DEPARTMENTS, EMPLOYEES } from '@shared/mock';
import type { Status } from '@shared/types';
import s from './styles.module.scss';

const STATUSES: Status[] = ['Новая', 'В работе', 'Согласование', 'Завершена', 'Отклонена'];
const STATUS_COLORS: Record<Status, string> = {
  'Новая':        '#6366f1',
  'В работе':     '#f59e0b',
  'Согласование': '#3b82f6',
  'Завершена':    '#10b981',
  'Отклонена':    '#ef4444',
};

function getMonthRange(date: Date) {
  return {
    start: new Date(date.getFullYear(), date.getMonth(), 1),
    end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
  };
}

function parseDate(str: string) {
  const [d, m, y] = str.split('.');
  return new Date(+y, +m - 1, +d);
}

export const StatsPage = () => {
  const now = new Date();
  const [year, setYear]   = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-indexed

  const { start, end } = useMemo(() => getMonthRange(new Date(year, month)), [year, month]);

  const periodContracts = useMemo(() =>
    MOCK_CONTRACTS.filter(c => {
      const d = parseDate(c.date);
      return d >= start && d <= end;
    }),
    [start, end]
  );

  // Status totals
  const statusTotals = useMemo(() =>
    STATUSES.map(st => ({ status: st, count: periodContracts.filter(c => c.status === st).length })),
    [periodContracts]
  );
  const maxStatus = Math.max(...statusTotals.map(x => x.count), 1);

  // By department
  const deptStats = useMemo(() =>
    DEPARTMENTS.map(dept => ({
      dept,
      total: periodContracts.filter(c => c.departmentId === dept.id).length,
      byStatus: STATUSES.map(st => ({
        status: st,
        count: periodContracts.filter(c => c.departmentId === dept.id && c.status === st).length,
      })),
    })),
    [periodContracts]
  );
  const maxDept = Math.max(...deptStats.map(d => d.total), 1);

  // By employee
  const empStats = useMemo(() =>
    EMPLOYEES.filter(e => e.role !== 'Администратор').map(emp => ({
      emp,
      byStatus: STATUSES.map(st => ({
        status: st,
        count: periodContracts.filter(c => c.responsible === emp.name && c.status === st).length,
      })),
      total: periodContracts.filter(c => c.responsible === emp.name).length,
    })).sort((a, b) => b.total - a.total),
    [periodContracts]
  );

  const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

  return (
    <main className={s.page}>
      <div className={s.header}>
        <div>
          <h1 className={s.title}>Статистика</h1>
          <p className={s.subtitle}>Аналитика по договорам за выбранный период</p>
        </div>
        <div className={s.periodPicker}>
          <select className={s.periodSelect} value={month} onChange={e => setMonth(+e.target.value)}>
            {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select className={s.periodSelect} value={year} onChange={e => setYear(+e.target.value)}>
            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className={s.summary}>
        <div className={s.summaryCard}>
          <p className={s.summaryValue}>{periodContracts.length}</p>
          <p className={s.summaryLabel}>Всего договоров за период</p>
        </div>
        {STATUSES.map(st => (
          <div key={st} className={s.summaryCard} style={{ borderTopColor: STATUS_COLORS[st] }}>
            <p className={s.summaryValue} style={{ color: STATUS_COLORS[st] }}>
              {periodContracts.filter(c => c.status === st).length}
            </p>
            <p className={s.summaryLabel}>{st}</p>
          </div>
        ))}
      </div>

      {/* Chart: by department */}
      <section className={s.chartSection}>
        <h2 className={s.chartTitle}>Договора по отделениям</h2>
        <div className={s.deptChart}>
          {deptStats.map(({ dept, total, byStatus }) => (
            <div key={dept.id} className={s.deptRow}>
              <div className={s.deptName}>{dept.name}</div>
              <div className={s.deptBarWrap}>
                <div className={s.deptSegments}>
                  {byStatus.map(({ status, count }) =>
                    count > 0 ? (
                      <div
                        key={status}
                        className={s.deptSegment}
                        title={`${status}: ${count}`}
                        style={{
                          width: `${(count / maxDept) * 100}%`,
                          background: STATUS_COLORS[status as Status],
                        }}
                      />
                    ) : null
                  )}
                </div>
                <span className={s.deptTotal}>{total}</span>
              </div>
            </div>
          ))}
        </div>
        <div className={s.legend}>
          {STATUSES.map(st => (
            <div key={st} className={s.legendItem}>
              <span className={s.legendDot} style={{ background: STATUS_COLORS[st] }} />
              {st}
            </div>
          ))}
        </div>
      </section>

      {/* Table: by employee */}
      <section className={s.chartSection}>
        <h2 className={s.chartTitle}>Активность сотрудников</h2>
        <div className={s.empTable}>
          <div className={s.empHeader}>
            <div className={s.empName}>Сотрудник</div>
            {STATUSES.map(st => (
              <div key={st} className={s.empStat} style={{ color: STATUS_COLORS[st] }}>{st}</div>
            ))}
            <div className={s.empStat}>Итого</div>
          </div>
          {empStats.map(({ emp, byStatus, total }) => (
            <div key={emp.id} className={s.empRow}>
              <div className={s.empName}>
                <span className={s.empAvatar}>{emp.name[0]}</span>
                <div>
                  <p className={s.empFullName}>{emp.name}</p>
                  <p className={s.empRole}>{emp.role}</p>
                </div>
              </div>
              {byStatus.map(({ status, count }) => (
                <div key={status} className={s.empStat}>
                  <span className={count > 0 ? s.empCount : s.empCountZero}>{count}</span>
                </div>
              ))}
              <div className={s.empStat}>
                <span className={s.empTotal}>{total}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
