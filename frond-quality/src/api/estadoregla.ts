import { http } from "./http";

export type EstadoRegla = {
  id: number;
  nombre: string;
  b_activo: boolean;

  fecha_creacion: string;
  fecha_modificacion: string;
};

export async function getEstadoRegla(): Promise<EstadoRegla[]> {
  const { data } = await http.get<EstadoRegla[]>("api/rules/status-reglas/");
  return data;
}
