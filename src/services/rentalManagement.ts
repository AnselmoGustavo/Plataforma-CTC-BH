import api from "./api";

export interface VeiculoLocacao {
  id: number;
  nomeParceiro: string;
  espaco: string;
  dataEntrada: string;
  dataSaida?: string | null;
  numeroVaga: string;
  tipoVeiculo: string;
  modelo: string;
  placa: string;
  criadoEm?: string;
}

export interface VeiculoLocacaoDto {
  nomeParceiro: string;
  espaco: string;
  dataEntrada: string;
  dataSaida?: string | null;
  numeroVaga: string;
  tipoVeiculo: string;
  modelo: string;
  placa: string;
}

export interface VeiculoLocacaoFilters {
  status?: "active" | "inactive" | "all";
  search?: string;
  vehicleType?: string;
}

export async function listVeiculosLocacao(filters?: VeiculoLocacaoFilters) {
  const params = new URLSearchParams();
  if (filters?.status) params.append("status", filters.status);
  if (filters?.search) params.append("search", filters.search);
  if (filters?.vehicleType) params.append("vehicleType", filters.vehicleType);
  
  const { data } = await api.get<VeiculoLocacao[]>(`/api/VeiculosLocacao?${params.toString()}`);
  return data;
}

export async function createVeiculoLocacao(payload: VeiculoLocacaoDto) {
  const { data } = await api.post<VeiculoLocacao>("/api/VeiculosLocacao", payload);
  return data;
}

export async function updateVeiculoLocacao(id: number, payload: VeiculoLocacaoDto) {
  await api.put(`/api/VeiculosLocacao/${id}`, payload);
}

export async function deleteVeiculoLocacao(id: number) {
  await api.delete(`/api/VeiculosLocacao/${id}`);
}
