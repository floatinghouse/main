# Panduan pembaruan konten

Situs tidak memerlukan proses build. Ubah file, unggah ke GitHub, dan GitHub Pages memperbarui situs dalam 1–2 menit.

## Pratinjau lokal

Data dimuat dengan `fetch()`, sehingga halaman **tidak** dapat dibuka langsung dengan klik ganda (`file://`). Jalankan server lokal:

```bash
cd floatinghouse-website
python -m http.server 8000
# buka http://localhost:8000
```

## Di mana data berada

| File | Isi | Dipakai oleh |
|---|---|---|
| `assets/data/hasil-model.json` | Status setiap tahap pemodelan, keluaran kalkulator yang terkunci, status luaran | Beranda (status ringkas), Hasil, Tentang, Kalkulator |
| `assets/data/parameter-kalkulator.json` | Konstanta, dimensi drum, contoh konfigurasi, datum muka air, skenario laju penurunan | Kalkulator, penampang beranda, Risiko |
| `assets/data/data-penelitian.json` | Data lapangan dan lingkungan, termasuk 360 data pasut jam-jaman dan maksimum tahunan | Grafik di Data lingkungan |
| `assets/data/referensi.json` | Pustaka dan sumber data | Referensi |

Teks penjelasan, tabel nilai ekstrem, dan angka ringkas di halaman ditulis langsung di HTML agar tetap terbaca tanpa JavaScript. Jika angka berubah, ubah **juga** di HTML (cari dengan fitur cari di editor).

## Memasukkan hasil pemodelan yang sudah disetujui

1. Buka `assets/data/hasil-model.json`.
2. Cari tahap pada `tahapan` (mis. `"id": "orcaflex-global"`).
3. Isi `nilai`, `satuan`, `tanggal_atau_periode`, `metode`, `catatan`, dan `batas_penggunaan`.
4. Ubah `status`:
   - `"preliminary"` jika hasil masih awal;
   - `"validated"` hanya setelah disetujui ketua tim. Nilai hanya ditampilkan untuk status `validated`.
5. Untuk mengaktifkan keluaran kalkulator, isi `nilai` dan ubah `status` menjadi `"validated"` pada `keluaran_kalkulator_terkunci`.

Contoh:

```json
{"id": "gaya_tiang_tali", "judul": "Gaya pada tiang pemandu dan tali tambat",
 "nilai": 12.5, "satuan": "kN", "status": "validated",
 "bergantung_pada": ["orcaflex-global"]}
```

> Catatan: kalkulator saat ini menampilkan nilai keluaran terkunci sebagai satu angka tetap. Jika hasil akhir berupa fungsi dari konfigurasi (mis. gaya tiang tergantung jumlah drum dan kedalaman), tambahkan tabel hasil pada JSON dan logika interpolasinya di `assets/js/kalkulator.js` fungsi `render()`, bagian "Belum dapat dihitung".

## Menambah hasil pemodelan gelombang

Setelah transformasi gelombang selesai, tambahkan ke `data-penelitian.json`, misalnya:

```json
"gelombang_lokasi": {
  "status": "validated",
  "sumber": "Model Delft3D, laporan akhir 2026",
  "kondisi": [
    {"skenario": "eksisting", "arah": "NW", "periode_ulang": 10, "Hs_m": null, "Tp_s": null},
    {"skenario": "proyeksi 10 tahun, 16,3 cm/tahun", "arah": "NW", "periode_ulang": 10, "Hs_m": null, "Tp_s": null}
  ]
}
```

Lalu tambahkan tabel atau grafik di `hasil-penelitian.html` dan `risiko.html`. Fungsi `lineChart()` di `assets/js/visualisasi.js` dapat dipakai ulang.

## Menambah atau mengganti gambar

1. Perkecil gambar (lebar ±1400 px, JPG kualitas ±80).
2. Simpan di `assets/images/lapangan/`, `assets/images/data/`, atau `assets/images/hasil/`.
3. Untuk mengganti kotak placeholder, ganti seluruh `<div class="placeholder">…</div>` dengan:

```html
<figure>
  <img src="assets/images/hasil/rao-awal-arah-0.png" alt="Jelaskan isi gambar" width="1200" height="800" loading="lazy">
  <figcaption><span class="badge preliminary">Hasil awal</span> Keterangan, sumber, periode, batas penafsiran.</figcaption>
</figure>
```

Label status yang tersedia: `measured`, `processed`, `reported`, `literature`, `scenario`, `preliminary`, `in_progress`, `validated`, `planned`, `general`.

## Menambah referensi

Tambahkan objek ke `pustaka` di `referensi.json` dengan `id` unik, `kelompok`, `teks`, `doi` (atau `null`), dan `verifikasi` (`dicek`, `dari_naskah`, `belum_dicek`). Halaman Referensi juga memuat versi statis untuk pembaca tanpa JavaScript; perbarui juga daftar di `referensi.html`.

## Mengubah navigasi, kepala, atau kaki halaman

Kepala dan kaki halaman tersalin di setiap file HTML. Ubah di semua file (fitur "cari dan ganti di semua file" pada editor).

## Halaman 404

`404.html` memakai tautan absolut (`/assets/...`) karena GitHub Pages menampilkannya di alamat mana pun. Jika situs dipindah ke subfolder (mis. `username.github.io/floatinghouse/`), ganti awalan `/` menjadi `/floatinghouse/`.
