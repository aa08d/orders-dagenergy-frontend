import type { FC } from 'react';
import styles from './navItem.module.scss';
import { NavLink, useLocation } from 'react-router-dom';


interface NavItemProps {
    href: string;
    icon: React.ReactNode;
    text: string;
}

export const NavItem: FC<NavItemProps> = ({
        href,
        icon,
    }) => (
    <li className={styles.navItem}>
        <a href={href} className={`${styles.navLink} ${isActive ? styles.active : ''}`}>
            {icon}
            <span className={styles.navLinkText}>{text}</span>
        </a>
    </li>
);
