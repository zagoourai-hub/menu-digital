# Menjalankan dengan Docker

Docker menggunakan SQLite terpisah dari database lokal. Data SQLite dan gambar
upload disimpan dalam named volume `esteh-data` dan `esteh-uploads`; keduanya
tetap ada saat container dibuat ulang. Jangan jalankan `docker compose down -v`
kecuali memang ingin menghapus data volume.

1. Buat file `.env.docker` di root proyek:

   ```env
   AUTH_SECRET=isi-dengan-secret-acak-yang-panjang-dan-unik
   AUTH_URL=http://localhost:3001
   ```

   Generate secret, misalnya dengan `openssl rand -base64 32`. Jangan commit
   atau bagikan file ini.

2. Jalankan `docker compose up --build -d` dan buka
   `http://localhost:3001`. Migrasi Prisma diterapkan saat container mulai.
   Untuk menggunakan port lain, ubah `APP_PORT` pada `.env` Compose (atau
   environment shell), dan sesuaikan `AUTH_URL` di `.env.docker`.
3. Buat admin menggunakan variabel `ADMIN_NAME`, `ADMIN_EMAIL`, dan
   `ADMIN_PASSWORD` pada `.env.docker`, lalu jalankan
   `docker compose run --rm app npm run seed:admin`. Email harus belum
   terdaftar. Hapus password admin dari `.env.docker` setelah berhasil.

Database baru awalnya kosong; data dan akun dari `dev.db` lokal tidak disalin.
Menu seed opsional memerlukan `SEED_AUTHOR_ID` dari akun yang sudah ada:
`docker compose run --rm app npx prisma db seed --config prisma7.config.ts`.

Container berjalan dalam mode production. Pembayaran Midtrans sandbox pada
aplikasi ini memang dinonaktifkan dalam mode tersebut, sehingga Docker ini
belum menyediakan pembayaran nyata ataupun pengujian checkout sandbox.
Konfigurasi ini masih memakai SQLite, bukan Supabase/PostgreSQL; migrasi ke
Supabase membutuhkan perubahan aplikasi, skema, dan migrasi database terpisah.
