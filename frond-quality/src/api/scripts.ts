import { http } from "./http";

export type ScriptsCalidad= {
  id: number;
  nombre: string;
  script_inconsistencia: string | null;
  script_correccion: string | null;
  script_scala: string | null;
  scripts_completos: boolean;
  descripcion: string;
  fecha_creacion: string;
  fecha_modificacion: string;
};


export async function getScriptsCalidad(): Promise<ScriptsCalidad[]> {
  const { data } = await http.get<ScriptsCalidad[]>("api/scripts/scripts/");
  return data;
}
