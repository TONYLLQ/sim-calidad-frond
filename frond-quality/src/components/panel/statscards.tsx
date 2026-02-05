import Grid from "@mui/material/GridLegacy";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const stats = [
  { title: "Total Revenue", value: "$45,231.89", sub: "+20.1% from last month" },
  { title: "Active Users", value: "2,350", sub: "+180.1% from last month" },
  { title: "Sales", value: "+12,234", sub: "+19% from last month" },
  { title: "Active Now", value: "573", sub: "-2.5% from last hour" },
];

export default function ModuleCards() {
  return (
    <Grid container spacing={2} alignItems="stretch">
      {stats.map((s) => (
        <Grid key={s.title} item xs={12} sm={6} lg={3} sx={{ display: "flex" }}>
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              p: 2.4,
              borderRadius: 2,
              border: "1px solid rgba(0,0,0,0.08)",
              background: "#fff",
              minHeight: 120,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 800 }}>
              {s.title}
            </Typography>

            <Typography variant="h5" fontWeight={900} sx={{ mt: 0.5 }}>
              {s.value}
            </Typography>

            <Typography variant="caption" sx={{ mt: 0.5, opacity: 0.7 }}>
              {s.sub}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
