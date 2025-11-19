import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { ConfirmProvider } from "./contexts/ConfirmContext";

import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

// Student pages
import StudentLayout from "./layouts/StudentLayout";
import StudentDashboard from "./pages/Student/StudentDashboard";
import BrowseCourses from "./pages/Student/BrowseCourses";
import MyCourses from "./pages/Student/MyCourses";
import StudentProfile from "./pages/Student/StudentProfile";
import PaymentSuccess from "./pages/Student/PaymentSuccess";
import PaymentFailed from "./pages/Student/PaymentFailed";

// Admin / Teacher pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import AddCourse from "./pages/Teacher/AddCourse";

export default function App() {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>

              {/* Public */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <RoleRoute allowed={["admin"]}>
                  <AdminDashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          {/* Teacher */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute>
                <RoleRoute allowed={["teacher"]}>
                  <TeacherDashboard />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher/add-course"
            element={
              <ProtectedRoute>
                <RoleRoute allowed={["teacher"]}>
                  <AddCourse />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          {/* Student Nested Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <RoleRoute allowed={["student"]}>
                  <StudentLayout />
                </RoleRoute>
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="courses" element={<BrowseCourses />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="payment-success" element={<PaymentSuccess />} />
            <Route path="payment-failed" element={<PaymentFailed />} />
          </Route>

          {/* Default route */}
          <Route path="*" element={<Navigate to="/login" replace />} />

            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ConfirmProvider>
    </ToastProvider>
  );
}
