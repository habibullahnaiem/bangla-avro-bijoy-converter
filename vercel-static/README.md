# AvroJoy — Vercel Static Copy

This is a separate static build of AvroJoy. It keeps the public converter, DOCX/TXT local conversion, PWA, local recent history, themes, SEO, sharing, and support content. It deliberately excludes account login, database access, private document persistence, and managed file storage.

## Deploy on Vercel

Import this directory into a new Vercel project. Vercel should use `pnpm run build` and publish `dist/public`; these values are already declared in `vercel.json`. No application secrets are required. The Vercel configuration proxies the public SutonnyMJ/fonts/logo/banner asset paths to the existing Manus deployment so the static copy retains its current visual and offline resources.

The original Manus full-stack application remains separate and unchanged.
