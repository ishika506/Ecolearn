import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [courseOpen, setCourseOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/signin");
  };

  // --- Neumorphism/Eco-Learn Styling Classes ---
  
  // Main Container: h-screen and flex-col are correct.
  const sidebarContainerClass = "h-screen w-64 bg-[#d6f5d6] shadow-[8px_8px_20px_#b0d9b0,_-8px_-8px_20px_#ffffff] flex flex-col p-6 transition-all duration-300 font-sans";

  // Base Link Style
  const baseLinkClass = "flex items-center w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 text-green-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-700/50";

  // Active Link Style
  const activeLinkClass = "bg-[#c8e6c8] shadow-[inset_6px_6px_12px_#a8c7a8,inset_-6px_-6px_12px_#e8ffff] text-green-900"; 
  
  // Inactive Link Style
  const inactiveLinkClass = "hover:bg-[#e6fae6] hover:shadow-[3px_3px_8px_#b0d9b0,_-3px_-3px_8px_#ffffff]";

  // Sublink Style
  const subLinkClass = "block px-4 py-2 rounded-lg text-sm transition-colors duration-200 text-green-700 hover:bg-green-100 hover:text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500/50";
  
  // Logout Button Style
  const logoutBtnClass = `
    mt-6 text-red-600 font-bold 
    px-4 py-3 rounded-xl text-left transition-all duration-300 
    bg-white/50 cursor-pointer
    shadow-[3px_3px_8px_rgba(0,0,0,0.05),-3px_-3px_8px_rgba(255,255,255,0.7)]
    hover:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]
    focus:outline-none focus:ring-2 focus:ring-red-500/50
  `;

  // Function to determine link classes
  const getLinkClasses = ({ isActive }) =>
    `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`;


  return (
    <aside className={sidebarContainerClass}>
      
      {/* Logo/Branding (Fixed Top Section) */}
      <div className="flex items-center justify-center mb-10 border-b border-green-300/50 pb-4 shrink-0">
        <span className="text-3xl text-green-700 mr-2">🌱</span>
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          Eco<span className="text-green-700">Learn</span>
        </h1>
      </div>

      {/* Admin Info (Fixed Top Section) */}
      <div className="mb-8 border-b border-green-300/50 pb-4 shrink-0">
        <h2 className="text-xl font-extrabold text-green-900">
          {user?.name || "Admin"}
        </h2>
        <p className="text-sm text-green-600 truncate">{user?.email}</p>
      </div>

      {/* Navigation (SCROLLABLE SECTION) */}
      <nav className="flex-1 space-y-2 overflow-y-auto pr-2"> 
        {/* Added overflow-y-auto and pr-2 (for scrollbar spacing) */}

        <NavLink to="/admin/dashboard" className={getLinkClasses} end>
          <span className="mr-3 text-lg">📊</span> Dashboard
        </NavLink>

        <NavLink to="/admin/students" className={getLinkClasses}>
          <span className="mr-3 text-lg">👨‍🎓</span> Student Tracking
        </NavLink>

        <NavLink to="/admin/courses-info" className={getLinkClasses}>
          <span className="mr-3 text-lg">📚</span> Course Info
        </NavLink>

        {/* Manage Course Dropdown Button */}
        <button
          onClick={() => setCourseOpen(!courseOpen)}
          className={`
            ${baseLinkClass} 
            ${inactiveLinkClass} 
            ${courseOpen ? activeLinkClass : ''} 
            flex justify-between items-center
          `}
        >
          <span className="mr-3 text-lg">🛠</span> Manage Course
          <span className={`ml-auto text-xs transform transition-transform duration-300 ${courseOpen ? "rotate-180" : "rotate-0"}`}>
            ▼
          </span>
        </button>

        {/* Dropdown Content */}
        {courseOpen && (
          <div className="ml-4 space-y-1 py-1 transition-all duration-300 ease-in-out">
            <NavLink to="/admin/courses/edit" className={({ isActive }) => `${subLinkClass} ${isActive ? 'font-bold bg-green-200' : 'font-normal'}`}>
              📄 Edit Courses
            </NavLink>
            <NavLink to="/admin/courses/add" className={({ isActive }) => `${subLinkClass} ${isActive ? 'font-bold bg-green-200' : 'font-normal'}`}>
              ➕ Add Course
            </NavLink>
            <NavLink to="/admin/courses/delete" className={({ isActive }) => `${subLinkClass} ${isActive ? 'font-bold bg-green-200' : 'font-normal'}`}>
              🗑 Delete Course
            </NavLink>
          </div>
        )}

        <NavLink to="/admin/approvals" className={getLinkClasses}>
          <span className="mr-3 text-lg">✅</span> Activity Approvals
        </NavLink>
      </nav>

      {/* Logout (Fixed Bottom Section) */}
      <div className="shrink-0 pt-4"> {/* Wrapper for the logout button */}
          <button
            onClick={handleLogout}
            className={logoutBtnClass}
          >
            <span className="mr-3 text-red-700 text-lg">🚪</span> Logout
          </button>
      </div>
    </aside>
  );
};

export default Sidebar;