import { TasksTable } from '@widgets/tasks-table';
import { useAuth } from '@app/providers';
import s from './styles.module.scss';

export const TasksPage = () => {
  const { user } = useAuth();
  const isManager = user?.role === 'Менеджер' || user?.isAdmin;

  return (
    <main className={s.page}>
      <div className={s.header}>
        <h1 className={s.title}>Задачи</h1>
        <p className={s.subtitle}>
          {isManager
            ? 'Договора на согласовании — проверьте скан и примите решение'
            : 'Новые договора — распечатайте, подпишите и отправьте на согласование'}
        </p>
      </div>
      <TasksTable />
    </main>
  );
};
