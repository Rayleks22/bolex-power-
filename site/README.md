# Bolex Power Solutions — Website

A complete multi-page static website (plain HTML, CSS and JavaScript — no framework,
no backend). Built to be edited easily by hand and deployed free on Cloudflare Pages.

## 📁 What's in this folder

| File / folder | What it is |
|---|---|
| `index.html` | Home page |
| `about.html` | About us |
| `services.html` | Services overview (links to the 4 service pages below) |
| `services-solar.html` | Solar & Inverter Installation |
| `services-electrical.html` | Electrical Wiring & Industrial Power |
| `services-security.html` | CCTV & Security |
| `services-smart.html` | Smart Home, Audio-Visual & Lighting |
| `products.html` | Product catalogue (WhatsApp enquiry buttons) |
| `projects.html` | Filterable photo gallery with lightbox |
| `calculator.html` | Solar load calculator tool |
| `tips.html` | Tips & Guides index + 3 articles (`tips-*.html`) |
| `faq.html` | Frequently asked questions |
| `contact.html` | Contact details, map and quote form |
| `style.css` | All styling (colours, layout, buttons) |
| `script.js` | Menu, gallery, calculator, quote form logic |
| `images/` | All photos + logo (see "Swapping images" below) |
| `sitemap.xml`, `robots.txt` | Files that help Google find the site |
| `favicon.ico`, `images/apple-touch-icon.png` | Browser tab icon |

## ✏️ How to edit text

Every page is plain English text inside HTML tags. Open any `.html` file in a text
editor (Notepad, VS Code, Notepad++), find the sentence, change it, save, refresh
the browser. Useful rules:

- Change text **only between** the `<` and `>` arrows. Example: change
  `<h2>Our core services</h2>` to `<h2>What we offer</h2>` — leave the `<h2>` tags alone.
- **Contact details appear on every page** (header, footer, contact page). They are
  generated from one place if you rebuild, but in the shipped files just use
  Find & Replace (`Ctrl+H`) on the old number/email to change them everywhere.
- **Opening hours** are written as `Mon – Sat: 8:00 AM – 8:00 PM` — use Find & Replace
  to set your real hours (search `8:00 AM – 8:00 PM`).
- To add a photo to the Projects gallery, copy an image into `images/`, then open
  `projects.html` and copy one `<button class="g-item" …>…</button>` block, changing
  the `src`, `alt`, `data-caption` and `data-cat` (`solar`, `inverter` or `wiring`).

## 🖼️ Swapping images

All photos live in `images/` with clear names (`solar-roof-01.jpg`,
`inverter-room-01.jpg`, `panel-board-01.jpg`, `product-camera-01.jpg`…).

1. Prepare your new photo (JPEG, ideally under 500 KB — use any free image resizer).
2. **Either** replace the file in `images/` keeping the exact same name (every page
   updates automatically), **or** add a new file and update the `src="images/…"`
   line in the page where you want it.
3. The logo is `images/logo.png` (full lockup, used in the footer) and
   `images/logo-mark.png` (emblem used in the header and favicon).
4. The product images (`product-camera-01.jpg`, `product-cable-01.jpg`,
   `product-bulb-01.jpg`) are license-free stock-style photos — safe to keep, or
   replace with your own product photos using the same names.

## ⚡ Things to finish / confirm later

- **Testimonials:** the home page has a hidden testimonials section. When you have
  real customer testimonials, open `index.html`, find `hidden` in
  `<section class="section testimonials" hidden>`, delete the word `hidden`, and
  add the quotes inside. (Never invent testimonials.)
- **Domain:** the files use `https://bolexpower.com` in `sitemap.xml`, `robots.txt`
  and the "canonical/OG" tags inside each page's `<head>`. Once the real domain is
  bought, update those to match.
- **Google Business Profile:** create one (free) for local customers — add the same
  address, phone and hours used on this site.
- **Opening hours / address:** edit as described above whenever they change.

## 🚀 Deploying with GitHub + Cloudflare Pages (recommended)

This keeps every future update a simple `git push` — Cloudflare redeploys
automatically.

1. **Create an empty GitHub repository** (e.g. `bolexpower-website`) at
   <https://github.com/new> — private or public both work. Do NOT add a README
   or .gitignore there (this folder already has them).
2. **Push this folder** (a Git repo is already initialised inside it with the
   first commit made). From the `site/` folder in a terminal:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git branch -M main
   git push -u origin main
   ```
   Or use GitHub Desktop: *File → Add local repository*, then *Publish*.
3. **Connect Cloudflare:** <https://dash.cloudflare.com> → **Workers & Pages** →
   **Create** → **Pages** → **Connect to Git** → choose the repository:
   - Framework preset: **None**
   - Build command: **(leave empty)**
   - Build output directory: **/** (the repository root)
   - Click **Save and Deploy**.
4. Your site is live on a `*.pages.dev` address within a minute. From now on,
   every `git push` deploys automatically — no uploads needed.
5. To use your own domain (e.g. `bolexpower.com`): buy it from any registrar
   (Namecheap, GoDaddy, Whogohost…), then in Cloudflare Pages → **Custom domains**
   → add it and follow the DNS steps. After that, update the domain in
   `sitemap.xml`, `robots.txt` and the canonical/OG tags in each page's `<head>`.

**Alternative (no Git):** drag-and-drop the folder under *Workers & Pages →
Create → Pages → Upload assets*. You will need to re-upload manually for each
change, which is why the Git route is recommended.

## 📱 How the quote form works

The site is fully static — nothing is stored on a server. When a visitor fills the
quote form on the Contact page and taps **Send via WhatsApp**, it opens WhatsApp
with their details pre-filled to your WhatsApp number. If WhatsApp cannot open, a
"send by email" link appears as a fallback. The same pre-filled approach is used
on every "Enquire on WhatsApp" product button and the load calculator.

---

© Bolex Power Solutions — Reliable Solar & Inverter Solutions for a Brighter Tomorrow.
