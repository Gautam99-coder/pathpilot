import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserSidebar from "../../components/user/UserSidebar";

export default function UserRoadmaps() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }

    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/user/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setEnrollments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  const totalProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length)
    : 0;

  return (
    <div className="flex h-screen bg-bg-light antialiased overflow-hidden">
      <UserSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 z-20">
          <nav className="text-sm text-gray-400 flex items-center font-medium">
            User
            <span className="material-icons-round mx-2 text-xs">chevron_right</span>
            <span className="text-primary font-bold">My Enrollments</span>
          </nav>
        </header>

        <main className="flex-1 overflow-y-auto p-10">

          {/* TOP */}
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Learning Paths</h1>
              <p className="text-gray-500 text-sm font-medium mt-1">Track your enrolled courses and progress.</p>
            </div>
            <Link
              to="/user/career-paths"
              className="px-8 py-3.5 bg-primary text-white rounded-2xl flex items-center gap-2 hover:bg-primary-dark transition shadow-lg shadow-primary/20 font-bold active:scale-95"
            >
              <span className="material-icons-round">explore</span>
              Browse Paths
            </Link>
          </div>

          {/* METRICS */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-6 border border-white/50 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Enrolled Paths</p>
              <h2 className="text-2xl font-black text-gray-800">{loading ? '...' : enrollments.length}</h2>
            </div>
            <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-6 border border-white/50 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Completed</p>
              <h2 className="text-2xl font-black text-primary">
                {loading ? '...' : enrollments.filter(e => e.progress === 100).length}
              </h2>
            </div>
            <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-6 border border-white/50 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Avg. Progress</p>
              <h2 className="text-2xl font-black text-gray-800">{loading ? '...' : `${totalProgress}%`}</h2>
            </div>
          </div>

          {/* LIST */}
          <div className="max-w-6xl mx-auto space-y-6">
            {loading ? (
              [1,2,3].map(i => <div key={i} className="bg-white rounded-[2rem] h-24 animate-pulse border border-gray-100" />)
            ) : enrollments.length > 0 ? (
              enrollments.map((enroll) => {
                const path = enroll.careerPath;
                return (
                  <div
                    key={enroll._id}
                    className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6 group"
                  >
                    {/* LEFT */}
                    <div className="flex items-center gap-6 flex-1">
                      <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm overflow-hidden">
                        {path?.image ? (
                          <img src={path.image} className="w-full h-full object-cover" alt={path?.title} />
                        ) : (
                          <span className="material-icons-round text-2xl">route</span>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 leading-tight">{path?.title || 'Career Path'}</h3>
                        <div className="flex flex-wrap items-center gap-4 mt-2">
                          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-1">
                            <span className="material-icons-round text-xs">layers</span>
                            {path?.phases?.length || 0} PHASES
                          </span>
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            enroll.progress === 100
                              ? 'bg-green-50 text-green-600 border-green-100'
                              : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                          }`}>
                            {enroll.progress === 100 ? 'Completed' : `${enroll.progress || 0}% Done`}
                          </span>
                        </div>
                        {/* Progress bar */}
                        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3 max-w-xs">
                          <div className="h-1.5 bg-indigo-500 rounded-full" style={{ width: `${enroll.progress || 0}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/user/progress/${path?._id}`}
                        className="px-5 py-2.5 bg-indigo-50 text-primary rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all"
                      >
                        {enroll.progress === 100 ? 'View' : 'Continue'}
                      </Link>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="py-20 text-center bg-white border-2 border-dashed border-gray-100 rounded-[3rem]">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-icons-round text-4xl text-gray-200">school</span>
                </div>
                <h3 className="text-xl font-bold text-gray-400">No enrollments yet.</h3>
                <p className="text-gray-300 text-sm mt-2 mb-8 max-w-xs mx-auto">
                  Start learning by enrolling in a career path.
                </p>
                <Link to="/user/career-paths" className="text-primary font-bold hover:underline">
                  Browse Career Paths →
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
