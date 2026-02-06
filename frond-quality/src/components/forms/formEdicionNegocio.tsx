import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { NegocioRow } from "../../api/negocio";
import { getDimension, type DimensionRow } from "../../api/dimensiones"; // ✅ Importar API
import ApiSelect from "../ui/dimensionselect"; // ✅ Importar Componente Genérico
import { getEstadoEscenario, type EstadoEscenario } from "../../api/estadoescenario";
import { getScriptsCalidad, type ScriptsCalidad } from "../../api/scripts";
import { getEstadoRegla, type EstadoRegla } from "../../api/estadoregla";
import { getRequerimiento, type Requerimiento } from "../../api/requerimiento";

const PROCESS_NAMES: Record<number, string> = {
    1: "CONTROL MIGRATORIO",
    2: "EMISIÓN PASAPORTE",
    3: "INMIGRACIÓN",
    4: "NACIONALIZACIÓN"
};

export interface FormEdicionNegocioProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<NegocioRow>) => Promise<void>;
    initialValues?: Partial<NegocioRow>; // For editing (should always be present for edit form)
    procesoId?: number; // Pre-filled value if needed, or derived from initialValues
}

export default function FormEdicionNegocio({
    open,
    onClose,
    onSubmit,
    initialValues,
    procesoId,
}: FormEdicionNegocioProps) {
    const [formData, setFormData] = useState<Partial<NegocioRow>>({});
    const [loading, setLoading] = useState(false);
    const [dimensionId, setDimensionId] = React.useState<number | "">("");
    const [escenarioId, setEscenarioId] = React.useState<number | "">("");
    const [scriptId, setScriptId] = React.useState<number | "">("");
    const [reglaId, setReglaId] = React.useState<number | "">("");
    const [requerimientoId, setRequerimientoId] = React.useState<number | "">("");
    const [submitted, setSubmitted] = useState(false);


    useEffect(() => {
        if (open) {
            setSubmitted(false);
            if (initialValues) {
                setFormData({ ...initialValues });
                setDimensionId(initialValues.dimension_calidad_id || "");
                setEscenarioId(initialValues.escenarios || "");
                setScriptId(initialValues.scripts || "");
                setReglaId(initialValues.regla_calidad || "");
                setRequerimientoId(initialValues.requerimiento || "");
            } else {
                // If opened without data (shouldn't happen for EDIT form usually, but robust fallback)
                setFormData({
                    nombre: "",
                    proceso: procesoId,
                    requerimiento: 0,
                    regla_calidad: 0,
                    escenarios: 0,
                    dimension_calidad_id: 0,
                    requerimiento: 0,

                });
                setDimensionId("");
                setEscenarioId("");
                setScriptId("");
                setReglaId("");
                setRequerimientoId("");
            }
        }
    }, [open, initialValues, procesoId]);

    const handleChange = (field: keyof NegocioRow, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);

        // Validation
        if (!dimensionId || !escenarioId || !scriptId || !reglaId || !formData.nombre || !requerimientoId) {
            return;
        }

        try {
            setLoading(true);
            // Ensure IDs are in formData
            const dataToSubmit = {
                ...formData,
                dimension_calidad_id: Number(dimensionId),
                escenarios: Number(escenarioId),
                scripts: Number(scriptId),
                regla_calidad: Number(reglaId),
                requerimiento: Number(requerimientoId),
            };
            await onSubmit(dataToSubmit);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                }
            }}
        >
            <form onSubmit={handleSubmit}>
                <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
                    Editar Negocio
                </DialogTitle>
                <DialogContent dividers sx={{ borderColor: "rgba(0,0,0,0.06)" }}>
                    <Stack spacing={3}>
                        <Typography variant="body2" color="text.secondary">
                            Actualice los datos del negocio a continuación.
                        </Typography>

                        <TextField
                            label="Nombre"
                            fullWidth
                            required
                            value={formData.nombre || ""}
                            onChange={(e) => handleChange("nombre", e.target.value)}
                            variant="outlined"
                            InputProps={{ sx: { borderRadius: 2 } }}
                            error={submitted && !formData.nombre}
                        />


                        <TextField
                            label="Proceso"
                            fullWidth
                            type="text"
                            disabled={!!(procesoId || formData.proceso)}
                            value={formData.proceso ? PROCESS_NAMES[formData.proceso] : ""}
                            InputProps={{ sx: { borderRadius: 2 } }}
                            helperText={procesoId ? "Asignado automáticamente por la página actual" : ""}
                        />

                        <ApiSelect<Requerimiento, number>
                            label="Requerimiento"
                            fetcher={getRequerimiento}
                            value={requerimientoId}
                            onChangeValue={(val) => {
                                setRequerimientoId(val);
                                handleChange("requerimiento", val);
                            }}
                            onChangeItem={(item) => handleChange("requerimiento_descripcion", item.descripcion)}
                            getValue={(d) => d.id}
                            getLabel={(d) => d.descripcion}
                            sort={(a, b) => a.descripcion.localeCompare(b.descripcion, "es")}
                            error={submitted && !requerimientoId}
                        />

                        <ApiSelect<EstadoRegla, number>
                            label="Estado de Regla"
                            fetcher={getEstadoRegla}
                            value={reglaId}
                            onChangeValue={(val) => {
                                setReglaId(val);
                                handleChange("regla_calidad", val);
                            }}
                            onChangeItem={(item) => handleChange("regla_calidad_descripcion", item.nombre)}
                            getValue={(d) => d.id}
                            getLabel={(d) => d.nombre}
                            filter={(d) => d.b_activo}
                            sort={(a, b) => a.nombre.localeCompare(b.nombre, "es")}
                            error={submitted && !reglaId}
                        />



                        <ApiSelect<EstadoEscenario, number>
                            label="Status Escenario"
                            fetcher={getEstadoEscenario}
                            value={escenarioId}
                            onChangeValue={(val) => {
                                setEscenarioId(val);
                                handleChange("escenarios", val);
                            }}
                            onChangeItem={(item) => handleChange("escenario_nombre", item.nombre)}
                            getValue={(d) => d.id}
                            getLabel={(d) => d.nombre}
                            filter={(d) => d.b_activo}
                            sort={(a, b) => a.nombre.localeCompare(b.nombre, "es")}
                            error={submitted && !escenarioId}
                        />

                        <ApiSelect<ScriptsCalidad, number>
                            label="Script"
                            fetcher={getScriptsCalidad}
                            value={scriptId}
                            onChangeValue={(val) => {
                                setScriptId(val);
                                handleChange("scripts", val);
                            }}
                            onChangeItem={(item) => handleChange("script_nombre", item.nombre)}
                            getValue={(d) => d.id}
                            getLabel={(d) => d.nombre}
                            filter={(d) => d.scripts_completos}
                            sort={(a, b) => a.nombre.localeCompare(b.nombre, "es")}
                            error={submitted && !scriptId}
                        />

                        <ApiSelect<DimensionRow, number>
                            label="Dimensión"
                            fetcher={getDimension}
                            value={dimensionId}
                            onChangeValue={(val) => {
                                setDimensionId(val);
                                handleChange("dimension_calidad_id", val);
                            }}
                            onChangeItem={(item) => handleChange("dimension_calidad_nombre", item.nombre)}
                            getValue={(d) => d.id}
                            getLabel={(d) => d.nombre}
                            filter={(d) => d.b_activo}
                            sort={(a, b) => a.nombre.localeCompare(b.nombre, "es")}
                            error={submitted && !dimensionId}
                        />

                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button
                        onClick={onClose}
                        color="inherit"
                        sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{ textTransform: "none", fontWeight: 800, borderRadius: 2, boxShadow: "none" }}
                    >
                        {loading ? "Guardar Cambios" : "Guardar Cambios"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
