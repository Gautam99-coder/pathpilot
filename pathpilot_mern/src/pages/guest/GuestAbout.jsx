  
import { Link } from 'react-router-dom'
import GuestNavbar from '../../components/guest/GuestNavbar'
import GuestFooter from '../../components/guest/GuestFooter'

export default function GuestAbout() {
  const stats = [
    { value: '500+', label: 'Roadmaps' },
    { value: '10K+', label: 'Engineers' },
    { value: '50+', label: 'Mentors' },
    { value: '100%', label: 'Placement Focus' },
  ]

  return (
    <div className="bg-[#f8f9fc] text-gray-900 antialiased">
      <GuestNavbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-indigo-700 via-primary to-purple-800 text-white py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <span className="bg-white/10 border border-white/20 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Our DNA</span>
          <h1 className="text-5xl md:text-7xl font-bold mt-10 leading-tight tracking-tight">
            From Student <span className="text-yellow-300">Confusion</span><br />
            To Industry <span className="underline decoration-yellow-400 decoration-4 underline-offset-8">Career</span>
          </h1>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto mt-8 font-medium leading-relaxed">
            PathPilot is the AI-driven compass for BTech & BCA students, transforming academic theory into real-world engineering mastery through structured roadmaps.
          </p>
        </div>
      </section>

      {/* Glass card */}
      <section className="max-w-5xl mx-auto px-6 -mt-20 relative z-20">
        <div className="glass-card rounded-[2.5rem] p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 tracking-tight">
            Bridging the gap between<br />
            <span className="text-gradient uppercase text-sm tracking-widest font-black">College & Corporate</span>
          </h2>
          <p className="text-gray-500 max-w-3xl mx-auto leading-relaxed font-medium">
            Standard curriculums often lag behind tech trends. We simplify career building by converting complex industry expectations into clear, step-by-step learning paths that anyone can follow.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 py-24 px-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-10 rounded-3xl shadow-sm text-center border border-gray-100 hover:border-primary/20 transition-all group">
            <p className="text-5xl font-bold text-primary group-hover:scale-110 transition-transform">{stat.value}</p>
            <p className="text-[10px] font-black text-gray-400 mt-4 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white py-28 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-600"></div>
        <h2 className="text-4xl md:text-5xl font-bold mb-10 tracking-tight">Your Tech Journey Starts Now 🚀</h2>
        <div className="flex justify-center gap-6 flex-wrap">
          <Link to="/guest/career-paths" className="bg-primary hover:bg-primary-dark text-white px-10 py-5 rounded-2xl font-bold shadow-xl shadow-primary/20 transition-all active:scale-95">
            Explore Paths
          </Link>
          <Link to="/guest/contact" className="bg-white/10 hover:bg-white/20 border border-white/20 px-10 py-5 rounded-2xl font-bold transition-all">
            Contact Us
          </Link>
        </div>
      </section>

      <GuestFooter />
    </div>
  )
}
