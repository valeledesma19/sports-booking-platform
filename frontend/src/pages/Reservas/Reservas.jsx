import { useEffect, useState } from "react";
import {
  cancelarReserva,
  confirmarReserva,
  finalizarReserva,
  getReservas,
} from "../../services/reservaService";
import "./Reservas.css";
import { getCanchas } from "../../services/canchaService";
function Reservas() {
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

  const obtenerNombreCliente = (reserva) => {
    if (reserva.cliente?.nombre) return reserva.cliente.nombre;
    if (reserva.usuario?.nombre) return reserva.usuario.nombre;
    if (reserva.clienteNombre) return reserva.clienteNombre;
    if (reserva.nombreCliente) return reserva.nombreCliente;
    if (reserva.emailCliente) return reserva.emailCliente;
    if (reserva.usuario?.email) return reserva.usuario.email;

    return "Cliente";
  };

  const obtenerEstado = (reserva) => {
    return reserva.estado || reserva.estadoReserva || "PENDIENTE";
  };

  const cargarReservas = async () => {
    try {
      setLoading(true);
      setError("");

      const [reservasData, canchasData] = await Promise.all([
        getReservas(),
        getCanchas(),
      ]);

      setReservas(reservasData);
      setCanchas(canchasData);
    } catch (error) {
      setError(error.message || "Error al cargar las reservas");
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
  const handleConfirmar = async (id) => {
    const confirmar = window.confirm("¿Confirmar esta reserva?");

    if (!confirmar) return;

    try {
      setError("");
      await confirmarReserva(id);
      await cargarReservas();
    } catch (error) {
      setError(error.message || "No se pudo confirmar la reserva");
    }
  };

  const handleFinalizar = async (id) => {
    const confirmar = window.confirm("¿Finalizar esta reserva?");

    if (!confirmar) return;

    try {
      setError("");
      await finalizarReserva(id);
      await cargarReservas();
    } catch (error) {
      setError(error.message || "No se pudo finalizar la reserva");
    }
  };

  const reservasFiltradas = reservas.filter((reserva) => {
    const estado = obtenerEstado(reserva);
    const cliente = obtenerNombreCliente(reserva).toLowerCase();
    const cancha = obtenerNombreCancha(reserva).toLowerCase();

    const coincideBusqueda =
      cliente.includes(busqueda.toLowerCase()) ||
      cancha.includes(busqueda.toLowerCase());

    const coincideEstado =
      filtroEstado === "TODAS" || estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  return (
    <div className="reservas-page">
      <div className="page-header">
        <h1>Reservas</h1>
        <p>Gestión general de todas las reservas del sistema.</p>
      </div>

      {error && <div className="page-error">{error}</div>}

      <div className="page-card reservas-list">
        <div className="reservas-header">
          <h2>Listado de reservas</h2>

          <button className="secondary-small-button" onClick={cargarReservas}>
            Actualizar
          </button>
        </div>

        <div className="reservas-filtros">
          <input
            type="text"
            placeholder="Buscar por cliente o cancha..."
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
                <th>Cliente</th>
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
                    <td>{obtenerNombreCliente(reserva)}</td>
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
                      {estado === "PENDIENTE" && (
                        <>
                          <button
                            className="success"
                            onClick={() => handleConfirmar(obtenerIdReserva(reserva))}
                          >
                            Confirmar
                          </button>

                          <button
                            className="danger"
                            onClick={() => handleCancelar(obtenerIdReserva(reserva))}
                          >
                            Cancelar
                          </button>
                        </>
                      )}

                      {estado === "CONFIRMADA" && (
                        <>
                          <button
                            className="finish"
                            onClick={() => handleFinalizar(obtenerIdReserva(reserva))}
                          >
                            Finalizar
                          </button>

                          <button
                            className="danger"
                            onClick={() => handleCancelar(obtenerIdReserva(reserva))}
                          >
                            Cancelar
                          </button>
                        </>
                      )}

                      {(estado === "CANCELADA" || estado === "FINALIZADA") && <span>-</span>}
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

export default Reservas;

