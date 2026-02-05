import * as React from "react";
import Box from "@mui/material/Box";

import Header from "../components/header/headermain";
import Sidebar from "../components/bar/sidebar";
import { getUsersApi } from "../api/user";

const SIDEBAR_COLLAPSED = 72;
const HEADER_H = 64;

export default function UsuariosPage() {
  const [collapsed, setCollapsed] = React.useState(true);
  const [me, setMe] = React.useState<any>(null);

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

  const handleLogout = React.useCallback(() => {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  }, []);

  const leftOffset = SIDEBAR_COLLAPSED;

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((s) => !s)}
        user={{ name: me ? displayName : "Cargando...", email: me?.email || "" }}
        onLogout={handleLogout}
      />

      <Header
        sidebarCollapsed={collapsed}
        title="Usuarios"
        envLabel="Production"
        user={{
          name: me ? displayName : "Cargando...",
          email: me?.email || "",
          avatar: "",
        }}
        onLogout={handleLogout}
      />

      {/* Área principal (vacía por ahora) */}
      <Box
        sx={{
          ml: { xs: 0, md: `${leftOffset}px` },
          width: { xs: "100%", md: `calc(100% - ${leftOffset}px)` },
          pt: `${HEADER_H}px`,
          minHeight: "100vh",
          background: "#f6f6f6",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
INMIGRACION
      </Box>
    </Box>
  );
}
