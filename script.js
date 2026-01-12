// Constants and Data

const STORAGE_KEYS = {
  HISTORY: 'train_history',
  PROFILE: 'user_profile',
  LAST_SEARCH: 'last_search',
  CURRENT_USER: 'current_user'
};

const TRAIN_STATIONS = [
  { name: "Gambir", city: "Jakarta", code: "GMR" },
  { name: "Bandung", city: "Bandung", code: "BD" },
  { name: "Surabaya Gubeng", city: "Surabaya", code: "SGU" },
  { name: "Yogyakarta", city: "Yogyakarta", code: "YK" },
  { name: "Malang", city: "Malang", code: "ML" },
  { name: "Semarang Tawang", city: "Semarang", code: "SMT" },
  { name: "Solo Balapan", city: "Solo", code: "SLO" },
  { name: "Cirebon", city: "Cirebon", code: "CN" }
];

const SAMPLE_TRAINS = [
  {
    id: 1,
    name: 'Argo Bromo Anggrek',
    class: 'Eksekutif',
    price: 450000,
    from: 'Gambir (GMR)',
    to: 'Surabaya Gubeng (SGU)',
    departure: '08:00',
    arrival: '15:30',
    duration: '7 jam 30 menit',
    seats: 45
  },
  {
    id: 2,
    name: 'Taksaka',
    class: 'Eksekutif',
    price: 350000,
    from: 'Gambir (GMR)',
    to: 'Yogyakarta (YK)',
    departure: '10:30',
    arrival: '16:45',
    duration: '6 jam 15 menit',
    seats: 38
  },
  {
    id: 3,
    name: 'Sembrani',
    class: 'Bisnis',
    price: 280000,
    from: 'Gambir (GMR)',
    to: 'Surabaya Gubeng (SGU)',
    departure: '21:00',
    arrival: '05:30',
    duration: '8 jam 30 menit',
    seats: 52
  },
  {
    id: 4,
    name: 'Gajayana',
    class: 'Ekonomi',
    price: 150000,
    from: 'Gambir (GMR)',
    to: 'Malang (ML)',
    departure: '14:00',
    arrival: '22:15',
    duration: '8 jam 15 menit',
    seats: 68
  }
];

/* 2. STORAGE HANDLER */

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

  static getProfile() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILE)) || {};
  }

  static updateProfile(data) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(data));
  }

  static getStatistics() {
    const history = this.getHistory();
    return {
      trainCount: history.length,
      upcomingCount: history.filter(h => h.status === 'upcoming').length,
      totalSpent: history.reduce((s, h) => s + (h.price || 0), 0)
    };
  }
}

// Initialization

document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  initCommonUI();
  routePage();
});

/* 4. ROUTER */

function routePage() {
  const page = location.pathname.split('/').pop();

  if (page.includes('history')) initHistoryPage();
  else if (page.includes('profile')) initProfilePage();
  else if (page.includes('train-search')) initTrainSearchPage();
  else if (page.includes('login')) initLoginPage();
  else initLandingPage();
}

/* 5. COMMON UI */

function initCommonUI() {
  initDateInputs();
  setupStationAutocomplete();
}

function initDateInputs() {
  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(i => {
    i.min = today;
  });
}

/* 6. AUTOCOMPLETE */

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

/* 7. LANDING PAGE */

function initLandingPage() {
  const form = document.getElementById('train-search-form');
  if (!form) return;

  form.onsubmit = e => {
    e.preventDefault();
    localStorage.setItem(
      STORAGE_KEYS.LAST_SEARCH,
      JSON.stringify({
        from: document.getElementById('from-station').value,
        to: document.getElementById('to-station').value,
        date: document.getElementById('departure-date').value
      })
    );
    location.href = 'train-search.html';
  };
}

/* 8. TRAIN SEARCH */

function initTrainSearchPage() {
  const last = JSON.parse(localStorage.getItem(STORAGE_KEYS.LAST_SEARCH) || '{}');
  if (last.from) document.getElementById('from-station-detail').value = last.from;
  if (last.to) document.getElementById('to-station-detail').value = last.to;

  document.getElementById('train-search-form-detail').onsubmit = e => {
    e.preventDefault();
    showTrainResults();
  };
}

function showTrainResults() {
  const from = document.getElementById('from-station-detail').value.toLowerCase();
  const to = document.getElementById('to-station-detail').value.toLowerCase();
  const container = document.getElementById('train-results-container');
  container.innerHTML = '';

  SAMPLE_TRAINS.filter(t =>
    t.from.toLowerCase().includes(from) &&
    t.to.toLowerCase().includes(to)
  ).forEach(t => {
    const card = document.createElement('div');
    card.className = 'train-result-card';
    card.innerHTML = `
      <h3>${t.name}</h3>
      <p>${t.from} → ${t.to}</p>
      <p>${t.departure} - ${t.arrival}</p>
      <strong>Rp ${t.price.toLocaleString()}</strong>
      <button onclick="bookTrain(${t.id})">PILIH</button>
    `;
    container.appendChild(card);
  });
}

/* 9. BOOKING */

window.bookTrain = function (id) {
  const t = SAMPLE_TRAINS.find(x => x.id === id);
  if (!t) return;

  DataStorage.addHistoryItem({
    type: 'train',
    status: 'upcoming',
    trainName: t.name,
    from: t.from,
    to: t.to,
    departure: t.departure,
    arrival: t.arrival,
    duration: t.duration,
    date: new Date().toISOString().split('T')[0],
    orderNumber: 'TK-' + Date.now(),
    price: t.price,
    passengers: 1,
    class: t.class
  });

  alert('Booking berhasil!');
  location.href = 'history.html';
};

/* 10. HISTORY PAGE */

function initHistoryPage() {
  const container = document.getElementById('history-container');
  if (!container) return;

  const history = DataStorage.getHistory();
  container.innerHTML = history.length
    ? history.map(h => `
      <div class="history-item">
        <strong>${h.trainName}</strong>
        <div>${h.from} → ${h.to}</div>
        <div>Status: ${h.status}</div>
      </div>
    `).join('')
    : '<p>Tidak ada riwayat</p>';
}

/* 11. PROFILE PAGE */

function initProfilePage() {
  const profile = DataStorage.getProfile();
  Object.keys(profile).forEach(k => {
    const el = document.getElementById(k);
    if (el) el.value = profile[k];
  });

  document.getElementById('profile-form').onsubmit = e => {
    e.preventDefault();
    DataStorage.updateProfile({
      firstName: document.getElementById('first-name').value,
      lastName: document.getElementById('last-name').value,
      email: document.getElementById('email').value
    });
    alert('Profil disimpan');
  };
}

/* 12. LOGIN */

function initLoginPage() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.onsubmit = e => {
    e.preventDefault();
    location.href = 'profile.html';
  };
}

/*  13. STORAGE INIT */

function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.HISTORY))
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([]));

  if (!localStorage.getItem(STORAGE_KEYS.PROFILE))
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify({}));
}