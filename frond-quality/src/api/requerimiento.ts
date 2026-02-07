import { http } from "./http";

export type Requerimiento = {
    id: number;
    descripcion: string;
    prioridad: boolean;

    fecha_creacion: string;
    fecha_modificacion: string;
};

export async function getRequerimiento(): Promise<Requerimiento[]> {
    const { data } = await http.get<Requerimiento[]>("/api/business/requirement-quality/");
    return data;
}
