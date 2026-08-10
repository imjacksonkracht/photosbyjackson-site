# Photos by Jackson site agent instructions

## Purpose and layout

This is a dependency-free photography portfolio and booking site. The primary files are `index.html`, `style.css`, and `script.js`; gallery assets are expected under `images/{concerts,sports,events,portraits}/`.

## Local use

There is no build step:

```bash
python3 -m http.server 8000
```

## Constraints

- Keep the site deployable as plain static files unless the user explicitly approves a build system.
- The current gallery probes sequential JPEG names. Verify actual assets before changing counts or paths.
- Do not invent portfolio images, prices, turnaround times, contact details, reviews, or business claims.
- Keep contact and pricing values consistent wherever duplicated in HTML and JavaScript.
- Preserve keyboard access, focus behavior, alt text, responsive layout, lazy loading, theme behavior, and lightbox controls.
- Ensure the hero and Open Graph image have a real, deployable fallback.

## Verification

- Serve the site locally and test navigation, filters, lightbox, keyboard controls, theme, and representative mobile/desktop widths.
- Check for missing assets, broken links, console errors, invalid HTML, and inaccessible interactive controls.
- Report missing image content separately from code defects.

## Code review rules

- Flag references to nonexistent image files, duplicated business details that diverge, inaccessible controls, and unnecessary dependencies.
