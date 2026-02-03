import * as React from "react";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Sidebar from "../components/bar/sidebar";
import DataTableLocal, { type ColumnDef } from "../components/tables/table.tables";

import { getRules, type rule } from "../api/rules";
import { getUsersApi } from "../api/user"; // ✅ AJUSTA esta ruta según tu proyecto

type ApiError = { detail?: string; message?: string };

export default function UsuariosPage() {
  const [rows, setRows] = React.useState<rule[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const [collapsed, setCollapsed] = React.useState(false);
  const [me, setMe] = React.useState<any>(null);

  const sidebarWidth = collapsed ? 72 : 260;

  React.useEffect(() => {
    (async () => {
      try {
        const data = await getUsersApi();
        const user = Array.isArray(data) ? data[0] : data;
        setMe(user);
      } catch (e) {
        console.error("Error cargando usuario", e);
      }
    })();
  }, []);

  const displayName =
    me?.first_name || me?.last_name
      ? `${me.first_name ?? ""} ${me.last_name ?? ""}`.trim()
      : me?.username || "Usuario";

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
        <Button
          variant="outlined"
          size="small"
          color="inherit"
          onClick={() => alert(row.codigo_regla)}
        >
          Ver
        </Button>
      ),
    },
  ];

  const cargar = React.useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getRules();
      setRows(Array.isArray(data) ? data : []);
    } catch (e: unknown) {
      const err = e as { response?: { data?: ApiError } };
      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "No se pudo cargar la data."
      );
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void cargar();
  }, [cargar]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((s) => !s)}
        user={{
          name: me ? displayName : "Cargando...",
          email: me?.email || "",
        }}
        onLogout={() => {
          localStorage.removeItem("access_token");
          window.location.href = "/login";
        }}
      />

      {/* ✅ Contenido: deja espacio al sidebar */}
      <Box sx={{ flex: 1, ml: `${sidebarWidth}px`, p: 3 }}>
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
            rows={rows}
            columns={columns}
            searchKeys={["codigo_regla", "descripcion", "status"]}
          />
        )}
      </Box>
    </Box>
  );
}
