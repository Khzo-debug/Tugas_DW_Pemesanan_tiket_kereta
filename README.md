# **TiketKeretaMaksi - Aplikasi Pemesanan Tiket Kereta API**

## **Deskripsi Proyek**
Perkembangan teknologi informasi telah membawa perubahan signifikan di berbagai sektor, termasuk transportasi, khususnya dalam sistem pemesanan tiket kereta api yang kini beralih dari metode konvensional ke digital. Pemesanan tiket secara daring memungkinkan pengguna mengakses informasi jadwal, harga, dan ketersediaan tiket secara cepat dan efisien tanpa harus datang ke stasiun.

Dalam bidang pendidikan, teknologi web berperan penting sebagai sarana pembelajaran untuk memahami pengembangan aplikasi berbasis web dan pengelolaan data. Konsep dasar seperti operasi Create, Read, Update, dan Delete (CRUD) menjadi fondasi utama dalam pembangunan sistem informasi, sehingga diperlukan aplikasi sederhana yang dapat merepresentasikan penerapan konsep tersebut.

Oleh karena itu, kami mengembangkan aplikasi TiketKeretaMaksi, yaitu aplikasi web pemesanan tiket kereta api berbasis JavaScript yang menggunakan array dan localStorage sebagai media penyimpanan data. Aplikasi ini dirancang untuk mengelola data pemesanan secara lokal, sehingga memudahkan proses penyimpanan, pengambilan, pengubahan, dan penghapusan data.

Melalui aplikasi ini, diharapkan mahasiswa dapat memahami alur kerja sistem pemesanan tiket berbasis web serta meningkatkan keterampilan dalam menerapkan operasi CRUD dan pengelolaan data menggunakan JavaScript sebagai penghubung antara teori dan praktik pemrograman.

## ✨ **Fitur Utama**

### **Fitur Beranda**
- Menjadi halaman utama aplikasi TiketKeretaMaksi
- Menampilkan informasi umum mengenai layanan pemesanan tiket kereta api secara online
- Memberikan panduan singkat alur pemesanan tiket kepada pengguna
- Menyediakan informasi promo, diskon, dan penawaran khusus yang sedang berlangsung
- Menampilkan pengumuman atau informasi terbaru terkait layanan kereta api

### 🎟️ **Pemesanan Tiket Kereta**
- Pencarian rute berdasarkan stasiun asal & tujuan
- Tanggal keberangkatan dan tanggal pulang (untuk perjalanan pulang pergi)
- Pilihan jumlah penumpang (dewasa & anak)
- Pilihan kelas kereta (Ekonomi, Bisnis, Eksekutif, Premium)
- Menyediakan tombol pencarian tiket kereta
- Menampilkan hasil pencarian berupa daftar tiket yang tersedia

### 📊 **Fitur Riwayat Pemesanan**
- Menampilkan seluruh data pemesanan tiket yang telah dilakukan pengguna.
- **CRUD Operations** lengkap (Create, Read, Update, Delete)
- Penyimpanan data di **localStorage browser**
- Mengelompokkan tiket berdasarkan status (Semua, Akan Datang, Selesai, Dibatalkan)
- Menyediakan fitur berdasarkan periode waktu tertentu dan pengurutan data tiket berdasarkan (terbaru, terlama, harga tertinggi, harga terendah)
- Pencarian data dengan autocomplete
- Statistik otomatis dari data riwayat

### 👤 **Profil**
- Digunakan untuk melihat dan mengelola data pribadi pengguna.
- Edit informasi profil pengguna yang terdiri dari nama, email, nomor telepon, tanggal lahir dan alamat
- Sistem membership dengan poin
- Keanggotaan tier (Gold, Platinum)
- Penyimpanan preferensi pengguna

### **Fitur Login**
- Menyediakan form login dengan input email dan password
- Menyediakan fitur lupa kata sandi
- Menyediakan opsi login menggunakan akun Google dan Facebook

## 🛠️ **Teknologi yang Digunakan**

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

## 📁 **Struktur File Proyek**

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

## 🗃️ **Struktur Data**

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

## 🔧 **API Data Storage**

### **Kelas DataStorage**
```javascript
// Inisialisasi
DataStorage.getHistory()        // Ambil semua data history
DataStorage.getProfile()        // Ambil data profil
DataStorage.getStatistics()     // Ambil statistik

// CRUD Operations
DataStorage.addHistoryItem(item)     // Tambah data baru
DataStorage.updateHistoryStatus(id, status)  // Update status
DataStorage.deleteHistoryItem(id)    // Hapus data
DataStorage.filterHistory(type)      // Filter data

// Utility
DataStorage.addSampleData()     // Tambah data contoh
DataStorage.clearAllData()      // Reset semua data
DataStorage.exportData()        // Export data ke JSON
```

### **Contoh Penggunaan**
```javascript
// Tambah data pemesanan baru
const newBooking = {
    type: 'train',
    status: 'upcoming',
    trainName: 'Argo Bromo',
    from: 'Gambir',
    to: 'Surabaya',
    price: 450000
};
DataStorage.addHistoryItem(newBooking);

// Filter data berdasarkan status
const upcomingBookings = DataStorage.filterHistory('upcoming');

// Ambil statistik
const stats = DataStorage.getStatistics();
console.log(`Total tiket: ${stats.trainCount}`);
console.log(`Total pengeluaran: Rp ${stats.totalSpent}`);
```

## 🎨 **Fitur UI/UX**

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

## 📱 **Responsive Design**
- **Desktop** (>1024px) - Grid layout dengan sidebar
- **Tablet** (768px-1024px) - Adaptive layout
- **Mobile** (<768px) - Stacked layout dengan menu hamburger

## 🔍 **Fitur Debug & Testing**

### **Fungsi Console**
```javascript
// Tampilkan semua data
showStorageData()

// Tambah data contoh
addSampleHistoryData()

// Reset semua data
clearAllData()

// Export data ke JSON
exportData()
```

### **Testing CRUD Operations**
1. **Create**: Pilih kereta → Klik "PILIH"
2. **Read**: Lihat di halaman History
3. **Update**: Klik "Batalkan" untuk mengubah status
4. **Delete**: Fungsi delete tersedia di backend logic

## 📊 **Alur Kerja Aplikasi**

```
1. Landing Page → Pilih stasiun & tanggal
2. Train Search → Lihat hasil pencarian
3. Select Train → Konfirmasi pemesanan
4. History Page → Lihat riwayat
5. Profile Page → Kelola profil
```

## 🎯 **Fokus Pembelajaran**

### **JavaScript Concepts**
- Array manipulation (map, filter, reduce, forEach)
- localStorage API
- Event handling
- DOM manipulation
- Object-oriented programming

## 📋 **Latar Belakang Pengembangan Aplikasi**

Aplikasi TiketKeretaMaksi dikembangkan sebagai bagian dari tugas praktikum mata kuliah Desain Web dalam rangka memahami konsep-konsep fundamental pengembangan aplikasi web berbasis JavaScript. Pengembangan aplikasi ini didasarkan pada kebutuhan untuk menciptakan platform pemesanan tiket kereta api yang sederhana namun fungsional, dengan fokus pada implementasi operasi CRUD (Create, Read, Update, Delete) menggunakan localStorage sebagai media penyimpanan data.

### **Tujuan Pengembangan**
- Memahami dan mengimplementasikan konsep dasar operasi CRUD dalam konteks aplikasi web
- Menerapkan penggunaan localStorage untuk penyimpanan data persist di sisi klien
- Mengembangkan kemampuan dalam manipulasi DOM dan event handling menggunakan JavaScript
- Menciptakan antarmuka pengguna yang responsif dan user-friendly
- Menerapkan prinsip-prinsip desain web modern dengan HTML5, CSS3, dan JavaScript ES6+

### **Ruang Lingkup Pengembangan**
Aplikasi ini dikembangkan dengan batasan-batasan tertentu untuk memfokuskan pembelajaran pada aspek teknis utama:
- Penggunaan localStorage sebagai pengganti database server-side
- Implementasi fitur pemesanan tiket secara simulasi
- Fokus pada fungsionalitas CRUD untuk manajemen data pemesanan
- Desain responsif untuk berbagai ukuran perangkat

## 🎨 **Wireframe Aplikasi**

Berikut adalah wireframe desain antarmuka aplikasi TiketKeretaMaksi yang menunjukkan struktur dan navigasi utama:

![Wireframe Aplikasi](Screenshot%202026-01-13%20114852.png)

*Wireframe menampilkan halaman-halaman utama: Landing Page, Pencarian Tiket, Riwayat Pemesanan, dan Profil Pengguna*

## 🔧 **Penjelasan Fitur-Fitur Aplikasi**

### **1. Halaman Beranda (Landing Page)**

**Deskripsi**: Halaman utama aplikasi yang menyambut pengguna dan menyediakan akses ke fitur pencarian tiket.

**Tangkapan Layar Kode**:
```html
<section class="hero">
    <div class="hero-content">
        <h2>Pesan Tiket Kereta</h2>
        <p>Perjalanan nyaman dan hemat dengan kemudahan pemesanan online</p>
        <a href="train-search.html" class="btn-hero btn-train">
            <i class="fas fa-train"></i> Pesan Tiket Kereta
        </a>
    </div>
    <div class="hero-image">
        <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" alt="Kereta Api">
    </div>
</section>
```

### **2. Pencarian Tiket Kereta**

**Deskripsi**: Formulir pencarian tiket dengan autocomplete untuk stasiun asal dan tujuan.

**Tangkapan Layar Kode**:
```javascript
function setupStationAutocomplete() {
  bindAutocomplete('from-station');
  bindAutocomplete('to-station');
  bindAutocomplete('from-station-detail');
  bindAutocomplete('to-station-detail');
}

function bindAutocomplete(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;

  input.addEventListener('input', () => {
    const list = document.getElementById(inputId + '-list');
    if (list) list.remove();

    if (input.value.length < 2) return;

    const container = document.createElement('div');
    container.id = inputId + '-list';
    container.className = 'autocomplete-list';

    TRAIN_STATIONS.filter(s =>
      s.name.toLowerCase().includes(input.value.toLowerCase())
    ).forEach(s => {
      const item = document.createElement('div');
      item.textContent = `${s.name} (${s.code})`;
      item.onclick = () => {
        input.value = item.textContent;
        container.remove();
      };
      container.appendChild(item);
    });

    input.parentNode.appendChild(container);
  });
}
```

### **3. Sistem Riwayat Pemesanan (CRUD Operations)**

**Deskripsi**: Implementasi lengkap operasi CRUD untuk mengelola data pemesanan tiket.

**Tangkapan Layar Kode**:
```javascript
class DataStorage {
  static getHistory() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY)) || [];
  }

  static saveHistory(data) {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(data));
  }

  static addHistoryItem(item) {
    const history = this.getHistory();
    history.unshift({ id: Date.now(), ...item });
    this.saveHistory(history);
  }

  static updateHistoryStatus(id, status) {
    const history = this.getHistory().map(item =>
      item.id == id ? { ...item, status } : item
    );
    this.saveHistory(history);
  }
}
```

### **4. Halaman Profil Pengguna**

**Deskripsi**: Manajemen data profil pengguna dengan sistem membership.

**Tangkapan Layar Kode**:
```html
<div class="membership-card">
    <h2><i class="fas fa-crown"></i> Membership</h2>
    <div class="membership-info">
        <div>
            <div class="points-label">Total Poin</div>
            <div class="points-value" id="membership-points">1250</div>
            <div class="points-note">Poin dapat ditukar dengan diskon</div>
        </div>
        <div>
            <div class="status-label">Status Member</div>
            <div class="status-value" id="membership-status">Gold</div>
            <div class="benefit-badge">15% Cashback</div>
        </div>
    </div>
</div>
```

## 📸 **Tangkapan Layar Hasil Website**

### **Halaman Beranda**
![Halaman Beranda](Screenshot%202026-01-13%20114852.png)
*Halaman utama dengan hero section dan fitur pencarian tiket*

### **Halaman Pencarian Tiket**
![Halaman Pencarian](Screenshot%202026-01-13%20114852.png)
*Formulir pencarian dengan autocomplete dan hasil pencarian tiket*

### **Halaman Riwayat Pemesanan**
![Halaman Riwayat](Screenshot%202026-01-13%20114852.png)
*Daftar riwayat pemesanan dengan filter dan statistik*

### **Halaman Profil**
![Halaman Profil](Screenshot%202026-01-13%20114852.png)
*Manajemen profil pengguna dan informasi membership*

## 👨‍💻 **Pengembang**
Proyek ini dikembangkan oleh kelompok 4 orang:

**Anggota 1:**
- **Nama**: [Nama Anggota 1]
- **NIM**: [NIM Anggota 1]

**Anggota 2:**
- **Nama**: [Khoiril Chandra K]
- **NIM**: [4524210049]

**Anggota 3:**
- **Nama**: [Nama Anggota 3]
- **NIM**: [NIM Anggota 3]

**Anggota 4:**
- **Nama**: [Nama Anggota 4]
- **NIM**: [NIM Anggota 4]

**Mata Kuliah**: Pemrograman Web
**Institusi**: [Universitas Pancasila]
