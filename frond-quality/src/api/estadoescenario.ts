import { http } from "./http";

export type EstadoEscenario = {
  id: number;
  nombre: string;
  b_activo: boolean;

  fecha_creacion: string;
  fecha_modificacion: string;
};

export async function getEstadoEscenario(): Promise<EstadoEscenario[]> {
  const { data } = await http.get<EstadoEscenario[]>("api/scenarios/status-esc/");
  return data;
}
