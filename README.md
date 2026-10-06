# Typeform Clone — Full-Stack Conversational Form Platform

An exact, production-grade clone of **Typeform** built with **Next.js (TypeScript)**, **FastAPI (Python)**, and **SQLite**. Recreates Typeform's signature design language, the fluid one-question-at-a-time conversational respondent flow, an interactive 3-panel drag-and-drop form builder, live responses analytics, and CSV export.

---

## 🌟 Key Features

### 1. The Signature Typeform Respondent Experience (`/to/:slug`)
- **Fluid Keyboard Navigation**:
  - `Enter ↵`: Advance to next question or submit.
  - `Shift + Enter ↵`: Multiline answers in long text fields.
  - `▲` / `▼` (Up / Down Arrow keys): Seamless back/forth navigation.
  - Choice shortcuts: Pressing physical keyboard keys `A`, `B`, `C`... highlights the option and **auto-advances** to the next question.
  - Yes/No: Pressing `Y` or `N` selects and auto-advances.
  - Rating: Pressing `1` through `5` (or `10`) selects rating and auto-advances.
- **Framer Motion Animations**:
  - Vertical sliding transitions between questions.
  - Responsive shake animation (`-10px`, `+10px`, `0`) with a coral badge on invalid or missing required questions.
  - Celebration confetti blast upon completion.
- **Progress Tracking**: Pinned progress percentage bar + step counter (`1 of 6`).
- **No Auth Required**: Real shareable link for public respondents.

### 2. Form Builder (`/forms/:id/builder`)
- **3-Panel Layout**:
  - **Left Panel (Questions List)**: Drag-and-drop handles (`GripVertical`), up/down reordering controls, question type icons, and `+ Add Question` modal.
  - **Center Canvas (Live WYSIWYG)**: Live interactive preview of the question; click title or description to edit inline with real-time auto-sync.
  - **Right Panel (Inspector)**: Required toggle, choice options manager (add, rename, remove options), rating step scale (5 vs 10), and custom placeholders.
- **8 Question Types**: Short Text, Long Text, Multiple Choice, Dropdown, Email, Number, Yes/No, and Rating (Star/Numbers).

### 3. Form Management Dashboard (`/forms`)
- List and card views of creator forms with search filtering.
- Status badges: **Published** (green dot) vs **Draft** (gray dot).
- Response count and question count counters.
- Actions: **Create**, **Inline Rename**, **Duplicate**, **Copy Share Link**, and **Delete**.
- Draft guard: Unpublished forms cannot be accessed by public respondents.

### 4. Responses & Analytics (`/forms/:id/results`)
- **Summary Insights**:
  - Total responses, completion rate (%), and average duration (seconds).
  - Choice distribution percentage bars for Multiple Choice, Dropdown, and Yes/No questions.
  - Average rating cards with star breakdowns.
  - Sample qualitative answer lists for text questions.
- **Submissions Table**:
  - Searchable data table with timestamps and answered values.
  - Slide-in individual submission drawer modal.
  - **1-Click "Download CSV"** generating a formatted spreadsheet file.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15 (App Router, TypeScript) | Blazing fast client routing, type safety, modular architecture |
| **Styling** | Tailwind CSS + Lucide Icons | Clean recreation of Typeform's minimalist palette (`#191919`, `#0445FE`) |
| **Animation** | Framer Motion & Canvas Confetti | Smooth spring physics, question slide transitions, confetti |
| **Backend** | Python 3.11 + FastAPI + Pydantic v2 | High-performance async REST APIs, automatic OpenAPI Swagger docs (`/docs`) |
| **Database** | SQLite + SQLAlchemy 2.0 | Clean relational schema with foreign keys and cascade deletes |

---

## 🗄️ Database Schema Design

```
+--------------------+       +--------------------+
|       FORMS        |       |     QUESTIONS      |
+--------------------+       +--------------------+
| id (UUID, PK)      |1     *| id (UUID, PK)      |
| title (VARCHAR)    |-------| form_id (UUID, FK) |
| description (TEXT) |       | type (VARCHAR)     |
| slug (VARCHAR, UQ) |       | title (TEXT)       |
| is_published (BOOL)|       | description (TEXT) |
| theme_config (JSON)|       | is_required (BOOL) |
| created_at (DATETIME)      | order_index (INT)  |
| updated_at (DATETIME)      | options_json (JSON)|
+--------------------+       | properties_json    |
          |1                 +--------------------+
          |                            |1
          |*                           |*
+--------------------+       +--------------------+
|     RESPONSES      |       |      ANSWERS       |
+--------------------+       +--------------------+
| id (UUID, PK)      |1     *| id (UUID, PK)      |
| form_id (UUID, FK) |-------| response_id (FK)   |
| submitted_at (DATE)|       | question_id (FK)   |
| time_spent_sec(INT)|       | value (TEXT)       |
| metadata_json      |       +--------------------+
+--------------------+
```

- **Cascading Deletions**: Deleting a form automatically deletes associated questions, responses, and answer records without orphaned records.
- **Indexed Order**: `questions.order_index` is indexed for fast reordering.

---

## 🚀 Quickstart & Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+ and pip

### 1. Backend Setup

```bash
cd backend

# (Optional) Create virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed the database with realistic sample forms & responses
python seed.py

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

The backend will start at `http://localhost:8000`.  
- Interactive API documentation (Swagger UI): `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/health`

### 2. Frontend Setup

In a separate terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

Open `http://localhost:3000` in your browser. You will be redirected to the Form Workspace Dashboard.

---

## 🧪 Pre-Seeded Sample Data

Running `python seed.py` automatically initializes 3 forms with rich data:
1. **"Customer Feedback & NPS Survey"** (`/to/customer-feedback-survey`):
   - Status: **Published**
   - Mixed types: Rating, Multiple Choice, Yes/No, Dropdown, Long Text, Email.
   - Pre-loaded with **12 realistic submissions** to immediately demonstrate the analytics dashboard and CSV export.
2. **"Senior Full-Stack Engineer Application"** (`/to/senior-fullstack-engineer`):
   - Status: **Published**
   - Mixed types: Short Text, Email, Number, Multiple Choice, Rating.
   - Pre-loaded with **8 applicant submissions**.
3. **"Q2 Employee Engagement Pulse Check"** (`/to/q2-employee-pulse-check`):
   - Status: **Draft** (proves draft protection and publish toggles).

---

## 📡 REST API Reference Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/forms` | List all forms with question & response counters |
| `POST` | `/api/forms` | Create a new form |
| `GET` | `/api/forms/{id}` | Retrieve full form definition and ordered questions |
| `PATCH` | `/api/forms/{id}` | Update title, description, or published status |
| `POST` | `/api/forms/{id}/duplicate` | Duplicate form and all questions |
| `DELETE` | `/api/forms/{id}` | Delete form (cascades to questions & responses) |
| `POST` | `/api/forms/{id}/questions` | Add new question |
| `PATCH` | `/api/forms/{id}/questions/{q_id}` | Update question title, required flag, or choices |
| `DELETE` | `/api/forms/{id}/questions/{q_id}` | Remove question and re-index list |
| `POST` | `/api/forms/{id}/questions/reorder` | Update question ordering (Drag and Drop) |
| `GET` | `/api/public/forms/{slug}` | Public endpoint to retrieve published form |
| `POST` | `/api/public/forms/{slug}/submit` | Public endpoint to submit respondent answers |
| `GET` | `/api/forms/{id}/responses` | List all submissions for a form |
| `GET` | `/api/forms/{id}/analytics` | Aggregated insights, metrics, and distributions |
| `GET` | `/api/forms/{id}/export/csv` | Download responses as CSV file |

---

## 🚢 Deployment Guide

### Backend (Render / Railway)
1. Push repository to GitHub.
2. In Render or Railway, create a new **Web Service** with root directory set to `backend`.
3. Set Build Command: `pip install -r requirements.txt && python seed.py`
4. Set Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel)
1. In Vercel, import the repository and set Root Directory to `frontend`.
2. Framework Preset: **Next.js**.
3. Environment Variable:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL (e.g., `https://typeform-backend.onrender.com`).
4. Click **Deploy**.
