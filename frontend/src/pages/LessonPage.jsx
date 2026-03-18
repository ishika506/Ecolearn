// src/pages/LessonPage.jsx
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";

const LessonPage = () => {
  const { user } = useContext(AuthContext);
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchLesson = async () => {
      try {
        const res = await API.get(`/courses/${courseId}/lessons/${lessonId}`);
        setLesson(res.data);

        const courseRes = await API.get(`/courses/${courseId}`);
        const completedLessons = courseRes.data.progress?.completedLessons.map(l => l.lessonId) || [];
        setCompleted(completedLessons.includes(lessonId));
      } catch (err) {
        console.error(err);
      }
    };
    fetchLesson();
  }, [user, courseId, lessonId]);

  const handleCompleteLesson = async () => {
    try {
      const res = await API.post(`/courses/${courseId}/lessons/${lessonId}/complete`);
      setCompleted(true);

      if (res.data.isCourseCompleted) alert("🎉 Congratulations! You have completed this course.");

      navigate(`/home/courses/${courseId}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (!lesson) return <div className="text-green-800 font-semibold">Loading lesson...</div>;

  return (
    <div className="space-y-5">
      <button className="neo-btn px-4 py-2 text-sm" onClick={() => navigate(`/home/courses/${courseId}`)}>
        ← Back to Course
      </button>

      <div className="neo-card rounded-[28px] p-6 space-y-4">
        <h2 className="text-3xl font-bold text-green-900">{lesson.title}</h2>
        <p className="text-green-800 leading-relaxed">{lesson.content}</p>

        {lesson.videoUrl && (
          <div className="my-4 flex justify-center">
            <iframe
              width="100%"
              height="480"
              src={lesson.videoUrl.replace("watch?v=", "embed/")}
              title={lesson.title}
              frameBorder="0"
              allowFullScreen
              className="rounded-2xl shadow-[12px_12px_32px_#b0d9b0,_-12px_-12px_32px_#ffffff]"
            />
          </div>
        )}

        {!completed ? (
          <button onClick={handleCompleteLesson} className="neo-btn px-6 py-3 font-semibold">
            Mark Lesson as Completed
          </button>
        ) : lesson.quizzes?.length > 0 ? (
          <button
            onClick={() => navigate(`/home/courses/${courseId}/lessons/${lessonId}/quiz`)}
            className="neo-btn px-6 py-3 font-semibold"
          >
            Take Quiz
          </button>
        ) : (
          <div className="neo-chip inline-block">Lesson Completed</div>
        )}
      </div>
    </div>
  );
};

export default LessonPage;
