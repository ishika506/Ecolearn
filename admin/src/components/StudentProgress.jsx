import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api";

// --- Neumorphism Helper Classes ---

// Raised Card for Course Progress
const neoCourseCardClass = "bg-[#e6fae6] rounded-2xl p-6 mb-8 shadow-[6px_6px_15px_#b0d9b0,_-6px_-6px_15px_#ffffff]";

// Inner Raised/Pill Element (e.g., Status Badge)
const neoPillClass = "inline-block px-3 py-1 text-xs font-semibold rounded-full shadow-[2px_2px_5px_#b0d9b0,_-2px_-2px_5px_#ffffff]";

// Inner Sunken Data Row
const neoLessonRowClass = "flex justify-between items-center py-3 px-4 rounded-xl mb-2 bg-[#d6f5d6] shadow-[inset_2px_2px_5px_#b0d9b0,inset_-2px_-2px_5px_#ffffff]";


const StudentProgress = ({ student }) => {
  const { user } = useContext(AuthContext);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!student || !user || !user.token) return;

    const fetchProgress = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get(
          `/admin/students/${student._id}/progress`,
         
        );

        // Normalize lesson IDs for matching
        const normalized = res.data.map((p) => ({
          ...p,
          completedLessons: (p.completedLessons || []).map((cl) => ({
            lessonId: cl.lessonId.toString(),
            quizCompleted: cl.quizCompleted,
            quizScore: cl.quizScore ?? 0,
          })),
          course: {
            ...p.course,
            lessons: (p.course?.lessons || []).map((l) => ({
              _id: l._id.toString(),
              title: l.title,
              quizzes: l.quizzes || [],
            })),
          },
        }));

        setProgressData(normalized);
      } catch (err) {
        console.error(err);
        setError("Failed to load progress data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [student, user]);

  if (loading) return <p className="text-center text-green-700">Loading student progress...</p>;
  if (error) return <p className="text-red-600 text-center font-medium">{error}</p>;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-green-800">Enrollment & Course Progress</h3>
      
      {/* Student Details (Optional: Can be displayed here or assumed to be in the parent component header) */}
      <div className="text-sm text-green-700 mb-4">
        <p>ID: {student._id}</p>
        <p>Joined: {new Date(student.createdAt).toLocaleDateString()}</p>
      </div>


      {progressData.length === 0 && (
        <p className="text-green-600 font-medium">This student has not enrolled in any courses yet.</p>
      )}

      {progressData.map((p) => (
        <div key={p._id} className={neoCourseCardClass}>
          
          {/* Course Title and Global Status */}
          <div className="flex justify-between items-center border-b border-green-300 pb-4 mb-4">
            <h4 className="text-xl font-extrabold text-green-900">
              📚 {p.course.title}
            </h4>

            {/* Course Status Pill */}
            <p className="text-sm">
              <span className={neoPillClass}>
                {p.isCourseCompleted ? (
                  <span className="text-green-700">✅ Completed</span>
                ) : (
                  <span className="text-orange-600">⏳ In Progress</span>
                )}
              </span>
            </p>
          </div>

          {/* Lesson Tracking List */}
          <div className="mt-3 space-y-2">
            {(p.course.lessons || []).map((lesson) => {
              const lessonProgress = (p.completedLessons || []).find(
                (l) => l.lessonId === lesson._id
              );

              let statusText;
              let statusDetail;
              let statusColorClass;

              if (lessonProgress?.quizCompleted) {
                statusText = "Completed";
                statusDetail = `Score: ${lessonProgress.quizScore}%`;
                statusColorClass = "text-green-700";
              } else if (lessonProgress) {
                statusText = "Lesson Done";
                statusDetail = "Quiz Pending";
                statusColorClass = "text-yellow-600";
              } else {
                statusText = "Not Started";
                statusDetail = "Pending";
                statusColorClass = "text-gray-500";
              }

              return (
                <div key={lesson._id} className={neoLessonRowClass}>
                  <span className="font-medium text-green-900 truncate pr-4">
                    {lesson.title}
                  </span>
                  
                  {/* Status Indicator Group */}
                  <div className={`text-right ${statusColorClass}`}>
                    <p className="font-bold text-sm leading-tight">
                        {statusText}
                    </p>
                    {lessonProgress && (
                        <p className="text-xs leading-tight opacity-80 mt-0.5">
                            {statusDetail}
                        </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentProgress;