# Ekadashi Calendar Alarm — Web Landing

Static landing page for the **Ekadashi Calendar Alarm** mobile app.

## Stack

- Plain HTML / CSS / JS — no build step required.
- [AOS](https://michalsnik.github.io/aos/) — scroll-triggered fade/slide animations (loaded from CDN).
- Google Fonts: `Cormorant Garamond` (display) + `Inter` (body).

The color palette is taken directly from the app screenshots (warm cream
backgrounds, sage / teal buttons, peach & pink florals, soft gold accents).

## Run locally

Just open `index.html` in a browser, or serve the folder with any static server:

```bash
# Python
python3 -m http.server 5173

# Node
npx serve .
```

Then visit `http://localhost:5173`.

## Structure

```
WebLanding/
├── index.html       # markup
├── styles.css       # palette, layout, animations
├── script.js        # AOS init, parallax tilt, sticky header, year
├── assets/          # app icon, screenshots, banner
└── README.md
```

## Editing copy

All marketing copy lives directly in `index.html` (English). Update the
sections in order: hero → about → features → screens → languages → FAQ → CTA.

## Replacing assets

Drop new images into `assets/` and update the `src` paths in `index.html`.
Keep aspect ratios close to the originals so the device frames don't crop.
