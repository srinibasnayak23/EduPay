import { useNavigate, useSearchParams } from "react-router-dom";
import { sampleCourses } from "../../data/sampleData";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  const course = sampleCourses.find(c => c._id === courseId) || sampleCourses[0];
  const transactionId = "TXN1234567890";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Success Icon with Animation */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-8 shadow-2xl animate-pulse">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Payment Successful! 🎉
          </h1>
          <p className="text-slate-600 text-xl">Your enrollment has been activated</p>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 mb-8 overflow-hidden">
          <div className="border-b border-slate-200 pb-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Course Enrollment Details</h2>
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-24 h-24 rounded-xl object-cover shadow-md flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900">{course.title}</h3>
                <p className="text-slate-600 mt-2">
                  <span className="font-semibold">Instructor:</span> {course.teacher?.name || "Instructor"}
                </p>
                <p className="text-slate-600 mt-1">
                  <span className="font-semibold">Duration:</span> {course.duration || "Self-paced"}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pb-8 border-b border-slate-200">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-200">
              <p className="text-slate-600 text-sm font-medium">Amount Paid</p>
              <p className="text-3xl font-bold text-green-600 mt-3">₹{course.price}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-200">
              <p className="text-slate-600 text-sm font-medium">Transaction ID</p>
              <p className="text-lg font-mono text-blue-600 mt-3 break-all">{transactionId}</p>
            </div>
          </div>

          {/* Status Alert */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <div>
                <p className="text-green-700 font-bold text-lg">Payment Verified!</p>
                <p className="text-green-600 mt-1">Your course access has been activated immediately. You can now view all course materials, lectures, and resources.</p>
              </div>
            </div>
          </div>

          {/* Confirmation Message */}
          <div className="text-center text-sm text-slate-600 bg-slate-50 p-4 rounded-lg">
            <p>📧 A confirmation email has been sent to <span className="font-semibold">{course.email || "your registered email"}</span></p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/student/my-courses")}
            className="group relative bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl hover:shadow-xl hover:-translate-y-1 font-semibold transition-all duration-300 flex-1 sm:flex-auto"
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 015.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.669 0-3.218-.51-4.5-1.385A7.954 7.954 0 009 4.804z"/></svg>
              Start Learning
            </div>
          </button>
          <button
            onClick={() => navigate("/student/courses")}
            className="bg-white text-slate-700 hover:bg-slate-100 px-8 py-4 rounded-xl border-2 border-slate-200 font-semibold transition-all duration-300 flex-1 sm:flex-auto flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5"/></svg>
            Browse More Courses
          </button>
        </div>
      </div>
    </div>
  );
}
