import React, { useState, useContext } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // adjust path

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/signin");
  };

  return (
    <header className="px-4 pt-4">
      <nav className="neo-card rounded-[28px] flex justify-between items-center px-6 py-4 max-w-6xl mx-auto text-gray-800">
        <Link to="/home" className="flex items-center gap-2 font-extrabold text-xl text-green-800">
          <span className="text-2xl">🌱</span>
          <span>EcoLearn</span>
        </Link>

        <div className="flex gap-2 items-center relative">
          {[
            { to: "/home/courses", label: "Courses" },
            { to: "/home/quizzes", label: "Tasks" },
            { to: "/home/leaderboard", label: "Leaderboard" },
            { to: "/home/games", label: "Games" },
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full transition shadow-[inset_2px_2px_5px_#b0d9b0,inset_-2px_-2px_5px_#ffffff] bg-[#e5f7e5] text-green-700 font-semibold hover:shadow-[inset_4px_4px_8px_#b0d9b0,inset_-4px_-4px_8px_#ffffff] ${isActive ? "ring-2 ring-green-500" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="neo-btn px-4 py-2 text-sm"
            >
              Profile
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-56 neo-card rounded-2xl p-4 text-gray-800 z-50">
                <div className="pb-3 mb-3 border-b border-green-200">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left font-semibold text-green-700 hover:underline"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
