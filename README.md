# Farrag Coffee V2

Next.js RTL landing and ordering experience for بن فراج.

## Run

```bash
npm install
npm run dev
```

## Environment variables

Create `.env.local` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_SESSION_SECRET=...
ADMIN_LOGIN_USERNAME=...
ADMIN_LOGIN_PASSWORD_SALT=...
ADMIN_LOGIN_PASSWORD_HASH=...
```

Generate secure admin password hash (Node.js):

```bash
node -e "const {scryptSync, randomBytes}=require('crypto'); const pwd='CHANGE_ME'; const salt=randomBytes(16).toString('hex'); const hash=scryptSync(pwd,salt,64).toString('hex'); console.log({salt,hash});"
```

## Supabase setup

Run SQL in `supabase/products_setup.sql` inside Supabase SQL editor to:
- create `products` table
- add `updated_at` trigger
- enable RLS with public active-products read policy
- seed current products with stable IDs

## Admin

- Login page: `/admin/login`
- Dashboard: `/admin`
- Admin session is handled using an HttpOnly signed cookie.
- Product writes are server-side through `/api/admin/products` using `SUPABASE_SERVICE_ROLE_KEY`.
