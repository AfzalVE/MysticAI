# MysticAI - Technical Documentation

MysticAI is a full-stack web application that combines modern, aesthetic frontend design with a robust, AI-powered backend to deliver personalized spiritual and astrological readings.

---

## 1. Technology Stack

### Frontend
- **Framework**: React 18 (Bootstrapped with Vite)
- **Routing**: React Router DOM (v6)
- **Styling**: Vanilla CSS with Tailwind CSS for utility classes and responsive design.
- **State Management**: Zustand (for lightweight global Authentication state).
- **Icons**: Lucide React.
- **Animations**: Custom CSS keyframes and glassmorphism UI components.

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB (Atlas) via `motor` (Asynchronous MongoDB driver).
- **Authentication**: JWT (JSON Web Tokens) with `passlib` (bcrypt) for password hashing.
- **AI Integration**: OpenAI SDK / Google Generative AI (configured via `ai_service.py`).
- **Validation**: Pydantic v2 (Schemas and Environment variable validation).

---

## 2. Project Architecture

### Frontend Structure (`/frontend`)
```text
src/
├── components/
│   ├── animations/     # Cosmic backgrounds, stars, floating elements
│   ├── layout/         # Navbar, ProtectedRoute, AdminRoute, AdminLayout
│   └── ui/             # Reusable UI elements (cards, buttons)
├── pages/
│   ├── admin/          # Admin Dashboard, AdminLogin, AdminBookings, etc.
│   ├── Home.jsx        # Landing page
│   ├── Login.jsx       # User authentication
│   ├── Dashboard.jsx   # User profile and history
│   ├── FortuneTelling  # AI Fortune generation
│   ├── TarotReading    # Interactive Tarot card drawing
│   └── AIChat.jsx      # ChatGPT-style persistent chat interface
├── store/
│   └── authStore.js    # Zustand store for JWT token management
├── App.jsx             # Main router configuration
└── index.css           # Global styles and Tailwind imports
```

### Backend Structure (`/backend`)
```text
app/
├── api/                # API Routers
│   ├── auth.py         # Login, Registration
│   ├── user.py         # Profile fetching, user-specific history
│   ├── admin.py        # Secured endpoints for platform data aggregation
│   ├── chat.py         # Chat session management and AI response generation
│   ├── fortune.py      # Fortune telling endpoints
│   └── tarot.py        # Tarot card drawing and interpretation
├── core/
│   ├── config.py       # Pydantic BaseSettings for .env variables
│   ├── database.py     # Motor MongoDB connection manager
│   └── security.py     # JWT token generation and bcrypt hashing
├── models/             # Pydantic validation schemas (User, Booking, Reading, Chat)
├── services/
│   └── ai_service.py   # Wrapper for connecting to LLM providers
└── main.py             # FastAPI application entry point and CORS configuration
```

---

## 3. Database Schema (MongoDB)

MysticAI uses a NoSQL document structure with four primary collections:

1. **`users`**: 
   - Stores `name`, `email`, `hashed_password`, `dob`, `time_of_birth`, `birth_place`, and `is_admin` boolean.
2. **`readings`**: 
   - Stores generated Fortunes and Tarot readings.
   - Fields: `user_id` (string reference), `type` (fortune/tarot), `data` (JSON object of the reading), `created_at`.
3. **`chat_sessions`**: 
   - Stores persistent ChatGPT-style conversations.
   - Fields: `user_id`, `title` (auto-generated from first prompt), `messages` (array of role/content objects), `updated_at`.
4. **`bookings`**: 
   - Stores user consultation requests.
   - Fields: `user_id`, `consultation_type`, `date`, `time`, `details`, `status`.

---

## 4. Authentication Flow

1. **User Login**: Frontend sends credentials to `POST /api/auth/login`. Backend verifies with bcrypt and returns a short-lived JWT Access Token.
2. **State Management**: Token is stored in `localStorage` and managed globally via Zustand (`authStore.js`).
3. **Protected Routes**: React components wrapped in `<ProtectedRoute>` verify the existence of the token before rendering.
4. **Admin Routes**: Components wrapped in `<AdminRoute>` make an API call to `/api/user/profile` on mount. If `is_admin` is false, the user is forcefully redirected. Backend `/api/admin/*` routes also strictly require the `is_admin` flag via FastAPI dependencies.

---

## 5. AI Integration Flow

The `ai_service.py` handles all communication with Large Language Models.
1. When a user requests a Fortune or Tarot reading, the frontend hits the respective backend router.
2. The router constructs a highly specific, systemic prompt (e.g., "Act as a mystic tarot reader...") combining the user's details and choices.
3. The prompt is passed to `generate_mystic_response()` in `ai_service.py`.
4. The generated markdown response is returned to the frontend and simultaneously saved to the user's `readings` collection in the database.
