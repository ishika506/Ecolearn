import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";

const CoursePage = () => {
  const { user } = useContext(AuthContext);
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState({ completedLessons: [] });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchCourse = async () => {
      try {
        const res = await API.get(`/courses/${courseId}`);
        setCourse(res.data.course);
        setProgress(res.data.progress || { completedLessons: [] });
      } catch (err) {
        console.error(err);
      }
    };
    fetchCourse();
  }, [user, courseId]);

  if (!course) return <div className="text-center mt-10 text-green-800 font-semibold">Loading course...</div>;

  const allLessonsCompleted =
    course.lessons.length === progress.completedLessons.length &&
    course.lessons.every(lesson =>
      progress.completedLessons.some(l => l.lessonId === lesson._id && (lesson.quizzes.length === 0 || l.quizCompleted))
    );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/home/courses")}
          className="neo-btn px-4 py-2 text-sm"
        >
          ← Back to Courses
        </button>
      </div>

      <div className="neo-card rounded-[28px] p-6 space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-3xl font-bold text-green-900">{course.title}</h2>
          {allLessonsCompleted && (
            <span className="neo-chip text-sm">Course Completed</span>
          )}
        </div>
        <p className="text-green-700">{course.description}</p>
      </div>

      <div className="neo-card rounded-[24px] p-5">
        <h3 className="text-2xl font-semibold text-green-900 mb-4">Lessons</h3>
        <ul className="space-y-3">
          {course.lessons.map((lesson, index) => {
            const progressLesson = progress.completedLessons.find(l => l.lessonId === lesson._id);
            const isLessonCompleted = !!progressLesson;

            const prevLessonId = index > 0 ? course.lessons[index - 1]._id : null;
            const prevCompleted =
              !prevLessonId ||
              progress.completedLessons.some(
                l => l.lessonId === prevLessonId && (course.lessons[index - 1].quizzes.length === 0 || l.quizCompleted)
              );

            const isLocked = !prevCompleted;

            return (
              <li
                key={lesson._id}
                className={`neo-card-ghost flex justify-between items-center ${isLocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                onClick={() => !isLocked && navigate(`/home/courses/${course._id}/lessons/${lesson._id}`)}
              >
                <div className="font-semibold text-green-900">
                  {index + 1}. {lesson.title} {isLessonCompleted && "✅"}
                </div>

                <div className="flex gap-2 items-center">
                  {lesson.quizzes?.length > 0 && isLessonCompleted && !progressLesson?.quizCompleted && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/home/courses/${course._id}/lessons/${lesson._id}/quiz`);
                      }}
                      className="neo-btn px-4 py-2 text-sm"
                    >
                      Take Quiz
                    </button>
                  )}

                  {progressLesson?.quizCompleted && (
                    <span className="text-sm text-green-700 font-semibold">
                      Score: {progressLesson.quizScore || 0}/{lesson.quizzes.length}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default CoursePage;
