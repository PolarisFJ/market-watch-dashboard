# Market Watch Dashboard

A dark-theme single-page dashboard for tracking residential real estate market conditions.
Designed for property developers tracking financing costs, sales velocity, and supply pipeline.

**Live demo:** open `index.html` directly in any modern browser — no build step or server required.

![Market Watch Dashboard](screenshots/market_watch_snapshot.png)

---

## What It Shows

| Section | Content |
|---------|---------|
| **KPI row** | Latest CPI, OCR, 1Y fixed rate, metro median price, sales volume, inventory |
| **Chart** | Median price trend (smooth line) + monthly sales bars + CPI/OCR/Mtge rate lines (normalised) |
| **Rate Snapshot** | Current rate environment at a glance |
| **Decision Layer** | Developer-perspective analysis notes |
| **Data Table** | Full monthly history — metro median, sales, inventory, migration, supply consents |

---

## How to Run Locally

```
# No dependencies. Just open the file.
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

Requires an internet connection for the Inter font (Google Fonts CDN). Runs fully offline
if you replace the font link with a local copy.

---

## How to Use Your Own Data

1. Edit `assets/sample_market_data.js`
2. Update `MARKET_MONTHLY_DATA` (newest month first), `MARKET_CHART_SERIES` (oldest first), and `MARKET_DECISIONS`
3. See `docs/data_schema.md` for field definitions

No other files need to change.

---

## File Structure

```
index.html                      Entry point — open in browser
assets/
  market_watch.css              Dark theme styles
  market_watch.js               Chart, KPI, table rendering logic
  sample_market_data.js         Sample NZ market data (replace with your own)
sources/
  sample_market_data.md         Data provenance notes
docs/
  data_schema.md                Field definitions and update guide
screenshots/
  market_watch_snapshot.png     Dashboard screenshot (add your own)
```

---

## Bar Colour Logic

Sales volume bars use a priority colour scheme:

| Condition | Bar colour |
|-----------|-----------|
| Lowest month in dataset | `#ef4444` (red) |
| Highest month in dataset | `#94a3b8` (slate) |
| Latest month | `#22c55e` (green) |
| All other months | `#0f766e` (teal) |

---

## Privacy

This repository contains **no private project data**.
All sample figures are from publicly available NZ real estate and government statistics sources.
See `sources/sample_market_data.md` for full source attribution.

---

## License

MIT — see `LICENSE`.
