export type Status = 'Новая' | 'В работе' | 'Согласование' | 'Завершена' | 'Отклонена';

export type ConsumerType =
  | 'Юридическое лицо'
  | 'Индивидуальный предприниматель'
  | 'Физическое лицо'
  | 'Частный бытовой сектор';

export type ConsumerCategory =
  | 'Прочие потребители'
  | 'Население городское'
  | 'Население сельское'
  | 'Приравненные к городскому населению'
  | 'Приравненные к сельскому населению';

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  departmentId: string;
  username: string;
  password: string;
}

export interface Contract {
  [key: string]: unknown;
  id: string;
  name: string;
  address: string;
  consumerType: ConsumerType;
  consumerCategory: ConsumerCategory;
  status: Status;
  date: string;
  responsible: string;
  departmentId: string;
  // Part 3 – representative
  representativeName?: string;
  representativePhone?: string;
  // Part 5 – INN/KPP (ЮЛ, ИП)
  inn?: string;
  kpp?: string;
  // Part 6 – Passport (ФЛ, ЧБС)
  passportSeries?: string;
  passportNumber?: string;
  passportIssuedBy?: string;
  passportIssuedDate?: string;
  // Part 7 – Bank (ЮЛ, ИП)
  bankName?: string;
  bankBik?: string;
  bankAccount?: string;
  // Part 8 – Contacts
  smsPhone?: string;
  contactPhone?: string;
  // Part 10 – Other
  chiefAccountant?: string;
  chiefAccountantPhone?: string;
  responsibleEpu?: string;
  responsibleEpuPhone?: string;
  // Meta
  createdBy?: string; // employee id
}

export type Theme = 'light' | 'dark';
