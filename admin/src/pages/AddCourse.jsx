import { useState } from "react";
import React from "react"
import Sidebar from "../components/Sidebar";
import API from "../api";

// --- Neumorphism Helper Classes ---

// Main Page Shell
const pageShellClass = "flex min-h-screen bg-gradient-to-br from-green-100 to-green-500 font-sans";
// Raised Card for Form Sections
const neoCardClass = "bg-[#d6f5d6] rounded-3xl p-8 shadow-[10px_10px_30px_#b0d9b0,_-10px_-10px_30px_#ffffff] transition-all duration-300";
// Sunken Input/Textarea
const neoInputClass = "w-full p-3 text-green-900 placeholder-green-400 bg-[#e6fae6] rounded-xl border-none shadow-[inset_4px_4px_8px_#b0d9b0,inset_-4px_-4px_8px_#ffffff] focus:outline-none focus:ring-4 focus:ring-green-500/30 transition-all duration-300";
// Action Button (Green Theme)
const neoButtonClass = (isDisabled) => `
  px-6 py-3 font-bold rounded-xl transition-all duration-300 
  ${isDisabled ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-green-600 text-white hover:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]'}
  shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,0.7)] 
`;

// --- Sub-Components for Nested Forms ---

const QuizForm = ({ lessonIndex, quiz, quizIndex, updateQuiz, updateOption }) => {
  return (
    <div className="bg-[#e6fae6] p-4 rounded-xl shadow-[inset_2px_2px_5px_#b0d9b0,inset_-2px_-2px_5px_#ffffff] mt-3">
      <h5 className="text-md font-bold text-green-800 mb-3">Question {quizIndex + 1}</h5>

      <input
        type="text"
        placeholder="Question Text"
        value={quiz.question}
        onChange={(e) =>
          updateQuiz(lessonIndex, quizIndex, "question", e.target.value)
        }
        className={`${neoInputClass} mb-3`}
      />

      <div className="grid grid-cols-2 gap-3 mb-3">
        {quiz.options.map((opt, oIndex) => (
          <input
            key={oIndex}
            type="text"
            placeholder={`Option ${oIndex + 1}`}
            value={opt}
            onChange={(e) =>
              updateOption(lessonIndex, quizIndex, oIndex, e.target.value)
            }
            className={`${neoInputClass} !p-2`}
          />
        ))}
      </div>

      <input
        type="text"
        placeholder="Correct Answer (Must match one option)"
        value={quiz.correctAnswer}
        onChange={(e) =>
          updateQuiz(lessonIndex, quizIndex, "correctAnswer", e.target.value)
        }
        className={neoInputClass}
      />
    </div>
  );
};

const LessonForm = ({ lesson, lIndex, updateLesson, addQuiz }) => {
  return (
    <div className={`${neoCardClass} !p-6 mt-6 border-2 border-green-400`}>
      <h4 className="text-xl font-extrabold text-green-800 mb-4 border-b border-green-300 pb-2">
        Lesson {lIndex + 1}: {lesson.title || "Untitled Lesson"}
      </h4>

      <input
        type="text"
        placeholder="Lesson Title"
        value={lesson.title}
        onChange={(e) => updateLesson(lIndex, "title", e.target.value)}
        className={`${neoInputClass} mb-4`}
      />

      <textarea
        placeholder="Lesson Content"
        value={lesson.content}
        onChange={(e) => updateLesson(lIndex, "content", e.target.value)}
        className={`${neoInputClass} mb-4 h-24`}
      />

      <input
        type="url"
        placeholder="Video URL (optional, e.g., YouTube link)"
        value={lesson.videoUrl}
        onChange={(e) => updateLesson(lIndex, "videoUrl", e.target.value)}
        className={`${neoInputClass} mb-6`}
      />

      <button onClick={() => addQuiz(lIndex)} className={neoButtonClass(false)}>
        ➕ Add Quiz Question
      </button>

      {lesson.quizzes.map((quiz, qIndex) => (
        <QuizForm
          key={qIndex}
          lessonIndex={lIndex}
          quiz={quiz}
          quizIndex={qIndex}
          updateQuiz={updateQuiz}
          updateOption={updateOption}
        />
      ))}
    </div>
  );
};


// --- Main Component ---

const AddCourse = () => {
  const [course, setCourse] = useState({
    title: "",
    description: "",
    category: "",
    lessons: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleCourseChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  // ... (Lesson and Quiz update logic remains the same, but simplified removal/order is omitted for brevity)

  // ---------- LESSON ----------
  const addLesson = () => {
    setCourse({
      ...course,
      lessons: [
        ...course.lessons,
        {
          title: "",
          content: "",
          order: course.lessons.length + 1,
          videoUrl: "",
          quizzes: [],
        },
      ],
    });
  };

  const updateLesson = (index, field, value) => {
    const updatedLessons = [...course.lessons];
    updatedLessons[index][field] = value;
    setCourse({ ...course, lessons: updatedLessons });
  };

  // ---------- QUIZ ----------
  const addQuiz = (lessonIndex) => {
    const updatedLessons = [...course.lessons];
    updatedLessons[lessonIndex].quizzes.push({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
    });
    setCourse({ ...course, lessons: updatedLessons });
  };

  const updateQuiz = (lessonIndex, quizIndex, field, value) => {
    const updatedLessons = [...course.lessons];
    updatedLessons[lessonIndex].quizzes[quizIndex][field] = value;
    setCourse({ ...course, lessons: updatedLessons });
  };

  const updateOption = (lessonIndex, quizIndex, optIndex, value) => {
    const updatedLessons = [...course.lessons];
    updatedLessons[lessonIndex].quizzes[quizIndex].options[optIndex] = value;
    setCourse({ ...course, lessons: updatedLessons });
  };


  // ---------- SUBMIT ----------
  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/courses/course",
        course,
      );

      setMessage({ type: 'success', text: "Course added successfully! You can now view it in the Course Info page." });
      setCourse({ title: "", description: "", category: "", lessons: [] });
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to add course. Please check all fields.";
      setMessage({ type: 'error', text: msg });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 8000);
    }
  };

  return (
    <div className={pageShellClass}>
      
      {/* 1. Sidebar */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <main className="flex-1 p-8 sm:p-12">
        <h1 className="text-3xl font-extrabold text-green-900 mb-8 tracking-tight">
          ➕ Create New Course
        </h1>
        
        {/* Main Course Details Card */}
        <div className={neoCardClass}>
          
          <h2 className="text-2xl font-extrabold text-green-800 mb-6 border-b border-green-300 pb-3">
            Course Details
          </h2>
          
          {message && (
            <div className={`
              p-4 mb-6 rounded-lg font-medium text-center 
              ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
            `}>
              {message.text}
            </div>
          )}

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Course Title"
              name="title"
              value={course.title}
              onChange={handleCourseChange}
              className={neoInputClass}
            />

            <textarea
              placeholder="Description"
              name="description"
              value={course.description}
              onChange={handleCourseChange}
              className={`${neoInputClass} h-28`}
            />

            <input
              type="text"
              placeholder="Category (e.g., Waste Management, Carbon Footprint)"
              name="category"
              value={course.category}
              onChange={handleCourseChange}
              className={neoInputClass}
            />
          </div>
        </div>
        
        {/* Lesson Management */}
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-extrabold text-green-800">
                    Course Lessons ({course.lessons.length})
                </h2>
                <button onClick={addLesson} className={neoButtonClass(false)}>
                    ➕ Add Lesson
                </button>
            </div>

            {course.lessons.length === 0 && (
                <p className="text-green-700 p-4 bg-green-100 rounded-lg shadow-inner">
                    Start by adding the first lesson structure above.
                </p>
            )}

            {course.lessons.map((lesson, lIndex) => (
                <LessonForm
                    key={lIndex}
                    lesson={lesson}
                    lIndex={lIndex}
                    updateLesson={updateLesson}
                    addQuiz={addQuiz}
                />
            ))}
        </div>

        {/* Submit Button */}
        <div className="mt-12 pt-8 border-t-4 border-green-300/50">
            <button 
                onClick={handleSubmit} 
                disabled={loading || course.title.length === 0}
                className={neoButtonClass(loading || course.title.length === 0) + ' w-full text-xl'}
            >
                {loading ? "Creating Course..." : "✅ Finalize & Create Course"}
            </button>
        </div>
      </main>
    </div>
  );
};

export default AddCourse;