# AUMOREX TRANSPORT — website asset pack

Masterul este reconstruit ca geometrie SVG reală, fără imagini PNG embedded. Toate SVG-urile au `viewBox`, fundal transparent implicit și sunt independente de fonturi: wordmark-ul este desenat ca trasee vectoriale.

## Structură

- `svg/logo-complete-primary.svg` — lockup pentru fundal deschis
- `svg/logo-complete-reversed.svg` — lockup pentru fundal navy
- `svg/logo-complete-light.svg` — variantă light pentru suprafețe închise
- `svg/logo-complete-monochrome.svg` — o singură culoare navy
- `svg/symbol-only-*.svg` — simbol fără wordmark
- `png/` — transparențe la 512, 1024 și 2048 px
- `icons/favicon.svg`, `icons/favicon.ico`, PNG 16/32/48/64
- `icons/icon-180.png`, `icon-192.png`, `icon-512.png`, `social-profile-1080.png`
- `site.webmanifest`, `brand.css`

## Integrare HTML

```html
<img src="/assets/svg/logo-complete-primary.svg" alt="AUMOREX TRANSPORT" width="520" height="300">
<link rel="icon" href="/assets/icons/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/icons/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/assets/icons/icon-180.png">
<link rel="manifest" href="/assets/site.webmanifest">
```

## Integrare CSS

Importă `brand.css` și folosește `--aumorex-navy`, `--aumorex-copper`, `--aumorex-warm-white`. Pentru HTML responsive, setează doar `width`; SVG-ul păstrează proporțiile prin `viewBox`.

## Paletă

- Navy: `#142B3B`
- Cupru: `#B86A42`
- Alb cald: `#F5F4EF`

Verificare efectuată: XML SVG valid, `viewBox` prezent, fără `data:image`/PNG embedded, transparență în variantele web și randări PNG pentru fundal deschis/închis.
