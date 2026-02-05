import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Jan", value: 2400, previous: 1800 },
  { name: "Feb", value: 1398, previous: 2100 },
  { name: "Mar", value: 9800, previous: 7200 },
  { name: "Apr", value: 3908, previous: 3400 },
  { name: "May", value: 4800, previous: 4100 },
  { name: "Jun", value: 3800, previous: 3200 },
  { name: "Jul", value: 4300, previous: 3800 },
  { name: "Aug", value: 5300, previous: 4200 },
  { name: "Sep", value: 4900, previous: 4000 },
  { name: "Oct", value: 6300, previous: 5100 },
  { name: "Nov", value: 5400, previous: 4800 },
  { name: "Dec", value: 7200, previous: 5900 },
];

export default function OverviewChart({ sx }: { sx?: any }) {
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        height: "100%",     // ✅ llena el alto del grid
        minHeight: 0,
        minWidth: 0,        // ✅ evita width -1
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
          Revenue Overview
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.7 }}>
          Monthly revenue comparison for the current and previous year
        </Typography>
      </Box>

      <Box sx={{ px: 2.5, pb: 2.5, flex: 1, minHeight: 260, minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} fontSize={12} />
            <Tooltip />
            <Area type="monotone" dataKey="previous" strokeWidth={2} />
            <Area type="monotone" dataKey="value" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
