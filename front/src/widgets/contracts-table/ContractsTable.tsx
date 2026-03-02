import { useState, useMemo } from 'react';
import { MOCK_CONTRACTS, DEPARTMENTS } from '@shared/mock';
import { Icon, StatusBadge, Pagination } from '@shared/ui';
import { useAuth } from '@app/providers';
import { ContractDetailModal } from './ContractDetailModal';
import { EditContractModal } from './EditContractModal';
import type { Contract } from '@shared/types';
import s from '@shared/ui/DataTable.module.scss';

const COLUMNS = [
  { key: 'id',               label: '№ договора',     sortable: true,  width: '120px' },
  { key: 'name',             label: 'Наименование',    sortable: true,  width: 'auto'  },
  { key: 'address',          label: 'Адрес',           sortable: false, width: '200px' },
  { key: 'consumerType',     label: 'Тип потребителя', sortable: true,  width: '150px' },
  { key: 'consumerCategory', label: 'Категория',       sortable: true,  width: '150px' },
  { key: 'status',           label: 'Статус',          sortable: true,  width: '130px' },
  { key: 'date',             label: 'Дата',            sortable: true,  width: '100px' },
] as const;

const PAGE_SIZE = 10;

export const ContractsTable = () => {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin ?? false;

  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
  const [selected,  setSelected]  = useState<Contract | null>(null);
  const [editing,   setEditing]   = useState<Contract | null>(null);

  const [search, setSearch]                 = useState('');
  const [filterType, setFilterType]         = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus]     = useState('');
  const [sortKey, setSortKey]               = useState('id');
  const [sortDir, setSortDir]               = useState<'asc' | 'desc'>('asc');
  const [page, setPage]                     = useState(1);
  const [showFilters, setShowFilters]       = useState(false);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  // Фильтрация по отделению: администратор видит всё, остальные — только своё
  const baseData = useMemo(() =>
    isAdmin
      ? contracts
      : contracts.filter(c => c.departmentId === String(user?.departmentId)),
    [isAdmin, user?.departmentId, contracts]
  );

  const filtered = useMemo(() => {
    let data = [...baseData];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(o =>
        o.name.toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)
      );
    }
    if (filterType)     data = data.filter(o => o.consumerType === filterType);
    if (filterCategory) data = data.filter(o => o.consumerCategory === filterCategory);
    if (filterStatus)   data = data.filter(o => o.status === filterStatus);
    data.sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortKey] ?? '';
      const bv = (b as Record<string, unknown>)[sortKey] ?? '';
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv), 'ru')
        : String(bv).localeCompare(String(av), 'ru');
    });
    return data;
  }, [baseData, search, filterType, filterCategory, filterStatus, sortKey, sortDir]);

  const totalPages      = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData        = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasActiveFilter = filterType || filterCategory || filterStatus;

  const handleDelete = (id: string) => {
    setContracts(prev => prev.filter(c => c.id !== id));
    setSelected(null);
  };

  const handleSave = (updated: Contract) => {
    setContracts(prev => prev.map(c => c.id === updated.id ? updated : c));
    setEditing(null);
    setSelected(updated);
  };

  return (
    <>
      <section aria-label="Таблица договоров">
        <div className={s.toolbar}>
          <div className={s.toolbarRow}>
            <div className={s.searchWrap}>
              <span aria-hidden className={s.searchIcon}>
                <Icon name="search" size={15} />
              </span>
              <input
                type="search"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Поиск по наименованию, адресу..."
                aria-label="Поиск по договорам"
                className={s.search}
              />
            </div>

            <button
              onClick={() => setShowFilters(f => !f)}
              aria-expanded={showFilters}
              aria-controls="filter-panel"
              className={showFilters ? s.filterBtnActive : s.filterBtn}
            >
              <Icon name="filter" size={13} />
              Фильтры
              {hasActiveFilter && (
                <span aria-label="Активные фильтры" className={showFilters ? s.filterDotActive : s.filterDot} />
              )}
            </button>
          </div>

          {showFilters && (
            <div id="filter-panel" role="group" aria-label="Фильтры" className={s.filterPanel}>
              <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }} className={s.select}>
                <option value="">Тип потребителя</option>
                {['Юридическое лицо', 'Индивидуальный предприниматель', 'Физическое лицо', 'Частный бытовой сектор'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>

              <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1); }} className={s.select}>
                <option value="">Категория</option>
                {['Прочие потребители', 'Население городское', 'Население сельское', 'Приравненные к городскому населению', 'Приравненные к сельскому населению'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>

              <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} className={s.select}>
                <option value="">Статус</option>
                {['Новая', 'В работе', 'Согласование', 'Завершена', 'Отклонена'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>

              {hasActiveFilter && (
                <button onClick={() => { setFilterType(''); setFilterCategory(''); setFilterStatus(''); setPage(1); }} className={s.resetBtn}>
                  Сбросить
                </button>
              )}
            </div>
          )}
        </div>

        <div className={s.tableWrap}>
          <div className={s.tableScroll}>
            <table className={s.table} aria-label="Список договоров">
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
                    <td colSpan={COLUMNS.length} className={s.empty}>Договора не найдены</td>
                  </tr>
                ) : pageData.map(row => {
                  const dept = DEPARTMENTS.find(d => d.id === row.departmentId);
                  return (
                    <tr
                      key={row.id}
                      className={s.trClickable}
                      title={dept ? dept.name : undefined}
                      onClick={() => setSelected(row)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td className={s.tdId}>{row.id}</td>
                      <td className={s.tdName}>{row.name}</td>
                      <td className={s.tdAddress}>{row.address}</td>
                      <td className={s.td}>{row.consumerType}</td>
                      <td className={s.td}>{row.consumerCategory}</td>
                      <td className={s.td}><StatusBadge status={row.status} /></td>
                      <td className={s.tdDate}>{row.date}</td>
                    </tr>
                  );
                })}
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
