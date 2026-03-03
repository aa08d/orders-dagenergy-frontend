import { Icon } from './Icon';
import s from './Pagination.module.scss';

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPage: (p: number) => void;
}

export const Pagination = ({ page, totalPages, total, pageSize, onPage }: PaginationProps) => {
  const pages: number[] = [];
  const count = Math.min(5, totalPages);
  let start = 1;
  if (totalPages > 5) {
    if (page <= 3) start = 1;
    else if (page >= totalPages - 2) start = totalPages - 4;
    else start = page - 2;
  }
  for (let i = 0; i < count; i++) pages.push(start + i);

  return (
    <div className={s.pagination}>
      <span className={s.info}>
        Показано {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} из {total}
      </span>
      <nav aria-label="Пагинация" className={s.nav}>
        <button onClick={() => onPage(page - 1)} disabled={page === 1} aria-label="Предыдущая страница" className={s.btn}>
          <Icon name="chevronLeft" size={14} />
        </button>
        {pages.map(p => (
          <button key={p} onClick={() => onPage(p)} aria-label={`Страница ${p}`} aria-current={page === p ? 'page' : undefined} className={page === p ? s.btnActive : s.btn}>
            {p}
          </button>
        ))}
        <button onClick={() => onPage(page + 1)} disabled={page === totalPages} aria-label="Следующая страница" className={s.btn}>
          <Icon name="chevronRight" size={14} />
        </button>
      </nav>
    </div>
  );
};
