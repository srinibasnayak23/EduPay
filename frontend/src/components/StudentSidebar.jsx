import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContextHelper";
import { ToastContext } from "../contexts/ToastContext";

const NavItem = ({ to, icon, label, onClose }) => (
  <NavLink
    to={to}
    onClick={onClose}
    className={({ isActive }) =>
      `
      flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300
      ${isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-200/50"
        : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
      }
    `
    }
  >
    <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
    <span>{label}</span>
  </NavLink>
);

export default function StudentSidebar({ onClose }) {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);

  const handleLogout = () => {
    logout();
    addToast({ message: "Logged out successfully", type: "success" });
    navigate("/login");
    if (onClose) onClose();
  };

  return (
    <aside className="w-64 lg:w-64 border-r border-slate-200 bg-white h-full p-6 flex-shrink-0 overflow-y-auto">

      {/* Mobile Close */}
      <div className="flex items-center justify-end mb-4 lg:hidden">
        <button
          onClick={onClose}
          className="p-2 rounded-md hover:bg-slate-100 transition"
        >
          <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          EduPay
        </h1>
        <p className="text-sm text-slate-500 mt-1">Student Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 mb-8">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 mb-3">
          Main Menu
        </p>

        <NavItem
          to="/student/dashboard"
          label="Dashboard"
          onClose={onClose}
          icon={
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5M6.5 6.5h7M6.5 10h7M6.5 13.5h3.5" />
            </svg>
          }
        />

        <NavItem
          to="/student/courses"
          label="Browse Courses"
          onClose={onClose}
          icon={
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v12.5A2.25 2.25 0 003.75 18.5h12.5a2.25 2.25 0 002.25-2.25V9.5" />
            </svg>
          }
        />

        <NavItem
          to="/student/my-courses"
          label="My Courses"
          onClose={onClose}
          icon={
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 4.804A7.968 7.968 0 015.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0114.5 4c-1.669 0-3.218-.51-4.5-1.385A7.954 7.954 0 009 4.804z" />
            </svg>
          }
        />

        <NavItem
          to="/student/profile"
          label="Profile"
          onClose={onClose}
          icon={
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          }
        />
      </nav>

      {/* Footer */}
      <div className=" pt-4 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-3 text-slate-700 hover:bg-red-50 hover:text-red-600  transition-all"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1h12a1 1 0 110 2H4v11a1 1 0 001 1h12a1 1 0 100-2H5V4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
