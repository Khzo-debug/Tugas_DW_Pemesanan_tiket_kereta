const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const db = new sqlite3.Database('./tiket_kereta.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// API Routes

// Get all train stations
app.get('/api/stations', (req, res) => {
    db.all('SELECT * FROM train_stations ORDER BY station_name', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get all trains
app.get('/api/trains', (req, res) => {
    db.all('SELECT * FROM trains WHERE status = "ACTIVE" ORDER BY train_name', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get train schedules
app.get('/api/schedules', (req, res) => {
    const { from, to, date } = req.query;

    let query = `
        SELECT ts.*, t.train_name, t.class, t.base_price,
               fs.station_name as from_station_name, fs.city as from_city,
               ts2.station_name as to_station_name, ts2.city as to_city
        FROM train_schedules ts
        JOIN trains t ON ts.train_id = t.train_id
        JOIN train_stations fs ON ts.from_station_id = fs.station_id
        JOIN train_stations ts2 ON ts.to_station_id = ts2.station_id
        WHERE ts.status = 'ACTIVE'
    `;

    const params = [];

    if (from) {
        query += ' AND fs.station_name LIKE ?';
        params.push(`%${from}%`);
    }

    if (to) {
        query += ' AND ts2.station_name LIKE ?';
        params.push(`%${to}%`);
    }

    query += ' ORDER BY ts.departure_time';

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get user profile
app.get('/api/users/:userId', (req, res) => {
    const { userId } = req.params;

    db.get('SELECT * FROM users WHERE user_id = ?', [userId], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(row);
    });
});

// Create booking
app.post('/api/bookings', (req, res) => {
    const {
        user_id,
        schedule_id,
        departure_date,
        adult_passengers,
        child_passengers,
        total_passengers,
        total_price,
        passengers
    } = req.body;

    // Generate booking number
    const bookingNumber = `TK-${Date.now()}`;

    const sql = `
        INSERT INTO bookings (
            user_id, booking_number, schedule_id, departure_date,
            adult_passengers, child_passengers, total_passengers,
            total_price, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `;

    db.run(sql, [
        user_id, bookingNumber, schedule_id, departure_date,
        adult_passengers || 1, child_passengers || 0, total_passengers,
        total_price
    ], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        const bookingId = this.lastID;

        // Insert passengers if provided
        if (passengers && passengers.length > 0) {
            const passengerSql = `
                INSERT INTO passengers (
                    booking_id, full_name, identity_number, identity_type,
                    passenger_type, created_at
                ) VALUES (?, ?, ?, ?, ?, datetime('now'))
            `;

            const stmt = db.prepare(passengerSql);
            passengers.forEach(passenger => {
                stmt.run([
                    bookingId,
                    passenger.full_name,
                    passenger.identity_number,
                    passenger.identity_type || 'KTP',
                    passenger.passenger_type || 'ADULT'
                ]);
            });
            stmt.finalize();
        }

        res.json({
            booking_id: bookingId,
            booking_number: bookingNumber,
            message: 'Booking created successfully'
        });
    });
});

// Get user bookings
app.get('/api/bookings/:userId', (req, res) => {
    const { userId } = req.params;

    const sql = `
        SELECT b.*, ts.departure_time, ts.arrival_time,
               fs.station_name as from_station, ts2.station_name as to_station,
               t.train_name, t.class
        FROM bookings b
        JOIN train_schedules ts ON b.schedule_id = ts.schedule_id
        JOIN train_stations fs ON ts.from_station_id = fs.station_id
        JOIN train_stations ts2 ON ts.to_station_id = ts2.station_id
        JOIN trains t ON ts.train_id = t.train_id
        WHERE b.user_id = ?
        ORDER BY b.created_at DESC
    `;

    db.all(sql, [userId], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Update booking status
app.put('/api/bookings/:bookingId/status', (req, res) => {
    const { bookingId } = req.params;
    const { status } = req.body;

    db.run(
        'UPDATE bookings SET booking_status = ?, updated_at = datetime("now") WHERE booking_id = ?',
        [status, bookingId],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (this.changes === 0) {
                res.status(404).json({ error: 'Booking not found' });
                return;
            }
            res.json({ message: 'Booking status updated successfully' });
        }
    );
});

// User authentication (simplified)
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    db.get(
        'SELECT * FROM users WHERE email = ? AND password_hash = ?',
        [email, password],
        (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            if (!row) {
                res.status(401).json({ error: 'Invalid credentials' });
                return;
            }
            res.json({
                user_id: row.user_id,
                first_name: row.first_name,
                last_name: row.last_name,
                email: row.email,
                membership_level: row.membership_level
            });
        }
    );
});

// User registration
app.post('/api/auth/register', (req, res) => {
    const {
        first_name,
        last_name,
        email,
        password_hash,
        phone,
        birthdate,
        address
    } = req.body;

    // Check if email already exists
    db.get('SELECT user_id FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.status(400).json({ error: 'Email already exists' });
            return;
        }

        // Insert new user
        const sql = `
            INSERT INTO users (
                first_name, last_name, email, password_hash,
                phone, birthdate, address, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `;

        db.run(sql, [
            first_name, last_name, email, password_hash,
            phone, birthdate, address
        ], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

            res.json({
                user_id: this.lastID,
                message: 'User registered successfully'
            });
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});
