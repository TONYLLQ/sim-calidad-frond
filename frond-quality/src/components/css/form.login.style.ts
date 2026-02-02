// LoginForm.styles.ts
import type { SxProps, Theme } from "@mui/material/styles";

export const loginSx = {
  container: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    p: 2,
    background: "linear-gradient(135deg, #0c3b75, #0e4a8a)",
  } satisfies SxProps<Theme>,

  shell: {
    width: "100%",
    maxWidth: 420,
  } satisfies SxProps<Theme>,

  paper: {
    position: "relative",
    overflow: "hidden",
    width: "100%",
    p: 3.5, // 28px
    borderRadius: 0, // ⚠️ en tu CSS dice "border-radius: px;" (está vacío). Lo dejo en 0 para no inventar.
    background: "#ffffff",
    border: "1px solid transparent",
    backgroundImage:
      "linear-gradient(#ffffff, #ffffff), linear-gradient(135deg, #0b3c7d, #0f4c97, #38bdf8, #7fe3b5)",
    backgroundOrigin: "border-box",
    backgroundClip: "padding-box, border-box",
    boxShadow:
      "0 18px 45px rgba(0, 0, 0, 0.20), 0 2px 10px rgba(0, 0, 0, 0.10)",

    // ::before barra superior
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      height: "12px",
      width: "100%",
      background: "linear-gradient(90deg, #0b3c7d, #0f4c97, #2bb673)",
    },

    // ::after brillo decorativo
    "&::after": {
      content: '""',
      position: "absolute",
      top: "-70px",
      right: "-70px",
      width: "190px",
      height: "190px",
      background: "radial-gradient(circle, rgba(15, 76, 151, 0.18), transparent 65%)",
      pointerEvents: "none",
    },
  } satisfies SxProps<Theme>,

  header: {
    textAlign: "center",
    mb: "18px",
  } satisfies SxProps<Theme>,

  iconBox: {
    width: 56,
    height: 56,
    m: "4px auto 14px auto",
    borderRadius: "14px",
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg, #1e3a5f, #3a6b8c)",
    boxShadow: "0 10px 24px rgba(30, 58, 95, 0.25)",
  } satisfies SxProps<Theme>,

  iconSvg: {
    color: "#fff",
  } satisfies SxProps<Theme>,

  title: {
    fontWeight: 800,
    color: "#0f172a",
  } satisfies SxProps<Theme>,

  subtitle: {
    mt: "6px",
    color: "#64748b",
  } satisfies SxProps<Theme>,

  divider: {
    my: "16px",
    mb: "18px",
  } satisfies SxProps<Theme>,

  alert: {
    mb: "14px",
  } satisfies SxProps<Theme>,

  // Estilo equivalente a .mui-field + selectores internos MUI
  textField: {
    "& .MuiInputBase-root": {
      background: "#f8fafc",
      borderRadius: "12px",
      transition: "box-shadow 160ms ease, background 160ms ease",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#e2e8f0",
    },
    "& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#cbd5e1",
    },
    "& .MuiInputBase-root.Mui-focused": {
      background: "#ffffff",
      boxShadow: "0 0 0 4px rgba(15, 76, 151, 0.12)",
    },
    "& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#3a6b8c",
    },
    "& .MuiFormHelperText-root": {
      marginLeft: "4px",
    },
  } satisfies SxProps<Theme>,

  fieldIcon: {
    color: "#94a3b8",
  } satisfies SxProps<Theme>,

  button: {
    height: 48,
    borderRadius: "12px",
    fontWeight: 800,
    letterSpacing: "0.2px",
    background: "linear-gradient(90deg, #1e3a5f, #3a6b8c)",
    boxShadow: "0 14px 28px rgba(30, 58, 95, 0.24)",
    textTransform: "none",
    "&:hover": {
      filter: "brightness(1.03)",
      background: "linear-gradient(90deg, #1e3a5f, #3a6b8c)",
    },
    "&.Mui-disabled": {
      opacity: 0.75,
      color: "rgba(255,255,255,0.9)",
    },
  } satisfies SxProps<Theme>,

  footer: {
    display: "flex",
    justifyContent: "flex-end",
  } satisfies SxProps<Theme>,

  linkBtn: {
    border: 0,
    background: "transparent",
    p: 0,
    cursor: "pointer",
    fontSize: "0.9rem",
    color: "#64748b",
    "&:hover": {
      color: "#3a6b8c",
      textDecoration: "underline",
    },
  } satisfies SxProps<Theme>,
} as const;
