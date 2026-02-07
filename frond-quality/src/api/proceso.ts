import { http } from "./http";

export type Procesos = {
    id: number;
    nombre: string;
    descripcion: string;
    bActivo: boolean;
    fecha_creacion: string;
    fecha_modificacion: string;
};

export async function getProcesos(): Promise<Procesos[]> {
    const { data } = await http.get<Procesos[]>("api/business/process/");
    return data;
}
