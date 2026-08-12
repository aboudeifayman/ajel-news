# Ajel News - GitHub Pages deployment

## Frontend
The Vite/React frontend is deployed automatically to:

https://aboudeifayman.github.io/ajel-news/

GitHub Pages source should be set to **GitHub Actions**.

## Backend
GitHub Pages does not run Node/Express. Deploy `server.ts` to a Node-compatible host and set:

- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `FRONTEND_URL`

Then set the GitHub Actions build variable/secret or Vite environment so:

`VITE_API_URL=https://YOUR-BACKEND-DOMAIN`

Do not put the Gemini API key in frontend code.
