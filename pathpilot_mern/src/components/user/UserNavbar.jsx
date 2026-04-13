import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function UserNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifCleared, setNotifCleared] = useState(false)
  const { pathname } = useLocation()
  
  const userName = localStorage.getItem('userName') || 'User'
  const userAvatar = localStorage.getItem('userAvatar')
  const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()

  const links = [
    { to: '/user/home', label: 'Home' },
    { to: '/user/features', label: 'Features' },
    { to: '/user/resources', label: 'Resources' },
    { to: '/user/about', label: 'About' },
    { to: '/user/contact', label: 'Contact' },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/user/home" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex-shrink-0 flex items-center justify-center text-white shadow-md">
            <span className="material-icons-round text-lg">rocket_launch</span>
          </div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">PathPilot</span>
          </Link>
        </div>

        <div className="hidden lg:flex gap-8 text-gray-600 font-medium items-center">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`transition-all duration-300 border-b-2 pb-1 ${
                pathname === link.to
                  ? 'text-indigo-600 border-indigo-600 font-bold'
                  : 'border-transparent hover:text-indigo-600 hover:border-indigo-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-5 relative">
          {/* Notification Bell */}
          <div className="relative">
            <button
              className="relative text-gray-500 hover:text-indigo-600 transition-colors focus:outline-none p-2"
              onClick={() => setNotifOpen(!notifOpen)}
            >
              <i className="far fa-bell text-xl"></i>
              {!notifCleared && (
                <span className="absolute top-1 right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500 border-2 border-white"></span>
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[100] overflow-hidden">
                <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Notifications</span>
                  <button
                    onClick={() => { setNotifCleared(true); setNotifOpen(false) }}
                    className="text-[10px] font-bold text-indigo-600 hover:underline uppercase"
                  >
                    Clear
                  </button>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {!notifCleared ? (
                    <Link to="/user/progress" className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50" onClick={() => setNotifOpen(false)}>
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                        <span className="material-icons-round text-sm">check_circle</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">Enrollment Successful!</p>
                        <p className="text-[10px] text-gray-500 mt-1">Start learning Frontend Fundamentals now.</p>
                      </div>
                    </Link>
                  ) : (
                    <div className="p-10 text-center">
                      <span className="material-icons-round text-gray-200 text-4xl">notifications_none</span>
                      <p className="text-gray-400 text-[10px] font-black uppercase mt-2 tracking-widest">No New Notifications</p>
                    </div>
                  )}
                </div>
                <Link to="/user/profile" className="block py-3 text-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-indigo-600 bg-gray-50/50" onClick={() => setNotifOpen(false)}>
                  My Profile
                </Link>
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-gray-200">
            <Link to="/user/profile">
              <div className="w-9 h-9 bg-indigo-100 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold text-indigo-700 cursor-pointer border-2 border-transparent hover:border-indigo-400 transition-all duration-300">
                {userAvatar ? (
                  <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
            </Link>
          </div>

          <button className="lg:hidden text-gray-600 hover:text-indigo-600 p-2 focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
            <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-50 shadow-xl">
          <div className="flex flex-col px-6 py-6 gap-4 font-medium text-gray-600">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`py-2 border-b border-gray-50 ${pathname === link.to ? 'text-indigo-600 font-bold' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
