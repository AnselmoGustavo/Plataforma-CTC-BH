import { supabase } from "@/integrations/supabase/client";

export interface AssociadoRecord {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  data_nascimento?: string;
  data_associacao?: string;
  funcao?: string;
  mensalidade?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AssociadoDto {
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  data_nascimento?: string;
  funcao?: string;
  mensalidade?: number;
  status?: string;
}

export async function listAssociados(): Promise<AssociadoRecord[]> {
  const { data, error } = await supabase
    .from('associados')
    .select('*')
    .order('nome');
  
  if (error) throw error;
  return (data as AssociadoRecord[]) || [];
}

export async function getAssociadoById(id: number): Promise<AssociadoRecord> {
  const { data, error } = await supabase
    .from('associados')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as AssociadoRecord;
}

export async function createAssociado(payload: AssociadoDto): Promise<AssociadoRecord> {
  const { data, error } = await supabase
    .from('associados')
    .insert([payload])
    .select()
    .single();
  
  if (error) throw error;
  return data as AssociadoRecord;
}

export async function updateAssociado(id: number, payload: Partial<AssociadoDto>) {
  const { error } = await supabase
    .from('associados')
    .update(payload)
    .eq('id', id);
  
  if (error) throw error;
}

export async function deleteAssociado(id: number) {
  const { error } = await supabase
    .from('associados')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}
