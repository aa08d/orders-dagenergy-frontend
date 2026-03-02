import type { Contract, Department, Employee, Status, ConsumerType, ConsumerCategory } from '@shared/types';

export const DEPARTMENTS: Department[] = [
  { id: 'd1', name: 'Махачкалинское отделение',  code: '001' },
  { id: 'd2', name: 'Дербентское отделение',      code: '002' },
  { id: 'd3', name: 'Каспийское отделение',        code: '003' },
  { id: 'd4', name: 'Хасавюртовское отделение',    code: '004' },
];

export const EMPLOYEES: Employee[] = [
  { id: 'u1', username: 'admin',   password: 'admin123',   name: 'Джамалудин Алисултанов', role: 'Администратор', departmentId: 'd1' },
  { id: 'u2', username: 'manager', password: 'manager123', name: 'Анна Смирнова',           role: 'Менеджер',      departmentId: 'd1' },
  { id: 'u3', username: 'ivanov',  password: 'ivanov123',  name: 'Иванов П.С.',             role: 'Менеджер',      departmentId: 'd2' },
  { id: 'u4', username: 'kozlova', password: 'kozlova123', name: 'Козлова Е.В.',            role: 'Специалист',    departmentId: 'd2' },
  { id: 'u5', username: 'novikov', password: 'novikov123', name: 'Новиков Д.М.',            role: 'Специалист',    departmentId: 'd3' },
  { id: 'u6', username: 'petrov',  password: 'petrov123',  name: 'Петров К.О.',             role: 'Менеджер',      departmentId: 'd3' },
  { id: 'u7', username: 'sidorov', password: 'sidorov123', name: 'Сидоров А.Н.',            role: 'Специалист',    departmentId: 'd4' },
];

const NAMES = [
  'ООО «ЭнергоСтрой»',
  'АО «Промышленные решения»',
  'ИП Васильев А.В.',
  'ПАО «ТехноГрупп»',
  'ООО «СтройКомплекс»',
  'АО «МегаПром»',
  'ИП Кузнецова М.Н.',
  'ООО «АльфаЭнерго»',
  'Гаджиев Р.М.',
  'Мусаева З.К.',
];

const ADDRESSES = [
  'ул. Ленина, 42, Махачкала',
  'пр. Победы, 18, Дербент',
  'ул. Садовая, 7, Каспийск',
  'ул. Гагарина, 33, Хасавюрт',
  'пр. Мира, 15, Каспийск',
  'ул. Советская, 9, Махачкала',
  'ул. Кирова, 22, Дербент',
  'пр. Ленина, 55, Хасавюрт',
];

const RESPONSIBLE = [
  'Анна Смирнова',
  'Иванов П.С.',
  'Козлова Е.В.',
  'Новиков Д.М.',
  'Петров К.О.',
  'Сидоров А.Н.',
];

const STATUSES: Status[] = ['Новая', 'В работе', 'Согласование', 'Завершена', 'Отклонена'];

const TYPES: ConsumerType[] = [
  'Юридическое лицо',
  'Индивидуальный предприниматель',
  'Физическое лицо',
  'Частный бытовой сектор',
];

const CATEGORIES: ConsumerCategory[] = [
  'Прочие потребители',
  'Население городское',
  'Население сельское',
  'Приравненные к городскому населению',
  'Приравненные к сельскому населению',
];

const DEPT_IDS = DEPARTMENTS.map(d => d.id);

export const MOCK_CONTRACTS: Contract[] = Array.from({ length: 47 }, (_, i) => ({
  id: `ДОГ-${String(i + 1).padStart(4, '0')}`,
  name: NAMES[i % NAMES.length],
  address: ADDRESSES[i % ADDRESSES.length],
  consumerType: TYPES[i % TYPES.length],
  consumerCategory: CATEGORIES[i % CATEGORIES.length],
  status: STATUSES[i % STATUSES.length],
  date: new Date(2025, Math.floor(i / 4), (i % 28) + 1)
    .toLocaleDateString('ru-RU')
    .replaceAll('/', '.'),
  responsible: RESPONSIBLE[i % RESPONSIBLE.length],
  departmentId: DEPT_IDS[i % DEPT_IDS.length],
  createdBy: ['u2', 'u3', 'u4', 'u5', 'u6', 'u7'][i % 6],
}));
