import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCanchasActivas } from "../../services/canchaService";
import { getDeportes } from "../../services/deporteService";
import { crearReserva, getHorariosOcupados } from "../../services/reservaService";
import "./NuevaReserva.css";

const obtenerFechaHoy = () => {
  const hoy = new Date();
  return hoy.toISOString().split("T")[0];
};

function NuevaReserva() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [canchas, setCanchas] = useState([]);
  const [deportes, setDeportes] = useState([]);
  const [horariosOcupadosPorCancha, setHorariosOcupadosPorCancha] = useState({});

  const [fecha, setFecha] = useState(obtenerFechaHoy());
  const [busqueda, setBusqueda] = useState("");
  const [filtroDeporte, setFiltroDeporte] = useState("TODOS");

  const [canchaId, setCanchaId] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [cargandoHorarios, setCargandoHorarios] = useState(false);

  const horariosInicio = [
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

  const horariosFin = [
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
    "23:00",
  ];

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

  const obtenerPrecioCancha = (cancha) => {
    if (!cancha) return 0;
    return cancha.precioPorHora || cancha.precioHora || 0;
  };



  const normalizarHora = (hora) => {
    if (!hora) return "";
    return hora.slice(0, 5);
  };

  const sumarUnaHora = (hora) => {
    const [h, m] = hora.split(":").map(Number);
    const nuevaHora = h + 1;

    if (nuevaHora > 23) return null;

    return `${String(nuevaHora).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const obtenerOcupadosDeCancha = (id) => {
    return horariosOcupadosPorCancha[id] || [];
  };

  const estaHorarioOcupado = (id, hora) => {
    const ocupados = obtenerOcupadosDeCancha(id);

    return ocupados.some((ocupado) => {
      const inicio = normalizarHora(ocupado.horaInicio);
      const fin = normalizarHora(ocupado.horaFin);

      return hora >= inicio && hora < fin;
    });
  };

  const rangoDisponible = (id, inicioSeleccionado, finSeleccionado) => {
    const ocupados = obtenerOcupadosDeCancha(id);

    return !ocupados.some((ocupado) => {
      const inicioOcupado = normalizarHora(ocupado.horaInicio);
      const finOcupado = normalizarHora(ocupado.horaFin);

      return inicioSeleccionado < finOcupado && finSeleccionado > inicioOcupado;
    });
  };

  const obtenerHorariosDisponiblesDeCancha = (id) => {
    return horariosInicio.filter((hora) => {
      const horaFinAutomatica = sumarUnaHora(hora);

      if (!horaFinAutomatica) return false;

      return !estaHorarioOcupado(id, hora) && rangoDisponible(id, hora, horaFinAutomatica);
    });
  };

  const cargarDatos = async () => {
    try {
      setError("");

      const [canchasData, deportesData] = await Promise.all([
        getCanchasActivas(),
        getDeportes(),
      ]);

      setCanchas(canchasData);
      setDeportes(deportesData);
    } catch (error) {
      setError(error.message || "Error al cargar los datos");
    }
  };

  const cargarHorariosOcupados = async () => {
    if (!fecha || canchas.length === 0) return;

    try {
      setCargandoHorarios(true);
      setError("");

      const resultados = await Promise.all(
        canchas.map(async (cancha) => {
          const id = obtenerIdCancha(cancha);
          const ocupados = await getHorariosOcupados(id, fecha);

          return {
            id,
            ocupados,
          };
        })
      );

      const horariosPorCancha = {};

      resultados.forEach((resultado) => {
        horariosPorCancha[resultado.id] = resultado.ocupados;
      });

      setHorariosOcupadosPorCancha(horariosPorCancha);

    } catch (error) {
      setError(error.message || "Error al cargar horarios ocupados");
    } finally {
      setCargandoHorarios(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);
  useEffect(() => {
    const canchaParam = searchParams.get("canchaId");
    const fechaParam = searchParams.get("fecha");
    const inicioParam = searchParams.get("horaInicio");
    const finParam = searchParams.get("horaFin");

    if (canchaParam) setCanchaId(canchaParam);
    if (fechaParam) setFecha(fechaParam);
    if (inicioParam) setHoraInicio(inicioParam);
    if (finParam) setHoraFin(finParam);
  }, [searchParams]);

  useEffect(() => {
    cargarHorariosOcupados();
  }, [fecha, canchas]);

  const canchaSeleccionada = canchas.find(
    (cancha) => Number(obtenerIdCancha(cancha)) === Number(canchaId)
  );

  const canchasFiltradas = canchas.filter((cancha) => {
    const nombre = cancha.nombre?.toLowerCase() || "";
    const deporte = obtenerNombreDeporte(cancha).toLowerCase();
    const deporteId = obtenerDeporteIdDeCancha(cancha);

    const coincideBusqueda =
      nombre.includes(busqueda.toLowerCase()) ||
      deporte.includes(busqueda.toLowerCase());

    const coincideDeporte =
      filtroDeporte === "TODOS" ||
      Number(deporteId) === Number(filtroDeporte);

    return coincideBusqueda && coincideDeporte;
  });

  const calcularDuracionHoras = () => {
    if (!horaInicio || !horaFin) return 0;

    const [inicioHora, inicioMinuto] = horaInicio.split(":").map(Number);
    const [finHora, finMinuto] = horaFin.split(":").map(Number);

    const inicioTotal = inicioHora * 60 + inicioMinuto;
    const finTotal = finHora * 60 + finMinuto;

    return (finTotal - inicioTotal) / 60;
  };

  const duracionHoras = calcularDuracionHoras();

  const totalEstimado = canchaSeleccionada
    ? obtenerPrecioCancha(canchaSeleccionada) * duracionHoras
    : 0;

  const horariosInicioDisponibles = canchaId
    ? horariosInicio.filter((hora) => !estaHorarioOcupado(canchaId, hora))
    : [];

  const horariosFinDisponibles = horariosFin.filter((hora) => {
    if (!canchaId || !horaInicio) return false;

    return hora > horaInicio && rangoDisponible(canchaId, horaInicio, hora);
  });

  const seleccionarHorarioRapido = (cancha, hora) => {
    const id = obtenerIdCancha(cancha);
    const fin = sumarUnaHora(hora);

    if (!fin) return;

    setCanchaId(String(id));
    setHoraInicio(hora);
    setHoraFin(fin);
    setMensaje("");
    setError("");
  };

  const limpiarFormulario = () => {
    setCanchaId("");
    setHoraInicio("");
    setHoraFin("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMensaje("");

    if (!canchaId || !fecha || !horaInicio || !horaFin) {
      setError("Seleccioná una cancha, fecha y horario");
      return;
    }

    if (fecha < obtenerFechaHoy()) {
      setError("No podés reservar una fecha anterior a hoy");
      return;
    }

    if (horaFin <= horaInicio) {
      setError("La hora de fin debe ser mayor a la hora de inicio");
      return;
    }

    if (!rangoDisponible(canchaId, horaInicio, horaFin)) {
      setError("Ese horario ya está reservado. Elegí otro horario.");
      return;
    }

    const reserva = {
      canchaId: Number(canchaId),
      fecha,
      horaInicio,
      horaFin,
    };

    try {
      setLoading(true);

      await crearReserva(reserva);

      setMensaje("Reserva creada correctamente");
      limpiarFormulario();

      setTimeout(() => {
        navigate("/mis-reservas");
      }, 800);
    } catch (error) {
      setError(error.message || "Error al crear la reserva");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-hero">
        <div>
          <span className="booking-kicker">Reserva online</span>
          <h1>Encontrá tu cancha y reservá al instante</h1>
          <p>
            Elegí fecha, filtrá por deporte y seleccioná un horario disponible
            desde la tarjeta de cada cancha.
          </p>
        </div>
      </div>

      {error && <div className="page-error">{error}</div>}
      {mensaje && <div className="page-success">{mensaje}</div>}

      <div className="booking-layout">
        <aside className="booking-filters page-card">
          <h2>Filtros</h2>

          <div className="form-group">
            <label>Fecha</label>
            <input
              type="date"
              min={obtenerFechaHoy()}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Deporte</label>
            <select
              value={filtroDeporte}
              onChange={(e) => setFiltroDeporte(e.target.value)}
            >
              <option value="TODOS">Todos los deportes</option>

              {deportes.map((deporte) => (
                <option key={obtenerIdDeporte(deporte)} value={obtenerIdDeporte(deporte)}>
                  {deporte.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Buscar</label>
            <input
              type="text"
              placeholder="Ej: Cancha 1, fútbol..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="booking-divider"></div>

          <h2>Reserva seleccionada</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Cancha</label>
              <select
                value={canchaId}
                onChange={(e) => {
                  setCanchaId(e.target.value);
                  setHoraInicio("");
                  setHoraFin("");
                }}
              >
                <option value="">Seleccionar cancha</option>

                {canchasFiltradas.map((cancha) => (
                  <option key={obtenerIdCancha(cancha)} value={obtenerIdCancha(cancha)}>
                    {cancha.nombre} - {obtenerNombreDeporte(cancha)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Inicio</label>
                <select
                  value={horaInicio}
                  onChange={(e) => {
                    setHoraInicio(e.target.value);
                    setHoraFin("");
                  }}
                  disabled={!canchaId}
                >
                  <option value="">Hora</option>

                  {horariosInicioDisponibles.map((hora) => (
                    <option key={hora} value={hora}>
                      {hora}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Fin</label>
                <select
                  value={horaFin}
                  onChange={(e) => setHoraFin(e.target.value)}
                  disabled={!horaInicio}
                >
                  <option value="">Hora</option>

                  {horariosFinDisponibles.map((hora) => (
                    <option key={hora} value={hora}>
                      {hora}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {canchaSeleccionada && horaInicio && horaFin && (
              <div className="booking-summary">
                <div>
                  <span>Cancha</span>
                  <strong>{canchaSeleccionada.nombre}</strong>
                </div>

                <div>
                  <span>Deporte</span>
                  <strong>{obtenerNombreDeporte(canchaSeleccionada)}</strong>
                </div>

                <div>
                  <span>Horario</span>
                  <strong>
                    {horaInicio} - {horaFin}
                  </strong>
                </div>

                <div>
                  <span>Duración</span>
                  <strong>{duracionHoras} h</strong>
                </div>

                <div className="booking-total">
                  <span>Total</span>
                  <strong>${totalEstimado}</strong>
                </div>
              </div>
            )}

            <button className="booking-confirm-button" type="submit" disabled={loading}>
              {loading ? "Reservando..." : "Confirmar reserva"}
            </button>
          </form>
        </aside>

        <section className="booking-results">
          <div className="booking-results-header">
            <div>
              <h2>Canchas disponibles</h2>
              <p>
                {cargandoHorarios
                  ? "Cargando horarios..."
                  : `${canchasFiltradas.length} cancha/s encontradas`}
              </p>
            </div>
          </div>

          <div className="booking-grid">
            {canchasFiltradas.map((cancha) => {
              const id = obtenerIdCancha(cancha);
              const deporte = obtenerNombreDeporte(cancha);
              const disponibles = obtenerHorariosDisponiblesDeCancha(id).slice(0, 4);
              const seleccionada = Number(id) === Number(canchaId);

              return (
                <article
                  className={`cancha-booking-card ${seleccionada ? "selected" : ""}`}
                  key={id}
                >
                  <div className="cancha-cover">
                    <div className="cancha-cover-content">
                      <span className="cancha-cover-label">{deporte}</span>
                    </div>
                  </div>
                  <div className="cancha-card-body">
                    <div className="cancha-card-header">
                      <div>
                        <h3>{cancha.nombre}</h3>
                        <p>{deporte}</p>
                      </div>

                      <span className="cancha-price">
                        ${obtenerPrecioCancha(cancha)}
                        <small>/hora</small>
                      </span>
                    </div>

                    <div className="cancha-features">
                      <span>Disponible</span>
                      <span>Reserva rápida</span>
                      <span>{fecha}</span>
                    </div>

                    <div className="horarios-quick">
                      <h4>Próximos horarios</h4>

                      {cargandoHorarios ? (
                        <p className="muted-text">Cargando...</p>
                      ) : disponibles.length === 0 ? (
                        <p className="muted-text">Sin horarios disponibles</p>
                      ) : (
                        <div className="horarios-buttons">
                          {disponibles.map((hora) => (
                            <button
                              key={hora}
                              type="button"
                              onClick={() => seleccionarHorarioRapido(cancha, hora)}
                              className={
                                seleccionada && horaInicio === hora
                                  ? "horario-chip active"
                                  : "horario-chip"
                              }
                            >
                              {hora}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default NuevaReserva;

