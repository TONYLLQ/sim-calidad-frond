import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import axios from "axios";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import LoginIcon from "@mui/icons-material/Login";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { loginApi } from "../../api/auth";

type LoginFormValues = {
  username: string;
  password: string;
};

type Props = {
  onSuccess: () => void;
};

type ApiError = {
  detail?: string;
  message?: string;
};

export default function LoginForm({ onSuccess }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { username: "", password: "" },
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    setServerError("");

    try {
      const res = await loginApi(values);

      const token = res.token ?? res.access ?? res.access_token;
      if (!token) {
        setServerError("La API no devolvió token. Revisa el response del login.");
        return;
      }

      localStorage.setItem("access_token", token);
      onSuccess();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const data = err.response?.data as ApiError | undefined;

        if (status === 400 || status === 401) {
          setServerError(data?.detail || data?.message || "Usuario o contraseña incorrectos.");
          return;
        }

        setServerError("Error de servidor. Intenta nuevamente.");
        return;
      }

      setServerError("Error inesperado.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        bgcolor: "#f5f5f5",
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 3,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "grey.300",
          bgcolor: "white",
        }}
      >
        <Typography variant="h5" fontWeight={800}>
          Iniciar sesión
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Ingresa tu usuario y contraseña.
        </Typography>

        <Divider sx={{ my: 2 }} />

        {serverError ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {serverError}
          </Alert>
        ) : null}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2}>
            <TextField
              label="Usuario"
              autoComplete="username"
              fullWidth
              {...register("username", {
                required: "El usuario es obligatorio",
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
              })}
              error={Boolean(errors.username)}
              helperText={errors.username?.message}
            />

            <TextField
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              fullWidth
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
              })}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              startIcon={<LoginIcon />}
              disabled={isSubmitting}
              sx={{
                bgcolor: "#1f1f1f",
                "&:hover": { bgcolor: "#2c2c2c" },
                py: 1.2,
                fontWeight: 700,
              }}
            >
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
