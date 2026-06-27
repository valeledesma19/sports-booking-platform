import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginRequest } from "../../services/authService";
import { saveToken } from "../../utils/auth";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Completá todos los campos");
      return;
    }

    try {
      setLoading(true);

      const data = await loginRequest(email, password);

      if (!data.token) {
        setError("El backend no devolvió el token");
        return;
      }

      saveToken(data.token);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleLogin}>
        <h1>Iniciar sesión</h1>
        <p className="auth-subtitle">Ingresá a tu cuenta para reservar canchas.</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Ej: usuario@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Ingresá tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="auth-button" type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        <p className="auth-link">
          ¿No tenés cuenta? <Link to="/register">Registrate</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;

