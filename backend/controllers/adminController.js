// controllers/dashboardController.js
import Course from "../models/Course.js";
import Progress from "../models/Progress.js";
import User from "../models/User.js";


// Get all students (admin)
export const getAllStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: "user" }).select("name email createdAt");
    res.status(200).json(students);
  } catch (err) {
    next(err);
  }
};

export const getStudentProgress = async (req, res, next) => {
  try {
    const { id } = req.params;

    const progressList = await Progress.find({ user: id }).populate("course");

    const normalized = progressList
      .filter((p) => p.course) // skip if course is missing
      .map((p) => ({
        _id: p._id,
        isCourseCompleted: p.isCourseCompleted,
        completedLessons: (p.completedLessons || []).map((cl) => ({
          lessonId: cl.lessonId.toString(),
          quizCompleted: cl.quizCompleted,
          quizScore: cl.quizScore ?? 0,
        })),
        course: {
          _id: p.course._id.toString(),
          title: p.course.title,
          lessons: (p.course.lessons || []).map((l) => ({
            _id: l._id.toString(),
            title: l.title,
            quizzes: l.quizzes || [],
          })),
        },
      }));

    res.status(200).json(normalized);
  } catch (err) {
    console.error("Error fetching student progress:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};



// GET /api/admin/dashboard
export const getDashboardStats = async (req, res, next) => {
  try {
    const courses = await Course.find();

    const courseStats = await Promise.all(
      courses.map(async (course) => {
        const progressList = await Progress.find({ course: course._id })
          .populate("user", "name email");

        const lessonsCount = course.lessons.length;
        const quizzesCount = course.lessons.reduce(
          (sum, lesson) => sum + (lesson.quizzes?.length || 0),
          0
        );

        return {
          courseId: course._id,
          title: course.title,
          lessons: lessonsCount,
          quizzes: quizzesCount,
          enrolledStudents: progressList.length,
          students: progressList.map(p => ({
            id: p.user?._id,
            name: p.user?.name,
            email: p.user?.email,
          })),
        };
      })
    );

    const totalCourses = courses.length;
    const totalStudents = await User.countDocuments({ role: "user" });

    res.status(200).json({
      totalCourses,
      totalStudents,
      courseStats,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
