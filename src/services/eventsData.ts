import api from "./api";

export interface EventRecord {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
}

export interface EventDto {
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
}

export async function listEvents() {
  const { data } = await api.get<EventRecord[]>("/api/Events");
  return data;
}

export async function getEventById(id: string) {
  const { data } = await api.get<EventRecord>(`/api/Events/${id}`);
  return data;
}

export async function createEvent(payload: EventDto) {
  const { data } = await api.post<EventRecord>("/api/Events", payload);
  return data;
}

export async function updateEvent(id: string, payload: EventDto) {
  await api.put(`/api/Events/${id}`, payload);
}

export async function deleteEvent(id: string) {
  await api.delete(`/api/Events/${id}`);
}
