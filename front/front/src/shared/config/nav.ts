export const NAV_ITEMS = [
  { id: 'contracts', label: 'Договора',   icon: 'file',     path: '/contracts', adminOnly: false },
  { id: 'tasks',     label: 'Задачи',     icon: 'task',     path: '/tasks',     adminOnly: false },
  { id: 'stats',     label: 'Статистика', icon: 'chart',    path: '/stats',     adminOnly: true  },
  { id: 'docs',      label: 'Документы',  icon: 'doc',      path: '/docs',      adminOnly: false },
  { id: 'settings',  label: 'Настройки',  icon: 'settings', path: '/settings',  adminOnly: false },
] as const;

export type NavId = typeof NAV_ITEMS[number]['id'];
