  import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function GuestNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  const links = [
    { to: '/guest/home', label: 'Home' },
    { to: '/guest/features', label: 'Features' },
    { to: '/guest/resources', label: 'Resources' },
    { to: '/guest/about', label: 'About' },
    { to: '/guest/contact', label: 'Contact' },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex-shrink-0 flex items-center justify-center text-white shadow-md">
            <span className="material-icons-round text-lg">rocket_launch</span>
          </div>
          <Link to="/guest/home">
            <span className="text-xl font-bold text-gray-800 tracking-tight">PathPilot</span>
          </Link>
        </div>

        <div className="hidden lg:flex gap-8 text-gray-600 font-medium items-center">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link border-b-2 pb-1 transition-all duration-300 ${
                pathname === link.to
                  ? 'text-indigo-600 font-bold border-indigo-600'
                  : 'border-transparent hover:text-indigo-600 hover:border-indigo-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <Link to="/login" className="px-5 py-2 rounded-lg font-semibold text-indigo-600 border border-indigo-600 hover:bg-indigo-50 transition-all duration-300 text-sm md:text-base">
              Login
            </Link>
            <Link to="/register" className="px-6 py-2.5 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all duration-300 text-sm md:text-base">
              Get Started
            </Link>
          </div>
          <button
            className="lg:hidden text-gray-600 hover:text-indigo-600 focus:outline-none p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="flex flex-col p-6 gap-4 font-medium text-gray-600">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`py-2 border-b border-gray-50 hover:text-indigo-600 ${pathname === link.to ? 'text-indigo-600 font-bold' : ''}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-4 sm:hidden">
              <Link to="/login" className="text-center px-5 py-3 rounded-xl font-semibold text-indigo-600 border border-indigo-600">Login</Link>
              <Link to="/register" className="text-center px-6 py-3 rounded-xl font-bold text-white bg-indigo-600">Get Started</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
