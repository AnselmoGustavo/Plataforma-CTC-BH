import api from "./api";

export interface FinancialReportRecord {
  id: number;
  entrada?: string | null;
  dataEntrada?: string | null;
  valorEntrada?: number | null;
  despesa?: string | null;
  dataDespesa?: string | null;
  valorDespesa?: number | null;
  criadoEm?: string;
}

export interface FinancialReportDto {
  entrada?: string | null;
  dataEntrada?: string | null;
  valorEntrada?: number | null;
  despesa?: string | null;
  dataDespesa?: string | null;
  valorDespesa?: number | null;
}

export async function listFinancialReports() {
  const { data } = await api.get<FinancialReportRecord[]>("/api/FinancialReports");
  return data;
}

export async function createFinancialReport(payload: FinancialReportDto) {
  const { data } = await api.post<FinancialReportRecord>("/api/FinancialReports", payload);
  return data;
}

export async function updateFinancialReport(id: number, payload: FinancialReportDto) {
  await api.put(`/api/FinancialReports/${id}`, payload);
}

export async function deleteFinancialReport(id: number) {
  await api.delete(`/api/FinancialReports/${id}`);
}
