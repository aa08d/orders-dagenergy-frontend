import { api, API_BASE } from './client';
import type { Contract, ConsumerType, ConsumerCategory, Status } from '@shared/types';

export interface ContractFilters {
  search?:            string;
  status?:            string;
  consumer_type?:     string;
  consumer_category?: string;
  tasks?:             '1';
  page?:              number;
  ordering?:          string;
}

export interface PaginatedContracts {
  count:    number;
  next:     string | null;
  previous: string | null;
  results:  Contract[];
}

export interface CreateContractPayload {
  name:                  string;
  address:               string;
  consumerType:          ConsumerType;
  consumerCategory:      ConsumerCategory;
  status:                Status;
  date:                  string;      // YYYY-MM-DD
  responsible:           string;
  departmentId:          number | null;
  representativeName?:   string;
  representativePhone?:  string;
  inn?:                  string;
  kpp?:                  string;
  passportSeries?:       string;
  passportNumber?:       string;
  passportIssuedBy?:     string;
  passportIssuedDate?:   string;
  bankName?:             string;
  bankBik?:              string;
  bankAccount?:          string;
  smsPhone?:             string;
  contactPhone?:         string;
  chiefAccountant?:      string;
  chiefAccountantPhone?: string;
  responsibleEpu?:       string;
  responsibleEpuPhone?:  string;
}

function buildQuery(filters: ContractFilters = {}): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== '') params.set(k, String(v));
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export function getContracts(filters?: ContractFilters): Promise<PaginatedContracts> {
  return api.get<PaginatedContracts>(`/contracts/${buildQuery(filters)}`);
}

export function getContract(id: number | string): Promise<Contract> {
  return api.get<Contract>(`/contracts/${id}/`);
}

export function createContract(data: CreateContractPayload): Promise<Contract> {
  return api.post<Contract>('/contracts/', data);
}

export function updateContract(id: number | string, data: Partial<CreateContractPayload>): Promise<Contract> {
  return api.patch<Contract>(`/contracts/${id}/`, data);
}

export function deleteContract(id: number | string): Promise<void> {
  return api.delete<void>(`/contracts/${id}/`);
}

export interface StatsData {
  total:    number;
  byStatus: Record<string, number>;
  byDept:   Array<{
    id:       number;
    name:     string;
    code:     string;
    total:    number;
    byStatus: Record<string, number>;
  }>;
  byEmp:    Array<{
    id:       number;
    name:     string;
    role:     string;
    total:    number;
    byStatus: Record<string, number>;
  }>;
}

export function getStats(year: number, month: number): Promise<StatsData> {
  return api.get<StatsData>(`/contracts/stats/?year=${year}&month=${month}`);
}

// ── Scan upload ───────────────────────────────────────────────────────────────
export function uploadScan(id: number | string, file: File): Promise<Contract> {
  const formData = new FormData();
  formData.append('scan', file);

  // multipart — не через api.post (он ставит application/json)
  const token = localStorage.getItem('access_token');
  return fetch(`${API_BASE}/contracts/${id}/upload-scan/`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  }).then(async r => {
    if (!r.ok) throw new Error(await r.text());
    return r.json() as Promise<Contract>;
  });
}

// ── Approve ───────────────────────────────────────────────────────────────────
export function approveContract(id: number | string): Promise<Contract> {
  return api.post<Contract>(`/contracts/${id}/approve/`, {});
}

// ── Reject ────────────────────────────────────────────────────────────────────
export function rejectContract(id: number | string, reason: string): Promise<Contract> {
  return api.post<Contract>(`/contracts/${id}/reject/`, { reason });
}
