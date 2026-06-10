# Data Schema — Market Watch Dashboard

## MARKET_MONTHLY_DATA

Each object in the array represents one calendar month.

| Field      | Type            | Description |
|------------|-----------------|-------------|
| `month`    | string          | `"YYYY-MM"` — calendar month identifier |
| `cpi`      | string          | CPI inflation rate, e.g. `"3.1%"` |
| `ocr`      | string          | Official Cash Rate (central bank), e.g. `"2.25%"` |
| `mtge`     | string          | 1-year fixed mortgage rate, e.g. `"4.65%"` |
| `median`   | string          | Metro area median sale price, e.g. `"$0.98M"` |
| `sales`    | number          | Monthly residential sales volume (integer) |
| `invUnits` | number          | Active residential listings (inventory units) |
| `invWeeks` | string\|number  | Weeks of inventory supply; `"—"` if unavailable |
| `days`     | string\|number  | Median days on market; `"—"` if unavailable |
| `ns_median`| string          | District-level median price; `"—"` if unavailable |
| `ns_sales` | string\|number  | District-level sales count; `"—"` if unavailable |
| `migration`| string\|number  | Net migration (year-ended); `"—"` if unavailable |
| `supply`   | string\|number  | New dwellings consented (monthly); `"—"` if unavailable |

## MARKET_LATEST

Alias for `MARKET_MONTHLY_DATA[0]` — the most recent month.
Used by the KPI row and Rate Snapshot panel.

## MARKET_CHART_SERIES

Ordered oldest → newest for left-to-right chart rendering.

| Field    | Type   | Description |
|----------|--------|-------------|
| `label`  | string | Short month label, e.g. `"May-26"` |
| `median` | number | Median price as decimal, e.g. `0.98` = $0.98M |
| `sales`  | number | Sales volume integer |

**Important:** `MARKET_CHART_SERIES` must be aligned (same months, same order) with
`MARKET_MONTHLY_DATA` sorted oldest → newest. The chart renderer pairs them by index.

## MARKET_DECISIONS

Array of developer-perspective analysis notes rendered in the right panel.

| Field  | Type   | Description |
|--------|--------|-------------|
| `dim`  | string | Dimension label (bold heading) |
| `text` | string | Analysis note (1–2 sentences) |

## Notes on `"—"` sentinel

Use the string `"—"` (em dash) for any field where data is unavailable.
The dashboard renders this as a muted `—` without further processing.
Do not use `null`, `undefined`, or empty string — the renderer does not handle these.

## Adding a new month

1. Prepend a new object to `MARKET_MONTHLY_DATA` (newest month first).
2. Append a new `{ label, median, sales }` entry to `MARKET_CHART_SERIES` (oldest to newest order).
3. Update `MARKET_DECISIONS` if the market outlook has changed.
4. `MARKET_LATEST` auto-updates (it is always `MARKET_MONTHLY_DATA[0]`).
