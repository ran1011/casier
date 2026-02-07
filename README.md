# Dashboard Kasir Otomatis

Dashboard kasir otomatis dengan fitur lengkap untuk manajemen restoran/kafe.

## Fitur Utama

1. **Dashboard Statistik**
   - Pendapatan harian, mingguan, bulanan
   - Grafik pendapatan 7 hari terakhir
   - Menu favorit berdasarkan penjualan
   - Ringkasan hari ini

2. **Pemesanan Makanan**
   - Input order untuk tempat makan, delivery, atau takeaway
   - Pilihan kategori menu (makanan, minuman, snack)
   - Perhitungan otomatis subtotal, biaya delivery, dan total
   - Cetak struk pembayaran

3. **Manajemen Menu**
   - Tambah, edit, hapus menu
   - Kelola stok dan harga
   - Kategori makanan, minuman, snack
   - Pencarian menu

4. **Riwayat Order**
   - Filter berdasarkan tanggal, status, dan tipe order
   - Preview detail order
   - Ekspor data ke CSV

5. **Stok & Pengeluaran**
   - Manajemen stok barang
   - Pencatatan pengeluaran
   - Notifikasi stok rendah
   - Ringkasan pengeluaran bulanan

6. **Antrian Order**
   - Order dalam proses
   - Order sedang disiapkan
   - Order selesai
   - Update status order

7. **Pengaturan Sistem**
   - Nama kasir dan mata uang (Baht Thailand)
   - Pengaturan struk cetak
   - Notifikasi
   - Backup dan restore data

## Cara Menggunakan

1. **Dashboard**: Lihat statistik penjualan dan pendapatan
2. **Pesan Makanan**: Pilih menu, tentukan jenis order, proses pembayaran
3. **Kelola Menu**: Tambah/edit/hapus menu makanan dan minuman
4. **Riwayat Order**: Lihat history pesanan yang sudah diproses
5. **Stok & Pengeluaran**: Kelola stok bahan dan catat pengeluaran
6. **Antrian Order**: Pantau status order yang sedang diproses
7. **Pengaturan**: Konfigurasi sistem sesuai kebutuhan

## Cara Deploy ke Netlify

### Metode 1: Drag & Drop
1. Buat folder baru di komputer
2. Salin semua file (index.html, style.css, script.js) ke folder tersebut
3. Buka [netlify.com](https://netlify.com)
4. Login atau buat akun baru
5. Drag folder ke area "Drag and drop your site folder here"
6. Netlify akan secara otomatis melakukan deploy
7. Salin URL yang diberikan oleh Netlify

### Metode 2: GitHub
1. Buat repository baru di GitHub
2. Upload semua file ke repository
3. Buka Netlify dan pilih "Import from Git"
4. Pilih GitHub dan authorize
5. Pilih repository yang telah dibuat
6. Klik "Deploy site"

### Metode 3: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login ke Netlify
netlify login

# Inisialisasi proyek
netlify init

# Deploy
netlify deploy --prod