// Admin Dashboard
// Main admin dashboard page

import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContextHelper';
import { ToastContext } from '../../contexts/ToastContext';
import { ConfirmContext } from '../../contexts/ConfirmContext';
import { adminGetAllCourses, adminApproveCourse, adminDeleteCourse } from '../../api/courseApi';
import { getAdminStats } from '../../api/adminApi';
//import { getProfile } from '../../api/authApi';
import { sampleCourses, sampleStats } from '../../data/sampleData';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalRevenue: 0,
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        // Fetch courses
        const coursesRes = await adminGetAllCourses();
        const courseList = coursesRes.data?.courses || coursesRes.data || [];

        // Fetch stats
        const statsRes = await getAdminStats();
        const dashboardStats = statsRes.data?.stats || {};
        
        setCourses(courseList);
        setStats({
          totalCourses: dashboardStats.totalCourses || courseList.length,
          totalStudents: dashboardStats.totalStudents || 0,
          totalTeachers: dashboardStats.totalTeachers || 0,
          totalRevenue: dashboardStats.totalRevenue || 0,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
        // Fallback to sample data on error
        setCourses(sampleCourses);
        setStats(sampleStats);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  // Approve/Reject course
  const handleStatusChange = async (id, status) => {
    try {
      await adminApproveCourse(id, status);
      setCourses((prev) => prev.map((c) => (c._id === id ? { ...c, status } : c)));
    } catch (err) {
      console.error(err);
      setError("Failed to update course status");
    }
  };

  // Delete course
  const handleDeleteCourse = async (id, status) => {
    try {
      const ok = await showConfirm('Are you sure you want to delete this course?');
      if (!ok) return;
      await adminDeleteCourse(id, status);
      setCourses((prev) => prev.filter((c) => c._id !== id));
      addToast({ message: 'Course deleted', type: 'success' });
    } catch (err) {
      console.error(err);
      setError('Failed to delete course');
      addToast({ message: 'Failed to delete course', type: 'error' });
    }
  };

  // auth
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const { showConfirm } = useContext(ConfirmContext);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 px-4 py-8">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-pink-200 bg-clip-text text-transparent mb-2">Admin Dashboard</h1>
            <p className="text-blue-100 text-lg">Manage courses, users, and payments</p>
          </div>
          <div>
            <button
              onClick={() => {
                logout && logout();
                addToast({ message: 'Logged out successfully', type: 'success' });
                navigate('/login');
              }}
              className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-7 shadow-lg border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">📚</span>
              <span className="text-lg font-semibold text-white">Courses</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalCourses}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-7 shadow-lg border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">👨‍🎓</span>
              <span className="text-lg font-semibold text-white">Students</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalStudents}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-7 shadow-lg border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">👨‍🏫</span>
              <span className="text-lg font-semibold text-white">Teachers</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalTeachers}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-7 shadow-lg border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">💰</span>
              <span className="text-lg font-semibold text-white">Revenue</span>
            </div>
            <p className="text-3xl font-bold text-white">₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-lg text-red-200 text-center">
            {error}
          </div>
        )}

        {/* Courses Table */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Course Management</h2>
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-blue-100 font-medium">Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-white text-lg font-semibold mb-4">No courses found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="bg-white/20 text-white">
                    <th className="py-3 px-4 font-semibold">Title</th>
                    <th className="py-3 px-4 font-semibold">Teacher</th>
                    <th className="py-3 px-4 font-semibold">Price</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course._id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-3 px-4 text-white font-medium">{course.title}</td>
                      <td className="py-3 px-4 text-blue-200">{course.teacher?.name || "-"}</td>
                      <td className="py-3 px-4 text-white">₹{course.price}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${course.status === "approved" ? "bg-green-500/30 text-green-200" : course.status === "pending" ? "bg-yellow-500/30 text-yellow-200" : "bg-red-500/30 text-red-200"}`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 flex gap-2">
                        {course.status !== "approved" && (
                          <button
                            onClick={() => handleStatusChange(course._id, "approved")}
                            className="bg-green-600 hover:bg-green-700 hover:shadow-lg text-white px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200"
                          >
                            Approve
                          </button>
                        )}
                        {course.status !== "rejected" && (
                          <button
                            onClick={() => handleStatusChange(course._id, "rejected")}
                            className="bg-red-600 hover:bg-red-700 hover:shadow-lg text-white px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200"
                          >
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteCourse(course._id)}
                          className="bg-gray-600 hover:bg-gray-700 hover:shadow-lg text-white px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* TODO: User Management & Payment Summary sections can be added here */}
        {/* ...existing code... */}
      </div>
    </div>
  );
};

export default AdminDashboard;
