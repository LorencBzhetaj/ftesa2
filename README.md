# Ftesë fejese — Meli & Adi

Ftesë digjitale (mobile-first) e ndërtuar sipas udhëzimeve të `Royal-Wedding-Codex-Handoff.zip` (shiko `docs/`).

## Nisja lokale
```
npm install
npm run dev        # http://localhost:3000
npm run build      # build prodhimi
npm run typecheck
```

## Të dhënat
Të gjitha të dhënat janë te `config/wedding.json`.
- Emrat: Meli & Adi (`nameOrder: "bride-first"` në `config/wedding.json`) · Data: 27 Dhjetor 2026 · Ora: 13:00 · Lokali: Bar Restorant Vëllezërit Dushkaj (link Google Maps)
- `timeline`, tekstet: ende **null** → faqja tregon vlera shembull me etiketën "shembull · për t'u konfirmuar".
- Butoni "Shiko në Hartë" shfaqet vetëm kur plotësohet `venue.mapsUrl`.
- Kur gjithçka konfirmohet, vendos `"confirmed": true` (heq shiritin "Parapamje lokale").

## Asetet
- `public/img/envelope.jpg` – zarfi i miratuar; `envelope-body.jpg` – i njëjti me vulën e retushuar te xhepi (shtresë e veçantë).
- `public/img/dushkaj.jpg` – foto reale e lokalit (seksioni Lokacioni).
- Fotoja e çiftit: `photo` në `config/wedding.json` (tani `public/img/couple-2.jpg`).
- `public/img/couple.jpg`, `couple-2.jpg` – prerje nga foto e çiftit (`assets/pending/couple-original.jpg`). Private: përjashtuar në `.gitignore`.

Nuk është bërë asnjë deploy ose push.

## Imazhi i parapamjes (link preview)
- `app/opengraph-image.jpg` / `app/twitter-image.jpg` (1200×630): zarfi + "Ftesë për fejesën tonë", emrat dhe data.
- Rigjenerohet me `npm run og` (lexon `config/wedding.json`; kërkon ffmpeg).
- Kur të keni domenin përfundimtar, vendosni `NEXT_PUBLIC_SITE_URL=https://domeni-juaj` (në Vercel merret automatikisht).

## Kredite
- `public/img/rings.jpg` — foto nga Gladys Aguayo në Unsplash (https://unsplash.com/photos/a-close-up-of-a-person-rT_O_U5u-10), Unsplash License; e tonuar në sepia për ftesën.
