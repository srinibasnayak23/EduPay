import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getTeacherCourses, createCourse, updateCourse, deleteCourse } from "../../api/courseApi";
import { getTeacherEnrollments, approveEnrollment } from "../../api/studentApi";
import { AuthContext } from "../../contexts/AuthContextHelper";
import { ToastContext } from "../../contexts/ToastContext";
import { ConfirmContext } from "../../contexts/ConfirmContext";
import { sampleCourses } from "../../data/sampleData";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const { showConfirm } = useContext(ConfirmContext);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("courses");
  const [showEditModal, setShowEditModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    thumbnailUrl: "",
  });
  console.log("User in TeacherDashboard:", user);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [coursesRes, enrollmentsRes] = await Promise.all([
          getTeacherCourses(),
          getTeacherEnrollments()
        ]);
        
        const courseList = coursesRes.data?.courses || coursesRes.data || [];
        const enrollmentList = enrollmentsRes.data?.enrollments || enrollmentsRes.data || [];
        
        setCourses(courseList);
        setEnrollments(enrollmentList);
      } catch (err) {
        console.log(err);
        setError("Failed to load data");
        // Fallback to sample data on error
        setCourses(sampleCourses);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title || !formData.price) {
      setError("Title and price are required");
      return;
    }

    try {
      if (editingCourse) {
        await updateCourse(editingCourse._id, formData);
        setCourses((prev) =>
          prev.map((c) => (c._id === editingCourse._id ? { ...c, ...formData } : c))
        );
        setSuccess("Course updated successfully!");
      } else {
        const newCourse = await createCourse(formData);
        setCourses((prev) => [...prev, newCourse.data]);
        setSuccess("Course created successfully!");
      }
      setShowEditModal(false);
      setFormData({ title: "", description: "", price: "", thumbnailUrl: "" });
      setEditingCourse(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save course");
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description || "",
      price: course.price,
      thumbnailUrl: course.thumbnailUrl || "",
    });
    setShowEditModal(true);
  };

  const handleDeleteCourse = async (id) => {
    const ok = await showConfirm('Are you sure you want to delete this course?');
    if (!ok) return;
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c._id !== id));
      setSuccess("Course deleted successfully!");
      addToast({ message: 'Course deleted', type: 'success' });
    } catch (err) {
      console.log(err);
      setError("Failed to delete course");
      addToast({ message: 'Failed to delete course', type: 'error' });
    }
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingCourse(null);
    setFormData({ title: "", description: "", price: "", thumbnailUrl: "" });
  };

  const handleApproveEnrollment = async (enrollmentId) => {
    try {
      await approveEnrollment(enrollmentId);
      setEnrollments((prev) =>
        prev.map((e) => (e._id === enrollmentId ? { ...e, status: "approved" } : e))
      );
      setSuccess("Student enrollment approved!");
    } catch {
      setError("Failed to approve enrollment");
    }
  };

  const handleRejectEnrollment = (enrollmentId) => {
    console.log(enrollmentId);
    setSuccess("Student enrollment rejected!");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-4 py-8">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-2">
              Teacher Dashboard
            </h1>
            <p className="text-blue-100 text-lg">Manage your courses and student enrollments</p>
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

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-blue-500/20 border border-blue-400/50 rounded-lg text-blue-200 flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-lg text-red-200 flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/20">
          <button
            onClick={() => setActiveTab("courses")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "courses"
                ? "text-white border-b-2 border-white"
                : "text-blue-100 hover:text-white"
            }`}
          >
            📚 My Courses
          </button>
          <button
            onClick={() => setActiveTab("enrollments")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "enrollments"
                ? "text-white border-b-2 border-white"
                : "text-blue-100 hover:text-white"
            }`}
          >
            👥 Student Enrollments
          </button>
        </div>

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div>
            {/* Add Course Button */}
            <div className="mb-8">
              <button
                onClick={() => navigate("/teacher/add-course")}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Add New Course
              </button>
            </div>

            {/* Courses List */}
            {loading ? (
              <div className="text-center py-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-300 mx-auto mb-4"></div>
                <p className="text-blue-100 font-medium">Loading courses...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
                <svg className="w-16 h-16 text-blue-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <p className="text-white text-lg font-semibold mb-4">No courses yet. Create your first course!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden hover:border-white/40 transition-all group"
                  >
                    {/* Course Image */}
                    {course.thumbnailUrl && (
                      <div className="h-40 overflow-hidden">
                        <img
                          src={course.thumbnailUrl}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Course Details */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{course.title}</h3>
                      <p className="text-blue-100 text-sm mb-4 line-clamp-2">{course.description}</p>

                      {/* Price and Status */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-white">₹{course.price}</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            course.approved
                              ? "bg-blue-500/30 text-blue-200"
                              : "bg-yellow-500/30 text-yellow-200"
                          }`}
                        >
                          {course.approved ? "Approved" : "Pending"}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course._id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 hover:shadow-lg text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Enrollments Tab */}
        {activeTab === "enrollments" && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Student Enrollments</h2>

            {enrollments.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-blue-100 text-lg font-semibold">No pending enrollments</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="bg-white/20 text-white">
                      <th className="py-3 px-4 font-semibold">Student Name</th>
                      <th className="py-3 px-4 font-semibold">Course</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map((enrollment) => (
                      <tr key={enrollment._id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-3 px-4 text-white font-medium">{enrollment.student?.name || "Unknown Student"}</td>
                        <td className="py-3 px-4 text-blue-200">{enrollment.course?.title || "-"}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              enrollment.status === "approved"
                                ? "bg-blue-500/30 text-blue-200"
                                : enrollment.status === "pending"
                                ? "bg-yellow-500/30 text-yellow-200"
                                : "bg-red-500/30 text-red-200"
                            }`}
                          >
                            {enrollment.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 flex gap-2">
                          {enrollment.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApproveEnrollment(enrollment._id)}
                                className="bg-blue-600 hover:bg-blue-700 hover:shadow-lg text-white px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectEnrollment(enrollment._id)}
                                className="bg-red-600 hover:bg-red-700 hover:shadow-lg text-white px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Course Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-96 overflow-y-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {editingCourse ? "Edit Course" : "Add New Course"}
              </h2>

              <form onSubmit={handleSaveCourse} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="React for Beginners"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Course description..."
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    placeholder="3999"
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                {/* Thumbnail URL */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    name="thumbnailUrl"
                    value={formData.thumbnailUrl}
                    onChange={handleFormChange}
                    placeholder="https://..."
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    {editingCourse ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-slate-300 text-slate-700 py-2 rounded-lg font-semibold hover:bg-slate-400 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
