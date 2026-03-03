import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, AuthProvider, useAuth } from '@app/providers';
import { Sidebar } from '@widgets/sidebar';
import { Header } from '@widgets/header';
import { ContractsPage } from '@pages/contracts';
import { TasksPage } from '@pages/tasks';
import { StatsPage } from '@pages/stats';
import { StubPage } from '@pages/home';
import { LoginPage } from '@pages/login';
import type { User } from '@app/providers';
import s from './styles.module.scss';

const AppLayout = () => {
  const { user } = useAuth();

  return (
    <div className={s.layout}>
      <Sidebar />
      <div className={s.content}>
        <Header />
        <Routes>
          <Route path="/"          element={<Navigate to="/contracts" replace />} />
          <Route path="/contracts" element={<ContractsPage />} />
          <Route path="/tasks"     element={<TasksPage />} />
          {user?.isAdmin && <Route path="/stats" element={<StatsPage />} />}
          <Route path="/docs"      element={<StubPage />} />
          <Route path="/settings"  element={<StubPage />} />
        </Routes>
      </div>
    </div>
  );
};

const AuthGate = () => {
  const { user, login } = useAuth();

  if (!user) {
    const handleLogin = (u: User) => login(u);
    return <LoginPage onLogin={handleLogin} />;
  }

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
