import { Link, useLocation } from 'react-router-dom'

export default function AdminSidebar() {
  const { pathname } = useLocation()

  const navItems = [
    { to: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/admin/users', icon: 'people', label: 'Users' },
    { to: '/admin/career-paths', icon: 'alt_route', label: 'Career Paths' },
  ]

  const linkClass = (path) =>
    `flex items-center gap-4 px-3 py-3 transition rounded-2xl font-semibold ${
      pathname === path
        ? 'bg-indigo-50 text-indigo-600'
        : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-600'
    }`

  return (
    <aside className="flex flex-col justify-between h-screen sticky top-0 bg-white border-r border-gray-100 p-4 transition-all duration-300 w-20 lg:w-64">

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex-shrink-0 flex items-center justify-center text-white shadow-md">
            <span className="material-icons-round text-lg">
              rocket_launch
            </span>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-800 hidden lg:block">
            PathPilot
          </span>
        </div>

        {/* NAV */}
        <nav className="space-y-2">

          {/* SECTION */}
          <p className="hidden lg:block px-3 text-xs text-gray-400 uppercase mb-2">
            Overview
          </p>

          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={linkClass(item.to)}
            >
              <span className="material-icons-round text-2xl flex-shrink-0">
                {item.icon}
              </span>
              <span className="hidden lg:block whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          ))}

          {/* SYSTEM */}
          <p className="hidden lg:block px-3 text-xs text-gray-400 uppercase mt-6 mb-2">
            System
          </p>

          <Link
            to="/admin/settings"
            className={linkClass('/admin/settings')}
          >
            <span className="material-icons-round text-2xl flex-shrink-0">
              settings
            </span>
            <span className="hidden lg:block whitespace-nowrap">
              Settings
            </span>
          </Link>

        </nav>
      </div>

      {/* BOTTOM */}
      <div className="space-y-2 border-t border-gray-100 pt-6">

        {/* LOGOUT */}
        <Link
          to="/login"
          className="flex items-center gap-4 px-3 py-3 transition font-bold text-gray-400 hover:text-red-500"
        >
          <span className="material-icons-round text-2xl flex-shrink-0">
            logout
          </span>
          <span className="hidden lg:block text-xs uppercase tracking-widest whitespace-nowrap">
            Logout
          </span>
        </Link>

      </div>
    </aside>
  )
}  
