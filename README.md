# Farmers' Voice

A bilingual English/Tamil awareness and peaceful civic-action website for mango farmers in the Krishnagiri-Dharmapuri-Bargur belt.

## Website sections

1. Home - movement identity, key figures and public appeal
2. Crisis - household effects, orchard abandonment and tree loss
3. Demands - specific requests matched to responsible offices
4. Paddy vs Mango - non-partisan comparison of support machinery
5. Take action - the first 90 days, role-based actions and testimony-flow demo
6. Evidence - all eight original PDFs, available to read and download
7. Solutions - procurement, price protection, FPO strength and value addition

## Included PDFs

All supplied source documents are stored in `public/documents/`. Their first-page previews are in `public/assets/docs/`.

## Logo

The movement logo uses the exact supplied mango-tree campaign image, unchanged, and is stored at `public/assets/farmers-voice-logo.png`.

The English/Tamil language control localizes the complete website interface, including document cards, navigation, forms, comparison labels, actions, accessibility labels, and footer copy. The original source PDFs remain unmodified.

## Run in VS Code on Windows

Requirements: Node.js 22.13 or newer and Visual Studio Code.

1. Extract the ZIP file.
2. In VS Code, choose **File → Open Folder** and select the `farmers-voice-movement` folder that contains `package.json`.
3. Choose **Terminal → New Terminal**.
4. Run:

```powershell
npm install
npm run dev
```

5. Open the local address printed in the terminal, normally `http://localhost:5173/`.
6. Press `Ctrl + C` in the terminal to stop the website.

The default development, build, start and lint commands are Windows-compatible. The `build:verified` and `validate:artifact` scripts are retained for the hosted Linux deployment workflow and are not required for local development.

If npm reports that installation scripts are pending, run:

```powershell
npm approve-scripts --allow-scripts-pending
npm rebuild
npm run dev
```

## Important launch note

The testimony form is deliberately a visual demo and does not send or store data. Before a public launch, add secure storage, consent, moderation, verified contact details and a privacy policy. Re-check seasonal prices, current officials and announced proposals against fresh official records.
