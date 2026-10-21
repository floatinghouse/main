/* Floating House — skrip bersama: navigasi, pemuatan data JSON, label status, dan penyaji daftar. */
(function () {
  "use strict";

  var LABEL = {
    measured: "Terukur", processed: "Diolah", reported: "Dilaporkan warga", literature: "Literatur",
    scenario: "Skenario", preliminary: "Hasil awal", in_progress: "Sedang berjalan",
    validated: "Tervalidasi", planned: "Direncanakan", general: "Rekomendasi umum"
  };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function badge(status, text) {
    var s = LABEL[status] ? status : "planned";
    return '<span class="badge ' + s + '" title="Status: ' + LABEL[s] + '">' + esc(text || LABEL[s]) + "</span>";
  }

  var cache = {};
  function load(name) {
    if (!cache[name]) {
      cache[name] = fetch("assets/data/" + name + ".json", { cache: "no-cache" }).then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      });
      cache[name].catch(function (e) { showLoadError(name, e); });
    }
    return cache[name];
  }

  var errShown = false;
  function showLoadError(name, e) {
    if (errShown) return;
    errShown = true;
    var bar = document.createElement("div");
    bar.className = "load-error";
    bar.setAttribute("role", "alert");
    var local = location.protocol === "file:";
    bar.innerHTML = '<div class="wrap"><strong>Data tidak dapat dimuat (' + esc(name) + ".json).</strong> " +
      (local
        ? "Halaman dibuka langsung dari file. Jalankan server lokal, misalnya <code>python -m http.server</code> di folder situs, lalu buka <code>http://localhost:8000</code>."
        : "Periksa bahwa folder <code>assets/data/</code> ikut terunggah, lalu muat ulang halaman.") + "</div>";
    var main = document.getElementById("isi");
    if (main) main.parentNode.insertBefore(bar, main);
    if (window.console) console.warn("Gagal memuat", name, e);
  }

  function fmt(x, n) {
    if (x == null || !isFinite(x)) return "–";
    return Number(x).toLocaleString("id-ID", { minimumFractionDigits: n, maximumFractionDigits: n });
  }

  /* ---------- navigasi ---------- */
  function initNav() {
    var btn = document.querySelector(".nav-toggle");
    var nav = document.getElementById("nav-utama");
    if (!btn || !nav) return;
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.textContent = open ? "Tutup" : "Menu";
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); btn.textContent = "Menu"; btn.focus(); }
    });
  }

  /* ---------- penyaji ---------- */
  function renderTahapan(el, data) {
    var k = el.getAttribute("data-kelompok");
    var items = data.tahapan.filter(function (t) { return !k || t.kelompok === k; });
    if (!items.length) { el.innerHTML = '<p class="muted">Belum ada butir pada kelompok ini.</p>'; return; }
    var rows = function (t) {
      var out = [];
      var add = function (lbl, v) { if (v != null && v !== "") out.push("<div><dt>" + lbl + "</dt><dd>" + esc(v) + "</dd></div>"); };
      if (t.nilai != null && t.status === "validated") add("Nilai", t.nilai + (t.satuan ? " " + t.satuan : ""));
      add("Periode", t.tanggal_atau_periode);
      add("Lokasi", t.lokasi);
      add("Metode", t.metode);
      add("Sumber", t.sumber);
      add("Catatan", t.catatan);
      add("Batas penggunaan", t.batas_penggunaan);
      return out.join("");
    };
    el.innerHTML = '<ul class="status-list">' + items.map(function (t) {
      return '<li class="status-item" data-status="' + esc(t.status) + '">' + badge(t.status) +
        "<h3>" + esc(t.judul) + "</h3><p>" + esc(t.deskripsi) + "</p><dl>" + rows(t) + "</dl></li>";
    }).join("") + "</ul>";
  }

  function renderStatusRingkas(el, data) {
    el.innerHTML = '<ul class="status-list">' + data.tahapan.filter(function (t) { return t.id !== "korosi-risiko"; }).map(function (t) {
      return '<li class="status-item" data-status="' + esc(t.status) + '" style="padding:.7rem 1rem">' + badge(t.status) +
        ' <strong style="margin-left:.3rem">' + esc(t.judul) + "</strong></li>";
    }).join("") + "</ul>";
  }

  function renderLuaran(el, data) {
    el.innerHTML = '<ul class="status-list">' + data.luaran.map(function (l) {
      return '<li class="status-item" data-status="' + esc(l.status) + '" style="padding:.8rem 1rem">' + badge(l.status) +
        "<h3 style=\"font-size:1rem\">" + esc(l.judul) + '</h3><p class="small">' + esc(l.keterangan) + "</p></li>";
    }).join("") + "</ul>";
  }

  function renderReferensi(el, data) {
    var html = "";
    var V = { dicek: "dicek", dari_naskah: "dari naskah tim, belum dicek ulang", belum_dicek: "rujukan umum, perlu ditinjau peneliti" };
    data.kelompok.forEach(function (g) {
      var items = data.pustaka.filter(function (p) { return p.kelompok === g.id; });
      if (!items.length) return;
      html += "<h3>" + esc(g.judul) + '</h3><ol class="ref-list">' + items.map(function (p) {
        var doi = p.doi ? ' <a href="https://doi.org/' + esc(p.doi) + '" rel="noopener">doi:' + esc(p.doi) + "</a>" : "";
        var meta = '<span class="ref-meta">Pemeriksaan: ' + esc(V[p.verifikasi] || p.verifikasi) + (p.catatan ? " · " + esc(p.catatan) : "") + "</span>";
        return '<li id="' + esc(p.id) + '">' + esc(p.teks) + doi + meta + "</li>";
      }).join("") + "</ol>";
    });
    el.innerHTML = html;
    if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
  }

  function renderDataSumber(el, data) {
    el.innerHTML = "<ul>" + data.data_sumber.map(function (d) {
      var u = d.url ? ' <a href="' + esc(d.url) + '" rel="noopener">' + esc(d.url.replace(/^https?:\/\//, "")) + "</a>" : "";
      return "<li>" + badge(d.status) + " <strong>" + esc(d.judul) + "</strong>. " + esc(d.keterangan) + u + "</li>";
    }).join("") + "</ul>";
  }

  var RENDER = {
    "tahapan": ["hasil-model", renderTahapan],
    "status-ringkas": ["hasil-model", renderStatusRingkas],
    "luaran": ["hasil-model", renderLuaran],
    "referensi": ["referensi", renderReferensi],
    "data-sumber": ["referensi", renderDataSumber]
  };

  function initRenders() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-render]"), function (el) {
      var r = RENDER[el.getAttribute("data-render")];
      if (!r) return;
      load(r[0]).then(function (d) { r[1](el, d); }).catch(function () { /* konten statis tetap tampil */ });
    });
  }

  window.FH = { load: load, badge: badge, esc: esc, fmt: fmt, LABEL: LABEL };

  document.addEventListener("DOMContentLoaded", function () { initNav(); initRenders(); });
})();
