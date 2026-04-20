const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../")));

// Helper: read JSON data file
function readData(filename) {
  const filePath = path.join(__dirname, '../data', filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

// Helper: write JSON data file
function writeData(filename, data) {
  const filePath = path.join(__dirname, '../data', filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ─── API ROUTES ───────────────────────────────────────────────

// GET /api/menu
app.get('/api/menu', (req, res) => {
  try {
    const menu = readData('menu.json');
    res.json({ success: true, data: menu });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load menu.' });
  }
});

// GET /api/reviews
app.get('/api/reviews', (req, res) => {
  try {
    const reviews = readData('reviews.json');
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load reviews.' });
  }
});

// POST /api/reservation
app.post('/api/reservation', (req, res) => {
  try {
    const { name, phone, email, date, time, guests, notes } = req.body;

    // Validation
    const errors = [];
    if (!name || name.trim().length < 2) errors.push('Valid name is required.');
    if (!phone || !/^[\d\s\+\-\(\)]{7,15}$/.test(phone)) errors.push('Valid phone number is required.');
    if (!date) errors.push('Date is required.');
    if (!time) errors.push('Time is required.');
    if (!guests || guests < 1 || guests > 20) errors.push('Guest count must be between 1 and 20.');

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const reservations = readData('reservations.json');
    const newReservation = {
      id: Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : null,
      date,
      time,
      guests: parseInt(guests),
      notes: notes ? notes.trim() : null,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    reservations.push(newReservation);
    writeData('reservations.json', reservations);

    res.status(201).json({
      success: true,
      message: 'Reservation submitted successfully! We will confirm shortly.',
      reservation: newReservation
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// GET /api/reservations (admin-style listing)
app.get('/api/reservations', (req, res) => {
  try {
    const reservations = readData('reservations.json');
    res.json({ success: true, data: reservations, count: reservations.length });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load reservations.' });
  }
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🍽️  Тохь Ресторан server running at http://localhost:${PORT}\n`);
});
