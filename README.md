# Jagadeesh Sunkara — Personal Site

Personal portfolio and online presence for **Jagadeesh Chandra Prasad Sunkara**, a New York–based software engineer working across fintech, applied AI and data automation.

**Live site:** https://jagadeesh-sunkara.github.io/

Hand-built HTML, CSS and JavaScript — no framework, no build step, no third-party scripts, no trackers.

## Highlights
- **Interactive hero** — aurora gradient background, a particle network that reacts to the cursor, a rotating role line, and a working mini terminal (type `help`, `about`, `skills`, `projects`, `contact`, `resume`, `theme`).
- **About, What I do, Projects, Journey, Skills, Kind words, Contact** — filterable project cards, 3D tilt + spotlight hover, a timeline that draws as you scroll, tabbed skills, an auto-playing recommendations carousel, and a copy-email button.
- **Light and dark themes** (remembered per visitor), responsive down to phones, keyboard accessible, and respects `prefers-reduced-motion`.

## Files
```
index.html                      # page content
assets/site.css                 # theme tokens, layout, animations, responsive rules
assets/site.js                  # interactions + project / skills / recommendation data
assets/icons.js                 # tech logos (Simple Icons, CC0)
assets/boot.js                  # restores theme before paint; keeps content visible if JS fails
Jagadeesh_Sunkara_Resume.pdf    # downloadable résumé
og-image.png                    # social share preview
```

## Editing
- **Text:** `index.html`.
- **Projects, skills, recommendations, terminal replies:** the `PROJECTS`, `SKILLS`, `RECS` and `CMDS` objects in `assets/site.js`.
- **Résumé:** replace `Jagadeesh_Sunkara_Resume.pdf`, keeping the same name.

## Run locally
```bash
python -m http.server 8000
```
Then open http://localhost:8000. (Double-clicking `index.html` also works, but a local server matches GitHub Pages exactly.)

© 2026 Jagadeesh Chandra Prasad Sunkara.
