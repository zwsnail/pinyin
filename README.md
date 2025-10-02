# Pinyin Input Practice

A minimal practice site that integrates a real Pinyin IME (jquery.ime `zh-pinyin`).

## Run locally

- Requires a static server (do not open with file://)
- Start server from repo root and open http://localhost:8000/

```bash
python3 -m http.server 8000
```

## Use

- Focus the textarea, type pinyin (e.g., `zhong`, `nihao`)
- Select candidates with space/number keys (IME behavior)
- Click "Commit" to move committed Chinese characters to the Committed text panel
- Or enable "Auto-commit" to move them automatically when committed

## Local vendor files (download once)
Place these in `vendor/` (exact filenames):

- `jquery-3.7.1.min.js`
  - https://code.jquery.com/jquery-3.7.1.min.js
- `jquery.ime.js` (v1.7.0)
  - https://cdn.jsdelivr.net/gh/wikimedia/jquery.ime@v1.7.0/dist/jquery.ime.js
- `jquery.ime.preferences.js` (v1.7.0)
  - https://cdn.jsdelivr.net/gh/wikimedia/jquery.ime@v1.7.0/dist/jquery.ime.preferences.js
- `jquery.ime.selector.js` (v1.7.0)
  - https://cdn.jsdelivr.net/gh/wikimedia/jquery.ime@v1.7.0/dist/jquery.ime.selector.js
- `jquery.ime.inputmethods.js` (v1.7.0)
  - https://cdn.jsdelivr.net/gh/wikimedia/jquery.ime@v1.7.0/dist/jquery.ime.inputmethods.js

## Deploy to GitHub Pages

1. Create a repo and push these files to the `main` branch
2. Enable GitHub Pages: Settings → Pages → Build and deployment → Source: GitHub Actions
3. The included workflow deploys the static site on push to `main`

Site will be published at https://<your-username>.github.io/<your-repo>/

## Notes

- All scripts can be served locally via `vendor/` (recommended for classroom reliability)
- No build step is needed. 