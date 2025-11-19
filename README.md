# EduPay
A scalable MERN-based learning platform with secure authentication, payment integration, role-based access, and course delivery system.

## 📸 Screenshots
Here are recommended screenshot placeholders (replace image paths as needed):

### 🏠 Home / Landing Page
![Landing Page](./screenshots/landing.png)

### 🎓 Student Dashboard
![Student Dashboard](./screenshots/student-dashboard.png)

### 👨‍🏫 Teacher Dashboard
![Teacher Dashboard](./screenshots/teacher-dashboard.png)

### 🛠️ Admin Panel
![Admin Panel](./screenshots/admin-panel.png)

---

## 🏗️ System Architecture Diagram
```
         ┌──────────────────────────┐
         │        Frontend          │
         │  React + Vite + Axios    │
         └─────────────┬────────────┘
                       ↓ HTTP
┌──────────────────────────────────────────────┐
│                 Backend API                  │
│     Node.js + Express + JWT Auth             │
│                                              │
│   ┌──────────────┬──────────────┬─────────┐  │
│   │ Auth Module  │ Course Module│Payment  │  │
│   │              │ Enrollment   │Module   │  │
│   └──────────────┴──────────────┴─────────┘  │
└───────────────────────┬──────────────────────┘
                        ↓
           ┌───────────────────────────┐
           │        MongoDB Atlas      │
           │  Users / Courses / Enroll│
           │  Payments / Transactions │
           └───────────────────────────┘
```

---

## 🛠️ Technologies Used

### **Frontend**
- React.js
- Vite
- React Router
- Axios
- Context API
- Tailwind CSS

### **Backend**
- Node.js
- Express.js
- JWT Authentication
- Bcrypt.js
- Razorpay Payment Gateway
- MongoDB + Mongoose

### **DevOps / Other Tools**
- Thunder Client / Postman
- Git & GitHub
- npm / yarn
- dotenv
- Prettier + ESLint

## 🚀 Features

### **🧩 Backend (Express + MongoDB)**
- JWT Authentication (Login/Register)
- Role‑Based Access Control (Student/Teacher/Admin)
- Course Management (Create, Approve, Update, Delete)
- Enrollment System
- Razorpay Payment Integration
- Automatic Transaction Tracking
- Admin Stats (Students, Teachers, Courses, Revenue)
- Clean Validation + Error Handling

### **🎨 Frontend (React + Vite)**
- Fully aligned API integration
- Admin, Teacher & Student dashboards
- Secure token‑based auth flow
- Live stats, course lists, enrollments, payments
- Razorpay checkout

---

## 🏗️ Project Architecture
```
Frontend (Vite + React)
├── Pages (Admin, Teacher, Student)
├── Components (Reusable)
├── Contexts (Auth State)
└── APIs (Aligned Endpoints)
        ↓ HTTP Requests
Backend (Express + MongoDB)
├── Routes (27 Endpoints)
├── Controllers (Logic + Validation)
├── Models (Schemas)
└── Middleware (Auth + RBAC)
```
---

## Complete API Endpoint Map

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

### Courses
```
GET    /api/courses/approved           (Public - published courses)
GET    /api/courses/:id                (Public - course details)
GET    /api/courses                    (Admin only - all courses)
GET    /api/courses/teacher/my-courses (Teacher only)
POST   /api/courses                    (Teacher only)
PUT    /api/courses/:id                (Teacher only)
DELETE /api/courses/:id                (Teacher only)
PUT    /api/courses/approve/:id        (Admin only)
```

### Enrollments
```
POST   /api/enrollments/enroll/:courseId    (Student)
GET    /api/enrollments/my-courses          (Student)
GET    /api/enrollments/teacher/list        (Teacher)
PUT    /api/enrollments/approve/:id         (Teacher)
GET    /api/enrollments/all                 (Admin)
```

### Payments
```
POST   /api/payments/create-order/:enrollmentId (Student)
POST   /api/payments/verify                     (Student)
GET    /api/payments/teacher                    (Teacher)
GET    /api/payments/all                        (Admin)
```

### Users
```
GET    /api/users             (Admin)
GET    /api/users/:id         (Admin)
PUT    /api/users/me          (Any authenticated user - own profile)
PUT    /api/users/:id         (Admin)
DELETE /api/users/:id         (Admin)
```
All endpoints are fully implemented and tested.

---

## 🗄️ Models
- **User** (student/teacher/admin)
- **Course** (status: pending/approved/rejected)
- **Enrollment** (status + payment status)
- **Transaction** (auto‑created on successful payments)

---

## 🔐 Security Implemented
- JWT Authentication
- Role‑Based Authorization
- Input Validation
- Payment Signature Verification
- Sanitized DB Operations

---

## 💳 Payment Flow
1. Student enrolls in a course
2. Razorpay order is created
3. Payment verified via signature
4. Enrollment activated
5. Transaction record created
6. Teacher earnings updated

---

## 🧪 Local Setup

### **Backend Setup**
```bash
cd backend
npm install
npm start
```
Ensure MongoDB is running.

### **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```
Open in browser:
```
http://localhost:5173
```

---

## 📁 Folder Structure
```
EduPay/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── utils/
│
└── frontend/
    ├── src/api/
    ├── src/pages/
    ├── src/contexts/
    └── components/
```

---

## 📊 Admin Stats
- Total Users (Students + Teachers)
- Total Courses
- Total Enrollments
- Total Revenue
- Teacher Earnings

---

## 📘 Documentation Included
- `BACKEND_FRONTEND_ALIGNMENT.md`
- `BACKEND_IMPLEMENTATION_STATUS.md`
- `QUICK_START_GUIDE.md`
- `DETAILED_CHANGES_LOG.md`
- `QUICK_REFERENCE.md`

---

## 🌐 Environment Variables
### Backend `.env`
```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```
### Frontend `.env`
```
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY=your_key
```



