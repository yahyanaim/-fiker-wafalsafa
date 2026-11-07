# فكر وفلسفة (Fiker Wafalsafa)

Arabic editorial and philosophy platform built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS 4**, and **TypeScript**.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

## Environment Variables (Production Admin Security)

Admin login and session cookies are verified on the server (`/api/admin/login` and `/api/admin/session`). Create a `.env.local` file for production deployments:

```env
# Required in production (minimum 16 characters)
ADMIN_SECRET="replace-with-a-long-random-secret-string"

# Required in production (defaults to "admin101" in development only)
ADMIN_PASSCODE="your-strong-admin-passcode"

# Optional secret key for unlocking /admin via ?mac_key=<ADMIN_DEVICE_KEY>
ADMIN_DEVICE_KEY="your-secret-device-unlock-key"
```

## Scripts

- `npm run dev` — Start development server on port 8080
- `npm run build` — Build for production
- `npm run start` — Start production server on port 8080
- `npm run lint` — Run ESLint
