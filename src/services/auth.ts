import api from "./api";

export async function login(email: string, password: string) {
  const resp = await api.post("/api/auth/login", { email, password });
  return resp.data;
}

export async function getProfile() {
  const resp = await api.get("/api/auth/profile");
  return resp.data;
}
