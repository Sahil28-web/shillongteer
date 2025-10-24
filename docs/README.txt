Teer-Site Instructions
-----------------------

Overview
--------
Static website for Teer results with a modern UI, a 2x2 dashboard on the home page, and a dedicated Previous Results page. Content is data-driven via JSON files and editable from a mobile-friendly admin (Netlify CMS).

Key pages/files
---------------
- index.html — Home with 2x2 cards (Common, Dream, Previous Results, Hot)
- results.html — Previous Results with session filter and Load More
- dream.html — Dream Numbers searchable table
- script.js — Loads results.json and renders home + results pages
- dream.js — Loads dream.json and renders Dream page
- style.css — Theme, layout, and dashboard styles
- results.json — Daily results data
- dream.json — Dream numbers mapping
- admin/ — Netlify CMS admin UI and configuration

Run locally (needed for fetch of JSON)
-------------------------------------
Option A (Python):
  python -m http.server 5500
Open: http://localhost:5500/

Option B (Node):
  npx serve -l 5500
Open: http://localhost:5500/

View on phone (without publishing)
----------------------------------
1) Start local server as above, binding all interfaces if needed:
   python -m http.server 5500 --bind 0.0.0.0
2) Find PC IP (Windows): ipconfig → IPv4 Address, e.g. 192.168.1.25
3) Phone browser: http://192.168.1.25:5500/
Allow Windows Firewall when prompted.

Deploy options
--------------
- Netlify (drag-and-drop or connect GitHub)
- GitHub Pages (push repo, enable Pages)
- Vercel (import repo)

Netlify CMS (mobile admin at /admin)
------------------------------------
Files added:
- admin/index.html — loads Static CMS
- admin/config.yml — config to edit results.json and dream.json

One-time setup in Netlify:
1) Deploy the site to Netlify (folder root must contain index.html)
2) Enable Identity: Site → Identity → Enable
3) Identity settings: Registration = Invite only
4) Enable Git Gateway: Identity → Services → Enable Git Gateway
5) Invite owner email: Identity → Invite users
6) Owner logs in at: https://your-site.netlify.app/admin/

Editing data (formats)
----------------------
results.json accepts either a raw array or an object with items (CMS):
Raw array example:
[
  { "Date": "18 Oct 2025", "Session": "Morning", "FR": "62", "SR": "88" }
]

CMS format example:
{ "items": [ { "Date": "18 Oct 2025", "Session": "Morning", "FR": "62", "SR": "88" } ] }

dream.json supports the same two formats.
Entry example:
{
  "sl": 73,
  "dream": "Pencil",
  "direct": ["7","77","79"],
  "house": ["7"],
  "ending": ["7"]
}

Daily workflow (owner on phone)
-------------------------------
- Go to /admin/ → Results → Teer Results → Add item
- Fill: Date, Session (Morning/Afternoon/Evening), FR, SR → Publish
- For Dream Numbers: /admin/ → Dream Numbers → Dream Mapping → Add item → Publish
- Refresh the site pages to see changes

Troubleshooting
---------------
- Loading… persists: open the page via HTTP (not file://). Use local server or deployed site.
- Data not updating: hard refresh (Ctrl+F5) or clear cache; confirm deploy finished.
- CMS login fails: ensure Identity enabled and Git Gateway turned on; verify invite accepted.

Optional enhancements
---------------------
- Session-colored accents on cards (Morning/Afternoon/Evening)
- CSV import utility for backfilling results to results.json
- Basic validation for JSON entries and date normalization

Enjoy!
