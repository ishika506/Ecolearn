// src/pages/Courses.jsx
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import img1 from "../assets/1.jpg";
import img2 from "../assets/2.png";
import img3 from "../assets/3.webp";
import img4 from "../assets/4.webp";
import img5 from "../assets/5.avif";
import img6 from "../assets/6.webp";
import img7 from "../assets/7.jpeg";
import img8 from "../assets/8.webp";
import img9 from "../assets/9.avif";

const Courses = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const navigate = useNavigate();

  const courseImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9];

  useEffect(() => {
    if (!user) return;

    const fetchCourses = async () => {
      try {
        const res = await API.get("/courses");
        const coursesData = res.data || [];

        const progressRes = await Promise.all(
          coursesData.map(course =>
            API.get(`/courses/${course._id}`).then(r => ({
              courseId: course._id,
              completedLessons: r.data.progress?.completedLessons || [],
              isCourseCompleted: r.data.progress?.completedLessons?.length === course.lessons.length &&
                course.lessons.every(l =>
                  r.data.progress?.completedLessons.some(cl => cl.lessonId === l._id && (l.quizzes.length === 0 || cl.quizCompleted))
                )
            }))
          )
        );

        const progressObj = {};
        progressRes.forEach(p => {
          progressObj[p.courseId] = {
            completedLessons: p.completedLessons,
            isCourseCompleted: p.isCourseCompleted
          };
        });

        setCourses(coursesData);
        setProgressMap(progressObj);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCourses();
  }, [user]);

  if (!user) return <div className="text-center text-green-800 font-semibold">Please login to view courses.</div>;

  return (
    <div className="space-y-8">
      <div className="neo-card rounded-[28px] p-6 flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-green-900">Courses</h2>
        <p className="text-green-700">Pick a course to continue your eco journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => {
          const progress = progressMap[course._id] || { completedLessons: [], isCourseCompleted: false };
          const courseImage = courseImages[index % 9];

          return (
            <div
              key={course._id}
              className="neo-card rounded-[24px] p-6 flex flex-col gap-4 h-full transform transition hover:shadow-lg"
            >
              {/* Course Logo Image */}
              <div className="w-full h-40 rounded-[16px] overflow-hidden border-2 border-gray-300 shadow-md">
                <img
                  src={courseImage}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Course Info */}
              <div className="space-y-2 flex-1">
                <h3 className="text-lg font-bold text-green-900 flex items-center gap-2">
                  {course.title}
                  {progress.isCourseCompleted && <span className="neo-chip text-xs">Completed</span>}
                </h3>
                <p className="text-sm text-green-700 line-clamp-2">{course.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                {course.lessons.some(lesson =>
                  progress.completedLessons.some(l => l.lessonId === lesson._id && !l.quizCompleted && lesson.quizzes?.length > 0)
                ) && (
                  <button
                    className="neo-btn px-4 py-2 text-sm w-full"
                    onClick={() => {
                      const nextQuiz = course.lessons.find(lesson =>
                        progress.completedLessons.some(l => l.lessonId === lesson._id && !l.quizCompleted && lesson.quizzes?.length > 0)
                      );
                      navigate(`/home/courses/${course._id}/lessons/${nextQuiz._id}/quiz`);
                    }}
                  >
                    Take Quiz
                  </button>
                )}

                <button
                  onClick={() => navigate(`/home/courses/${course._id}`)}
                  className="neo-btn px-6 py-2 font-semibold w-full"
                >
                  Start
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Courses;
