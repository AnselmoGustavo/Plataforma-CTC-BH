import { supabase } from "@/integrations/supabase/client";

export interface VoluntarioRecord {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  especialidade?: string;
  data_inscricao?: string;
  status?: string;
  endereco?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VoluntarioDto {
  nome: string;
  email: string;
  telefone?: string;
  especialidade?: string;
  endereco?: string;
  status?: string;
}

export async function listVoluntarios(): Promise<VoluntarioRecord[]> {
  const { data, error } = await supabase
    .from('voluntarios')
    .select('*')
    .order('nome');
  
  if (error) throw error;
  return (data as VoluntarioRecord[]) || [];
}

export async function getVoluntarioById(id: number): Promise<VoluntarioRecord> {
  const { data, error } = await supabase
    .from('voluntarios')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as VoluntarioRecord;
}

export async function createVoluntario(payload: VoluntarioDto): Promise<VoluntarioRecord> {
  const { data, error } = await supabase
    .from('voluntarios')
    .insert([payload])
    .select()
    .single();
  
  if (error) throw error;
  return data as VoluntarioRecord;
}

export async function updateVoluntario(id: number, payload: Partial<VoluntarioDto>) {
  const { error } = await supabase
    .from('voluntarios')
    .update(payload)
    .eq('id', id);
  
  if (error) throw error;
}

export async function deleteVoluntario(id: number) {
  const { error } = await supabase
    .from('voluntarios')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}
