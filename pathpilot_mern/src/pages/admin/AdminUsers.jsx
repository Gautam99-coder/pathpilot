import { useState, useEffect } from 'react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { Link } from 'react-router-dom'

export default function AdminUsers() {

const [users, setUsers] = useState(() => {
  try { const c = sessionStorage.getItem('adminUsers'); return c ? JSON.parse(c) : null } catch { return null }
});
const [loading, setLoading] = useState(() => !sessionStorage.getItem('adminUsers'));
const [errorMsg, setErrorMsg] = useState("")
const [viewModal, setViewModal] = useState(null)
const [editModal, setEditModal] = useState(null)
const [editForm, setEditForm] = useState({})
const [userEnrollments, setUserEnrollments] = useState({}) // Store enrollments by user ID

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : r.json().then(e => Promise.reject(e)))
      .then(data => {
        const list = Array.isArray(data) ? data : []
        setUsers(list)
        // Store only lightweight fields — avatars can be base64 and blow storage quota
        try {
          const slim = list.map(({ _id, name, email, role, status, isEmailVerified }) => ({ _id, name, email, role, status, isEmailVerified }))
          sessionStorage.setItem('adminUsers', JSON.stringify(slim))
        } catch { sessionStorage.removeItem('adminUsers') }
        
        // Fetch enrollments for each user
        fetchUserEnrollments(list, token)
      })
      .catch(err => setErrorMsg(err.message || "Failed to fetch users"))
      .finally(() => setLoading(false))
  }, []);

  // Function to fetch enrollments for all users
  const fetchUserEnrollments = async (userList, token) => {
    const enrollmentPromises = userList.map(async (user) => {
      try {
        const res = await fetch(`/api/admin/user-enrollments/${user._id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const enrollments = await res.json();
          return { userId: user._id, enrollments };
        }
      } catch (err) {
        console.error(`Failed to fetch enrollments for user ${user._id}:`, err);
      }
      return { userId: user._id, enrollments: [] };
    });

    try {
      const results = await Promise.all(enrollmentPromises);
      const enrollmentMap = {};
      results.forEach(({ userId, enrollments }) => {
        enrollmentMap[userId] = enrollments;
      });
      setUserEnrollments(enrollmentMap);
    } catch (err) {
      console.error('Error fetching user enrollments:', err);
    }
  };

// ✅ DELETE
const handleDelete = async (id) => {
  if (!window.confirm('Delete user?')) return;
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const updated = users.filter(u => u._id !== id)
      setUsers(updated)
      try {
        const slim = updated.map(({ _id, name, email, role, status, isEmailVerified }) => ({ _id, name, email, role, status, isEmailVerified }))
        sessionStorage.setItem('adminUsers', JSON.stringify(slim))
      } catch { sessionStorage.removeItem('adminUsers') }
    }
  } catch (err) {
    console.error(err);
  }
};

return (
<div className="flex h-screen bg-background-light overflow-hidden">
<AdminSidebar />
<div className="flex-1 flex flex-col overflow-hidden">

<header className="h-16 bg-white/80 backdrop-blur-md border-b border-neutral-border flex items-center justify-between px-6 sticky top-0 z-10">
<nav className="text-sm text-neutral-text-subtle flex items-center">
Admin <span className="material-icons-round mx-1 text-gray-400">chevron_right</span>
<span className="text-primary font-semibold">Manage Users</span>
</nav>
</header>

<main className="flex-1 overflow-y-auto p-6">

<div className="flex justify-between items-center mb-8">
<h1 className="text-2xl font-bold">Manage Users</h1>

<Link to="/admin/add-user" className="px-5 py-2 bg-primary text-white rounded-xl flex items-center gap-2 hover:bg-primary-dark transition shadow-md">
<span className="material-icons-round">person_add</span> Add User
</Link>
</div>

<div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
  {loading ? (
    <div className="p-20 text-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Fetching users...</p>
    </div>
  ) : errorMsg ? (
    <div className="p-20 text-center text-red-500">
       <span className="material-icons-round text-5xl mb-4">error_outline</span>
       <h3 className="text-xl font-bold">API Error</h3>
       <p className="text-sm mt-1">{errorMsg}</p>
       <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-primary text-white rounded-xl font-bold">Retry</button>
    </div>
  ) : !users || users.length === 0 ? (
    <div className="p-20 text-center">
       <span className="material-icons-round text-5xl text-gray-200">people</span>
       <h3 className="text-xl font-bold text-gray-400 mt-4">No users found</h3>
       <p className="text-gray-300 text-sm mt-1">The user database appears to be empty or inaccessible.</p>
    </div>
  ) : (
    <table className="w-full text-sm">
      <thead className="bg-gray-50 text-gray-600">
        <tr>
          <th className="px-6 py-4 text-left">User</th>
          <th className="px-6 py-4 text-left">Email</th>
          <th className="px-6 py-4 text-left">Courses</th>
          <th className="px-6 py-4 text-left">Status</th>
          <th className="px-6 py-4 text-center">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {(users || []).map((u) => {
          const enrollments = userEnrollments[u._id] || [];
          return (
          <tr key={u._id} className="hover:bg-gray-50 transition">
            <td className="px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border flex items-center justify-center text-sm font-bold bg-indigo-100 text-indigo-700 overflow-hidden">
                {u.avatar ? (
                  <img src={u.avatar} className="w-full h-full object-cover" alt={u.name} />
                ) : (
                  u.email?.slice(0, 2).toUpperCase() || '??'
                )}
              </div>
              <div>
                <p className="font-bold text-gray-900">{u.name}</p>
                <p className="text-[10px] text-primary font-mono uppercase font-bold">{u._id?.substring(0,6)}</p>
              </div>
            </td>
            <td className="px-6 py-4 text-gray-600 font-medium">{u.email}</td>
            <td className="px-6 py-4">
              <div className="space-y-1">
                {enrollments.length === 0 ? (
                  <span className="text-gray-400 text-xs">No courses enrolled</span>
                ) : (
                  enrollments.slice(0, 2).map((enrollment, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                        {enrollment.careerPath?.title || 'Unknown Course'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {enrollment.progress || 0}%
                      </span>
                    </div>
                  ))
                )}
                {enrollments.length > 2 && (
                  <span className="text-xs text-gray-500">+{enrollments.length - 2} more</span>
                )}
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex flex-col gap-1">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  u.isEmailVerified
                  ? 'bg-green-50 text-green-600 border-green-100'
                  : 'bg-gray-100 text-gray-500 border-gray-200'
                }`}>
                  {u.isEmailVerified ? 'Verified' : 'Unverified'}
                </span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  u.status === 'active'
                  ? 'bg-blue-50 text-blue-600 border-blue-100'
                  : 'bg-red-50 text-red-600 border-red-100'
                }`}>
                  {(u.status || 'active') === 'active' ? 'Active' : 'Banned'}
                </span>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex justify-center gap-3">
                <button onClick={()=>setViewModal({...u, enrollments})} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition shadow-sm">
                  <span className="material-icons-round text-sm">visibility</span>
                </button>
                <button
                  onClick={()=>{
                    setEditModal(u);
                    setEditForm(u);
                  }}
                  className="p-2.5 bg-indigo-50 text-primary rounded-xl hover:bg-indigo-100 transition shadow-sm">
                  <span className="material-icons-round text-sm">edit</span>
                </button>
                <button onClick={()=>handleDelete(u._id)} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition shadow-sm">
                  <span className="material-icons-round text-sm">delete</span>
                </button>
              </div>
            </td>
          </tr>
        )})}
      </tbody>
    </table>
  )}
</div>
</main>
</div>

{/* VIEW MODAL */}
{viewModal && (
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={()=>setViewModal(null)}>
<div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>

<div className="bg-primary p-6 text-white text-center">
<h2 className="text-xl font-bold">User Profile Detail</h2>
<p className="text-white/80 text-xs mt-1">Information for <span className="font-bold underline">{viewModal.name}</span></p>
</div>

<div className="p-8 space-y-6">
<div className="grid grid-cols-2 gap-x-8 gap-y-6">
{[['Full Name',viewModal.name],['User ID',viewModal._id],['Email',viewModal.email],['Role',viewModal.role],['Email Status',viewModal.isEmailVerified ? 'Verified' : 'Unverified'],['Account Status',(viewModal.status || 'active') === 'active' ? 'Active' : 'Banned']].map(([label,val],i) => (
<div key={i} className={label==='Email'?'col-span-2':''}>
<span className="block text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">{label}</span>
<span className={`font-bold text-gray-800 text-sm ${label==='Email Status'?(val==='Verified'?'text-green-600':'text-gray-500'):label==='Account Status'?(val==='Active'?'text-blue-600':'text-red-600'):''}`}>{val}</span>
</div>
))}
</div>

{/* ENROLLED COURSES SECTION */}
<div className="border-t pt-6">
<h3 className="text-lg font-bold text-gray-900 mb-4">Enrolled Courses</h3>
{viewModal.enrollments && viewModal.enrollments.length > 0 ? (
  <div className="space-y-4">
    {viewModal.enrollments.map((enrollment, idx) => (
      <div key={idx} className="bg-gray-50 rounded-xl p-4 border">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-bold text-gray-900">{enrollment.careerPath?.title || 'Unknown Course'}</h4>
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">
            {enrollment.progress || 0}% Complete
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-3">{enrollment.careerPath?.description || 'No description available'}</p>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-lg p-3">
            <div className="text-lg font-bold text-gray-900">{enrollment.learningHours || 0}</div>
            <div className="text-xs text-gray-500">Hours</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-lg font-bold text-gray-900">{enrollment.streak || 0}</div>
            <div className="text-xs text-gray-500">Day Streak</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="text-lg font-bold text-gray-900">
              {enrollment.quizScores?.length > 0 
                ? `${Math.round(enrollment.quizScores.reduce((sum, quiz) => sum + quiz.score, 0) / enrollment.quizScores.length)}%`
                : 'N/A'
              }
            </div>
            <div className="text-xs text-gray-500">Quiz Avg</div>
          </div>
        </div>

        {/* Quiz Scores */}
        {enrollment.quizScores && enrollment.quizScores.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Quiz Scores:</p>
            <div className="flex gap-2 flex-wrap">
              {enrollment.quizScores.map((quiz, qIdx) => (
                <span key={qIdx} className={`text-xs px-2 py-1 rounded-full ${quiz.score >= 60 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  Phase {quiz.phaseIndex + 1}: {quiz.score}%
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Certificate Status */}
        <div className="mt-3 pt-3 border-t">
          <span className={`text-xs px-2 py-1 rounded-full font-bold ${
            enrollment.certificateAwarded 
              ? 'bg-green-100 text-green-700' 
              : enrollment.quizScores?.length > 0 && 
                (enrollment.quizScores.reduce((sum, quiz) => sum + quiz.score, 0) / enrollment.quizScores.length) >= 60
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-500'
          }`}>
            {enrollment.certificateAwarded 
              ? '🏆 Certificate Earned' 
              : enrollment.quizScores?.length > 0 && 
                (enrollment.quizScores.reduce((sum, quiz) => sum + quiz.score, 0) / enrollment.quizScores.length) >= 60
                ? '✅ Certificate Available'
                : '🔒 Certificate Locked'
            }
          </span>
        </div>
      </div>
    ))}
  </div>
) : (
  <div className="text-center py-8 text-gray-500">
    <span className="material-icons-round text-4xl mb-2">school</span>
    <p>No courses enrolled yet</p>
  </div>
)}
</div>
</div>

<div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
<button onClick={()=>setViewModal(null)} className="px-10 py-2.5 bg-white border rounded-xl font-black text-xs hover:bg-gray-100 transition shadow-sm uppercase tracking-widest">Close</button>
</div>

</div>
</div>
)}

{/* EDIT MODAL */}
{editModal && (
<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={()=>setEditModal(null)}>
<div className="bg-white w-full max-w-lg rounded-2xl p-8 shadow-xl" onClick={e=>e.stopPropagation()}>

<h2 className="text-xl font-bold mb-6">Edit User Account</h2>

<form onSubmit={async (e)=>{
e.preventDefault();

const token = localStorage.getItem('token');
try {
  const res = await fetch(`/api/admin/users/${editModal._id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({ name: editForm.name, email: editForm.email, role: editForm.role, status: editForm.status })
  });
  if (res.ok) {
    const updatedUser = await res.json();
    const updated = users.map(u => u._id === editModal._id ? updatedUser : u)
    setUsers(updated);
    try {
      const slim = updated.map(({ _id, name, email, role, status, isEmailVerified }) => ({ _id, name, email, role, status, isEmailVerified }))
      sessionStorage.setItem('adminUsers', JSON.stringify(slim))
    } catch { sessionStorage.removeItem('adminUsers') }
    setEditModal(null);
  }
} catch (err) {
  console.error(err);
}

}} className="space-y-5">

<div>
<label className="block text-sm font-semibold mb-2">Full Name</label>
<input type="text" value={editForm.name||''} onChange={e=>setEditForm({...editForm,name:e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5" />
</div>

<div>
<label className="block text-sm font-semibold mb-2">Email</label>
<input type="email" value={editForm.email||''} onChange={e=>setEditForm({...editForm,email:e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5" />
</div>

<div className="grid grid-cols-2 gap-4">

<div>
<label className="block text-sm font-semibold mb-2">Role</label>
<select value={editForm.role||''} onChange={e=>setEditForm({...editForm,role:e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5">
<option value="user">User</option>
<option value="admin">Admin</option>
</select>
</div>

<div>
<label className="block text-sm font-semibold mb-2">Account Status</label>
<select value={editForm.status||'active'} onChange={e=>setEditForm({...editForm,status:e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5">
<option value="active">Active</option>
<option value="banned">Banned</option>
</select>
</div>

</div>

<div className="flex justify-end gap-3 mt-8">
<button type="button" onClick={()=>setEditModal(null)} className="px-6 py-2.5 border rounded-xl font-medium">Cancel</button>
<button type="submit" className="px-8 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary-dark transition">Save Changes</button>
</div>

</form>
</div>
</div>
)}

</div>
)
}
