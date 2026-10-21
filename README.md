# Floating House — Panduan Desain Rumah Apung Tahan Gelombang

Situs statis untuk diseminasi penelitian *Coupled Land Subsidence–Wave Modeling for Floating Houses: Analisis Respon Struktur dan Aplikasi Web Panduan Desain Rumah Apung Tahan Gelombang* (Penelitian Fundamental, Kemdiktisaintek 2026), dengan studi kasus Madrasah Apung Timbulsloko, Demak.

Alamat yang direncanakan: **https://floatinghouse.github.io/**

> Status konten per 21 Oktober 2026: survei lapangan dan pengolahan data lingkungan selesai; pemodelan transformasi gelombang, OrcaFlex, dan Abaqus belum final. Situs tidak menampilkan kapasitas desain, beban aman, kekuatan sambungan, atau fatigue.

## Isi

- 11 halaman + `404.html`, HTML/CSS/JavaScript tanpa kerangka kerja dan tanpa proses build.
- Data penelitian terpisah di `assets/data/*.json`.
- Kalkulator daya apung hidrostatik, grafik pasang surut dan iklim gelombang, skenario kedalaman, daftar periksa inspeksi.
- Dokumentasi di `docs/`: sitemap, audit sumber dan asumsi, panduan pembaruan, manifest file.

## Publikasi di GitHub Pages

Alamat `floatinghouse.github.io` adalah *user/organization site*, sehingga akun atau organisasi GitHub harus bernama **floatinghouse**.

1. Buat akun atau organisasi GitHub bernama `floatinghouse` (jika belum ada).
2. Buat repositori publik bernama persis **`floatinghouse.github.io`**.
3. Unggah **isi** folder `floatinghouse-website/` ke akar repositori (sehingga `index.html` berada di akar, bukan di dalam subfolder):
   - lewat web: *Add file → Upload files*, seret semua file dan folder; atau
   - lewat terminal:
     ```bash
     cd floatinghouse-website
     git init && git add . && git commit -m "Situs awal Floating House"
     git branch -M main
     git remote add origin https://github.com/floatinghouse/floatinghouse.github.io.git
     git push -u origin main
     ```
4. Di repositori: *Settings → Pages → Build and deployment → Source: Deploy from a branch*, pilih `main` dan folder `/ (root)`, lalu *Save*.
5. Tunggu 1–2 menit, lalu buka https://floatinghouse.github.io/.

File `.nojekyll` disertakan agar GitHub Pages menyajikan file apa adanya.

**Jika memakai akun lain** (mis. `username.github.io/floatinghouse/`): situs tetap berjalan karena semua tautan relatif, kecuali `404.html` yang memakai tautan absolut — ganti awalan `/` menjadi `/floatinghouse/` di file tersebut.

## Pratinjau lokal

```bash
cd floatinghouse-website
python -m http.server 8000
```

Buka `http://localhost:8000`. Membuka file HTML langsung (klik ganda) akan menampilkan teks halaman, tetapi grafik, kalkulator, dan daftar status tidak dapat memuat data JSON.

## Dependensi luar

| Sumber | Fungsi | Lisensi | Jika tidak tersedia |
|---|---|---|---|
| Google Fonts — Atkinson Hyperlegible | Font utama, dirancang untuk keterbacaan tinggi | SIL Open Font License 1.1 | Situs memakai font sistem; semua fungsi tetap berjalan |
| OpenStreetMap (tautan biasa di Studi kasus) | Membuka lokasi stasiun pasut di peta | ODbL | Hanya tautan; tidak memengaruhi halaman |

Tidak ada backend, database, API berbayar, kunci rahasia, cookie, akun pengguna, atau analitik. Daftar periksa inspeksi menyimpan isian di `localStorage` peramban pengguna saja.

## Struktur

Lihat `docs/manifest-file.md`.

## Memperbarui hasil penelitian

Lihat `docs/panduan-pembaruan-konten.md`. Ringkasnya: ubah `assets/data/hasil-model.json`, isi `nilai`, dan ubah `status` menjadi `validated` hanya setelah disetujui ketua tim.

## Hak dan atribusi

- Foto lapangan, peta batimetri, dan mawar angin/gelombang: tim peneliti (dari naskah paper kajian lapangan). Publikasi menunggu persetujuan ketua tim.
- Data angin dan gelombang: hindcast ECMWF 2006–2025, diolah tim peneliti.
- Kode situs: [lisensi menunggu keputusan tim, mis. MIT untuk kode dan CC BY 4.0 untuk konten].
