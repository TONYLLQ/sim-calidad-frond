import { http } from "./http";

export type DimensionRow = {
  id: number;
  nombre: string;
  descripcion: string;
  b_activo: boolean;

  fecha_creacion: string;
  fecha_modificacion: string;
};

export async function getDimension(): Promise<DimensionRow[]> {
  const { data } = await http.get<DimensionRow[]>("/api/rules/dimension-calidad/");
  return data;
}
