import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function AdminUserGroups() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !id) { setLoading(false); return; }

    fetch(`/api/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(users => {
        const found = users.find(u => u._id === id);
        setUser(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  return (
    <div className="flex h-screen bg-background-light">
      <AdminSidebar />
      <div className="flex-1 p-8">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : !user ? (
          <p className="text-gray-400">User not found.</p>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
            <p className="text-gray-500 mb-6">{user.email}</p>
            <div className="bg-white rounded-2xl border p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-xl">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h2 className="font-bold">{user.name}</h2>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                  <span className={`mt-1 inline-block px-3 py-0.5 text-xs font-bold rounded-full ${
                    user.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-4">
                Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
