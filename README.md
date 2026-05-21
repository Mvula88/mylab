# Food Tests Lab

A Next.js app of interactive science and maths labs.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment variables

This project uses Supabase. Create a `.env` file in the project root with:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Find these values in your Supabase dashboard under **Settings → API**.

Restart `npm run dev` after editing `.env`.

## Keep secrets out of Git

The `.env` file holds secrets and **must never be pushed to GitHub**. It is already listed in [.gitignore](.gitignore):

```
.env
.env*.local
```

If you ever accidentally commit it:

1. Remove it from the index without deleting the local file:
   ```bash
   git rm --cached .env
   git commit -m "Stop tracking .env"
   ```
2. **Rotate the leaked keys** in the Supabase dashboard — anything pushed to GitHub should be treated as compromised, even if the commit is later removed.

For sharing the variable names with teammates, commit a `.env.example` file with empty values instead.
