# AUMOREX — verificare mobile-first

Data: 20 septembrie 2026
Build verificat: Next 16.3.5

## Rezultat

Implementarea fazelor 0–5 din `mobile-first-audit-and-plan.md` este încheiată pentru problemele F01–F12.

- F01/F12: layout-urile au `min-width: 0`, tipografia germană poate face wrap, typewriter-ul nu mai impune o lățime intrinsecă, iar baza responsive este consolidată prin reguli mobile-first de hardening.
- F02: textele mici de pe copper folosesc `#06141e`; contrastul calculat este 4.60:1 pe `#b86a42`.
- F03/F06: meniul este controlat prin React, se închide la ancore și Escape, revine cu focus la toggle, iar controalele/linkurile comune au ținte de cel puțin 44px.
- F04: conținutul german este învelit în `.site-shell[lang="de"]`; formularul păstrează `lang="de"`.
- F05: formularul validează trim-ul, emailul și câmpurile de transport în client, leagă mesajele de câmpuri, focalizează primul invalid și separă erorile de validare de eșecul de livrare.
- F07: CTA-ul home și primul input quote sunt aduse mai sus la 375px fără a comprima textul sub limite lizibile.
- F08: hero și portfolio folosesc `next/image`; portfolio are dimensiuni, `sizes` și lazy loading, iar Manrope este încărcat prin `next/font/google`.
- F09/F10: footer-ul german duce la `/legal` și indică `(EN)`; textele românești din portfolio DE au fost traduse.
- F11: back-to-top este scos din tab order când este ascuns și respectă `prefers-reduced-motion` în JS și CSS.

## Matrice responsive

Server production proaspăt: `http://localhost:3004`.

| Viewport | Rute verificate | Overflow |
|---|---:|---:|
| 320×740 | 7/7 | 0 |
| 375×812 | 7/7 | 0 |
| 390×844 | 7/7 | 0 |
| 430×932 | 7/7 | 0 |
| 768×1024 | 6 rute reprezentative | 0 |
| 900×900 | 6 rute reprezentative | 0 |
| 901×900 | 6 rute reprezentative | 0 |
| 1024×900 | 6 rute reprezentative | 0 |
| 1440×900 | 7/7 | 0 |
| 667×375 landscape | 6 rute reprezentative | 0 |

Total verificări finale: 65. Condiția măsurată a fost `document.documentElement.scrollWidth <= window.innerWidth + 1`.

## Interacțiuni verificate

- Menu → Routes actualizează ancora și închide meniul.
- Escape închide meniul și readuce focusul la toggle.
- Footer DE: `/legal`.
- Quote: whitespace-only, validare de contact, validare transport, focus pe primul invalid, pașii Contact → Transport → Confirmation, Edit/Back și păstrarea valorilor.
- Data calendaristică a fost introdusă prin calea tastaturii native; trimiterea finală nu a fost executată.
- Imaginile portfolio au `loading="lazy"`, dimensiuni reale, `sizes` și srcset Next; hero-ul a fost verificat cu sursa browserului de 384px la viewport mobil.
- Detectorul Impeccable: `[]` pentru `app styles.css components`.

## Verificări tehnice

- `npx tsc --noEmit`: trece.
- `npm run lint`: trece cu 4 avertismente preexistente, fără erori: dependency-array complex în `quote-form.tsx`, două `<img>` în componentele de brand și `<img>` în ramura legacy neutilizată a `site.tsx`.
- `npm run build`: trece; rutele statice și `/api/quote` sunt generate cu succes.
- `git diff --check`: fără erori de whitespace; Git raportează doar conversia normală LF/CRLF pentru fișierele editate.

## Limitări

- Nu s-au trimis cereri reale și nu s-au trimis emailuri; stările de livrare 400/502/503 au fost implementate, dar nu forțate printr-un POST real.
- Capturile au fost inspectate în browserul local, dar nu au fost exportate ca fișiere persistente.
- Nu s-au măsurat Lighthouse/LCP/INP/CLS în producție, nu s-au folosit dispozitive iOS/Android reale și nu s-a făcut test cu cititor de ecran.
- Root `html.lang` rămâne `en` deoarece App Router folosește un singur root layout; conținutul german server-rendered este marcat semantic pe shell-ul complet al fiecărei rute DE, fără nested `<html>`.
- `/legal` rămâne intenționat un draft și necesită date juridice reale înainte de publicare.
