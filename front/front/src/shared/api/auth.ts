import { api, setTokens, clearTokens } from './client';

export interface LoginResponse {
  access:  string;
  refresh: string;
  user: {
    id:           number;
    username:     string;
    name:         string;
    role:         string;
    departmentId: number | null;
    isAdmin:      boolean;
  };
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const data = await api.post<LoginResponse>('/auth/login/', { username, password });
  setTokens(data.access, data.refresh);
  return data;
}

export function logout() {
  clearTokens();
}

export function getMe() {
  return api.get<LoginResponse['user']>('/auth/me/');
}
