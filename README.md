# Bus-Management-System
Modern intercity bus departure &amp; ticketing management system built with Next.js and TypeScript — featuring interactive seat maps (Sleeper/Suite/Executive), Female Solo Traveler seat protection, dynamic pricing, live GPS tracking, QR digital manifest, smart baggage compartment tracking, and role-based access control.

Platform manajemen operasional dan pemesanan tiket bus antarkota (**Koridor Utama: Yogyakarta — Bali**) yang mengintegrasikan denah tempat duduk interaktif, proteksi *Solo Traveler Wanita*, harga tiket dinamis (*Dynamic Pricing*), pelacakan *Live GPS*, absensi *Digital Manifest QR*, pelacakan bagasi kompartemen (*Smart Baggage Tracker*), serta analitik *Heatmap* titik keberangkatan penumpang.

Dirancang dengan antarmuka **Hijau Emerald & Putih** yang bersih, elegan, dilengkapi ilustrasi vektor bus ikonik, animasi bus melaju saat *loading*, serta responsif untuk perangkat **HP, Tablet, dan Desktop**.

---

## Fitur Utama Sistem

### 1. Denah Tempat Duduk Interaktif & Menu Order Langsung
* Menampilkan visualisasi kursi yang masih **Kosong** dan yang **Sudah Terisi** secara *real-time*.
* Ketika pengguna mengklik kursi kosong pada denah, sistem langsung membuka **Menu Order Tiket** untuk kursi tersebut beserta opsi penitipan bagasi bawah.

### 2. Tiga Paket Kelas Armada Bus
* **Sleeper Class (Konfigurasi 1-1 Double Deck):** 20 kabin tidur rebahan penuh $180^\circ$ yang terbagi menjadi *Lower Deck* (Dek Bawah) dan *Upper Deck* (Dek Atas).
* **Suite Class (Konfigurasi 2-1 Semi-Kabin):** 21 kursi *Captain Seat* dengan tirai privasi dan *electric legrest*.
* **Eksekutif (Konfigurasi 2-2):** 28 kursi ergonomis dengan *jumbo legrest*.

### 3. Solo Traveler & Gender Preferences (Proteksi Penumpang Wanita)
* Penumpang wanita yang bepergian sendiri dapat mengaktifkan opsi **Solo Traveler Wanita** saat memesan tiket.
* Sistem secara otomatis menandai kursi kosong tepat di sebelahnya dengan status **`Khusus Wanita`** dan memblokir pemilihan gender `Pria` pada kursi tersebut demi keamanan dan kenyamanan.

### 4. Dynamic Pricing (Harga Tiket Dinamis Otomatis)
* Harga tiket dapat menyesuaikan secara otomatis seperti tiket maskapai penerbangan berdasarkan:
  * **Tingkat Keterisian Kursi (Okupansi):** Naik otomatis `+8%` saat kursi terisi $50\%\text{--}74\%$, dan naik `+15%` saat kursi terisi $\ge 75\%$.
  * **Faktor Kalender & Musim:** Mode `Hari Normal`, `Akhir Pekan (+10%)`, dan `Libur Panjang / Peak Season (+15%)`.
  * **Promo Last-Minute:** Diskon `-12%` saat okupansi masih longgar menjelang keberangkatan.

### 5. Roadmap Rute Perjalanan & Lokasi Pemberhentian (Yogyakarta — Bali)
* Menampilkan tahapan lokasi pemberhentian dari titik awal hingga akhir:
  1. **Terminal Tipe A Giwangan** (Kota Yogyakarta)
  2. **Agen Sleman Utara & Denggung** (Kab. Sleman, DIY)
  3. **Agen Prambanan & Klaten Sentral** (Kab. Klaten)
  4. **Terminal Tirtonadi** (Kota Surakarta / Solo)
  5. **RM Taman Sari Tol Ngawi** (Servis Makan Prasmanan & Istirahat Ibadah)
  6. **Rest Area KM 726B Mojokerto** (Pengecekan Teknis & Pergantian Sopir)
  7. **RM Utama Raya Situbondo** (Istirahat Malam)
  8. **Pelabuhan Ketapang - Gilimanuk** (Penyeberangan Kapal Ferry Selat Bali)
  9. **Terminal Tipe A Mengwi** (Badung / Denpasar - Bali)

### 6. Live GPS Tracking (Pantauan Penumpang/Owner & Akses Update Sopir)
* Memantau lokasi bus terkini, persentase progres perjalanan, kecepatan (`km/jam`), dan nama sopir yang bertugas.
* Admin/Kru memiliki panel **Update GPS Sopir** untuk memperbarui titik posisi koridor dan status operasional (*Berjalan Normal*, *Boarding Penumpang di Agen*, *Berhenti di Rumah Makan*, *Menyeberang Kapal Ferry*).

### 7. Digital Manifest (Absensi Penumpang Instan via QR Code)
* Kernet atau petugas agen tidak perlu menghitung manual dengan kertas.
* Cukup memasukkan/memindai kode QR tiket penumpang (misal `TKT-JG-907`), sistem otomatis memverifikasi status penumpang menjadi **`Sudah Naik`** dan menampilkan siapa saja yang belum naik di titik penjemputan.

### 8. Smart Baggage Tracker (Pelacakan Bagasi Bawah Kompartemen A/B/C)
* Setiap koper atau barang yang masuk ke bagasi bawah diberi kode tag QR unik (misal `BAG-JG-101A`) dan dicatat lokasinya secara spesifik di:
  * **Kompartemen A (Lambung Kiri Depan)**
  * **Kompartemen B (Lambung Kanan Tengah)**
  * **Kompartemen C (Bagasi Belakang Besar)**
* Penumpang dapat mengecek status barang bawaannya kapan saja di aplikasi.

### 9. Heatmap Analitik Titik Naik Penumpang
* Menampilkan analitik kepadatan penumpang berdasarkan lokasi agen/terminal dan rentang waktu keberangkatan (`Pagi`, `Siang`, `Sore`, `Malam`).
* Membantu Owner melihat perbandingan performa titik naik (misalnya **Agen Sleman Utara** lebih padat dibanding **Terminal Utama Giwangan**) untuk perencanaan pembukaan agen baru atau penyesuaian alokasi kursi.

---

## Pembagian Hak Akses & Batasan Peran (RBAC)

Sistem membagi akses ke dalam **3 peran (Role)** dengan batasan wewenang yang jelas:

| Fitur / Modul | Pengguna (Penumpang) | Admin (Operasional & Kru) | Owner (Pemilik PO Bus) |
| :--- | :---: | :---: | :---: |
| **Pilih Kursi Kosong & Order Tiket** | Bisa | Bisa (Loket) | Bisa (Inspeksi) |
| **Opsi Proteksi Solo Traveler Wanita** | Bisa | Bisa | Bisa |
| **Melihat Identitas Penumpang Lain di Kursi Terisi** | **Dibatasi (Privasi)** | Bisa | Bisa |
| **Mengatur Kebijakan Tarif Dynamic Pricing** | **Dibatasi** | **Dibatasi** | **Khusus Owner** |
| **Melihat Katalog Armada & Rute Jogja - Bali** | Bisa | Bisa | Bisa |
| **Menambah Armada Baru & Titik Pemberhentian** | **Dibatasi** | **Khusus Admin** | **Dibatasi** |
| **Update Posisi Checkpoint & Transmisi GPS Sopir** | **Dibatasi** | **Khusus Admin/Kru** | **Dibatasi (Hanya Pantau)** |
| **Cek Status QR Bagasi Pribadi** | Bisa | Bisa | — |
| **Scan QR Digital Manifest & Ubah Kompartemen Bagasi** | **Dibatasi** | **Khusus Admin/Kru** | **Dibatasi** |
| **Laporan Pendapatan Finansial & Heatmap Analitik Agen** | **Dibatasi** | **Dibatasi** | **Khusus Owner** |

---

## Cara Menjalankan Proyek

### Prasyarat
* **Node.js** versi 18 ke atas dan **npm**.

### 1. Menjalankan Aplikasi Web (`web-admin`)
Buka terminal pada direktori proyek, lalu jalankan:

```bash
cd web-admin
npm install
npm run dev
```

Buka browser dan akses:
* **http://localhost:3000**

### 2. Menjalankan Server Backend (`backend-api`) — *Opsional*
Buka tab terminal baru, lalu jalankan:

```bash
cd backend-api
npm install
npm run dev
```
*(Server API akan berjalan di `http://localhost:5001`)*

---

## Cara Menguji Fitur & Perbedaan Peran

1. Saat membuka `http://localhost:3000`, Anda akan masuk ke halaman **Login**.
2. Pilih salah satu dari 3 peran yang tersedia:
   * **`Pengguna`** (`penumpang@nusantarahijau.id`)
   * **`Admin`** (`admin@nusantarahijau.id`)
   * **`Owner`** (`owner@nusantarahijau.id`)
3. Klik tombol **Masuk** (akan tampil animasi bus berjalan di jalan raya sebelum masuk ke beranda).
4. Anda juga dapat berpindah peran secara instan kapan saja melalui tombol **`Uji Peran: Pengguna | Admin | Owner`** pada bar hijau paling atas untuk membandingkan perbedaan menu dan batasan akses setiap peran.

---
