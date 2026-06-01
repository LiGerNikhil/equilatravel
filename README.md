# Equila Travel — Next.js Website

Premium cab service website for **Equila Travel** (a brand of **Equila Solutions Pvt Ltd**).

## Tech Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Three.js** — 3D hero car with mouse parallax + scroll camera travel
- **GSAP** — hero section entrance animations
- **Framer Motion** (available)
- **Google Fonts** — Playfair Display, Cormorant Garamond, Jost

## Features
- ✅ Full SEO (metadata, OpenGraph, Twitter Cards, JSON-LD schema, sitemap, robots.txt)
- ✅ Three.js 3D luxury car — rotates on mouse/touch, camera travels on scroll
- ✅ GSAP staggered hero entrance animations
- ✅ Mobile-first, fully responsive (375px → 1440px+)
- ✅ Glass-morphism cards with gold border accents
- ✅ Gold shimmer animated text
- ✅ Scroll-triggered reveal animations
- ✅ Interactive booking form with validation
- ✅ Proper Next.js routing (5 pages + legal pages)
- ✅ Footer with Equila Solutions Pvt Ltd branding
- ✅ 24/7 WhatsApp booking integration
- ✅ Smooth custom scrollbar

## Pages
| Route | Page |
|-------|------|
| `/` | Home (Hero + About + Services + Fleet + Safety + Testimonials + CTA) |
| `/about` | About Us |
| `/services` | Our Services |
| `/fleet` | Our Fleet |
| `/contact` | Contact & Booking Form |
| `/privacy-policy` | Privacy Policy |
| `/terms` | Terms & Conditions |

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

## Build for Production

```bash
npm run build
npm start
```

## Color System
| Token | Value | Usage |
|-------|-------|-------|
| `--royal-dark` | `#080814` | Primary background |
| `--royal-deep` | `#0d0d22` | Section backgrounds |
| `--gold-primary` | `#d4a017` | Accent, CTAs, icons |
| `--gold-pale` | `#f5e49a` | Shimmer highlights |

## Customization

### Update Contact Details
Edit `components/Footer.tsx` and `components/ContactForm.tsx`.

### Add Real OG Image
Place a `1200×630` image at `public/og-image.jpg`.

### Google Verification
Replace `'your-google-verification-code'` in `app/layout.tsx`.

### WhatsApp Integration
All WhatsApp links use `https://wa.me/917417914416`. Update the number there.

### Backend Integration
The `ContactForm.tsx` has a simulated submit. Replace the `handleSubmit` function with your real API call (e.g., email via Nodemailer, Resend, or a CRM webhook).

---

© Equila Travel · A brand of **Equila Solutions Pvt Ltd**
