// API CONNECTION TO BACKEND DATABASE

const API_BASE_URL = 'http://localhost:3001/api';

// Storage keys for localStorage
const STORAGE_KEYS = {
    HISTORY: 'train_history',
    PROFILE: 'user_profile',
    LAST_SEARCH: 'last_search'
};

// Global variables for current user session
let currentUser = null;
let trainStations = [];
let availableTrains = [];

// Initialize API connection and load data
async function initAPI() {
    try {
        // Load train stations
        const stationsResponse = await fetch(`${API_BASE_URL}/stations`);
        if (stationsResponse.ok) {
            trainStations = await stationsResponse.json();
        }

        // Load trains
        const trainsResponse = await fetch(`${API_BASE_URL}/trains`);
        if (trainsResponse.ok) {
            availableTrains = await trainsResponse.json();
        }

        // Check for existing user session
        const userData = localStorage.getItem('current_user');
        if (userData) {
            currentUser = JSON.parse(userData);
        }

        console.log('API initialized successfully');
    } catch (error) {
        console.error('Error initializing API:', error);
        // Fallback to demo data if API is not available
        initFallbackData();
    }
}

// Fallback data for demo purposes
function initFallbackData() {
    trainStations = [
        { station_id: 1, station_name: "Gambir", city: "Jakarta", station_code: "GMR" },
        { station_id: 2, station_name: "Bandung", city: "Bandung", station_code: "BD" },
        { station_id: 3, station_name: "Surabaya Gubeng", city: "Surabaya", station_code: "SGU" },
        { station_id: 4, station_name: "Yogyakarta", city: "Yogyakarta", station_code: "YK" },
        { station_id: 5, station_name: "Malang", city: "Malang", station_code: "ML" },
        { station_id: 6, station_name: "Semarang Tawang", city: "Semarang", station_code: "SMT" },
        { station_id: 7, station_name: "Solo Balapan", city: "Solo", station_code: "SLO" },
        { station_id: 8, station_name: "Cirebon", city: "Cirebon", station_code: "CN" }
    ];

    availableTrains = [
        {
            train_id: 1,
            train_name: "Argo Bromo Anggrek",
            class: "Eksekutif",
            base_price: 450000
        },
        {
            train_id: 2,
            train_name: "Taksaka",
            class: "Eksekutif",
            base_price: 350000
        },
        {
            train_id: 3,
            train_name: "Sembrani",
            class: "Bisnis",
            base_price: 280000
        }
    ];
}

// API Service class for database operations
class APIService {

    // ========== AUTHENTICATION ==========

    static async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Login failed');
            }

            const userData = await response.json();
            currentUser = userData;
            localStorage.setItem('current_user', JSON.stringify(userData));
            return userData;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    static async register(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Registration failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    static logout() {
        currentUser = null;
        localStorage.removeItem('current_user');
    }

    // ========== BOOKINGS ==========

    static async getBookings(userId = currentUser?.user_id) {
        if (!userId) throw new Error('User not logged in');

        try {
            const response = await fetch(`${API_BASE_URL}/bookings/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch bookings');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching bookings:', error);
            return [];
        }
    }

    static async createBooking(bookingData) {
        if (!currentUser) throw new Error('User not logged in');

        try {
            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: currentUser.user_id,
                    ...bookingData
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Booking failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Booking error:', error);
            throw error;
        }
    }

    static async updateBookingStatus(bookingId, status) {
        try {
            const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            if (!response.ok) {
                throw new Error('Failed to update booking status');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating booking status:', error);
            throw error;
        }
    }

    // ========== TRAIN SCHEDULES ==========

    static async getSchedules(filters = {}) {
        try {
            const params = new URLSearchParams();
            if (filters.from) params.append('from', filters.from);
            if (filters.to) params.append('to', filters.to);
            if (filters.date) params.append('date', filters.date);

            const response = await fetch(`${API_BASE_URL}/schedules?${params}`);
            if (!response.ok) {
                throw new Error('Failed to fetch schedules');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching schedules:', error);
            return [];
        }
    }

    // ========== USER PROFILE ==========

    static async getUserProfile(userId = currentUser?.user_id) {
        if (!userId) return null;

        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }

    static async updateUserProfile(userData) {
        // For now, we'll store profile updates locally
        // In a real app, this would make an API call to update the user
        if (currentUser) {
            currentUser = { ...currentUser, ...userData };
            localStorage.setItem('current_user', JSON.stringify(currentUser));
        }
        return currentUser;
    }

    // ========== STATISTICS ==========

    static async getStatistics(userId = currentUser?.user_id) {
        if (!userId) return { trainCount: 0, totalSpent: 0, upcomingCount: 0, completedCount: 0, cancelledCount: 0 };

        try {
            const bookings = await this.getBookings(userId);
            const stats = {
                trainCount: bookings.length,
                totalSpent: 0,
                upcomingCount: 0,
                completedCount: 0,
                cancelledCount: 0
            };

            bookings.forEach(booking => {
                stats.totalSpent += booking.total_price || 0;

                switch (booking.booking_status) {
                    case 'PENDING':
                    case 'CONFIRMED':
                        stats.upcomingCount++;
                        break;
                    case 'COMPLETED':
                        stats.completedCount++;
                        break;
                    case 'CANCELLED':
                        stats.cancelledCount++;
                        break;
                }
            });

            return stats;
        } catch (error) {
            console.error('Error calculating statistics:', error);
            return { trainCount: 0, totalSpent: 0, upcomingCount: 0, completedCount: 0, cancelledCount: 0 };
        }
    }
}

// Legacy compatibility functions for existing code
class DataStorage {
    
    // ========== FUNGSI UNTUK HISTORY ==========
    
    // Ambil semua data history
    static getHistory() {
        const history = localStorage.getItem(STORAGE_KEYS.HISTORY);
        return history ? JSON.parse(history) : [];
    }
    
    // Simpan data history baru
    static saveHistory(historyArray) {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(historyArray));
    }
    
    // Tambah item baru ke history
    static addHistoryItem(item) {
        const history = this.getHistory();
        
        // Tambah ID unik dan timestamp
        const newItem = {
            id: Date.now(), // ID unik berdasarkan timestamp
            ...item,
            createdAt: new Date().toISOString()
        };
        
        // Tambah ke awal array (item terbaru di atas)
        history.unshift(newItem);
        
        // Simpan kembali ke localStorage
        this.saveHistory(history);
        
        return history; // Return array yang sudah diupdate
    }
    
    // Hapus item dari history berdasarkan ID
    static deleteHistoryItem(id) {
        let history = this.getHistory();
        
        // Filter item dengan ID yang tidak sesuai
        history = history.filter(item => item.id != id);
        
        // Simpan kembali
        this.saveHistory(history);
        
        return history;
    }
    
    // Update status item di history
    static updateHistoryStatus(id, newStatus) {
        let history = this.getHistory();
        
        // Cari item berdasarkan ID
        history = history.map(item => {
            if (item.id == id) {
                return { ...item, status: newStatus };
            }
            return item;
        });
        
        // Simpan kembali
        this.saveHistory(history);
        
        return history;
    }
    
    // Filter history berdasarkan tipe
    static filterHistory(filterType) {
        const history = this.getHistory();
        
        if (filterType === 'all') return history;
        
        switch(filterType) {
            case 'train':
                return history.filter(item => item.type === 'train');
            case 'upcoming':
                return history.filter(item => item.status === 'upcoming');
            case 'completed':
                return history.filter(item => item.status === 'completed');
            case 'cancelled':
                return history.filter(item => item.status === 'cancelled');
            default:
                return history;
        }
    }
    
    // ========== FUNGSI UNTUK PROFILE ==========
    
    // Ambil data profile
    static getProfile() {
        const profile = localStorage.getItem(STORAGE_KEYS.PROFILE);
        return profile ? JSON.parse(profile) : {};
    }
    
    // Update data profile
    static updateProfile(newData) {
        const currentProfile = this.getProfile();
        const updatedProfile = { ...currentProfile, ...newData };
        
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updatedProfile));
        
        return updatedProfile;
    }
    
    // ========== FUNGSI UNTUK STATISTIK ==========
    
    // Hitung statistik dari data history
    static getStatistics() {
        const history = this.getHistory();
        
        const stats = {
            trainCount: 0,
            totalSpent: 0,
            upcomingCount: 0,
            completedCount: 0,
            cancelledCount: 0
        };
        
        history.forEach(item => {
            // Hanya hitung data kereta
            if (item.type === 'train') {
                stats.trainCount++;
                
                // Hitung berdasarkan status
                if (item.status === 'upcoming') stats.upcomingCount++;
                if (item.status === 'completed') stats.completedCount++;
                if (item.status === 'cancelled') stats.cancelledCount++;
                
                // Hitung total pengeluaran
                if (item.price) stats.totalSpent += item.price;
            }
        });
        
        return stats;
    }
    
    // ========== FUNGSI UNTUK DATA CONTOH ==========
    
    // Tambah data contoh untuk demo
    static addSampleData() {
        const sampleHistory = [
            {
                type: 'train',
                status: 'completed',
                trainName: 'Argo Bromo Anggrek',
                from: 'Gambir (GMR)',
                to: 'Surabaya Gubeng (SGU)',
                departure: '08:00',
                arrival: '15:30',
                date: '2023-11-15',
                orderNumber: 'TK-20231115-001',
                price: 450000,
                passengers: 2,
                class: 'Eksekutif'
            },
            {
                type: 'train',
                status: 'upcoming',
                trainName: 'Taksaka',
                from: 'Gambir (GMR)',
                to: 'Yogyakarta (YK)',
                departure: '10:30',
                arrival: '16:45',
                date: '2023-11-20',
                orderNumber: 'TK-20231120-001',
                price: 350000,
                passengers: 1,
                class: 'Eksekutif'
            },
            {
                type: 'train',
                status: 'completed',
                trainName: 'Sembrani',
                from: 'Gambir (GMR)',
                to: 'Surabaya Gubeng (SGU)',
                departure: '21:00',
                arrival: '05:30',
                date: '2023-11-10',
                orderNumber: 'TK-20231110-002',
                price: 280000,
                passengers: 3,
                class: 'Bisnis'
            }
        ];
        
        // Kosongkan dulu history yang ada
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([]));
        
        // Tambah data contoh
        sampleHistory.forEach(item => {
            this.addHistoryItem(item);
        });
        
        return this.getHistory();
    }
    
    // ========== FUNGSI CLEAR DATA ==========
    
    // Hapus semua data (untuk reset)
    static clearAllData() {
        localStorage.removeItem(STORAGE_KEYS.HISTORY);
        localStorage.removeItem(STORAGE_KEYS.PROFILE);
        localStorage.removeItem(STORAGE_KEYS.LAST_SEARCH);
        
        // Inisialisasi ulang
        initStorage();
    }
}

// INISIALISASI SAAT HALAMAN LOAD

document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi storage
    initStorage();
    
    // Inisialisasi menu mobile
    initMobileMenu();
    
    // Inisialisasi date inputs
    initDateInputs();
    
    // Setup autocomplete untuk stasiun
    setupStationAutocomplete();
    
    // Cek halaman yang sedang dibuka
    checkCurrentPage();
});

// Fungsi untuk inisialisasi menu mobile
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
}

// Fungsi untuk inisialisasi date inputs
function initDateInputs() {
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    
    dateInputs.forEach(input => {
        // Set tanggal minimum hari ini
        input.setAttribute('min', today);
        
        // Set default value untuk besok
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        input.value = tomorrowStr;
    });
}

// Fungsi untuk autocomplete stasiun
function setupStationAutocomplete() {
    // Untuk landing page
    setupAutocomplete('from-station', 'from-station-suggestions');
    setupAutocomplete('to-station', 'to-station-suggestions');
    
    // Untuk train search page
    setupAutocomplete('from-station-detail', 'from-station-detail-suggestions');
    setupAutocomplete('to-station-detail', 'to-station-detail-suggestions');
}

function setupAutocomplete(inputId, suggestionsId) {
    const inputElement = document.getElementById(inputId);
    const suggestionsContainer = document.getElementById(suggestionsId);
    
    if (!inputElement || !suggestionsContainer) return;
    
    inputElement.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        
        if (query.length < 2) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        const filteredStations = TRAIN_STATIONS.filter(station => 
            station.name.toLowerCase().includes(query) || 
            station.city.toLowerCase().includes(query) ||
            station.code.toLowerCase().includes(query)
        );
        
        renderStationSuggestions(filteredStations, suggestionsContainer, inputId);
    });
    
    // Sembunyikan suggestions saat klik di luar
    document.addEventListener('click', function(e) {
        if (!inputElement.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });
}

function renderStationSuggestions(stations, container, inputId) {
    if (stations.length === 0) {
        container.innerHTML = '<div class="suggestion-item">Stasiun tidak ditemukan</div>';
        container.style.display = 'block';
        return;
    }
    
    let html = '';
    stations.forEach(station => {
        html += `
            <div class="suggestion-item" 
                 data-name="${station.name}" 
                 data-code="${station.code}"
                 data-city="${station.city}">
                <i class="fas fa-train"></i>
                <div>
                    <div class="suggestion-name">${station.name} (${station.code})</div>
                    <small>${station.city}</small>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    container.style.display = 'block';
    
    // Tambah event listener untuk setiap suggestion
    container.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', function() {
            const stationName = this.getAttribute('data-name');
            const stationCode = this.getAttribute('data-code');
            
            // Isi input dengan stasiun yang dipilih
            document.getElementById(inputId).value = `${stationName} (${stationCode})`;
            
            // Sembunyikan suggestions
            container.style.display = 'none';
        });
    });
}

// Fungsi untuk cek halaman yang sedang dibuka
function checkCurrentPage() {
    const currentPage = window.location.pathname;
    
    if (currentPage.includes('history.html')) {
        initHistoryPage();
    } else if (currentPage.includes('profile.html')) {
        initProfilePage();
    } else if (currentPage.includes('train-search.html')) {
        initTrainSearchPage();
    } else if (currentPage.includes('login.html')) {
        initLoginPage();
    } else if (currentPage.includes('landing.html')) {
        initLandingPage();
    }
}

// FUNGSI UNTUK HALAMAN HISTORY

function initHistoryPage() {
    // Load data dari storage
    loadHistoryData();
    
    // Setup event listeners
    setupHistoryEventListeners();
    
    // Update statistics
    updateHistoryStatistics();
}

function loadHistoryData(filterType = 'all') {
    const historyContainer = document.getElementById('history-container');
    const historyEmpty = document.getElementById('history-empty');
    
    if (!historyContainer) return;
    
    // Ambil data dari storage
    const historyData = DataStorage.filterHistory(filterType);
    
    // Jika tidak ada data, tampilkan empty state
    if (historyData.length === 0) {
        historyContainer.innerHTML = '';
        if (historyEmpty) historyEmpty.style.display = 'block';
        return;
    }
    
    // Sembunyikan empty state
    if (historyEmpty) historyEmpty.style.display = 'none';
    
    // Render data history
    let html = '';
    historyData.forEach(item => {
        html += createHistoryItemHTML(item);
    });
    
    historyContainer.innerHTML = html;
    
    // Update jumlah hasil
    updateSearchResultsCount(historyData.length);
}

function createHistoryItemHTML(item) {
    const statusText = getStatusText(item.status);
    const statusClass = `status-${item.status}`;
    
    return `
        <div class="history-item train ${item.status}">
            <div class="history-header">
                <div class="history-type train">
                    <i class="fas fa-train"></i>
                    <span class="type-badge train">Tiket Kereta</span>
                </div>
                <div class="history-status">
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
            </div>
            
            <div class="history-content">
                <div class="history-route">
                    <div class="route-point">
                        <div class="route-time">${item.departure}</div>
                        <div class="route-place">${item.from}</div>
                    </div>
                    <div class="route-duration">
                        <i class="fas fa-arrow-right"></i>
                        <div>${item.duration || calculateDuration(item.departure, item.arrival)}</div>
                    </div>
                    <div class="route-point">
                        <div class="route-time">${item.arrival}</div>
                        <div class="route-place">${item.to}</div>
                    </div>
                </div>
                
                <div class="history-details">
                    <div class="detail-row">
                        <span class="detail-label">Kereta:</span>
                        <span class="detail-value">${item.trainName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Kelas:</span>
                        <span class="detail-value">${item.class}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Penumpang:</span>
                        <span class="detail-value">${item.passengers} orang</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Tanggal:</span>
                        <span class="detail-value">${formatDate(item.date)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Harga:</span>
                        <span class="detail-value detail-price">Rp ${item.price.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            <div class="history-footer">
                <div class="order-info">
                    <div class="order-number">No. Pesanan: ${item.orderNumber}</div>
                    <div class="order-date">Dibuat: ${formatDate(item.createdAt)}</div>
                </div>
                <div class="history-actions">
                    <button class="btn-action" onclick="viewDetail(${item.id})">
                        <i class="fas fa-eye"></i> Detail
                    </button>
                    ${item.status === 'upcoming' ? `
                        <button class="btn-action danger" onclick="cancelBooking(${item.id})">
                            <i class="fas fa-times"></i> Batalkan
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

function setupHistoryEventListeners() {
    document.querySelectorAll('.history-tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active tab
            document.querySelectorAll('.history-tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter data
            const filterType = this.getAttribute('data-filter');
            loadHistoryData(filterType);
        });
    });
    
    // Search input
    const searchInput = document.getElementById('search-history');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterHistoryBySearch(searchTerm);
        });
    }
    
    // Reset filters
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetHistoryFilters();
        });
    }
}

function filterHistoryBySearch(searchTerm) {
    const allHistory = DataStorage.getHistory();
    
    if (!searchTerm) {
        loadHistoryData('all');
        return;
    }
    
    const filtered = allHistory.filter(item => {
        return (
            (item.trainName && item.trainName.toLowerCase().includes(searchTerm)) ||
            (item.orderNumber && item.orderNumber.toLowerCase().includes(searchTerm)) ||
            (item.from && item.from.toLowerCase().includes(searchTerm)) ||
            (item.to && item.to.toLowerCase().includes(searchTerm)) ||
            (item.class && item.class.toLowerCase().includes(searchTerm))
        );
    });
    
    // Render filtered results
    const historyContainer = document.getElementById('history-container');
    if (historyContainer) {
        if (filtered.length === 0) {
            historyContainer.innerHTML = '<div class="no-results">Tidak ditemukan hasil pencarian</div>';
        } else {
            let html = '';
            filtered.forEach(item => {
                html += createHistoryItemHTML(item);
            });
            historyContainer.innerHTML = html;
        }
        
        updateSearchResultsCount(filtered.length);
    }
}

function resetHistoryFilters() {
    // Reset dropdowns
    document.getElementById('date-filter').value = 'all';
    document.getElementById('sort-filter').value = 'newest';
    
    // Reset search
    const searchInput = document.getElementById('search-history');
    if (searchInput) searchInput.value = '';
    
    // Reset tabs
    document.querySelectorAll('.history-tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === 'all') {
            btn.classList.add('active');
        }
    });
    
    // Reload all data
    loadHistoryData('all');
}

function updateHistoryStatistics() {
    const stats = DataStorage.getStatistics();
    
    // Update UI elements
    document.getElementById('train-count').textContent = stats.trainCount;
    document.getElementById('total-spent').textContent = `Rp ${stats.totalSpent.toLocaleString()}`;
    document.getElementById('upcoming-count').textContent = stats.upcomingCount;
    }
}

function updateSearchResultsCount(count) {
    const countElement = document.getElementById('search-results-count');
    if (countElement) {
        countElement.textContent = count;
    }
}

// ============================================
// FUNGSI UNTUK HALAMAN PROFILE
// ============================================

function initProfilePage() {
    // Load profile data
    loadProfileData();
    
    // Setup event listeners
    setupProfileEventListeners();
}

function loadProfileData() {
    const profile = DataStorage.getProfile();
    
    // Fill form fields
    document.getElementById('first-name').value = profile.firstName || '';
    document.getElementById('last-name').value = profile.lastName || '';
    document.getElementById('email').value = profile.email || '';
    document.getElementById('phone').value = profile.phone || '';
    document.getElementById('birthdate').value = profile.birthdate || '';
    document.getElementById('address').value = profile.address || '';
    
    // Update welcome text
    const welcomeElement = document.querySelector('.profile-photo h3');
    if (welcomeElement && profile.firstName) {
        welcomeElement.textContent = profile.firstName + ' ' + (profile.lastName || '');
    }
    
    // Update membership info jika ada
    if (profile.membership) {
        const pointsElement = document.querySelector('.points-value');
        const statusElement = document.querySelector('.status-value');
        const levelElement = document.querySelector('.member-status');
        
        if (pointsElement) pointsElement.textContent = profile.membership.points || '0';
        if (statusElement) statusElement.textContent = profile.membership.status || 'AKTIF';
        if (levelElement) levelElement.textContent = profile.membership.level + ' Member';
    }
}

function setupProfileEventListeners() {
    // Profile form submission
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                firstName: document.getElementById('first-name').value,
                lastName: document.getElementById('last-name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                birthdate: document.getElementById('birthdate').value,
                address: document.getElementById('address').value
            };
            
            // Save to storage
            DataStorage.updateProfile(formData);
            
            // Show success message
            alert('Profil berhasil diperbarui!');
            location.reload();
        });
    }
    
    // Tab switching
    document.querySelectorAll('.profile-menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            document.querySelectorAll('.profile-menu-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            document.querySelectorAll('.profile-tab').forEach(tab => tab.classList.remove('active'));
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

// ============================================
// FUNGSI UNTUK HALAMAN TRAIN SEARCH
// ============================================

function initTrainSearchPage() {
    // Setup form submission
    const searchForm = document.getElementById('train-search-form-detail');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            simulateTrainSearch();
        });
    }
    
    // Setup swap button
    const swapBtn = document.getElementById('swap-stations-detail');
    if (swapBtn) {
        swapBtn.addEventListener('click', function() {
            swapStationsDetail();
        });
    }
    
    // Setup search dari URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('from') && urlParams.has('to')) {
        // Simulasikan pencarian jika ada parameter URL
        setTimeout(() => {
            simulateTrainSearch();
        }, 500);
    }
}

function simulateTrainSearch() {
    // Show loading
    const loading = document.getElementById('loading-results');
    const resultsContainer = document.getElementById('train-results-container');
    const noResults = document.getElementById('no-results');
    
    if (loading) loading.style.display = 'block';
    if (resultsContainer) resultsContainer.style.display = 'none';
    if (noResults) noResults.style.display = 'none';
    
    // Simulate API call
    setTimeout(() => {
        if (loading) loading.style.display = 'none';
        
        // Ambil data dari form
        const fromStation = document.getElementById('from-station-detail')?.value || '';
        const toStation = document.getElementById('to-station-detail')?.value || '';
        
        if (!fromStation || !toStation) {
            if (noResults) noResults.style.display = 'block';
            return;
        }
        
        // Tampilkan hasil
        if (resultsContainer) {
            resultsContainer.style.display = 'grid';
            showTrainResults(SAMPLE_TRAINS);
        }
    }, 1000);
}

function showTrainResults(trains) {
    const resultsContainer = document.getElementById('train-results-container');
    if (!resultsContainer) return;
    
    let html = '';
    trains.forEach(train => {
        html += `
            <div class="train-result-card">
                <div class="train-icon">
                    <i class="fas fa-train fa-2x"></i>
                    <div class="train-class">${train.class}</div>
                </div>
                
                <div class="train-details">
                    <h3>${train.name}</h3>
                    <div class="train-route">
                        <div class="time-info">
                            <div class="time">${train.departure}</div>
                            <div class="station">${train.from}</div>
                        </div>
                        <div class="route-duration">
                            <i class="fas fa-arrow-right"></i>
                            <div>${train.duration}</div>
                        </div>
                        <div class="time-info">
                            <div class="time">${train.arrival}</div>
                            <div class="station">${train.to}</div>
                        </div>
                    </div>
                    <div class="train-seats">
                        <i class="fas fa-chair"></i> ${train.seats} kursi tersedia
                    </div>
                </div>
                
                <div class="train-action">
                    <div class="train-price">Rp ${train.price.toLocaleString()}</div>
                    <button class="btn-select-train" onclick="bookTrain(${train.id})">
                        <i class="fas fa-check"></i> PILIH
                    </button>
                </div>
            </div>
        `;
    });
    
    resultsContainer.innerHTML = html;
}

function swapStationsDetail() {
    const fromInput = document.getElementById('from-station-detail');
    const toInput = document.getElementById('to-station-detail');
    
    if (fromInput && toInput) {
        const temp = fromInput.value;
        fromInput.value = toInput.value;
        toInput.value = temp;
    }
}

// ============================================
// FUNGSI UNTUK HALAMAN LANDING
// ============================================

function initLandingPage() {
    // Setup form submission untuk landing page
    const searchForm = document.getElementById('train-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLandingSearch();
        });
    }
    
    // Setup swap button untuk landing page
    const swapBtn = document.getElementById('swap-stations');
    if (swapBtn) {
        swapBtn.addEventListener('click', function() {
            swapStationsLanding();
        });
    }
}

function handleLandingSearch() {
    const fromStation = document.getElementById('from-station')?.value;
    const toStation = document.getElementById('to-station')?.value;
    const departureDate = document.getElementById('departure-date')?.value;
    
    if (!fromStation || !toStation) {
        alert('Harap pilih stasiun asal dan tujuan!');
        return;
    }
    
    // Simpan pencarian terakhir
    localStorage.setItem(STORAGE_KEYS.LAST_SEARCH, JSON.stringify({
        fromStation,
        toStation,
        departureDate,
        timestamp: new Date().toISOString()
    }));
    
    // Redirect ke halaman pencarian
    window.location.href = `train-search.html?search=true`;
}

function swapStationsLanding() {
    const fromInput = document.getElementById('from-station');
    const toInput = document.getElementById('to-station');
    
    if (fromInput && toInput) {
        const temp = fromInput.value;
        fromInput.value = toInput.value;
        toInput.value = temp;
    }
}

// ============================================
// FUNGSI UNTUK HALAMAN LOGIN
// ============================================

function initLoginPage() {
    // Toggle password visibility
    const toggleBtn = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('login-password');
    
    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            this.innerHTML = type === 'password' 
                ? '<i class="fas fa-eye"></i>' 
                : '<i class="fas fa-eye-slash"></i>';
        });
    }
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple login simulation
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            if (email && password) {
                // Simulate login process
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> MEMPROSES...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    // Redirect to profile page
                    window.location.href = 'profile.html';
                }, 1000);
            }
        });
    }
    
    // Registration link
    const registerLink = document.getElementById('register-link');
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            showRegistrationForm();
        });
    }
}

function showRegistrationForm() {
    const loginCard = document.querySelector('.login-card');
    if (!loginCard) return;
    
    loginCard.innerHTML = `
        <div class="registration-header">
            <div class="registration-icon">
                <i class="fas fa-user-plus"></i>
            </div>
            <h1 class="login-title">Daftar Akun Baru</h1>
            <p class="login-subtitle">Bergabunglah dengan kami sekarang</p>
        </div>
        
        <form id="register-form">
            <div class="name-fields">
                <div class="form-group">
                    <label for="reg-first-name">Nama Depan</label>
                    <input type="text" id="reg-first-name" placeholder="Nama depan" required>
                </div>
                <div class="form-group">
                    <label for="reg-last-name">Nama Belakang</label>
                    <input type="text" id="reg-last-name" placeholder="Nama belakang" required>
                </div>
            </div>
            
            <div class="login-form-group">
                <label for="reg-email">Email</label>
                <input type="email" id="reg-email" placeholder="nama@email.com" required>
            </div>
            
            <div class="login-form-group">
                <label for="reg-password">Password</label>
                <input type="password" id="reg-password" placeholder="Minimal 8 karakter" required>
            </div>
            
            <div class="login-form-group">
                <label for="reg-confirm-password">Konfirmasi Password</label>
                <input type="password" id="reg-confirm-password" placeholder="Ulangi password" required>
            </div>
            
            <div class="terms-agreement">
                <input type="checkbox" id="terms" required>
                <label for="terms">
                    Saya setuju dengan Syarat & Ketentuan
                </label>
            </div>
            
            <button type="submit" class="btn-search">
                <i class="fas fa-user-plus"></i> DAFTAR SEKARANG
            </button>
            
            <div class="back-to-login">
                Sudah punya akun? 
                <a href="#" id="back-to-login">Masuk di sini</a>
            </div>
        </form>
    `;
    
    // Setup back to login link
    document.getElementById('back-to-login').addEventListener('click', function(e) {
        e.preventDefault();
        location.reload();
    });
    
    // Setup registration form submission
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = document.getElementById('reg-password')?.value;
        const confirmPassword = document.getElementById('reg-confirm-password')?.value;
        
        if (password !== confirmPassword) {
            alert('Password dan konfirmasi password tidak cocok!');
            return;
        }
        
        if (password.length < 8) {
            alert('Password minimal 8 karakter!');
            return;
        }
        
        // Simulate registration
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> MEMPROSES...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Pendaftaran berhasil! Silakan login.');
            location.reload();
        }, 1500);
    });
}

// ============================================
// FUNGSI UTILITY
// ============================================

function getStatusText(status) {
    const statusMap = {
        'completed': 'Selesai',
        'upcoming': 'Akan Datang',
        'cancelled': 'Dibatalkan'
    };
    return statusMap[status] || status;
}

function calculateDuration(start, end) {
    // Simple calculation for demo
    const startHour = parseInt(start.split(':')[0]);
    const endHour = parseInt(end.split(':')[0]);
    let duration = endHour - startHour;
    
    if (duration < 0) duration += 24;
    
    return `${duration} jam`;
}

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
}

// ============================================
// FUNGSI GLOBAL UNTUK INTERAKSI
// ============================================

// Fungsi untuk menambahkan data contoh (bisa dipanggil dari console)
window.addSampleHistoryData = function() {
    DataStorage.addSampleData();
    alert('Data contoh kereta telah ditambahkan ke history!');
    location.reload();
};

// Fungsi untuk menghapus semua data
window.clearAllData = function() {
    if (confirm('Apakah Anda yakin ingin menghapus semua data?')) {
        DataStorage.clearAllData();
        alert('Semua data telah dihapus!');
        location.reload();
    }
};

// Fungsi untuk melihat detail booking
window.viewDetail = function(id) {
    const history = DataStorage.getHistory();
    const item = history.find(item => item.id == id);
    
    if (item) {
        alert(`DETAIL PEMESANAN\n
No. Pesanan: ${item.orderNumber}
Kereta: ${item.trainName}
Rute: ${item.from} → ${item.to}
Tanggal: ${formatDate(item.date)}
Jam: ${item.departure} - ${item.arrival}
Kelas: ${item.class}
Penumpang: ${item.passengers} orang
Harga: Rp ${item.price.toLocaleString()}
Status: ${getStatusText(item.status)}`);
    }
};

// Fungsi untuk membatalkan booking
window.cancelBooking = function(id) {
    if (confirm('Apakah Anda yakin ingin membatalkan booking ini?')) {
        DataStorage.updateHistoryStatus(id, 'cancelled');
        alert('Booking kereta berhasil dibatalkan!');
        location.reload();
    }
};

// Fungsi untuk booking kereta
window.bookTrain = function(trainId) {
    const train = SAMPLE_TRAINS.find(t => t.id === trainId);
    
    if (!train) {
        alert('Kereta tidak ditemukan!');
        return;
    }
    
    // Create history item for train booking
    const trainBooking = {
        type: 'train',
        status: 'upcoming',
        trainName: train.name,
        from: train.from,
        to: train.to,
        departure: train.departure,
        arrival: train.arrival,
        duration: train.duration,
        date: document.getElementById('departure-date-detail')?.value || new Date().toISOString().split('T')[0],
        orderNumber: `TK-${Date.now()}`,
        price: train.price,
        passengers: document.getElementById('passenger-count-detail')?.value || 1,
        class: train.class
    };
    
    DataStorage.addHistoryItem(trainBooking);
    alert(`Kereta ${train.name} berhasil dipesan!\nNo. Pesanan: ${trainBooking.orderNumber}\nSilakan cek di halaman Riwayat.`);
};

// Fungsi untuk debug: lihat data di localStorage
window.showStorageData = function() {
    console.log('=== DATA DI LOCALSTORAGE ===');
    console.log('History:', DataStorage.getHistory());
    console.log('Profile:', DataStorage.getProfile());
    console.log('Statistics:', DataStorage.getStatistics());
    alert('Data ditampilkan di console (F12)');
};

// Fungsi untuk export data ke JSON
window.exportData = function() {
    const data = {
        history: DataStorage.getHistory(),
        profile: DataStorage.getProfile(),
        exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `tiketkereta-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    alert('Data berhasil diexport!');
};