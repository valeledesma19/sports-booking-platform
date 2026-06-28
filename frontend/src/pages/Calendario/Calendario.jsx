import { useEffect, useState } from "react";
import { getCanchasActivas } from "../../services/canchaService";
import { getDeportes } from "../../services/deporteService";
import { getHorariosOcupados, getMisReservas } from "../../services/reservaService";
import "./Calendario.css";
import { useNavigate } from "react-router-dom";
import { isAdmin } from "../../utils/auth";

function Calendario() {
  const navigate = useNavigate();
  const [canchas, setCanchas] = useState([]);
  const [deportes, setDeportes] = useState([]);

  const [canchaId, setCanchaId] = useState("");
  const [fechaBase, setFechaBase] = useState(obtenerFechaHoy());

  const [horariosOcupadosPorFecha, setHorariosOcupadosPorFecha] = useState({});
  const [misReservas, setMisReservas] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const horarios = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
  ];

  function obtenerFechaHoy() {
    const hoy = new Date();
    return hoy.toISOString().split("T")[0];
  }

  const obtenerIdCancha = (cancha) => cancha.id || cancha.idCancha;

  const obtenerIdDeporte = (deporte) => deporte.id || deporte.idDeporte;

  const obtenerDeporteIdDeCancha = (cancha) => {
    return (
      cancha.deporte?.id ||
      cancha.deporte?.idDeporte ||
      cancha.deporteId ||
      cancha.idDeporte
    );
  };

  const obtenerNombreDeporte = (cancha) => {
    if (cancha.deporte?.nombre) return cancha.deporte.nombre;
    if (typeof cancha.deporte === "string") return cancha.deporte;
    if (cancha.nombreDeporte) return cancha.nombreDeporte;
    if (cancha.deporteNombre) return cancha.deporteNombre;

    const deporteId = obtenerDeporteIdDeCancha(cancha);

    const deporteEncontrado = deportes.find(
      (deporte) => Number(obtenerIdDeporte(deporte)) === Number(deporteId)
    );

    return deporteEncontrado?.nombre || "Deporte";
  };

  const normalizarHora = (hora) => {
    if (!hora) return "";
    return hora.slice(0, 5);
  };

  const obtenerInicioSemana = (fecha) => {
    const fechaObj = new Date(`${fecha}T00:00:00`);
    const dia = fechaObj.getDay();
    const diferencia = dia === 0 ? -6 : 1 - dia;

    fechaObj.setDate(fechaObj.getDate() + diferencia);

    return fechaObj;
  };

  const formatearFechaInput = (fecha) => {
    return fecha.toISOString().split("T")[0];
  };

  const obtenerDiasSemana = () => {
    const inicio = obtenerInicioSemana(fechaBase);

    return Array.from({ length: 7 }, (_, index) => {
      const dia = new Date(inicio);
      dia.setDate(inicio.getDate() + index);

      return {
        fecha: formatearFechaInput(dia),
        nombre: dia.toLocaleDateString("es-AR", { weekday: "short" }),
        diaNumero: dia.getDate(),
      };
    });
  };

  const diasSemana = obtenerDiasSemana();

  const cargarDatosIniciales = async () => {
    try {
      setError("");

      const [canchasData, deportesData, misReservasData] = await Promise.all([
        getCanchasActivas(),
        getDeportes(),
        getMisReservas().catch(() => []),
      ]);

      setCanchas(canchasData);
      setDeportes(deportesData);
      setMisReservas(misReservasData);

      if (canchasData.length > 0) {
        setCanchaId(String(obtenerIdCancha(canchasData[0])));
      }
    } catch (error) {
      setError(error.message || "Error al cargar el calendario");
    }
  };

  const cargarHorariosSemana = async () => {
    if (!canchaId) return;

    try {
      setLoading(true);
      setError("");

      const resultados = await Promise.all(
        diasSemana.map(async (dia) => {
          const ocupados = await getHorariosOcupados(canchaId, dia.fecha);

          return {
            fecha: dia.fecha,
            ocupados,
          };
        })
      );

      const mapa = {};

      resultados.forEach((resultado) => {
        mapa[resultado.fecha] = resultado.ocupados;
      });

      setHorariosOcupadosPorFecha(mapa);
    } catch (error) {
      setError(error.message || "Error al cargar horarios de la semana");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  useEffect(() => {
    cargarHorariosSemana();
  }, [canchaId, fechaBase]);

  const canchaSeleccionada = canchas.find(
    (cancha) => Number(obtenerIdCancha(cancha)) === Number(canchaId)
  );

  const estaOcupado = (fecha, hora) => {
    const ocupados = horariosOcupadosPorFecha[fecha] || [];

    return ocupados.some((ocupado) => {
      const inicio = normalizarHora(ocupado.horaInicio);
      const fin = normalizarHora(ocupado.horaFin);

      return hora >= inicio && hora < fin;
    });
  };

  const esMiReserva = (fecha, hora) => {
    return misReservas.some((reserva) => {
      const idReservaCancha =
        reserva.cancha?.id ||
        reserva.cancha?.idCancha ||
        reserva.canchaId ||
        reserva.idCancha;

      const estado = reserva.estado || reserva.estadoReserva || "";

      if (estado === "CANCELADA") return false;

      const inicio = normalizarHora(reserva.horaInicio);
      const fin = normalizarHora(reserva.horaFin);

      return (
        Number(idReservaCancha) === Number(canchaId) &&
        reserva.fecha === fecha &&
        hora >= inicio &&
        hora < fin
      );
    });
  };

  const obtenerClaseCelda = (fecha, hora) => {
    if (esMiReserva(fecha, hora)) return "calendar-cell mine";
    if (estaOcupado(fecha, hora)) return "calendar-cell busy";
    return "calendar-cell free";
  };

  const obtenerTextoCelda = (fecha, hora) => {
    if (esMiReserva(fecha, hora)) return "Mi reserva";
    if (estaOcupado(fecha, hora)) return "Ocupado";
    return "Libre";
  };

  const cambiarSemana = (cantidadDias) => {
    const fecha = new Date(`${fechaBase}T00:00:00`);
    fecha.setDate(fecha.getDate() + cantidadDias);
    setFechaBase(formatearFechaInput(fecha));
  };
  const sumarUnaHora = (hora) => {
    const [h, m] = hora.split(":").map(Number);
    const nuevaHora = h + 1;

    if (nuevaHora > 23) return null;

    return `${String(nuevaHora).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const seleccionarCeldaLibre = (fecha, hora) => {
    if (isAdmin()) return;

    if (estaOcupado(fecha, hora) || esMiReserva(fecha, hora)) return;

    const horaFin = sumarUnaHora(hora);

    if (!horaFin) return;

    navigate(
      `/nueva-reserva?canchaId=${canchaId}&fecha=${fecha}&horaInicio=${hora}&horaFin=${horaFin}`
    );
  };

  return (
    <div className="calendario-page">
      <div className="page-header">
        <h1>Calendario semanal</h1>
        <p>
          Consultá la disponibilidad semanal de cada cancha según fecha y horario.
        </p>
      </div>

      {error && <div className="page-error">{error}</div>}

      <div className="page-card calendario-filtros">
        <div className="form-group">
          <label>Cancha</label>
          <select
            value={canchaId}
            onChange={(e) => setCanchaId(e.target.value)}
          >
            {canchas.map((cancha) => (
              <option key={obtenerIdCancha(cancha)} value={obtenerIdCancha(cancha)}>
                {cancha.nombre} - {obtenerNombreDeporte(cancha)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Fecha</label>
          <input
            type="date"
            value={fechaBase}
            onChange={(e) => setFechaBase(e.target.value)}
          />
        </div>

        <div className="calendar-week-actions">
          <button type="button" onClick={() => cambiarSemana(-7)}>
            Semana anterior
          </button>

          <button type="button" onClick={() => setFechaBase(obtenerFechaHoy())}>
            Hoy
          </button>

          <button type="button" onClick={() => cambiarSemana(7)}>
            Semana siguiente
          </button>
        </div>
      </div>

      <div className="calendario-info">
        <div className="page-card">
          <h2>{canchaSeleccionada?.nombre || "Cancha"}</h2>
          <p>{canchaSeleccionada ? obtenerNombreDeporte(canchaSeleccionada) : "-"}</p>
        </div>

        <div className="calendar-legend page-card">
          <span className="legend-item free">Libre</span>
          <span className="legend-item busy">Ocupado</span>
          <span className="legend-item mine">Mi reserva</span>
        </div>
      </div>

      <div className="page-card calendario-wrapper">
        {loading ? (
          <p>Cargando calendario...</p>
        ) : (
          <div className="calendar-grid">
            <div className="calendar-header-cell">Hora</div>

            {diasSemana.map((dia) => (
              <div className="calendar-header-cell" key={dia.fecha}>
                <strong>{dia.nombre}</strong>
                <span>{dia.diaNumero}</span>
              </div>
            ))}

            {horarios.map((hora) => (
              <>
                <div className="calendar-hour" key={`hora-${hora}`}>
                  {hora}
                </div>

                {diasSemana.map((dia) => (
                  <div
                    key={`${dia.fecha}-${hora}`}
                    className={
                      !isAdmin() && !estaOcupado(dia.fecha, hora) && !esMiReserva(dia.fecha, hora)
                        ? `${obtenerClaseCelda(dia.fecha, hora)} clickable`
                        : obtenerClaseCelda(dia.fecha, hora)
                    }
                    onClick={() => seleccionarCeldaLibre(dia.fecha, hora)}
                  >
                    {obtenerTextoCelda(dia.fecha, hora)}
                  </div>
                ))}
              </>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Calendario;