import { http } from "./http";

export type rule = {
  id: number;
  codigo_regla: string;
  descripcion: string;
  status: number;
};

// Si tu API devuelve directamente un array:  [ {...}, {...} ]
export async function getRules(): Promise<rule[]> {
  const { data } = await http.get<rule[]>("/api/rules/reglas/"); // cambia el endpoint
  return data;
}

// Si tu API devuelve algo como { results: [...], count: n }
// usa este en vez del de arriba:
/*
export type UsersResponse = { results: User[]; count: number };

export async function getUsuarios(): Promise<User[]> {
  const { data } = await http.get<UsersResponse>("/api/users");
  return data.results;
}
*/


