import { useAuth } from '@app/providers';
import { ThemeToggle } from '@features/theme-toggle';
import { AuthButton } from '@features/auth';
import s from './styles.module.scss';

export const Header = () => {
  const { user } = useAuth();

  return (
    <header className={s.header}>
      <p className={s.welcome}>
        {user ? `Добро пожаловать, ${user.name}` : 'Добро пожаловать'}
      </p>
      <div className={s.actions}>
        <ThemeToggle />
        <AuthButton />
      </div>
    </header>
  );
};
