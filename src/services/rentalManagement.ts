import { supabase } from "@/integrations/supabase/client";

export interface VeiculoLocacao {
  id: number;
  nomeparceiro: string;
  espaco?: string;
  dataentrada: string;
  datasaida?: string;
  numerovaga?: string;
  tipoveiculo?: string;
  modelo?: string;
  placa?: string;
  roomname?: string;
  responsible?: string;
  purpose?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VeiculoLocacaoDto {
  nomeparceiro: string;
  espaco?: string;
  dataentrada: string;
  datasaida?: string | null;
  numerovaga?: string;
  tipoveiculo?: string;
  modelo?: string;
  placa?: string;
  roomname?: string;
  responsible?: string;
  purpose?: string;
  description?: string;
}

export interface VeiculoLocacaoFilters {
  status?: "disponivel" | "alugado" | "manutencao" | "all";
  search?: string;
}

export async function listVeiculosLocacao(filters?: VeiculoLocacaoFilters): Promise<VeiculoLocacao[]> {
  let query = supabase
    .from('veiculos_locacao')
    .select('*')
    .order('dataentrada', { ascending: false });

  if (filters?.search) {
    query = query.or(`nomeparceiro.ilike.%${filters.search}%,placa.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return (data as VeiculoLocacao[]) || [];
}

export async function createVeiculoLocacao(payload: VeiculoLocacaoDto): Promise<VeiculoLocacao> {
  const { data, error } = await supabase
    .from('veiculos_locacao')
    .insert([payload])
    .select()
    .single();
  
  if (error) throw error;
  return data as VeiculoLocacao;
}

export async function updateVeiculoLocacao(id: number, payload: Partial<VeiculoLocacaoDto>) {
  const { error } = await supabase
    .from('veiculos_locacao')
    .update(payload)
    .eq('id', id);
  
  if (error) throw error;
}

export async function deleteVeiculoLocacao(id: number) {
  const { error } = await supabase
    .from('veiculos_locacao')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}
