# Genuine Edu-Solutions — Next.js + Firebase Auth

Same UI as the original static site, rebuilt in Next.js (App Router) with Firebase login.

## Run it
```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
```
Firebase config lives in `.env.local` (template: `.env.local.example`).
On Vercel/Netlify add the same six `NEXT_PUBLIC_FIREBASE_*` variables in project settings.

## One-time Firebase setup
1. Console → **Build → Authentication → Sign-in method**: enable **Email/Password** and **Google**.
2. Authentication → **Settings → Authorized domains**: add your live domain (localhost is allowed by default).
3. Console → **Firestore → Rules**: paste `firestore.rules` and publish.
   (If your admin dashboard reads `enquiries` / `sessions`, add your admin rule there.)

## What's new
- `/login` – login, sign up, Google sign-in, forgot password
- `/profile` – profile page (protected) with Edit profile / Save / Cancel, password-reset email, logout
- Top bar – "Hi, Name 👋 | Logout" when logged in, "Login / Sign up" when not
- Header – avatar + name (links to profile) when logged in, "Login" button when not
- Home page `GreetingBanner` – welcome-back card when logged in, "Log in to save your details" card when not
- Hero greeting and the enquiry form use the user's name; the form is pre-filled from the profile
- Enquiries and analytics sessions now also store `userId` when the visitor is logged in

## Structure
```
app/            layout.js, page.js (home), login/, profile/, globals.css (original CSS), auth.css (new styles)
components/     TopBar, Header, Hero, GreetingBanner, Courses, Contact, Sections, ...
context/        AuthContext.js (Firebase Auth + users/{uid} profile in Firestore)
lib/            firebase.js, tracker.js (analytics, ported), courses.js
```
