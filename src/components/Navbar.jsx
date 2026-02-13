import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Image,
  Heart,
  LogIn,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { toggleTheme } from "../features/theme/themeSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
    navigate("/login");
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition
     ${
       isActive
         ? "bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
         : "text-gray-600 hover:text-blue-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
     }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="w-[90%] mx-auto h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <Image className="text-blue-600" size={24} />
          <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Image Gallery
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-3">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/liked" className={linkClass}>
              <Heart size={16} />
              Liked
            </NavLink>
          )}

          {/* Theme Toggle */}
          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {mode === "dark" ? (
              <Sun size={18} className="text-yellow-400" />
            ) : (
              <Moon size={18} className="text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
                         text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-md
                         bg-blue-600 text-white text-sm font-medium
                         hover:bg-blue-700 transition"
            >
              <LogIn size={16} />
              Login
            </NavLink>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4 space-y-3">
          <NavLink
            to="/"
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            Home
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/liked"
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              <Heart size={16} />
              Liked
            </NavLink>
          )}

          {/* Theme Toggle Mobile */}
          <button
            onClick={handleThemeToggle}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md
                       text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {mode === "dark" ? (
              <>
                <Sun size={18} className="text-yellow-400" />
                Light Mode
              </>
            ) : (
              <>
                <Moon size={18} />
                Dark Mode
              </>
            )}
          </button>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md
                         text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md
                         bg-blue-600 text-white text-sm font-medium
                         hover:bg-blue-700 transition"
            >
              <LogIn size={16} />
              Login
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
