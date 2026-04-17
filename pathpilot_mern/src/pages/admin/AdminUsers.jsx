import { useState } from 'react'
import AdminSidebar from '../../components/admin/AdminSidebar'

const initialUsers = [
  { id: 'PP101', name: 'Rahul Sharma', email: 'rahul@gmail.com', role: 'Student', status: 'Active', course: 'MERN Stack', phone: '+91 9876543210', date: 'Feb 15, 2024', avatar: 'https://i.pravatar.cc/100?img=1' },
  { id: 'PP102', name: 'Priya Patel', email: 'priya@gmail.com', role: 'Student', status: 'Active', course: 'AWS Cloud', phone: '+91 8765432109', date: 'Mar 01, 2024', avatar: 'https://i.pravatar.cc/100?img=5' },
  { id: 'PP103', name: 'Arjun Mehta', email: 'arjun@gmail.com', role: 'Mentor', status: 'Active', course: 'Full Stack', phone: '+91 7654321098', date: 'Jan 10, 2024', avatar: 'https://i.pravatar.cc/100?img=8' },
  { id: 'PP104', name: 'Sneha Joshi', email: 'sneha@gmail.com', role: 'Student', status: 'Inactive', course: 'Python ML', phone: '+91 6543210987', date: 'Apr 20, 2024', avatar: 'https://i.pravatar.cc/100?img=9' },
]

export default function AdminUsers() {

  const [users, setUsers] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("users"));
    return stored && stored.length ? stored : initialUsers;
  });

  // Add Modal State
  const [addModal, setAddModal] = useState(false)
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})

  // View/Edit Modal State
  const [viewModal, setViewModal] = useState(null)
  const [editModal, setEditModal] = useState(null)
  const [editForm, setEditForm] = useState({})

  // ✅ DELETE
  const handleDelete = (id) => {
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
  };

  // ✅ VALIDATION
  const validate = () => {
    let err = {};
    if (!form.name) err.name = "Required";
    if (!form.email) err.email = "Required";
    if (!form.phone) err.phone = "Required";
    if (!form.course) err.course = "Required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ✅ ADD USER
  const handleAddUser = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const newUser = {
      id: "PP" + Date.now().toString().slice(-4),
      ...form,
      status: form.status || 'Active', // Default status if untouched
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      avatar: `https://i.pravatar.cc/100?u=${form.email}`,
    };

    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));

    setAddModal(false);
    setForm({});
    setErrors({});
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

            <button 
              onClick={() => setAddModal(true)} 
              className="px-5 py-2 bg-primary text-white rounded-xl flex items-center gap-2 hover:bg-primary-dark transition shadow-md"
            >
              <span className="material-icons-round">person_add</span> Add User
            </button>
          </div>

          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left">User</th>
                  <th className="px-6 py-4 text-left">Email</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img src={u.avatar} className="w-10 h-10 rounded-full border" alt={u.name} />
                      <div>
                        <p className="font-bold text-gray-900">{u.name}</p>
                        <p className="text-[10px] text-primary font-mono uppercase font-bold">{u.id}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-600">{u.email}</td>

                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        u.status === 'Active'
                          ? 'bg-green-50 text-green-600 border-green-100'
                          : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}>
                        {u.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => setViewModal(u)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                          <span className="material-icons-round text-sm">visibility</span>
                        </button>

                        <button
                          onClick={() => {
                            setEditModal(u);
                            setEditForm(u);
                          }}
                          className="p-2 bg-indigo-50 text-primary rounded-lg hover:bg-indigo-100 transition">
                          <span className="material-icons-round text-sm">edit</span>
                        </button>

                        <button onClick={() => handleDelete(u.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
                          <span className="material-icons-round text-sm">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* ✅ ADD MODAL */}
      {addModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setAddModal(false)}>
          <div className="bg-white w-full max-w-lg rounded-2xl p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-6">Add New User</h2>
            
            <form onSubmit={handleAddUser} className="space-y-5">
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  placeholder="E.g. John Doe"
                  value={form.name || ''} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                  className={`w-full border rounded-xl px-4 py-2.5 ${errors.name ? 'border-red-400 focus:ring-red-100' : 'border-gray-200'}`} 
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
                <input 
                  type="email" 
                  placeholder="user@example.com"
                  value={form.email || ''} 
                  onChange={e => setForm({...form, email: e.target.value})} 
                  className={`w-full border rounded-xl px-4 py-2.5 ${errors.email ? 'border-red-400 focus:ring-red-100' : 'border-gray-200'}`} 
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Phone</label>
                  <input 
                    type="text" 
                    placeholder="+91..."
                    value={form.phone || ''} 
                    onChange={e => setForm({...form, phone: e.target.value})} 
                    className={`w-full border rounded-xl px-4 py-2.5 ${errors.phone ? 'border-red-400 focus:ring-red-100' : 'border-gray-200'}`} 
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Course</label>
                  <input 
                    type="text" 
                    placeholder="E.g. Full Stack"
                    value={form.course || ''} 
                    onChange={e => setForm({...form, course: e.target.value})} 
                    className={`w-full border rounded-xl px-4 py-2.5 ${errors.course ? 'border-red-400 focus:ring-red-100' : 'border-gray-200'}`} 
                  />
                  {errors.course && <p className="text-red-500 text-xs mt-1">{errors.course}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Status</label>
                <select 
                  value={form.status || 'Active'} 
                  onChange={e => setForm({...form, status: e.target.value})} 
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setAddModal(false)} className="px-6 py-2.5 border rounded-xl font-medium hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" className="px-8 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary-dark transition">Save User</button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setViewModal(null)}>
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border" onClick={e => e.stopPropagation()}>

            <div className="bg-primary p-6 text-white text-center">
              <h2 className="text-xl font-bold">User Profile Detail</h2>
              <p className="text-white/80 text-xs mt-1">Information for <span className="font-bold underline">{viewModal.name}</span></p>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                {[['Full Name', viewModal.name], ['User ID', viewModal.id], ['Email', viewModal.email], ['Phone', viewModal.phone], ['Course', viewModal.course], ['Status', viewModal.status], ['Joined', viewModal.date]].map(([label, val], i) => (
                  <div key={i} className={label === 'Email' || label === 'Joined' ? 'col-span-2' : ''}>
                    <span className="block text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">{label}</span>
                    <span className={`font-bold text-gray-800 text-sm ${label === 'Status' ? (val === 'Active' ? 'text-green-600' : 'text-gray-500') : ''}`}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
              <button onClick={() => setViewModal(null)} className="px-10 py-2.5 bg-white border rounded-xl font-black text-xs hover:bg-gray-100 transition shadow-sm uppercase tracking-widest">Close</button>
            </div>

          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setEditModal(null)}>
          <div className="bg-white w-full max-w-lg rounded-2xl p-8 shadow-2xl" onClick={e => e.stopPropagation()}>

            <h2 className="text-xl font-bold mb-6">Edit User Account</h2>

            <form onSubmit={(e) => {
              e.preventDefault();

              const updatedUsers = users.map(u =>
                u.id === editModal.id ? { ...u, ...editForm } : u
              );

              setUsers(updatedUsers);
              localStorage.setItem("users", JSON.stringify(updatedUsers));
              setEditModal(null);

            }} className="space-y-5">

              <div>
                <label className="block text-sm font-semibold mb-2">Full Name</label>
                <input type="text" value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input type="email" value={editForm.email || ''} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5" />
              </div>

              <div className="grid grid-cols-1 gap-4">

                <div>
                  <label className="block text-sm font-semibold mb-2">Status</label>
                  <select value={editForm.status || ''} onChange={e => setEditForm({ ...editForm, status: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5">
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Banned</option>
                  </select>
                </div>

              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setEditModal(null)} className="px-6 py-2.5 border rounded-xl font-medium hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" className="px-8 py-2.5 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary-dark transition">Save Changes</button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}
