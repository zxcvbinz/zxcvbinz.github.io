# davide.zip

Sito personale statico: nessun build, nessuna dipendenza. Si pubblica così com'è su GitHub Pages.

## File

| File | Cosa contiene |
|---|---|
| `index.html` | Struttura della pagina e meta tag |
| `style.css` | Stili (colore d'accento in `--acc`) |
| `app.js` | Modelli 3D wireframe, testi delle scene, splash del terminale |
| `assets/davide.jpg` | **La tua foto: aggiungila tu** (consigliato 550×650 o simile, verticale) |
| `assets/favicon.svg` | Icona della scheda |
| `CNAME` | Dominio personalizzato `davide.zip` |
| `.nojekyll` | Dice a GitHub Pages di servire i file senza Jekyll |

## Pubblicare su GitHub Pages

1. Copia tutti i file nella root del repository (oppure nella cartella `/docs`).
2. Metti la tua foto in `assets/davide.jpg`.
3. Repository → **Settings → Pages** → Source: *Deploy from a branch* → branch `main`, cartella `/ (root)` o `/docs`.
4. Il file `CNAME` imposta già il dominio `davide.zip`. Se usi un altro dominio, modificalo; se non usi un dominio personalizzato, eliminalo.

Per provarlo in locale: `python3 -m http.server` nella cartella e apri http://localhost:8000.

## Modifiche rapide

- **Testi delle scene**: in `app.js`, cerca `var SCENES`.
- **Righe del terminale iniziale**: in `app.js`, `var PATHS` (file estratti) e `var SYS` (righe di sistema).
- **Contatti**: email in `app.js` (cerca `mailto:`), WhatsApp e link social in `app.js` (cerca `wa.me`).
- **Colore d'accento**: `PROPS.accent` in fondo ad `app.js`.
