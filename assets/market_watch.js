/* Market Watch Dashboard — Rendering Logic
 * Standalone demo version.
 * Requires: sample_market_data.js loaded before this script.
 *   Globals: MARKET_MONTHLY_DATA, MARKET_LATEST, MARKET_CHART_SERIES, MARKET_DECISIONS
 */

/* ── Snapshot date (auto-generated from current date) ── */
(function () {
  var d    = new Date();
  var yyyy = d.getFullYear();
  var mm   = String(d.getMonth() + 1).padStart(2, '0');
  var dd   = String(d.getDate()).padStart(2, '0');
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var dow  = days[d.getDay()];
  var el   = document.getElementById('mw-snapshot');
  if (el) el.textContent = 'Snapshot · ' + yyyy + '-' + mm + '-' + dd + ' · ' + dow;
})();

/* ── KPI Row ── */
function renderKPI() {
  var d = MARKET_LATEST;
  var cards = [
    { tag:'CPI',    val:d.cpi,                         lbl:'Inflation',       cls:'kpi-orange', accent:'' },
    { tag:'OCR',    val:d.ocr,                         lbl:'RBNZ Cash Rate',  cls:'kpi-yellow', accent:'#FFE033', shadow:true },
    { tag:'MTGE',   val:d.mtge,                        lbl:'1Y Fixed',        cls:'kpi-blue',   accent:'', shadow:false },
    { tag:'MEDIAN', val:d.median,                      lbl:'Metro Median',    cls:'kpi-purple', accent:'#a78bfa', shadow:true },
    { tag:'SALES',  val:d.sales.toLocaleString(),      lbl:'Monthly Volume',  cls:'kpi-green',  accent:'' },
    { tag:'INV.',   val:d.invUnits.toLocaleString(),   lbl:'Inventory Units', cls:'kpi-blue',   accent:'' },
    { tag:'DAYS',   val:d.days,                        lbl:'Days to Sell',    cls:'kpi-dim',    accent:'' },
    { tag:'MONTHS', val:MARKET_MONTHLY_DATA.length,   lbl:'in dataset',      cls:'',           accent:'' }
  ];
  var html = cards.map(function (c) {
    var accentStyle = c.accent
      ? ' style="border-left:3px solid ' + c.accent + ';' + (c.shadow ? 'box-shadow:-2px 0 8px ' + c.accent + '44;' : '') + '"'
      : '';
    return '<div class="kpi-card"' + accentStyle + '>'
      + '<div class="kpi-tag">' + c.tag + '</div>'
      + '<div class="kpi-val ' + c.cls + '">' + c.val + '</div>'
      + '<div class="kpi-lbl">' + c.lbl + '</div>'
      + '</div>';
  }).join('');
  document.getElementById('kpi-row').innerHTML = html;
}

/* ── Table (13 columns — no Source column) ── */
var filteredData = MARKET_MONTHLY_DATA.slice();

function renderTable(data) {
  var html = data.map(function (r, i) {
    var isLatest = i === 0 && data === filteredData;
    var invW = (r.invWeeks === '—' || r.invWeeks == null) ? '—' : r.invWeeks;
    var dy   = (r.days === '—' || r.days == null) ? '—' : r.days;
    var mig  = r.migration == null ? '—' : (typeof r.migration === 'number' ? r.migration.toLocaleString() : r.migration);
    var sup  = r.supply == null    ? '—' : (typeof r.supply === 'number'    ? r.supply.toLocaleString()    : r.supply);
    var rowCls = isLatest ? ' class="latest"' : '';
    return '<tr' + rowCls + '>'
      + '<td class="td-month">' + r.month + '</td>'
      + '<td class="td-dim">' + r.cpi + '</td>'
      + '<td style="color:' + (isLatest ? '#FFE033' : 'rgba(255,255,255,0.8)') + '">' + r.ocr + '</td>'
      + '<td class="td-blue">' + r.mtge + '</td>'
      + '<td class="td-purple">' + r.median + '</td>'
      + '<td class="td-green">' + r.sales.toLocaleString() + '</td>'
      + '<td class="td-blue">' + r.invUnits.toLocaleString() + '</td>'
      + '<td class="td-dim">' + invW + '</td>'
      + '<td class="td-dim">' + dy + '</td>'
      + '<td class="td-dim">' + (r.ns_median || '—') + '</td>'
      + '<td class="td-dim">' + (r.ns_sales  || '—') + '</td>'
      + '<td class="td-dim">' + mig + '</td>'
      + '<td class="td-dim">' + sup + '</td>'
      + '</tr>';
  }).join('');
  document.getElementById('mkt-tbody').innerHTML = html
    || '<tr><td colspan="13" style="color:var(--text-sec);padding:14px;text-align:center;">No results</td></tr>';
  var thMonth = document.getElementById('th-month');
  if (thMonth) thMonth.textContent = 'Month (' + data.length + ')';
}

/* ── Chart (SVG) ── */
function renderChart() {
  var series = MARKET_CHART_SERIES;
  var svgEl  = document.getElementById('chart-svg');
  var svgBox = svgEl.getBoundingClientRect();
  var W = Math.max(320, Math.round(svgBox.width  || svgEl.clientWidth  || 760));
  var H = Math.max(180, Math.round(svgBox.height || svgEl.clientHeight || 235));
  var padB = 24, padL = 18, padR = 130;
  var trendTop = 30, trendBottom = 70;
  var rateStripY = 84, bandY = 116, mainTop = 172, mainBottom = H - padB;
  var iW = W - padL - padR, mainH = mainBottom - mainTop;

  var sortedFull = MARKET_MONTHLY_DATA.slice().sort(function (a, b) {
    return a.month < b.month ? -1 : 1;
  });

  function parseRate(s) {
    if (!s || s === 'tbc' || s === '—') return null;
    var m = String(s).match(/([\d.]+)/);
    return m ? parseFloat(m[1]) : null;
  }

  var maxSales   = Math.max.apply(null, series.map(function (s) { return s.sales; }));
  var minSales   = Math.min.apply(null, series.map(function (s) { return s.sales; }));
  var minMedian  = Math.min.apply(null, series.map(function (s) { return s.median; }));
  var maxMedian  = Math.max.apply(null, series.map(function (s) { return s.median; }));
  var medianRange = maxMedian - minMedian || 0.1;

  var n = series.length;
  var slotW = iW / n;
  var barW  = slotW * 0.4;
  var salesScaleMax = maxSales * 1.25;

  var pts = series.map(function (s, i) {
    var rec = sortedFull[i] || {};
    var cx  = padL + (i + 0.5) * slotW;
    var barH = (s.sales / salesScaleMax) * mainH * 0.74;
    var py  = mainBottom - ((s.median - minMedian) / medianRange) * mainH * 0.78 - mainH * 0.04 - mainH * 0.546;
    return { cx:cx, py:py, barH:barH, s:s,
             cpi:parseRate(rec.cpi), ocr:parseRate(rec.ocr), mtge:parseRate(rec.mtge) };
  });

  function rateToY(vals) {
    var valid = vals.filter(function (v) { return v !== null; });
    if (!valid.length) return vals.map(function () { return null; });
    var mn = Math.min.apply(null, valid), mx = Math.max.apply(null, valid);
    var rng = mx - mn || 0.01;
    return vals.map(function (v) {
      if (v === null) return null;
      return trendBottom - ((v - mn) / rng) * (trendBottom - trendTop);
    });
  }

  var cxArr    = pts.map(function (p) { return p.cx; });
  var cpiY     = rateToY(pts.map(function (p) { return p.cpi; }));
  var ocrY     = rateToY(pts.map(function (p) { return p.ocr; }));
  var mtgeY    = rateToY(pts.map(function (p) { return p.mtge; }));
  var cpiVals  = pts.map(function (p) { return p.cpi; });
  var ocrVals  = pts.map(function (p) { return p.ocr; });
  var mtgeVals = pts.map(function (p) { return p.mtge; });

  function latestRateLabel(name, vals, cyArr, rawKey, labelY) {
    for (var i = vals.length - 1; i >= 0; i--) {
      if (vals[i] !== null && cyArr[i] !== null) {
        var raw = sortedFull[i] && sortedFull[i][rawKey] ? sortedFull[i][rawKey] : vals[i] + '%';
        return { name:name, text:name + ' ' + raw, x:cxArr[i], y:cyArr[i], labelY:labelY };
      }
    }
    return null;
  }

  function compactRate(v) {
    return v === null ? '-' : String(v).replace(/\.0$/, '');
  }

  function ratePath(cyArr) {
    var d = '', seg = false;
    for (var i = 0; i < cxArr.length; i++) {
      if (cyArr[i] === null) { seg = false; continue; }
      if (!seg) { d += 'M ' + cxArr[i].toFixed(1) + ' ' + cyArr[i].toFixed(1); seg = true; }
      else       { d += ' L ' + cxArr[i].toFixed(1) + ' ' + cyArr[i].toFixed(1); }
    }
    return d;
  }

  function smoothD(arr) {
    var d = 'M ' + arr[0].cx.toFixed(1) + ' ' + arr[0].py.toFixed(1);
    for (var i = 0; i < arr.length - 1; i++) {
      var p0 = arr[i > 0 ? i - 1 : i], p1 = arr[i], p2 = arr[i + 1], p3 = arr[i + 2 < arr.length ? i + 2 : i + 1];
      var cp1x = p1.cx + (p2.cx - p0.cx) / 6, cp1y = p1.py + (p2.py - p0.py) / 6;
      var cp2x = p2.cx - (p3.cx - p1.cx) / 6, cp2y = p2.py - (p3.py - p1.py) / 6;
      d += ' C ' + cp1x.toFixed(1) + ' ' + cp1y.toFixed(1)
         + ' ' + cp2x.toFixed(1) + ' ' + cp2y.toFixed(1)
         + ' ' + p2.cx.toFixed(1) + ' ' + p2.py.toFixed(1);
    }
    return d;
  }

  /* bars — colour priority: min > max > latest > normal */
  var bars = pts.map(function (p, i) {
    var bx = p.cx - barW / 2, by = mainBottom - p.barH;
    var sy = by - 4;
    var isMin    = p.s.sales === minSales;
    var isMax    = p.s.sales === maxSales;
    var isLatest = i === pts.length - 1;
    var barFill  = isMin ? '#ef4444' : (isMax ? '#94a3b8' : (isLatest ? '#22c55e' : '#0f766e'));
    var textFill = isMin ? '#fca5a5' : (isMax ? '#cbd5e1' : (isLatest ? '#FFE033' : '#4db8ae'));
    return '<rect x="' + (bx | 0) + '" y="' + (by | 0) + '" width="' + (barW | 0) + '" height="' + (p.barH | 0) + '" fill="' + barFill + '" rx="2"/>'
         + '<text x="' + p.cx.toFixed(1) + '" y="' + sy.toFixed(1) + '" text-anchor="middle" font-size="7" font-weight="600" font-family="Inter,sans-serif" fill="' + textFill + '" opacity="0.92">' + p.s.sales.toLocaleString() + '</text>';
  }).join('');

  /* rate trend lines (dashed, normalised for trend only) */
  var rateSvg = '';
  var dCPI = ratePath(cpiY), dOCR = ratePath(ocrY), dMtge = ratePath(mtgeY);
  if (dCPI)  rateSvg += '<path d="' + dCPI  + '" fill="none" stroke="#f59e0b" stroke-width="1.15" stroke-dasharray="4,3" stroke-linecap="round" opacity="0.7"/>';
  if (dOCR)  rateSvg += '<path d="' + dOCR  + '" fill="none" stroke="#FFE033" stroke-width="1.15" stroke-dasharray="4,3" stroke-linecap="round" opacity="0.55"/>';
  if (dMtge) rateSvg += '<path d="' + dMtge + '" fill="none" stroke="#7aa2d8" stroke-width="1.15" stroke-dasharray="4,3" stroke-linecap="round" opacity="0.68"/>';

  /* selective rate strip labels */
  var CPI_MONTHS = [1, 4, 7, 10];
  var OCR_MONTHS = [2, 5, 9, 12];
  var monthlyRateStrip = pts.map(function (p, i) {
    var rec = sortedFull[i] || {};
    var mo  = rec.month ? parseInt(rec.month.split('-')[1], 10) : 0;
    var isFirst   = i === 0;
    var isLast    = i === pts.length - 1;
    var isCPI     = CPI_MONTHS.indexOf(mo) !== -1;
    var isOCR     = OCR_MONTHS.indexOf(mo) !== -1;
    var prevMtge  = i > 0 ? pts[i - 1].mtge : null;
    var isMtgeChg = p.mtge !== null && prevMtge !== null && Math.abs(p.mtge - prevMtge) >= 0.15;
    if (!isFirst && !isLast && !isCPI && !isOCR && !isMtgeChg) return '';
    var x = (p.cx - slotW * 0.18).toFixed(1);
    return '<text x="' + x + '" y="' + rateStripY + '" text-anchor="start" font-size="7.4" font-weight="700" font-family="Inter,sans-serif">'
      + '<tspan x="' + x + '" dy="0"   fill="#7aa2d8" opacity="0.86">' + compactRate(p.mtge) + '</tspan>'
      + '<tspan x="' + x + '" dy="8.5" fill="#FFE033" opacity="0.84">' + compactRate(p.ocr)  + '</tspan>'
      + '<tspan x="' + x + '" dy="8.5" fill="#f59e0b" opacity="0.84">' + compactRate(p.cpi)  + '</tspan>'
      + '</text>';
  }).join('');

  /* right-side rate labels */
  var labelX = W - padR + 16;
  var rateLabelData = [
    latestRateLabel('Mtge', mtgeVals, mtgeY, 'mtge', trendTop + 11),
    latestRateLabel('OCR',  ocrVals,  ocrY,  'ocr',  trendTop + 29),
    latestRateLabel('CPI',  cpiVals,  cpiY,  'cpi',  trendTop + 47)
  ].filter(function (v) { return v !== null; });
  var rateLabels = rateLabelData.map(function (l) {
    var color  = l.name === 'Mtge' ? '#7aa2d8' : (l.name === 'OCR' ? '#FFE033' : '#f59e0b');
    var rawVal = l.text.replace(l.name + ' ', '');
    var y = l.labelY.toFixed(1);
    return '<text x="' + labelX + '" y="' + y + '" font-size="9.7" font-weight="700" font-family="Inter,sans-serif" fill="' + color + '" opacity="0.92" text-anchor="start">' + l.name + '</text>'
      + '<text x="' + (W - 4) + '" y="' + y + '" font-size="9.7" font-weight="700" font-family="Inter,sans-serif" fill="' + color + '" opacity="0.92" text-anchor="end">' + rawVal + '</text>';
  }).join('');

  /* right-side median and sales labels */
  var latestPt     = pts[pts.length - 1];
  var medianLblY   = latestPt ? latestPt.py.toFixed(1)                        : (mainTop + mainH * 0.4).toFixed(1);
  var salesLblY    = latestPt ? (mainBottom - latestPt.barH * 0.5).toFixed(1) : (mainBottom - 20).toFixed(1);
  var medianValStr = latestPt ? ('$' + latestPt.s.median.toFixed(3).replace(/\.?0+$/, '') + 'M') : '—';
  var salesValStr  = latestPt ? latestPt.s.sales.toLocaleString() : '—';
  var lx = labelX, rx = W - 4;
  var mainLabels =
    '<text x="' + lx + '" y="' + medianLblY + '" font-size="9.7" font-weight="700" font-family="Inter,sans-serif" fill="#a78bfa" opacity="0.92" text-anchor="start">Metro Median</text>'
    + '<text x="' + rx + '" y="' + medianLblY + '" font-size="9.7" font-weight="700" font-family="Inter,sans-serif" fill="#a78bfa" opacity="0.92" text-anchor="end">' + medianValStr + '</text>'
    + '<text x="' + lx + '" y="' + salesLblY  + '" font-size="9.7" font-weight="700" font-family="Inter,sans-serif" fill="#0f766e" opacity="0.92" text-anchor="start">Metro Sales</text>'
    + '<text x="' + rx + '" y="' + salesLblY  + '" font-size="9.7" font-weight="700" font-family="Inter,sans-serif" fill="#0f766e" opacity="0.92" text-anchor="end">' + salesValStr + '</text>';

  /* median price line (smooth bezier) */
  var linePath = '<path d="' + smoothD(pts) + '" fill="none" stroke="#a78bfa" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>';

  /* dots + price labels + month axis labels */
  var markers = pts.map(function (p, i) {
    var lbl       = '$' + p.s.median.toFixed(3).replace(/\.?0+$/, '') + 'M';
    var ly        = p.py - 7;
    var monthFill = i === pts.length - 1 ? '#FFE033' : '#c8d0df';
    var dotFill   = i === pts.length - 1 ? '#FFE033' : '#a78bfa';
    return '<circle cx="' + p.cx.toFixed(1) + '" cy="' + p.py.toFixed(1) + '" r="3.5" fill="' + dotFill + '" stroke="#07111f" stroke-width="1"/>'
         + '<text x="' + p.cx.toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="middle" font-size="8.3" font-family="Inter,sans-serif" fill="#c4b5fd">' + lbl + '</text>'
         + '<text x="' + p.cx.toFixed(1) + '" y="' + (H - 11) + '" text-anchor="middle" font-size="9.7" font-family="Inter,sans-serif" fill="' + monthFill + '">' + p.s.label + '</text>';
  }).join('');

  svgEl.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  var shiftPx    = Math.round(iW * 0.03);
  var chartGroup = '<g transform="translate(-' + shiftPx + ',0)">'
    + bars + rateSvg + monthlyRateStrip + linePath + markers
    + '</g>';
  svgEl.innerHTML = chartGroup + rateLabels + mainLabels;
}

/* ── Rate Snapshot + Decision Layer ── */
function renderDecisions() {
  var d = MARKET_LATEST;
  document.getElementById('rate-snapshot').innerHTML =
    '<div class="rate-snapshot">'
    + '<div class="rs-title">Latest Rate Snapshot</div>'
    + '<div class="rs-grid">'
    + '<div class="rs-col"><div class="rs-lbl">CPI</div><div class="rs-val" style="color:#f59e0b">'  + d.cpi  + '</div></div>'
    + '<div class="rs-col"><div class="rs-lbl">OCR</div><div class="rs-val" style="color:#FFE033">' + d.ocr  + '</div></div>'
    + '<div class="rs-col"><div class="rs-lbl">Mtge</div><div class="rs-val" style="color:#6ab4e8">' + d.mtge + '</div></div>'
    + '</div>'
    + '<div class="rs-note">actual latest rates; chart lines normalized</div>'
    + '</div>';
  document.getElementById('decision-items').innerHTML = MARKET_DECISIONS.map(function (item) {
    return '<div class="decision-item">'
      + '<div class="di-bullet"></div>'
      + '<div class="di-body">'
      + '<div class="di-dim">' + item.dim + '</div>'
      + '<div class="di-text">' + item.text + '</div>'
      + '</div></div>';
  }).join('');
}

/* ── Init ── */
renderKPI();
renderTable(filteredData);
renderChart();
renderDecisions();

var chartResizeTimer = null;
window.addEventListener('resize', function () {
  clearTimeout(chartResizeTimer);
  chartResizeTimer = setTimeout(renderChart, 120);
});
