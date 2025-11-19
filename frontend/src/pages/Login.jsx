import { useState, useContext, useEffect } from "react";
import { loginUser } from "../api/authApi";
import { AuthContext } from "../contexts/AuthContextHelper";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const role = user.role;
      if (role === "admin") navigate("/admin");
      else if (role === "teacher") navigate("/teacher");
      else if (role === "student") navigate("/student/dashboard");
    }
  }, [user, navigate]);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDemoLogin = (role) => {
    const demos = {
      student: { email: "student@example.com", password: "password123" },
      teacher: { email: "teacher@example.com", password: "123" },
      admin: { email: "admin@example.com", password: "123" },
    };
    setForm(demos[role]);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(form);

      // Save token
      localStorage.setItem("token", res.data.token);

      // Set user in context
      setUser(res.data.user);
      console.log("Logged in user:", res.data.user);

      // Redirect based on role
      const role = res.data.user.role;

      if (role === "admin") navigate("/admin");
      else if (role === "teacher") navigate("/teacher");
      else if (role === "student") navigate("/student/dashboard");
      else navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center px-4 overflow-x-hidden">
      {/* Animated background elements
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div> */}

      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-md">
        {/* Top section with logo area */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 mb-4">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 1a9 9 0 100 18 9 9 0 000-18zm0 16a7 7 0 110-14 7 7 0 010 14zm0-9a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">EduPay</h1>
          <p className="text-blue-100 text-lg">Welcome Back</p>
        </div>

        {/* Main card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign In</h2>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 text-red-200 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email field */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
                <svg className="absolute right-3 top-3.5 w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Password</label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
                <svg className="absolute right-3 top-3.5 w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo credentials section */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <button
              type="button"
              onClick={() => setShowDemoCredentials(!showDemoCredentials)}
              className="text-sm text-blue-200 hover:text-white transition-colors w-full text-center mb-3 font-medium"
            >
              {showDemoCredentials ? "Hide" : "Show"} Demo Credentials
            </button>

            {showDemoCredentials && (
              <div className="space-y-2">
                <p className="text-xs text-gray-300 mb-3 text-center">Quick login with demo accounts:</p>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("student")}
                  className="w-full text-left px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-blue-100 transition-all"
                >
                  👨‍🎓 Student: student@example.com
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("teacher")}
                  className="w-full text-left px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-purple-100 transition-all"
                >
                  👨‍🏫 Teacher: teacher@example.com
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin("admin")}
                  className="w-full text-left px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-pink-100 transition-all"
                >
                  👨‍💼 Admin: admin@example.com
                </button>
              </div>
            )}
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-gray-300 mt-6">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-200 hover:text-white font-semibold transition-colors">
              Sign Up
            </a>
          </p>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-white/40 mt-6">
          Protected by encryption • Your data is secure
        </p>
      </div>
    </div>
  );
}
