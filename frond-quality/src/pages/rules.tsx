import * as React from "react";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import DataTableLocal, { type ColumnDef } from "../components/tables/Table";
import { getRules, type rule } from "../api/rules";

type ApiError = { detail?: string; message?: string };

export default function UsuariosPage() {
  const [rows, setRows] = React.useState<rule[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>("");

  const columns: ColumnDef<rule>[] = [
    { key: "id", header: "ID", width: 80 },
    { key: "codigo_regla", header: "Usuario" },
    { key: "descripcion", header: "Nombres" },
    { key: "status", header: "Estado" },
    {
      key: "codigo_regla",
      header: "Acciones",
      width: 140,
      render: (row) => (
        <Button variant="outlined" size="small" color="inherit" onClick={() => alert(row.codigo_regla)}>
          Ver
        </Button>
      ),
    },
  ];

  const cargar = React.useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getRules();     // ✅ trae data de API
      setRows(data);                        // ✅ lo guardas como arreglo
    } catch (e: unknown) {
      // error simple (si quieres más detalle, dime tu formato de error)
      const err = e as { response?: { data?: ApiError } };
      setError(err.response?.data?.detail || err.response?.data?.message || "No se pudo cargar la data.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void cargar();
  }, [cargar]);

  return (
    <Box sx={{ p: 3 }}>
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}

      {loading ? (
        <Box sx={{ display: "grid", placeItems: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataTableLocal<rule>
          title="Usuarios"
          rows={rows}                  // ✅ aquí le pasas el arreglo
          columns={columns}
          searchKeys={["codigo_regla", "descripcion", "status"]}
        />
      )}
    </Box>
  );
}
