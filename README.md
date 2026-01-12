# **TiketKeretaMaksi - Aplikasi Pemesanan Tiket Kereta API**

## **Deskripsi Proyek**
Perkembangan teknologi informasi telah membawa perubahan yang cukup besar di berbagai bidang, termasuk transportasi, khususnya dalam sistem pemesanan tiket kereta api yang biasanya dilakukan secara langsung di stasiun, kini beralih ke digital. Pemesanan tiket secara daring memungkinkan pengguna mengakses informasi jadwal, harga, dan ketersediaan tiket secara cepat dan efisien tanpa harus datang ke stasiun.

Dalam bidang pendidikan, teknologi web berperan penting sebagai sarana pembelajaran untuk memahami pengembangan aplikasi berbasis web dan pengelolaan data. Konsep dasar seperti operasi Create, Read, Update, dan Delete (CRUD) menjadi fondasi utama dalam pembangunan sistem informasi, sehingga diperlukan aplikasi sederhana yang dapat merepresentasikan penerapan konsep tersebut.

Oleh karena itu, kami mengembangkan aplikasi TiketKeretaMaksi, yaitu aplikasi web pemesanan tiket kereta api secara online, berbasis JavaScript yang menggunakan array dan localStorage sebagai media penyimpanan data. Aplikasi ini dirancang untuk mengelola data pemesanan secara lokal, sehingga memudahkan proses penyimpanan, pengambilan, pengubahan, dan penghapusan data.

## **Fitur Utama**

### **Fitur Beranda**
- Menampilkan informasi umum mengenai layanan pemesanan tiket kereta api secara online
- Memberikan panduan singkat alur pemesanan tiket kepada pengguna
- Menyediakan informasi promo, diskon, dan penawaran khusus yang sedang berlangsung

### **Pemesanan Tiket Kereta**
- Pencarian rute berdasarkan stasiun asal & tujuan
- Tanggal keberangkatan dan tanggal pulang (untuk perjalanan pulang pergi)
- Pilihan jumlah penumpang (dewasa & anak)
- Pilihan kelas kereta (Ekonomi, Bisnis, Eksekutif, Premium)
- Menyediakan tombol pencarian tiket kereta
- Menampilkan hasil pencarian berupa daftar tiket yang tersedia

### **Fitur Riwayat Pemesanan**
- Menampilkan seluruh data pemesanan tiket yang telah dilakukan pengguna.
- Mengelompokkan tiket berdasarkan status (Semua, Akan Datang, Selesai, Dibatalkan)
- Menyediakan fitur berdasarkan periode waktu tertentu dan pengurutan data tiket berdasarkan (terbaru, terlama, harga tertinggi, harga terendah)
- Pencarian data dengan autocomplete
- Statistik otomatis dari data riwayat
- Penyimpanan data di **localStorage browser**

### **Profil**
- Digunakan untuk melihat dan mengelola data pribadi pengguna.
- Edit informasi profil pengguna yang terdiri dari nama, email, nomor telepon, tanggal lahir dan alamat
- Sistem membership dengan poin
- Keanggotaan tier (Gold, Platinum)
- Penyimpanan preferensi pengguna

### **Fitur Login**
- Menyediakan form login dengan input email dan password
- Menyediakan fitur lupa kata sandi
- Menyediakan opsi login menggunakan akun Google dan Facebook

## **Teknologi yang Digunakan**

### **Frontend**
- **HTML5** - Struktur halaman web
- **CSS3** - Styling dengan animasi modern
- **JavaScript (ES6+)** - Logika aplikasi dan manipulasi DOM
- **Font Awesome 6** - Icon library
- **Google Fonts (Poppins)** - Tipografi

### **Data Storage**
- **localStorage API** - Penyimpanan data persist di browser
- **JavaScript Array Methods** - Manipulasi data (map, filter, reduce, forEach)
- **JSON** - Format data serialization

## **Struktur File Proyek**

```
tiketkeretamaksi/
│
├── index.html              # Landing page
├── landing.html           # Halaman utama
├── login.html            # Halaman login
├── profile.html          # Halaman profil
├── train-search.html     # Pencarian tiket kereta
├── history.html         # Riwayat pemesanan
│
├── styles.css           # Style utama
├── login.css           # Style khusus login
├── script.js           # JavaScript utama
│
└── README.md           # Dokumentasi proyek
```

## **Struktur Data**

### **Data History (Array of Objects)**
```javascript
{
    id: 123456789,          // Unique ID (timestamp)
    type: 'train',          // Tipe pemesanan
    status: 'upcoming',     // Status: 'upcoming', 'completed', 'cancelled'
    trainName: 'Argo Bromo Anggrek',
    from: 'Gambir (GMR)',
    to: 'Surabaya Gubeng (SGU)',
    departure: '08:00',
    arrival: '15:30',
    date: '2023-11-20',
    orderNumber: 'TK-20231120-001',
    price: 450000,
    passengers: 2,
    class: 'Eksekutif',
    createdAt: '2023-11-15T10:30:00Z'
}
```

### **Data Profil (Object)**
```javascript
{
    firstName: 'Andi',
    lastName: 'Wijaya',
    email: 'andi.wijaya@email.com',
    phone: '+62 812-3456-7890',
    birthdate: '1990-05-15',
    address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    membership: {
        level: 'Gold',
        points: 1250,
        status: 'AKTIF',
        benefits: ['15% Cashback', 'Priority Support']
    }
}
```

## **Fitur UI/UX**

### **Design System**
- **Warna Primer**: `#3498db` (Biru), `#2c3e50` (Dark Blue)
- **Warna Sekunder**: `#2ecc71` (Hijau), `#e74c3c` (Merah)
- **Font**: Poppins (300-700 weight)
- **Border Radius**: 8px, 15px
- **Shadow**: 0 5px 15px rgba(0,0,0,0.05)

### **Komponen UI**
- **Cards** untuk riwayat dan hasil pencarian
- **Forms** dengan validation real-time
- **Buttons** dengan hover effects
- **Tabs** untuk navigasi
- **Modals** untuk detail informasi

## **Responsive Design**
- **Desktop** (>1024px) - Grid layout dengan sidebar
- **Tablet** (768px-1024px) - Adaptive layout
- **Mobile** (<768px) - Stacked layout dengan menu hamburger

## **Fitur Testing CRUD Operations**

1. **Create**: Pilih kereta → Klik "PILIH"
2. **Read**: Lihat di halaman History
3. **Update**: Klik "Batalkan" untuk mengubah status
4. **Delete**: Fungsi delete tersedia di backend logic

## **Alur Kerja Aplikasi**

```
1. Landing Page → Pilih stasiun & tanggal
2. Train Search → Lihat hasil pencarian
3. Select Train → Konfirmasi pemesanan
4. History Page → Lihat riwayat
5. Profile Page → Kelola profil
```

## **Pengembang**
Proyek ini dikembangkan oleh kelompok 4 orang:

**Anggota 1:**
- **Nama**: Khoiril Chandra Kurniawan
- **NPM**: (4524210049)

**Anggota 2:**
- **Nama**: Ririn Verdawati
- **NPM**: (4524210090)

**Anggota 3:**
- **Nama**: Steven Marvellius Agusto Simatupang
- **NPM**: (4524210098)

**Anggota 4:**
- **Nama**: Maria Natalia Alyssa Beli
- **NPM**: (4524210133)

**Mata Kuliah**: PRAKTIKUM DESAIN WEB A - UNIVERSITAS PANCASILA