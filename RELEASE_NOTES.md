# Release Notes - v1.0.0 (Production Ready)

Welcome to the official 1.0.0 release of **Berichts-Heft**! This milestone marks the transition from development to a production-ready digital training report book.

##  Key Highlights

### 🗄️ PostgreSQL Migration
The core database engine has been migrated from SQLite to **PostgreSQL**. This ensures better scalability, concurrent access, and production reliability.

> [!IMPORTANT]
> Existing SQLite databases will need to be migrated or re-initialized. See [DEPLOYMENT.md](file:///home/pierre/Schreibtisch/Berichts-Heft/DEPLOYMENT.md) for setup instructions.

### Professional Admin Interface
The development menu has been fully rebranded to the **Admin Menu**. All development-only utilities have been removed or secured, providing a clean and professional management interface for administrators.

### Dynamic Text Scaling
To improve accessibility, we've introduced a **Dynamic Text Size Slider**. Users can now scale the entire application's font size from **12px to 40px** in real-time, ensuring optimal readability for everyone.

### Standardized PDF Exports
Generating professional reports is now easier than ever. We've unified the PDF export logic across **Daily, Weekly, Monthly, and Yearly** reports, ensuring consistent branding and high-quality output.

## Localization & UX
- **Terminology Update**: Renamed "Comments" to **"Anmerkungen"** in German locales for a more professional tone.
- **Sanitized Feedback**: Toast notifications no longer display internal database IDs, providing cleaner and safer user feedback.
- **Enhanced Translations**: Improved localizability across the entire application, including the new Admin Menu and system notifications.

## Technical Improvements
- **Dockerized Deployment**: Updated Docker configurations and base images for optimized containerization.
- **CI/CD Readiness**: Added a dedicated `ci` script in `package.json` for automated builds and Prisma schema synchronization.
- **Security Hardening**: Implemented `helmet` and `express-rate-limit` to protect the API from common vulnerabilities.
- **TypeScript Core**: Finalized the migration of backend controllers to TypeScript, ensuring better type safety and maintainability.

---

*Thank you for using Berichts-Heft! We are excited to hit this 1.0.0 milestone.*
