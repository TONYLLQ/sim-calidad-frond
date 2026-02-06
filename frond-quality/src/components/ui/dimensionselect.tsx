import * as React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

type ApiError = { detail?: string; message?: string };

type Props<T, V extends string | number> = {
  label?: string;
  placeholder?: string;

  fetcher: () => Promise<T[]>;

  getValue: (item: T) => V;
  getLabel: (item: T) => string;

  value: V | "";

  onChangeValue: (value: V) => void;
  onChangeItem?: (item: T) => void;

  // opciones
  sort?: (a: T, b: T) => number;
  filter?: (item: T) => boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;

  // UX
  showErrorAlert?: boolean; // por defecto true
};

export default function ApiSelect<T, V extends string | number>({
  label = "Seleccionar",
  placeholder = "Seleccionar...",
  fetcher,
  getValue,
  getLabel,
  value,
  onChangeValue,
  onChangeItem,
  sort,
  filter,
  disabled,
  fullWidth = true,
  error,
  helperText,
  showErrorAlert = true,
}: Props<T, V>) {
  const [items, setItems] = React.useState<T[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [apiError, setApiError] = React.useState<string>("");

  const load = React.useCallback(async () => {
    setLoading(true);
    setApiError("");

    try {
      const data = await fetcher();

      let arr = data;
      if (filter) arr = arr.filter(filter);
      if (sort) arr = [...arr].sort(sort);

      setItems(arr);
    } catch (e: unknown) {
      const err = e as { response?: { data?: ApiError } };
      setApiError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "No se pudo cargar opciones."
      );
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [fetcher, filter, sort]);

  React.useEffect(() => {
    void load();
  }, [load]);

  return (
    <Box>
      {showErrorAlert && apiError ? (
        <Alert severity="error" sx={{ mb: 1 }}>
          {apiError}
        </Alert>
      ) : null}

      <TextField
        select
        label={label}
        value={value}
        onChange={(e) => {
          const raw = e.target.value;

          // MUI devuelve string siempre, convertimos:
          const selectedValue = (typeof value === "number"
            ? Number(raw)
            : String(raw)) as V;

          onChangeValue(selectedValue);

          const found = items.find((it) => getValue(it) === selectedValue);
          if (found && onChangeItem) onChangeItem(found);
        }}
        disabled={disabled || loading}
        error={error}
        helperText={helperText}
        fullWidth={fullWidth}
        InputProps={{
          endAdornment: loading ? (
            <InputAdornment position="end">
              <CircularProgress size={18} />
            </InputAdornment>
          ) : undefined,
        }}
      >
        <MenuItem value="">
          <em>{placeholder}</em>
        </MenuItem>

        {items.map((it) => {
          const v = getValue(it);
          return (
            <MenuItem key={String(v)} value={String(v)}>
              {getLabel(it)}
            </MenuItem>
          );
        })}
      </TextField>
    </Box>
  );
}
