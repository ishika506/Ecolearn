import React, { useEffect, useState, useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar"; // Import the SearchBar component
import API from "../api";

// Custom Neumorphism Button Class for the 'View Progress' action (defined in previous turn)
const neoActionButtonClass = `
  text-green-700 font-semibold text-sm 
  px-4 py-2 rounded-lg 
  transition-all duration-300 
  bg-[#d6f5d6]
  shadow-[3px_3px_6px_#b0d9b0,_-3px_-3px_6px_#ffffff]
  hover:shadow-[inset_2px_2px_4px_#b0d9b0,inset_-2px_-2px_4px_#ffffff]
  active:shadow-[inset_2px_2px_4px_#b0d9b0,inset_-2px_-2px_4px_#ffffff]
`;

const StudentInfo = () => {
  const { user } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.token) {
      navigate("/signin");
      return;
    }

    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await API.get(
          "/admin/students",
         
        );
        setStudents(res.data);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user, navigate]);

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
    // Admin Layout Container (Sidebar + Content)
    <div className="flex min-h-screen bg-gradient-to-br from-green-100 to-green-500 font-sans">
      
      {/* 1. Sidebar */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <main className="flex-1 p-8 sm:p-12">
        <h1 className="text-3xl font-extrabold text-green-900 mb-8 tracking-tight">
          👨‍🎓 Student Tracking
        </h1>

        {/* --- Search Bar Integration --- */}
        <div className="mb-8">
            <SearchBar
                onSearch={setSearchQuery} // Pass setSearchQuery as the callback
                placeholder="Search students by name or email..."
            />
        </div>
        {/* ----------------------------- */}

        {/* Neumorphism Table Container */}
        <div 
          className="
            bg-[#d6f5d6] 
            rounded-3xl 
            shadow-[10px_10px_30px_#b0d9b0,_-10px_-10px_30px_#ffffff] 
            overflow-hidden 
            transition-all duration-300
          "
        >
          {loading ? (
            <p className="p-8 text-center text-green-700">Loading student data...</p>
          ) : students.length === 0 ? (
            <p className="p-8 text-center text-green-700">No students registered yet.</p>
          ) : filteredStudents.length === 0 ? (
            <p className="p-8 text-center text-green-700">No students match your search criteria.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-green-800">
                
                {/* Table Header with Sunken Effect */}
                <thead className="text-sm font-semibold uppercase bg-[#c8e6c8] shadow-[inset_0_2px_5px_#a8c7a8,inset_0_-2px_5px_#e8ffff]">
                  <tr>
                    <th className="p-4 rounded-tl-3xl">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Joined</th>
                    <th className="p-4 rounded-tr-3xl text-center">Action</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {filteredStudents.map((s, index) => (
                    <tr 
                      key={s._id} 
                      className={`
                        ${index % 2 === 0 ? 'bg-[#e6fae6]' : 'bg-[#d6f5d6]'}
                        hover:bg-[#c8e6c8] transition-colors duration-200
                      `}
                    >
                      <td className="p-4 font-medium">{s.name}</td>
                      <td className="p-4 text-sm">{s.email}</td>
                      <td className="p-4 text-sm">
                        {new Date(s.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() =>
                            navigate(`/admin/students/${s._id}`)
                          }
                          className={neoActionButtonClass}
                        >
                          View Progress
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentInfo;