import { Link, useLocation } from "react-router-dom";

export default function UserSidebar() {
  const location = useLocation();
  const currentUri = location.pathname;
  

  const linkClass = (condition) =>
    `flex items-center gap-4 px-3 py-3 transition rounded-2xl font-semibold ${condition
      ? "bg-indigo-50 text-indigo-600"
      : "text-gray-500 hover:bg-gray-50 hover:text-indigo-600"
    }`;

  return (
    <aside className="flex flex-col justify-between h-screen sticky top-0 bg-white border-r border-gray-100 p-4 transition-all duration-300 font-['Plus_Jakarta_Sans'] w-20 lg:w-64">

      {/* TOP */}
      <div>
        {/* LOGO */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex-shrink-0 flex items-center justify-center text-white shadow-md">
            <span className="material-icons-round text-lg">rocket_launch</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-800 hidden lg:block">
            PathPilot
          </span>
        </div>

        {/* NAV */}
        <nav className="space-y-2">

          <Link
            to="/user/profile"
            title="Dashboard"
            className={linkClass(currentUri.includes("profile"))}
          >
            <span className="material-icons-round text-2xl flex-shrink-0">
              grid_view
            </span>
            <span className="hidden lg:block whitespace-nowrap">
              Dashboard
            </span>
          </Link>

          <Link
            to="/user/certificates"
            title="Certificates"
            className={linkClass(currentUri.includes("certificates"))}
          >
            <span className="material-icons-round text-2xl flex-shrink-0">
              verified
            </span>
            <span className="hidden lg:block whitespace-nowrap">
              Certificates
            </span>
          </Link>

          <Link
            to="/user/settings"
            title="Settings"
            className={linkClass(currentUri.includes("settings"))}
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

        <Link
          to="/user/home"
          title="Back Home"
          className="flex items-center gap-4 px-3 py-3 transition font-bold text-gray-400 hover:text-indigo-600"
        >
          <span className="material-icons-round text-2xl flex-shrink-0">
            arrow_back
          </span>
          <span className="hidden lg:block text-xs uppercase tracking-widest whitespace-nowrap">
            Back Home
          </span>
        </Link>

<Link
  to="/login"
  title="Logout"
  onClick={() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    sessionStorage.clear();
  }}
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
  );
}
