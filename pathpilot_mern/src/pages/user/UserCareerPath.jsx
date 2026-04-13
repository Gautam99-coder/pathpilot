  
import { useState, useEffect } from "react";
import UserNavbar from "../../components/user/UserNavbar";
import { Link } from "react-router-dom";
import UserFooter from "../../components/user/UserFooter";

export default function UserCareerPath() {

const [search, setSearch] = useState("");
const [careerPaths, setCareerPaths] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchPaths = async () => {
    try {
      const res = await fetch('/api/paths');
      const data = await res.json();
      setCareerPaths(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };
  fetchPaths();
}, []);

// ✅ FILTER LOGIC
const filteredPaths = careerPaths.filter((item) =>
  item.title.toLowerCase().includes(search.toLowerCase()) ||
  (item.category || '').toLowerCase().includes(search.toLowerCase())
);

return (
  <div className="bg-[#f8f9fc] antialiased">

    <UserNavbar />

    {/* HEADER */}
    <header className="bg-white border-b py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-4">
          Choose Your Career Path
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Explore curated roadmaps and become job-ready 🚀
        </p>
      </div>
    </header>

    {/* SEARCH */}
    <div className="max-w-7xl mx-auto px-6 -mt-8">
      <div className="bg-white rounded-xl p-4 shadow">
        <input
          type="text"
          placeholder="Search (Frontend, DevOps, ML...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 rounded-lg outline-none"
        />
      </div>
    </div>

    {/* CARDS */}
    <main className="max-w-7xl mx-auto px-6 py-20">

      {loading ? (
        <p className="text-center text-gray-400">Loading career paths...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPaths.map((item, index) => (
            <div
              key={item._id || index}
              className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition group"
            >
              {/* IMAGE */}
              <div className="h-40 overflow-hidden bg-indigo-50 flex items-center justify-center">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                ) : (
                  <span className="material-icons-round text-4xl text-indigo-300">route</span>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2 group-hover:text-primary">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  {item.description}
                </p>

                {/* TAG */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  <span className="px-2 py-1 bg-gray-100 text-xs rounded">
                    {item.category || 'Course'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">
                    {item.phases ? `${item.phases.length} Phases` : '0 Phases'}
                  </span>
                  <Link
                    to={`/user/course/${item._id}`}
                    className="text-primary font-semibold"
                  >
                    View →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && filteredPaths.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No results found 😢
        </p>
      )}
    </main>

    <UserFooter/>
  </div>
);
}
