# Tugas 2 — REST API: CRUD & Database Integration
Sistem Review Kantin — Express.js + TypeScript + Drizzle ORM + SQL Server + Swagger

Project ini dibangun mengikuti pola **Materi 3 (Recall Desain Database,
Integrasi Backend, ORM)** — pakai Drizzle ORM & dokumentasi Swagger — tapi
semua endpoint disesuaikan dengan **kewajiban tiap tabel di soal Tugas 2**
(bukan cuma contoh STALLS doang seperti di materi).

## 1. Struktur Folder

```
tugas2-drizzle/
├─ package.json
├─ tsconfig.json
├─ drizzle.config.ts
├─ .env.example
├─ sql/
│  ├─ 00-setup-mixed-mode.sql        # aktifkan SQL Authentication
│  ├─ 01-create-database-and-user.sql # bikin DB + login aplikasi
│  ├─ 02-schema.sql                   # 7 tabel
│  └─ 03-seed.sql                     # data awal (lebih dari minimal 5 baris)
└─ src/
   ├─ index.ts              # entry point, daftarin semua router + swagger UI
   ├─ db/
   │  ├─ schema.ts           # mapping 7 tabel ke Drizzle
   │  └─ index.ts            # koneksi Drizzle (pool singleton)
   ├─ docs/
   │  ├─ swagger.ts          # generator dokumentasi (swagger-autogen)
   │  └─ swagger-output.json # hasil generate, JANGAN diedit manual
   ├─ dtos/                  # kontrak data response per resource
   ├─ repositories/          # query Drizzle per tabel
   ├─ services/              # validasi & logika bisnis
   ├─ controllers/           # olah request/response
   └─ routes/                # endpoint + komentar #swagger.*
```

## 2. Cara Menjalankan (urutan penting!)

### a. Aktifkan SQL Authentication (kalau belum pernah)
1. Buka SSMS, connect pakai **Windows Authentication**
2. Jalankan `sql/00-setup-mixed-mode.sql`
3. **Restart service SQL Server** (klik kanan nama server di Object Explorer → Restart)
4. Pastikan TCP/IP aktif lewat SQL Server Configuration Manager → Protocols → TCP/IP → Enabled (restart lagi kalau baru diaktifkan)

### b. Buat database & login aplikasi
Jalankan `sql/01-create-database-and-user.sql` (masih pakai Windows Authentication / akun sysadmin).

Kalau mau, tes koneksi `praktikum_user` dengan bikin New Connection di SSMS pakai SQL Server Authentication (login `praktikum_user`, password sesuai yang di file).

### c. Buat tabel & isi data
1. Jalankan `sql/02-schema.sql` → bikin 7 tabel
2. Jalankan `sql/03-seed.sql` → isi data contoh (10 user, 10 warung, 24 menu, 16 review, dst)

**PENTING:** jangan run `03-seed.sql` dua kali tanpa dibersihkan dulu — nanti kena error UNIQUE constraint atau malah data dobel. Kalau ragu, cek dulu `SELECT COUNT(*) FROM dbo.USERS` dst sebelum run ulang.

### d. Setup backend
```bash
npm install
cp .env.example .env
```
Buka `.env`, sesuaikan `DB_SERVER` (isi `localhost` atau `localhost\SQLEXPRESS` kalau named instance), `DB_USER=praktikum_user`, `DB_PASSWORD` sesuai yang kamu buat di `01-create-database-and-user.sql`.

### e. Jalankan server
```bash
npm run dev
```
Script `dev` otomatis generate dokumentasi Swagger dulu (`predev` → `docs:gen`) sebelum server nyala. Kalau berhasil:
```
Server berjalan di http://localhost:3000
Dokumentasi API: http://localhost:3000/docs
```

## 3. Testing — 2 cara

### Cara A: Swagger UI (tanpa install apa-apa, langsung dari browser)
1. Buka `http://localhost:3000/docs`
2. Klik salah satu endpoint, klik **"Try it out"**
3. Isi parameter/body kalau ada, klik **"Execute"**
4. Lihat response di bawah

### Cara B: Postman / Thunder Client
Sama seperti sebelumnya, tinggal pilih method + URL + body.

## 4. Daftar Endpoint

| Tabel | Method & Path | Keterangan |
|---|---|---|
| USERS | `GET /api/v1/users` | Semua user |
| USERS | `POST /api/v1/users` | Body: `{name, email, password, role}` |
| STALLS | `GET /api/v1/stalls?search=&category=&location=&page=&limit=` | List + filter + pagination |
| STALLS | `GET /api/v1/stalls/:id` | Detail 1 warung |
| STALLS | `POST /api/v1/stalls` | Body: `{ownerId, name, category, location, description}` |
| STALLS | `PUT /api/v1/stalls/:id` | Body sama seperti POST |
| STALLS | `DELETE /api/v1/stalls/:id` | Hapus warung |
| MENU_ITEMS | `GET /api/v1/menu-items` | List, join nama warung (`stallName`) |
| MENU_ITEMS | `GET /api/v1/menu-items/:id` | Detail 1 menu |
| MENU_ITEMS | `POST /api/v1/menu-items` | Body: `{stallId, name, price, isAvailable}` |
| MENU_ITEMS | `PUT /api/v1/menu-items/:id` | Body sama seperti POST |
| MENU_ITEMS | `DELETE /api/v1/menu-items/:id` | Hapus menu |
| REVIEWS | `GET /api/v1/reviews?stall_id=` | List, join nama user (`userName`) |
| REVIEWS | `POST /api/v1/reviews` | Body: `{stallId, userId, rating, comment}` |
| REVIEWS | `DELETE /api/v1/reviews/:id` | Hapus review |
| LIKES | `POST /api/v1/likes` | Body: `{reviewId, userId}` |
| LIKES | `DELETE /api/v1/likes/:id` | Unlike |
| FLAGS | `GET /api/v1/flags` | List laporan review (join user pelapor) |
| FLAGS | `PUT /api/v1/flags/:id` | Body: `{status}` → pending/resolved/dismissed |
| AUDIT_LOGS | `GET /api/v1/audit-logs` | List log (join user) |
| AUDIT_LOGS | `POST /api/v1/audit-logs` | Body: `{userId, action, targetTable, targetId, metadata}` |

## 5. Fitur tambahan
- `avgRating` & `reviewCount` di STALLS otomatis update tiap ada review baru/dihapus
- `likeCount` di REVIEWS otomatis update tiap ada like/unlike
- Password di-hash pakai bcrypt, tidak pernah dikembalikan di response
- Semua query pakai Drizzle ORM (parameterized otomatis, aman dari SQL Injection)

## 6. Yang masih perlu KAMU lakukan sendiri
1. Push ke GitHub (`.env` & `src/docs/swagger-output.json` sudah di-`.gitignore`)
2. Testing semua endpoint di atas via `/docs` atau Postman, screenshot hasilnya
3. Screenshot testing filtering & pagination, contoh: `GET /api/v1/stalls?category=Bakso&page=1&limit=5`
4. Screenshot testing JOIN, contoh: `GET /api/v1/menu-items` (ada `stallName`) dan `GET /api/v1/reviews` (ada `userName`)
5. Tulis Laporan PDF (`NIM_Nama.pdf`) sesuai poin E di soal — termasuk bagian Refleksi yang minta penjelasan **ORM** dan **parameterized query dengan ORM** (ini bisa kamu jelaskan dari cara Drizzle bekerja di project ini: filter/where di-build dari kode TypeScript, bukan string SQL manual, jadi otomatis aman dari SQL Injection)
