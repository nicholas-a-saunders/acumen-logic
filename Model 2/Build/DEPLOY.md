# Model 2 — Deploy & Admin Setup

## 1. Push to GitHub (do this first)

The code is committed locally. There is no `origin` remote yet.

1. Create a new repository on GitHub (e.g. `acumen-logic-model-2`). Do **not** add a README or .gitignore (you already have code).

2. From your machine, in the **Acumen Logic** repo root (the folder that contains `Model 2`, `Website`, etc.), run:

   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/acumen-logic-model-2.git
   git push -u origin main
   ```

   If your repo is under an organisation, use that URL instead. Use HTTPS or SSH (e.g. `git@github.com:...`) as you prefer.

3. On Render, create a **Web Service**, connect this GitHub repo, and set the **Root Directory** to `Model 2/Build` (so Render runs from the Build folder). Use the build/start commands from `render.yaml` (or let Render detect: Node, build `cd server && npm install`, start `cd server && node server.js`).

---

## 2. Environment variables (when you’re ready)

Set these in Render → Service → Environment:

- `DATABASE_URL` — Supabase (or other Postgres) connection string  
- `JWT_SECRET` — long random string for sessions  
- `ALLOWED_ORIGINS` — your Render URL, e.g. `https://acumen-logic-model-2.onrender.com`  
- `ADMIN_SECRET` — secret you use only to promote yourself to admin (see below)  
- Optional: `KIT_API_KEY`, `KIT_FORM_ID` for ConvertKit  
- Optional: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` for Google login  

See `server/.env.example` for the full list.

---

## 3. Making yourself the only admin (initially)

This is already in place. You stay the only admin by being the only one who knows `ADMIN_SECRET` and the only one you promote.

1. Set `ADMIN_SECRET` in Render to a long random string (e.g. a password generator). Keep it private.

2. Register on your live site with your own email (Sign up → create account).

3. Promote that account to admin by calling the API once with your email and the secret. From your machine (or Postman):

   ```bash
   curl -X POST https://YOUR-RENDER-URL.onrender.com/api/auth/promote-admin \
     -H "Content-Type: application/json" \
     -d '{"email":"YOUR_EMAIL@example.com","admin_secret":"YOUR_ADMIN_SECRET"}'
   ```

   Replace `YOUR-RENDER-URL`, `YOUR_EMAIL@example.com`, and `YOUR_ADMIN_SECRET` with your real values.

4. Log in to the site and open `/admin.html`. Only users with `tier = 'admin'` can use the admin dashboard.

No one else can become admin unless they have your `ADMIN_SECRET` and use it to call the same endpoint with their email. So as long as you don’t share the secret, you remain the only admin until you choose to promote someone else later (e.g. via a future admin “Promote user” feature).

---

## 4. Course link for Elite

When you have the final course URL, add it to the “Go to Course” / Elite course CTA in `public/upgrade.html` and in the dashboard “Course Progress” card (for Elite users). You said you’ll add this later, so nothing else is required for now.
