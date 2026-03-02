import { NavLink, useLocation } from 'react-router-dom';
import { Icon } from '@shared/ui/Icon';
import { NAV_ITEMS } from '@shared/config';
import { useAuth } from '@app/providers';
import s from './styles.module.scss';

export const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.isAdmin ?? false;

  const visibleItems = NAV_ITEMS.filter(item => !item.adminOnly || isAdmin);

  return (
    <aside className={s.sidebar}>
      <div className={s.brand}>
        <div aria-hidden className={s.logoIcon}>
          <Icon name="zap" size={16} />
        </div>
        <div>
          <p className={s.brandName}>ДагЭнерджи</p>
          <p className={s.brandSub}>Управление договорами</p>
        </div>
      </div>

      <nav aria-label="Основная навигация" className={s.nav}>
        <ul className={s.navList}>
          {visibleItems.map(item => {
            const isActive =
              location.pathname === item.path ||
              (location.pathname.length > 1 && location.pathname.startsWith(item.path));
            return (
              <li key={item.id} className={s.navItem}>
                <NavLink
                  to={item.path}
                  aria-current={isActive ? 'page' : undefined}
                  className={isActive ? s.navLinkActive : s.navLink}
                >
                  <span aria-hidden className={isActive ? s.navIconActive : s.navIcon}>
                    <Icon name={item.icon} size={15} />
                  </span>
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <footer className={s.footer}>v1.0.0 · ДагЭнерджи</footer>
    </aside>
  );
};
