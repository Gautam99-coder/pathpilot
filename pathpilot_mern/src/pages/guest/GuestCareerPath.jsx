import { useState } from 'react'
import { Link } from 'react-router-dom'
import GuestNavbar from '../../components/guest/GuestNavbar'
import GuestFooter from '../../components/guest/GuestFooter'

const paths = [
  { icon: 'fa-code', color: 'indigo', bg: 'indigo-50', hover: 'indigo-100', title: 'Frontend Developer', desc: 'Master the art of building beautiful, interactive user interfaces with React and Tailwind CSS.', tags: [{label:'React',color:'blue'},{label:'Tailwind',color:'purple'}], meta: '8 Steps • 3 Projects' },
  { icon: 'fa-server', color: 'amber', bg: 'amber-50', hover: 'amber-100', title: 'Backend Developer', desc: 'Build robust server-side logic, master databases, and create scalable APIs using Spring Boot.', tags: [{label:'Java',color:'amber'},{label:'SQL',color:'orange'}], meta: '12 Steps • 4 Projects' },
  { icon: 'fa-layer-group', color: 'green', bg: 'green-50', hover: 'green-100', title: 'Full Stack Developer', desc: 'The complete journey. Master both ends of the stack and learn how to deploy to the cloud.', tags: [{label:'MERN',color:'green'},{label:'AWS',color:'blue'}], meta: '20 Steps • 6 Projects' },
  { icon: 'fa-shield-alt', color: 'red', bg: 'red-50', hover: 'red-100', title: 'Cybersecurity Analyst', desc: 'Learn to defend systems, analyse threats, and protect organizations from cyberattacks.', tags: [{label:'Network',color:'red'},{label:'OWASP',color:'orange'}], meta: '10 Steps • 3 Projects' },
  { icon: 'fa-brain', color: 'violet', bg: 'violet-50', hover: 'violet-100', title: 'AI/ML Engineer', desc: 'Build intelligent systems using Python, TensorFlow, and modern machine learning algorithms.', tags: [{label:'Python',color:'yellow'},{label:'TensorFlow',color:'purple'}], meta: '15 Steps • 5 Projects' },
  { icon: 'fa-mobile-alt', color: 'blue', bg: 'blue-50', hover: 'blue-100', title: 'Mobile Developer', desc: 'Create native and cross-platform mobile apps for iOS and Android using React Native.', tags: [{label:'React Native',color:'blue'},{label:'Expo',color:'indigo'}], meta: '11 Steps • 4 Projects' },
]

export default function GuestCareerPath() {
  const [query, setQuery] = useState('')

  const filtered = paths.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.desc.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="bg-[#f8f9fc] antialiased">
      <GuestNavbar />

      <header className="bg-white border-b border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex text-sm text-gray-400 mb-4 items-center gap-2">
            <Link to="/guest/home" className="hover:text-primary transition font-medium">Home</Link>
            <span className="material-icons-round text-xs text-gray-300">chevron_right</span>
            <span className="text-gray-900 font-bold uppercase tracking-widest text-[10px]">Career Paths</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Choose Your Career Path</h1>
          <p className="text-gray-500 max-w-2xl leading-relaxed font-medium">
            Explore our expert-curated roadmaps. Each path is a step-by-step guide from zero to job-ready professional.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-4 border border-gray-50">
          <div className="relative w-full">
            <span className="material-icons-round absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for a role (e.g. Frontend, DevOps)..."
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-20">
        {filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((path, i) => (
              <div key={i} className="path-card bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm flex flex-col group">
                <div className={`h-40 bg-${path.bg} flex items-center justify-center group-hover:bg-${path.hover} transition-colors`}>
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <i className={`fas ${path.icon} text-${path.color}-600 text-2xl`}></i>
                  </div>
                </div>
                <div className="p-8 flex-grow">
                  <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-primary transition-colors">{path.title}</h3>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed font-medium">{path.desc}</p>
                  <div className="flex gap-2 mb-8">
                    {path.tags.map(tag => (
                      <span key={tag.label} className={`px-3 py-1 bg-${tag.color}-50 text-${tag.color}-600 rounded-full text-[10px] font-black uppercase tracking-widest`}>{tag.label}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{path.meta}</span>
                    <Link to={`/guest/course/${encodeURIComponent(path.title)}`} className="text-primary font-bold text-sm hover:underline">Quick View</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="material-icons-round text-6xl text-gray-200">search_off</span>
            <p className="text-gray-500 mt-4 font-medium">No career paths found matching your search.</p>
          </div>
        )}
      </main>

      <GuestFooter />
    </div>
  )
}
