import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import API from "../api";

// --- Neumorphism Helper Classes ---

// Main Page Shell (Two-column layout)
const pageShellClass = "flex min-h-screen bg-gradient-to-br from-green-100 to-green-500 font-sans";

// Raised Card for Course Container
const neoCourseCardClass = "bg-[#d6f5d6] rounded-3xl p-6 mb-8 shadow-[10px_10px_30px_#b0d9b0,_-10px_-10px_30px_#ffffff] transition-all duration-300";

// Collapsible Lesson Header (Raised/Hover) - Used for the <details><summary>
const neoLessonSummaryClass = `
  font-extrabold cursor-pointer flex justify-between items-center px-4 py-3 rounded-xl 
  text-green-900 bg-[#e6fae6] 
  shadow-[3px_3px_6px_#b0d9b0,_-3px_-3px_6px_#ffffff] 
  transition-all duration-200
`;

// Collapsible Lesson Body (Inner Content Container - Sunken effect)
const neoLessonBodyClass = "p-4 text-sm text-gray-700 bg-[#e6fae6] rounded-b-xl shadow-[inset_4px_4px_8px_#b0d9b0,inset_-4px_-4px_8px_#ffffff]";

// Navigation Indicator (Styled as a small pressable button)
const neoNavButtonClass = `
  ml-4 px-3 py-1 text-xs font-semibold rounded-full text-white bg-green-600 
  shadow-[2px_2px_5px_rgba(0,0,0,0.2)] 
  hover:bg-green-700 active:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.3)]
  transition-all duration-200
`;

const CourseInfo = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { courseId } = useParams(); // Can be null (all courses) or a specific ID
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const url = courseId
          ? `http://localhost:8800/api/courses/${courseId}`
          : "http://localhost:8800/api/courses";

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        // Handle single object vs. array response
        const data = Array.isArray(res.data)
          ? res.data
          : [res.data.course];

        const normalized = data.map((course) => ({
          ...course,
          lessons: (course.lessons || []).map((l) => ({
            ...l,
            _id: l._id.toString(),
            quizzes: l.quizzes || [], // Array of questions
          })),
        }));

        setCourses(normalized);
      } catch (err) {
        console.error(err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user, courseId]);

  if (loading) return (
    <div className={pageShellClass}>
      <Sidebar />
      <main className="flex-1 p-12 flex justify-center items-start">
        <p className="text-green-700 font-medium">Loading courses...</p>
      </main>
    </div>
  );
  
  if (error) return (
    <div className={pageShellClass}>
      <Sidebar />
      <main className="flex-1 p-12 flex justify-center items-start">
        <p className="text-red-600 font-medium">{error}</p>
      </main>
    </div>
  );

  const pageTitle = courseId ? courses[0]?.title : `${courses.length} Course${courses.length !== 1 ? "s" : ""} Available`;

  return (
    <div className={pageShellClass}>
      
      {/* 1. Sidebar */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <main className="flex-1 p-8 sm:p-12">
        <h1 className="text-3xl font-extrabold text-green-900 mb-8 tracking-tight">
          📚 {pageTitle}
        </h1>
        
        {courses.length === 0 && (
          <p className="text-green-700 font-medium">No courses available.</p>
        )}

        <div className="space-y-8">
            {courses.map((course) => (
                // Main Course Card
                <div key={course._id} className={neoCourseCardClass}>
                    
                    {/* Course Header */}
                    <div className="border-b border-green-300/50 pb-4 mb-4">
                        <h2 className="text-2xl font-extrabold text-green-900">{course.title}</h2>
                        <p className="text-green-700 text-sm mt-1">Category: <span className="font-semibold">{course.category || "N/A"}</span></p>
                        <p className="text-green-800 mt-2">{course.description || "No description"}</p>
                        <p className="text-green-900 font-extrabold mt-3">
                            Total Lessons: {course.lessons.length}
                        </p>
                    </div>

                    {/* Lesson List */}
                    <div className="space-y-4">
                        {course.lessons?.map((lesson) => (
                            <details
                                key={lesson._id}
                                className="rounded-xl overflow-hidden shadow-md"
                            >
                                
                                <summary 
                                    className={neoLessonSummaryClass}
                                    // Prevent default collapse behavior on click so only the button navigates
                                    onClick={(e) => {
                                        // Only prevent collapse if the button wasn't the target (default <summary> behavior)
                                        if (e.target.tagName !== 'BUTTON' && e.target.parentElement.tagName !== 'BUTTON') {
                                            e.preventDefault(); 
                                        }
                                    }}
                                >
                                    <div className="flex items-center">
                                        <span className="mr-4">📄</span>
                                        {lesson.title} 
                                        <span className="ml-4 text-sm font-semibold text-green-700">
                                            ({lesson.quizzes?.length || 0} Question{lesson.quizzes?.length !== 1 && "s"})
                                        </span>
                                    </div>
                                    
                                    {/* Navigation Button */}
                                    <button
                                        className={neoNavButtonClass}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Crucial: Stop summary from toggling
                                            navigate(`/admin/courses-info/${course._id}/lessons/${lesson._id}`);
                                        }}
                                    >
                                        View Content →
                                    </button>
                                </summary>

                                {/* Lesson Content Body (The sunken detail area) */}
                                <div className={neoLessonBodyClass}>
                                    <p className="mb-3 border-b border-green-300/50 pb-3">{lesson.content || "No content available"}</p>

                                    {lesson.videoUrl && (
                                    <a
                                        href={lesson.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 font-medium hover:text-blue-800 hover:underline block mb-3"
                                    >
                                        ▶ Watch Video Link
                                    </a>
                                    )}
                                    
                                    <p className="mt-2 text-xs text-gray-500">
                                        *Quiz details are hidden for content review. Click 'View Content' for full quiz breakdown.
                                    </p>
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </main>
    </div>
  );
};

export default CourseInfo;