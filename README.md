# KapadKart Admin Panel

Platform admin UI to add, update, suspend, soft-delete, and restore client shops.

## Run

1. Backend running on `http://localhost:3000` with `PLATFORM_ADMIN_KEY` set in `.env`
2. Soft-delete migration applied: `npm run db:migrate-soft-delete` (in backend)
3. Start this app:

```bash
cd kapadkart-admin-panel
npm install
npm run dev
```

Open `http://localhost:5174/login` and sign in with `PLATFORM_ADMIN_KEY`.

## Features

- List shops (optionally include deleted)
- Create shop + owner account
- Edit branding / contact / owner
- Suspend / activate
- Soft delete + restore
