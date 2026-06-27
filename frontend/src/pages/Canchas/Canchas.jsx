import { useEffect, useState } from "react";
import {
  createCancha,
  deleteCancha,
  getCanchas,
  updateCancha,
} from "../../services/canchaService";
import { getDeportes } from "../../services/deporteService";
import "./Canchas.css";

function Canchas() {
  const [canchas, setCanchas] = useState([]);
  const [deportes, setDeportes] = useState([]);

  const [nombre, setNombre] = useState("");
  const [precioPorHora, setPrecioPorHora] = useState("");
  const [deporteId, setDeporteId] = useState("");
  const [activa, setActiva] = useState(true);

  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const obtenerIdCancha = (cancha) => cancha.id || cancha.idCancha;
  const obtenerIdDeporte = (deporte) => deporte.id || deporte.idDeporte;

  const obtenerNombreDeporte = (cancha) => {
    if (cancha.deporte?.nombre) return cancha.deporte.nombre;

    const id = cancha.deporteId || cancha.idDeporte;
    const deporteEncontrado = deportes.find((d) => obtenerIdDeporte(d) === id);

    return deporteEncontrado?.nombre || "Sin deporte";
  };

  const cargarDatos = async () => {
    try {
      setError("");
      const [canchasData, deportesData] = await Promise.all([
        getCanchas(),
        getDeportes(),
      ]);

      setCanchas(canchasData);
      setDeportes(deportesData);
    } catch (error) {
      setError(error.message || "Error al cargar los datos");
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const limpiarFormulario = () => {
    setNombre("");
    setPrecioPorHora("");
    setDeporteId("");
    setActiva(true);
    setEditandoId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !precioPorHora || !deporteId) {
      setError("Completá todos los campos");
      return;
    }

    const cancha = {
      nombre,
      precioPorHora: Number(precioPorHora),
      deporteId: Number(deporteId),
      activa,
    };

    try {
      setLoading(true);
      setError("");

      if (editandoId) {
        await updateCancha(editandoId, cancha);
      } else {
        await createCancha(cancha);
      }

      limpiarFormulario();
      await cargarDatos();
    } catch (error) {
      setError(error.message || "Error al guardar la cancha");
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (cancha) => {
    const idCancha = obtenerIdCancha(cancha);
    const idDeporte = cancha.deporte?.id || cancha.deporte?.idDeporte || cancha.deporteId || cancha.idDeporte;

    setEditandoId(idCancha);
    setNombre(cancha.nombre || "");
    setPrecioPorHora(cancha.precioPorHora || cancha.precioHora || "");
    setDeporteId(idDeporte || "");
    setActiva(cancha.activa ?? true);
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm("¿Seguro que querés eliminar esta cancha?");

    if (!confirmar) return;

    try {
      setError("");
      await deleteCancha(id);
      await cargarDatos();
    } catch (error) {
      setError(error.message || "Error al eliminar la cancha");
    }
  };

  return (
    <div className="canchas-page">
      <div className="page-header">
        <h1>Canchas</h1>
        <p>Gestión de canchas disponibles para reservar.</p>
      </div>

      {error && <div className="page-error">{error}</div>}

      <div className="canchas-layout">
        <form className="page-card cancha-form" onSubmit={handleSubmit}>
          <h2>{editandoId ? "Editar cancha" : "Nueva cancha"}</h2>

          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              placeholder="Ej: Cancha 1"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Deporte</label>
            <select
              value={deporteId}
              onChange={(e) => setDeporteId(e.target.value)}
            >
              <option value="">Seleccionar deporte</option>
              {deportes.map((deporte) => (
                <option key={obtenerIdDeporte(deporte)} value={obtenerIdDeporte(deporte)}>
                  {deporte.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Precio por hora</label>
            <input
              type="number"
              placeholder="Ej: 8000"
              value={precioPorHora}
              onChange={(e) => setPrecioPorHora(e.target.value)}
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              checked={activa}
              onChange={(e) => setActiva(e.target.checked)}
            />
            <label>Cancha activa</label>
          </div>

          <button className="primary-button" type="submit" disabled={loading}>
            {loading
              ? "Guardando..."
              : editandoId
              ? "Actualizar cancha"
              : "Crear cancha"}
          </button>

          {editandoId && (
            <button
              className="secondary-button"
              type="button"
              onClick={limpiarFormulario}
            >
              Cancelar edición
            </button>
          )}
        </form>

        <div className="page-card canchas-list">
          <h2>Listado de canchas</h2>

          {canchas.length === 0 ? (
            <p>No hay canchas cargadas.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Deporte</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {canchas.map((cancha) => (
                  <tr key={obtenerIdCancha(cancha)}>
                    <td>{cancha.nombre}</td>
                    <td>{obtenerNombreDeporte(cancha)}</td>
                    <td>${cancha.precioPorHora || cancha.precioHora || 0}</td>
                    <td>
                      <span className={cancha.activa === false ? "badge inactive" : "badge active"}>
                        {cancha.activa === false ? "Inactiva" : "Activa"}
                      </span>
                    </td>
                    <td className="actions">
                      <button onClick={() => handleEditar(cancha)}>Editar</button>
                      <button
                        className="danger"
                        onClick={() => handleEliminar(obtenerIdCancha(cancha))}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Canchas;

