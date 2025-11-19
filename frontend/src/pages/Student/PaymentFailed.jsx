import { useNavigate, useSearchParams } from "react-router-dom";
import { sampleCourses } from "../../data/sampleData";

export default function PaymentFailed() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  const course = sampleCourses.find(c => c._id === courseId) || sampleCourses[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Error Icon with Animation */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-400 to-rose-500 rounded-full mb-8 shadow-2xl">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-4">
            Payment Failed ❌
          </h1>
          <p className="text-slate-600 text-xl">We couldn't process your payment</p>
        </div>

        {/* Error Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 mb-8 overflow-hidden">
          {/* Course Details */}
          <div className="border-b border-slate-200 pb-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Course Information</h2>
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
                  <span className="font-semibold">Price:</span> ₹{course.price}
                </p>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <div>
                <p className="text-red-700 font-bold text-lg">Payment Could Not Be Processed</p>
                <p className="text-red-600 mt-2">Your card was declined or there was an issue with the payment gateway. Your account has not been charged.</p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-2 gap-6 mb-8 pb-8 border-b border-slate-200">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
              <p className="text-slate-600 text-sm font-medium">Amount</p>
              <p className="text-2xl font-bold text-slate-900 mt-3">₹{course.price}</p>
            </div>
            <div className="bg-red-50 p-5 rounded-xl border border-red-200">
              <p className="text-slate-600 text-sm font-medium">Status</p>
              <p className="text-2xl font-bold text-red-600 mt-3">Failed</p>
            </div>
          </div>

          {/* Troubleshooting Tips */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6">
            <div className="flex gap-3 mb-4">
              <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              <div>
                <p className="text-amber-800 font-bold mb-3">Troubleshooting Steps:</p>
                <ul className="text-amber-700 text-sm space-y-2 ml-2">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Check your internet connection stability</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Verify your card details (number, CVV, expiry)</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Ensure sufficient balance in your account</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Try using a different payment method</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Contact your bank if card is blocked</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={() => window.history.back()}
            className="group relative bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:shadow-xl hover:-translate-y-1 font-semibold transition-all duration-300 flex-1 sm:flex-auto flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/></svg>
            Retry Payment
          </button>
          <button
            onClick={() => navigate("/student/courses")}
            className="bg-white text-slate-700 hover:bg-slate-100 px-8 py-4 rounded-xl border-2 border-slate-200 font-semibold transition-all duration-300 flex-1 sm:flex-auto flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5"/></svg>
            Back to Courses
          </button>
        </div>

        {/* Support */}
        <div className="text-center">
          <p className="text-slate-600 mb-3">Still having trouble? We're here to help</p>
          <a 
            href="mailto:support@edupay.com"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
