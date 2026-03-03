import { useState, useMemo } from 'react';
import { MOCK_CONTRACTS } from '@shared/mock';
import { Icon, StatusBadge, Pagination } from '@shared/ui';
import { useAuth } from '@app/providers';
import { ContractDetailModal } from '@widgets/contracts-table/ContractDetailModal';
import { EditContractModal } from '@widgets/contracts-table/EditContractModal';
import type { Contract } from '@shared/types';
import s from '@shared/ui/DataTable.module.scss';

const COLUMNS = [
  { key: 'id',               label: '№ договора',     sortable: true,  width: '120px' },
  { key: 'name',             label: 'Наименование',    sortable: true,  width: 'auto'  },
  { key: 'address',          label: 'Адрес',           sortable: false, width: '200px' },
  { key: 'consumerType',     label: 'Тип потребителя', sortable: true,  width: '150px' },
  { key: 'consumerCategory', label: 'Категория',       sortable: true,  width: '150px' },
  { key: 'status',           label: 'Статус',          sortable: true,  width: '130px' },
  { key: 'responsible',      label: 'Ответственный',   sortable: true,  width: '140px' },
  { key: 'date',             label: 'Дата',            sortable: true,  width: '100px' },
] as const;

const PAGE_SIZE = 10;

export const TasksTable = () => {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin ?? false;

  const [tasks, setTasks]     = useState<Contract[]>(MOCK_CONTRACTS);
  const [selected, setSelected] = useState<Contract | null>(null);
  const [editing, setEditing]   = useState<Contract | null>(null);

  const [search, setSearch]   = useState('');
  const [sortKey, setSortKey] = useState('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage]       = useState(1);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  // Фильтрация по отделению: администратор видит всё, остальные — только своё
  const baseTasks = useMemo(() => {
    const active = tasks.filter(c => c.status === 'Согласование' || c.status === 'В работе');
    return isAdmin ? active : active.filter(c => c.departmentId === user?.departmentId);
  }, [isAdmin, user?.departmentId, tasks]);

  const filtered = useMemo(() => {
    let data = [...baseTasks];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(o =>
        o.name.toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.responsible.toLowerCase().includes(q)
      );
    }
    data.sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortKey] ?? '';
      const bv = (b as Record<string, unknown>)[sortKey] ?? '';
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv), 'ru')
        : String(bv).localeCompare(String(av), 'ru');
    });
    return data;
  }, [baseTasks, search, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (id: string) => {
    setTasks(prev => prev.filter(c => c.id !== id));
    setSelected(null);
  };

  const handleSave = (updated: Contract) => {
    setTasks(prev => prev.map(c => c.id === updated.id ? updated : c));
    setEditing(null);
    setSelected(updated);
  };

  return (
    <>
      <section aria-label="Задачи на согласование">
        <div className={s.toolbar}>
          <div className={s.searchWrap}>
            <span aria-hidden className={s.searchIcon}>
              <Icon name="search" size={15} />
            </span>
            <input
              type="search"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Поиск по наименованию, адресу, ответственному..."
              aria-label="Поиск задач"
              className={s.search}
            />
          </div>
        </div>

        <div className={s.tableWrap}>
          <div className={s.tableScroll}>
            <table className={s.table} aria-label="Задачи на согласование">
              <thead className={s.thead}>
                <tr>
                  {COLUMNS.map(col => (
                    <th
                      key={col.key}
                      scope="col"
                      onClick={col.sortable ? () => handleSort(col.key) : undefined}
                      aria-sort={col.sortable && sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
                      className={col.sortable ? s.thSortable : s.th}
                      style={{ width: col.width }}
                    >
                      <div className={s.thInner}>
                        {col.label}
                        {col.sortable && (
                          <span aria-hidden className={sortKey === col.key ? s.sortIconActive : s.sortIcon}>
                            <Icon name="chevronUp" size={11} />
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageData.length === 0 ? (
                  <tr>
                    <td colSpan={COLUMNS.length} className={s.empty}>Задачи не найдены</td>
                  </tr>
                ) : pageData.map(row => (
                  <tr
                    key={row.id}
                    className={s.trClickable}
                    onClick={() => setSelected(row)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className={s.tdId}>{row.id}</td>
                    <td className={s.tdName}>{row.name}</td>
                    <td className={s.tdAddress}>{row.address}</td>
                    <td className={s.td}>{row.consumerType}</td>
                    <td className={s.td}>{row.consumerCategory}</td>
                    <td className={s.td}><StatusBadge status={row.status} /></td>
                    <td className={s.tdResponsible}>{row.responsible}</td>
                    <td className={s.tdDate}>{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} total={filtered.length} pageSize={PAGE_SIZE} onPage={setPage} />
        </div>
      </section>

      {selected && !editing && (
        <ContractDetailModal
          contract={selected}
          onClose={() => setSelected(null)}
          onEdit={() => setEditing(selected)}
          onDelete={() => handleDelete(selected.id)}
        />
      )}

      {editing && (
        <EditContractModal
          contract={editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
};
