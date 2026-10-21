/* Floating House — kalkulator daya apung (hidrostatik, air tenang).
   Semua parameter sumber berasal dari assets/data/parameter-kalkulator.json dan hasil-model.json. */
(function () {
  "use strict";
  var P = null, HM = null;
  var $ = function (id) { return document.getElementById(id); };
  var fmt = function (x, n) { return FH.fmt(x, n); };

  // Luas segmen lingkaran terendam untuk sarat h pada silinder horizontal berjari-jari R
  function segArea(R, h) {
    if (h <= 0) return 0;
    if (h >= 2 * R) return Math.PI * R * R;
    return R * R * Math.acos((R - h) / R) - (R - h) * Math.sqrt(2 * R * h - h * h);
  }
  // Cari sarat h sehingga segArea(h) = frac × πR² (bisection)
  function draftFor(R, frac) {
    if (frac <= 0) return 0;
    if (frac >= 1) return 2 * R;
    var lo = 0, hi = 2 * R, target = frac * Math.PI * R * R;
    for (var i = 0; i < 60; i++) { var mid = (lo + hi) / 2; if (segArea(R, mid) < target) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  }

  var THOUSANDS = { Ws: 1, md: 1, N: 1, Wl: 1 };
  function num(id) {
    var raw = $(id).value.trim().replace(/\s/g, "");
    if (raw === "") return null;
    if (THOUSANDS[id] && /^\d{1,3}(\.\d{3})+$/.test(raw)) return "ribuan";
    var v = raw.replace(",", ".");
    var x = Number(v);
    return isFinite(x) ? x : NaN;
  }

  function setErr(id, msg) {
    var input = $(id), wrap = input.closest(".field"), e = wrap.querySelector(".err");
    if (msg) {
      if (!e) { e = document.createElement("span"); e.className = "err"; e.id = id + "-err"; wrap.appendChild(e); }
      e.textContent = msg; input.setAttribute("aria-invalid", "true"); input.setAttribute("aria-describedby", e.id);
    } else if (e) { e.remove(); input.removeAttribute("aria-invalid"); input.removeAttribute("aria-describedby"); }
  }

  function check(id, opt) {
    var v = num(id);
    if (v === null) { if (opt.required) { setErr(id, "Wajib diisi."); return NaN; } setErr(id, null); return null; }
    if (v === "ribuan") { setErr(id, "Tulis tanpa pemisah ribuan, misalnya 6000."); return NaN; }
    if (isNaN(v)) { setErr(id, "Masukkan angka. Gunakan koma atau titik untuk desimal."); return NaN; }
    if (opt.min != null && v < opt.min) { setErr(id, opt.minMsg || "Nilai minimal " + fmt(opt.min, opt.dec || 0) + "."); return NaN; }
    if (opt.max != null && v > opt.max) { setErr(id, opt.maxMsg || "Nilai maksimal " + fmt(opt.max, opt.dec || 0) + ". Periksa satuan."); return NaN; }
    if (opt.integer && Math.round(v) !== v) { setErr(id, "Masukkan bilangan bulat."); return NaN; }
    setErr(id, null); return v;
  }

  function radio(name) { var r = document.querySelector('input[name="' + name + '"]:checked'); return r ? r.value : null; }

  function readInputs() {
    var kustom = $("jenis").value === "kustom";
    var inp = {
      L: check("L", { required: true, min: 0.5, max: 100, dec: 1, minMsg: "Panjang minimal 0,5 m." }),
      B: check("Bw", { required: true, min: 0.5, max: 100, dec: 1, minMsg: "Lebar minimal 0,5 m." }),
      N: check("N", { required: true, min: 1, max: 20000, integer: true, minMsg: "Minimal 1 drum." }),
      md: check("md", { min: 0, max: 200, minMsg: "Berat tidak boleh negatif.", maxMsg: "Berat satu drum lebih dari 200 kg tidak realistis. Periksa satuan." }),
      wmode: radio("wmode"),
      Ws: check("Ws", { required: true, min: 0, max: radio("wmode") === "luas" ? 5000 : 5e6, minMsg: "Berat tidak boleh negatif." }),
      Wl: check("Wl", { required: true, min: 0, max: 2000, minMsg: "Beban tidak boleh negatif.", maxMsg: "Lebih dari 2.000 kg/m² tidak realistis untuk beban penggunaan. Periksa satuan." }),
      rho: check("rho", { required: true, min: 990, max: 1035, minMsg: "Massa jenis air antara 990 dan 1035 kg/m³.", maxMsg: "Massa jenis air antara 990 dan 1035 kg/m³." }),
      Hd: check("Hd", { min: 0, max: 5, dec: 0, maxMsg: "Lebih dari 5 m tidak realistis untuk tinggi lantai di atas dasar drum." }),
      zb: check("zb", { min: -20, max: 3, minMsg: "Elevasi dasar di bawah −20 m LWS di luar cakupan kalkulator.", maxMsg: "Elevasi dasar di atas +3 m LWS berarti daratan." }),
      yr: check("yr", { min: 0, max: P.tahun_proyeksi_maks, integer: true }),
      basis: radio("basis"), jenis: $("jenis").value, wl: $("wl").value, rate: parseFloat($("rate").value)
    };
    var e = P.elemen_apung.filter(function (x) { return x.id === inp.jenis; })[0];
    if (kustom) {
      var Dmm = check("Dd", { required: true, min: 100, max: 3000, minMsg: "Diameter minimal 100 mm.", maxMsg: "Diameter maksimal 3000 mm." });
      var Lmm = check("Ld", { required: true, min: 100, max: 12000, minMsg: "Panjang minimal 100 mm.", maxMsg: "Panjang maksimal 12000 mm." });
      inp.D = Dmm / 1000; inp.ell = Lmm / 1000; inp.Vnom = null;
    } else { inp.D = e.diameter_m; inp.ell = e.panjang_m; inp.Vnom = e.volume_nominal_m3; }
    return inp;
  }

  function hasNaN(o) { for (var k in o) if (typeof o[k] === "number" && isNaN(o[k])) return true; return false; }

  function compute(i) {
    var g = P.konstanta.g.nilai, R = i.D / 2;
    var A = i.L * i.B;
    var Vgeo = Math.PI / 4 * i.D * i.D * i.ell;
    var useNom = i.basis === "nominal" && i.Vnom;
    var Vb = useNom ? i.Vnom : Vgeo;
    var Mstruct = i.wmode === "luas" ? i.Ws * A : i.Ws;
    var Mlive = i.Wl * A;
    var Mdrum = (i.md || 0) * i.N;
    var M = Mstruct + Mlive + Mdrum;
    var Mmax = i.rho * i.N * Vb;
    var u = Mmax > 0 ? M / Mmax : Infinity;
    var Vr = M / (i.rho * i.N);
    var fracGeo = Vr / Vgeo;
    var h = draftFor(R, Math.min(fracGeo, 1));
    var footprint = i.N * i.D * i.ell / A;
    var wl = P.elevasi_muka_air_m_LWS[i.wl];
    var subs = (i.rate / 100) * (i.yr || 0);
    var depth = i.zb == null ? null : wl - (i.zb - subs);
    return { A: A, Vgeo: Vgeo, Vb: Vb, useNom: useNom, Mstruct: Mstruct, Mlive: Mlive, Mdrum: Mdrum, M: M, Mmax: Mmax, u: u, Vr: Vr, fracGeo: fracGeo, h: h, D: i.D,
      fbDrum: i.D - h, fbDeck: i.Hd == null ? null : i.Hd - h, footprint: footprint, q: M / A, wl: wl, subs: subs, depth: depth,
      ukc: depth == null ? null : depth - h, kN: function (m) { return m * g / 1000; } };
  }

  function row(k, v) { return '<div class="out-row"><span class="k">' + k + '</span><span class="v">' + v + "</span></div>"; }

  function render(i, r) {
    var msgs = [];
    var over = r.u >= 1;
    if (over) msgs.push(["bad", "Beban melebihi kapasitas apung teoretis. Platform tidak akan mengapung dengan " + i.N + " drum ini."]);
    else if (r.useNom && r.Vr > r.Vb) msgs.push(["bad", "Volume terendam yang diperlukan melebihi volume nominal drum."]);
    if (!i.md) msgs.push(["", "Berat drum belum diisi, sehingga belum diperhitungkan."]);
    if (r.footprint > 1) msgs.push(["bad", "Tapak " + i.N + " drum (" + fmt(r.footprint * 100, 0) + "% luas lantai) tidak muat dalam satu lapis di bawah denah ini. Periksa jumlah drum atau ukuran platform."]);
    if (r.fbDeck != null && r.fbDeck <= 0) msgs.push(["bad", "Lantai berada di bawah muka air pada sarat ini."]);
    if (r.depth != null && r.depth <= 0) msgs.push(["bad", "Pada muka air " + i.wl + ", dasar perairan kering: bangunan bertumpu di dasar."]);
    else if (r.ukc != null && r.ukc <= 0 && !over) msgs.push(["bad", "Drum menyentuh dasar pada muka air " + i.wl + " (kedalaman lebih kecil dari sarat)."]);
    if (i.jenis === "kustom") msgs.push(["", "Drum ukuran kustom: volume dihitung dari dimensi luar."]);

    var pct = isFinite(r.u) ? r.u * 100 : 999;
    var html = "";
    html += '<div class="out-block"><h3>Pemanfaatan daya apung ' + FH.badge("general", "Estimasi hidrostatik") + "</h3>" +
      '<div class="out-big">' + fmt(pct, 0) + "%</div>" +
      '<div class="meter' + (over ? " over" : "") + '" role="img" aria-label="Pemanfaatan ' + fmt(pct, 0) + ' persen"><span style="width:' + Math.min(pct, 100) + '%"></span></div>' +
      '<p class="small muted" style="margin:0">Persentase volume drum (' + (r.useNom ? "nominal" : "luar") + ") yang harus terendam untuk menahan beban. Sisa " + (over ? "0" : fmt(100 - pct, 0)) + "% adalah cadangan daya apung teoretis dalam air tenang, bukan faktor keamanan.</p></div>";

    html += '<div class="out-block"><h3>Beban dan kapasitas</h3>' +
      row("Luas lantai", fmt(r.A, 1) + " m²") +
      row("Berat bangunan", fmt(r.Mstruct, 0) + " kg") +
      row("Beban penggunaan", fmt(r.Mlive, 0) + " kg") +
      row("Berat drum", i.md ? fmt(r.Mdrum, 0) + " kg" : "tidak diisi") +
      row("<strong>Total beban</strong>", "<strong>" + fmt(r.M, 0) + " kg</strong> (" + fmt(r.kN(r.M), 1) + " kN)") +
      row("Beban rata-rata per luas", fmt(r.q, 0) + " kg/m²") +
      row("Volume dasar per drum", fmt(r.Vb * 1000, 0) + " L" + (r.useNom ? " (nominal)" : " (luar)")) +
      row("<strong>Kapasitas apung teoretis</strong>", "<strong>" + fmt(r.Mmax, 0) + " kg</strong> (" + fmt(r.kN(r.Mmax), 1) + " kN)") +
      row("Rasio kapasitas/beban", isFinite(r.Mmax / r.M) && r.M > 0 ? fmt(r.Mmax / r.M, 2) + " <span class=\"small muted\">(bukan faktor keamanan)</span>" : "–") +
      row("Kepadatan tapak drum", fmt(r.footprint * 100, 0) + "% luas lantai") + "</div>";

    html += '<div class="out-block"><h3>Sarat dan freeboard (air tenang)</h3>' +
      (over ? '<p class="muted" style="margin:0">Tidak dihitung karena beban melebihi kapasitas.</p>' :
        row("Sarat drum (bagian terendam)", fmt(r.h * 100, 1) + " cm dari Ø " + fmt(r.D * 100, 1) + " cm") +
        row("Freeboard drum", fmt(r.fbDrum * 100, 1) + " cm") +
        row("Freeboard lantai", r.fbDeck == null ? "isi tinggi lantai" : fmt(r.fbDeck * 100, 1) + " cm")) + "</div>";

    if (r.depth != null) {
      html += '<div class="out-block"><h3>Kedalaman di lokasi ' + FH.badge("processed", "Datum Timbulsloko") + (r.subs > 0 ? " " + FH.badge("scenario") : "") + "</h3>" +
        row("Muka air " + i.wl, fmt(r.wl, 2) + " m LWS") +
        row("Elevasi dasar" + (r.subs > 0 ? " setelah " + i.yr + " tahun" : ""), fmt(i.zb - r.subs, 2) + " m LWS") +
        row("<strong>Kedalaman air</strong>", "<strong>" + fmt(Math.max(r.depth, 0), 2) + " m</strong>") +
        (over ? "" : row("Ruang bebas di bawah drum", fmt(r.ukc, 2) + " m")) + "</div>";
    }

    if (msgs.length) html += '<div class="out-block"><h3>Catatan pemeriksaan</h3><ul class="msg-list">' + msgs.map(function (m) { return '<li class="' + m[0] + '">' + m[1] + "</li>"; }).join("") + "</ul></div>";

    var locked = (HM && HM.keluaran_kalkulator_terkunci) || [];
    html += '<div class="out-block locked"><h3>Belum dapat dihitung ' + FH.badge("in_progress", "Menunggu hasil") + "</h3>" +
      locked.map(function (k) {
        var ok = k.status === "validated" && k.nilai != null;
        return row(FH.esc(k.judul), ok ? fmt(k.nilai, 1) + " " + FH.esc(k.satuan) : "Menunggu hasil pemodelan tervalidasi");
      }).join("") + '<p class="small muted" style="margin:.5rem 0 0">Keluaran ini memerlukan hasil pemodelan gelombang, OrcaFlex, dan Abaqus. Daya apung yang cukup tidak berarti bangunan aman terhadap gelombang.</p></div>';

    html += '<div class="btn-row no-print"><button type="button" class="btn ghost small" id="cetak">Cetak ringkasan</button><button type="button" class="btn ghost small" id="unduh">Unduh ringkasan (.txt)</button></div>';
    $("hasil").innerHTML = html;
    $("cetak").addEventListener("click", function () { printSummary(i, r, msgs); });
    $("unduh").addEventListener("click", function () { download(i, r, msgs); });
  }

  function summaryLines(i, r, msgs) {
    var L = [];
    L.push("RINGKASAN PERHITUNGAN DAYA APUNG — Floating House");
    L.push("Dibuat: " + new Date().toLocaleString("id-ID"));
    L.push("BUKAN sertifikat desain. Estimasi hidrostatik air tenang; stabilitas, gelombang, kekuatan rangka/sambungan/tiang/tali tidak diperiksa.");
    L.push("");
    L.push("MASUKAN");
    L.push("Platform: " + fmt(i.L, 2) + " m x " + fmt(i.B, 2) + " m");
    L.push("Drum: " + i.N + " buah, Ø " + fmt(i.D * 1000, 0) + " mm x " + fmt(i.ell * 1000, 0) + " mm, horizontal; dasar volume: " + (r.useNom ? "nominal 200 L" : "volume luar"));
    L.push("Berat satu drum: " + (i.md ? fmt(i.md, 1) + " kg" : "tidak diisi"));
    L.push("Berat bangunan: " + (i.wmode === "luas" ? fmt(i.Ws, 0) + " kg/m²" : fmt(i.Ws, 0) + " kg"));
    L.push("Beban penggunaan: " + fmt(i.Wl, 0) + " kg/m²");
    L.push("Massa jenis air: " + fmt(i.rho, 0) + " kg/m³");
    if (i.zb != null) L.push("Elevasi dasar: " + fmt(i.zb, 2) + " m LWS; muka air " + i.wl + "; skenario " + fmt(i.rate, 1) + " cm/tahun x " + (i.yr || 0) + " tahun");
    L.push("");
    L.push("HASIL");
    L.push("Total beban: " + fmt(r.M, 0) + " kg");
    L.push("Kapasitas apung teoretis: " + fmt(r.Mmax, 0) + " kg");
    L.push("Pemanfaatan daya apung: " + fmt(r.u * 100, 0) + "%");
    if (r.u < 1) { L.push("Sarat drum: " + fmt(r.h * 100, 1) + " cm; freeboard drum: " + fmt(r.fbDrum * 100, 1) + " cm"); if (r.fbDeck != null) L.push("Freeboard lantai: " + fmt(r.fbDeck * 100, 1) + " cm"); }
    if (r.depth != null) L.push("Kedalaman air: " + fmt(Math.max(r.depth, 0), 2) + " m");
    L.push("Kepadatan tapak drum: " + fmt(r.footprint * 100, 0) + "%");
    if (msgs.length) { L.push(""); L.push("CATATAN"); msgs.forEach(function (m) { L.push("- " + m[1]); }); }
    L.push("");
    L.push("Beban aman terhadap gelombang, gaya tiang/tali, kekuatan sambungan, fatigue: menunggu hasil pemodelan tervalidasi.");
    L.push("Rumus dan asumsi: halaman Kalkulator, bagian 'Rumus yang dipakai'.");
    return L;
  }

  function printSummary(i, r, msgs) {
    var sec = $("ringkasan-cetak");
    sec.innerHTML = '<div class="wrap"><pre style="white-space:pre-wrap;font-family:inherit;font-size:11pt">' + FH.esc(summaryLines(i, r, msgs).join("\n")) + "</pre></div>";
    document.body.classList.add("print-summary");
    var done = function () { document.body.classList.remove("print-summary"); window.removeEventListener("afterprint", done); };
    window.addEventListener("afterprint", done);
    window.print();
    setTimeout(done, 1500);
  }

  function download(i, r, msgs) {
    var blob = new Blob([summaryLines(i, r, msgs).join("\r\n")], { type: "text/plain;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "ringkasan-daya-apung.txt";
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  function run(ev) {
    if (ev) ev.preventDefault();
    var i = readInputs();
    if (hasNaN(i) || isNaN(i.D) || isNaN(i.ell)) {
      $("form-msg").textContent = "Periksa isian yang ditandai.";
      var bad = document.querySelector('[aria-invalid="true"]'); if (bad) bad.focus();
      return;
    }
    $("form-msg").textContent = "";
    render(i, compute(i));
    if (window.innerWidth < 1000) $("hasil").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function init() {
    var form = $("calc"); if (!form) return;
    Promise.all([FH.load("parameter-kalkulator"), FH.load("hasil-model").catch(function () { return null; })]).then(function (res) {
      P = res[0]; HM = res[1];
      $("rate").innerHTML = P.skenario_subsidence_cm_per_tahun.map(function (s) { return '<option value="' + s.nilai + '">' + FH.esc(s.label) + "</option>"; }).join("");
      $("rho").value = P.konstanta.rho_air_default.nilai;
      form.addEventListener("submit", run);
      $("jenis").addEventListener("change", function () {
        var k = this.value === "kustom";
        $("dim-kustom").hidden = !k; $("basis-wrap").hidden = k;
        if (k) document.querySelector('input[name="basis"][value="geometri"]').checked = true;
      });
      Array.prototype.forEach.call(document.querySelectorAll('input[name="wmode"]'), function (r) {
        r.addEventListener("change", function () { $("Ws-unit").textContent = this.value === "luas" ? "kg/m²" : "kg"; });
      });
      $("isi-contoh").addEventListener("click", function () {
        var c = P.contoh_konfigurasi.bangunan1;
        $("L").value = c.panjang_m; $("Bw").value = c.lebar_m; $("N").value = c.jumlah_drum; $("jenis").value = c.elemen;
        $("jenis").dispatchEvent(new Event("change"));
        $("contoh-ket").hidden = false; $("Ws").focus();
      });
      Array.prototype.forEach.call(document.querySelectorAll("[data-zb]"), function (b) {
        b.addEventListener("click", function () { $("zb").value = this.getAttribute("data-zb"); });
      });
      form.addEventListener("reset", function () {
        setTimeout(function () {
          $("rho").value = P.konstanta.rho_air_default.nilai; $("contoh-ket").hidden = true;
          $("dim-kustom").hidden = true; $("basis-wrap").hidden = false; $("Ws-unit").textContent = "kg";
          Array.prototype.forEach.call(document.querySelectorAll(".err"), function (e) { e.remove(); });
          Array.prototype.forEach.call(document.querySelectorAll("[aria-invalid]"), function (e) { e.removeAttribute("aria-invalid"); });
          $("hasil").innerHTML = '<div class="out-block"><p class="muted" style="margin:0">Isi ukuran platform, jumlah drum, dan beban, lalu tekan <strong>Hitung</strong>.</p></div>';
        }, 0);
      });
    }).catch(function () {
      $("form-msg").textContent = "Parameter kalkulator gagal dimuat, sehingga kalkulator tidak dapat dipakai.";
    });
  }

  // ekspor untuk pengujian
  window.FHCalc = { segArea: segArea, draftFor: draftFor };
  document.addEventListener("DOMContentLoaded", init);
})();
