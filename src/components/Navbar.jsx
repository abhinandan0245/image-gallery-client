import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Image, Heart, LogIn, LogOut, Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition
     ${
       isActive
         ? "bg-blue-50 text-blue-600"
         : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
     }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="w-[90%] mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <Image className="text-blue-600" size={24} />
          <span className="text-lg font-bold text-gray-800">
            Image Gallery
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/liked" className={linkClass}>
              <Heart size={16} />
              Liked
            </NavLink>
          )}

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
                         text-red-600 hover:bg-red-50 transition"
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-2">
          <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>
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

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md
                         text-sm font-medium text-red-600 hover:bg-red-50"
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
                         hover:bg-blue-700"
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
