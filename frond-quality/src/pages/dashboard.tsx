import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/GridLegacy";

import Sidebar from "../components/bar/sidebar";
import Header from "../components/header/headermain";

import { getUsersApi } from "../api/user";

import ModuleCards from "../components/panel/statscards";
import OverviewChart from "../components/panel/overviewchart";
import RecentActivity from "../components/panel/recentactivity";

const SIDEBAR_COLLAPSED = 72;

const HEADER_H = 64;

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(true);
  const [me, setMe] = useState<any>(null);

  useEffect(() => {
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

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  };

  const leftOffset = SIDEBAR_COLLAPSED ;

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
        title="Overview"
        envLabel="Production"
        user={{
          name: me ? displayName : "Cargando...",
          email: me?.email || "",
          avatar: "",
        }}
        onLogout={handleLogout}
      />

      {/* Área principal */}
      <Box
        sx={{
          ml: { xs: 0, md: `${leftOffset}px` },
          width: { xs: "100%", md: `calc(100% - ${leftOffset}px)` },
          pt: `${HEADER_H}px`,
          minHeight: "100vh",
          background: "#f6f6f6",
          overflowX: "hidden",

          // ✅ CLAVE: layout vertical que permite “llenar” el alto restante
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Wrapper */}
        <Box
          sx={{
            width: "100%",
            px: { xs: 1.5, md: 2 },
            py: 3,
            boxSizing: "border-box",

            // ✅ CLAVE: deja que el grid inferior crezca
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: 0,
          }}
        >
          {/* Cards */}
          <ModuleCards />

          {/* Chart + Activity: llenan el alto restante */}
          <Grid
            container
            spacing={2}
            alignItems="stretch"
            sx={{
              flex: 1,
              minHeight: 0,
              minWidth: 0,
            }}
          >
            <Grid item xs={12} lg={8} sx={{ display: "flex", minHeight: 0, minWidth: 0 }}>
              <OverviewChart sx={{ flex: 1, minHeight: 0 }} />
            </Grid>

            <Grid item xs={12} lg={4} sx={{ display: "flex", minHeight: 0, minWidth: 0 }}>
              <RecentActivity sx={{ flex: 1, minHeight: 0 }} />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
