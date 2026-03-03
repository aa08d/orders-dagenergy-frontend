import { useState } from 'react';
import { Icon } from '@shared/ui/Icon';
import { ThemeToggle } from '@features/theme-toggle';
import { useAuth } from '@app/providers';
import s from './styles.module.scss';

export const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername]   = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [touched, setTouched]     = useState({ username: false, password: false });

  const usernameError = touched.username && !username.trim() ? 'Введите имя пользователя' : '';
  const passwordError = touched.password && !password        ? 'Введите пароль'            : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ username: true, password: true });
    if (!username.trim() || !password) return;

    setLoading(true);
    setError('');

    try {
      await login(username.toLowerCase(), password);
    } catch {
      setError('Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.page}>
      <div className={s.themeToggleWrap}>
        <ThemeToggle />
      </div>

      <div className={s.card}>
        <div className={s.logo}>
          <div className={s.logoIcon}>
            <Icon name="zap" size={18} />
          </div>
          <div>
            <p className={s.logoName}>ДагЭнерджи</p>
            <p className={s.logoSub}>Управление договорами</p>
          </div>
        </div>

        <h1 className={s.title}>Вход в систему</h1>
        <p className={s.subtitle}>Введите данные для входа в аккаунт</p>

        <form className={s.form} onSubmit={handleSubmit} noValidate>
          {error && <div className={s.globalError}>{error}</div>}

          <div className={s.field}>
            <label className={s.label} htmlFor="username">Имя пользователя</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="admin"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              onBlur={() => setTouched(t => ({ ...t, username: true }))}
              className={usernameError ? s.inputError : s.input}
              aria-describedby={usernameError ? 'username-error' : undefined}
            />
            {usernameError && <span id="username-error" className={s.error}>{usernameError}</span>}
          </div>

          <div className={s.field}>
            <label className={s.label} htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              onBlur={() => setTouched(t => ({ ...t, password: true }))}
              className={passwordError ? s.inputError : s.input}
              aria-describedby={passwordError ? 'password-error' : undefined}
            />
            {passwordError && <span id="password-error" className={s.error}>{passwordError}</span>}
          </div>

          <button type="submit" className={s.submitBtn} disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
};
