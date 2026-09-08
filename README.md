# Tinkerer

Dark/modern Jekyll site for the Tinkerer Magic: The Gathering format.

## Structure

- `_data/banlist.yml` — current banned cards plus ban metadata fields.
- `_includes/card.html` — reusable card gallery component.
- `_layouts/default.html` — shared site shell.
- `assets/css/style.css` — dark/modern visual system.
- `assets/js/site.js` — Scryfall image loading and banlist filtering.
- `index.html` — format landing page and current banlist.
- `history.md` — banlist history.
- `about.md` — format overview.

## Important

The JavaScript now lives at `assets/js/site.js`, matching the path used by the layout. The previous repository had `assets/css/site.js`, which meant the browser was not loading the script and cards remained stuck on “Loading card”.

Scryfall is used for card images and links. The banlist YAML remains the source of truth for the 48 banned cards and supports `date_banned`, `reason`, and `typologies`.
