import AdminSidebar from '../../components/admin/AdminSidebar'
import { Link } from 'react-router-dom'

const stats = [
  { icon: 'groups', bg: 'indigo-50', color: 'primary', label: 'Total Users', value: '1,284', trend: '+12%' },
  { icon: 'route', bg: 'purple-50', color: 'purple-600', label: 'Career Paths', value: '42', trend: '+5%' },
  { icon: 'school', bg: 'blue-50', color: 'blue-600', label: 'Enrollments', value: '3,920', trend: '+18%' },
  { icon: 'payments', bg: 'green-50', color: 'green-600', label: 'Platform Type', value: 'Free Plan', trend: '+9%' },
]


const recentActivity = [
  { text: 'New user registered — Rahul Sharma', time: '2 min ago' },
  { text: 'Frontend Path updated', time: '1 hr ago' },
  { text: 'New certificate issued', time: 'Today' },
]

export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-background-light">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-neutral-border flex items-center justify-between px-6 sticky top-0 z-10">
          <nav className="text-sm font-medium text-neutral-text-subtle flex items-center">
            <span>Admin</span>
            <span className="material-icons-round text-base mx-1 text-gray-400">chevron_right</span>
            <span className="text-primary font-semibold">Dashboard</span>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-neutral-text-subtle hover:text-primary rounded-full">
              <span className="material-icons-round">notifications</span>
            </button>
            <div className="h-8 w-[1px] bg-neutral-border"></div>
            <img className="h-8 w-8 rounded-full object-cover" src="https://i.pravatar.cc/100?img=12" alt="Admin" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <p className="text-neutral-text-subtle text-sm mt-1">Welcome back Admin 👋 — Here's what's happening today.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-${s.bg} text-${s.color} rounded-xl flex items-center justify-center`}>
                    <span className="material-icons-round">{s.icon}</span>
                  </div>
                  <span className="text-xs text-green-600 font-semibold">{s.trend}</span>
                </div>
                <h2 className="text-2xl font-bold">{s.value}</h2>
                <p className="text-sm text-neutral-text-subtle">{s.label}</p>
              </div>
            ))}
          </div>


          <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm">
            <h2 className="font-bold text-lg mb-6">Recent Activity</h2>
            <ul className="space-y-4 text-sm">
              {recentActivity.map((a, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span className="text-neutral-text-subtle">{a.text}</span>
                  <span className="text-xs text-gray-400">{a.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  )
}
