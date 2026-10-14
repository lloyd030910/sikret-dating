# Dating & Social Platform

A production-ready dating and social platform with a public member app (Flutter), model management system, and comprehensive admin dashboard (Next.js).

## Project Structure

- `apps/mobile`: Flutter-based mobile application for members.
- `apps/admin`: Next.js-based administration dashboard for staff.
- `services/api`: NestJS-based REST & WebSocket API.
- `infrastructure`: Docker and Nginx configurations.

## Technology Stack

- **Backend:** NestJS, TypeScript, PostgreSQL, Redis, Socket.io
- **Admin:** Next.js, Tailwind CSS, Shadcn UI
- **Security:** JWT (Access + Refresh Tokens), Argon2, Helmet, Rate Limiting
- **Infrastructure:** Docker, Docker Compose, Nginx

## Development Setup

### 1. Requirements
- Node.js 20+
- Docker & Docker Compose
- Flutter SDK (for mobile)

### 2. Installation
```bash
npm install
```

### 3. Environment
Copy `.env.example` to `.env` in the root and in `services/api`. Update the values as needed.

### 4. Start Infrastructure
```bash
docker compose up -d
```

### 5. Seed Data
```bash
cd services/api
npm run seed:admin
npm run seed:plans
```

### 6. Run Services
```bash
# Start API
cd services/api
npm run dev

# Start Admin Dashboard
cd apps/admin
npm run dev
```

## Production Deployment

1. **Build Images:**
   ```bash
   docker compose -f docker-compose.prod.yml build
   ```

2. **Run Containers:**
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

3. **Database Migrations:**
   ```bash
   cd services/api
   npm run migration:run
   ```

## Documentation

Full architectural and API documentation can be found in the `/docs` directory (TODO).

## License
ISC
