// src/pages/QuizPage.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";

const QuizPage = () => {
  const { user } = useContext(AuthContext);
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchLesson = async () => {
      try {
        const res = await API.get(`/courses/${courseId}/lessons/${lessonId}`);
        setLesson(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLesson();
  }, [user, courseId, lessonId]);

  const handleChange = (quizId, value) => {
    setAnswers(prev => ({ ...prev, [quizId]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = Object.entries(answers).map(([quizId, answer]) => ({ quizId, answer }));
      const res = await API.post(`/courses/${courseId}/lessons/${lessonId}/quiz`, { answers: payload });

      if (res.data.success) {
        alert(`Quiz completed! Your score: ${res.data.score}/${lesson.quizzes.length}`);
        navigate(`/home/courses/${courseId}`);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!lesson) return <div className="text-green-800 font-semibold">Loading quiz...</div>;

  const quizzes = lesson.quizzes || [];
  const currentQuestion = quizzes[currentIndex];
  const atFirst = currentIndex === 0;
  const atLast = currentIndex === quizzes.length - 1;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <button className="neo-btn px-4 py-2 text-sm" onClick={() => navigate(`/home/courses/${courseId}`)}>
        ← Back to Course
      </button>

      <div className="neo-card rounded-[28px] p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-4xl font-extrabold text-green-900 leading-tight">Quiz: {lesson.title}</h2>
          <div className="neo-chip text-sm">{currentIndex + 1} / {quizzes.length}</div>
        </div>

        {currentQuestion && (
          <div className="neo-card-ghost space-y-5 p-5">
            <p className="font-semibold text-green-900 text-xl leading-relaxed">
              {currentIndex + 1}. {currentQuestion.question}
            </p>
            <div className="space-y-3">
              {currentQuestion.options.map((opt, i) => {
                const checked = answers[currentQuestion._id] === opt;
                return (
                  <label
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-2xl border transition cursor-pointer ${
                      checked ? "border-green-500 bg-[#e9f7e9]" : "border-transparent bg-white/60"
                    } shadow-[6px_6px_16px_#b0d9b0,-6px_-6px_16px_#ffffff]`}
                  >
                    <input
                      type="radio"
                      name={`q-${currentQuestion._id}`}
                      value={opt}
                      onChange={() => handleChange(currentQuestion._id, opt)}
                      checked={checked}
                      className="mt-1 h-5 w-5 rounded-full border-2 border-green-600 text-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                    <span className="text-lg text-green-900 leading-snug">{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <button
            className="neo-btn px-5 py-2 text-sm"
            disabled={atFirst}
            onClick={() => !atFirst && setCurrentIndex((i) => i - 1)}
          >
            ← Previous
          </button>
          <div className="text-sm font-semibold text-green-900">
            Question {currentIndex + 1} of {quizzes.length}
          </div>
          <button
            className="neo-btn px-5 py-2 text-sm"
            disabled={atLast}
            onClick={() => !atLast && setCurrentIndex((i) => i + 1)}
          >
            Next →
          </button>
        </div>

        <button onClick={handleSubmit} className="neo-btn px-6 py-3 font-semibold w-full text-lg">
          Submit Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizPage;
