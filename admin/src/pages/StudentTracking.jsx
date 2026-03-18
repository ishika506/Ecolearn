import React,{ useEffect, useState, useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import StudentProgress from "../components/StudentProgress"; // Assuming this component exists
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar"; // Import the SearchBar component
import API from "../api";

// --- Neumorphism Helper Classes (Used from previous context) ---

// Main Page Shell (Same as other Admin pages)
const pageShellClass = "flex min-h-screen bg-gradient-to-br from-green-100 to-green-500 font-sans";

// Panel Base Class: Raised Container
const neoPanelClass = "bg-[#d6f5d6] rounded-3xl shadow-[10px_10px_30px_#b0d9b0,_-10px_-10px_30px_#ffffff] transition-all duration-300 overflow-hidden";

// Student Item Base Class: Pressable/Selectable Neumorphism tile
const neoStudentItemClass = "p-4 rounded-xl cursor-pointer mb-3 transition-all duration-200 text-green-900";

// Student Item Inactive/Hover State
const neoItemInactiveClass = "bg-[#e6fae6] hover:shadow-[3px_3px_6px_#b0d9b0,_-3px_-3px_6px_#ffffff]";

// Student Item Active/Selected State (Sunken effect)
const neoItemActiveClass = "bg-[#c8e6c8] shadow-[inset_4px_4px_8px_#a8c7a8,inset_-4px_-4px_8px_#e8ffff] font-bold";


const StudentTracking = () => {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    // Basic user/token check
    if (!user || !user.token) return;

    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await API.get(
          "/admin/students",
       
        );
        setStudents(res.data);
        if (res.data.length > 0) {
            setSelectedStudent(res.data[0]); // Select first student by default
        }
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user]);

  // Logic to filter students based on the search query
  const filteredStudents = useMemo(() => {
    if (!searchQuery) {
      return students;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return students.filter(student =>
      student.name.toLowerCase().includes(lowerCaseQuery) ||
      student.email.toLowerCase().includes(lowerCaseQuery)
    );
  }, [students, searchQuery]);


  return (
    <div className={pageShellClass}>
      
      {/* 1. Sidebar (Fixed) */}
      <Sidebar/>
      
      {/* 2. Main Content Area */}
      <div className="flex-1 flex p-8 sm:p-12 overflow-hidden">
        
        {/* LEFT: Student List Panel */}
        <div className={`w-1/3 mr-8 p-6 flex flex-col ${neoPanelClass}`}>
          <h2 className="text-2xl font-extrabold text-green-900 mb-6 border-b border-green-300/50 pb-4">
            👤 All Students
          </h2>
          
          {/* --- Search Bar Integration --- */}
          <div className="mb-6">
            <SearchBar 
                onSearch={setSearchQuery} 
                placeholder="Search by name or email" 
            />
          </div>
          {/* ----------------------------- */}

          <div className="flex-1 overflow-y-auto pr-2"> {/* Scrollable list */}
            {loading ? (
                <p className="text-center text-green-700 mt-10">Loading...</p>
            ) : students.length === 0 ? (
                <p className="text-center text-green-700 mt-10">No students found.</p>
            ) : filteredStudents.length === 0 ? (
                <p className="text-center text-green-700 mt-10">No students match your search.</p>
            ) : (
                filteredStudents.map((s) => ( // Use filteredStudents here
                    <div
                        key={s._id}
                        onClick={() => setSelectedStudent(s)}
                        className={`
                            ${neoStudentItemClass}
                            ${selectedStudent?._id === s._id ? neoItemActiveClass : neoItemInactiveClass}
                        `}
                    >
                        <p className="font-semibold">{s.name}</p>
                        <p className="text-sm text-green-700">{s.email}</p>
                    </div>
                ))
            )}
          </div>
        </div>

        {/* RIGHT: Progress Detail Panel */}
        <div className={`w-2/3 p-8 flex flex-col ${neoPanelClass}`}>
          <h2 className="text-2xl font-extrabold text-green-900 mb-6 border-b border-green-300/50 pb-4">
            {selectedStudent ? `Progress for: ${selectedStudent.name}` : 'Select Student'}
          </h2>

          <div className="flex-1 overflow-y-auto">
            {selectedStudent ? (
              <StudentProgress student={selectedStudent} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-green-600 text-xl font-medium p-12 bg-[#e6fae6] rounded-xl shadow-inner">
                    👆 Select a student from the list to view their detailed progress report.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTracking;