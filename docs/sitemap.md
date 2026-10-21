# Sitemap dan outline konten

Alamat publik yang direncanakan: `https://floatinghouse.github.io/`

```
/ (index.html) ─ Beranda
├─ Penelitian
│  ├─ mengenal.html ........ Mengenal masalah dan rumah apung
│  ├─ studi-kasus.html ..... Studi kasus Madrasah Apung Timbulsloko
│  ├─ data-lingkungan.html . Batimetri, pasang surut, angin, gelombang
│  ├─ metodologi.html ...... Alur penelitian dan peran perangkat lunak
│  ├─ hasil-penelitian.html  Hasil (A tersedia, B awal, C berjalan), jadwal, luaran
│  └─ risiko.html .......... Rangkaian mekanisme dan skenario kedalaman 0–10 tahun
├─ Panduan
│  ├─ panduan-desain.html .. 10 topik desain (prinsip umum / temuan / menunggu hasil)
│  ├─ kalkulator.html ...... Kalkulator daya apung hidrostatik
│  └─ pemeliharaan.html .... Daftar periksa inspeksi (simpan lokal, CSV, cetak)
├─ Info
│  ├─ tentang.html ......... Penelitian, tim, label status, batas penggunaan
│  └─ referensi.html ....... Sumber data dan pustaka
└─ 404.html
```

**Perubahan dari rancangan awal:** master prompt memakai nama `tentang.html` untuk dua halaman (Halaman 2 dan Halaman 11). Halaman 2 menjadi `mengenal.html`; `tentang.html` dipakai untuk Tentang penelitian dan tim.

## Outline per halaman

**Beranda** — Judul dan penjelasan singkat; penampang interaktif (muka air, elevasi dasar, skenario laju, tahun) dengan kedalaman air terhitung; masalah lantai tetap vs air naik; rantai lima mata (subsidence → kedalaman → gelombang → respons → desain); fakta lapangan dengan label status; enam fitur; status penelitian (dari JSON).

**Mengenal masalah** — Pengertian land subsidence; rentang laju di literatur; dampak (genangan, lantai, akses, air bersih, gelombang); prinsip Archimedes; diagram bangunan tetap vs apung; manfaat dan keterbatasan; kapan perlu pemeriksaan teknik.

**Studi kasus** — Lokasi dan riwayat desa (keterangan pemerintah desa); koordinat stasiun + tautan OSM; placeholder peta; tabel dimensi; skema tiga sistem; foto drum–rangka dan tiang PVC; sistem penahan; kerusakan yang dilaporkan; kronologi lapangan; pembedaan jenis informasi.

**Data lingkungan** — Batimetri (metode, rentang elevasi, acuan geodetik, diagram elevasi ≠ kedalaman, peta, jalur sounding, batas); pasut (grafik 360 jam dengan pilihan acuan, tabel ringkasan dan konstituen, Formzahl, batas, makna bagi bangunan, foto alat); angin (statistik, mawar angin, grafik maksimum tahunan, tabel ekstrem); gelombang (peringatan lepas pantai, statistik, mawar gelombang total dan bulanan, grafik maksimum tahunan, tabel ekstrem); tabel parameter untuk analisis.

**Metodologi** — Alur 9 langkah dengan status; tiga tingkat analisis; tabel perbandingan perangkat lunak proposal/laporan/terbaru; pendekatan skenario; metode pengumpulan data.

**Hasil & status** — Legenda status; A/B/C dari `hasil-model.json`; deskripsi percobaan RAO + placeholder grafik; format hasil mendatang; jadwal rencana; luaran.

**Risiko** — Rantai mekanisme; grafik skenario kedalaman (3 laju) + ilustrasi 0,78·d; tabel tahun 0/5/10; asumsi; tabel kompilasi laju penurunan; rencana tampilan setelah pemodelan.

**Panduan desain** — Peringatan "bukan spesifikasi"; daftar isi; 10 topik masing-masing tiga kolom; diagram jalur beban.

**Kalkulator** — Peringatan; formulir 4 bagian; keluaran (pemanfaatan, beban & kapasitas, sarat & freeboard, kedalaman, catatan, keluaran terkunci); cetak/unduh ringkasan; rumus; asumsi dan batas.

**Pemeliharaan** — Empat rutinitas dari paper; status interval; formulir inspeksi 5 kelompok, 19 butir; unduh CSV, cetak, hapus; kapan meminta bantuan teknis.

**Tentang** — Judul, tujuan, manfaat; institusi, mitra; tim; kontak (placeholder); luaran; arti label status; batas penggunaan; atribusi data; teknologi.

**Referensi** — Sumber data; pustaka per kelompok dengan status pemeriksaan.

## Alur navigasi utama

- Masyarakat: Beranda → Panduan desain → Kalkulator → Pemeliharaan.
- Pemerintah desa/daerah: Beranda → Mengenal → Studi kasus → Risiko → Tentang (batas penggunaan).
- Praktisi/akademisi: Beranda → Data lingkungan → Metodologi → Hasil → Referensi.

## Visualisasi

| Visualisasi | Halaman | Data | Jenis |
|---|---|---|---|
| Penampang interaktif | Beranda | Datum pasut, elevasi dasar, skenario laju | SVG (JS) |
| Bangunan tetap vs apung | Mengenal | Konseptual | SVG statis |
| Skema tiga sistem Madrasah Apung | Studi kasus | Observasi | SVG statis |
| Elevasi vs kedalaman | Data | Konseptual dengan contoh angka | SVG statis |
| Muka air 360 jam | Data | Pasut terukur | Grafik garis (JS) |
| Maksimum tahunan angin dan Hs | Data | ECMWF diolah | Grafik garis (JS) |
| Rantai mekanisme | Beranda, Risiko | Konseptual | HTML/CSS |
| Skenario kedalaman 0–10 tahun | Risiko | Datum + literatur | Grafik garis (JS) + tabel |
| Jalur beban | Panduan | Konseptual | SVG statis |
| Meter pemanfaatan daya apung | Kalkulator | Masukan pengguna | HTML/CSS |
