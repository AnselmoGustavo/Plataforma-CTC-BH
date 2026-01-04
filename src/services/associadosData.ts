import api from "./api";

export interface AssociadoRecord {
  id: string;
  name: string;
  email: string;
  date_of_birth: string;
  membership_date: string;
  role: string;
  phoneNumber: string;
  monthly_fee: number;
  active: boolean;
}

export interface AssociadoDto {
  name: string;
  email: string;
  date_of_birth: string;
  membership_date: string;
  role: string;
  phoneNumber: string;
  monthly_fee: number;
  active: boolean;
}

export async function listAssociados() {
  const { data } = await api.get<AssociadoRecord[]>("/api/Associados");
  return data;
}

export async function getAssociadoById(id: string) {
  const { data } = await api.get<AssociadoRecord>(`/api/Associados/${id}`);
  return data;
}

export async function createAssociado(payload: AssociadoDto) {
  const { data } = await api.post<AssociadoRecord>("/api/Associados", payload);
  return data;
}

export async function updateAssociado(id: string, payload: AssociadoDto) {
  await api.put(`/api/Associados/${id}`, payload);
}

export async function deleteAssociado(id: string) {
  await api.delete(`/api/Associados/${id}`);
}
