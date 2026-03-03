import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { getContracts, deleteContract } from '@shared/api';
import type { PaginatedContracts } from '@shared/api';
import { Icon, StatusBadge, Pagination } from '@shared/ui';
import { ContractDetailModal } from './ContractDetailModal';
import { EditContractModal } from './EditContractModal';
import type { Contract } from '@shared/types';
import s from '@shared/ui/DataTable.module.scss';

const COLUMNS = [
  { key: 'id',                label: '№',            sortable: true,  width: '70px'  },
  { key: 'name',              label: 'Наименование', sortable: true,  width: 'auto'  },
  { key: 'address',           label: 'Адрес',        sortable: false, width: '180px' },
  { key: 'consumer_type',     label: 'Тип',          sortable: true,  width: '130px' },
  { key: 'consumer_category', label: 'Категория',    sortable: true,  width: '130px' },
  { key: 'status',            label: 'Статус',       sortable: true,  width: '120px' },
  { key: 'date',              label: 'Дата',         sortable: true,  width: '95px'  },
] as const;

const PAGE_SIZE = 10;

export interface ContractsTableHandle { reload: () => void; }

export const ContractsTable = forwardRef<ContractsTableHandle>((_, ref) => {
  const [data,     setData]     = useState<PaginatedContracts | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [selected, setSelected] = useState<Contract | null>(null);
  const [editing,  setEditing]  = useState<Contract | null>(null);

  const [search,         setSearch]         = useState('');
  const [filterType,     setFilterType]     = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus,   setFilterStatus]   = useState('');
  const [ordering,       setOrdering]       = useState('-id');
  const [page,           setPage]           = useState(1);
  const [showFilters,    setShowFilters]    = useState(false);

  const load = useCallback(() => {
    setLoading(true); setError('');
    getContracts({
      search:            search     || undefined,
      status:            filterStatus   || undefined,
      consumer_type:     filterType     || undefined,
      consumer_category: filterCategory || undefined,
      page, ordering,
    }).then(setData).catch(e => setError(String(e))).finally(() => setLoading(false));
  }, [search, filterStatus, filterType, filterCategory, page, ordering]);

  useEffect(() => { load(); }, [load]);
  useImperativeHandle(ref, () => ({ reload: load }), [load]);

  const toggleSort = (key: string) => { setOrdering(p => p === key ? `-${key}` : key); setPage(1); };

  const handleDelete = async (id: string | number) => {
    if (!confirm('Удалить договор?')) return;
    await deleteContract(id);
    setSelected(null);
    load();
  };

  // Когда договор обновился (скан загружен / согласован / отклонён) — обновляем в списке
  const handleUpdated = (updated: Contract) => {
    setSelected(updated);
    setData(prev => prev ? {
      ...prev,
      results: prev.results.map(c => String(c.id) === String(updated.id) ? updated : c),
    } : prev);
  };

  const contracts  = data?.results ?? [];
  const totalPages = data ? Math.ceil(data.count / PAGE_SIZE) : 0;
  const hasFilter  = filterType || filterCategory || filterStatus;

  return (
    <>
      <section>
        <div className={s.toolbar}>
          <div className={s.toolbarRow}>
            <div className={s.searchWrap}>
              <span className={s.searchIcon}><Icon name="search" size={15} /></span>
              <input type="search" value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Поиск по наименованию, адресу..." className={s.search} />
            </div>
            <button onClick={() => setShowFilters(f => !f)} className={showFilters ? s.filterBtnActive : s.filterBtn}>
              <Icon name="filter" size={13} /> Фильтры
              {hasFilter && <span className={s.filterDot} />}
            </button>
          </div>
          {showFilters && (
            <div className={s.filterPanel}>
              <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }} className={s.select}>
                <option value="">Тип потребителя</option>
                {['Юридическое лицо','Индивидуальный предприниматель','Физическое лицо','Частный бытовой сектор'].map(v => <option key={v}>{v}</option>)}
              </select>
              <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1); }} className={s.select}>
                <option value="">Категория</option>
                {['Прочие потребители','Население городское','Население сельское','Приравненные к городскому населению','Приравненные к сельскому населению'].map(v => <option key={v}>{v}</option>)}
              </select>
              <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} className={s.select}>
                <option value="">Статус</option>
                {['Новая','В работе','Согласование','Завершена','Отклонена'].map(v => <option key={v}>{v}</option>)}
              </select>
              {hasFilter && <button onClick={() => { setFilterType(''); setFilterCategory(''); setFilterStatus(''); setPage(1); }} className={s.resetBtn}>Сбросить</button>}
            </div>
          )}
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
                ) : contracts.length === 0 ? (
                  <tr><td colSpan={COLUMNS.length} className={s.empty}>Договора не найдены</td></tr>
                ) : contracts.map(row => (
                  <tr key={row.id} className={s.trClickable} onClick={() => setSelected(row)}>
                    <td className={s.tdId}>#{row.id}</td>
                    <td className={s.tdName}>{row.name}</td>
                    <td className={s.tdAddress}>{row.address}</td>
                    <td className={s.td}>{row.consumerType}</td>
                    <td className={s.td}>{row.consumerCategory}</td>
                    <td className={s.td}><StatusBadge status={row.status} /></td>
                    <td className={s.tdDate}>{row.date}</td>
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
          onDelete={() => handleDelete(selected.id)}
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
});

ContractsTable.displayName = 'ContractsTable';
