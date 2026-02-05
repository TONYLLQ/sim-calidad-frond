import { useMemo, useState } from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import { Bell, ChevronDown, Search } from "lucide-react";

export default function Header({
  sidebarCollapsed,
  title = "Overview",
  envLabel = "Production",
  user,
  onLogout,
}) {
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  const leftOffset = sidebarCollapsed ? 72 : 260;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const initials = useMemo(() => {
    const name = user?.name || "Usuario";
    const parts = name.trim().split(/\s+/);
    const a = parts[0]?.[0] || "U";
    const b = parts[1]?.[0] || "";
    return (a + b).toUpperCase();
  }, [user?.name]);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        left: `${leftOffset}px`,
        width: `calc(100% - ${leftOffset}px)`,
        zIndex: 1200,
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        backgroundColor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(8px)",
        transition: "left 0.45s cubic-bezier(0.4, 0, 0.2, 1), width 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <Toolbar sx={{ minHeight: 64, px: 2.5, display: "flex", gap: 2 }}>
        {/* Left */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1 }}>
          <Typography variant="h6" fontWeight={900} sx={{ color: "rgba(0,0,0,0.88)" }}>
            {title}
          </Typography>

          <Chip
            label={envLabel}
            size="small"
            sx={{
              fontWeight: 800,
              bgcolor: "rgba(25,118,210,0.10)",
              color: "rgba(25,118,210,0.95)",
            }}
          />
        </Box>

        {/* Search (solo lg+) */}
        {isLgUp && (
          <TextField
            size="small"
            placeholder="Search..."
            variant="outlined"
            sx={{
              width: 260,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                background: "rgba(0,0,0,0.03)",
              },
              "& fieldset": { borderColor: "rgba(0,0,0,0.10)" },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} />
                </InputAdornment>
              ),
            }}
          />
        )}

        {/* Notifications */}
        <IconButton sx={{ color: "rgba(0,0,0,0.55)" }}>
          <Badge badgeContent={3} color="primary">
            <Bell size={20} />
          </Badge>
        </IconButton>

        {/* User menu */}
        <Button
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            minWidth: 0,
            px: 1,
            borderRadius: 2,
            textTransform: "none",
            color: "rgba(0,0,0,0.75)",
            "&:hover": { background: "rgba(0,0,0,0.04)" },
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Avatar
            src={user?.avatar || ""}
            sx={{
              width: 32,
              height: 32,
              bgcolor: "rgba(25,118,210,0.15)",
              color: "rgba(25,118,210,0.95)",
              fontWeight: 900,
              fontSize: 12,
            }}
          >
            {initials}
          </Avatar>
          <ChevronDown size={16} />
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              width: 240,
              borderRadius: 2,
              border: "1px solid rgba(0,0,0,0.10)",
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.25 }}>
            <Typography fontWeight={900} sx={{ lineHeight: 1.1 }}>
              {user?.name || "Usuario"}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              {user?.email || ""}
            </Typography>
          </Box>

          <Divider />

          <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>Settings</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>Team</MenuItem>

          <Divider />

          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              onLogout?.();
            }}
            sx={{ color: "#d32f2f", fontWeight: 800 }}
          >
            Log out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
