import { useEffect, useState } from "react";
import {
  createDeporte,
  deleteDeporte,
  getDeportes,
  updateDeporte,
} from "../../services/deporteService";
import "./Deportes.css";

function Deportes() {
  const [deportes, setDeportes] = useState([]);
  const [nombre, setNombre] = useState("");

  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const obtenerIdDeporte = (deporte) => deporte.id || deporte.idDeporte;

  const cargarDeportes = async () => {
    try {
      setError("");
      const data = await getDeportes();
      setDeportes(data);
    } catch (error) {
      setError(error.message || "Error al cargar los deportes");
    }
  };

  useEffect(() => {
    cargarDeportes();
  }, []);

  const limpiarFormulario = () => {
    setNombre("");
    setEditandoId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setError("Ingresá el nombre del deporte");
      return;
    }

    const deporte = {
      nombre,
    };

    try {
      setLoading(true);
      setError("");

      if (editandoId) {
        await updateDeporte(editandoId, deporte);
      } else {
        await createDeporte(deporte);
      }

      limpiarFormulario();
      await cargarDeportes();
    } catch (error) {
      setError(error.message || "Error al guardar el deporte");
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (deporte) => {
    setEditandoId(obtenerIdDeporte(deporte));
    setNombre(deporte.nombre || "");
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm("¿Seguro que querés eliminar este deporte?");

    if (!confirmar) return;

    try {
      setError("");
      await deleteDeporte(id);
      await cargarDeportes();
    } catch (error) {
      setError(
        error.message ||
          "No se pudo eliminar el deporte. Puede tener canchas asociadas."
      );
    }
  };

  return (
    <div className="deportes-page">
      <div className="page-header">
        <h1>Deportes</h1>
        <p>Gestión de deportes disponibles para las canchas.</p>
      </div>

      {error && <div className="page-error">{error}</div>}

      <div className="deportes-layout">
        <form className="page-card deporte-form" onSubmit={handleSubmit}>
          <h2>{editandoId ? "Editar deporte" : "Nuevo deporte"}</h2>

          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              placeholder="Ej: Fútbol"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <button className="primary-button" type="submit" disabled={loading}>
            {loading
              ? "Guardando..."
              : editandoId
              ? "Actualizar deporte"
              : "Crear deporte"}
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

        <div className="page-card deportes-list">
          <h2>Listado de deportes</h2>

          {deportes.length === 0 ? (
            <p>No hay deportes cargados.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {deportes.map((deporte) => (
                  <tr key={obtenerIdDeporte(deporte)}>
                    <td>{obtenerIdDeporte(deporte)}</td>
                    <td>{deporte.nombre}</td>
                    <td className="actions">
                      <button onClick={() => handleEditar(deporte)}>
                        Editar
                      </button>

                      <button
                        className="danger"
                        onClick={() => handleEliminar(obtenerIdDeporte(deporte))}
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

export default Deportes;

