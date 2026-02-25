import { TasksTable } from '@widgets/tasks-table';
import s from './styles.module.scss';

export const TasksPage = () => (
  <main className={s.page}>
    <div className={s.header}>
      <h1 className={s.title}>Задачи</h1>
      <p className={s.subtitle}>Договора, требующие согласования</p>
    </div>
    <TasksTable />
  </main>
);
