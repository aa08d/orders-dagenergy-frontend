import { useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '@shared/config';
import s from './styles.module.scss';

export const StubPage = () => {
  const location = useLocation();
  const navItem = NAV_ITEMS.find(n => n.path === location.pathname);

  return (
    <main className={s.page}>
      <p className={s.icon}>🔧</p>
      <p className={s.label}>{navItem?.label ?? 'Раздел'}</p>
      <p className={s.hint}>Раздел в разработке</p>
    </main>
  );
};
