import { supabase } from "@/integrations/supabase/client";

export interface EventRecord {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface EventDto {
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
}

export async function listEvents(): Promise<EventRecord[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: false });
  
  if (error) throw error;
  return (data as EventRecord[]) || [];
}

export async function getEventById(id: string): Promise<EventRecord> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as EventRecord;
}

export async function createEvent(payload: EventDto): Promise<EventRecord> {
  console.log("Criando evento com payload:", payload);
  const { data, error } = await supabase
    .from('events')
    .insert([payload])
    .select()
    .single();
  
  if (error) {
    console.error("Erro ao criar evento:", error);
    throw error;
  }
  return data as EventRecord;
}

export async function updateEvent(id: string, payload: Partial<EventDto>) {
  const { error } = await supabase
    .from('events')
    .update(payload)
    .eq('id', id);
  
  if (error) throw error;
}

export async function deleteEvent(id: string) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}
