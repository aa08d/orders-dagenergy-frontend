import { api } from './client';
import type { Contract } from '@shared/types';

export interface ContractFilters {
  search?:           string;
  status?:           string;
  consumer_type?:    string;
  consumer_category?: string;
  tasks?:            '1';
  page?:             number;
}

export interface PaginatedContracts {
  count:    number;
  next:     string | null;
  previous: string | null;
  results:  Contract[];
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

export function createContract(data: Partial<Contract> & { dateRaw: string; departmentId: number }): Promise<Contract> {
  return api.post<Contract>('/contracts/', data);
}

export function updateContract(id: number | string, data: Partial<Contract>): Promise<Contract> {
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
