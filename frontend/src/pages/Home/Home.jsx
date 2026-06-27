import { Link } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";
import "./Home.css";

function Home() {
  const logueado = isAuthenticated();

  return (
    <div className="home-page">
      <header className="home-navbar">
        <div className="home-logo">
          <span>SB</span>
          <h2>Sports Booking</h2>
        </div>

        <nav className="home-nav">
          {logueado ? (
            <Link className="home-nav-button" to="/dashboard">
              Ir al dashboard
            </Link>
          ) : (
            <>
              <Link to="/login">Iniciar sesión</Link>
              <Link className="home-nav-button" to="/register">
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="home-main">
        <section className="home-hero">
          <div className="home-hero-content">
            <span className="home-kicker">Reserva de canchas online</span>

            <h1>Reservá tu cancha de forma rápida y simple</h1>

            <p>
              Sports Booking te permite buscar canchas disponibles, elegir fecha
              y horario, realizar reservas y gestionar todo desde una plataforma
              moderna.
            </p>

            <div className="home-actions">
              {logueado ? (
                <Link className="home-primary" to="/dashboard">
                  Entrar al sistema
                </Link>
              ) : (
                <>
                  <Link className="home-primary" to="/register">
                    Crear cuenta
                  </Link>

                  <Link className="home-secondary" to="/login">
                    Ya tengo cuenta
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="home-hero-card">
            <div className="home-card-header">
              <span>Reserva rápida</span>
              <strong>Disponible</strong>
            </div>

            <div className="home-card-body">
              <h3>Cancha 1</h3>
              <p>Fútbol · Hoy</p>

              <div className="home-time-grid">
                <span>18:00</span>
                <span>19:00</span>
                <span>20:00</span>
                <span>21:00</span>
              </div>

              <button>Reservar</button>
            </div>
          </div>
        </section>

        <section className="home-features">
          <article>
            <h3>Reservas online</h3>
            <p>
              Los clientes pueden elegir cancha, fecha y horario sin necesidad
              de comunicarse manualmente.
            </p>
          </article>

          <article>
            <h3>Horarios disponibles</h3>
            <p>
              El sistema muestra los horarios libres y evita seleccionar turnos
              ya reservados.
            </p>
          </article>

          <article>
            <h3>Panel administrador</h3>
            <p>
              El admin puede gestionar deportes, canchas, reservas y estados de
              cada reserva.
            </p>
          </article>
        </section>

        <section className="home-how">
          <div>
            <span className="home-section-label">Funcionamiento</span>
            <h2>Una plataforma pensada para clubes y clientes</h2>
          </div>

          <div className="home-steps">
            <div>
              <span>1</span>
              <p>El cliente se registra o inicia sesión.</p>
            </div>

            <div>
              <span>2</span>
              <p>Busca una cancha disponible según fecha y horario.</p>
            </div>

            <div>
              <span>3</span>
              <p>Realiza la reserva y puede verla desde Mis reservas.</p>
            </div>

            <div>
              <span>4</span>
              <p>El administrador confirma, cancela o finaliza reservas.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;