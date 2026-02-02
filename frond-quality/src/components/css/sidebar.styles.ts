// sidebar.styles.ts
import type { SxProps, Theme } from "@mui/material/styles";

export const DRAWER_WIDTH = 260;
export const DRAWER_COLLAPSED_WIDTH = 72;

export const styles = {
  drawer: (drawerWidth: number) =>
    ({
      width: drawerWidth,
      flexShrink: 0,
      "& .MuiDrawer-paper": {
        width: drawerWidth,
        boxSizing: "border-box",
        borderRight: "1px solid rgba(255,255,255,0.12)",
        background: "linear-gradient(180deg, #0c3b75 0%, #0e4a8a 100%)",
        color: "white",
        overflowX: "hidden",
        position: "fixed",
      },
    } satisfies SxProps<Theme>),

  header: (collapsed: boolean) =>
    ({
      height: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: collapsed ? "center" : "space-between",
      px: collapsed ? 0 : 2,
      borderBottom: "1px solid rgba(255,255,255,0.12)",
    } satisfies SxProps<Theme>),

  logoBox: {
    width: 36,
    height: 36,
    borderRadius: 2,
    display: "grid",
    placeItems: "center",
    background: "rgba(255,255,255,0.14)",
  } satisfies SxProps<Theme>,

  headerToggleBtn: {
    color: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: 2,
    width: 34,
    height: 34,
  } satisfies SxProps<Theme>,

  collapsedToggleWrap: {
    display: "flex",
    justifyContent: "center",
    mt: 1,
  } satisfies SxProps<Theme>,

  collapsedToggleBtn: {
    color: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "999px",
    width: 34,
    height: 34,
    background: "rgba(255,255,255,0.08)",
  } satisfies SxProps<Theme>,

  mainWrap: {
    flex: 1,
    mt: 1,
  } satisfies SxProps<Theme>,

  menuLabel: {
    px: 2,
    pt: 1,
    pb: 0.5,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.70)",
    fontWeight: 700,
  } satisfies SxProps<Theme>,

  divider: {
    borderColor: "rgba(255,255,255,0.12)",
  } satisfies SxProps<Theme>,

  bottomList: {
    py: 1,
  } satisfies SxProps<Theme>,

  userWrap: {
    p: 1.5,
  } satisfies SxProps<Theme>,

  userCard: {
    px: 1,
    py: 1,
    borderRadius: 2,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.10)",
  } satisfies SxProps<Theme>,

  avatar: {
    width: 34,
    height: 34,
    bgcolor: "rgba(255,255,255,0.18)",
  } satisfies SxProps<Theme>,

  userTextWrap: {
    flex: 1,
    minWidth: 0,
  } satisfies SxProps<Theme>,

  userName: {
    fontWeight: 800,
    fontSize: 13,
  } satisfies SxProps<Theme>,

  userEmail: {
    fontSize: 11,
    opacity: 0.8,
  } satisfies SxProps<Theme>,

  logoutBtn: {
    color: "rgba(255,255,255,0.9)",
    borderRadius: 2,
    "&:hover": { background: "rgba(255,255,255,0.10)" },
  } satisfies SxProps<Theme>,

  collapsedLogoutWrap: {
    display: "flex",
    justifyContent: "center",
    mt: 1,
  } satisfies SxProps<Theme>,

  collapsedLogoutBtn: {
    color: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.08)",
  } satisfies SxProps<Theme>,

  // ===== Items =====
  itemButton: ( isActive: boolean) =>
    ({
      mx: 1,
      my: 0.5,
      borderRadius: 2,
      minHeight: 44,
      color: isActive ? "#0f4c97" : "rgba(255,255,255,0.92)",
      backgroundColor: isActive ? "rgba(255,255,255,0.16)" : "transparent",
      "&:hover": {
        backgroundColor: "rgba(255,255,255,0.12)",
      },
    } satisfies SxProps<Theme>),

  itemIcon: (collapsed: boolean, isActive: boolean) =>
    ({
      minWidth: 0,
      mr: collapsed ? 0 : 1.5,
      justifyContent: "center",
      color: isActive ? "#0f4c97" : "rgba(255,255,255,0.85)",
    } satisfies SxProps<Theme>),
} as const;
