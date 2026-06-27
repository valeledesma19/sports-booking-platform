import { useEffect, useState } from "react";
import { getUserFromToken, isAdmin } from "../../utils/auth";
import { getDashboardAdmin } from "../../services/dashboardService";
import { getMisReservas } from "../../services/reservaService";
import "./Dashboard.css";

function Dashboard() {
  const user = getUserFromToken();

  const [resumenAdmin, setResumenAdmin] = useState(null);
  const [misReservas, setMisReservas] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const obtenerEstado = (reserva) => {
    return reserva.estado || reserva.estadoReserva || "PENDIENTE";
  };

  const obtenerProximaReserva = (reservas) => {
    const hoy = new Date();

    const reservasActivas = reservas
      .filter((reserva) => obtenerEstado(reserva) !== "CANCELADA")
      .filter((reserva) => {
        const fechaHora = new Date(`${reserva.fecha}T${reserva.horaInicio}`);
        return fechaHora >= hoy;
      })
      .sort((a, b) => {
        const fechaA = new Date(`${a.fecha}T${a.horaInicio}`);
        const fechaB = new Date(`${b.fecha}T${b.horaInicio}`);
        return fechaA - fechaB;
      });

    return reservasActivas[0];
  };

  const obtenerNombreCancha = (reserva) => {
    if (!reserva) return "-";
    if (reserva.cancha?.nombre) return reserva.cancha.nombre;
    return reserva.nombreCancha || "Cancha";
  };

  const cargarDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      if (isAdmin()) {
        const data = await getDashboardAdmin();
        setResumenAdmin(data);
      } else {
        const data = await getMisReservas();
        setMisReservas(data);
      }
    } catch (error) {
      setError(error.message || "Error al cargar el dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDashboard();
  }, []);

  const proximaReserva = obtenerProximaReserva(misReservas);

  const reservasActivas = misReservas.filter(
    (reserva) => obtenerEstado(reserva) !== "CANCELADA"
  ).length;

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>
          Bienvenida/o <strong>{user?.email}</strong>
        </p>
      </div>

      {error && <div className="page-error">{error}</div>}

      {loading ? (
        <div className="page-card">
          <p>Cargando dashboard...</p>
        </div>
      ) : isAdmin() ? (
        <>
          <h2 className="section-title">Panel de administrador</h2>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>Reservas hoy</h3>
              <p>{resumenAdmin?.reservasHoy ?? 0}</p>
            </div>

            <div className="stat-card">
              <h3>Reservas del mes</h3>
              <p>{resumenAdmin?.reservasMes ?? 0}</p>
            </div>

            <div className="stat-card">
              <h3>Reservas pendientes</h3>
              <p>{resumenAdmin?.reservasPendientes ?? 0}</p>
            </div>

            <div className="stat-card">
              <h3>Canceladas</h3>
              <p>{resumenAdmin?.reservasCanceladas ?? 0}</p>
            </div>

            <div className="stat-card">
              <h3>Ingresos estimados</h3>
              <p>${resumenAdmin?.ingresosEstimadosMes ?? 0}</p>
            </div>

            <div className="stat-card">
              <h3>Cancha más reservada</h3>
              <p className="small-stat">
                {resumenAdmin?.canchaMasReservada || "-"}
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <h2 className="section-title">Panel de cliente</h2>

          <div className="stats-grid user-grid">
            <div className="stat-card">
              <h3>Mis reservas activas</h3>
              <p>{reservasActivas}</p>
            </div>

            <div className="stat-card">
              <h3>Próxima reserva</h3>
              <p className="small-stat">
                {proximaReserva
                  ? `${obtenerNombreCancha(proximaReserva)} - ${proximaReserva.fecha} ${proximaReserva.horaInicio}`
                  : "-"}
              </p>
            </div>
          </div>

          <div className="page-card user-help-card">
            <h3>Reservá una cancha</h3>
            <p>
              Desde el menú lateral podés hacer una nueva reserva o consultar
              tus reservas.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;

