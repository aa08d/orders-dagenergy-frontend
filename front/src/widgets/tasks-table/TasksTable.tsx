import { useState, useEffect, useCallback } from 'react';
import { getContracts } from '@shared/api';
import type { PaginatedContracts } from '@shared/api';
import { Icon, StatusBadge, Pagination } from '@shared/ui';
import { ContractDetailModal } from '@widgets/contracts-table/ContractDetailModal';
import { EditContractModal } from '@widgets/contracts-table/EditContractModal';
import type { Contract } from '@shared/types';
import { useAuth } from '@app/providers';
import s from '@shared/ui/DataTable.module.scss';

const PAGE_SIZE = 10;

export const TasksTable = () => {
  const { user } = useAuth();
  const isManager = user?.role === 'Менеджер' || user?.isAdmin;

  const COLUMNS = [
    { key: 'id',            label: '№',            sortable: true,  width: '70px'  },
    { key: 'name',          label: 'Наименование', sortable: true,  width: 'auto'  },
    { key: 'address',       label: 'Адрес',        sortable: false, width: '180px' },
    { key: 'consumer_type', label: 'Тип',          sortable: true,  width: '130px' },
    { key: 'status',        label: 'Статус',       sortable: true,  width: '120px' },
    ...(isManager ? [] : [{ key: 'date', label: 'Дата', sortable: true, width: '95px' } as const]),
    { key: 'responsible',   label: 'Ответственный',sortable: true,  width: '140px' },
    ...(isManager ? [{ key: 'scan', label: 'Скан', sortable: false, width: '60px' } as const] : []),
  ];

  const [data,    setData]    = useState<PaginatedContracts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [selected, setSelected] = useState<Contract | null>(null);
  const [editing,  setEditing]  = useState<Contract | null>(null);
  const [search,   setSearch]   = useState('');
  const [ordering, setOrdering] = useState('-id');
  const [page,     setPage]     = useState(1);

  const load = useCallback(() => {
    setLoading(true); setError('');
    getContracts({ tasks: '1', search: search || undefined, page, ordering })
      .then(setData).catch(e => setError(String(e))).finally(() => setLoading(false));
  }, [search, page, ordering]);

  useEffect(() => { load(); }, [load]);

  const toggleSort = (key: string) => { setOrdering(p => p === key ? `-${key}` : key); setPage(1); };

  const handleUpdated = (updated: Contract) => {
    setSelected(updated);
    setData(prev => prev ? {
      ...prev,
      results: prev.results.map(c => String(c.id) === String(updated.id) ? updated : c),
    } : prev);
    // Если статус изменился — перезагружаем список (договор уйдёт из задач)
    if (updated.status !== 'Согласование' && updated.status !== 'Новая') {
      setTimeout(load, 800);
    }
  };

  const tasks      = data?.results ?? [];
  const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 0;

  return (
    <>
      <section>
        <div className={s.toolbar}>
          <div className={s.toolbarRow}>
            <div className={s.searchWrap}>
              <span className={s.searchIcon}><Icon name="search" size={15} /></span>
              <input type="search" value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Поиск по наименованию, ответственному..." className={s.search} />
            </div>
          </div>
        </div>

        {error && <p style={{ color: 'red', padding: '8px' }}>{error}</p>}
        <div className={s.tableWrap}>
          <div className={s.tableScroll}>
            <table className={s.table}>
              <thead className={s.thead}>
                <tr>
                  {COLUMNS.map(col => {
                    const asc = ordering === col.key, desc = ordering === `-${col.key}`;
                    return (
                      <th key={col.key} scope="col"
                        onClick={col.sortable ? () => toggleSort(col.key) : undefined}
                        className={col.sortable ? s.thSortable : s.th} style={{ width: col.width }}>
                        <div className={s.thInner}>{col.label}
                          {col.sortable && (
                            <span className={(asc || desc) ? s.sortIconActive : s.sortIcon}
                              style={{ transform: desc ? 'rotate(180deg)' : undefined }}>
                              <Icon name="chevronUp" size={11} />
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={COLUMNS.length} className={s.empty}>Загрузка...</td></tr>
                ) : tasks.length === 0 ? (
                  <tr>
                    <td colSpan={COLUMNS.length} className={s.empty}>
                      {isManager ? 'Нет договоров на согласовании' : 'Нет новых задач'}
                    </td>
                  </tr>
                ) : tasks.map(row => (
                  <tr key={row.id} className={s.trClickable} onClick={() => setSelected(row)}>
                    <td className={s.tdId}>#{row.id}</td>
                    <td className={s.tdName}>{row.name}</td>
                    <td className={s.tdAddress}>{row.address}</td>
                    <td className={s.td}>{row.consumerType}</td>
                    <td className={s.td}><StatusBadge status={row.status} /></td>
                    {!isManager && <td className={s.tdDate}>{row.date}</td>}
                    <td className={s.td}>{row.responsible}</td>
                    {isManager && (
                      <td className={s.td} style={{ textAlign: 'center' }}>
                        {row.scanFile ? '📄' : '—'}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} total={data?.count ?? 0} pageSize={PAGE_SIZE} onPage={setPage} />
        </div>
      </section>

      {selected && !editing && (
        <ContractDetailModal
          contract={selected}
          onClose={() => setSelected(null)}
          onEdit={() => setEditing(selected)}
          onDelete={() => { setSelected(null); load(); }}
          onUpdated={handleUpdated}
        />
      )}
      {editing && (
        <EditContractModal contract={editing}
          onClose={() => setEditing(null)}
          onSave={() => { setEditing(null); setSelected(null); load(); }} />
      )}
    </>
  );
};
