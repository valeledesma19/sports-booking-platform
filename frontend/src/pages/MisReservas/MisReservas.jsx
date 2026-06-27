import { useEffect, useState } from "react";
import { cancelarReserva, getMisReservas } from "../../services/reservaService";
import "./MisReservas.css";
import { getCanchasActivas } from "../../services/canchaService";
function MisReservas() {
  const [reservas, setReservas] = useState([]);
  const [canchas, setCanchas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODAS");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const obtenerIdReserva = (reserva) => reserva.id || reserva.idReserva;

  const obtenerIdCancha = (cancha) => cancha.id || cancha.idCancha;

  const obtenerCanchaIdDeReserva = (reserva) => {
    return (
      reserva.cancha?.id ||
      reserva.cancha?.idCancha ||
      reserva.canchaId ||
      reserva.idCancha
    );
  };

  const obtenerNombreCancha = (reserva) => {
    if (reserva.cancha?.nombre) return reserva.cancha.nombre;
    if (reserva.nombreCancha) return reserva.nombreCancha;
    if (reserva.canchaNombre) return reserva.canchaNombre;

    const canchaId = obtenerCanchaIdDeReserva(reserva);

    const canchaEncontrada = canchas.find(
      (cancha) => Number(obtenerIdCancha(cancha)) === Number(canchaId)
    );

    return canchaEncontrada?.nombre || "Cancha";
  };

  const obtenerEstado = (reserva) => {
    return reserva.estado || reserva.estadoReserva || "PENDIENTE";
  };

  const cargarReservas = async () => {
    try {
      setLoading(true);
      setError("");

      const [reservasData, canchasData] = await Promise.all([
        getMisReservas(),
        getCanchasActivas(),
      ]);

      setReservas(reservasData);
      setCanchas(canchasData);
    } catch (error) {
      setError(error.message || "Error al cargar tus reservas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const handleCancelar = async (id) => {
    const confirmar = window.confirm("¿Seguro que querés cancelar esta reserva?");

    if (!confirmar) return;

    try {
      setError("");
      await cancelarReserva(id);
      await cargarReservas();
    } catch (error) {
      setError(error.message || "No se pudo cancelar la reserva");
    }
  };

  const reservasFiltradas = reservas.filter((reserva) => {
    const estado = obtenerEstado(reserva);
    const cancha = obtenerNombreCancha(reserva).toLowerCase();

    const coincideBusqueda = cancha.includes(busqueda.toLowerCase());

    const coincideEstado =
      filtroEstado === "TODAS" || estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  return (
    <div className="mis-reservas-page">
      <div className="page-header">
        <h1>Mis reservas</h1>
        <p>Reservas realizadas por tu usuario.</p>
      </div>

      {error && <div className="page-error">{error}</div>}

      <div className="page-card mis-reservas-list">
        <div className="mis-reservas-header">
          <h2>Listado de mis reservas</h2>

          <button className="secondary-small-button" onClick={cargarReservas}>
            Actualizar
          </button>
        </div>

        <div className="mis-reservas-filtros">
          <input
            type="text"
            placeholder="Buscar por cancha..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="TODAS">Todas</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="CONFIRMADA">Confirmadas</option>
            <option value="CANCELADA">Canceladas</option>
            <option value="FINALIZADA">Finalizadas</option>
          </select>
        </div>

        {loading ? (
          <p>Cargando reservas...</p>
        ) : reservasFiltradas.length === 0 ? (
          <p>No hay reservas para mostrar.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Cancha</th>
                <th>Fecha</th>
                <th>Horario</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {reservasFiltradas.map((reserva) => {
                const estado = obtenerEstado(reserva);

                return (
                  <tr key={obtenerIdReserva(reserva)}>
                    <td>{obtenerNombreCancha(reserva)}</td>
                    <td>{reserva.fecha}</td>
                    <td>
                      {reserva.horaInicio} - {reserva.horaFin}
                    </td>
                    <td>
                      <span className={`badge estado-${estado.toLowerCase()}`}>
                        {estado}
                      </span>
                    </td>
                    <td className="actions">
                      {estado !== "CANCELADA" && estado !== "FINALIZADA" ? (
                        <button
                          className="danger"
                          onClick={() =>
                            handleCancelar(obtenerIdReserva(reserva))
                          }
                        >
                          Cancelar
                        </button>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default MisReservas;

