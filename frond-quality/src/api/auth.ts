import { http } from "./http";

export type LoginRequest = {
  username: string;
  password: string;
};

// Ajusta el tipo según tu API. Si tu API devuelve { token: "..." } es suficiente.
export type LoginResponse = {
  token?: string;
  access?: string;
  access_token?: string;
  refresh?: string;
  refresh_token?: string;
};

export async function loginApi(payload: LoginRequest): Promise<LoginResponse> {
  // ✅ CAMBIA SOLO ESTA RUTA A TU ENDPOINT REAL
  const { data } = await http.post<LoginResponse>("/api/auth/token/", payload);
  return data;
}
