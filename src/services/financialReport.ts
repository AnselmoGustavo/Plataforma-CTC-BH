import { supabase } from "@/integrations/supabase/client";

export interface FinancialReportRecord {
  id: number;
  entrada?: string;
  dataentrada?: string;
  valorentrada?: number;
  despesa?: string;
  datadespesa?: string;
  valordespesa?: number;
  created_at?: string;
  updated_at?: string;
}

export interface FinancialReportDto {
  entrada?: string | null;
  dataentrada?: string | null;
  valorentrada?: number | null;
  despesa?: string | null;
  datadespesa?: string | null;
  valordespesa?: number | null;
}

export async function listFinancialReports(): Promise<FinancialReportRecord[]> {
  const { data, error } = await supabase
    .from('financial_reports')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return (data as FinancialReportRecord[]) || [];
}

export async function createFinancialReport(payload: FinancialReportDto): Promise<FinancialReportRecord> {
  const { data, error } = await supabase
    .from('financial_reports')
    .insert([payload])
    .select()
    .single();
  
  if (error) throw error;
  return data as FinancialReportRecord;
}

export async function updateFinancialReport(id: number, payload: Partial<FinancialReportDto>) {
  const { error } = await supabase
    .from('financial_reports')
    .update(payload)
    .eq('id', id);
  
  if (error) throw error;
}

export async function deleteFinancialReport(id: number) {
  const { error } = await supabase
    .from('financial_reports')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}
