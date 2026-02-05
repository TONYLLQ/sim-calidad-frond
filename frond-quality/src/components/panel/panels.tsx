import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

/* ==============================
   SECTION WRAPPER
============================== */
export function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" fontWeight={800} sx={{ mb: 0.5 }}>
        {title}
      </Typography>

      {subtitle && (
        <Typography variant="body2" sx={{ opacity: 0.7, mb: 2 }}>
          {subtitle}
        </Typography>
      )}

      {children}
    </Box>
  );
}

/* ==============================
   CARD PLACEHOLDER
============================== */
export function CardPlaceholder() {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 2,
        p: 2.5,
        minHeight: 110,
        background: "#fff",
      }}
    />
  );
}

/* ==============================
   PANEL PLACEHOLDER
============================== */
export function PanelPlaceholder({
  height = 180,
}: {
  height?: number;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 2,
        p: 2.5,
        background: "#fff",
        minHeight: height,
      }}
    />
  );
}
