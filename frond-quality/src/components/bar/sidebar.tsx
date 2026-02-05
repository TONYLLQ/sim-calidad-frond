import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import BoltIcon from "@mui/icons-material/Bolt";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";


import {
  styles,
  DRAWER_WIDTH,
  DRAWER_COLLAPSED_WIDTH,
} from "../css/sidebar.styles";

export type SidebarItem = {
  label: string;
  icon: React.ReactNode;
  to: string;
  badge?: number;
};

const MAIN_ITEMS: SidebarItem[] = [
  { label: "Dashboard", icon: <DashboardIcon />, to: "/dashboard" },
  { label: "Control Migratorio", icon: <BarChartIcon />, to: "/control-migratorio" },
  { label: "Emisión de Pasaporte", icon: <PeopleIcon />, to: "/emision-pasaporte", badge: 12 },
  { label: "Nacionalización", icon: <DescriptionIcon />, to: "/nacionalizacion" },
  { label: "Inmigración", icon: <NotificationsIcon />, to: "/inmigracion", badge: 3 },
];

const BOTTOM_ITEMS: SidebarItem[] = [
  { label: "Help", icon: <HelpOutlineIcon />, to: "/help" },
  { label: "Settings", icon: <SettingsIcon />, to: "/settings" },
];

type Props = {
  collapsed: boolean;
  onToggle: () => void;
  onLogout?: () => void;
  user?: {
    name: string;
    email: string;
  };
};

export default function Sidebar({ collapsed, onToggle, onLogout, user }: Props) {
  const location = useLocation();

  const drawerWidth = collapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

  const renderItem = (item: SidebarItem) => {
    const isActive = location.pathname === item.to;

    const button = (
      <ListItemButton
        component={NavLink}
        to={item.to}
        sx={styles.itemButton(isActive)}
      >
        <ListItemIcon sx={styles.itemIcon(collapsed, isActive)}>
          {item.badge ? (
            <Badge color="success" badgeContent={item.badge}>
              {item.icon}
            </Badge>
          ) : (
            item.icon
          )}
        </ListItemIcon>

        {!collapsed && (
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{ fontSize: 14, fontWeight: 700 }}
          />
        )}
      </ListItemButton>
    );

    // Tooltip solo cuando colapsa
    return collapsed ? (
      <Tooltip key={item.label} title={item.label} placement="right" arrow>
        <Box>{button}</Box>
      </Tooltip>
    ) : (
      <Box key={item.label}>{button}</Box>
    );
  };

  return (
    <Drawer variant="permanent" open sx={styles.drawer(drawerWidth)}>
      {/* Header / Logo */}
      <Box sx={styles.header(collapsed)}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          <Box sx={styles.logoBox}>
            <BoltIcon />
          </Box>

          {!collapsed && (
            <Typography fontWeight={900} letterSpacing={0.2}>
             {/* aqui titulo */}
            </Typography>
          )}
        </Stack>

        {!collapsed && (
          <IconButton onClick={onToggle} sx={styles.headerToggleBtn}>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Toggle flotante cuando está colapsado */}
      {collapsed && (
        <Box sx={styles.collapsedToggleWrap}>
          <IconButton onClick={onToggle} sx={styles.collapsedToggleBtn}>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Main Nav */}
      <Box sx={styles.mainWrap}>
        {!collapsed && (
          <Typography sx={styles.menuLabel}>Menú</Typography>
        )}
        <List disablePadding>{MAIN_ITEMS.map(renderItem)}</List>
      </Box>

      <Divider sx={styles.divider} />

      {/* Bottom Nav */}
      <List disablePadding sx={styles.bottomList}>
        {BOTTOM_ITEMS.map(renderItem)}
      </List>

      <Divider sx={styles.divider} />

      {/* User / Logout */}
      <Box sx={styles.userWrap}>
        <Stack direction="row" alignItems="center" spacing={1.2} sx={styles.userCard}>
          <Avatar sx={styles.avatar}>
            {(user?.name?.[0] ?? "U").toUpperCase()}
          </Avatar>

          {!collapsed && (
            <Box sx={styles.userTextWrap}>
              <Typography sx={styles.userName} noWrap>
                {user?.name ?? "Usuario"}
              </Typography>
              <Typography sx={styles.userEmail} noWrap>
                {user?.email ?? "user@dominio.com"}
              </Typography>
            </Box>
          )}

          {!collapsed && (
            <IconButton onClick={onLogout} sx={styles.logoutBtn}>
              <LogoutIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>

        {/* Tooltip logout si está colapsado */}
        {collapsed && (
          <Box sx={styles.collapsedLogoutWrap}>
            <Tooltip title="Salir" placement="right" arrow>
              <IconButton onClick={onLogout} sx={styles.collapsedLogoutBtn}>
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
