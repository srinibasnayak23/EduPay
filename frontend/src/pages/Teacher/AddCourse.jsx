import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createCourse } from "../../api/courseApi";
import { AuthContext } from "../../contexts/AuthContextHelper";

export default function AddCourse() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    thumbnailUrl: "",
    category: "programming",
  });

  console.log("Current User:", user);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.title || !formData.price) {
      setError("Title and price are required");
      setLoading(false);
      return;
    }

    try {
      console.log("Submitting form data:", formData);
      await createCourse(formData);
      setSuccess("Course created successfully!");
      setTimeout(() => {
        navigate("/teacher");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/teacher")}
          className="mb-6 flex items-center gap-2 text-white hover:text-blue-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-2">
            Create New Course
          </h1>
          <p className="text-blue-100 text-lg">Add a new course to your catalog</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-blue-500/20 border border-blue-400/50 rounded-lg text-blue-200 flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-lg text-red-200 flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-lg font-semibold text-white mb-3">
                Course Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Advanced React & TypeScript"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-lg font-semibold text-white mb-3">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a detailed description of your course..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all h-28 resize-none"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-lg font-semibold text-white mb-3">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="3999"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-lg font-semibold text-white mb-3">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              >
                <option value="programming" className="bg-slate-800">Programming</option>
                <option value="design" className="bg-slate-800">Design</option>
                <option value="business" className="bg-slate-800">Business</option>
                <option value="marketing" className="bg-slate-800">Marketing</option>
                <option value="data-science" className="bg-slate-800">Data Science</option>
              </select>
            </div>

            {/* Thumbnail URL */}
            <div>
              <label className="block text-lg font-semibold text-white mb-3">
                Thumbnail URL
              </label>
              <input
                type="url"
                name="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
              {formData.thumbnailUrl && (
                <div className="mt-4 rounded-lg overflow-hidden border border-white/20 max-w-xs">
                  <img
                    src={formData.thumbnailUrl}
                    alt="Course thumbnail preview"
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x200";
                    }}
                  />
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Create Course
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate("/teacher")}
                className="flex-1 bg-slate-600/50 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Tips for Creating a Great Course:</h3>
          <ul className="space-y-2 text-blue-100">
            <li className="flex items-start gap-3">
              <span className="text-yellow-300 mt-1">✨</span>
              <span>Use a clear, descriptive title that explains what students will learn</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-yellow-300 mt-1">✨</span>
              <span>Write a detailed description highlighting key benefits and learning outcomes</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-yellow-300 mt-1">✨</span>
              <span>Price your course competitively based on market research</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-yellow-300 mt-1">✨</span>
              <span>Use high-quality, relevant thumbnail images to attract students</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
