# Audit sumber, status data, dan asumsi

Dokumen internal untuk tim peneliti. Disusun 21 Oktober 2026 dari tiga dokumen rujukan:

- **A** — Proposal penelitian (BIMA 2026). Dipakai untuk tujuan, metode yang direncanakan, dan luaran yang dijanjikan.
- **B** — Naskah paper kajian lapangan *Field Assessment of a Community-Built Floating Madrasah Supported by Plastic Drums in a Subsiding Coastal Village* (2026).
- **C** — Laporan kemajuan penelitian (Agustus 2026).
- **D** — Status terbaru dari peneliti (Oktober 2026), diberikan saat pembuatan situs.

Proposal dan laporan kemajuan **tidak** diunggah ke repositori. Anggaran, nomor identitas (NIDN, NIM, ID Sinta), nomor dokumen, nomor kontrak hibah, dan pakta integritas tidak dipakai.

## 1. Arti status

| Kode | Label di situs | Arti |
|---|---|---|
| `measured` | Terukur | Diperoleh langsung dari pengukuran atau dokumentasi lapangan |
| `processed` | Diolah | Hasil pengolahan data terukur atau data sekunder |
| `reported` | Dilaporkan warga | Keterangan narasumber/pengurus/pemerintah desa; bukan pengukuran |
| `literature` | Literatur | Nilai dari publikasi lain; bukan pengukuran di lokasi |
| `scenario` | Skenario | Asumsi "bagaimana jika" untuk analisis |
| `preliminary` | Hasil awal | Pemodelan percobaan; belum final |
| `in_progress` | Sedang berjalan | Analisis sedang dikerjakan; belum ada hasil yang dapat dipakai |
| `validated` | Tervalidasi | Diverifikasi dan disetujui ketua tim untuk publikasi |
| `planned` | Direncanakan | Belum dimulai atau perlu konfirmasi |
| `general` | Rekomendasi umum | Prinsip rekayasa umum, bukan hasil khusus penelitian ini |

Setiap label punya bentuk ikon yang berbeda (lingkaran penuh, cincin, balon kata, persegi, belah ketupat, segitiga, setengah lingkaran, centang, lingkaran putus-putus, persegi kosong) sehingga tidak bergantung pada warna.

## 2. Tabel audit informasi

| Informasi | Nilai | Lokasi di dokumen | Status | Dipakai di situs | Perlu konfirmasi |
|---|---|---|---|---|---|
| Lokasi studi | Dusun Karanggeneng, Desa Timbulsloko, Sayung, Demak | B §2.1; C §C.3 | measured | studi-kasus | – |
| Kegiatan lapangan | 16–19 Juni 2026; pasut 18 Jun–2 Jul 2026 | B §2.2, Tab. 3–4; C §C.3–C.4 | measured | studi-kasus, data | – |
| Dimensi bangunan | 7×10 m dan 5×6 m; tinggi lantai–atap 3,5 m | B Tab. 2; C Tab. 6 | measured | beranda, studi-kasus, kalkulator (contoh) | – |
| Drum | 200 L, Ø 581 × 890 mm, horizontal | B Tab. 2 | measured | studi-kasus, kalkulator | – |
| Jumlah drum Bangunan 1 | 17 depan, 11 samping, estimasi ±120 | B §2.3; C §C.5 | processed (estimasi visual) | studi-kasus, kalkulator (contoh) | Apakah ada hitungan per unit? |
| Penyambung | Pipa PVC kelas C nominal 4 inci | B §2.3; C §C.3 | measured | studi-kasus | – |
| Tiang pemandu | Kayu "penggere" dipancang, pipa PVC, diisi grout | B §2.3 | reported | studi-kasus, panduan | – |
| Kerusakan | Tiang terlepas, tali putus | B §2.3; C §C.3 | reported | beranda, studi-kasus, panduan, pemeliharaan | – |
| Riwayat desa | Pertanian produktif hingga akhir 1990-an; rob sejak awal 2000-an; genangan 1–2 m | B §2.1 | reported (pemerintah desa) | mengenal, studi-kasus | – |
| Elevasi dasar | +0,4 s.d. −4,3 m LWS (area); +0,2 s.d. −0,5 m LWS (madrasah) | B §3.1; C §C.4 | processed | beranda, data, kalkulator, risiko | – |
| Referensi geodetik | WGS84, UTM 49S, BM SMG5 0,25 m LWS, Titik Bantu ±1,232 m LWS, CORS CSMG/CSEM | C Tab. 7 | processed | data | – |
| Data pasut jam-jaman | 360 nilai (cm, nol palem) | C §C.4 tabel data | measured | data (grafik) | Konfirmasi acuan nol palem |
| Ringkasan pasut | maks 113,7; min 25,1; tunggang 88,6; S0 71,61 cm | B Tab. 4; C Tab. 8 | measured/processed | data | – |
| Formzahl | **B: 1,29; C: 1,28** (perhitungan ulang dari amplitudo: 1,287) | B §3.2; C Tab. 8 | processed | data (1,29 + catatan) | **Ya — samakan di laporan akhir** |
| Klasifikasi pasut | Campuran condong harian ganda; C mencatat laporan surveyor juga menyebut "harian tunggal" | C §C.4 | processed | data | **Ya — konfirmasi ke surveyor** |
| Datum (terhadap LWS) | HWS 114,06; MHWS 81,19; MSL 60,23; MLWS 39,27 cm | B Tab. 4 | processed | data, kalkulator, risiko | – |
| Konversi nol palem → LWS | pembacaan − (S0 − Z0) = pembacaan − 11,38 cm | dihitung situs | processed | data (opsi grafik) | **Ya — konfirmasi surveyor** |
| Konstituen pasut | M2 9,38 … MS4 0,04 cm | B §3.2; C §C.4 | processed | data | – |
| Angin ECMWF | rata-rata 1,62; maks 9,67 m/s; arah SE 26,20%, NW 19,86%, S 19,69% | B §3.3; C §C.2 | processed | data | Produk ECMWF (ERA5?) untuk atribusi |
| Angin maks tahunan | 20 tahun × 8 sektor | C Tab. 2 | processed | data (grafik) | – |
| Angin ekstrem | 2–100 tahun × 8 sektor | B Tab. 5; C Tab. 3 | processed | data | – |
| Gelombang ECMWF | Hs rata-rata 0,427; maks 2,999 m; NW 33,13%, E 32,41%, NE 22,95% | B §3.4; C §C.2 | processed | beranda, data | – |
| Hs bulanan | Jan 0,793; Feb 0,676; Des 0,531; Apr 0,256; Nov 0,247 m | B §3.4 | processed | data | Bulan lain tidak tersedia di dokumen |
| Gelombang maks tahunan | 20 tahun × 8 sektor (Hs, Tp) | C Tab. 4 | processed | data (grafik) | – |
| Gelombang ekstrem | 2–100 tahun × 8 sektor | B Tab. 6; C Tab. 5 | processed | data | – |
| Laju penurunan tanah | 10 baris kompilasi, 3,68–16,3 cm/tahun | B Tab. 1; C Tab. 1 | literature | mengenal, risiko, kalkulator | C menulis "163 cm/tahun" (salah ketik untuk 16,3) |
| Klaim proposal "10–16 cm/tahun, garis pantai mundur 5 km, 15 ribu pengungsi, Rp 39 triliun" | – | A §B, §D | literature | **Tidak dipakai** | Kompilasi B lebih bernuansa; klaim kerugian belum diverifikasi |
| Percobaan RAO | 6 DOF, 8 panel, arah 0°, belum uji konvergensi | C §C.5 | preliminary | hasil (deskripsi saja, tanpa grafik) | Izin publikasi grafik |
| Pemodelan gelombang | Delft3D, eksisting + proyeksi 10 tahun | A §E; C §G.1; D | in_progress | metodologi, hasil | Perangkat lunak final |
| OrcaWave | Finalisasi RAO | C §G.2 | preliminary | metodologi | Status finalisasi |
| OrcaFlex | Respons global, gaya penahan, kasus kritis | C §G.3; D | in_progress | metodologi, hasil | – |
| Abaqus FEA | Tiang, tiang–tanah, sambungan, ultimate strength | A §E; C §G.4; D | in_progress | metodologi, hasil | Status model saat ini |
| Fatigue | Sambungan kritis | A §E; C §G.6 | planned | metodologi, hasil | – |
| Analisis korosi | Spesifikasi perlindungan | A §E saja | planned | metodologi (perlu konfirmasi) | **Ya — tetap dilaksanakan?** |
| Analisis risiko / probabilitas kegagalan | Dasar interval perawatan | A §E saja | planned | metodologi (perlu konfirmasi) | **Ya — tetap dilaksanakan?** |
| Rekomendasi lapangan | Sambungan fondasi, sambungan rangka, abrasi tali, 4 rutinitas perawatan | B §4.2–4.3 | general (rekomendasi awal) | panduan, pemeliharaan | – |
| Luaran | Artikel GEOMATE (in preparation), buku ISBN (kompilasi), website (perencanaan) | A §4, §F; C §D | in_progress | hasil, tentang | Venue paper kajian lapangan |
| Tim | 3 dosen, 2 mahasiswa magister | A §2; B penulis | – | tentang | Izin menampilkan nama |
| Mitra | Pemerintah Desa Timbulsloko, PWNU Jawa Tengah (in-kind) | C §E | reported | tentang | Izin menampilkan |

## 3. Perbandingan metode: proposal vs laporan kemajuan vs status terbaru

| Tahap | Proposal (A) | Laporan kemajuan (C) | Status terbaru (D) | Di situs |
|---|---|---|---|---|
| Kajian literatur & data sekunder | BMKG, ECMWF, Copernicus, Batnas, Pushidros; citra satelit garis pantai | ECMWF angin & gelombang; kompilasi subsidence | Selesai | processed |
| Verifikasi lapangan | Ya | Selesai Juni 2026 | Selesai | processed |
| Batimetri & pasut | Ya | Selesai | Selesai | processed |
| Pemodelan gelombang | Delft3D, eksisting + 10 tahun | Delft3D (rencana) | Masih dilanjutkan | in_progress |
| RAO | – | Percobaan; finalisasi OrcaWave | – | preliminary |
| Respons global | – | OrcaFlex (rencana) | Sedang dikembangkan/diselesaikan | in_progress |
| FEA | Abaqus, sambungan drum–rangka, in-place & fatigue | Abaqus: tiang, tiang–tanah, sambungan; ultimate strength | Akan dihubungkan dengan OrcaFlex | in_progress |
| Fatigue | Ya | Ya | – | planned |
| Korosi | Ya | Tidak disebut | – | planned, perlu konfirmasi |
| Analisis risiko | Ya | Tidak disebut | – | planned, perlu konfirmasi |
| Sambungan baja galvanis | Disebut sebagai tipikal | Tidak ditemukan di lapangan (kayu, tali, PVC) | – | Tidak dipakai |

## 4. Asumsi yang dipakai situs

| Asumsi | Dipakai di | Jenis | Catatan |
|---|---|---|---|
| Massa jenis air 1025 kg/m³ (dapat diubah 990–1035) | kalkulator | literature | Air payau belum diukur |
| g = 9,81 m/s² | kalkulator | literature | – |
| Volume nominal 200 L sebagai dasar default; alternatif volume luar 0,236 m³ | kalkulator | measured/processed | Volume luar dihitung dari Ø 581 × 890 mm |
| Beban tersebar merata, air tenang | kalkulator | assumption | Ditampilkan di halaman |
| Tidak ada nilai default untuk berat bangunan dan beban penggunaan | kalkulator | – | Berat Madrasah Apung belum diukur |
| Dasar perairan turun sama dengan laju penurunan tanah; muka laut tetap; sedimentasi diabaikan | beranda, kalkulator, risiko | scenario | – |
| Skenario laju 4,6; 6; 16,3 cm/tahun | beranda, kalkulator, risiko | literature/scenario | Dari B Tab. 1 |
| Indeks pecah γ = 0,78 (McCowan) sebagai ilustrasi | risiko | general | Bukan tinggi gelombang di lokasi; rujukan perlu ditinjau |
| Drum digambar terendam setengah | beranda (penampang) | ilustrasi | Dinyatakan di teks |

## 5. Hal yang sengaja tidak ditampilkan

- Faktor keamanan, beban izin, kapasitas sambungan, umur fatigue, interval perawatan berbasis risiko.
- Peta probabilitas kegagalan atau peta keamanan.
- Persentase kenaikan tinggi gelombang akibat penurunan tanah.
- Seri data sintetis. Semua grafik memakai data dari dokumen (pasut jam-jaman, maksimum tahunan angin/gelombang) atau perhitungan rumus yang ditampilkan (skenario kedalaman).
- Grafik RAO hasil awal (menunggu izin).
- Gambar pihak ketiga dan citra Google Earth.
