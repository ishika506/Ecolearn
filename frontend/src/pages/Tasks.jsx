// src/pages/Tasks.jsx
import React, { useEffect, useState, useContext } from "react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";

const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [image, setImage] = useState(null);
  const [experience, setExperience] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      try {
        const res = await API.get(`/tasks/user/${user._id}`);
        setTasks(res.data.tasks);
      } catch (err) {
        console.error("Failed to fetch tasks:", err.response?.data || err.message);
      }
    };

    fetchTasks();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTask || !image || !experience) {
      setMessage("Please upload image and add experience.");
      return;
    }

    const formData = new FormData();
    formData.append("taskId", selectedTask._id);
    formData.append("image", image);
    formData.append("experience", experience);

    try {
      await API.post("/tasks/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Task submitted successfully!");
      setSelectedTask(null);
      setImage(null);
      setExperience("");

      // Refresh tasks
      const res = await API.get(`/tasks/user/${user._id}`);
      setTasks(res.data.tasks);
    } catch (err) {
      console.error("Failed to submit task:", err.response?.data || err.message);
      setMessage("Submission failed. Try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="neo-card rounded-[28px] p-6 text-center">
        <h2 className="text-3xl font-bold text-green-900">🌱 Eco Tasks</h2>
        <p className="text-green-700">Complete tasks to earn rewards and points.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {tasks.map((task) => (
          <div
            key={task._id}
            className={`neo-card rounded-[24px] p-6 space-y-3 ${task.isUnlocked ? "" : "opacity-60"}`}
          >
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-green-900">{task.title}</h3>
              {!task.isUnlocked && <span className="neo-chip text-xs">Locked</span>}
            </div>
            <p className="text-green-700 line-clamp-2">{task.instructions}</p>
            {task.lockedUntilCourse && (
              <p className="text-sm text-green-800">
                Unlocks after course: {task.lockedUntilCourse.title}
              </p>
            )}
            <p className="text-sm font-semibold text-green-800">
              Status: {task.isUnlocked ? task.status : "Locked"}
            </p>

            {task.userSubmission && (
              <div className="mt-3 space-y-2">
                <p className="font-semibold text-green-900">Your Submission:</p>
                {task.userSubmission.image && (
                  <img
                    src={`http://localhost:8800${task.userSubmission.image}`}
                    alt="Submission"
                    className="rounded-2xl shadow-[10px_10px_26px_#b0d9b0,_-10px_-10px_26px_#ffffff] max-h-48 object-cover"
                  />
                )}
                {task.userSubmission.experience && (
                  <p className="text-green-800 italic">
                    "{task.userSubmission.experience}"
                  </p>
                )}
              </div>
            )}

            {task.isUnlocked && task.status === "not_started" && (
              <button
                onClick={() => setSelectedTask(task)}
                className="neo-btn px-4 py-2 text-sm"
              >
                Submit
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedTask && (
        <div className="fixed inset-0 bg-green-900/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="neo-card rounded-[28px] p-6 max-w-lg w-full relative">
            <button
              onClick={() => setSelectedTask(null)}
              className="absolute top-3 right-3 text-green-800 font-bold"
              aria-label="Close"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-green-900 mb-3">{selectedTask.title}</h3>
            <p className="text-green-800 mb-4">{selectedTask.instructions}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm font-semibold text-green-800">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="mt-2"
                />
              </label>

              <label className="block text-sm font-semibold text-green-800">
                Experience
                <textarea
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full mt-2 p-3 rounded-2xl bg-[#edf8ed] shadow-[inset_2px_2px_4px_#b0d9b0,inset_-2px_-2px_4px_#ffffff] focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </label>

              <div className="flex gap-3 justify-end">
                <button
                  type="submit"
                  className="neo-btn px-5 py-2 text-sm"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="neo-btn px-5 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>

              {message && <p className="mt-2 text-red-600 font-semibold">{message}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
