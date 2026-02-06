import { http } from "./http";

export type Reglas = {
    id: number;
    codigo_regla: string;
    descripcion: string;
    status: number;
    status_nombre: string;
    fecha_creacion: string;
    fecha_modificacion: string;
};

export async function getReglas(): Promise<Reglas[]> {
    const { data } = await http.get<Reglas[]>("api/rules/reglas/");
    return data;
}
