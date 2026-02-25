import s from './StatusBadge.module.scss';

interface StatusBadgeProps {
  status: string;
}

const STATUS_CLASS: Record<string, keyof typeof s> = {
  'Новая':        'new',
  'В работе':     'inwork',
  'Согласование': 'approval',
  'Завершена':    'done',
  'Отклонена':    'rejected',
};

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <span className={s[STATUS_CLASS[status] ?? 'new']}>
    {status}
  </span>
);
