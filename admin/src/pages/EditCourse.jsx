import { useEffect, useState } from "react";
import React from "react";
import Sidebar from "../components/Sidebar";
import API from "../api";
// --- GLOBAL NEUMORPHISM CLASSES (Copied from previous context) ---
const pageShellClass = "flex min-h-screen bg-gradient-to-br from-green-100 to-green-500 font-sans";
const neoCardClass = "bg-[#d6f5d6] rounded-3xl p-8 shadow-[10px_10px_30px_#b0d9b0,_-10px_-10px_30px_#ffffff] transition-all duration-300";
const neoInputClass = "w-full p-3 text-green-900 placeholder-green-400 bg-[#e6fae6] rounded-xl border-none shadow-[inset_4px_4px_8px_#b0d9b0,inset_-4px_-4px_8px_#ffffff] focus:outline-none focus:ring-4 focus:ring-green-500/30 transition-all duration-300";
const neoSelectClass = "w-full p-4 mb-6 text-green-900 bg-[#e6fae6] rounded-xl border-none appearance-none shadow-[inset_4px_4px_8px_#b0d9b0,inset_-4px_-4px_8px_#ffffff] focus:outline-none focus:ring-4 focus:ring-green-500/30";
const neoButtonClass = (isDisabled) => `
  px-6 py-3 font-bold rounded-xl transition-all duration-300 
  ${isDisabled ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-green-600 text-white hover:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]'}
  shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,0.7)] 
`;
// Additional helper button for nested actions
const neoNestedButton = (color) => `
  font-bold px-3 py-1 rounded-full text-xs transition-colors duration-200
  ${color === 'add' ? 'bg-green-500 text-white hover:bg-green-600' : 'text-red-600 hover:bg-red-100'}
`;

// Collapsible Header Class (Raised/Pressable)
const neoLessonSummaryClass = `
    font-extrabold cursor-pointer flex justify-between items-center p-4 rounded-xl text-green-900 bg-[#e6fae6] 
    shadow-[3px_3px_6px_#b0d9b0,_-3px_-3px_6px_#ffffff] 
    hover:bg-[#c8e6c8] 
    transition-all duration-300
`;
// Collapsible Body Class (Sunken Container)
const neoLessonBodyClass = "p-6 rounded-b-xl bg-[#d6f5d6] shadow-[inset_4px_4px_8px_#b0d9b0,inset_-4px_-4px_8px_#ffffff]";

// Quiz Form Component
const QuizForm = ({ lessonIndex, quiz, quizIndex, updateQuiz, updateOption, removeQuiz }) => (
    <div className="bg-[#e6fae6] p-4 rounded-xl shadow-[inset_2px_2px_5px_#b0d9b0,inset_-2px_-2px_5px_#ffffff] mt-3">
        <div className="flex justify-between items-center mb-2">
            <h5 className="text-md font-bold text-green-800">Question {quizIndex + 1}</h5>
            <button onClick={() => removeQuiz(lessonIndex, quizIndex)} className={neoNestedButton('delete')}>❌ Delete Question</button>
        </div>
        <input
            type="text"
            placeholder="Question"
            value={quiz.question || ""}
            onChange={(e) => updateQuiz(lessonIndex, quizIndex, "question", e.target.value)}
            className={`${neoInputClass} mb-3`}
        />
        <div className="grid grid-cols-2 gap-3 mb-3">
            {quiz.options.map((opt, oIndex) => (
                <input
                    key={oIndex}
                    type="text"
                    placeholder={`Option ${oIndex + 1}`}
                    value={opt || ""}
                    onChange={(e) => updateOption(lessonIndex, quizIndex, oIndex, e.target.value)}
                    className={`${neoInputClass} !p-2`}
                />
            ))}
        </div>
        <input
            type="text"
            placeholder="Correct Answer"
            value={quiz.correctAnswer || ""}
            onChange={(e) => updateQuiz(lessonIndex, quizIndex, "correctAnswer", e.target.value)}
            className={neoInputClass}
        />
    </div>
);

// Lesson Form Component (Now a DETAILS element)
const LessonForm = ({ lesson, lIndex, updateLesson, addQuiz, updateQuiz, updateOption, removeLesson, removeQuiz }) => {
    // Determine the key for stable rendering
    const lessonKey = lesson._id || `new-${lIndex}`;
    
    // Check if the lesson has been newly added (no _id) or is the first one, 
    // and open it by default if necessary.
    const isOpenByDefault = lesson.title === ""; // Open new lessons automatically

    return (
        <details key={lessonKey} className="mb-4 rounded-xl overflow-hidden shadow-md" open={isOpenByDefault}>
            <summary className={neoLessonSummaryClass}>
                <div className="flex items-center w-full justify-between pr-4">
                    <span className="text-xl">
                        {lIndex + 1}. {lesson.title || "[Click to edit Title]"}
                    </span>
                    <span className="text-sm font-medium text-green-600">
                        {lesson.quizzes.length} Questions
                    </span>
                </div>
            </summary>

            <div className={neoLessonBodyClass}>
                <div className="flex justify-end mb-4">
                    <button onClick={() => removeLesson(lIndex)} className={neoNestedButton('delete')}>❌ Delete Lesson</button>
                </div>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Lesson Title"
                        value={lesson.title || ""}
                        onChange={(e) => updateLesson(lIndex, "title", e.target.value)}
                        className={neoInputClass}
                    />
                    <textarea
                        placeholder="Lesson Content"
                        value={lesson.content || ""}
                        onChange={(e) => updateLesson(lIndex, "content", e.target.value)}
                        className={`${neoInputClass} h-24`}
                    />
                    <input
                        type="url"
                        placeholder="Video URL (optional)"
                        value={lesson.videoUrl || ""}
                        onChange={(e) => updateLesson(lIndex, "videoUrl", e.target.value)}
                        className={neoInputClass}
                    />
                </div>

                <h5 className="text-lg font-bold text-green-800 mt-6 mb-3 border-t border-green-300 pt-3">
                    Quiz Questions ({lesson.quizzes.length})
                </h5>
                
                <button onClick={() => addQuiz(lIndex)} className={`${neoNestedButton('add')} mb-3`}>➕ Add New Question</button>

                {lesson.quizzes.map((quiz, qIndex) => (
                    <QuizForm
                        key={quiz._id || qIndex}
                        lessonIndex={lIndex}
                        quiz={quiz}
                        quizIndex={qIndex}
                        updateQuiz={updateQuiz}
                        updateOption={updateOption}
                        removeQuiz={removeQuiz}
                    />
                ))}
            </div>
        </details>
    );
};


// --- Main Component ---

const EditCourse = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const token = localStorage.getItem("token");

    // ---------------- FETCH COURSES ----------------
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await API.get("/courses", {
                });
                setCourses(res.data);
            } catch (err) {
                console.error("Failed to fetch courses:", err);
                setMessage({ type: 'error', text: "Failed to load course list." });
            }
        };
        fetchCourses();
    }, [token]);

    // ---------------- LOAD COURSE ----------------
    const loadCourse = async (id) => {
        if (!id) {
            setSelectedCourseId("");
            setCourse(null);
            return;
        }
        
        setMessage(null);
        setLoading(true);
        try {
            const res = await API.get(
                `/courses/${id}`,
            );

            const loadedCourse = {
                ...res.data.course,
                lessons: (res.data.course.lessons || []).map(l => ({
                    ...l,
                    quizzes: l.quizzes || [],
                    videoUrl: l.videoUrl || "",
                    content: l.content || ""
                }))
            };

            setCourse(loadedCourse);
            setSelectedCourseId(id);
        } catch (err) {
            console.error("Failed to load course details:", err);
            setMessage({ type: 'error', text: "Failed to load course details for editing." });
        } finally {
            setLoading(false);
        }
    };
    
    // ---------------- COURSE FIELD ----------------
    const handleCourseChange = (e) => {
        setCourse({ ...course, [e.target.name]: e.target.value });
    };

    // ---------------- LESSON HANDLERS ----------------
    const updateLesson = (lIndex, field, value) => {
        const lessons = [...course.lessons];
        lessons[lIndex][field] = value;
        setCourse({ ...course, lessons });
    };
    
    const addLesson = () => {
        const newLesson = { title: "", content: "", order: course.lessons.length + 1, videoUrl: "", quizzes: [] };
        setCourse({ ...course, lessons: [...course.lessons, newLesson] });
    };

    const removeLesson = (lIndex) => {
        if (!window.confirm("Are you sure you want to delete this lesson? This change will be permanent when you click 'Save Changes'.")) return;
        const lessons = [...course.lessons];
        lessons.splice(lIndex, 1);
        setCourse({ ...course, lessons });
    };

    // ---------------- QUIZ HANDLERS ----------------
    const addQuiz = (lIndex) => {
        const lessons = [...course.lessons];
        lessons[lIndex].quizzes.push({ question: "", options: ["", "", "", ""], correctAnswer: "" });
        setCourse({ ...course, lessons });
    };

    const removeQuiz = (lIndex, qIndex) => {
        const lessons = [...course.lessons];
        lessons[lIndex].quizzes.splice(qIndex, 1);
        setCourse({ ...course, lessons });
    };
    
    const updateQuiz = (lIndex, qIndex, field, value) => {
        const lessons = [...course.lessons];
        lessons[lIndex].quizzes[qIndex][field] = value;
        setCourse({ ...course, lessons });
    };

    const updateOption = (lIndex, qIndex, oIndex, value) => {
        const lessons = [...course.lessons];
        lessons[lIndex].quizzes[qIndex].options[oIndex] = value;
        setCourse({ ...course, lessons });
    };

    // ---------------- SAVE ----------------
    const handleUpdate = async () => {
        if (!course || !selectedCourseId) return;
        setLoading(true);
        setMessage(null);
        
        try {
            await API.put(
                `/courses/course/${selectedCourseId}`,
                course,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setMessage({ type: 'success', text: `✅ Course "${course.title}" updated successfully!` });
            
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || "❌ Failed to update course. Please check all fields.";
            setMessage({ type: 'error', text: msg });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(null), 5000);
        }
    };

    return (
        <div className={pageShellClass}>
            
            {/* 1. Sidebar */}
            <Sidebar />

            {/* 2. Main Content Area */}
            <main className="flex-1 p-8 sm:p-12">
                <h1 className="text-3xl font-extrabold text-green-900 mb-8 tracking-tight">
                    📝 Edit Existing Course Content
                </h1>
                
                {/* SELECT COURSE CARD */}
                <div className={`${neoCardClass} max-w-4xl mx-auto mb-8`}>
                    <h2 className="text-2xl font-bold text-green-800 mb-4 border-b border-green-300 pb-3">
                        Select Course to Edit
                    </h2>
                    
                    {/* Dropdown with Neumorphism style */}
                    <select
                        value={selectedCourseId}
                        onChange={(e) => loadCourse(e.target.value)}
                        className={neoSelectClass}
                        disabled={loading}
                    >
                        <option value="">-- Select Course --</option>
                        {courses.map((c) => (
                            <option key={c._id} value={c._id}>
                                {c.title}
                            </option>
                        ))}
                    </select>
                    
                    {loading && <p className="text-center text-green-700 font-medium">Loading details...</p>}

                    {message && (
                        <div className={`
                            p-3 mt-4 rounded-lg font-medium text-center 
                            ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                        `}>
                            {message.text}
                        </div>
                    )}
                </div>


                {/* EDIT FORM */}
                {course && (
                    <div className="space-y-8">
                        
                        {/* Main Course Details Card */}
                        <div className={`${neoCardClass} max-w-4xl mx-auto`}>
                            <h2 className="text-2xl font-extrabold text-green-800 mb-6 border-b border-green-300 pb-3">
                                Edit Course Details: {course.title}
                            </h2>
                            
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Course Title"
                                    name="title"
                                    value={course.title || ""}
                                    onChange={handleCourseChange}
                                    className={neoInputClass}
                                />

                                <textarea
                                    placeholder="Description"
                                    name="description"
                                    value={course.description || ""}
                                    onChange={handleCourseChange}
                                    className={`${neoInputClass} h-28`}
                                />

                                <input
                                    type="text"
                                    placeholder="Category"
                                    name="category"
                                    value={course.category || ""}
                                    onChange={handleCourseChange}
                                    className={neoInputClass}
                                />
                            </div>
                        </div>
                        
                        {/* Lesson Management */}
                        <div className="max-w-4xl mx-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-extrabold text-green-800">
                                    Edit Lessons ({course.lessons.length})
                                </h2>
                                <button onClick={addLesson} className={neoButtonClass(false)}>
                                    ➕ Add New Lesson
                                </button>
                            </div>
                            
                            {course.lessons.length === 0 && (
                                <p className="text-green-700 p-4 bg-green-100 rounded-lg shadow-inner">
                                    No lessons found. Click 'Add New Lesson' above.
                                </p>
                            )}

                            {course.lessons.map((lesson, lIndex) => (
                                <LessonForm
                                    key={lesson._id || lIndex}
                                    lesson={lesson}
                                    lIndex={lIndex}
                                    updateLesson={updateLesson}
                                    addQuiz={addQuiz}
                                    updateQuiz={updateQuiz}
                                    updateOption={updateOption}
                                    removeLesson={removeLesson}
                                    removeQuiz={removeQuiz}
                                />
                            ))}
                        </div>

                        {/* Update Button */}
                        <div className="mt-12 pt-8 border-t-4 border-green-300/50 max-w-4xl mx-auto">
                            <button 
                                onClick={handleUpdate} 
                                disabled={loading}
                                className={neoButtonClass(loading) + ' w-full text-xl'}
                            >
                                {loading ? "Saving Changes..." : "💾 Save Changes to Course"}
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default EditCourse;