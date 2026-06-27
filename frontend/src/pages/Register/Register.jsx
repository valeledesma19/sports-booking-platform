import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginRequest, registerRequest } from "../../services/authService";
import { saveToken } from "../../utils/auth";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Completá todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres");
      return;
    }

    try {
      setLoading(true);

      await registerRequest(nombre, email, password);

      const loginData = await loginRequest(email, password);

      if (!loginData.token) {
        setError("Usuario registrado, pero el backend no devolvió token al iniciar sesión");
        return;
      }

      saveToken(loginData.token);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleRegister}>
        <h1>Registrarse</h1>
        <p className="auth-subtitle">Creá tu cuenta para reservar canchas.</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            placeholder="Ej: Valentina"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

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
            placeholder="Creá una contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Confirmar contraseña</label>
          <input
            type="password"
            placeholder="Repetí la contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button className="auth-button" type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrarme"}
        </button>

        <p className="auth-link">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;

