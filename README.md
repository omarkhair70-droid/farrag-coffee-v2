# Farrag Coffee V2

**A premium Arabic/RTL coffee experience combining brand storytelling, guided product choice, catalog discovery, ordering, and admin-backed product management.**

[Live website](https://farrag-coffee-v2.vercel.app) · [Portfolio case study](https://omar-khair-portfolio.vercel.app/work/farrag-coffee)

## Product experience

Farrag Coffee V2 is the current version of the Farrag web work. It evolves the earlier static coffee site into a clearer product and ordering experience built around Arabic-first presentation.

Key product layers include:

- premium RTL brand presentation;
- coffee/product discovery;
- guided choice and catalog browsing;
- cart / ordering flow;
- WhatsApp-oriented conversion;
- Supabase-backed product data;
- server-side admin product management.

## Architecture

```text
Next.js / React
      │
      ├── Arabic / RTL storefront
      ├── product discovery + ordering
      └── server-side admin routes
                │
                ▼
             Supabase
          products / data
```

## Status

**Current Farrag Coffee web version · live.**

The separate `farrag-coffee` repository is retained only as earlier/evolution evidence and should not be confused with this V2.

---

## Technical setup

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

