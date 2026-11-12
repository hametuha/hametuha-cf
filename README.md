# Hametuha Theme for CloudFlare


This is a collection of custom HTML page for CloudFlare.

- [Detailed documentation](https://developers.cloudflare.com/rules/custom-errors/)
- [Error Tokens](https://developers.cloudflare.com/rules/custom-errors/reference/error-tokens/)

## Build

```bash
npm ci
npm run build   # assets/ -> docs/ (Sass, Pug, images)
```

`docs/` is build output and is not committed. Use `npm start` for a local preview (BrowserSync on `docs/`).

Images in `assets/img` are copied to `docs/img` as-is. Compress an image once when you add or replace it, and commit the compressed file (the build does not compress images).

## Deploy

Merging into `master` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

1. **build**: `npm run build` (also runs on pull requests)
2. **deploy**: publishes `docs/` to GitHub Pages (`https://hametuha.github.io/hametuha-cf/`)
3. **refresh-cloudflare**: runs [`bin/refresh-cloudflare.sh`](bin/refresh-cloudflare.sh), which makes Cloudflare re-fetch every custom error page pointing to GitHub Pages (same as "Fetch custom page again" in the dashboard). It waits until GitHub Pages serves the new build before refreshing.

Required repository secrets:

| Name | Value |
|---|---|
| `CLOUDFLARE_API_TOKEN` | API token with *Zone › Custom Pages › Edit* on hametuha.com |
| `CLOUDFLARE_ZONE_ID` | Zone ID of hametuha.com |

To refresh manually, run the workflow from the Actions tab (`workflow_dispatch`), or locally:

```bash
npm run build
CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ZONE_ID=... bin/refresh-cloudflare.sh docs
```

## License

Source codes are MIT. Logo and other assets aren't.

&copy; 2016 Hametuha INC.
