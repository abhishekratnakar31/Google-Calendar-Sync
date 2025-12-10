# Google Scheduler Connect (GSC)

Google Scheduler Connect is a full-stack system that lets users authenticate with Google, fetch their calendar data, store tokens securely, and automate scheduling workflows. It provides a smooth backend integration with the Google Calendar API along with a clean frontend interface for triggering event sync, viewing schedules, and managing token-based authentication.

Live demo: [[https://gsc-deploy.vercel.app](https://google-calendar-sync-jet.vercel.app/)]([https://gsc-deploy.vercel.app](https://google-calendar-sync-jet.vercel.app/)) (replace with your actual link)

---

## Features

* Google OAuth sign-in to securely fetch access and refresh tokens.
* Automated event fetching from Google Calendar using stored credentials.
* Fully functioning backend service for token management and Google Calendar API interactions.
* Frontend UI to authenticate users, trigger syncs, and test scheduling flows.
* Database support for storing Google Credentials (access token, refresh token, metadata).
* Easily deployable on Vercel or any Node/Next.js-compatible hosting service.

> Note: Sync automation and event behavior depend on your configured OAuth scopes and token permissions. Update `.env` values and scopes to match what your project needs.

---

## Tech stack

* **Next.js** (frontend and backend API routes)
* **Node.js**
* **Django REST Framework** (if used for earlier prototypes)
* **Google Calendar API (OAuth 2.0)**
* **MongoDB / PostgreSQL / SQLite** (depending on your setup)
* **Axios / Fetch** for API communication

---

## Getting started (local)

### Prerequisites

* Node.js v18+
* npm or yarn
* Google Cloud project with Calendar API enabled
* OAuth 2.0 credentials configured

### 1. Clone the repository

```
git clone https://github.com/<your-repo>/GSC.git
cd GSC
```

### 2. Install dependencies

```
npm install
```

or

```
yarn
```

### 3. Set up Google OAuth credentials

* Visit [https://console.cloud.google.com/](https://console.cloud.google.com/)
* Create/select a project
* Enable **Google Calendar API**
* Configure **OAuth consent screen**
* Create **OAuth 2.0 Client ID** (type: *Web application*)
* Add redirect URIs:

  * `http://localhost:3000/api/auth/callback/google`
  * `https://your-production-url.com/api/auth/callback/google`

### 4. Create your environment variables

Create `.env.local`:

```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
NEXTAUTH_URL=http://localhost:3000
SESSION_SECRET=some-long-random-string
DATABASE_URL=your-db-url-if-applicable
```

Modify names as required based on your actual code.

### 5. Run the app locally

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with Google.

---

## Deploying

### Deploying to Vercel

* Connect repo to Vercel.

* Add env vars:
  `GOOGLE_CLIENT_ID`,
  `GOOGLE_CLIENT_SECRET`,
  `NEXTAUTH_URL`,
  `SESSION_SECRET`,
  `DATABASE_URL` (if required).

* Deploy.

* Update Google Cloud with your Vercel redirect URI:

  * `https://your-vercel-domain.vercel.app/api/auth/callback/google`

### Deploying elsewhere

* Export or build based on host documentation.
* Ensure environment variables are configured.
* Production OAuth redirect URI must match your hosting URL.

---

## OAuth scopes

These are commonly used:

* `https://www.googleapis.com/auth/calendar.events` (read/write)
* `https://www.googleapis.com/auth/calendar.events.readonly` (read-only)
* `https://www.googleapis.com/auth/calendar` (full access)

Use the minimum scopes necessary to avoid scaring users with permissions they didn’t ask for.

---

## Troubleshooting

**Invalid redirect URI**
Means your Google Cloud configuration and your app URL are refusing to be friends. Make them match exactly.

**Token not refreshing**
Your refresh token probably didn’t get issued because you didn’t set access type to `offline` or didn’t include the right scopes.

**Session or environment issues**
Double-check `.env.local`, especially `SESSION_SECRET` and your client credentials.

---

## Contributing

Not required, but if you insist:

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Open a PR
5. Explain what you broke improved

I can help draft issues, docs, or tests if you want to clean this thing up even more.

---

## Security

* Never commit secrets or tokens.
* Keep all sensitive credentials in `.env`.
* Limit OAuth scopes to exactly what your app needs.
