import { useTheme } from '@app/providers';
import { Icon } from '@shared/ui/Icon';
import s from './styles.module.scss';

export const ThemeToggle = () => {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      title={isDark ? 'Светлая тема' : 'Тёмная тема'}
      aria-label={isDark ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'}
      className={s.btn}
    >
      <Icon name={isDark ? 'sun' : 'moon'} size={15} />
    </button>
  );
};
