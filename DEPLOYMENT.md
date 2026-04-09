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

Currently, your app is running on port `:3000`. To access it, you need to open port 3000 on your server's firewall:
```bash
sudo ufw allow 3000
```
Then you can view your app at `http://<your-server-ip>:3000`.

**For Production:**
It is highly recommended to use a **Reverse Proxy** (like Nginx, Caddy, or Nginx Proxy Manager) to route traffic from a domain name (like `https://berichts-heft.mydomain.com`) securely down to your `:3000` internal container port. If you install a reverse proxy, you will leave port 3000 blocked from the outside internet, and your reverse proxy will communicate safely with it.
