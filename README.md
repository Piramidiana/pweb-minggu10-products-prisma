# API Produk — ExpressJS + Prisma + PostgreSQL

Tugas Pemrograman Web Minggu 10. Lanjutan API produk Minggu 9, data kini tersimpan di database PostgreSQL (Neon) melalui Prisma ORM.

Nama: Dian Piramidiana Rachmatika
NRP: 5027251031

## Teknologi

- ExpressJS 5 + TypeScript
- Prisma ORM 7 dengan adapter Neon
- PostgreSQL (Neon)

## Cara Menjalankan

1. Install paket
   ```bash
   npm install
   ```
2. Salin `.env.example` menjadi `.env`, lalu isi dengan connection string Neon
   - `DATABASE_URL` untuk koneksi pooled (alamat dengan `-pooler`)
   - `DATABASE_URL_UNPOOLED` untuk koneksi langsung (dipakai migrasi)
3. Buat tabel, generate Prisma Client, dan isi data awal
   ```bash
   npx prisma migrate dev
   npx prisma generate
   npx prisma db seed
   ```
4. Jalankan server
   ```bash
   npm run dev
   ```
   Server berjalan di `http://localhost:3000`.

## Struktur Folder

```
images/                          screenshot dokumentasi
prisma/
├── migrations/                  riwayat perubahan struktur tabel
├── schema.prisma                desain tabel Product
└── seed.ts                      data awal (Buku, Pulpen, Spidol)
src/
├── controllers/
│   └── products.controller.ts   logika CRUD dengan Prisma
├── lib/
│   └── prisma.ts                koneksi Prisma Client ke Neon
├── middleware/
│   ├── error-handler.ts         penanganan 404 dan error terpusat
│   └── request-logger.ts        mencatat setiap request
├── routes/
│   └── products.routes.ts       pasangan method + URL ke controller
├── app.ts                       memasang middleware dan router
└── index.ts                     menjalankan server
prisma.config.ts                 konfigurasi Prisma CLI
```

![Struktur folder](images/pemwebm10-01-struktur-folder.png)

## Model Data

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| id | Int | Primary key, autoincrement |
| name | String | Wajib, tidak boleh kosong |
| price | Int | Wajib, bilangan bulat >= 0 |
| createdAt | DateTime | Otomatis saat dibuat |
| updatedAt | DateTime | Otomatis saat diubah |

![schema.prisma](images/pemwebm10-02-schema-prisma.png)

## Daftar Endpoint

| Method | URL | Body | Keterangan | Status |
| --- | --- | --- | --- | --- |
| GET | `/products` | – | Menampilkan seluruh produk | 200 |
| GET | `/products/:id` | – | Menampilkan satu produk | 200, 400, 404 |
| POST | `/products` | `{ name, price }` | Membuat produk baru | 201, 400 |
| PUT | `/products` | `{ id, name, price }` | Mengubah produk | 200, 400, 404 |
| DELETE | `/products/:id` | – | Menghapus produk | 200, 400, 404 |

## Dokumentasi

### 1. Persiapan Database

Migrasi berhasil diterapkan ke Neon dan struktur database sudah sesuai dengan schema.

![Status migrasi](images/pemwebm10-03-migrasi.png)

Seed sudah pernah dijalankan, sehingga tabel `Product` sudah berisi 3 data awal.

![Seed](images/pemwebm10-04-seed.png)

### 2. Isi Database Sebelum Pengujian

Tabel `Product` berisi 3 produk hasil seed: Buku, Pulpen, dan Spidol.

![Database sebelum pengujian](images/pemwebm10-05-db-sebelum.png)

### 3. Pengujian GET

| No | Request | Hasil |
| --- | --- | --- |
| 1 | GET `/products` | 200, menampilkan 3 produk |
| 2 | GET `/products/1` | 200, menampilkan Buku |
| 3 | GET `/products/99` | 404, Produk tidak ditemukan |
| 4 | GET `/products/abc` | 400, id harus berupa angka bulat positif |

**1. GET seluruh produk (sukses)**

![GET semua produk](images/pemwebm10-06-get-semua.png)

**2. GET produk berdasarkan id (sukses)**

![GET produk id 1](images/pemwebm10-07-get-id.png)

**3. GET produk yang tidak ada (gagal)**

![GET produk id 99](images/pemwebm10-08-get-tidak-ada.png)

**4. GET dengan id bukan angka (gagal validasi)**

![GET produk id abc](images/pemwebm10-09-get-id-salah.png)

### 4. Pengujian POST

| No | Body | Hasil |
| --- | --- | --- |
| 5 | `{ "name": "Penghapus", "price": 3000 }` | 201, produk dibuat dengan id 4 |
| 6 | `{ "name": "", "price": 3000 }` | 400, name tidak boleh kosong |
| 7 | `{ "name": "Map", "price": "3000" }` | 400, price harus berupa angka |

**5. POST produk baru (sukses)**

![POST sukses](images/pemwebm10-10-post-sukses.png)

**6. POST dengan name kosong (gagal validasi)**

![POST name kosong](images/pemwebm10-11-post-nama-kosong.png)

**7. POST dengan price berupa teks (gagal validasi)**

![POST price teks](images/pemwebm10-12-post-harga-teks.png)

### 5. Pengujian PUT

| No | Body | Hasil |
| --- | --- | --- |
| 8 | `{ "id": 4, "name": "Penghapus Besar", "price": 4500 }` | 200, data berubah |
| 9 | `{ "id": 99, "name": "A", "price": 1000 }` | 404, Produk tidak ditemukan |
| 10 | `{ "name": "A", "price": 1000 }` | 400, id wajib diisi |

**8. PUT produk (sukses)**

![PUT sukses](images/pemwebm10-13-put-sukses.png)

**9. PUT produk yang tidak ada (gagal)**

![PUT produk tidak ada](images/pemwebm10-14-put-tidak-ada.png)

**10. PUT tanpa id (gagal validasi)**

![PUT tanpa id](images/pemwebm10-15-put-tanpa-id.png)

### 6. Pengujian DELETE

| No | Request | Hasil |
| --- | --- | --- |
| 11 | DELETE `/products/3` | 200, Produk berhasil dihapus |
| 12 | DELETE `/products/3` (diulang) | 404, Produk tidak ditemukan |

**11. DELETE produk (sukses)**

![DELETE sukses](images/pemwebm10-16-delete-sukses.png)

**12. DELETE produk yang sudah dihapus (gagal)**

![DELETE ulang](images/pemwebm10-17-delete-lagi.png)

### 7. Isi Database Sesudah Pengujian

Spidol (id 3) sudah terhapus, Penghapus (id 4) sudah berubah menjadi Penghapus Besar dengan harga 4500. Kolom `updatedAt` Penghapus Besar berbeda dengan `createdAt`, menandakan data pernah diubah. Id 3 tidak dipakai ulang oleh database.

![Database sesudah pengujian](images/pemwebm10-18-db-sesudah.png)

### 8. Data Tetap Tersimpan Setelah Server Di-restart

Server dimatikan lalu dijalankan kembali. Data tetap sama karena tersimpan di database, berbeda dengan Minggu 9 yang memakai array di memori sehingga data hilang setiap server di-restart.

![Data tetap ada setelah restart](images/pemwebm10-19-data-permanen.png)