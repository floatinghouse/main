/* Floating House — visualisasi SVG tanpa pustaka luar.
   Berisi: penampang interaktif (beranda), grafik pasang surut, grafik maksimum tahunan, grafik skenario kedalaman. */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var C = { ink: "#0f2a3a", muted: "#5b707b", tide: "#17707a", drum: "#2d5da8", signal: "#9a6412", danger: "#a23a2a", line: "#c9d4d8", grid: "#e1e8eb", water: "#cfe6ea", bed: "#b9a98b" };

  function el(name, attrs, parent) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function txt(parent, x, y, s, attrs) {
    var t = el("text", Object.assign({ x: x, y: y }, attrs || {}), parent);
    t.textContent = s;
    return t;
  }
  function fmt(x, n) { return window.FH ? FH.fmt(x, n) : String(Math.round(x * Math.pow(10, n)) / Math.pow(10, n)); }
  function niceTicks(min, max, count) {
    var span = max - min, step = Math.pow(10, Math.floor(Math.log10(span / count)));
    var err = (count * step) / span;
    if (err <= 0.15) step *= 10; else if (err <= 0.35) step *= 5; else if (err <= 0.75) step *= 2;
    var out = [], v = Math.ceil(min / step) * step;
    for (; v <= max + 1e-9; v += step) out.push(Math.round(v / step) * step);
    return out;
  }

  /* ---------- grafik garis generik ---------- */
  function lineChart(box, o) {
    box.innerHTML = "";
    var W = o.width || 760, H = o.height || 320, m = Object.assign({ t: 16, r: 18, b: 44, l: 56 }, o.margin || {});
    var all = [];
    o.series.forEach(function (s) { s.points.forEach(function (p) { all.push(p); }); });
    var xmin = o.xMin != null ? o.xMin : Math.min.apply(null, all.map(function (p) { return p[0]; }));
    var xmax = o.xMax != null ? o.xMax : Math.max.apply(null, all.map(function (p) { return p[0]; }));
    var ys = all.map(function (p) { return p[1]; }).concat((o.hlines || []).map(function (h) { return h.y; }));
    var ymin = o.yMin != null ? o.yMin : Math.min.apply(null, ys);
    var ymax = o.yMax != null ? o.yMax : Math.max.apply(null, ys);
    var pad = (ymax - ymin) * 0.06 || 1; if (o.yMin == null) ymin -= pad; if (o.yMax == null) ymax += pad;
    var X = function (x) { return m.l + (x - xmin) / (xmax - xmin || 1) * (W - m.l - m.r); };
    var Y = function (y) { return H - m.b - (y - ymin) / (ymax - ymin || 1) * (H - m.t - m.b); };

    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": o.title || "Grafik" }, box);
    if (o.desc) { var d = el("desc", {}, svg); d.textContent = o.desc; }
    var g = el("g", { "class": "grid" }, svg), ax = el("g", { "class": "axis" }, svg);
    niceTicks(ymin, ymax, 5).forEach(function (v) {
      el("line", { x1: m.l, x2: W - m.r, y1: Y(v), y2: Y(v) }, g);
      txt(ax, m.l - 8, Y(v) + 4, (o.yFmt || function (v) { return fmt(v, 1); })(v), { "text-anchor": "end" });
    });
    (o.xTicks || niceTicks(xmin, xmax, 6).map(function (v) { return { x: v, label: (o.xFmt || String)(v) }; })).forEach(function (t) {
      el("line", { x1: X(t.x), x2: X(t.x), y1: H - m.b, y2: H - m.b + 5, stroke: C.line }, ax);
      txt(ax, X(t.x), H - m.b + 18, t.label, { "text-anchor": "middle" });
    });
    el("line", { x1: m.l, x2: W - m.r, y1: H - m.b, y2: H - m.b }, ax);
    if (o.xLabel) txt(ax, (m.l + W - m.r) / 2, H - 6, o.xLabel, { "text-anchor": "middle", style: "font-size:12px;fill:#33505f" });
    if (o.yLabel) txt(ax, 14, (m.t + H - m.b) / 2, o.yLabel, { "text-anchor": "middle", transform: "rotate(-90 14 " + (m.t + H - m.b) / 2 + ")", style: "font-size:12px;fill:#33505f" });

    (o.hlines || []).forEach(function (h) {
      if (h.y < ymin || h.y > ymax) return;
      el("line", { x1: m.l, x2: W - m.r, y1: Y(h.y), y2: Y(h.y), stroke: h.color || C.muted, "stroke-dasharray": "5 4", "stroke-width": 1.2 }, svg);
      txt(svg, W - m.r - 4, Y(h.y) - 4, h.label, { "text-anchor": "end", style: "font-size:11px;fill:" + (h.color || C.muted) });
    });

    o.series.forEach(function (s) {
      var dstr = s.points.map(function (p, i) { return (i ? "L" : "M") + X(p[0]).toFixed(1) + " " + Y(p[1]).toFixed(1); }).join(" ");
      el("path", { d: dstr, fill: "none", stroke: s.color, "stroke-width": s.width || 2, "stroke-dasharray": s.dash ? "6 5" : null, "stroke-linejoin": "round" }, svg);
      if (s.markers) s.points.forEach(function (p) { el("circle", { cx: X(p[0]), cy: Y(p[1]), r: 3.2, fill: "#fff", stroke: s.color, "stroke-width": 2 }, svg); });
    });

    // tooltip
    var tip = document.createElement("div"); tip.className = "chart-tip"; box.appendChild(tip);
    var cross = el("line", { y1: m.t, y2: H - m.b, stroke: C.ink, "stroke-width": 1, opacity: 0 }, svg);
    var hit = el("rect", { x: m.l, y: m.t, width: W - m.l - m.r, height: H - m.t - m.b, fill: "transparent" }, svg);
    function move(ev) {
      var r = svg.getBoundingClientRect(), px = (ev.clientX - r.left) / r.width * W;
      var xv = xmin + (px - m.l) / (W - m.l - m.r) * (xmax - xmin);
      var s0 = o.series[0], best = null;
      s0.points.forEach(function (p, i) { if (best == null || Math.abs(p[0] - xv) < Math.abs(s0.points[best][0] - xv)) best = i; });
      if (best == null) return;
      var xp = s0.points[best][0];
      cross.setAttribute("x1", X(xp)); cross.setAttribute("x2", X(xp)); cross.setAttribute("opacity", 0.35);
      tip.innerHTML = (o.tip ? o.tip(best, xp) : o.series.map(function (s) { var p = s.points[best]; return p ? FH.esc(s.name) + ": " + fmt(p[1], 2) : ""; }).join("<br>"));
      tip.style.display = "block";
      tip.style.left = (X(xp) / W * r.width) + "px";
      tip.style.top = (Y(s0.points[best][1]) / H * r.height) + "px";
    }
    hit.addEventListener("mousemove", move);
    hit.addEventListener("mouseleave", function () { tip.style.display = "none"; cross.setAttribute("opacity", 0); });
    return svg;
  }

  function legend(id, items) {
    var ul = document.getElementById(id); if (!ul) return;
    ul.innerHTML = items.map(function (i) { return '<li><i style="border-top-color:' + i.color + '"' + (i.dash ? ' class="dash"' : "") + "></i>" + FH.esc(i.name) + "</li>"; }).join("");
  }

  /* ---------- penampang beranda ---------- */
  function penampang(P) {
    var box = document.getElementById("penampang-svg"); if (!box) return;
    var ctrl = document.getElementById("penampang-ctrl"); ctrl.hidden = false;
    var WLs = P.elevasi_muka_air_m_LWS;
    var wlSel = document.getElementById("xs-wl"), bed = document.getElementById("xs-bed"), rate = document.getElementById("xs-rate"), yr = document.getElementById("xs-yr");
    var W = 640, H = 380, top = 3.2, bot = -2.4;
    var Y = function (z) { return (top - z) / (top - bot) * H; };
    var drumD = 0.581;

    function draw() {
      var wl = WLs[wlSel.value], z0 = parseFloat(bed.value), r = parseFloat(rate.value) / 100, t = parseInt(yr.value, 10);
      var zb = z0 - r * t, depth = wl - zb;
      box.innerHTML = "";
      var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Penampang skematis rumah apung, muka air, dan dasar perairan" }, box);
      el("rect", { x: 0, y: 0, width: W, height: H, fill: "#f6f9fa" }, svg);
      // water
      el("rect", { x: 0, y: Y(wl), width: W, height: H - Y(wl), fill: C.water }, svg);
      // seabed (slight slope seaward to the right)
      var bedPath = "M0 " + Y(zb) + " L520 " + Y(zb) + " L640 " + Y(zb - 0.25) + " L640 " + H + " L0 " + H + "Z";
      el("path", { d: bedPath, fill: C.bed }, svg);
      if (t > 0) {
        el("path", { d: "M0 " + Y(z0) + " L520 " + Y(z0) + " L640 " + Y(z0 - 0.25), stroke: "#6b5a3e", "stroke-width": 1.5, "stroke-dasharray": "6 4", fill: "none" }, svg);
        txt(svg, 8, Y(z0) - 6, "dasar saat ini (survei 2026)", { style: "font-size:11px;fill:#6b5a3e" });
      }
      // datum lines
      var labels = ["HWS", "MHWS", "MSL", "MLWS", "LWS"];
      labels.forEach(function (k) {
        el("line", { x1: 480, x2: 640, y1: Y(WLs[k]), y2: Y(WLs[k]), stroke: k === wlSel.value ? C.tide : "#8aa1aa", "stroke-dasharray": "3 3", "stroke-width": 1 }, svg);
        txt(svg, 636, Y(WLs[k]) - 3, k + " " + fmt(WLs[k], 2), { "text-anchor": "end", style: "font-size:10.5px;fill:" + (k === wlSel.value ? C.tide : "#5b707b") + ";font-weight:" + (k === wlSel.value ? 700 : 400) });
      });
      el("line", { x1: 0, x2: W, y1: Y(wl), y2: Y(wl), stroke: C.tide, "stroke-width": 2 }, svg);
      // guide pile
      el("rect", { x: 395, y: Y(2.4), width: 12, height: H - Y(2.4), fill: "#e9eef0", stroke: "#5b707b" }, svg);
      // house: drum centre at waterline (illustrative half-submerged) unless grounded
      var bedUnder = zb; // dasar datar di bawah bangunan
      var drumBottom = Math.max(wl - drumD / 2, bedUnder);
      var grounded = wl - drumD / 2 < bedUnder;
      var dc = drumBottom + drumD / 2, rpx = (Y(0) - Y(drumD)) / 2;
      var g = el("g", {}, svg);
      for (var i = 0; i < 5; i++) el("circle", { cx: 110 + i * 2.2 * rpx, cy: Y(dc), r: rpx, fill: C.drum, stroke: "#1f4580", "stroke-width": 1.2 }, g);
      var deck = dc + drumD / 2;
      el("rect", { x: 92, y: Y(deck + 0.12), width: 2.2 * rpx * 4 + 2 * rpx + 36, height: Y(deck) - Y(deck + 0.12), fill: "#6b5a3e" }, g);
      var hx = 104, hw = 2.2 * rpx * 4 + 2 * rpx + 12;
      el("rect", { x: hx, y: Y(deck + 0.12 + 1.0), width: hw, height: Y(deck + 0.12) - Y(deck + 0.12 + 1.0), fill: "#fff", stroke: "#33505f", "stroke-width": 1.5 }, g);
      el("path", { d: "M" + (hx - 14) + " " + Y(deck + 1.12) + " L" + (hx + hw / 2) + " " + Y(deck + 1.6) + " L" + (hx + hw + 14) + " " + Y(deck + 1.12) + "Z", fill: "#33505f" }, g);
      el("path", { d: "M" + (hx + hw + 18) + " " + Y(deck + 0.05) + " Q 380 " + Y(deck + 0.1) + " 395 " + Y(deck + 0.45), stroke: "#a4510b", "stroke-width": 2, fill: "none" }, g);
      // depth arrow
      var ax = 450;
      if (depth > 0.02) {
        el("line", { x1: ax, x2: ax, y1: Y(wl) + 2, y2: Y(bedUnder + 0.0) - 2, stroke: C.ink, "stroke-width": 1.5, "marker-start": "url(#mk)", "marker-end": "url(#mk)" }, svg);
        txt(svg, ax - 8, (Y(wl) + Y(bedUnder)) / 2 + 4, "d ≈ " + fmt(depth, 2) + " m", { "text-anchor": "end", style: "font-size:13px;font-weight:700;fill:#0f2a3a" });
      }
      var defs = el("defs", {}, svg), mk = el("marker", { id: "mk", viewBox: "0 0 10 10", refX: 5, refY: 5, markerWidth: 6, markerHeight: 6, orient: "auto-start-reverse" }, defs);
      el("path", { d: "M0 0 L10 5 L0 10z", fill: C.ink }, mk);
      txt(svg, 632, 16, "Skala vertikal diperbesar · elevasi dalam m LWS", { "text-anchor": "end", style: "font-size:11px;fill:#5b707b" });

      document.getElementById("xs-wl-out").textContent = wlSel.value + " (" + fmt(wl, 2) + " m)";
      document.getElementById("xs-bed-out").textContent = (z0 > 0 ? "+" : "") + fmt(z0, 2) + " m LWS";
      document.getElementById("xs-yr-out").textContent = t;
      var msg = "Kedalaman air di sekitar bangunan ≈ <strong>" + fmt(Math.max(depth, 0), 2) + " m</strong> (muka air " + fmt(wl, 2) + " m − dasar " + fmt(zb, 2) + " m LWS)";
      if (t > 0) msg += ", bertambah " + fmt(r * t, 2) + " m dari kondisi survei.";
      else msg += ".";
      if (depth <= 0) msg += " Pada muka air ini dasar perairan kering.";
      else if (grounded) msg += " Drum kemungkinan menyentuh dasar.";
      msg += ' <span class="small muted">Drum digambar terendam setengah sebagai ilustrasi; sarat sebenarnya bergantung pada beban (lihat kalkulator).</span>';
      document.getElementById("xs-readout").innerHTML = msg;
    }
    [wlSel, bed, rate, yr].forEach(function (c) { c.addEventListener("input", draw); c.addEventListener("change", draw); });
    draw();
  }

  /* ---------- pasang surut ---------- */
  function pasut(D) {
    var box = document.getElementById("chart-pasut-box"); if (!box) return;
    var P = D.pasut, off = (P.S0_cm - P.datum_terhadap_LWS_cm.MSL); // nol palem ke LWS (cm)
    var hari = P.data_jam.hari, pts = [], ticks = [];
    hari.forEach(function (h, i) {
      ticks.push({ x: i * 24, label: h.tanggal.replace(/-26$/, "").replace("-Jun", " Jun").replace("-Jul", " Jul") });
      h.nilai.forEach(function (v, j) { pts.push([i * 24 + j, v]); });
    });
    ticks = ticks.filter(function (t, i) { return i % 2 === 0; });
    function draw(ref) {
      var lws = ref === "lws";
      var series = [{ name: "Muka air", color: C.tide, points: pts.map(function (p) { return [p[0], lws ? (p[1] - off) / 100 : p[1]]; }) }];
      var dl = P.datum_terhadap_LWS_cm, hl = [];
      ["HWS", "MSL", "LWS"].forEach(function (k) { hl.push({ y: lws ? dl[k] / 100 : dl[k] + off, label: k, color: k === "MSL" ? C.signal : C.muted }); });
      lineChart(box, {
        series: series, hlines: hl, xTicks: ticks, xMin: 0, xMax: pts.length - 1,
        yMin: lws ? -0.1 : 0, yMax: lws ? 1.25 : 135,
        yLabel: lws ? "Elevasi (m LWS)" : "Muka air (cm, nol palem)", xLabel: "Tanggal, Juni–Juli 2026 (data per jam)",
        yFmt: function (v) { return lws ? fmt(v, 1) : fmt(v, 0); },
        title: "Muka air jam-jaman 18 Juni – 2 Juli 2026",
        desc: "Rekaman AWLR 360 jam. Pola campuran dengan dua pasang per hari yang tidak sama tinggi; tunggang terbesar di awal periode.",
        tip: function (i) {
          var d = Math.floor(i / 24), h = i % 24, v = pts[i][1];
          return hari[d].tanggal + " " + (h < 10 ? "0" : "") + h + ":00 · " + (lws ? fmt((v - off) / 100, 2) + " m LWS" : v + " cm");
        }
      });
      legend("chart-pasut-legend", [{ name: "Muka air teramati", color: C.tide }, { name: "Datum (" + (lws ? "m LWS" : "dikonversi ke nol palem") + ")", color: C.muted, dash: true }]);
    }
    draw("gauge");
    Array.prototype.forEach.call(document.querySelectorAll('input[name="tide-ref"]'), function (r) { r.addEventListener("change", function () { draw(this.value); }); });
  }

  var SECT_ID = { N: "utara", NE: "timur laut", E: "timur", SE: "tenggara", S: "selatan", SW: "barat daya", W: "barat", NW: "barat laut" };
  function annual(D) {
    var bw = document.getElementById("chart-angin-maks");
    if (bw) {
      var years = Object.keys(D.angin.maks_tahunan_ms);
      var mx = years.map(function (y) { var r = D.angin.maks_tahunan_ms[y], best = Object.keys(r).reduce(function (a, b) { return r[a] >= r[b] ? a : b; }); return [+y, r[best], best]; });
      lineChart(bw, {
        series: [{ name: "Maksimum tahunan", color: C.drum, markers: true, points: mx.map(function (p) { return [p[0], p[1]]; }) }],
        yMin: 0, yMax: 11, xFmt: String, yLabel: "Kecepatan angin (m/s)", xLabel: "Tahun",
        xTicks: years.filter(function (y, i) { return i % 2 === 0; }).map(function (y) { return { x: +y, label: y }; }),
        title: "Kecepatan angin maksimum tahunan 2006–2025",
        desc: "Maksimum tahunan berkisar 6,45 hingga 9,67 m/s; seluruhnya dari sektor barat laut.",
        tip: function (i) { return mx[i][0] + ": " + fmt(mx[i][1], 2) + " m/s, dari " + SECT_ID[mx[i][2]]; }
      });
      legend("chart-angin-maks-legend", [{ name: "Maksimum tahunan di antara 8 sektor (ECMWF, diolah)", color: C.drum }]);
    }
    var bg = document.getElementById("chart-gel-maks");
    if (bg) {
      var yrs = Object.keys(D.gelombang.maks_tahunan);
      var mw = yrs.map(function (y) { var r = D.gelombang.maks_tahunan[y], best = Object.keys(r).reduce(function (a, b) { return r[a].Hs >= r[b].Hs ? a : b; }); return [+y, r[best].Hs, best, r[best].Tp]; });
      lineChart(bg, {
        series: [{ name: "Hs maksimum tahunan", color: C.tide, markers: true, points: mw.map(function (p) { return [p[0], p[1]]; }) }],
        hlines: [{ y: D.gelombang.Hs_rata_rata_m, label: "Hs rata-rata 0,427 m", color: C.signal }],
        yMin: 0, yMax: 3.4, xFmt: String, yLabel: "Hs (m)", xLabel: "Tahun",
        yFmt: function (v) { return fmt(v, 1); },
        xTicks: yrs.filter(function (y, i) { return i % 2 === 0; }).map(function (y) { return { x: +y, label: y }; }),
        title: "Tinggi gelombang signifikan maksimum tahunan 2006–2025, titik lepas pantai",
        desc: "Hs maksimum tahunan berkisar sekitar 1,7 hingga 3,0 m, sebagian besar dari sektor barat laut.",
        tip: function (i) { return mw[i][0] + ": Hs " + fmt(mw[i][1], 2) + " m, Tp " + fmt(mw[i][3], 2) + " s, dari " + SECT_ID[mw[i][2]]; }
      });
      legend("chart-gel-maks-legend", [{ name: "Hs maksimum tahunan di antara 8 sektor", color: C.tide }, { name: "Hs rata-rata seluruh periode", color: C.signal, dash: true }]);
    }
  }

  /* ---------- skenario risiko ---------- */
  function risiko(P) {
    var box = document.getElementById("chart-risiko"); if (!box) return;
    var wlS = document.getElementById("rk-wl"), bedS = document.getElementById("rk-bed"), hb = document.getElementById("rk-hb");
    var colors = [C.tide, C.drum, C.danger], gamma = 0.78;
    function draw() {
      var wl = P.elevasi_muka_air_m_LWS[wlS.value], z0 = parseFloat(bedS.value);
      var sc = P.skenario_subsidence_cm_per_tahun;
      var series = [], leg = [];
      sc.forEach(function (s, i) {
        var pts = []; for (var t = 0; t <= P.tahun_proyeksi_maks; t++) pts.push([t, wl - (z0 - s.nilai / 100 * t)]);
        series.push({ name: "Kedalaman, " + fmt(s.nilai, 1) + " cm/th", color: colors[i], points: pts, markers: true });
        leg.push({ name: "Kedalaman air — " + s.label, color: colors[i] });
      });
      if (hb.checked) {
        var hi = sc[sc.length - 1], lo = sc[0];
        series.push({ name: "γd, " + fmt(hi.nilai, 1) + " cm/th", color: C.danger, dash: true, width: 1.5, points: series[sc.length - 1].points.map(function (p) { return [p[0], gamma * p[1]]; }) });
        series.push({ name: "γd, " + fmt(lo.nilai, 1) + " cm/th", color: C.tide, dash: true, width: 1.5, points: series[0].points.map(function (p) { return [p[0], gamma * p[1]]; }) });
        leg.push({ name: "0,78 × d pada " + fmt(hi.nilai, 1) + " cm/tahun (ilustrasi batas gelombang pecah)", color: C.danger, dash: true });
        leg.push({ name: "0,78 × d pada " + fmt(lo.nilai, 1) + " cm/tahun (ilustrasi)", color: C.tide, dash: true });
      }
      lineChart(box, {
        series: series, yMin: 0, xMin: 0, xMax: P.tahun_proyeksi_maks,
        xTicks: [0, 2, 4, 6, 8, 10].map(function (v) { return { x: v, label: String(v) }; }),
        xLabel: "Tahun dari kondisi survei 2026", yLabel: "meter", yFmt: function (v) { return fmt(v, 1); },
        title: "Skenario kedalaman air di lokasi madrasah",
        desc: "Kedalaman bertambah linear terhadap waktu sesuai laju penurunan; skenario 16,3 cm/tahun menambah 1,63 m dalam 10 tahun.",
        tip: function (i) { return "Tahun " + i + "<br>" + sc.map(function (s, k) { return fmt(s.nilai, 1) + " cm/th: d = " + fmt(series[k].points[i][1], 2) + " m"; }).join("<br>"); }
      });
      legend("chart-risiko-legend", leg);
      var tb = document.querySelector("#tabel-risiko tbody");
      if (tb) tb.innerHTML = sc.map(function (s) {
        var d = function (t) { return wl - (z0 - s.nilai / 100 * t); }, d0 = d(0);
        var rel = d0 > 0.01 ? "+" + fmt((d(10) - d0) / d0 * 100, 0) + "%" : "dasar kering pada tahun 0";
        return "<tr><td>" + FH.esc(s.label) + '</td><td class="n">' + fmt(Math.max(d0, 0), 2) + '</td><td class="n">' + fmt(d(5), 2) + '</td><td class="n">' + fmt(d(10), 2) + '</td><td class="n">' + rel + "</td></tr>";
      }).join("");
    }
    [wlS, bedS, hb].forEach(function (c) { c.addEventListener("change", draw); });
    draw();
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!window.FH) return;
    if (document.getElementById("penampang-svg") || document.getElementById("chart-risiko")) {
      FH.load("parameter-kalkulator").then(function (P) { penampang(P); risiko(P); }).catch(function () {});
    }
    if (document.getElementById("chart-pasut-box") || document.getElementById("chart-angin-maks")) {
      FH.load("data-penelitian").then(function (D) { pasut(D); annual(D); }).catch(function () {});
    }
  });
})();
