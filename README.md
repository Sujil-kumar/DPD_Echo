#  DPD Echo – Lightweight Feedback System

**Seamless Feedback. Zero Friction.**

DPD Echo is a simple and secure web application to facilitate structured feedback sharing between **managers** and **employees** inside a company.

Built using **React** (frontend), **Flask (Python)** (backend), and **SQLite** (database).

---

##  Live Demo (if available)

-  **Demo Video (Product UI)**: [YouTube/Loom Link](#)
-  **Code Walkthrough (Codebase Explanation)**: [YouTube/Loom Link](#)
-  **GitHub Repository**: [GitHub Link](#)

---

##  Tech Stack

| Layer       | Technology        |
|-------------|-------------------|
| Frontend    | React + Bootstrap |
| Backend     | Flask (Python)    |
| Database    | SQLite            |
| Deployment  | Docker (Backend)  |

---

##  Project Features

### Core Features (MVP)

-  **Login System**
  - Two roles: **Manager** and **Employee**
  - Auth is mocked (no sign-up, uses pre-seeded data)

-  **Manager Dashboard**
  - View team members
  - Submit feedback: strengths, improvements, sentiment
  - View/edit past feedback
  - View sentiment pie chart & feedback count

-  **Employee Dashboard**
  - View feedback timeline
  - Acknowledge feedback

---

##  Folder Structure

```
LIGHTWEIGHTFEEDBACKSYSTEM
├── backend/                 # Flask backend
│   ├── app.py
│   ├── routes.py
│   ├── models.py
│   ├── seed_users.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/
│   │   │   └── dpdzero.png
│   │   ├── components/
│   │   │   ├── EditFeedback.js
│   │   │   ├── Employee.js
│   │   │   ├── GiveFeedback.js
│   │   │   ├── Header.js
│   │   │   ├── Layout.js
│   │   │   ├── LoginPage.js
│   │   │   ├── ManagerPage.js
│   │   │   ├── SentimentChart.js
│   │   │   └── ViewFeedback.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── package-lock.json
│   └── .gitignore
├── README.md
```
---

## Local Setup

### Backend (Flask)

#### Option 1: Without Docker

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python seed_db.py         # seeds users (manager & employees)
python app.py
```

Backend will run on `http://localhost:5000`

#### Option 2: With Docker

```bash
cd backend
docker build -t feedback-backend .
docker run -p 5000:5000 feedback-backend
```

---

### Frontend (React)

```bash
cd frontend
npm install
npm start
```

Frontend runs at `http://localhost:3000`

---

## User Roles

###  Manager (Seeded)
```json
{
  "email": "manager@example.com",
  "password": "manager123"
}
```

### Employees (Seeded)
- `employee1@example.com` / `employee123`
- `employee2@example.com` / `employee123`

---

##  Sentiment Pie Chart

- Pie chart shown in manager dashboard (e.g., 50% Positive, 30% Neutral)
- Generated dynamically based on feedback data

---

##  Dockerfile (Backend)

Included in `backend/Dockerfile`

```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
EXPOSE 5000
CMD ["python", "app.py"]
```

---

##  Notes

- The login is mocked using pre-defined users. No sign-up page exists.
- Demo recorded using direct Flask execution (not Docker) for ease of recording.
- If deployed, public URL will be added here.

---

## Submission Details

- Code pushed to GitHub
- Video demo uploaded
- Code walkthrough video uploaded
- Dockerfile included
- README complete ✅

---

## Design Decisions

- Used **Bootstrap** for quick UI setup
- Used **SQLite** for simple local DB setup
- Kept roles separate with strict access control on both frontend & backend

---

## AI Usage Disclosure

Some code structure (e.g., initial component setup and DB models) was generated with help from AI tools like ChatGPT. All code was reviewed, customized, and tested manually.

---

## Contact

Built by Sujilkumar 