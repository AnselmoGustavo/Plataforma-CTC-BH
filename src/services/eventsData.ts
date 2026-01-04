import { supabase } from "@/integrations/supabase/client";

export interface EventRecord {
  id: number;
  title: string;
  description?: string;
  start_date: string;
  location?: string;
  created_by: number;
  created_at?: string;
  updated_at?: string;
}

export interface EventDto {
  title: string;
  description?: string;
  start_date: string;
  location?: string;
  created_by: number;
}

export async function listEvents(): Promise<EventRecord[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: false });
  
  if (error) throw error;
  return (data as EventRecord[]) || [];
}

export async function getEventById(id: number): Promise<EventRecord> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as EventRecord;
}

export async function createEvent(payload: EventDto): Promise<EventRecord> {
  const { data, error } = await supabase
    .from('events')
    .insert([payload])
    .select()
    .single();
  
  if (error) throw error;
  return data as EventRecord;
}

export async function updateEvent(id: number, payload: Partial<EventDto>) {
  const { error } = await supabase
    .from('events')
    .update(payload)
    .eq('id', id);
  
  if (error) throw error;
}

export async function deleteEvent(id: number) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}
