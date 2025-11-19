import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyEnrollments } from "../../api/studentApi";
import { sampleEnrollments } from "../../data/sampleData";

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, active, completed
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        // Fetch from API
        const res = await fetchMyEnrollments();
        const data = res.data?.enrollments || res.data || [];
        setEnrollments(data);
      } catch (err) {
        console.error("Error fetching enrollments:", err);
        // Fallback to sample data on error
        setEnrollments(sampleEnrollments);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredEnrollments = enrollments.filter((e) => {
    if (filter === "active") return e.status === "active";
    if (filter === "completed") return e.status === "completed";
    return true;
  });

  return (
    <div className="w-full">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent mb-3">
            My Learning Journey
          </h1>
          <p className="text-slate-600 text-lg">Track your progress and continue where you left off</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 pt-2">
          {["all", "active", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2.5 rounded-full font-semibold capitalize whitespace-nowrap transition-all duration-300 ${
                filter === tab
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl -translate-y-1"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {tab === "all" ? "All Courses" : tab === "active" ? "Active" : "Completed"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-40 bg-slate-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-slate-200 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded mb-4 w-1/2"></div>
                  <div className="h-4 bg-slate-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredEnrollments.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <svg className="w-20 h-20 text-slate-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747 0-6.002-4.5-10.747-10-10.747z" />
            </svg>
            <p className="text-slate-600 text-xl font-semibold mb-2">
              {filter === "all" ? "No courses yet" : `No ${filter} courses`}
            </p>
            <p className="text-slate-500 mb-6">Get started by browsing available courses</p>
            <button
              onClick={() => navigate("/student/courses")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:shadow-lg font-semibold transition-all"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEnrollments.map((enrollment) => (
              <div
                key={enrollment._id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-blue-300 hover:-translate-y-2"
              >
                {/* Course Image with Overlay */}
                <div className="h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden relative">
                  <img
                    src={enrollment.course?.thumbnailUrl || "https://via.placeholder.com/400x200?text=Course"}
                    alt={enrollment.course?.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all"></div>
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      enrollment.status === "active"
                        ? "bg-green-500 text-white"
                        : enrollment.status === "completed"
                        ? "bg-blue-500 text-white"
                        : "bg-amber-500 text-white"
                    }`}>
                      {enrollment.status}
                    </span>
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition">
                    {enrollment.course?.title}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {enrollment.course?.description}
                  </p>

                  {/* Progress Section */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Progress</span>
                      <span className="text-sm font-bold text-blue-600">{enrollment.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                        style={{ width: `${enrollment.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-slate-900">₹{enrollment.amountPaid || 0}</span>
                    <span className="text-xs font-medium text-slate-500">
                      {enrollment.progress >= 100 ? "✓ Completed" : "In Progress"}
                    </span>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => navigate(`/course/${enrollment.course?._id}`)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:shadow-lg hover:-translate-y-1 font-semibold transition-all duration-300"
                  >
                    {enrollment.progress >= 100 ? "Review Certificate" : "Continue Learning"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
