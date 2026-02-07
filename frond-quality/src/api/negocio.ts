import { http } from "./http";

export type NegocioRow = {
  id: number;
  nombre: string;

  // ===== IDs =====
  proceso: number;
  requerimiento: number;
  regla_calidad: number;
  escenarios: number;
  scripts: number;

  // ===== Campos descriptivos =====
  proceso_nombre: string;
  requerimiento_descripcion: string;

  regla_calidad_codigo: string;
  regla_calidad_descripcion: string;

  dimension_calidad_id: number;
  dimension_calidad_nombre: string;

  escenario_nombre: string;
  script_nombre: string;

  // ===== Auditoría =====
  fecha_creacion: string;
  fecha_modificacion: string;
};

export async function getNegocios(proceso?: number): Promise<NegocioRow[]> {
  const { data } = await http.get<NegocioRow[]>("/api/business/business/");
  if (proceso !== undefined) {
    return data.filter((item) => item.proceso === proceso);
  }
  return data;
}
