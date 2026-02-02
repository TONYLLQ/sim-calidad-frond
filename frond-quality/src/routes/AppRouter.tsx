import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/Login";
import Rule from "../pages/rules";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../pages/Dashboard";
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTA PÚBLICA */}
        <Route path="/login" element={<LoginPage />} />

        {/* RUTAS PROTEGIDAS */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/rules" element={<Rule />} />
        </Route>

        {/* DEFAULT: todo va a /rules */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
