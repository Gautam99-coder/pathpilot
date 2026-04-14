import { useState, useEffect } from 'react'
import UserSidebar from '../../components/user/UserSidebar'
import { Link } from 'react-router-dom'

export default function UserCertificates() {
  const [certs, setCerts] = useState(() => {
    try {
      const e = JSON.parse(sessionStorage.getItem('enrollments')) || []
      return e.filter(x => x.certificateAwarded)
    } catch { return [] }
  })
  const [loading, setLoading] = useState(() => {
    try { return sessionStorage.getItem('enrollments') === null } catch { return true }
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setLoading(false); return }
    fetch('/api/user/dashboard', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : []
        sessionStorage.setItem('enrollments', JSON.stringify(list))
        setCerts(list.filter(e => e.certificateAwarded))
      })
      .catch(err => { if (!certs.length) setError(err.message) })
      .finally(() => setLoading(false))
  }, [])

  const colors = ['indigo', 'purple', 'blue', 'green', 'orange']

  return (
    <div className="bg-[#f8f9fc] min-h-screen flex antialiased">
      <UserSidebar />
      <main className="flex-grow p-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Certificates</h1>
            <p className="text-gray-500 text-sm mt-1">Achievements you've earned on your journey</p>
          </div>
          {!loading && certs.length > 0 && (
            <span className="bg-indigo-50 text-primary px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
              {certs.length} Earned
            </span>
          )}
        </div>

        {error ? (
           <div className="bg-red-50 border border-red-100 p-12 rounded-[2.5rem] text-center max-w-2xl mx-auto">
             <span className="material-icons-round text-red-400 text-5xl">error_outline</span>
             <h3 className="text-xl font-bold text-red-600 mt-4">Failed to Load Certificates</h3>
             <p className="text-red-400 text-sm mt-1">{error}</p>
             <button onClick={() => window.location.reload()} className="mt-8 px-10 py-3 bg-red-600 text-white rounded-2xl font-bold shadow-lg">Retry</button>
           </div>
        ) : loading ? (
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map(i => <div key={i} className="bg-white rounded-[2.5rem] h-64 animate-pulse border border-gray-100" />)}
          </div>
        ) : certs.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {certs.map((enroll, i) => {
              const path = enroll.careerPath
              const color = colors[i % colors.length]
              return (
                <div key={enroll._id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all">
                  <div className={`bg-${color}-600 p-10 text-white text-center`}>
                    <span className="material-icons-round text-5xl">workspace_premium</span>
                    <h3 className="text-xl font-bold mt-4">{path?.title || 'Career Path'}</h3>
                    <p className="text-white/70 text-sm mt-2">Certificate of Completion</p>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Certificate ID</p>
                        <p className="font-black text-primary font-mono mt-1">PP-{String(enroll._id).slice(-6).toUpperCase()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Issued</p>
                        <p className="font-bold text-gray-800 mt-1">
                          {new Date(enroll.updatedAt || enroll.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/certificate?title=${encodeURIComponent(path?.title || 'Career Path')}`}
                      className="w-full mt-4 py-3 bg-indigo-50 text-primary font-bold rounded-2xl hover:bg-primary hover:text-white transition-all text-sm flex items-center justify-center gap-2"
                    >
                      <span className="material-icons-round text-sm">download</span>
                      View Certificate
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-32">
            <span className="material-icons-round text-6xl text-gray-200">workspace_premium</span>
            <h3 className="text-xl font-bold text-gray-400 mt-4">No certificates yet</h3>
            <p className="text-gray-400 text-sm mt-2">Complete a career path to earn your first certificate</p>
            <Link to="/user/career-paths" className="inline-block mt-6 px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition">
              Explore Paths
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
