import type { FC } from 'react';
import { NavItem } from "shared/ui/navItem";
import { NAV_ITEMS } from "shared/consts";

import styles from './sidebar.module.scss'

export const Sidebar: FC = () => {
    const logo = (
        <h1 className={styles.sidebarTitle}>ДагЭнерджи</h1>
    )

    const navigation = (
        <nav className={styles.nav}>
            <ul className={styles.navList}>
                {NAV_ITEMS.map((item) => (
                    <NavItem
                        key={item.href}
                        href={item.href}
                        icon={item.icon}
                        text={item.text}
                    />
                ))}
            </ul>
        </nav>
    );

    return (
        <aside className={styles.sidebar}>
            {logo}
            {navigation}
        </aside>
    )
}
