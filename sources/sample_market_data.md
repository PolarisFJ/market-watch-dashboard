# Sample Market Data — Sources & Notes

This file documents the provenance of the sample data included in `assets/sample_market_data.js`.

## Data Classification

All figures in `sample_market_data.js` are **publicly available statistics** drawn from
official NZ government and real estate industry sources. No private project data,
client information, or internal business records are included.

## Primary Sources

| Field(s)                         | Source |
|----------------------------------|--------|
| `median`, `sales`, `invUnits`    | REINZ Auckland monthly property reports (reinz.co.nz) |
| `ns_median`                      | District-level market reports (various agents, REINZ) |
| `cpi`                            | Stats NZ Consumer Price Index quarterly release |
| `ocr`                            | Reserve Bank of NZ Monetary Policy Statement |
| `mtge`                           | Major bank published rates (1-year fixed) |
| `migration`                      | Stats NZ "International migration" monthly release (year-ended) |
| `supply`                         | Stats NZ "Building consents issued" monthly release |
| `days`                           | Barfoot & Thompson Auckland monthly report (2026-05 only) |

## Data Freshness Policy

- Historical records (all months except the most recent): treat as settled.
- Latest month: cross-verify against official sources before presentation.
- `migration` figures: Stats NZ revises for up to 16 months post-release — do not
  chase retroactive revisions.

## Replacing This Data

To use this dashboard with your own market data:

1. Edit `assets/sample_market_data.js` — follow the schema in `docs/data_schema.md`.
2. Update `MARKET_MONTHLY_DATA`, `MARKET_CHART_SERIES`, and `MARKET_DECISIONS`.
3. No other files need to change — all rendering is driven by the data file.

## Disclaimer

Sample figures are provided for demonstration purposes. Always verify against
official primary sources before using data in commercial or investment decisions.
