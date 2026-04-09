# Berichts-Heft

Open-source Berichtsheft Web-Anwendung mit React-Frontend, Express-Backend und Prisma/SQLite.

## Voraussetzungen

- Node.js >= 18
- npm >= 9

# Server Deployment Guide

This guide provides step-by-step instructions for deploying the **Berichts-Heft** application to a production Linux server (e.g., Ubuntu Debian, usually provided by VPS hosts like DigitalOcean, Hetzner, AWS, etc.).

## Prerequisites
- A Linux server with SSH access.
- The Git repository of your code (or a means to copy files over).
- A domain name (optional, but recommended for production).

---

## Step 1: Install Docker & Docker Compose
First, you need to connect to your remote server via SSH.

```bash
ssh root@<your-server-ip>
```

Once inside, make sure your package maps are up to date and install Docker as well as the Docker Compose plugin:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-v2
```

Enable Docker so that it starts automatically when your server reboots:

```bash
sudo systemctl enable docker
sudo systemctl start docker
```

---

## Step 2: Transfer Your Code
You need to put your source code on the server so Docker can build it. The easiest way is using Git. First, create a directory for your application to live in, then clone your code down.

```bash
sudo mkdir -p /opt/berichts-heft
cd /opt/berichts-heft

# Clone your project into this directory
# Replace the URL below with your actual repository URL
git clone https://github.com/your-username/your-repo-name.git .
```

---

## Step 3: Configure Environment Variables

Your `docker-compose.yml` expects an `.env` file to be present. This file contains your private production keys and should **never** be committed to Git.

Create the file on your server using `nano`:

```bash
nano .env
```

Paste in your environment variables. Make sure your database path matches the inside-container volume mount (`/app/data`), and ensure your production secrets are extremely long and randomized:

```env
# Application Configuration
NODE_ENV=production
PORT=3000

# Security Strings
SESSION_SECRET="generatethissuperlongandrandomstringplease"

# Database path (Docker mounts the volume berichts_data to /app/data inside the container)
DATABASE_URL="file:/app/data/prod.db"
```

Save and exit `nano` (`CTRL` + `X`, then `Y`, then `Enter`).

---

## Step 4: Build and Start the Application

With your code and `.env` in place, it's time to build the Docker image using your `Dockerfile` and start the container via `docker-compose.yml`.

Run the following command:

```bash
sudo docker compose up -d --build
```
* **`-d`**: Runs the container in the background (detached mode) so it doesn't close when you exit your SSH session.
* **`--build`**: Tells Docker to build the production image before running it.

Once the process finishes, Docker should automatically spin up an SQLite database safely managed by your volume (`berichts_data`), and your Node.js application.

### Checking the Status
If you ever want to check if the application is running, or if it threw an error, check the container logs:

```bash
sudo docker compose logs -f
```

---

## Step 5: (Optional) Make it accessible via a Domain Name

in any normal setting, the app is running on port `:3000`. To access it, you need to open port 3000 on your server's firewall:
```bash
sudo ufw allow 3000
```
Then you can view your app at `http://<your-server-ip>:3000`.
you also could give it a Domain name then you can open it with `http://<domain-name>`

**For Production:**
It is highly recommended to use a **Reverse Proxy** (like Nginx, Caddy, or Nginx Proxy Manager) to route traffic from a domain name (like `https://berichts-heft.mydomain.com`) securely down to your `:3000` internal container port. If you install a reverse proxy, you will leave port 3000 blocked from the outside internet, and your reverse proxy will communicate safely with it.

## Installation

```bash
git clone https://github.com/Albuswolvrick/Berichts-Heft.git
cd Berichts-Heft
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:push
```

## creating first user 

```bash
node create.js  // only if you need to create a new user
```


## Entwicklung starten

Ein Befehl startet Frontend und Backend parallel:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Verfügbare Scripts

### Entwicklung

```bash
npm run dev
npm run client:dev
npm run server:dev
npm run client:build
npm run client:preview
```

### Tests und Qualität

```bash
npm test
npm run test:watch
npm run test:coverage
npm run lint
npm run lint:fix
npm run format
```

### Datenbank

```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:migrate
npm run prisma:studio
npm run prisma:format
npm run prisma:seed
npm run prisma:reset
```

## Architektur

### Backend (`src/server`)

- `config/`: Environment, Session, Datenbankverbindung
- `routes/`: API-Routen
- `controllers/`: HTTP-Handling
- `services/`: Business-Logik
- `middleware/`: Auth, Logging, Fehlerbehandlung
- `utils/`: Helper-Funktionen und Fehlerklassen

### Frontend (`src/client`)

- `pages/`: Seiten-Komponenten
- `components/`: Wiederverwendbare UI-Komponenten
- `hooks/`: React Hooks
- `services/`: API-Client
- `utils/`: PDF- und Datums-Helfer

## Hauptfunktionen

- Authentifizierung mit Session-Cookies
- Daily/Weekly/Monthly/Yearly Reports
- Automatische Kalenderwochen-Berechnung im Weekly Report
- Speicherung der Reports in der Datenbank
- Professionell formatierter PDF-Export pro Berichtstyp
- Kommentarsystem für Admin-Feedback
- Design-System (Light, Dark)
- Suche und Filter für Berichte
- Benutzer-Self-Service (Passwortänderung)
- Login-Tracking und Cookie-Hinweis
- Admin-Bereich für Verwaltung und Einsicht

## API-Endpunkte

| Methode | Pfad | Beschreibung |
| --- | --- | --- |
| POST | `/api/auth/register` | Benutzer registrieren |
| POST | `/api/auth/login` | Benutzer anmelden |
| POST | `/api/auth/logout` | Benutzer abmelden |
| GET | `/api/users/me` | Aktueller Benutzer |
| GET | `/api/users` | Alle Benutzer (Admin) |
| GET | `/api/comments/:type/:id` | Kommentare abrufen |
| POST | `/api/comments` | Kommentar erstellen (Admin/Manager) |
| CRUD | `/api/daily-reports` | Tägliche Berichte |
| CRUD | `/api/weekly-reports` | Wöchentliche Berichte |
| CRUD | `/api/monthly-reports` | Monatliche Berichte |
| CRUD | `/api/yearly-reports` | Jährliche Berichte |
| GET | `/api/health` | Health-Check |

## Hinweise

- Für lokale Entwicklung muss `SESSION_SECRET` in `.env` gesetzt sein.
- Report-Seiten erwarten einen eingeloggten Benutzer.
- PDF-Exporte werden clientseitig mit jsPDF erzeugt.

## Server Maintenance & Updates

### Updating the Application
When new changes are pushed to your Git repository, follow these steps on your server to update the live application without losing data:

1. **Pull the latest code:**
   ```bash
   cd /opt/berichts-heft
   git pull
   ```

2. **Rebuild and restart the container:**
   ```bash
   sudo docker compose up -d --build
   ```
   *(This command checks for any changed files, rebuilds the Node.js production image, and restarts the container safely. Note: Your database and session files are safely stored inside the `berichts_data` volume, so no data will be lost during a rebuild).*

### Changing or Updating the Database Schema
If you have made changes to the database (modifying `prisma/schema.prisma`), run the Prisma migration or push command **inside** the running container right after updating the code:

```bash
# Update the database schema inside the 'app' container
sudo docker compose exec app npx prisma db push
```

### Viewing Logs and Troubleshooting
If something goes wrong or you need to see server activities:
```bash
# View the latest 100 container logs and keep printing new ones
sudo docker compose logs -f --tail=100
```

To just restart the application if it freezes:
```bash
sudo docker compose restart
```

## Lizenz

GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
