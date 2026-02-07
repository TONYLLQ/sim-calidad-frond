import { http } from "./http";

export type Escenario = {
    id: number;
    codigo_escenario: string;
    estado_detalle: string;
    descripcion: string;
    estado: number;

    fecha_creacion: string;
    fecha_modificacion: string;
};

export async function getEscenario(): Promise<Escenario[]> {
    const { data } = await http.get<Escenario[]>("api/scenarios/scenarios/");
    return data;
}
