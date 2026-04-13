import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserNavbar from "../../components/user/UserNavbar";
import GuestFooter from "../../components/guest/GuestFooter";

export default function UserCourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [path, setPath] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPath = async () => {
      try {
        const res = await fetch(`/api/paths/${id}`);
        if (res.ok) {
          const data = await res.json();
          setPath(data);
        }
      } catch (err) {
        console.error(err);
      }

      // Check enrollment
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch(`/api/user/progress/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) setIsEnrolled(true);
        } catch (_) {}
      }

      setLoading(false);
    };
    fetchPath();
  }, [id]);

  if (loading) return <div className="flex h-screen items-center justify-center text-gray-400">Loading...</div>;
  if (!path) return <div className="flex h-screen items-center justify-center text-gray-400">Path not found.</div>;

  return (
    <div className="bg-[#f8f9fc] min-h-screen">

      <UserNavbar />

      {/* HEADER */}
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-8">
        <div className="flex justify-between items-center border-b pb-8">

          <div>
            {path.image && (
              <img src={path.image} alt={path.title} className="w-full h-48 object-cover rounded-xl mb-6" />
            )}
            <h1 className="text-4xl font-bold text-gray-900">{path.title}</h1>
            <p className="text-gray-500 mt-2">{path.description}</p>
            <span className="inline-block mt-3 px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase">
              {path.category || 'Course'} • {path.phases?.length || 0} Phases
            </span>
          </div>

          <div className="ml-6 flex-shrink-0">
            {!isEnrolled ? (
              <button
                onClick={() => navigate(`/user/enroll/${id}`)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
              >
                Enroll Now
              </button>
            ) : (
              <button
                onClick={() => navigate(`/user/progress/${id}`)}
                className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition"
              >
                Continue Learning →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PHASES */}
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Course Curriculum</h2>
        {(path.phases || []).map((phase, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl border transition bg-white ${!isEnrolled ? 'opacity-80' : 'hover:shadow-md cursor-pointer'}`}
            onClick={() => isEnrolled && navigate(`/user/progress/${id}`)}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-indigo-600 font-bold uppercase">Phase {index + 1}</span>
                <h3 className="text-lg font-bold mt-1">{phase.title}</h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{phase.content}</p>
              </div>
              <span className="material-icons-round text-gray-300 text-3xl ml-4">
                {isEnrolled ? 'lock_open' : 'lock'}
              </span>
            </div>
            {phase.quizzes?.length > 0 && (
              <p className="text-xs text-gray-400 mt-3">{phase.quizzes.length} Quiz Questions</p>
            )}
          </div>
        ))}

        {!isEnrolled && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 text-center">
            <p className="text-indigo-700 font-semibold mb-3">Enroll to unlock all phases and start learning!</p>
            <button
              onClick={() => navigate(`/user/enroll/${id}`)}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
            >
              Enroll Now — Free
            </button>
          </div>
        )}
      </div>

      <GuestFooter />
    </div>
  );
}
