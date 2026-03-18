import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../api";

// --- Neumorphism Helper Classes ---

// Main Page Shell (Two-column layout)
const pageShellClass = "flex min-h-screen bg-gradient-to-br from-green-100 to-green-500 font-sans";

// Raised Card for Form Container
const neoCardClass = "w-full max-w-lg bg-[#d6f5d6] rounded-[30px] p-10 text-center shadow-[15px_15px_40px_#b0d9b0,_-15px_-15px_40px_#ffffff] transition-all duration-300 mx-auto";

// Dropdown/Select Field (Sunken effect)
const neoSelectClass = `
  w-full p-4 mb-8 text-green-900 bg-[#e6fae6] rounded-xl 
  border-none appearance-none 
  shadow-[inset_4px_4px_8px_#b0d9b0,inset_-4px_-4px_8px_#ffffff] 
  focus:outline-none focus:ring-4 focus:ring-red-500/30
`;

// Delete Button (Red/Danger Neumorphism)
const neoDeleteButtonClass = `
  w-full 
  bg-[#e63946]
  text-white font-bold text-lg 
  px-8 py-4 rounded-xl 
  shadow-[-5px_-5px_12px_rgba(255,255,255,0.7),5px_5px_12px_rgba(0,0,0,0.2)] 
  transition-all duration-300 
  hover:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.15),inset_-5px_-5px_10px_rgba(255,255,255,0.85)] 
  active:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.15),inset_-5px_-5px_10px_rgba(255,255,255,0.85)] 
  focus:outline-none focus:ring-4 focus:ring-red-700/30
`;


const DeleteCourse = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // Success/Error message state

  const token = localStorage.getItem("token");

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses", {
      });
      // Normalize data: ensure it's an array for mapping
      const data = Array.isArray(res.data) ? res.data : res.data.courses || []; 
      setCourses(data);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: "Failed to fetch courses." });
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Delete course
  const handleDelete = async () => {
    if (!selectedCourse) {
      setMessage({ type: 'error', text: "Please select a course to delete." });
      return;
    }

    if (!window.confirm(`Are you absolutely sure you want to permanently delete the course: ${courses.find(c => c._id === selectedCourse)?.title}? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      await API.delete(
        `/courses/course/${selectedCourse}`,
      );

      setMessage({ type: 'success', text: "Course deleted successfully!" });
      setSelectedCourse("");
      fetchCourses(); // refresh list
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to delete course.";
      setMessage({ type: 'error', text: msg });
    } finally {
      setLoading(false);
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <div className={pageShellClass}>
      
      {/* 1. Sidebar */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <main className="flex-1 p-8 sm:p-12 flex justify-center items-start">
        
        {/* Delete Course Card */}
        <div className={neoCardClass}>
          <h2 className="text-3xl font-extrabold text-red-700 mb-8 flex items-center justify-center">
            <span className="mr-3">🗑️</span> Permanently Delete Course
          </h2>
          
          {message && (
            <div className={`
              p-4 mb-6 rounded-lg font-medium 
              ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
            `}>
              {message.text}
            </div>
          )}

          <div className="text-left">
            <label htmlFor="course-select" className="block text-sm font-semibold text-green-900 mb-2 ml-4">
                Select Course to Delete
            </label>
            {/* Dropdown with Neumorphism style */}
            <select
              id="course-select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className={neoSelectClass}
              disabled={loading}
            >
              <option value="" disabled>-- Select Course --</option>
              {courses.length === 0 ? (
                <option value="" disabled>No courses available</option>
              ) : (
                courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title} ({course.lessons?.length || 0} Lessons)
                  </option>
                ))
              )}
            </select>
          </div>

          <button
            onClick={handleDelete}
            disabled={loading || !selectedCourse}
            className={`${neoDeleteButtonClass} ${(!selectedCourse || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "Deleting..." : "⚠️ CONFIRM DELETE"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default DeleteCourse;