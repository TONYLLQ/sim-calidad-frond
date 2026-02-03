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
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { loginApi } from "../../api/auth";
import { loginSx } from "../css/form.login.style.ts";
import HeaderMigra from "../header/headerMigra";

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

      const token = (res as any).token ?? (res as any).access ?? (res as any).access_token;
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
    <Box sx={loginSx.container}>
      <HeaderMigra />
      <Box sx={loginSx.shell}>
        <Paper elevation={0} sx={loginSx.paper}>
          {/* Header */}
          <Box sx={loginSx.header}>
            <Box sx={loginSx.iconBox}>
              <LockOutlinedIcon sx={loginSx.iconSvg} />
            </Box>

            <Typography sx={loginSx.title} variant="h5">
              Bienvenido
            </Typography>

            <Typography sx={loginSx.subtitle} variant="body2">
              Ingresa tu usuario y contraseña.
            </Typography>
          </Box>

          <Divider sx={loginSx.divider} />

          {serverError ? (
            <Alert severity="error" sx={loginSx.alert}>
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
                sx={loginSx.textField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon sx={loginSx.fieldIcon} />
                    </InputAdornment>
                  ),
                }}
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
                sx={loginSx.textField}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={loginSx.fieldIcon} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((s) => !s)}
                        edge="end"
                        aria-label="Mostrar/ocultar contraseña"
                      >
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
                sx={loginSx.button}
              >
                {isSubmitting ? "Ingresando..." : "Ingresar"}
              </Button>

              <Box sx={loginSx.footer}>
                <Box component="button" type="button" sx={loginSx.linkBtn}>
                  ¿Olvidaste tu contraseña?
                </Box>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
