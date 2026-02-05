import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/Login";

import Migratorio from "../pages/controlmigratorio"
import Pasaporte from "../pages/emisionpasaporte"
import Inmigracion from "../pages/inmigracion"
import Nacionalizacion from "../pages/nacionalizacion"

import PrivateRoute from "./PrivateRoute";
import Dashboard from "../pages/dashboard";
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTA PÚBLICA */}
        <Route path="/login" element={<LoginPage />} />

        {/* RUTAS PROTEGIDAS */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/control-migratorio" element={<Migratorio />} />

          <Route path="/emision-pasaporte" element={<Pasaporte />} />

          <Route path="/nacionalizacion" element={<Nacionalizacion />} />

          <Route path="/inmigracion" element={<Inmigracion />} />

        </Route>

        {/* DEFAULT: todo va a /rules */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
