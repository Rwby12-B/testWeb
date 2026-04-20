# 🍽️ Тохь Ресторан — Fullstack Website

A modern, professional fullstack restaurant website for **Тохь Ресторан**, a family restaurant in Darkhan, Mongolia.

---

## 📁 Project Structure

```
tokh-restaurant/
├── public/              ← Frontend (served statically)
│   ├── index.html       ← Main HTML page
│   ├── css/
│   │   └── style.css    ← All styles (dark premium theme)
│   └── js/
│       └── app.js       ← Frontend JS (API calls, interactivity)
│
├── server/
│   └── index.js         ← Express backend server
│
├── data/
│   ├── menu.json        ← Menu items data
│   ├── reviews.json     ← Customer reviews data
│   └── reservations.json← Submitted reservations (auto-updated)
│
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v16 or newer
- **npm** v7 or newer

### Installation

```bash
# 1. Navigate to the project folder
cd tokh-restaurant

# 2. Install dependencies
npm install

# 3. Start the server
npm start
```

Open your browser and go to: **http://localhost:3000**

For development with auto-reload:
```bash
npm run dev
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/menu` | Returns all menu items |
| `GET`  | `/api/reviews` | Returns all customer reviews |
| `POST` | `/api/reservation` | Submit a new reservation |
| `GET`  | `/api/reservations` | List all reservations (admin) |

### POST /api/reservation — Request Body
```json
{
  "name": "Болд Дорж",
  "phone": "+976 9900 0000",
  "email": "bold@example.com",
  "date": "2024-12-25",
  "time": "22:00",
  "guests": 4,
  "notes": "Window seat preferred"
}
```

### POST /api/reservation — Success Response
```json
{
  "success": true,
  "message": "Reservation submitted successfully! We will confirm shortly.",
  "reservation": {
    "id": 1703000000000,
    "name": "Болд Дорж",
    "phone": "+976 9900 0000",
    "date": "2024-12-25",
    "time": "22:00",
    "guests": 4,
    "status": "pending",
    "createdAt": "2024-12-20T10:00:00.000Z"
  }
}
```

---

## 🎨 Design Highlights

- **Dark premium theme** with warm gold accents
- **Cormorant Garamond** serif display font + **Outfit** sans-serif
- Smooth CSS animations and hover effects
- Fully responsive (mobile-first)
- Section-based layout: Hero → Menu → About → Reviews → Reservation → Contact

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (custom properties), Vanilla JS (ES2020+)
- **Backend**: Node.js + Express.js
- **Data Storage**: JSON flat files (no database needed)
- **Maps**: Google Maps Embed API

---

## 📞 Business Info

- **Name**: Тохь Ресторан
- **Location**: FX87+FC4, Darkhan, Darkhan-Uul, Mongolia
- **Rating**: ⭐ 4.4 (71 reviews)
- **Hours**: 22:00 – 02:00 daily
- **Services**: Dine-in ✅ | Takeaway ✅
