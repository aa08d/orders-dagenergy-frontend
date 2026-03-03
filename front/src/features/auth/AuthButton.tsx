import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@app/providers';
import { getDepartments } from '@shared/api';
import { Icon } from '@shared/ui';
import type { Department } from '@shared/types';
import s from './styles.module.scss';

export const AuthButton = () => {
  const { user, logout } = useAuth();
  const [open, setOpen]  = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { getDepartments().then(setDepartments).catch(() => {}); }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (!user) return null;

  const dept = !user.isAdmin
    ? departments.find(d => String(d.id) === String(user.departmentId))
    : null;

  return (
    <div className={s.wrapper} ref={ref}>
      <button onClick={() => setOpen(o => !o)} className={s.btn}>
        <div className={s.avatar}>{user.name[0]}</div>
        <div className={s.info}>
          <div className={s.name}>{user.name}</div>
          <div className={s.role}>{user.role}</div>
        </div>
        <span className={open ? s.chevronOpen : s.chevron}><Icon name="chevronUp" size={12} /></span>
      </button>

      {open && (
        <div className={s.dropdown} role="menu">
          <div className={s.dropHeader}>
            <p className={s.dropName}>{user.name}</p>
            <p className={s.dropRole}>{user.role}</p>
            {dept && <p className={s.dropDept}><Icon name="building" size={12} />{dept.name}</p>}
          </div>
          <button role="menuitem" className={s.dropItem} onClick={() => setOpen(false)}>
            <Icon name="settings" size={14} />Настройки профиля
          </button>
          <div className={s.dropDivider} />
          <button role="menuitem" className={s.dropItemDanger} onClick={() => { setOpen(false); logout(); }}>
            <Icon name="logout" size={14} />Выйти
          </button>
        </div>
      )}
    </div>
  );
};
