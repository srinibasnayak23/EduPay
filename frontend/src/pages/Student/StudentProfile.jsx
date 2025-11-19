import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContextHelper";
import { ToastContext } from "../../contexts/ToastContext";
import { getProfile, updateProfile } from "../../api/authApi";
import { fetchMyEnrollments } from "../../api/studentApi";
import { sampleUserProfile } from "../../data/sampleData";

export default function StudentProfile() {
  const { user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(user || {});
  const [stats, setStats] = useState({
    activeCourses: 0,
    completedCourses: 0,
    hoursLearned: 0,
    certificatesEarned: 0,
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    college: "",
    details: "",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user profile and stats on mount
  useEffect(() => {
    async function loadProfileData() {
      try {
        setLoading(true);
        // Get latest user profile
        const profileRes = await getProfile();
        const userData = profileRes.data?.user || user;
        setProfile(userData);

        // Get enrollment stats
        const enrollmentsRes = await fetchMyEnrollments();
        const enrollments = enrollmentsRes.data?.enrollments || [];

        const activeCourses = enrollments.filter(
          (e) => e.status === "active"
        ).length;
        const completedCourses = enrollments.filter(
          (e) => e.status === "completed"
        ).length;

        setStats({
          activeCourses,
          completedCourses,
          hoursLearned: (activeCourses + completedCourses) * 5, // Estimate: 5 hours per course
          certificatesEarned: completedCourses,
        });

        // Set form with user data
        setForm({
          name: userData?.name || "",
          email: userData?.email || "",
          phone: userData?.phone || "",
          address: userData?.address || "",
          college: userData?.college || "",
          details: userData?.details || "",
        });
      } catch (err) {
        console.error("Error loading profile:", err);
        // Fallback to context user
        setProfile(user || sampleUserProfile);
        setForm({
          name: user?.name || sampleUserProfile.name || "",
          email: user?.email || sampleUserProfile.email || "",
          phone: user?.phone || sampleUserProfile.phone || "",
          address: user?.address || sampleUserProfile.address || "",
          college: user?.college || sampleUserProfile.college || "",
          details: user?.details || sampleUserProfile.details || "",
        });
      } finally {
        setLoading(false);
      }
    }
    loadProfileData();
  }, [user]);

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateProfile(form);
      const updatedUser = res.data?.user || res.data;
      setProfile(updatedUser);
      setUser(updatedUser);
      addToast({ message: "Profile updated successfully!", type: "success" });
    } catch (err) {
      console.log("Error updating profile", err);
      addToast({
        message: err.response?.data?.message || "Update failed",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const { addToast } = useContext(ToastContext);
  if (loading) {
    return (
      <div className="w-full">
        <div className="py-16">
          <div className="animate-pulse h-6 bg-slate-200 rounded mb-4 w-1/3"></div>
          <div className="animate-pulse h-40 bg-white rounded-2xl border border-slate-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-3">
          Profile Settings
        </h1>
        <p className="text-slate-600 text-lg">
          Manage your account and learning preferences
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-32 -mx-8 -mt-8 mb-8"></div>

        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:gap-6 mb-8 pb-8 border-b border-slate-200">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-4xl sm:text-5xl font-bold shadow-lg -mt-12 sm:-mt-16 mb-4 sm:mb-0 border-4 border-white">
            {(profile?.name || "S").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-slate-900">
              {profile?.name || "Student Name"}
            </h2>
            <p className="text-slate-600 mt-1">
              {profile?.email || "student@example.com"}
            </p>
            <p className="text-sm text-slate-500 mt-2">
              <span className="inline-flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                </svg>
                Member since {new Date(profile?.createdAt).toLocaleDateString()}
              </span>
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-md transition">
            <svg
              className="w-6 h-6 text-blue-600 mb-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 4.804A7.968 7.968 0 015.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.669 0-3.218-.51-4.5-1.385A7.954 7.954 0 009 4.804z" />
            </svg>
            <p className="text-slate-600 text-sm font-medium">Active Courses</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {stats.activeCourses}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-md transition">
            <svg
              className="w-6 h-6 text-green-600 mb-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-slate-600 text-sm font-medium">Completed</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats.completedCourses}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-md transition">
            <svg
              className="w-6 h-6 text-purple-600 mb-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5M6.5 6.5h7M6.5 10h7M6.5 13.5h3.5" />
            </svg>
            <p className="text-slate-600 text-sm font-medium">Hours Learned</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {stats.hoursLearned}
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200 hover:shadow-md transition">
            <svg
              className="w-6 h-6 text-orange-600 mb-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <p className="text-slate-600 text-sm font-medium">Certificates</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {stats.certificatesEarned}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form
        className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8"
        onSubmit={handleSave}
      >
        <h3 className="text-2xl font-bold text-slate-900 mb-8">
          Edit Your Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full border-2 border-slate-200 rounded-xl px-5 py-3 
      text-[#001F3F] placeholder:text-slate-500 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
      transition bg-slate-50 hover:bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full border-2 border-slate-200 rounded-xl px-5 py-3 
      text-[#001F3F] placeholder:text-slate-500 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
      transition bg-slate-50 hover:bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full border-2 border-slate-200 rounded-xl px-5 py-3 
      text-[#001F3F] placeholder:text-slate-500 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
      transition bg-slate-50 hover:bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Institution
            </label>
            <input
              type="text"
              name="college"
              value={form.college}
              onChange={handleChange}
              placeholder="College or University"
              className="w-full border-2 border-slate-200 rounded-xl px-5 py-3 
      text-[#001F3F] placeholder:text-slate-500 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
      transition bg-slate-50 hover:bg-white"
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Street Address
          </label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Your street address"
            className="w-full border-2 border-slate-200 rounded-xl px-5 py-3 
    text-[#001F3F] placeholder:text-slate-500 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
    transition bg-slate-50 hover:bg-white"
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            About You
          </label>
          <textarea
            name="details"
            value={form.details}
            onChange={handleChange}
            placeholder="Tell us about your learning goals and interests..."
            rows="5"
            className="w-full border-2 border-slate-200 rounded-xl px-5 py-3
    text-[#001F3F] placeholder:text-slate-500 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
    transition bg-slate-50 hover:bg-white resize-none"
          />
        </div>

        <div className="flex gap-4 pt-4 border-t border-slate-200">
          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:shadow-lg hover:-translate-y-1 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
          <button
            type="button"
            className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-8 py-3 rounded-xl font-semibold transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
