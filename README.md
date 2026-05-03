# NX3 Carrier Service

Statische Landingpage fuer den `NX3 Carrier Service` inklusive `Impressum` und `Datenschutz`.

## Aktive Dateien

Die aktuell genutzte Seite liegt nicht mehr im alten `src/`-Scaffold, sondern direkt auf Root-Ebene:

- `index.html`
- `impressum.html`
- `datenschutz.html`
- `styles.css`
- `script.js`
- `config.js`
- `assets/`

## GitHub Pages

Das Projekt ist fuer automatisches Deployment mit `GitHub Pages` vorbereitet.

Die Workflow-Datei liegt unter:

- `.github/workflows/pages.yml`

Bei jedem Push auf `main` werden automatisch nur diese Dateien veroeffentlicht:

- `index.html`
- `impressum.html`
- `datenschutz.html`
- `styles.css`
- `script.js`
- `config.js`
- `assets/`

Alles andere wie Entwurfsdateien oder alte Varianten wird nicht mit deployed.

## Einmaliges Setup

1. Auf GitHub ein leeres Repository anlegen.
2. Lokal in diesem Ordner `git init -b main` ausfuehren, falls noch kein Repo existiert.
3. Remote setzen:

```bash
git remote add origin https://github.com/IHR-ACCOUNT/IHR-REPO.git
```

4. Dateien committen und pushen:

```bash
git add .
git commit -m "Initial NX3 Carrier Service site"
git push -u origin main
```

5. In GitHub unter `Settings > Pages` als Source `GitHub Actions` verwenden, falls GitHub das nicht direkt uebernimmt.

Danach gilt:

- lokal aendern
- `git add .`
- `git commit -m "..."`
- `git push`

GitHub Pages veroeffentlicht die Aenderungen dann automatisch neu.

## Lokale Pflege

- Inhalte und Struktur: `index.html`
- Styling: `styles.css`
- Interaktionen: `script.js`
- Rechtstexte: `impressum.html`, `datenschutz.html`

## Hinweise

- `.DS_Store` und der temporaere Publish-Ordner `_site/` sind ueber `.gitignore` ausgeschlossen.
- Die Seite ist rein statisch und braucht keinen Build-Prozess.
