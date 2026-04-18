import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GuestNavbar from "../../components/guest/GuestNavbar";
import GuestFooter from "../../components/guest/GuestFooter";

export default function GuestResources() {

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const res = await fetch("/api/paths");
        const data = await res.json();
        setPaths(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchPaths();
  }, []);

  const filtered = paths.filter((p) =>
    (category === "all" || p.category?.toLowerCase() === category.toLowerCase()) &&
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#f8f9fc] min-h-screen">

      <GuestNavbar />

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <h1 className="text-4xl font-bold mb-4">Learning Resources</h1>

        <div className="flex flex-wrap gap-4 mt-6">

          <input
            type="text"
            placeholder="Search..."
            className="p-3 border rounded-xl"
            onChange={(e) => setSearch(e.target.value)}
          />

          <select onChange={(e) => setCategory(e.target.value)} className="p-3 border rounded-xl bg-white outline-none focus:ring-2 focus:ring-primary/20">
            <option value="all">All Categories</option>
            <option value="web">Web Development</option>
            <option value="data">Data Science</option>
            <option value="ai">AI / ML</option>
            <option value="mobile">Mobile Dev</option>
            <option value="cloud">Cloud / DevOps</option>
            <option value="security">Cyber Security</option>
            <option value="design">UI/UX Design</option>
            <option value="gaming">Game Dev</option>
          </select>
        </div>
      </div>

      {/* CARDS */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <p className="text-center text-gray-400">Loading resources...</p>
        ) : filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((p, i) => (
              <div key={i} className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden group border border-gray-100 flex flex-col">
                <div className="h-44 overflow-hidden bg-indigo-50 flex items-center justify-center">
                  {p.image ? (
                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt={p.title} />
                  ) : (
                    <span className="material-icons-round text-5xl text-indigo-200">auto_stories</span>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary transition-colors">{p.title}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span 
                            key={s} 
                            className={`material-icons-round text-sm ${
                              s <= (p.ratings?.reduce((acc, r) => acc + r.rating, 0) / (p.ratings?.length || 1) || 0) 
                              ? 'text-yellow-400' : 'text-gray-200'
                            }`}
                          >
                            star
                          </span>
                        ))}
                        <span className="text-[10px] text-gray-400 font-bold ml-1">
                          ({p.ratings?.length || 0})
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase bg-indigo-50 text-indigo-600 px-2 py-1 rounded shrink-0">
                      {p.category || "Course"}
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
                    {p.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1 text-gray-400">
                      <span className="material-icons-round text-sm">layers</span>
                      <span className="text-xs font-bold uppercase">{p.phases?.length || 0} Phases</span>
                    </div>
                    
                    <button
                      onClick={() => navigate("/login")}
                      className="text-primary font-bold text-sm hover:underline flex items-center gap-1"
                    >
                      Learn More <span className="material-icons-round text-xs">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed">
            <span className="material-icons-round text-gray-200 text-5xl">search_off</span>
            <p className="text-gray-400 mt-4 font-bold">No resources matched your search.</p>
          </div>
        )}
      </div>

      <GuestFooter />
    </div>
  );
}
