# Membuat akun admin

Tambahkan variabel berikut ke `.env.local` pada komputer server. Jangan simpan
password asli di Git atau bagikan melalui chat.

```env
ADMIN_NAME="Admin"
ADMIN_EMAIL="email-admin-anda@example.com"
ADMIN_PASSWORD="isi-password-unik-minimal-12-karakter"
```

Gunakan email yang **belum terdaftar**. Lalu jalankan:

```bash
npm run seed:admin
```

Script membuat satu akun ADMIN dengan hash password; ia tidak mempromosikan,
menimpa, atau mengubah password akun yang sudah ada. Setelah berhasil, hapus
`ADMIN_PASSWORD` dari `.env.local`. Akun biasa yang dibuat melalui registrasi
tetap berperan USER. Lindungi akun admin dan buat cadangan database.
