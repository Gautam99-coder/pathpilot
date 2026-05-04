import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';

const formatInr = value =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(value || 0);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const statCards = stats
    ? [
        { icon: 'groups', bg: 'bg-indigo-50', color: 'text-indigo-600', label: 'Total Users', value: stats.totalUsers },
        { icon: 'route', bg: 'bg-purple-50', color: 'text-purple-600', label: 'Career Paths', value: stats.totalPaths },
        { icon: 'school', bg: 'bg-blue-50', color: 'text-blue-600', label: 'Enrollments', value: stats.totalEnrollments },
        {
          icon: 'payments',
          bg: 'bg-green-50',
          color: 'text-green-600',
          label: `Donations (${stats.totalDonations || 0})`,
          value: formatInr(stats.totalDonationAmount || 0)
        }
      ]
    : [];

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
              {!!((stats?.unreadContacts || 0) + (stats?.unreadAdminNotifications || 0)) && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {(stats?.unreadContacts || 0) + (stats?.unreadAdminNotifications || 0)}
                </span>
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <p className="text-neutral-text-subtle text-sm mt-1">Donation totals now come directly from the payment records saved after Razorpay verification.</p>
          </div>

          {!loading && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-2xl border border-neutral-border shadow-sm">
                <p className="text-sm text-neutral-text-subtle">Unread Contact Messages</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">{stats?.unreadContacts || 0}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-neutral-border shadow-sm">
                <p className="text-sm text-neutral-text-subtle">Unread Admin Notifications</p>
                <p className="text-3xl font-bold text-orange-500 mt-2">{stats?.unreadAdminNotifications || 0}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm animate-pulse h-32" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {statCards.map((s, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-xl flex items-center justify-center`}>
                      <span className="material-icons-round">{s.icon}</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold break-words">{s.value}</h2>
                  <p className="text-sm text-neutral-text-subtle">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          <div className="grid xl:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm">
              <h2 className="font-bold text-lg mb-6">Recent Registrations</h2>
              {loading ? (
                <p className="text-gray-400 text-sm">Loading...</p>
              ) : stats?.recentActivity?.length > 0 ? (
                <ul className="space-y-4 text-sm">
                  {stats.recentActivity.map((a, i) => (
                    <li key={i} className="flex items-center justify-between border-b border-gray-50 pb-3">
                      <span className="text-neutral-text-subtle flex items-center gap-2">
                        <span className="material-icons-round text-primary text-sm">person_add</span>
                        {a.text}
                      </span>
                      <span className="text-xs text-gray-400">{a.time}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-10 text-center">
                  <span className="material-icons-round text-4xl text-gray-200">people</span>
                  <p className="text-gray-400 text-sm mt-3">No users have registered yet.</p>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-border shadow-sm">
              <h2 className="font-bold text-lg mb-6">Recent Donations</h2>
              {loading ? (
                <p className="text-gray-400 text-sm">Loading...</p>
              ) : stats?.recentDonations?.length > 0 ? (
                <ul className="space-y-4 text-sm">
                  {stats.recentDonations.map((donation, i) => (
                    <li key={`${donation.email}-${i}`} className="flex items-start justify-between gap-4 border-b border-gray-50 pb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{donation.donor}</p>
                        <p className="text-neutral-text-subtle">{donation.careerPath}</p>
                        {donation.email && <p className="text-xs text-gray-400">{donation.email}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-green-600">{formatInr(donation.amount)}</p>
                        <p className="text-xs text-gray-400">{donation.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-10 text-center">
                  <span className="material-icons-round text-4xl text-gray-200">payments</span>
                  <p className="text-gray-400 text-sm mt-3">No successful donations yet.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
