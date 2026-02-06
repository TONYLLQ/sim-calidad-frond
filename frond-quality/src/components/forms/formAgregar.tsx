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
import { getDimension, type DimensionRow } from "../../api/dimensiones";
import ApiSelect from "../ui/dimensionselect";
import { getScriptsCalidad, type ScriptsCalidad } from "../../api/scripts";
import { getRequerimiento, type Requerimiento } from "../../api/requerimiento";
import { getReglas, type Reglas } from "../../api/reglas";
import { getProcesos, type Procesos } from "../../api/proceso";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';

export interface FormAgregarProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<NegocioRow>) => Promise<void>;
    initialValues?: Partial<NegocioRow>;
    procesoId?: number;
}

export default function FormAgregar({
    open,
    onClose,
    onSubmit,
    initialValues,
    procesoId,
}: FormAgregarProps) {
    const [formData, setFormData] = useState<Partial<NegocioRow>>({});
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // State for Selects
    const [dimensionId, setDimensionId] = useState<number | "">("");
    const [scriptId, setScriptId] = useState<number | "">("");
    const [reglaId, setReglaId] = useState<number | "">("");
    const [requerimientoId, setRequerimientoId] = useState<number | "">("");
    const [selectedProcesoId, setSelectedProcesoId] = useState<number | "">("");

    // Additional UI state
    const [reglaDescripcion, setReglaDescripcion] = useState("");

    useEffect(() => {
        if (open) {
            setSubmitted(false);
            if (initialValues) {
                setFormData({ ...initialValues });

                // Pre-fill fields
                setDimensionId(initialValues.dimension_calidad_id || "");
                setScriptId(initialValues.scripts || "");
                setReglaId(initialValues.regla_calidad || "");
                setRequerimientoId(initialValues.requerimiento || "");
                setSelectedProcesoId(initialValues.proceso || procesoId || "");

                setReglaDescripcion(initialValues.regla_calidad_descripcion || "");
            } else {
                setFormData({
                    nombre: "",
                });
                setDimensionId("");
                setScriptId("");
                setReglaId("");
                setRequerimientoId("");
                setSelectedProcesoId(procesoId || "");
                setReglaDescripcion("");
            }
        }
    }, [open, initialValues, procesoId]);

    const handleChange = (field: keyof NegocioRow, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);

        // Validation - ensure required fields are present
        if (!formData.nombre || !dimensionId || !scriptId || !reglaId || !requerimientoId || !selectedProcesoId) {
            return;
        }

        try {
            setLoading(true);
            const dataToSubmit = {
                ...formData,
                dimension_calidad_id: Number(dimensionId),
                scripts: Number(scriptId),
                regla_calidad: Number(reglaId),
                requerimiento: Number(requerimientoId),
                proceso: Number(selectedProcesoId),
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
                    {"Nuevo Negocio"}
                </DialogTitle>
                <DialogContent dividers sx={{ borderColor: "rgba(0,0,0,0.06)" }}>
                    <Stack spacing={3}>
                        <Typography variant="body2" color="text.secondary">
                            {"Complete la información para registrar un nuevo negocio."}
                        </Typography>

                        {/* Nombre */}
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

                        {/* Proceso */}

                        <ApiSelect<Procesos, number>
                            label="Proceso"
                            fetcher={getProcesos}
                            value={selectedProcesoId}
                            onChangeValue={(val) => {
                                setSelectedProcesoId(val);
                                handleChange("proceso", val);
                            }}
                            getValue={(d) => d.id}
                            getLabel={(d) => d.nombre}
                            filter={(d) => d.bActivo}
                            sort={(a, b) => a.nombre.localeCompare(b.nombre, "es")}
                            error={submitted && !selectedProcesoId}
                        />


                        {/* Requerimiento */}
                        <Box
                            sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "space-between" }}>
                            <Box sx={{ flexGrow: 1 }}>
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
                            </Box>
                            <Fab size="small" color="primary" aria-label="add" >
                                <AddIcon />
                            </Fab>
                        </Box>

                        {/* Regla */}
                        <Box
                            sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "space-between" }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <ApiSelect<Reglas, number>
                                    label="Regla"
                                    fetcher={getReglas}
                                    value={reglaId}
                                    onChangeValue={(val) => {
                                        setReglaId(val);
                                        handleChange("regla_calidad", val);
                                    }}
                                    onChangeItem={(item) => {
                                        setReglaDescripcion(item.descripcion);
                                        handleChange("regla_calidad_descripcion", item.descripcion);
                                        handleChange("regla_calidad_codigo", item.codigo_regla);
                                    }}
                                    getValue={(d) => d.id}
                                    getLabel={(d) => d.codigo_regla}
                                    sort={(a, b) => a.codigo_regla.localeCompare(b.codigo_regla, "es")}
                                    error={submitted && !reglaId}
                                />
                            </Box>
                            <Fab size="small" color="primary" aria-label="add" >
                                <AddIcon />
                            </Fab>
                        </Box>

                        {/* Descripción Regla */}
                        <TextField
                            label="Descripción Regla"
                            fullWidth
                            multiline
                            rows={2}
                            value={reglaDescripcion}
                            InputProps={{
                                readOnly: true,
                                sx: { borderRadius: 2, bgcolor: "rgba(0,0,0,0.02)" }
                            }}
                        />



                        {/* Script */}
                        <Box
                            sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "space-between" }}>
                            <Box sx={{ flexGrow: 1 }}>

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
                            </Box>
                            <Fab size="small" color="primary" aria-label="add" >
                                <AddIcon />
                            </Fab>
                        </Box>


                        {/* Dimensión*/}
                        <Box
                            sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "space-between" }}>
                            <Box sx={{ flexGrow: 1 }}>

                                <ApiSelect<DimensionRow, number>
                                    label="Dimensión Calidad"
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
                            </Box>
                            <Fab size="small" color="primary" aria-label="add" >
                                <AddIcon />
                            </Fab>
                        </Box>


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
                        {loading ? "Crear Registro" : "Crear Registro"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
