
import React, { useEffect, useState, useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import API from "../api";

// --- Neumorphism Helper Classes ---

const pageShellClass = "flex min-h-screen bg-gradient-to-br from-green-100 to-green-500 font-sans";
const neoListPanelClass = "bg-[#d6f5d6] rounded-3xl p-6 shadow-[10px_10px_30px_#b0d9b0,_-10px_-10px_30px_#ffffff] transition-all duration-300 overflow-hidden";
const neoDetailPanelClass = "bg-[#d6f5d6] rounded-3xl p-8 shadow-[10px_10px_30px_#b0d9b0,_-10px_-10px_30px_#ffffff] transition-all duration-300 overflow-y-auto";

const neoButtonBase = "px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 shadow-[3px_3px_6px_rgba(0,0,0,0.1),-3px_-3px_6px_rgba(255,255,255,0.7)] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]";

const neoApproveButtonClass = `${neoButtonBase} bg-green-600 text-white`;
const neoRejectButtonClass = `${neoButtonBase} bg-red-600 text-white`;

// Filter Tab Style
const neoFilterTabClass = "px-4 py-2 text-sm font-bold rounded-full cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-700/50";
const neoFilterTabInactive = "text-green-800 bg-[#e6fae6] shadow-[2px_2px_5px_#b0d9b0,_-2px_-2px_5px_#ffffff] hover:bg-green-200";

// Task Item Style (List Panel)
const neoTaskItemBase = "p-3 rounded-lg cursor-pointer transition-all duration-200 text-green-900";
const neoTaskItemInactive = "bg-[#e6fae6] hover:shadow-[2px_2px_4px_#b0d9b0,_-2px_-2px_4px_#ffffff]";
const neoTaskItemActive = "bg-[#c8e6c8] shadow-[inset_3px_3px_6px_#a8c7a8,inset_-3px_-3px_6px_#e8ffff] font-extrabold";

// Status Pill
const neoStatusPillClass = "inline-block px-3 py-1 text-xs font-extrabold rounded-full";

// NEW: Sunken box for action buttons
const neoActionButtonBox = "p-4 rounded-xl bg-[#e6fae6] shadow-[inset_4px_4px_8px_#b0d9b0,inset_-4px_-4px_8px_#ffffff]";


const ActivityApproval = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [localMessage, setLocalMessage] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchTasks = async () => {
    if (!user || !user.token) return;
    setLoading(true);
    try {
      const res = await API.get(
        "/tasks/user/all",
      );
      const fetchedTasks = res.data.tasks || [];
      setTasks(fetchedTasks);
      
      // Keep selected task if it still exists and matches the filter, otherwise select first pending
      const currentSelected = fetchedTasks.find(t => t._id === selectedTask?._id);
      if (currentSelected && currentSelected.status === filter) {
         setSelectedTask(currentSelected);
      } else {
         const firstInFilter = fetchedTasks.find(t => t.status === filter);
         setSelectedTask(firstInFilter || null);
      }

    } catch (err) {
      console.error(err);
      setError("Failed to load task submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  // Handle Action (Approve/Reject)
  const handleAction = async (taskId, action) => {
    if (!user || !user.token) return;
    setIsActionLoading(true);
    setLocalMessage(null);

    try {
      await API.put(
        `/tasks/${action}/${taskId}`,
        {},
      );

      // Optimistically update the list status and remove from 'pending' tab
      setTasks(prev => prev.map(t =>
          t._id === taskId ? { ...t, status: action } : t
      ));
      
      // Deselect the task that was just actioned and move to the next pending task
      setSelectedTask(null);
      
      // Set timed success message
      setLocalMessage({
          type: action === 'approve' ? 'success' : 'error',
          text: `Submission successfully ${action}d. Refreshing list...`
      });

      // After action, refresh the full list and reset selected task after a short delay
      setTimeout(() => {
        fetchTasks();
      }, 500);

    } catch (err) {
      console.error(err);
      setError(`Failed to ${action} task.`);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Effect for Timed Confirmation Message
  useEffect(() => {
      if (localMessage) {
          const timer = setTimeout(() => {
              setLocalMessage(null);
          }, 5000);
          return () => clearTimeout(timer);
      }
  }, [localMessage]);

  const handleApprove = (taskId) => handleAction(taskId, 'approve');
  const handleReject = (taskId) => handleAction(taskId, 'reject');


  // Filtered List based on the active tab
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => t.status === filter);
  }, [tasks, filter]);
  
  // Status Class Getter
  const getStatusClasses = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-200 text-green-800";
      case "rejected":
        return "bg-red-200 text-red-800";
      case "pending":
      default:
        return "bg-orange-200 text-orange-800";
    }
  };

  const tabs = ['pending', 'approved', 'rejected'];

  return (
    <div className={pageShellClass}>
      
      {/* 1. Sidebar */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex p-8 sm:p-12 overflow-hidden">
        
        {/* LEFT: Task List Panel (Master) */}
        <div className={`w-1/3 mr-8 flex flex-col ${neoListPanelClass}`}>
          
          <h2 className="text-2xl font-extrabold text-green-900 mb-4">
            Submissions
          </h2>

          {/* Filter Tabs (Improved Styling) */}
          <div className="flex space-x-3 p-2 rounded-xl bg-[#e6fae6] shadow-[inset_2px_2px_4px_#b0d9b0,inset_-2px_-2px_4px_#ffffff] mb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setFilter(tab);
                  setSelectedTask(null); // Clear detail view on tab change
                }}
                className={`${neoFilterTabClass} ${
                  filter === tab
                    ? 'bg-green-600 text-white shadow-md' // Active sunken effect
                    : neoFilterTabInactive // Inactive raised effect
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} ({tasks.filter(t => t.status === tab).length})
              </button>
            ))}
          </div>
          
          {/* List of Tasks (Name & Email Only) */}
          <div className="flex-1 overflow-y-auto pr-2">
            {loading ? (
              <p className="text-center text-green-700 mt-10">Loading...</p>
            ) : filteredTasks.length === 0 ? (
              <p className="text-center text-green-700 mt-10">No {filter} submissions.</p>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task._id}
                  onClick={() => setSelectedTask(task)}
                  className={`
                    ${neoTaskItemBase}
                    ${selectedTask?._id === task._id ? neoTaskItemActive : neoTaskItemInactive}
                  `}
                >
                  <p className="font-semibold">{task.title}</p>
                  <p className="text-xs text-green-700">{task.user?.email}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT: Detail Panel (Detail) */}
        <div className={`w-2/3 flex flex-col ${neoDetailPanelClass}`}>
          <h2 className="text-2xl font-extrabold text-green-900 mb-6 border-b border-green-300/50 pb-4">
            {selectedTask ? (
                <span className="flex justify-between items-center">
                    {selectedTask.title}
                    <span className={`${neoStatusPillClass} ${getStatusClasses(selectedTask.status)} text-base`}>
                        {selectedTask.status.toUpperCase()}
                    </span>
                </span>
            ) : 'Select a Submission'}
          </h2>
          
          {localMessage && (
            <div className={`
                mb-6 p-4 rounded-xl font-bold text-center 
                ${localMessage.type === 'success' 
                    ? 'bg-green-100 text-green-700 shadow-[2px_2px_5px_#b0d9b0]' 
                    : 'bg-red-100 text-red-700 shadow-[2px_2px_5px_#d9b0b0]'}
            `}>
                {localMessage.text}
            </div>
          )}
          
          {/* Detailed Content */}
          {selectedTask ? (
            <div className="flex-1 space-y-4">
                
                {/* Task Metadata (Sunken Block) */}
                <div className="p-4 rounded-xl bg-[#e6fae6] shadow-[inset_2px_2px_4px_#b0d9b0,inset_-2px_-2px_4px_#ffffff] text-sm">
                    <p className="font-bold text-green-900">
                        Submitted by: <span className="font-extrabold">{selectedTask.user?.name}</span>
                        {' ('}
                        <span className="text-green-600">{selectedTask.user?.email}</span>
                        {')'}
                    </p>
                    {selectedTask.experience && (
                        <p className="mt-1 font-bold text-green-900">
                            Value: <span className="text-base text-green-700">{selectedTask.experience} XP</span>
                        </p>
                    )}
                </div>

                {/* Student's Report/Experience */}
                {selectedTask.experience && (
                    <div className="p-4 rounded-xl bg-[#e6fae6] shadow-[inset_2px_2px_4px_#b0d9b0,inset_-2px_-2px_4px_#ffffff]">
                        <p className="font-bold text-green-900 mb-2">Student's Report:</p>
                        <p className="text-sm text-gray-800 whitespace-pre-wrap max-h-40 overflow-y-auto">{selectedTask.experience}</p>
                    </div>
                )}
                
                {/* Submission Image */}
                {selectedTask.image && (
                    <div className="text-center p-2 rounded-xl bg-[#e6fae6] shadow-md">
                        <p className="font-bold text-green-900 mb-2">Proof Image:</p>
                        <img
                            src={`http://localhost:8800${selectedTask.image}`}
                            alt="Submission Proof"
                            className="mt-2 w-full h-auto rounded-lg shadow-lg border border-green-300"
                        />
                    </div>
                )}
                
                {/* Action Buttons (Wrapped in the new sunken box) */}
                {selectedTask.status === "pending" && (
                    <div className={neoActionButtonBox}>
                        <p className="font-bold text-green-900 mb-3">Take Action:</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => handleApprove(selectedTask._id)}
                                className={neoApproveButtonClass}
                                disabled={isActionLoading}
                            >
                                {isActionLoading ? 'Approving...' : 'Approve'}
                            </button>
                            <button
                                onClick={() => handleReject(selectedTask._id)}
                                className={neoRejectButtonClass}
                                disabled={isActionLoading}
                            >
                                {isActionLoading ? 'Rejecting...' : 'Reject'}
                            </button>
                        </div>
                    </div>
                )}

            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
                <p className="text-green-600 text-xl font-medium p-12 bg-[#e6fae6] rounded-xl shadow-[inset_4px_4px_8px_#b0d9b0,inset_-4px_-4px_8px_#ffffff]">
                    👈 Select a submission from the list to view details and process.
                </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityApproval;