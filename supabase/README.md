# Supabase Integration & Database Setup

This guide describes how to connect the **Antigravity** Next.js 15 application to your Supabase project.

---

## 1. Project Initialization

1. Go to the [Supabase Dashboard](https://supabase.com/dashboard) and click **New Project**.
2. Name the project `Antigravity` and choose a secure database password.
3. Select your region and click **Create Project**.
4. Once provisioned, navigate to **Project Settings** -> **API** to copy the project credentials.

---

## 2. Environment Variables

1. Duplicate the `.env.local.example` file at the root of the project to create `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Paste the credentials retrieved in the previous step:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-api-key>
   ```

> [!IMPORTANT]
> Next.js loads environment variables starting with `NEXT_PUBLIC_` on the client, making them accessible in browser code. Any variables **not** prefixed with `NEXT_PUBLIC_` are kept private to the Node.js/Edge server and are invisible to the client.

---

## 3. Database Sync

1. Go to the **SQL Editor** inside your Supabase dashboard.
2. Click **New Query** -> **Blank Query**.
3. Copy the contents of [`supabase/schema.sql`](file:///c:/Users/otako/Music/hyro/supabase/schema.sql) and paste them into the SQL editor.
4. Click **Run** to execute the scripts. This creates tables, constraints, indices, user trigger functions, and Row-Level Security (RLS) policies.

---

## 4. Next.js Supabase Client Integration

To interface with the DB, install the client SDK:
```bash
npm install @supabase/supabase-js
```

Then initialize the client. We recommend saving this in `src/utils/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment credentials in .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 5. Security & Row-Level Security (RLS)

All tables have RLS enabled by default to prevent unauthorized manipulation:
- **Products & Categories**: Public reads are permitted. Inserts and modifications require an authenticated user with `is_admin = true` on their profile.
- **Orders & Items**: Users can only view or create orders linked to their own user UUID.
- **Blog Posts**: Anyone can read posts that have a non-null `published_at` timestamp.
- **Profiles**: Public profiles are read-accessible. Updating a profile is restricted to the owner of that user record.
