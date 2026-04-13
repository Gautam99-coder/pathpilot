import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import UserNavbar from '../../components/user/UserNavbar'
import UserFooter from '../../components/user/UserFooter'

export default function UserHome() {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEnrollments = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const res = await fetch('/api/user/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        setEnrollments(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    fetchEnrollments()
  }, [])

  return (
    <div className="bg-[#f8f9fc] antialiased">
      <UserNavbar />

      <section className="hero-gradient text-white py-24 px-4 text-center">
        <span className="bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
          Member Dashboard
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold mt-8 mb-6 leading-tight tracking-tight">
          Continue Your IT Career<br />Journey 🚀
        </h1>
        <p className="text-indigo-100 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
          Track progress, explore learning paths, and unlock projects tailored to your goals.
        </p>
        <div className="flex justify-center gap-6 flex-wrap">
          <Link to="/user/path-finder" className="px-8 py-3.5 rounded-xl font-bold text-primary bg-white hover:scale-105 transition shadow-xl flex items-center gap-2">
            <span className="material-icons-round text-sm">explore</span>
            Find Your Path
          </Link>
          <Link to="/user/profile" className="px-8 py-3.5 rounded-xl font-bold text-white border border-white/40 hover:bg-white/10 transition">
            View My Profile
          </Link>
        </div>
      </section>

      {/* MY LEARNING PROGRESS */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">My Learning Progress</h2>
          <Link to="/user/profile" className="text-primary font-bold text-sm hover:underline">View All →</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[1,2,3].map(i => (
               <div key={i} className="h-64 bg-white rounded-[2rem] border animate-pulse" />
             ))}
          </div>
        ) : enrollments.length === 0 ? (
          <div className="py-20 text-center bg-white border-2 border-dashed border-gray-100 rounded-[3rem]">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-icons-round text-4xl text-indigo-200">school</span>
            </div>
            <h3 className="text-xl font-bold text-gray-400">Not enrolled in any paths yet</h3>
            <p className="text-gray-300 text-sm mt-2 mb-8 max-w-xs mx-auto">
              Explore our professional career paths and start your learning journey today.
            </p>
            <Link
              to="/user/career-paths"
              className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition"
            >
              Discover Career Paths
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrollments.map((enroll, i) => {
              const path = enroll.careerPath
              const progress = enroll.progress || 0
              return (
                <Link
                  key={enroll._id || i}
                  to={`/user/progress/${path?._id}`}
                  className="bg-white rounded-[2rem] border border-gray-100 shadow-sm group hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className="h-44 overflow-hidden bg-indigo-50 flex items-center justify-center relative">
                    {path?.image ? (
                      <img src={path.image} alt={path.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                    ) : (
                      <span className="material-icons-round text-5xl text-indigo-200">route</span>
                    )}
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <h4 className="font-bold text-gray-900 text-lg tracking-tight group-hover:text-primary transition-colors">
                      {path?.title || 'Career Path'}
                    </h4>

                    <div className="mt-6 flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="h-1.5 bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>

                    <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-50">
                       <span className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">
                          Continue <span className="material-icons-round text-xs align-middle ml-1">arrow_forward</span>
                       </span>
                       <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                          {path?.phases?.length || 0} Phases
                       </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* Quick Access Cards */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Explore More</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { to: '/user/career-paths', icon: 'alt_route', label: 'Career Paths', sub: 'Explore IT roadmaps', color: 'indigo' },
            { to: '/user/resources', icon: 'library_books', label: 'Resources', sub: 'Simplified library', color: 'purple' },
            { to: '/user/certificates', icon: 'verified', label: 'Certificates', sub: 'Your achievements', color: 'green' },
          ].map(c => (
            <Link key={c.to} to={c.to} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className={`w-12 h-12 bg-${c.color}-50 text-${c.color}-600 rounded-2xl flex items-center justify-center mb-6`}>
                <span className="material-icons-round">{c.icon}</span>
              </div>
              <h3 className={`font-bold text-xl text-gray-900 group-hover:text-${c.color}-600 mb-2`}>{c.label}</h3>
              <p className="text-gray-500 text-sm">{c.sub}</p>
            </Link>
          ))}
        </div>
      </section>
      <UserFooter/>
    </div>
  )
}
