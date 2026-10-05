# 🌐 Folder Guide: `frontend/src/app/`

## 🎯 What this folder does (Simple Words)
This folder defines all the **web pages and URL routes** in the Next.js frontend application.

Whenever the user navigates between different tabs in the application (like going to `/airspace`, `/cameras`, `/incidents`, `/recordings`, or `/settings`), Next.js looks at the files in this folder to render the corresponding tactical view.

---

## 🛠️ Technologies & Libraries Used
- **Next.js 16 (Turbopack)**: Modern React full-stack framework using App Router architecture.
- **Server Components & Client Components**: Fast page rendering with instant client-side transitions.
- **HTML5 Metadata**: SEO and title tag management.

---

## 📄 Files Inside & What They Do

| File / Route | What it does |
| :--- | :--- |
| `layout.tsx` | Root application layout wrapping all pages with Redux Store, React Query, WebSockets, and global styling. |
| `page.tsx` (`/`) | Default entry route redirecting to the main tactical command dashboard. |
| `airspace/page.tsx` (`/airspace`) | Direct deep-link to the **Aerial Drone Airspace Command** view. |
| `cameras/page.tsx` (`/cameras`) | Direct deep-link to the **Perimeter Cameras & CCTV Wall** view. |
| `incidents/page.tsx` (`/incidents`) | Direct deep-link to the **Incident Logs & Real-Time Alerts** audit table. |
| `recordings/page.tsx` (`/recordings`) | Direct deep-link to the **Evidence Database & Video Archive** gallery. |
| `settings/page.tsx` (`/settings`) | Direct deep-link to the **Detection Tuning & Calibration Settings** panel. |
| `globals.css` | Global CSS styles, Tailwind directives, tactical scanline animations, and dark mode tokens. |
