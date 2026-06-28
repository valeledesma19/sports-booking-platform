import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Canchas from "../pages/Canchas/Canchas";
import Deportes from "../pages/Deportes/Deportes";
import Reservas from "../pages/Reservas/Reservas";
import MisReservas from "../pages/MisReservas/MisReservas";
import NuevaReserva from "../pages/NuevaReserva/NuevaReserva";
import PublicRoute from "../components/PublicRoute/PublicRoute";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import MainLayout from "../components/MainLayout/MainLayout";
import Home from "../pages/Home/Home";
import Calendario from "../pages/Calendario/Calendario";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/canchas"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <MainLayout>
              <Canchas />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/deportes"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <MainLayout>
              <Deportes />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reservas"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <MainLayout>
              <Reservas />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/nueva-reserva"
        element={
          <ProtectedRoute roles={["USER", "CLIENTE"]}>
            <MainLayout>
              <NuevaReserva />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/mis-reservas"
        element={
          <ProtectedRoute roles={["USER","CLIENTE"]}>
            <MainLayout>
              <MisReservas />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendario"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Calendario />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;

