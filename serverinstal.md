

Wenn du das auf einem komplett frischen Server (z. B. Ubuntu oder Debian) installierst, musst du zuerst die Systemumgebung vorbereiten, bevor die npm-Befehle funktionieren.
Hier ist die Checkliste für einen Blank Server:
1. System-Updates & Basis-Tools
Zuerst müssen die Paketquellen aktualisiert und grundlegende Tools installiert werden, die für das Kompilieren von nativen Modulen wie bcrypt oder better-sqlite3 notwendig sind:
bashsudo apt update && sudo apt upgrade -y
sudo apt install -y git curl build-essential python3
2. Node.js & npm installieren
Verwende NVM (Node Version Manager), um die richtige Version (v18 oder höher) sauber zu installieren:
bash# NVM installieren
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Terminal-Konfiguration neu laden
source ~/.bashrc

# Node.js LTS installieren und aktivieren
nvm install --lts
nvm use --lts
3. Anwendung herunterladen & vorbereiten
bashgit clone https://github.com/Albuswolvrick/Berichts-Heft.git
cd Berichts-Heft
npm install
4. Datenbank & Umgebung konfigurieren
bashcp .env.example .env

# WICHTIG: .env bearbeiten und SESSION_SECRET setzen!
nano .env
Stelle sicher, dass die .env folgendes enthält:
envDATABASE_URL="file:./dev.db"
SESSION_SECRET="dein-sehr-langer-zufälliger-schlüssel-hier"
Danach:
bashnpm run prisma:generate
npm run prisma:push
node create.js


5. Den Server dauerhaft laufen lassen (PM2)
Auf einem echten Server willst du nicht npm run dev im Terminal offen lassen. Nutze PM2, damit die App im Hintergrund läuft und nach einem Neustart automatisch wieder startet:
bash# PM2 global installieren
npm install -g pm2

# Zuerst das Frontend bauen (Vite)
npm run client:build

# Backend-Server mit PM2 starten
pm2 start src/server/index.js --name "berichts-heft"

# PM2-Prozessliste speichern
pm2 save

# Autostart beim Server-Neustart einrichten
pm2 startup
# WICHTIG: Den von pm2 startup ausgegebenen Befehl kopieren und ausführen!


6. Firewall konfigurieren (empfohlen)
bashsudo ufw allow ssh
sudo ufw allow 3000
sudo ufw enable


7. (Optional) Nginx als Reverse Proxy
Wenn du die App über eine Domain (z. B. berichtsheft.de) ohne Port :3000 und mit HTTPS erreichbar machen willst:
bash# Nginx installieren
sudo apt install -y nginx

# Certbot für Let's Encrypt SSL installieren
sudo apt install -y certbot python3-certbot-nginx
Beispiel-Nginx-Konfiguration (/etc/nginx/sites-available/berichtsheft):
nginxserver {
    listen 80;
    server_name berichtsheft.de;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
bash# Konfiguration aktivieren
sudo ln -s /etc/nginx/sites-available/berichtsheft /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL-Zertifikat ausstellen
sudo certbot --nginx -d berichtsheft.de


bashsudo ufw allow 'Nginx Full'
# Port 3000 aus der Firewall entfernen (Nginx übernimmt den Zugriff)
sudo ufw delete allow 3000