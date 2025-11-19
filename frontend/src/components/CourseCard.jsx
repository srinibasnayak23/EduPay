export default function CourseCard({ course, onAction, actionLabel = "Enroll", isEnrolled = false }) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-blue-300 hover:-translate-y-2 h-full flex flex-col">
      {/* Course Image Container */}
      <div className="h-44 sm:h-48 w-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 overflow-hidden relative">
        <img
          src={course.thumbnailUrl || "https://via.placeholder.com/400x200?text=Course"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300"></div>
        
        {/* Popular Badge */}
        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg transform group-hover:scale-110 transition-transform">
          ⭐ Popular
        </div>

        {/* Enrollment Count */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-700">
          👥 {course.enrolled || 1.2}K enrolled
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Category Badge */}
        <span className="inline-block w-fit bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
          {course.category || "Programming"}
        </span>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition">
          {course.title}
        </h3>

        {/* Teacher Info */}
        <p className="text-sm text-slate-600 mb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs">
            {(course.teacher?.name?.charAt(0) || "T").toUpperCase()}
          </span>
          {course.teacher?.name || "Instructor"}
        </p>

        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-grow">
          {course.description}
        </p>

        {/* Stats */}
        <div className="flex gap-4 mb-6 text-xs text-slate-600 py-3 border-y border-slate-100">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5"/></svg>
            {course.duration || "40"} hours
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/></svg>
            {course.enrolled || "1.2"}K
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            4.8
          </span>
        </div>

        {/* Footer with Price and Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <p className="text-slate-600 text-xs font-medium">Price</p>
            <p className="text-2xl font-bold text-blue-600">₹{course.price}</p>
          </div>
          <button
            onClick={() => !isEnrolled && onAction && onAction(course)}
            disabled={isEnrolled}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm ${
              isEnrolled
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white cursor-not-allowed shadow-md"
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-lg hover:-translate-y-1"
            }`}
          >
            {isEnrolled ? "✓ Enrolled" : actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
