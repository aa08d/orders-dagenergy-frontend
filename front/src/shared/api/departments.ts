import { api } from './client';
import type { Department } from '@shared/types';

export function getDepartments(): Promise<Department[]> {
  return api.get<Department[]>('/departments/');
}
