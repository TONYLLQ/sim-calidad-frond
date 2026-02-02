import * as React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";

export type ColumnDef<T> = {
  key: keyof T; // ✅ ahora es tipado (sin any)
  header: string;
  width?: number | string;
  align?: "left" | "center" | "right";
  accessor?: (row: T) => React.ReactNode; // si quieres transformar el valor
  render?: (row: T) => React.ReactNode;   // si quieres renderizar botones/chips/etc.
};

type Props<T> = {
  title?: string;
  rows: T[];
  columns: ColumnDef<T>[];

  enableSearch?: boolean;
  // si no lo pasas, buscará en todas las columnas por default
  searchKeys?: (keyof T)[];
  initialPageSize?: number;

  // opcional: placeholder del buscador
  searchPlaceholder?: string;
};

function toText(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return "";
}

export default function DataTableLocal<T extends Record<string, unknown>>(
  props: Props<T>
) {
  const {
    title = "Listado",
    rows,
    columns,
    enableSearch = true,
    searchKeys,
    initialPageSize = 10,
    searchPlaceholder = "Buscar...",
  } = props;

  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(initialPageSize);
  const [search, setSearch] = React.useState("");

  // Si no pasas searchKeys, usamos todas las columnas (por sus keys)
  const keysToSearch = React.useMemo<(keyof T)[]>(() => {
    if (searchKeys && searchKeys.length) return searchKeys;
    return columns.map((c) => c.key);
  }, [searchKeys, columns]);

  const filteredRows = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!enableSearch || q.length === 0) return rows;

    return rows.filter((row) =>
      keysToSearch.some((k) => {
        const value = row[k]; // ✅ sin any
        return toText(value).toLowerCase().includes(q);
      })
    );
  }, [rows, search, enableSearch, keysToSearch]);

  const pagedRows = React.useMemo(() => {
    const start = page * pageSize;
    const end = start + pageSize;
    return filteredRows.slice(start, end);
  }, [filteredRows, page, pageSize]);

  // Si cambia búsqueda o rows, resetea a página 0
  React.useEffect(() => {
    setPage(0);
  }, [search, rows]);

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "grey.300",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h6" fontWeight={800}>
          {title}
        </Typography>

        {enableSearch ? (
          <TextField
            size="small"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        ) : null}
      </Toolbar>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((c) => (
                <TableCell
                  key={String(c.key)}
                  align={c.align ?? "left"}
                  sx={{ fontWeight: 800, width: c.width }}
                >
                  {c.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {pagedRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  sx={{
                    py: 6,
                    textAlign: "center",
                    color: "text.secondary",
                  }}
                >
                  Sin datos
                </TableCell>
              </TableRow>
            ) : null}

            {pagedRows.map((row, idx) => (
              <TableRow key={idx} hover>
                {columns.map((c) => (
                  <TableCell key={String(c.key)} align={c.align ?? "left"}>
                    {c.render
                      ? c.render(row)
                      : c.accessor
                      ? c.accessor(row)
                      : toText(row[c.key])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredRows.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e) => {
          setPage(0);
          setPageSize(Number(e.target.value));
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Filas"
      />
    </Paper>
  );
}
