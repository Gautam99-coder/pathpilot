import UserFooter from '../../components/user/UserFooter'
import UserNavbar from '../../components/user/UserNavbar'
import { Link } from 'react-router-dom'

export default function UserFeatures() {
  return (
    <div className="bg-[#f6f6f8] antialiased">
      <UserNavbar />
      <header className="max-w-7xl mx-auto px-6 py-24">
        <span className="bg-indigo-50 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">Platform Features</span>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mt-8 mb-6 leading-tight">Why PathPilot?</h1>
        <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">Everything you need to go from beginner to job-ready, all in one place.</p>
        <div className="flex gap-4 mt-12">
          <Link to="/user/career-paths" className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-xl font-bold shadow-lg transition">Start Exploring</Link>
        </div>
      </header>
      <main className="space-y-32 pb-32">
        {[
          { bg: '#2eb086', label: 'Expert-Curated Roadmaps', desc: 'Stop wasting time on scattered tutorials. Learn skills in the right order.', flip: false },
          { bg: '#4913ec', label: 'Progress Tracking', desc: 'Visual progress tracking helps you stay motivated and see how far you\'ve come.', flip: true },
          { bg: '#a855f7', label: 'Community Access', desc: 'Connect with thousands of students and professionals on the same path.', flip: false },
        ].map((f, i) => (
          <section key={i} className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
            {f.flip && <div className="max-w-lg">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">{f.label}</h2>
              <p className="text-gray-500 text-lg leading-relaxed">{f.desc}</p>
            </div>}
            <div className="rounded-[2.5rem] p-16 shadow-2xl" style={{background: f.bg}}>
              <div className="border-4 border-white/30 rounded-2xl p-10 text-center">
                <h4 className="text-white text-4xl font-black uppercase">Web</h4>
                <p className="text-white/80 font-bold mt-4 tracking-widest uppercase">Development</p>
              </div>
            </div>
            {!f.flip && <div className="max-w-lg">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">{f.label}</h2>
              <p className="text-gray-500 text-lg leading-relaxed">{f.desc}</p>
            </div>}
          </section>
        ))}
      </main>
      <UserFooter />
    </div>
  )
}
