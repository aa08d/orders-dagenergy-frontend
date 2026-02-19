import type { FC } from 'react';
import styles from "./header.module.scss";


export const Header: FC = () => {
    const title = (
        <h2 className={styles.headerTitle}>
            Добро пожаловать!
        </h2>
    );

    const login = (
        <div className={styles.login}>
            <svg width="800px" height="800px" viewBox="0 0 16 16">
                <path
                    d="M29.991,8a4,4,0,1,1,4-4A4,4,0,0,1,29.991,8Zm0-7a3,3,0,1,0,3,3A3,3,0,0,0,29.991,1ZM36.5,16h-13A1.5,1.5,0,0,1,22,14.5,4.505,4.505,0,0,1,26.5,10h7A4.505,4.505,0,0,1,38,14.5,1.5,1.5,0,0,1,36.5,16Zm-10-5A3.5,3.5,0,0,0,23,14.5a.5.5,0,0,0,.5.5h13a.5.5,0,0,0,.5-.5A3.5,3.5,0,0,0,33.5,11Z"
                    transform="translate(-22)"
                    fill="currentColor"
                />
            </svg>
            <span className={styles.loginText}>
                Войти
            </span>
        </div>
    );

    return (
        <header className={styles.header}>
            {title}
            {login}
        </header>
    );
}
