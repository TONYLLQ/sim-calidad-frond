import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Sidebar from "../components/bar/sidebar";
import { getUsersApi } from "../api/user";

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [me, setMe] = useState<any>(null);

  const sidebarWidth = collapsed ? 72 : 260;

  useEffect(() => {
    (async () => {
      try {
        const data = await getUsersApi();

        // ✅ Si la API devuelve array, tomar el primero
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

      <Box
        sx={{
          flex: 1,
          ml: `${sidebarWidth}px`,
          display: "grid",
          placeItems: "center",
          background: "linear-gradient(135deg, #0c3b75, #0e4a8a)",
          color: "white",
        }}
      >
        <Typography variant="h3" fontWeight={900}>
          Dashboard
        </Typography>
      </Box>
    </Box>
  );
}
