# ECA Changeover Pilot — GitHub Upload & Test

## Recommended GitHub setup

1. Create a new **empty GitHub repository**.
2. Upload the contents of this project to the repository root. Do not upload the ZIP file itself into the repository.
3. Commit/push to the `main` branch.
4. Open **Settings → Pages**.
5. Under **Build and deployment**, select **GitHub Actions**.
6. The included `.github/workflows/pages.yml` will run tests, build the PWA, and publish `dist/`.
7. After the workflow finishes, GitHub will show the Pages URL.
8. Open that HTTPS URL on your phone and allow location access.

## Local test

From the project folder:

```bash
npm install
npm test
npm run build
npm run dev
```

For device GPS, use HTTPS in a deployed environment (localhost is also allowed for development geolocation testing).

## Important current project limitation

This repository is currently a **development/test build**. The README and project checkpoint state that it contains NO production regulatory dataset and NO real ECA boundary dataset. It contains fictional DEMO data for testing the application flow. Do not use the current build for real onboard compliance decisions until verified regulatory data and official boundary data have been properly loaded and validated.

## Current chunk state

This package is the complete repository from the supplied Chunk 17 archive, consolidated to a single clean repository root. Review `PROJECT_CHECKPOINT.md` and `NEXT_CHUNK_PROMPT.md` before continuing development with Claude.
