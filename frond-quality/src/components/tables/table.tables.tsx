import React, { useCallback, useEffect, useMemo, useState } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";

// ✅ Dialog imports
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

import FormEdicion from "../forms/formEdicion";
import FormAgregar from "../forms/formAgregar";

import { getEstadoEscenario, type EstadoEscenario } from "../../api/estadoescenario";
import ApiSelect from "../ui/dimensionselect";


import {
  Loader2,
  Trash2,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Pencil,
} from "lucide-react";

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  width?: number | string;
  align?: "left" | "right" | "center";
  noWrap?: boolean;
}

export interface DataTableProps<T> {
  columns: Column<T>[];

  /** ✅ AQUÍ le pasas tu función API: ej getRules */
  fetchData: () => Promise<T[]>;

  title?: string;

  onAdd?: () => void;
  onCreate?: (item: Partial<T>) => Promise<void>;
  onEdit?: (item: T) => void;
  onUpdate?: (item: T) => Promise<void>; // New prop for update
  onDelete?: (item: T) => Promise<void>;
  onRefresh?: () => void;

  pageSize?: number;
  idField?: keyof T;
  procesoId?: number;
}

export default function DataTable<T>({
  columns,
  fetchData,
  title = "Registros",
  onAdd,
  onCreate,
  onEdit,
  onUpdate,
  onDelete,
  onRefresh,
  pageSize = 10,
  idField = "id" as keyof T,
  procesoId,
}: DataTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  // ✅ Estado para el modal de confirmación
  const [deleteConfirmation, setDeleteConfirmation] = useState<T | null>(null);
  const [editModalItem, setEditModalItem] = useState<T | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // New state for filtering
  const [escenarioId, setEscenarioId] = useState<number | "">("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const rows = await fetchData();
      setData(Array.isArray(rows) ? rows : []);
      setCurrentPage(1);
    } catch (e: any) {
      setError(e?.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  useEffect(() => {
    load();
  }, [load]);

  // Esta función ejecuta el borrado real
  const executeDelete = async () => {
    if (!onDelete || !deleteConfirmation) return;
    const item = deleteConfirmation;
    const itemId = (item as any)[idField] as any;

    try {
      setDeleteConfirmation(null); // Cerrar modal antes de iniciar (mostramos loading en la fila)
      setDeletingId(itemId);
      await onDelete(item);

      // ✅ quitar del estado sin recargar toda la tabla
      setData((prev) => prev.filter((x) => (x as any)[idField] !== itemId));
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  const handleRefresh = () => {
    load();
    onRefresh?.();
  };

  // ========= FILTRADO =========
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // 1. Filter by Escenario ID (if set)
      if (escenarioId !== "" && (item as any).escenarios !== escenarioId) {
        return false;
      }

      // 2. Filter by Search Term
      const term = searchTerm.trim().toLowerCase();
      if (!term) return true;

      return columns.some((col) => {
        const value = (item as any)[col.key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(term);
      });
    });
  }, [data, columns, searchTerm, escenarioId]);

  // ========= PAGINACIÓN =========
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  // ========= LOADING =========
  if (loading) {
    return (
      <Card sx={{ borderRadius: 3, border: "1px solid rgba(0,0,0,0.08)" }}>
        <CardContent>
          <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ py: 6 }}>
            <Box sx={{ display: "grid", placeItems: "center" }}>
              <Loader2 size={32} style={{ animation: "spin 1s linear infinite" }} />
              <style>{`@keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`}</style>
            </Box>
            <Typography color="text.secondary">Cargando registros...</Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={2}>
        {/* ===== Header ===== */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h5" fontWeight={800}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {filteredData.length} registros encontrados
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            {(onAdd || onCreate) && (
              <Button
                variant="contained"
                onClick={onCreate ? () => setAddModalOpen(true) : onAdd}
                startIcon={<Plus size={16} />}
                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 800 }}
              >
                Agregar
              </Button>
            )}

            <Button
              variant="outlined"
              onClick={handleRefresh}
              startIcon={<RefreshCw size={16} />}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
            >
              Actualizar
            </Button>
          </Stack>
        </Stack>

        {/* ===== Search & Filter ===== */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar en registros..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            InputProps={{
              startAdornment: (
                <Box sx={{ display: "flex", alignItems: "center", mr: 1, opacity: 0.65 }}>
                  <Search size={16} />
                </Box>
              ),
            }}
          />

          <Box sx={{ minWidth: 240 }}>
            <ApiSelect<EstadoEscenario, number>
              label="Status Escenario"
              placeholder="Todos"
              fetcher={getEstadoEscenario}
              value={escenarioId}
              onChangeValue={(val) => {
                setEscenarioId(val);
                setCurrentPage(1);
              }}
              getValue={(d) => d.id}
              getLabel={(d) => d.nombre}
              filter={(d) => d.b_activo}
              sort={(a, b) => a.nombre.localeCompare(b.nombre, "es")}
              fullWidth
            />
          </Box>
        </Stack>

        {/* ===== Error ===== */}
        {error && (
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid rgba(211,47,47,0.35)",
              background: "rgba(211,47,47,0.06)",
            }}
          >
            <CardContent>
              <Typography color="error" fontWeight={700}>
                Error:
              </Typography>
              <Typography color="error" sx={{ mt: 0.5 }}>
                {error}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* ===== Table ===== */}
        <Card sx={{ borderRadius: 3, border: "1px solid rgba(0,0,0,0.08)", overflow: "hidden" }}>
          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <Table size="medium">
              <TableHead>
                <TableRow sx={{ background: "rgba(0,0,0,0.03)" }}>
                  {columns.map((col) => (
                    <TableCell
                      key={String(col.key)}
                      align={col.align || "left"}
                      sx={{
                        fontWeight: 800,
                        whiteSpace: "nowrap",
                        width: col.width,
                      }}
                    >
                      {col.label}
                    </TableCell>
                  ))}
                  {(onDelete || onEdit) && (
                    <TableCell sx={{ fontWeight: 800, width: 100, whiteSpace: "nowrap", textAlign: "right" }}>
                      Acción
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + (onDelete || onEdit ? 1 : 0)}
                      sx={{ py: 6, textAlign: "center", color: "text.secondary" }}
                    >
                      No hay registros para mostrar
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item, idx) => {
                    const itemId = (item as any)[idField] as any;

                    return (
                      <TableRow
                        key={String(itemId ?? idx)}
                        hover
                        sx={{
                          "& td": { borderBottom: "1px solid rgba(0,0,0,0.06)" },
                        }}
                      >
                        {columns.map((col) => {
                          const raw = (item as any)[col.key];
                          const content = col.render ? col.render(raw, item) : raw;

                          return (
                            <TableCell
                              key={String(col.key)}
                              align={col.align || "left"}
                              sx={{
                                whiteSpace: col.noWrap ? "nowrap" : "normal",
                                maxWidth: col.noWrap ? 260 : "none",
                                overflow: col.noWrap ? "hidden" : "visible",
                                textOverflow: col.noWrap ? "ellipsis" : "unset",
                              }}
                            >
                              {content === null || content === undefined ? "" : String(content)}
                            </TableCell>
                          );
                        })}

                        {(onDelete || onEdit) && (
                          <TableCell sx={{ textAlign: "right" }}>
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              {onEdit && (
                                <Tooltip title="Editar">
                                  <IconButton
                                    onClick={() => setEditModalItem(item)}
                                    size="small"
                                    sx={{
                                      borderRadius: 2,
                                      color: "primary.main",
                                      "&:hover": { background: "rgba(25, 118, 210, 0.08)" },
                                    }}
                                  >
                                    <Pencil size={16} />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {onDelete && (
                                <Tooltip title="Eliminar">
                                  <IconButton
                                    onClick={() => setDeleteConfirmation(item)}
                                    disabled={deletingId === itemId}
                                    size="small"
                                    sx={{
                                      borderRadius: 2,
                                      color: "error.main",
                                      "&:hover": { background: "rgba(211,47,47,0.08)" },
                                    }}
                                  >
                                    {deletingId === itemId ? (
                                      <CircularProgress size={16} />
                                    ) : (
                                      <Trash2 size={16} />
                                    )}
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Stack>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Box>
        </Card>

        {/* ===== Pagination ===== */}
        {totalPages > 1 && (
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              Página {safePage} de {totalPages}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                variant="outlined"
                size="small"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                startIcon={<ChevronLeft size={16} />}
                sx={{ borderRadius: 2, textTransform: "none" }}
              >
                Anterior
              </Button>

              <Button
                variant="outlined"
                size="small"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                endIcon={<ChevronRight size={16} />}
                sx={{ borderRadius: 2, textTransform: "none" }}
              >
                Siguiente
              </Button>
            </Stack>
          </Stack>
        )}

        <Divider sx={{ opacity: 0.4 }} />

        {/* ===== Confirm Delete Dialog ===== */}
        <Dialog
          open={!!deleteConfirmation}
          onClose={() => setDeleteConfirmation(null)}
          PaperProps={{
            sx: { borderRadius: 3, padding: 1, minWidth: 320 },
          }}
        >
          <DialogTitle sx={{ fontWeight: 800 }}>Confirmar eliminación</DialogTitle>
          <DialogContent>
            <DialogContentText color="text.primary">
              ¿Estás seguro de que deseas eliminar este registro?
              <br />
              Esta acción no se puede deshacer.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setDeleteConfirmation(null)}
              sx={{ textTransform: "none", fontWeight: 700 }}
              color="inherit"
            >
              Cancelar
            </Button>
            <Button
              onClick={executeDelete}
              variant="contained"
              color="error"
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 800, boxShadow: 'none' }}
              autoFocus
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        {/* ✅ Edit Dialog (Local) */}
        {editModalItem && (
          <FormEdicion
            open={!!editModalItem}
            onClose={() => setEditModalItem(null)}
            initialValues={editModalItem as any}
            onSubmit={async (values) => {
              if (onUpdate) {
                await onUpdate(values as any);
              }
              setEditModalItem(null);
              load();
            }}
          />
        )}

        {/* ✅ Add Dialog (Local) */}
        {addModalOpen && onCreate && (
          <FormAgregar
            open={addModalOpen}
            onClose={() => setAddModalOpen(false)}
            onSubmit={async (values) => {
              await onCreate(values as any);
              setAddModalOpen(false);
              load();
            }}
            procesoId={procesoId}
          />
        )}
      </Stack>
    </Box>
  );
}
