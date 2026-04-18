import { Link } from 'react-router-dom'

export default function UserFooter() {
  return (
    <footer className="bg-white border-t border-neutral-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Link to="/user/home" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#1313ec] flex items-center justify-center text-white shadow-md">
                  <span className="material-icons-round text-sm">rocket_launch</span>
                </div>
                <span className="font-extrabold text-xl tracking-tight text-neutral-800">PathPilot</span>
              </Link>
            </div>
            <p className="text-neutral-500 text-sm max-w-xs mb-6 font-medium">
              Guiding BTech & BCA students from confusion to a focused IT career with industry-standard roadmaps.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-neutral-400 hover:text-[#1313ec] transition-all">
                <i className="fab fa-twitter text-lg"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-neutral-400 hover:text-[#1313ec] transition-all">
                <i className="fab fa-github text-lg"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-neutral-800 text-xs uppercase tracking-widest mb-6">Platform</h4>
            <ul className="space-y-3 text-sm text-neutral-500 font-medium">
              <li><Link to="/user/career-paths" className="hover:text-[#1313ec] transition-colors">Career Paths</Link></li>
              <li><Link to="/user/resources" className="hover:text-[#1313ec] transition-colors">Resources</Link></li>
              <li><Link to="/user/features" className="hover:text-[#1313ec] transition-colors">Features</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-neutral-800 text-xs uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-3 text-sm text-neutral-500 font-medium">
              <li><Link to="/user/about" className="hover:text-[#1313ec] transition-colors">About Us</Link></li>
              <li><a href="#" className="hover:text-[#1313ec] transition-colors">Careers</a></li>
              <li><Link to="/user/contact" className="hover:text-[#1313ec] transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-neutral-800 text-xs uppercase tracking-widest mb-6">Support</h4>
            <ul className="space-y-3 text-sm text-neutral-500 font-medium">
              <li><Link to="/user/contact" className="hover:text-[#1313ec] transition-colors">Help Center</Link></li>
              <li><Link to="/user/contact" className="hover:text-[#1313ec] transition-colors">Terms of Service</Link></li>
              <li><Link to="/user/contact" className="hover:text-[#1313ec] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-400 text-xs font-bold uppercase tracking-tighter">
            © 2026 PathPilot. Crafted for future engineers.
          </p>
          <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-green-600 text-[10px] font-black uppercase tracking-widest">
              Global Systems Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
