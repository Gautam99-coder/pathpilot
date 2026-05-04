  
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminSidebar from '../../components/admin/AdminSidebar'

export default function AdminCareerPath() {
  const [query, setQuery] = useState('')
  const [pathList, setPathList] = useState([])

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const res = await fetch('/api/paths');
        const data = await res.json();
        setPathList(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPaths();
  }, [])

  const filtered = pathList.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase())
  )

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this career path?")) {
      const token = localStorage.getItem('token');
      try {
        await fetch(`/api/admin/paths/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setPathList(pathList.filter(p => p._id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  }

  return (
    <div className="flex h-screen bg-background-light overflow-hidden">

      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* HEADER */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-neutral-border flex items-center justify-between px-6">
          <nav className="text-sm text-neutral-text-subtle flex items-center">
            Admin
            <span className="material-icons-round mx-1 text-gray-400">chevron_right</span>
            <span className="text-primary font-semibold">Career Paths</span>
          </nav>

          <Link
            to="/admin/create-path"
            className="px-5 py-2 bg-primary text-white rounded-xl flex items-center gap-2 hover:bg-primary-dark transition font-bold text-sm"
          >
            <span className="material-icons-round">add</span>
            Create Path
          </Link>
        </header>

        {/* SEARCH */}
        <div className="p-6">
          <div className="relative max-w-md">
            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search career paths..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
            />
          </div>
        </div>

        {/* CARDS */}
        <main className="flex-1 overflow-y-auto px-6 pb-10">

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {filtered.map((p, i) => (
              <div key={p._id || i} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm flex flex-col group">

                {/* TOP ICON / IMAGE */}
                <div className={`h-40 bg-indigo-50 flex items-center justify-center relative overflow-hidden`}>
                  {p.image ? (
                    <img 
                      src={p.image} 
                      alt={p.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <i className={`fas fa-layer-group text-indigo-600 text-2xl`}></i>
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-8 flex-grow">

                  <h3 className="font-bold text-xl text-gray-900 mb-2">
                    {p.title}
                  </h3>

                  <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="flex gap-2 mb-6">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase">
                      {p.category || 'Course'}
                    </span>
                  </div>

                  {/* META */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">

                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                      {p.phases ? `${p.phases.length} Phases` : '0 Phases'}
                    </span>

                    {/* ACTIONS */}
                    <div className="flex gap-2">

                      <Link
                        to={`/admin/edit-path/${p._id}`}
                        className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition"
                      >
                        <span className="material-icons-round text-sm">edit</span>
                      </Link>

                      <button 
                        onClick={() => handleDelete(p._id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                      >
                        <span className="material-icons-round text-sm">delete</span>
                      </button>

                    </div>

                  </div>

                </div>
              </div>
            ))}

          </div>

        </main>

      </div>
    </div>
  )
}
