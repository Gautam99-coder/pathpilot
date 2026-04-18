  
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GuestNavbar from '../../components/guest/GuestNavbar';
import GuestFooter from '../../components/guest/GuestFooter';

export default function GuestHome() {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const res = await fetch('/api/paths');
        const data = await res.json();
        setPaths(Array.isArray(data) ? data.slice(0, 3) : []); // Show only top 3 on home
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchPaths();
  }, []);
  return (
    <div className="bg-gray-50 antialiased">
      <GuestNavbar />

      {/* Hero */}
      <section className="hero-gradient text-white py-24 px-4 text-center">
        <span className="bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase">
          Guest Access
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold mt-8 mb-6 leading-tight tracking-tight">
          Start Your IT Career<br />Journey with Guidance
        </h1>
        <p className="text-indigo-100 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
          Explore career roadmaps, discover skill gaps, and get industry guidance —
          but create an account to unlock full learning features.
        </p>
        <div className="flex justify-center gap-6 flex-wrap">
          <Link to="/path-finder" className="px-8 py-3.5 rounded-xl font-bold text-primary bg-white hover:scale-105 transition shadow-xl flex items-center gap-2">
            <span className="material-icons-round text-sm">explore</span>
            Choose Your Path
          </Link>
          <Link to="/login" className="px-8 py-3.5 rounded-xl font-bold text-white border border-white/40 hover:bg-white/10 transition">
            Member Login
          </Link>
        </div>
      </section>

      {/* Career Paths */}
      <section className="max-w-7xl mx-auto py-24 px-6">
        <div className="flex justify-between items-baseline mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Popular Career Paths</h2>
            <p className="text-gray-500 mt-2">Preview industry-ready roadmaps.</p>
          </div>
          <Link to="/login" className="text-primary font-bold flex items-center gap-2 hover:underline">
            Login to Explore
            <span className="material-icons-round text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="bg-white rounded-2xl h-64 animate-pulse border border-gray-100" />)
          ) : paths.length > 0 ? (
            paths.map((path, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition group border border-gray-100 flex flex-col"
              >
                {/* IMAGE */}
                <div className="h-40 overflow-hidden bg-indigo-50 flex items-center justify-center">
                  {path.image ? (
                    <img
                      src={path.image}
                      alt={path.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <span className="material-icons-round text-5xl text-indigo-200">auto_stories</span>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                      {path.title}
                    </h3>
                    <span className="text-[10px] font-black uppercase bg-indigo-50 text-indigo-600 px-2 py-1 rounded">
                      {path.category}
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {path.description}
                  </p>

                  {/* FOOTER */}
                  <div className="flex justify-between items-center text-sm mt-auto">
                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest flex items-center gap-1">
                      <span className="material-icons-round text-sm">layers</span>
                      {path.phases?.length || 0} PHASES
                    </span>

                    <Link
                      to="/register"
                      className="text-primary font-bold hover:underline flex items-center gap-1"
                    >
                      View Path <span className="material-icons-round text-xs">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 col-span-full">No career paths available at the moment.</p>
          )}
        </div>
      </section>

      <GuestFooter />
    </div>
  )
}
