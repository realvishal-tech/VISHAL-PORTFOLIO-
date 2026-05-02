# Vishal Portfolio

A modern, full-stack developer portfolio built with **React + Vite** and powered by **Firebase** (Auth, Firestore, Storage).

## ✨ Features

- Responsive portfolio with animated sections (Hero, About, Skills, Projects, Services, Contact)
- Admin dashboard protected by Firebase Authentication
- Dynamic content management via Firestore
- Dark/Light theme toggle
- PWA-ready with service worker and web manifest

---

## 🚀 Getting Started (Local Development)

### 1. Clone & Install

```bash
git clone https://github.com/realvishal-tech/VISHAL-PORTFOLIO-.git
cd VISHAL-PORTFOLIO-
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your Firebase project credentials:

```bash
cp .env.example .env
```

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Run Development Server

```bash
npm run dev
```

---

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project.
2. Enable **Authentication** (Email/Password).
3. Enable **Firestore Database**.
4. Enable **Storage**.
5. Register a Web App to get your config credentials.

---

## 📦 Deployment (Firebase Hosting)

This project deploys automatically via **GitHub Actions** on every push to `main`.

### One-time Setup

#### 1. Update `.firebaserc`

Replace `your-firebase-project-id` with your actual Firebase project ID:

```json
{
  "projects": {
    "default": "your-firebase-project-id"
  }
}
```

#### 2. Add GitHub Secrets

In your GitHub repository go to **Settings → Secrets and variables → Actions** and add:

| Secret | Value |
|--------|-------|
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase service account JSON |

#### 3. Generate `FIREBASE_SERVICE_ACCOUNT`

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and generate a CI token
firebase login:ci
```

Copy the printed token and add it as the `FIREBASE_SERVICE_ACCOUNT` secret.

Alternatively, download a service account JSON from **Firebase Console → Project Settings → Service Accounts → Generate new private key** and paste its contents as the secret value.

#### 4. Push to `main`

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically:

1. Install dependencies
2. Build the project with your Firebase environment variables
3. Deploy the `dist/` folder to Firebase Hosting

### Manual Deployment

```bash
npm install -g firebase-tools
firebase login
npm run build
firebase deploy --only hosting
```

---

## 🏗 Build

```bash
npm run build      # Production build → dist/
npm run preview    # Preview the production build locally
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5 |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Routing | React Router v6 |
| Backend | Firebase (Auth, Firestore, Storage) |
| Hosting | Firebase Hosting |
| CI/CD | GitHub Actions |
