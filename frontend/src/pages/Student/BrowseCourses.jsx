import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchApprovedCourses,
  createEnrollment,
  createRazorOrder,
} from "../../api/studentApi";
import CourseCard from "../../components/CourseCard";
import { AuthContext } from "../../contexts/AuthContextHelper";
import { ToastContext } from "../../contexts/ToastContext";
import { sampleCourses } from "../../data/sampleData";

export default function BrowseCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);

  const categories = ["all", "programming", "design", "business", "health"];

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        // Fetch from API
        const res = await fetchApprovedCourses();
        const data = res.data?.courses || res.data || [];
        setCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        // Fallback to sample data on error
        setCourses(sampleCourses);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Fetch enrolled courses
  useEffect(() => {
    async function loadEnrolled() {
      try {
        const { fetchMyEnrollments } = await import("../../api/studentApi");
        const res = await fetchMyEnrollments();
        const enrolled = res.data?.enrollments || res.data || [];
        // Extract course IDs from enrollments
        const enrolledCourseIds = enrolled.map((e) => e.course._id || e.course);
        setEnrolledCourses(enrolledCourseIds);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
      }
    }
    if (user) {
      loadEnrolled();
    }
  }, [user]);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // enrollment flow: create enrollment record then create Razorpay order
  const handleEnroll = async (course) => {
    if (!user) {
      addToast({ message: "Please login to enroll", type: "warn" });
      return navigate("/login");
    }

    try {
      // 1) create enrollment (pending) on backend
      const enrollmentRes = await createEnrollment(course._id);
      const enrollment =
        enrollmentRes.data?.enrollment ||
        enrollmentRes.data.enrollment ||
        enrollmentRes.data;

      if (!enrollment) {
        throw new Error("Failed to create enrollment");
      }

      // 2) create razorpay order for that enrollment
      const orderRes = await createRazorOrder(enrollment._id);
      const order =
        orderRes.data?.order || orderRes.data.order || orderRes.data;

      if (!order) {
        throw new Error("Failed to create order");
      }

      // 3) show Razorpay checkout
      const options = {
        key: orderRes.data?.key || import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency || "INR",
        name: course.title,
        description: course.description,
        order_id: order.id,
        handler: async function (response) {
          // send verification to backend
          try {
            const token = localStorage.getItem("token");
            const verifyRes = await fetch(
              "http://localhost:5000/api/payments/verify",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  courseId: course._id,
                  enrollmentId: enrollment._id,
                }),
              }
            );

            if (!verifyRes.ok) {
              throw new Error("Payment verification failed");
            }

            addToast({
              message: "Payment successful! Enrollment activated.",
              type: "success",
            });
            window.location.href = "/student/my-courses";
          } catch (err) {
            console.error("Verification error:", err);
            addToast({
              message: "Payment verification failed. Please contact support.",
              type: "error",
            });
            window.location.href = "/student/payment-failed";
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Enroll error:", err);
      addToast({
        message:
          err.message ||
          err.response?.data?.message ||
          "Enrollment failed. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
              Explore Courses
            </h1>
            <p className="text-slate-600 mt-3 text-lg">
              Find and enroll in courses that interest you
            </p>
          </div>
          <div className="text-4xl">🎓</div>
        </div>

        {/* Search Bar with Icon */}
        <div className="relative mb-8">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by course name or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-xl 
    bg-white text-[#001F3F]  /* Navy blue text */
    placeholder:text-[#5a6b8a]  /* Softer navy placeholder */
    border-2 border-slate-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    shadow-sm hover:border-slate-300 transition text-lg"
          />
        </div>

        {/* Category Filter with Modern Styling */}
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full font-semibold whitespace-nowrap transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl -translate-y-1"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-40 bg-slate-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-slate-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <svg
              className="w-20 h-20 text-slate-300 mx-auto mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-slate-600 text-xl font-semibold mb-2">
              No courses found
            </p>
            <p className="text-slate-500 mb-6">
              Try adjusting your search or category filters
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div>
            <p className="text-slate-600 font-medium mb-6">
              Showing{" "}
              <span className="text-blue-600 font-bold">
                {filteredCourses.length}
              </span>{" "}
              courses
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  onAction={handleEnroll}
                  actionLabel="Enroll Now"
                  isEnrolled={enrolledCourses.includes(course._id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
