/* Market Watch — Sample Data
 * Source: publicly available NZ real estate and government statistics.
 * No private project data, client names, or internal file paths are included.
 * See sources/sample_market_data.md for full provenance.
 * See docs/data_schema.md for field definitions.
 *
 * To use with your own data: replace the arrays below following the same structure.
 * MARKET_MONTHLY_DATA — newest month first
 * MARKET_CHART_SERIES — oldest month first (chart renders left→right)
 */

var MARKET_MONTHLY_DATA = [
  { month:"2026-05", cpi:"3.1%", ocr:"2.25%", mtge:"4.65%", median:"$0.98M",   sales:885,  invUnits:6188, invWeeks:"—", days:46,  ns_median:"$1.26M", ns_sales:"—", migration:"—",   supply:"—"  },
  { month:"2026-04", cpi:"3.1%", ocr:"2.25%", mtge:"4.59%", median:"$0.955M",  sales:688,  invUnits:6356, invWeeks:"—", days:"—", ns_median:"—",      ns_sales:"—", migration:"—",   supply:3692 },
  { month:"2026-03", cpi:"3.1%", ocr:"2.25%", mtge:"4.59%", median:"$1.03M",   sales:1262, invUnits:6307, invWeeks:"—", days:"—", ns_median:"—",      ns_sales:"—", migration:24200, supply:3677 },
  { month:"2026-02", cpi:"3.1%", ocr:"2.25%", mtge:"4.49%", median:"$0.904M",  sales:785,  invUnits:6159, invWeeks:"—", days:"—", ns_median:"—",      ns_sales:"—", migration:25200, supply:3168 },
  { month:"2026-01", cpi:"3.1%", ocr:"2.25%", mtge:"4.49%", median:"$1.0M",    sales:824,  invUnits:5475, invWeeks:"—", days:"—", ns_median:"—",      ns_sales:"—", migration:23200, supply:2528 },
  { month:"2025-12", cpi:"3.1%", ocr:"2.25%", mtge:"4.49%", median:"$0.98M",   sales:849,  invUnits:5332, invWeeks:"—", days:"—", ns_median:"—",      ns_sales:"—", migration:14200, supply:3128 },
  { month:"2025-11", cpi:"3.1%", ocr:"2.25%", mtge:"4.49%", median:"$0.995M",  sales:969,  invUnits:6102, invWeeks:"—", days:"—", ns_median:"—",      ns_sales:"—", migration:10700, supply:3517 },
  { month:"2025-10", cpi:"3%",   ocr:"2.50%", mtge:"4.49%", median:"$0.95M",   sales:930,  invUnits:6024, invWeeks:"—", days:"—", ns_median:"—",      ns_sales:"—", migration:11900, supply:3520 },
  { month:"2025-09", cpi:"3%",   ocr:"3.00%", mtge:"4.79%", median:"$0.93M",   sales:1032, invUnits:5775, invWeeks:"—", days:"—", ns_median:"—",      ns_sales:"—", migration:12400, supply:3747 },
  { month:"2025-06", cpi:"2.7%", ocr:"3.25%", mtge:"4.95%", median:"$0.982M",  sales:876,  invUnits:5831, invWeeks:"—", days:"—", ns_median:"—",      ns_sales:"—", migration:13700, supply:2627 },
  { month:"2025-04", cpi:"2.5%", ocr:"3.50%", mtge:"5.66%", median:"$0.934M",  sales:842,  invUnits:6113, invWeeks:"—", days:"—", ns_median:"—",      ns_sales:"—", migration:21300, supply:2418 }
];

/* Latest month summary — used by KPI row and Rate Snapshot */
var MARKET_LATEST = MARKET_MONTHLY_DATA[0];

/* Chart series — ordered oldest → newest for left-to-right rendering */
var MARKET_CHART_SERIES = [
  { label:"Apr-25", median:0.934, sales:842  },
  { label:"Jun-25", median:0.982, sales:876  },
  { label:"Sep-25", median:0.930, sales:1032 },
  { label:"Oct-25", median:0.950, sales:930  },
  { label:"Nov-25", median:0.995, sales:969  },
  { label:"Dec-25", median:0.980, sales:849  },
  { label:"Jan-26", median:1.000, sales:824  },
  { label:"Feb-26", median:0.904, sales:785  },
  { label:"Mar-26", median:1.030, sales:1262 },
  { label:"Apr-26", median:0.955, sales:688  },
  { label:"May-26", median:0.980, sales:885  }
];

/* Developer Decision Layer — update when market conditions change */
var MARKET_DECISIONS = [
  { dim:"Rate Environment",    text:"OCR 2.25%; 1Y fixed 4.65% — rate environment remains a primary feasibility parameter for new pipeline." },
  { dim:"Sales Liquidity",     text:"Monthly sales 885; inventory 6,188 — track demand signals before committing to new supply pipeline." },
  { dim:"Pricing Confidence",  text:"Metro median $0.98M — monitor key price support/resistance thresholds for target buyer segment." },
  { dim:"Developer Action",    text:"Update market assumptions monthly; cross-check against official REINZ and Stats NZ releases before major commitments." }
];
