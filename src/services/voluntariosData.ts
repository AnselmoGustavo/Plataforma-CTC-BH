import api from "./api";

export interface VoluntarioRecord {
  id: string;
  name: string;
  email: string;
  date_of_birth: string;
  phoneNumber: string;
}

export interface VoluntarioDto {
  name: string;
  email: string;
  date_of_birth: string;
  phoneNumber: string;
}

export async function listVoluntarios() {
  const { data } = await api.get<VoluntarioRecord[]>("/api/Voluntarios");
  return data;
}

export async function getVoluntarioById(id: string) {
  const { data } = await api.get<VoluntarioRecord>(`/api/Voluntarios/${id}`);
  return data;
}

export async function createVoluntario(payload: VoluntarioDto) {
  const { data } = await api.post<VoluntarioRecord>("/api/Voluntarios", payload);
  return data;
}

export async function updateVoluntario(id: string, payload: VoluntarioDto) {
  await api.put(`/api/Voluntarios/${id}`, payload);
}

export async function deleteVoluntario(id: string) {
  await api.delete(`/api/Voluntarios/${id}`);
}
