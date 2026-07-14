# Sports Booking Platform

Sistema web Full Stack para la gestión y reserva de canchas deportivas.

Permite a los usuarios registrarse, consultar la disponibilidad de canchas y realizar reservas, mientras que los administradores pueden gestionar deportes, canchas y reservas desde un panel exclusivo.

## Tecnologías

### Backend
- Java 21
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- Hibernate
- Maven

### Frontend
- React
- Vite
- React Router
- Fetch API
- CSS

### Base de datos
- PostgreSQL

### Deploy
- Frontend: Vercel
- Backend: Render
- Base de datos: Render PostgreSQL

---

## Funcionalidades

### Usuarios

- Registro e inicio de sesión.
- Reserva de canchas.
- Consulta de horarios disponibles.
- Visualización de reservas.
- Cancelación de reservas.

### Administrador

- Gestión de deportes.
- Gestión de canchas.
- Gestión de reservas.
- Confirmación y finalización de reservas.
- Dashboard con estadísticas.

---

## Arquitectura

```
sports-booking-platform
├── backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── model
│   ├── dto
│   ├── config
│   └── security
│
└── frontend
    ├── components
    ├── pages
    ├── services
    ├── context
    ├── routes
    └── styles
```

---

## Instalación

### Clonar el repositorio

```bash
git clone https://github.com/valeledesma19/sports-booking-platform.git
```

### Backend

```bash
cd backend
mvn spring-boot:run
```

Crear previamente el archivo `application.properties` con la configuración correspondiente.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Crear un archivo `.env` con:

```env
VITE_API_URL=http://localhost:8080/api
```

---

## API

La documentación está disponible mediante Swagger:

```
http://localhost:8080/swagger-ui/index.html
```

---

## Próximas mejoras

- Integración de pagos online.
- Calendario semanal.
- Recuperación de contraseña.
- Notificaciones por correo electrónico.
- Historial de reservas.
- Filtros de búsqueda.

---

## Autor

Valentina Ledesma

GitHub: https://github.com/valeledesma19
