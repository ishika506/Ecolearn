import React from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

import Dashboard from "./pages/DashboardPage";
import StudentsPage from "./pages/StudentInfo";
import StudentProgressPage from "./pages/StudentTracking";
import CourseInfo from "./pages/CourseInfo";
import LessonPage from "./pages/LessonPage";
import ActivityApproval from "./pages/ActivityApproval";
import DeleteCourse from "./pages/DeleteCourse";
import AddCourse from "./pages/AddCourse";
import EditCourse from "./pages/EditCourse";

import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      {/* ---------------- PUBLIC ROUTES ---------------- */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* ---------------- PROTECTED ADMIN ROUTES ---------------- */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/students"
        element={
          <ProtectedRoute>
            <StudentsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/students/:id"
        element={
          <ProtectedRoute>
            <StudentProgressPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/courses-info"
        element={
          <ProtectedRoute>
            <CourseInfo />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/courses-info/:courseId"
        element={
          <ProtectedRoute>
            <CourseInfo />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/courses-info/:courseId/lessons/:lessonId"
        element={
          <ProtectedRoute>
            <LessonPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/approvals"
        element={
          <ProtectedRoute>
            <ActivityApproval />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/courses/delete"
        element={
          <ProtectedRoute>
            <DeleteCourse />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/courses/add"
        element={
          <ProtectedRoute>
            <AddCourse />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/courses/edit"
        element={
          <ProtectedRoute>
            <EditCourse />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
