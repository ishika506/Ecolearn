import { useEffect, useState } from "react";
import React from "react";
import Sidebar from "../components/Sidebar";
import API from "../api";
// NOTE: These imports are REQUIRED for the chart components below to work.
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- Global Neumorphism Classes ---
const pageShellClass = "flex min-h-screen bg-gradient-to-br from-green-100 to-green-500 font-sans";
const neoCardClass = "bg-[#d6f5d6] rounded-2xl p-6 shadow-[6px_6px_15px_#b0d9b0,_-6px_-6px_15px_#ffffff] transition-all duration-300";
const neoSectionHeaderClass = "text-2xl font-extrabold text-green-900 mb-6 border-b border-green-300/50 pb-2";
const neoStatValueClass = "text-3xl font-extrabold text-green-800";
const neoDetailContentClass = "mt-3 p-4 rounded-lg bg-[#e6fae6] shadow-[inset_3px_3px_7px_#b0d9b0,inset_-3px_-3px_7px_#ffffff]";
const neoDetailSummaryClass = "cursor-pointer font-semibold text-green-700 hover:text-green-800 flex items-center";

// --- CHART COMPONENTS ---

/**
 * Bar chart showing completion rate for each course.
 * @param {Array} data - Array of objects: [{ name: 'Course A', 'Completion Rate': 75 }]
 */
const CompletionBarChart = ({ data }) => (
    <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                barSize={30}
            >
                <XAxis dataKey="name" stroke="#14532D" axisLine={false} tickLine={false} style={{ fontSize: '10px' }} />
                {/* Y-axis shows percentage, hence domain is set */}
                <YAxis unit="%" domain={[0, 100]} stroke="#14532D" style={{ fontSize: '12px' }} /> 
                <Tooltip 
                    contentStyle={{ backgroundColor: '#D6F5D6', border: '1px solid #38A169', borderRadius: '5px' }}
                    formatter={(value, name) => [`${value}%`, name]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Completion Rate" fill="#38A169" radius={[10, 10, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
);

/**
 * Line chart showing mock student activity over time.
 * @param {Array} data - Array of objects: [{ month: 'Jan', ActiveStudents: 400 }]
 */
const ActivityLineChart = ({ data }) => (
    <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
                <XAxis dataKey="month" stroke="#14532D" style={{ fontSize: '10px' }} />
                <YAxis stroke="#14532D" style={{ fontSize: '12px' }} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#D6F5D6', border: '1px solid #38A169', borderRadius: '5px' }}
                />
                <Legend iconType="square" wrapperStyle={{ fontSize: '12px' }} />
                <Line 
                    type="monotone" 
                    dataKey="ActiveStudents" 
                    stroke="#10B981" 
                    strokeWidth={2} 
                    dot={{ fill: '#38A169', r: 4 }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

// --- MAIN DASHBOARD COMPONENT ---

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchStats = async () => {
    try {
      const res = await API.get(
        "/admin/dashboard",
      );
      setStats(res.data); 
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading || error || !stats) {
    const message = loading ? 'Loading dashboard...' : error || 'No dashboard data available';
    const messageColor = error ? 'text-red-600' : 'text-green-700';

    return (
        <div className={pageShellClass}>
            <Sidebar />
            <main className="flex-1 p-12 flex justify-center items-center">
                <p className={`${messageColor} text-xl font-medium`}>{message}</p>
            </main>
        </div>
    );
  }

  // --- Data Preparation for Charts ---
  const completionChartData = stats.courseStats?.map(course => ({
      name: course.title,
      // API data is assumed to be a number, converting to percentage scale
      'Completion Rate': parseFloat(course.completionRate) || 0, 
  })) || [];

  // Mock data for student activity, as your API might not return this structured data immediately
  const mockActivityData = [
      { month: 'Jan', ActiveStudents: 15 },
      { month: 'Feb', ActiveStudents: 22 },
      { month: 'Mar', ActiveStudents: 30 },
      { month: 'Apr', ActiveStudents: 45 },
      { month: 'May', ActiveStudents: 50 },
      { month: 'Jun', ActiveStudents: 55 },
  ];

  return (
    <div className={pageShellClass}>
      <Sidebar />

      <main className="flex-1 p-8 sm:p-12">
        {/* HEADER */}
        <h1 className="text-3xl font-extrabold text-green-900 mb-8 tracking-tight">
          📊 Admin Dashboard Overview
        </h1>

        {/* OVERALL STATS */}
        <h2 className={neoSectionHeaderClass}>Platform Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          <div className={neoCardClass}>
            <p className="text-green-600 font-semibold">Total Courses</p>
            <h2 className={neoStatValueClass}>{stats.totalCourses || 0}</h2>
          </div>

          <div className={neoCardClass}>
            <p className="text-green-600 font-semibold">Total Students</p>
            <h2 className={neoStatValueClass}>{stats.totalStudents || 0}</h2>
          </div>

          <div className={neoCardClass}>
            <p className="text-green-600 font-semibold">Pending Approvals</p>
            <h2 className={`${neoStatValueClass} text-orange-600`}>
              {stats.pendingApprovals || 0}
            </h2>
          </div>
        </div>

        {/* CHART INTEGRATION AREA */}
        <h2 className={neoSectionHeaderClass}>Performance Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            
            <div className={neoCardClass}>
                <h3 className="text-xl font-bold text-green-800 mb-4">Course Completion Rate</h3>
                <CompletionBarChart data={completionChartData} />
            </div>

            <div className={neoCardClass}>
                <h3 className="text-xl font-bold text-green-800 mb-4">Student Enrollment & Activity</h3>
                <ActivityLineChart data={mockActivityData} />
            </div>
        </div>


        {/* COURSE STATS */}
        <h2 className={neoSectionHeaderClass}>📚 Detailed Course Breakdown</h2>

        {stats.courseStats.length === 0 && (
          <p className="text-green-600 font-medium">No courses found to display detailed stats.</p>
        )}

        <div className="space-y-6">
            {stats.courseStats.map((course) => (
              <div
                key={course.courseId}
                className={neoCardClass}
              >
                <h3 className="text-xl font-extrabold text-green-900 mb-4 border-b border-green-300/50 pb-2">
                  {course.title}
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-green-600">Lessons</p>
                    <p className="font-bold text-lg text-green-800">{course.lessons}</p>
                  </div>
                  <div>
                    <p className="text-green-600">Total Questions</p> 
                    <p className="font-bold text-lg text-green-800">{course.quizzes}</p>
                  </div>
                  <div>
                    <p className="text-green-600">Enrolled Students</p>
                    <p className="font-bold text-lg text-green-800">{course.enrolledStudents}</p>
                  </div>
                  <div>
                    <p className="text-green-600">Avg. Completion Rate</p>
                    {/* Displaying Completion Rate with a percentage sign */}
                    <p className="font-bold text-lg text-green-800">{course.completionRate ? `${course.completionRate}%` : 'N/A'}</p>
                  </div>
                </div>

                {/* STUDENT LIST COLLAPSIBLE */}
                <details className="mt-4">
                  <summary className={neoDetailSummaryClass}>
                    <span className="mr-2">👀</span> View Enrolled Students ({course.students.length})
                  </summary>

                  <div className={neoDetailContentClass}>
                    {course.students.length === 0 ? (
                      <p className="text-sm text-green-600">
                        No students enrolled in this course yet.
                      </p>
                    ) : (
                      <ul className="mt-1 space-y-1 text-sm">
                        {course.students.map((student) => (
                          <li
                            key={student.id}
                            className="flex justify-between border-b border-green-300/50 py-1"
                          >
                            <span className="font-medium text-green-800">{student.name}</span>
                            <span className="text-green-600">{student.email}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </details>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;