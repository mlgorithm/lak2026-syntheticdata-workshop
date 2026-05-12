# LAK26 Synthetic Data Workshop Website

This folder contains the static website for GitHub Pages.

## Local preview

Run a static server from the repository root:

```sh
python3 -m http.server 8080 --directory docs
```

Then open `http://localhost:8080`.

## Deployment

The GitHub Pages workflow in `.github/workflows/pages.yml` publishes this `docs/` folder whenever changes are pushed to `main`.
