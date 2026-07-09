# Walldecor99 — Premium Interior Web App

Wallpapers, wall panels, flooring, blinds & complete interiors — Agra.

## Features
- Home, Categories (16), Product Detail, AI Room Visualizer
- Cost Calculator with live panel-layout visualizer (6"–12" panel width)
- Inspiration Gallery, Customer Dashboard, Admin Dashboard
- Gold + charcoal premium design system (Fraunces + Manrope)

## Live karne ke steps (5 minute)

1. Is folder ki **saari files** GitHub repo `thewalldecor` mein upload/push karo
   (`.github` folder bhi — ye hidden hota hai, dhyan rahe)
2. Repo → **Settings → Pages** → Source: **GitHub Actions** select karo
3. Bas! Har push pe app apne aap build hoke live ho jayegi:
   `https://mysticgaurav21-web.github.io/thewalldecor/`

## Local pe chalane ke liye
```bash
npm install
npm run dev
```

## Structure
```
index.html                  — entry (Tailwind CDN + meta)
src/App.jsx                 — poora app (saari screens)
src/main.jsx                — React mount
vite.config.js              — base path /thewalldecor/
.github/workflows/deploy.yml — auto-deploy
```
