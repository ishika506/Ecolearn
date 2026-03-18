import React,{ useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar"; // Import Sidebar
import API from "../api";

// --- Neumorphism Helper Classes ---

// Main Page Shell (Two-column layout)
const pageShellClass = "flex min-h-screen bg-gradient-to-br from-green-100 to-green-500 font-sans";

// Main Content Card (Raised container for the entire lesson)
const neoLessonContainerClass = "bg-[#d6f5d6] rounded-3xl p-8 shadow-[10px_10px_30px_#b0d9b0,_-10px_-10px_30px_#ffffff] transition-all duration-300";

// Content/Text Block (Sunken container)
const neoContentBlockClass = "p-6 rounded-xl text-green-900 bg-[#e6fae6] shadow-[inset_4px_4px_8px_#b0d9b0,inset_-4px_-4px_8px_#ffffff] leading-relaxed";

// Quiz Question Card (Smaller Sunken element)
const neoQuizQuestionClass = "p-4 rounded-lg mb-4 text-sm bg-white shadow-[inset_2px_2px_5px_#c8e6c8,inset_-2px_-2px_5px_#ffffff]";

// Back Button Style (Pressable Neumorphism)
const neoBackButtonClass = `
  flex items-center text-green-700 font-semibold px-4 py-2 rounded-xl transition-all duration-300 
  bg-[#c8e6c8] shadow-[2px_2px_5px_#b0d9b0,_-2px_-2px_5px_#ffffff] 
  hover:shadow-[inset_2px_2px_4px_#b0d9b0,inset_-2px_-2px_4px_#ffffff]
  active:shadow-[inset_2px_2px_4px_#b0d9b0,inset_-2px_-2px_4px_#ffffff]
`;


const LessonPage = () => {
  const { user } = useContext(AuthContext);
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLesson = async () => {
      if (!user || !user.token) return navigate("/signin");
      
      try {
        // Get full course data
        const courseRes = await API.get(
          `/courses/${courseId}`,
          
        );

        const course = courseRes.data.course;
        setCourseTitle(course.title);

        // Find the lesson
        const lessonData = course.lessons.find((l) => l._id === lessonId);
        if (!lessonData) throw new Error("Lesson not found");
        setLesson(lessonData);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchLesson();
  }, [user, courseId, lessonId, navigate]);

  if (loading) return (
    <div className={pageShellClass}>
      <Sidebar />
      <main className="flex-1 p-12 flex justify-center items-start">
        <p className="text-green-700 font-medium">Loading lesson...</p>
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

  return (
    <div className={pageShellClass}>
      
      {/* 1. Sidebar */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <main className="flex-1 p-8 sm:p-12">
        
        {/* Back Button and Course Title */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 border-b border-green-300/50 pb-4">
            <h1 className="text-2xl font-extrabold text-green-900 mb-2 md:mb-0">
                {courseTitle}
            </h1>
            <button
                className={neoBackButtonClass}
                onClick={() => navigate(`/admin/courses-info`)}
            >
                ← Back to Courses List
            </button>
        </div>

        {/* Main Lesson Container */}
        <div className={neoLessonContainerClass}>

            {/* Lesson Title */}
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b border-green-400 pb-4">
                {lesson.title}
            </h2>

            {/* Video Player */}
            {lesson.videoUrl && (
                <div className="mb-8 p-4 rounded-xl bg-[#e6fae6] shadow-[inset_4px_4px_8px_#b0d9b0,inset_-4px_-4px_8px_#ffffff]">
                    <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                        <iframe
                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                            src={lesson.videoUrl.replace("watch?v=", "embed/")}
                            title={lesson.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}

            {/* Lesson Content */}
            <div className="mb-10">
                <h3 className="text-xl font-bold text-green-800 mb-3">Content Overview</h3>
                <div className={neoContentBlockClass}>
                    <p>{lesson.content || "No detailed content text available for this lesson."}</p>
                </div>
            </div>

            {/* Quizzes/Questions */}
            {lesson.quizzes?.length > 0 && (
                <div className="mt-8 pt-6 border-t border-green-400/50">
                    <h3 className="text-xl font-bold text-green-800 mb-4">
                        Review Questions ({lesson.quizzes.length})
                    </h3>
                    <div className="space-y-4">
                        {lesson.quizzes.map((q, idx) => (
                            <div key={q._id} className={neoQuizQuestionClass}>
                                <p className="font-extrabold text-green-900 mb-2">
                                    Q{idx + 1}: {q.question}
                                </p>
                                <ul className="list-disc list-inside text-gray-600 pl-4 space-y-1">
                                    {q.options.map((opt, i) => (
                                        <li key={i}>{opt}</li>
                                    ))}
                                </ul>
                                <p className="text-green-700 font-bold text-sm mt-3">
                                    Correct Answer: {q.correctAnswer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default LessonPage;