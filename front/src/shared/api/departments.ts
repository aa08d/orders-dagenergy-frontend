import { api } from './client';
import type { Department } from '@shared/types';

export function getDepartments(): Promise<Department[]> {
  return api.get<Department[] | { results: Department[] }>('/departments/').then(res => {
    // Guard: if pagination is on globally, unwrap results
    if (Array.isArray(res)) return res;
    if (res && Array.isArray((res as { results: Department[] }).results)) return (res as { results: Department[] }).results;
    return [];
  });
}
