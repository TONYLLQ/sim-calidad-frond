import { http } from "./http";

export type User = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  is_staff: boolean;
};

export async function getUsersApi() {
  const { data } = await http.get<User[]>("api/auth/token/users/me/");
  return data;
}
