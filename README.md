# 🔮 OracleVerse AI

An AI-powered Fortune Telling, Tarot Reading, and Consultation Booking Platform built with **React (Vite)** and **FastAPI**.

OracleVerse provides users with personalized astrological insights, AI-powered tarot interpretations, an intelligent spiritual chatbot, and secure online consultation booking.

---

# Features

## User Features

- User Registration & Login
- Personalized Fortune Reading
- Tarot Card Reading
- AI Spiritual Chatbot
- Save Reading History
- Download Reports (PDF)
- One-on-One Consultation Booking
- Payment Integration
- User Dashboard
- Profile Management

---

## Admin Features

- Dashboard & Analytics
- User Management
- Reading Management
- Booking Management
- Calendar Scheduling
- Payment Tracking
- Service Management
- AI Prompt Management
- Website Content Management

---

# Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Zustand

---

## Backend

- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication
- Pydantic
- Uvicorn

---

## AI

- OpenAI GPT
- Prompt Engineering

---

## Payments

- Stripe
- Razorpay (Optional)

---

## Email

- SMTP / Nodemailer
- Resend (Optional)

---

# Project Structure

```
oracleverse-ai/

│
├── frontend/
│
├── backend/
│
└── README.md
```

---

# Frontend Structure

```
src/

assets/

components/

pages/

hooks/

context/

store/

services/

utils/

routes/

App.jsx

main.jsx
```

---

# Backend Structure

```
app/

api/

models/

schemas/

services/

core/

utils/

main.py
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/oracleverse-ai.git

cd oracleverse-ai
```

---

# Backend Setup

```bash
cd backend
```

Create Virtual Environment

```bash
python -m venv venv
```

Activate

Windows

```bash
venv\Scripts\activate
```

Mac/Linux

```bash
source venv/bin/activate
```

Install Dependencies

```bash
pip install -r requirements.txt
```

Run Backend

```bash
uvicorn app.main:app --reload
```

Backend runs on

```
http://localhost:8000
```

---

# Frontend Setup

```bash
cd frontend
```

Install Packages

```bash
npm install
```

Run

```bash
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# Environment Variables

Backend

```
APP_NAME=OracleVerse AI

SECRET_KEY=

ALGORITHM=HS256

DATABASE_URL=

OPENAI_API_KEY=

STRIPE_SECRET_KEY=
```

Frontend

```
VITE_API_URL=http://localhost:8000
```

---

# Main Modules

- Authentication
- User Dashboard
- Fortune Reading
- Tarot Reading
- AI Chatbot
- Consultation Booking
- Payment Gateway
- Reading History
- Admin Dashboard

---

# API Modules

```
/auth

/users

/fortune

/tarot

/chat

/bookings

/payments

/admin
```

---

# Future Enhancements

- Daily Horoscope Notifications
- Zodiac Compatibility
- Voice Chat
- Video Consultation
- Multi-language Support
- Mobile Application
- Subscription Plans
- AI Memory
- Blog & Articles
- Referral Program

---

# Security

- JWT Authentication
- Password Hashing
- Role-Based Access Control
- HTTPS Ready
- Secure Environment Variables

---

# License

This project is intended for educational and commercial use.

---

# Author

Developed using:

- React
- FastAPI
- PostgreSQL
- OpenAI GPT
