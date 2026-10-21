/* Floating House — daftar periksa inspeksi. Isian disimpan di localStorage perangkat ini saja. */
(function () {
  "use strict";
  var KEY = "floatinghouse-inspeksi-v1";
  var GROUPS = [
    { judul: "Tali tambat", interval: "Usulan awal: setiap bulan", items: [
      { id: "tali-aus", q: "Tali di titik kontak (tiang, pipa, tepi kayu) tidak pipih, berserabut, atau berubah warna", why: "Tali putus adalah kerusakan yang pernah terjadi. Keausan muncul dari gesekan berulang di tepi keras." },
      { id: "tali-pelindung", q: "Pelindung gesek atau selongsong halus masih ada di setiap titik kontak tali", why: "Mengurangi gesekan langsung tali dengan tepi keras." },
      { id: "tali-arah", q: "Tali tidak berbelok tajam dan tidak tersangkut saat platform naik-turun", why: "Belokan tajam memusatkan keausan." },
      { id: "tali-ikat", q: "Simpul dan titik ikat di platform kencang dan tidak bergeser", why: "" }
    ] },
    { judul: "Tiang pemandu", interval: "Usulan awal: setelah angin kencang atau pasang sangat tinggi", items: [
      { id: "tiang-posisi", q: "Posisi setiap tiang terhadap tanda tetap di platform tidak berubah", why: "Perubahan posisi adalah tanda paling awal tiang bergerak. Tiang terlepas pernah terjadi." },
      { id: "tiang-tegak", q: "Tiang tegak, tidak miring, dan tidak goyah saat didorong", why: "" },
      { id: "tiang-selongsong", q: "Selongsong PVC dan grout tidak retak; kayu di dalamnya tidak terlepas", why: "Grout saja mungkin tidak cukup mengikat kayu dan selongsong." },
      { id: "tiang-celah", q: "Celah antara platform dan tiang tidak berubah; tidak ada bekas benturan baru", why: "Benturan platform–tiang menimbulkan beban puncak lokal." }
    ] },
    { judul: "Drum dan pengikatnya", interval: "Usulan awal: setiap tiga bulan, saat surut", items: [
      { id: "drum-posisi", q: "Tidak ada drum yang bergeser, berputar, atau lepas dari penahannya", why: "" },
      { id: "drum-bocor", q: "Tidak ada drum yang penyok, retak, bocor, atau terendam lebih dalam dari drum di sebelahnya", why: "Drum yang terisi air kehilangan daya apung." },
      { id: "drum-jarak", q: "Jarak antardrum tetap teratur", why: "Susunan yang berubah mengubah distribusi beban ke rangka." },
      { id: "drum-ikatan", q: "Ikatan tali atau penjepit drum tidak kendur atau aus", why: "" }
    ] },
    { judul: "Rangka dan sambungan", interval: "Usulan awal: setiap tiga bulan, saat surut", items: [
      { id: "rangka-retak", q: "Kayu rangka tidak retak atau terbelah di sambungan", why: "Penjepit yang memusatkan beban di satu titik meningkatkan tegangan lokal." },
      { id: "rangka-lapuk", q: "Kayu tidak lapuk, lunak, atau berlubang (terutama di zona basah-kering)", why: "" },
      { id: "rangka-logam", q: "Baut, paku, dan klem tidak berkarat parah atau longgar", why: "" },
      { id: "rangka-lendut", q: "Tidak ada balok yang melendut, bengkok, atau bergeser dari posisinya", why: "" }
    ] },
    { judul: "Posisi platform", interval: "Setiap inspeksi", items: [
      { id: "fb-ukur", q: "Freeboard (tinggi lantai di atas air) diukur di keempat sudut dan dicatat", why: "Bandingkan dengan catatan sebelumnya; penurunan dapat menandakan drum bocor atau beban bertambah." },
      { id: "fb-miring", q: "Platform tidak miring secara tetap", why: "" },
      { id: "fb-geser", q: "Platform tidak bergeser dari posisi biasanya", why: "" }
    ] }
  ];
  var RATE = [["baik", "Baik"], ["perhatian", "Perlu perhatian"], ["rusak", "Rusak"], ["na", "Tidak diperiksa"]];
  var FIELDS = ["i-bangunan", "i-tanggal", "i-petugas", "i-kondisi", "i-tindakan", "i-lanjut"];
  var $ = function (id) { return document.getElementById(id); };

  function storageOK() { try { localStorage.setItem("__t", "1"); localStorage.removeItem("__t"); return true; } catch (e) { return false; } }
  var canStore = storageOK();

  function build() {
    var root = $("checklist-root"); if (!root) return;
    root.innerHTML = GROUPS.map(function (g, gi) {
      return '<fieldset class="check-group"><legend>' + FH.esc(g.judul) + '</legend><p class="small muted" style="margin-top:0">' + FH.esc(g.interval) + "</p>" +
        g.items.map(function (it) {
          return '<div class="check-item"><p class="q" id="q-' + it.id + '">' + FH.esc(it.q) + "</p>" + (it.why ? '<p class="why">' + FH.esc(it.why) + "</p>" : "") +
            '<div class="rating" role="radiogroup" aria-labelledby="q-' + it.id + '">' +
            RATE.map(function (r) { return '<label><input type="radio" name="' + it.id + '" value="' + r[0] + '"> ' + r[1] + "</label>"; }).join("") +
            '</div><label class="sr-only" for="c-' + it.id + '" style="position:absolute;left:-999px">Catatan</label><textarea id="c-' + it.id + '" placeholder="Catatan (lokasi, ukuran, foto)"></textarea></div>';
        }).join("") + "</fieldset>";
    }).join("");
  }

  function collect() {
    var d = { f: {}, r: {}, c: {} };
    FIELDS.forEach(function (id) { d.f[id] = $(id).value; });
    GROUPS.forEach(function (g) { g.items.forEach(function (it) {
      var s = document.querySelector('input[name="' + it.id + '"]:checked'); d.r[it.id] = s ? s.value : "";
      d.c[it.id] = $("c-" + it.id).value;
    }); });
    return d;
  }

  function restore() {
    if (!canStore) { $("i-status").textContent = "Penyimpanan otomatis tidak tersedia di peramban ini. Unduh CSV sebelum menutup halaman."; return; }
    var raw; try { raw = localStorage.getItem(KEY); } catch (e) { raw = null; }
    if (!raw) { $("i-status").textContent = "Isian tersimpan otomatis di perangkat ini."; return; }
    try {
      var d = JSON.parse(raw);
      FIELDS.forEach(function (id) { if (d.f && d.f[id] != null) $(id).value = d.f[id]; });
      Object.keys(d.r || {}).forEach(function (k) { var r = document.querySelector('input[name="' + k + '"][value="' + d.r[k] + '"]'); if (r) r.checked = true; });
      Object.keys(d.c || {}).forEach(function (k) { var t = $("c-" + k); if (t) t.value = d.c[k]; });
      $("i-status").textContent = "Isian sebelumnya dipulihkan dari perangkat ini.";
    } catch (e) { $("i-status").textContent = "Isian tersimpan tidak dapat dibaca dan diabaikan."; }
  }

  var t;
  function save() {
    if (!canStore) return;
    clearTimeout(t);
    t = setTimeout(function () {
      try { localStorage.setItem(KEY, JSON.stringify(collect())); $("i-status").textContent = "Tersimpan di perangkat ini, " + new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + "."; }
      catch (e) { $("i-status").textContent = "Gagal menyimpan. Unduh CSV untuk arsip."; }
    }, 400);
  }

  function csv() {
    var d = collect(), q = function (s) { return '"' + String(s || "").replace(/"/g, '""') + '"'; };
    var lab = {}; RATE.forEach(function (r) { lab[r[0]] = r[1]; });
    var rows = [["Bagian", "Pemeriksaan", "Kondisi", "Catatan"]];
    rows.push(["Data", "Bangunan", d.f["i-bangunan"], ""], ["Data", "Tanggal", d.f["i-tanggal"], ""], ["Data", "Pemeriksa", d.f["i-petugas"], ""], ["Data", "Kondisi air", d.f["i-kondisi"], ""]);
    GROUPS.forEach(function (g) { g.items.forEach(function (it) { rows.push([g.judul, it.q, lab[d.r[it.id]] || "", d.c[it.id]]); }); });
    rows.push(["Tindakan", "Perbaikan atau penggantian", "", d.f["i-tindakan"]], ["Tindakan", "Tindak lanjut", "", d.f["i-lanjut"]]);
    var text = "﻿" + rows.map(function (r) { return r.map(q).join(";"); }).join("\r\n");
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
    a.download = "inspeksi-" + (d.f["i-tanggal"] || "tanpa-tanggal") + ".csv";
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    $("i-status").textContent = "File CSV diunduh.";
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!$("inspeksi")) return;
    build(); restore();
    $("inspeksi").addEventListener("input", save);
    $("inspeksi").addEventListener("change", save);
    $("i-unduh").addEventListener("click", csv);
    $("i-cetak").addEventListener("click", function () { window.print(); });
    $("i-hapus").addEventListener("click", function () {
      $("inspeksi").reset();
      Array.prototype.forEach.call(document.querySelectorAll("#checklist-root textarea"), function (x) { x.value = ""; });
      try { localStorage.removeItem(KEY); } catch (e) {}
      $("i-status").textContent = "Isian dihapus dari formulir dan perangkat ini.";
    });
  });
})();
