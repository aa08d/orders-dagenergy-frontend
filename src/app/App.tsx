import type { FC } from 'react';
import { Sidebar } from 'widgets/sidebar';
import { Header } from 'widgets/header';
import { ComingSoon } from "pages/comingSoon";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styles from './App.module.scss';

import '../index.css'


export const App: FC = () => {
    return (
        <BrowserRouter>
            <div className={styles.app}>
                <Sidebar />
                <div className={styles.right}>
                    <Header />
                    <main className={styles.content}>
                        <Routes>
                            <Route path="/" element={<ComingSoon />} />
                            <Route path="/orders" element={<div>Orders</div>} />
                            <Route path="/tasks" element={<ComingSoon />} />
                            <Route path="/statistics" element={<ComingSoon />} />
                            <Route path="/documents" element={<ComingSoon />} />
                            <Route path="/settings" element={<ComingSoon />} />
                        </Routes>
                    </main>
                </div>
            </div>
        </BrowserRouter>
    );
};
