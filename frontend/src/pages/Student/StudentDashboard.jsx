import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyEnrollments } from "../../api/studentApi";
import { sampleEnrollments, sampleStats } from "../../data/sampleData";

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    myCourses: 0,
    availableCourses: 12,
    totalSpent: 0,
    completionRate: 0,
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadStats() {
      try {
        // Fetch from API
        const res = await fetchMyEnrollments();
        const courses = res.data?.enrollments || res.data || [];

        const totalSpent = courses.reduce((sum, e) => sum + (e.amountPaid || 0), 0);

        setStats({
          myCourses: courses.length,
          availableCourses: 12,
          totalSpent,
          completionRate: courses.length > 0 ? Math.floor((courses.filter(c => c.status === "completed").length / courses.length) * 100) : 0,
        });

        setRecentCourses(courses.slice(0, 3));
      } catch (err) {
        console.error("Error fetching stats:", err);
        // Fallback to sample data on error
        setRecentCourses(sampleEnrollments.slice(0, 3));
        setStats({
          myCourses: sampleEnrollments.length,
          availableCourses: sampleStats.totalCourses,
          totalSpent: 14497,
          completionRate: 33,
        });
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div>
      <div className="w-full">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent">
                Welcome back! 👋
              </h1>
              <p className="text-slate-600 mt-3 text-lg">Here's your learning journey at a glance</p>
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300 whitespace-nowrap w-full sm:w-auto">
              + New Course
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* My Courses Card */}
          <div className="group bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-blue-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-all">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.669 0-3.218-.51-4.5-1.385A7.954 7.954 0 009 4.804z"/></svg>
              </div>
              <span className="text-2xl">📚</span>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-2">My Courses</p>
            <p className="text-4xl font-bold text-slate-900 mb-3">{stats.myCourses}</p>
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 w-2/3"></div>
            </div>
          </div>

          {/* Available Courses Card */}
          <div className="group bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-green-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-all">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5M6.5 6.5h7M6.5 10h7M6.5 13.5h3.5"/></svg>
              </div>
              <span className="text-2xl">🎓</span>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-2">Available</p>
            <p className="text-4xl font-bold text-slate-900 mb-3">{stats.availableCourses}</p>
            <p className="text-sm text-green-600 font-semibold">Ready to explore</p>
          </div>

          {/* Total Invested Card */}
          <div className="group bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-purple-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-all">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path d="M8.5 10.5a2 2 0 11-4 0 2 2 0 014 0zM12.5 18.5h-2v-2a2 2 0 00-2-2h-3a2 2 0 00-2 2v2h-2v-6a2 2 0 012-2h6a2 2 0 012 2v6z"/></svg>
              </div>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-2">Total Invested</p>
            <p className="text-3xl font-bold text-slate-900 mb-3">₹{stats.totalSpent.toLocaleString()}</p>
            <p className="text-sm text-purple-600 font-semibold">In your education</p>
          </div>

          {/* Completion Rate Card */}
          <div className="group bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-orange-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-all">
                <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 3.062v6.218c0 1.264-.586 2.459-1.596 3.228a6.988 6.988 0 01-1.18.627 6.987 6.987 0 01-4.854 0 6.988 6.988 0 01-1.18-.627c-1.01-.769-1.596-1.964-1.596-3.228V6.517a3.066 3.066 0 012.812-3.062z" clipRule="evenodd"/></svg>
              </div>
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-2">Completion</p>
            <p className="text-4xl font-bold text-slate-900 mb-3">{stats.completionRate}%</p>
            <p className="text-sm text-orange-600 font-semibold">Keep it up!</p>
          </div>
        </div>

        {/* Recent Courses Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">Recent Courses</h2>
            <button
              onClick={() => navigate("/student/my-courses")}
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold hover:underline transition"
            >
              View All →
            </button>
          </div>

          {loading ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-500 font-medium">Loading your courses...</p>
            </div>
          ) : recentCourses.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
              <svg className="w-16 h-16 text-blue-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m0 0h6M6 12a6 6 0 1112 0 6 6 0 01-12 0z" />
              </svg>
              <p className="text-slate-600 text-lg font-semibold mb-4">No courses yet. Start your learning journey!</p>
              <button
                onClick={() => navigate("/student/courses")}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:shadow-lg hover:-translate-y-1 font-semibold transition-all duration-300"
              >
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentCourses.map((enrollment) => (
                <div
                  key={enrollment._id}
                  className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-900 mb-3 group-hover:text-blue-600 transition">{enrollment.course?.title || "Course"}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-600">Progress</span>
                            <span className="text-sm font-bold text-blue-600">{enrollment.progress || 0}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                              style={{ width: `${enrollment.progress || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-2">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                        enrollment.status === "active"
                          ? "bg-green-100 text-green-700"
                          : enrollment.status === "completed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {enrollment.status}
                      </span>
                      <button
                        onClick={() => navigate(`/course/${enrollment.course?._id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition-all duration-300 hover:shadow-md text-sm"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate("/student/courses")}
            className="group relative bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 rounded-2xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative">
              <div className="text-4xl mb-3">🔍</div>
              <p className="font-bold text-lg">Browse Courses</p>
              <p className="text-sm text-blue-100 mt-2">Explore 100+ courses</p>
            </div>
          </button>
          <button
            onClick={() => navigate("/student/my-courses")}
            className="group relative bg-gradient-to-br from-purple-600 to-purple-700 text-white p-8 rounded-2xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative">
              <div className="text-4xl mb-3">📚</div>
              <p className="font-bold text-lg">My Courses</p>
              <p className="text-sm text-purple-100 mt-2">Continue learning</p>
            </div>
          </button>
          <button
            onClick={() => navigate("/student/profile")}
            className="group relative bg-gradient-to-br from-green-600 to-green-700 text-white p-8 rounded-2xl hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="relative">
              <div className="text-4xl mb-3">👤</div>
              <p className="font-bold text-lg">My Profile</p>
              <p className="text-sm text-green-100 mt-2">Manage account</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
