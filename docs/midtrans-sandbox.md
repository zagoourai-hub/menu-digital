# Midtrans Sandbox

Isi kredensial **sandbox** dari dashboard Midtrans pada `.env.local`:

```env
MIDTRANS_SERVER_KEY=isi_server_key_sandbox
MIDTRANS_CLIENT_KEY=isi_client_key_sandbox
```

Restart server pengembangan setelah mengubah environment. Jangan mengirim
server key ke browser, menaruhnya di variabel `NEXT_PUBLIC_`, atau menyimpannya
di Git.

`MidtransService` di `lib/server/midtrans.service.ts` menyiapkan client Snap
khusus sandbox. Contoh penggunaan di kode server:

```ts
import { MidtransService } from "@/lib/server/midtrans.service"

const midtrans = new MidtransService()
```

Halaman detail menu menyediakan popup Snap untuk percobaan lokal. Endpoint sandbox
dinonaktifkan saat `NODE_ENV=production`; pembatasan request per proses hanya
untuk pengembangan dan bukan perlindungan distribusi/produksi.

Pesanan sandbox disimpan di tabel `Pesanan`. Browser menyimpan ID pesanan per
produk agar percobaan berikutnya dapat menggunakan transaksi yang sama. Untuk
memeriksa status ke Midtrans, Server Key juga membutuhkan izin **Core API Read**.
Status sukses hanya disimpan setelah status dan nominal diverifikasi di server.

Pembatasan ini belum menjamin pencegahan duplikasi lintas perangkat, browser,
penyimpanan yang dihapus, atau tab yang membuat ID secara bersamaan. Jika
pembuatan transaksi gagal setelah pesanan tersimpan, status dianggap tidak
pasti dan perlu diperiksa secara manual; jangan langsung membuat pesanan baru.
Belum ada webhook. Jangan gunakan untuk transaksi nyata sebelum identitas
pesanan, rekonsiliasi webhook, dan pembatasan terdistribusi ditambahkan.
