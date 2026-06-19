# Jagadeesh Chandra Prasad Sunkara — Portfolio

A cinematic, animated personal portfolio for **Jagadeesh Chandra Prasad Sunkara**, Software Engineer in Investment & Financial Technology.

Single self-contained `index.html` — no build step, no framework. Features a scroll-driven "workstation" scene that changes color and content for each project, an animated experience timeline, skills with hover-highlight tech logos, verbatim LinkedIn recommendations, and a downloadable résumé.

**Live demo:** _add your GitHub Pages URL here, e.g. https://jagadeesh-sunkara.github.io/Portfolio/_

## Sections
- **Hero** — headline, metrics that count up, résumé download.
- **Experience** — MGG Investment Group, bwtech@UMBC Fellowship, UMBC PM Club, Odessa (full-time + fellowship + leadership).
- **Projects** — 5 personal projects (Chest X-Ray CNN, Resume AI, Fraud Detection, UK Bank Analysis, Bike Share) shown in a pinned scroll scene that shifts color per project.
- **Skills** — six capability groups with brand-colored tech logos that light up on hover.
- **Education** — UMBC (MPS Data Science, 3.97 GPA) and LPU.
- **Recommendations** — 7 verbatim LinkedIn recommendations in a horizontal rail.
- **Contact** — email, LinkedIn, GitHub, phone, résumé.

## Tech
Plain HTML/CSS/JS. Fonts via Google Fonts. Tech logos are inline SVG (Simple Icons, CC0). No external JS libraries — everything runs offline once loaded.

## Run locally
```bash
python3 -m http.server 8000
# visit http://localhost:8000
```

## Deploy on GitHub Pages
1. Push these files to your repo.
2. Settings → Pages → Source: Deploy from a branch → branch `main`, folder `/ (root)` → Save.
3. Live at `https://<your-username>.github.io/<repo>/` after ~1–2 min.

## Files
```
index.html                      # the whole site
Jagadeesh_Sunkara_Resume.pdf    # downloadable résumé
README.md
LICENSE
.nojekyll                       # tells GitHub Pages to serve files as-is
.gitignore
```

## Editing
- **Résumé:** replace `Jagadeesh_Sunkara_Resume.pdf` (keep the name, or update the three href links).
- **LinkedIn:** search `linkedin.com/in/jagadeesh-sunkara` and update if needed.
- **Recommendations:** edit the `RECS` array in the script near the bottom of `index.html`.

© 2026 Jagadeesh Chandra Prasad Sunkara.
