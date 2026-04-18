import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import UserSidebar from '../../components/user/UserSidebar'

export default function UserProfile() {
  const [profile, setProfile] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('profile')) } catch { return null }
  })
  const [enrollments, setEnrollments] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('enrollments')) || [] } catch { return [] }
  })
  const [loading, setLoading] = useState(() => {
    try { return sessionStorage.getItem('profile') === null } catch { return true }
  })
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setLoading(false); return }
    const fetchData = async () => {
      try {
        const [profileRes, enrollRes] = await Promise.all([
          fetch('/api/auth/profile', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/user/dashboard', { headers: { 'Authorization': `Bearer ${token}` } })
        ])
        if (!profileRes.ok || !enrollRes.ok) throw new Error("Failed to fetch data")
        const profileData = await profileRes.json()
        const enrollData = await enrollRes.json()
        setProfile(profileData)
        setEnrollments(Array.isArray(enrollData) ? enrollData : [])
        sessionStorage.setItem('profile', JSON.stringify(profileData))
        sessionStorage.setItem('enrollments', JSON.stringify(Array.isArray(enrollData) ? enrollData : []))
      } catch (err) {
        if (!profile) setError(err.message)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '??'

  return (
    <div className="bg-[#f8f9fc] min-h-screen flex antialiased">
      <UserSidebar />

      <main className="flex-grow p-10">

        {/* PROFILE HEADER */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-700 border-4 border-white shadow-md overflow-hidden">
                {loading ? '...' : profile?.avatar ? (
                  <img src={profile.avatar} alt="profile" className="w-full h-full object-cover" />
                ) : initials}
              </div>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {loading ? 'Loading...' : profile?.name || 'User'}
              </h2>
              <p className="text-gray-400 text-sm font-medium mt-1">
                {profile?.email || ''}
              </p>
              <div className="flex items-center gap-4 mt-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                {profile?.location && (
                  <span className="flex items-center gap-1">
                    <span className="material-icons-round text-sm">location_on</span>
                    {profile.location}
                  </span>
                )}
                {profile?.bio && (
                  <span className="flex items-center gap-1">
                    <span className="material-icons-round text-sm">info</span>
                    {profile.bio.slice(0, 40)}{profile.bio.length > 40 ? '...' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Link
            to="/user/settings"
            className="border border-indigo-100 px-6 py-3 rounded-2xl text-primary font-bold text-xs hover:bg-indigo-50 transition-all active:scale-95"
          >
            Edit Profile
          </Link>
        </div>

        {/* LEARNING JOURNEY */}
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">
            My Learning Journey
          </h3>
          <Link to="/user/career-paths" className="text-primary font-bold text-xs hover:underline">
            Explore New Paths
          </Link>
        </div>

        {/* ENROLLED COURSES */}
        {error ? (
           <div className="bg-red-50 border border-red-100 p-8 rounded-[2.5rem] text-center">
             <span className="material-icons-round text-red-400 text-5xl">error_outline</span>
             <h3 className="text-xl font-bold text-red-600 mt-4">Data Fetch Error</h3>
             <p className="text-red-400 text-sm mt-2">{error}</p>
             <button onClick={() => window.location.reload()} className="mt-6 px-8 py-3 bg-red-600 text-white rounded-2xl font-bold">Retry Connection</button>
           </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-[2.5rem] h-64 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : enrollments.length === 0 ? (
          <div className="py-20 text-center bg-white border-2 border-dashed border-gray-100 rounded-[3rem]">
            <span className="material-icons-round text-5xl text-gray-200">school</span>
            <h3 className="text-xl font-bold text-gray-400 mt-4">No courses yet</h3>
            <p className="text-gray-300 text-sm mt-2 mb-8 max-w-xs mx-auto">
              Start your learning journey by enrolling in a career path.
            </p>
            <Link to="/user/career-paths" className="text-primary font-bold hover:underline">
              Browse Career Paths →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrollments.map((enroll, i) => {
              const path = enroll.careerPath
              const progress = enroll.progress || 0
              return (
                <div
                  key={enroll._id || i}
                  className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm group hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className="h-44 overflow-hidden bg-indigo-50 flex items-center justify-center relative">
                    {path?.image ? (
                      <img src={path.image} alt={path.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    ) : (
                      <span className="material-icons-round text-5xl text-indigo-200">route</span>
                    )}
                    <span className="absolute top-4 right-4 bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                      {progress === 100 ? 'Completed' : 'Active'}
                    </span>
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <h4 className="font-bold text-gray-900 text-lg tracking-tight group-hover:text-primary transition-colors">
                      {path?.title || 'Career Path'}
                    </h4>

                    <div className="mt-6 w-full bg-gray-100 rounded-full h-2">
                      <div className="h-2 bg-indigo-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{progress}% complete</p>
                       <span className="text-[10px] text-primary font-black uppercase tracking-widest">{path?.phases?.length || 0} Phases</span>
                    </div>

                    <Link
                      to={`/user/progress/${path?._id}`}
                      className="block w-full mt-8 py-3.5 bg-indigo-50 text-primary font-bold rounded-2xl text-center hover:bg-primary hover:text-white transition-all active:scale-95 text-sm"
                    >
                      Continue Journey
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  );
}
