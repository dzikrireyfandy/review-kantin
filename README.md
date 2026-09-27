# Tugas 2 — REST API: CRUD & Database Integration
- **Runtime & Language:** Node.js, TypeScript
- **Framework:** Express.js
- **Database & ORM:** SQL Server (SSMS), Drizzle ORM
- **API Documentation:** Swagger UI (`swagger-autogen`)
- **Security:** Bcrypt (Password Hashing)

## 1. Struktur Folder

```
tugas2-drizzle/
├─ package.json
├─ tsconfig.json
├─ drizzle.config.ts
├─ .env.example
├─ sql/
│  ├─ 00-setup-mixed-mode.sql       
│  ├─ 01-create-database-and-user.sql 
│  ├─ 02-schema.sql                   
│  └─ 03-seed.sql                     
└─ src/
   ├─ index.ts              
   ├─ db/
   │  ├─ schema.ts           
   │  └─ index.ts            
   ├─ docs/
   │  ├─ swagger.ts         
   │  └─ swagger-output.json 
   ├─ dtos/                  
   ├─ repositories/          
   ├─ services/              
   ├─ controllers/          
   └─ routes/                
```

## 2. Cara Menjalankan 


Konfigurasi Database (SQL Server)
Jalankan sql/01-create-database-and-user.sql menggunakan akun sysadmin / Windows Authentication untuk membuat database dan pengguna praktikum_user.

Jalankan sql/02-schema.sql untuk membuat tabel-tabel utama.


### d. Setup backend
```bash
npm install
cp .env.example .env
```
Buka `.env`, sesuaikan `DB_SERVER` (isi `localhost` atau `localhost\SQLEXPRESS` kalau named instance), `DB_USER=praktikum_user`, `DB_PASSWORD` sesuai di `01-create-database-and-user.sql`.

### e. Jalankan server
```bash
npm run dev
```

```
Server berjalan di http://localhost:3000
Dokumentasi API: http://localhost:3000/docs
```

## 3. Testing — 2 cara


1. Buka `http://localhost:3000/docs`
2. Klik salah satu endpoint, klik **"Try it out"**
3. Isi parameter/body kalau ada, klik **"Execute"**
4. Lihat response di bawah



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
kalkulasi Otomatis: Perhitungan nilai rata-rata rating (avgRating) dan total ulasan (reviewCount) pada warung diperbarui secara otomatis ketika ulasan ditambah atau dihapus.

Penyimpanan Aman: Kata sandi disimpan menggunakan enkripsi hashing berbasis bcrypt.

Keamanan Query: Seluruh operasi basis data menggunakan parameterized query bawaan Drizzle ORM untuk mencegah ancaman SQL Injection.

Dokumentasi Terintegrasi: Menyediakan pengujian antarmuka API interaktif secara langsung menggunakan Swagger UI.
