# Learning Notes

A simple Bootstrap-based static website for learning and interview preparation
notes. It uses plain HTML, CSS, JavaScript, and JSON with no build step.

## Run locally

From the repository root:

```powershell
python -m http.server 4000
```

Open <http://localhost:4000/>.

## Add or update notes

- Edit an existing page inside `notes/`.
- Create a new HTML fragment inside `notes/` to add a page.
- Add pages and modules to `navigation.json` so they appear in the sidebar.

See the site's **Writing Notes** page for examples.

## GitHub Pages

Configure GitHub Pages to deploy from the `main` branch and repository root.
The `.nojekyll` file ensures GitHub Pages serves the static files directly.
