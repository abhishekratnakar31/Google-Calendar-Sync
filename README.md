# Google Calendar Sync

Google Calendar Sync is a lightweight JavaScript web app that lets users connect their Google account, read and sync calendar events between accounts or services, and manage calendar synchronization through a simple UI.

Live demo: https://google-calendar-sync-jet.vercel.app

---

## Features

- Sign in with Google (OAuth) to access your Google Calendar.
- Read events from one or more calendars.
- Sync events between calendars or external services (depends on configuration).
- Simple UI for selecting calendars and viewing upcoming events.
- Deployable to Vercel or any Node/JavaScript hosting platform.

> Note: The exact sync behavior and supported flows depend on how you configure the app (scopes, sync direction, and any external integrations). Adjust the environment variables and OAuth scopes to match your intended sync functionality.

---

## Tech stack

- JavaScript (project language)
- Next.js / Node.js (likely — app is deployable to Vercel)
- Google Calendar API (OAuth 2.0)

---

## Getting started (local)

Prerequisites

- Node.js (recommended v18+)
- npm or yarn
- A Google Cloud project with the Google Calendar API enabled and OAuth 2.0 credentials created

1. Clone the repository
   - git clone https://github.com/abhishekratnakar31/Google-Calendar-Sync.git
   - cd Google-Calendar-Sync

2. Install dependencies
   - npm install
   - or
   - yarn

3. Create OAuth 2.0 credentials in Google Cloud Console
   - Open https://console.cloud.google.com/
   - Create a new project (or use an existing one)
   - Enable the Google Calendar API for the project
   - Configure the OAuth consent screen (internal or external depending on your needs)
   - Create OAuth 2.0 Client ID credentials (type: Web application)
   - Add authorized redirect URI(s), for example:
     - http://localhost:3000/api/auth/callback/google
     - https://your-production-domain.com/api/auth/callback/google

4. Create a local environment file
   - Copy/create `.env.local` (or `.env`) and set the required variables. Example:
     ```
     GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
     GOOGLE_CLIENT_SECRET=your-google-client-secret
     NEXTAUTH_URL=http://localhost:3000
     SESSION_SECRET=some-random-secret
     ```
   - If the repository uses different names for env variables, adapt accordingly. (Check the code for exact variable names if necessary.)

4. Run the app locally
   - npm run dev
   - or
   - yarn dev
   - Open http://localhost:3000 in your browser and sign in with Google to begin.

---

## Deploying

- Vercel
  - Connect your GitHub repo to Vercel.
  - Set the same environment variables in the Vercel dashboard (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_URL, SESSION_SECRET, etc.).
  - Deploy. Ensure the OAuth redirect URIs in Google Cloud include your Vercel domain.

- Other hosts
  - Build and export per your host’s Node/Next.js instructions.
  - Make sure the production URL is set in your OAuth credentials and environment variables.

---

## OAuth scopes

When configuring the Google OAuth client, request only the scopes you need. Common Calendar scopes:

- https://www.googleapis.com/auth/calendar.events (read/write events)
- https://www.googleapis.com/auth/calendar.events.readonly (read-only)
- https://www.googleapis.com/auth/calendar (manage calendars and events)

Adjust scopes in the app config to match your needs and to keep user permission requests minimal.

---

## Troubleshooting

- Invalid redirect URI
  - Ensure the redirect URI configured in Google Cloud exactly matches the callback URL used by the app (including scheme and trailing slash rules).
- Insufficient scopes / permissions
  - If the app fails to read or write events, double-check the requested scopes and re-consent if necessary.
- Session or environment errors
  - Verify that required env vars are present and that SESSION_SECRET/other secrets are valid strings.

---

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repository.
2. Create a feature branch: git checkout -b feature/my-feature
3. Commit your changes and open a pull request.
4. Describe the changes, and include any migration or env var changes required.

If you want help drafting issues, tests, or a CI configuration, I can help create those.

---

## Security

- Do not commit client secrets or tokens to source control.
- Use environment variables and secret management for deployments.
- Follow the principle of least privilege when selecting OAuth scopes.

---

## License

No license file is included in the repository currently. If you want to open-source this project, consider adding a LICENSE (for example MIT). I can add a suggested MIT license file if you’d like.
