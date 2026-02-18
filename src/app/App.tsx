import type { FC } from 'react';
import { Sidebar } from 'widgets/sidebar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styles from './App.module.scss';

import '../index.css'


export const App: FC = () => {
    return (
        <BrowserRouter>
            <div className={styles.app}>
                <Sidebar />
                <main className={styles.content}>
                    <Routes>
                        <Route path="/" element={<div>Dashboard</div>} />
                        <Route path="/orders" element={<div>Orders</div>} />
                        <Route path="/tasks" element={<div>Tasks</div>} />
                        <Route path="/statistics" element={<div>Statistics</div>} />
                        <Route path="/documents" element={<div>Documents</div>} />
                        <Route path="/settings" element={<div>Settings</div>} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
};
