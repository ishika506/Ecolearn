import Course from "../models/Course.js";
import Progress from "../models/Progress.js";
import mongoose from "mongoose";

// Get all courses
export const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find(
      {},
      "title description category lessons._id lessons.title lessons.order lessons.quizzes"
    );
    res.status(200).json(courses);
  } catch (err) {
    next(err);
  }
};

// Get single course with progress
export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const progress = await Progress.findOne({ user: req.user.id, course: course._id });
    res.status(200).json({ course, progress });
  } catch (err) {
    next(err);
  }
};

// Get single lesson (locked if previous lesson or quiz not done)
export const getLessonById = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const lessonIndex = course.lessons.findIndex(l => l._id.toString() === lessonId);
    if (lessonIndex === -1) return res.status(404).json({ message: "Lesson not found" });

    const progress = await Progress.findOne({ user: req.user.id, course: courseId });

    // Lock if previous lesson or its quiz not completed
    if (lessonIndex > 0) {
      const prevLessonId = course.lessons[lessonIndex - 1]._id.toString();
      const prevProgress = progress?.completedLessons?.find(l => l.lessonId.toString() === prevLessonId);

      if (!prevProgress || 
          (course.lessons[lessonIndex - 1].quizzes.length > 0 && !prevProgress.quizCompleted)
      ) {
        return res.status(403).json({ message: "Lesson is locked." });
      }
    }

    res.status(200).json(course.lessons[lessonIndex]);
  } catch (err) {
    next(err);
  }
};

// Complete lesson (without quiz)
// Complete lesson (without quiz)
export const completeLesson = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    let progress = await Progress.findOne({ user: req.user.id, course: courseId });
    if (!progress) progress = new Progress({ user: req.user.id, course: courseId, completedLessons: [] });

    const lessonObjectId = new mongoose.Types.ObjectId(lessonId);

    let existingLesson = progress.completedLessons.find(l => l.lessonId.toString() === lessonId);
    if (!existingLesson) {
      const lessonData = course.lessons.id(lessonId);
      existingLesson = {
        lessonId: lessonObjectId,
        quizCompleted: lessonData.quizzes.length === 0, // ✅ mark true if no quiz
        quizScore: 0,
      };
      progress.completedLessons.push(existingLesson);
    }

    progress.currentLesson = lessonObjectId;

    // Check if all lessons are completed
    const allCompleted = course.lessons.every(l => {
      const lp = progress.completedLessons.find(cl => cl.lessonId.toString() === l._id.toString());
      return lp && (l.quizzes.length === 0 || lp.quizCompleted);
    });
    progress.isCourseCompleted = allCompleted;

    await progress.save();
    res.status(200).json(progress);
  } catch (err) {
    next(err);
  }
};


// Submit or retake quiz
export const submitQuiz = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.params;
    const { answers } = req.body; // [{ quizId, answer }]

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const lesson = course.lessons.id(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    // Calculate score
    let score = 0;
    lesson.quizzes.forEach(quiz => {
      const userAnswer = answers.find(a => a.quizId === String(quiz._id));
      if (userAnswer && userAnswer.answer === quiz.correctAnswer) score++;
    });

    // Find or create progress
    let progress = await Progress.findOne({ user: req.user.id, course: courseId });
    if (!progress) progress = new Progress({ user: req.user.id, course: courseId, completedLessons: [] });

    let existingLesson = progress.completedLessons.find(l => l.lessonId.toString() === lessonId);
    if (!existingLesson) {
      existingLesson = { lessonId, quizCompleted: true, quizScore: score };
      progress.completedLessons.push(existingLesson);
    } else {
      existingLesson.quizCompleted = true; // mark quiz done
      existingLesson.quizScore = score; // update score
    }

    progress.currentLesson = new mongoose.Types.ObjectId(lessonId);

    // Check if course fully completed
    const allCompleted = course.lessons.every(l => {
      const lp = progress.completedLessons.find(cl => cl.lessonId.toString() === l._id.toString());
      return lp && (l.quizzes.length === 0 || lp.quizCompleted);
    });
    progress.isCourseCompleted = allCompleted;

    await progress.save();

    res.status(200).json({ success: true, score, isCourseCompleted: progress.isCourseCompleted });
  } catch (err) {
    next(err);
  }
};
// Delete course (ADMIN)
export const deleteCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Optional but RECOMMENDED:
    // Delete all progress related to this course
    await Progress.deleteMany({ course: courseId });

    await Course.findByIdAndDelete(courseId);

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE COURSE (Admin)
export const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        lessons: req.body.lessons, // includes added/edited lessons & quizzes
      },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({
      success: true,
      course: updatedCourse,
    });
  } catch (err) {
    console.error("Update course error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.lessons = course.lessons.filter(
      (lesson) => lesson._id.toString() !== lessonId
    );

    await course.save();

    res.status(200).json({
      success: true,
      message: "Lesson deleted successfully",
      course,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    const { courseId, lessonId, quizId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const lesson = course.lessons.id(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    lesson.quizzes = lesson.quizzes.filter(
      (quiz) => quiz._id.toString() !== quizId
    );

    await course.save();

    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
      course,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
