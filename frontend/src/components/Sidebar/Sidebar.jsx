import { NavLink, useNavigate } from "react-router-dom";
import { getUserFromToken, isAdmin, logout } from "../../utils/auth";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const user = getUserFromToken();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Sports Booking</h2>
        <p>{user?.email}</p>
        <span className="role-badge">{user?.role}</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/calendario">Calendario</NavLink>

        {isAdmin() ? (
          <>
            <NavLink to="/canchas">Canchas</NavLink>
            <NavLink to="/deportes">Deportes</NavLink>
            <NavLink to="/reservas">Reservas</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/nueva-reserva">Hacer reserva</NavLink>
            <NavLink to="/mis-reservas">Mis reservas</NavLink>
          </>
        )}
      </nav>

      <button className="logout-button" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </aside>
  );
}

export default Sidebar;

