export interface AppTheme {
  bg: string;
  bgSidebar: string;
  bgHover: string;
  bgActive: string;
  bgTable: string;
  bgTableHead: string;
  bgTableRowHover: string;
  bgPagination: string;
  bgInput: string;
  bgFilterPanel: string;
  border: string;
  borderInput: string;
  text: string;
  textSub: string;
  textMuted: string;
  textPlaceholder: string;
  accent: string;
  accentText: string;
  logoText: string;
  toggleBg: string;
  toggleColor: string;
  scrollThumb: string;
  statusStyles: Record<string, { bg: string; color: string }>;
}

export const LIGHT_THEME: AppTheme = {
  bg: '#ffffff',
  bgSidebar: '#f7f7f5',
  bgHover: '#ebebea',
  bgActive: '#ebebea',
  bgTable: '#ffffff',
  bgTableHead: '#f7f7f5',
  bgTableRowHover: '#fafaf8',
  bgPagination: '#fafaf8',
  bgInput: '#ffffff',
  bgFilterPanel: '#f7f7f5',
  border: '#e8e8e5',
  borderInput: '#e0e0db',
  text: '#1a1a1a',
  textSub: '#6b6b6b',
  textMuted: '#9b9b9b',
  textPlaceholder: '#b0b0aa',
  accent: '#1a1a1a',
  accentText: '#ffffff',
  logoText: '#f0c040',
  toggleBg: '#f0f0ee',
  toggleColor: '#6b6b6b',
  scrollThumb: '#d5d5d0',
  statusStyles: {
    'Новая':        { bg: '#f0f0f0', color: '#555' },
    'В работе':     { bg: '#e8f4fd', color: '#1a7bc4' },
    'Согласование': { bg: '#fff8e6', color: '#b07d00' },
    'Завершена':    { bg: '#edfaf1', color: '#1e8a45' },
    'Отклонена':    { bg: '#fdecea', color: '#c0392b' },
  },
};

export const DARK_THEME: AppTheme = {
  bg: '#191919',
  bgSidebar: '#111111',
  bgHover: '#2a2a2a',
  bgActive: '#2a2a2a',
  bgTable: '#1e1e1e',
  bgTableHead: '#161616',
  bgTableRowHover: '#252525',
  bgPagination: '#161616',
  bgInput: '#242424',
  bgFilterPanel: '#161616',
  border: '#2e2e2e',
  borderInput: '#333333',
  text: '#e8e8e8',
  textSub: '#a0a0a0',
  textMuted: '#666666',
  textPlaceholder: '#555555',
  accent: '#e8e8e8',
  accentText: '#191919',
  logoText: '#f0c040',
  toggleBg: '#2a2a2a',
  toggleColor: '#a0a0a0',
  scrollThumb: '#3a3a3a',
  statusStyles: {
    'Новая':        { bg: '#2a2a2a', color: '#aaa' },
    'В работе':     { bg: '#1a2d3d', color: '#5aaedc' },
    'Согласование': { bg: '#2d2500', color: '#d4a82a' },
    'Завершена':    { bg: '#152d1e', color: '#4bc47a' },
    'Отклонена':    { bg: '#2d1515', color: '#e06060' },
  },
};

