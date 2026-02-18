import type { FC } from 'react';
import styles from './navItem.module.scss';
import { NavLink } from 'react-router-dom';


interface NavItemProps {
    href: string;
    icon: React.ReactNode;
    text: string;
}


export const NavItem: FC<NavItemProps> = ({ href, icon, text }) => {
    return (
        <li className={styles.navItem}>
            <NavLink
                to={href}
                className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ''}`
                }
                end={href === '/'}
            >
                {icon}
                <span className={styles.navLinkText}>{text}</span>
            </NavLink>
        </li>
    );
};
