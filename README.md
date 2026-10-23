# Hametuha Theme for CloudFlare


This is a collection of custom HTML page for CloudFlare.

- [Detailed documentation](https://developers.cloudflare.com/rules/custom-errors/)
- [Error Tokens](https://developers.cloudflare.com/rules/custom-errors/reference/error-tokens/)

## Build

```bash
npm ci
npm run build   # assets/ -> docs/ (Sass, Pug, images)
```

Images in `assets/img` are copied to `docs/img` as-is. Compress an image once when you add or replace it, and commit the compressed file (the build does not compress images).

## License

Source codes are MIT. Logo and other assets aren't.

&copy; 2016 Hametuha INC.
