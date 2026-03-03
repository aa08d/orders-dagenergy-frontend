import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, AuthProvider, useAuth } from '@app/providers';
import { Sidebar } from '@widgets/sidebar';
import { Header } from '@widgets/header';
import { ContractsPage } from '@pages/contracts';
import { TasksPage } from '@pages/tasks';
import { StatsPage } from '@pages/stats';
import { StubPage } from '@pages/home';
import { LoginPage } from '@pages/login';
import s from './styles.module.scss';

const AppLayout = () => {
  return (
    <div className={s.layout}>
      <Sidebar />
      <div className={s.content}>
        <Header />
        <Routes>
          <Route path="/"          element={<Navigate to="/contracts" replace />} />
          <Route path="/contracts" element={<ContractsPage />} />
          <Route path="/tasks"     element={<TasksPage />} />
          <Route path="/stats"     element={<StatsPage />} />
          <Route path="/docs"      element={<StubPage />} />
          <Route path="/settings"  element={<StubPage />} />
        </Routes>
      </div>
    </div>
  );
};

const AuthGate = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <LoginPage />;
  return <AppLayout />;
};

export const AppRouter = () => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);
