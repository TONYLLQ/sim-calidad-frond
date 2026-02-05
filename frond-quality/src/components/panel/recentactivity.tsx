import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

const activities = [
  { id: 1, user: { name: "Olivia Martin", initials: "OM" }, action: "completed a purchase", amount: "+$1,999.00", time: "2 min ago" },
  { id: 2, user: { name: "Jackson Lee", initials: "JL" }, action: "subscribed to Pro plan", amount: "+$39.00", time: "15 min ago" },
  { id: 3, user: { name: "Isabella Nguyen", initials: "IN" }, action: "completed a purchase", amount: "+$299.00", time: "1 hour ago" },
  { id: 4, user: { name: "William Kim", initials: "WK" }, action: "completed a purchase", amount: "+$99.00", time: "2 hours ago" },
  { id: 5, user: { name: "Sofia Davis", initials: "SD" }, action: "subscribed to Pro plan", amount: "+$39.00", time: "3 hours ago" },
];

export default function RecentActivity({ sx }: { sx?: any }) {
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        height: "100%",     // ✅ llena el alto del contenedor
        minHeight: 0,       // ✅ importante
        minWidth: 0,        // ✅ importante
        borderRadius: 2,
        border: "1px solid rgba(0,0,0,0.08)",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        ...sx,
      }}
    >
      <Box sx={{ p: 2.5, pb: 1.5 }}>
        <Typography variant="h6" fontWeight={900}>
          Recent Activity
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          Latest transactions and user activity
        </Typography>
      </Box>

      <Box sx={{ px: 2.5, pb: 2.5, flex: 1, minHeight: 0, overflow: "auto" }}>
        <Stack spacing={2.5}>
          {activities.map((a) => (
            <Box key={a.id} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "rgba(0,0,0,0.06)",
                  color: "rgba(0,0,0,0.75)",
                  fontWeight: 900,
                  fontSize: 12,
                }}
              >
                {a.user.initials}
              </Avatar>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 900 }} noWrap>
                  {a.user.name}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.65 }}>
                  {a.action}
                </Typography>
              </Box>

              <Box sx={{ textAlign: "right" }}>
                <Typography variant="body2" sx={{ fontWeight: 900, color: "#1a7f37" }}>
                  {a.amount}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.65 }}>
                  {a.time}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}
