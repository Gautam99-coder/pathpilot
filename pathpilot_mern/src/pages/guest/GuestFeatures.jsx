import { Link } from 'react-router-dom'
import GuestNavbar from '../../components/guest/GuestNavbar'
import GuestFooter from '../../components/guest/GuestFooter'

export default function GuestFeatures() {
  return (
    <div className="bg-[#f6f6f8] antialiased">
      <GuestNavbar />

      <header className="max-w-7xl mx-auto px-6 py-24">
        <span className="bg-indigo-50 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
          Platform Features
        </span>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mt-8 mb-6 leading-tight">
          Why PathPilot?
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
          We've built a comprehensive ecosystem designed to take you from a curious beginner to a job-ready professional.
        </p>
        <div className="flex gap-4 mt-12">
          <Link to="/guest/career-paths" className="bg-primary hover:bg-primary-dark text-white px-10 py-4 rounded-xl font-bold shadow-lg transition">
            Start Exploring
          </Link>
        </div>
      </header>

      <main className="space-y-32 pb-32">
        {/* Feature 1 */}
        <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <div className="bg-[#2eb086] rounded-[2.5rem] p-16 shadow-2xl relative overflow-hidden">
            <div className="border-4 border-white/30 rounded-2xl p-10 text-center">
              <h4 className="text-white text-5xl font-black uppercase tracking-[0.2em]">Web</h4>
              <p className="text-white/80 font-bold mt-4 tracking-widest uppercase">Development</p>
            </div>
          </div>
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Expert-Curated Roadmaps</h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Stop wasting time on scattered tutorials. Learn skills in the right order, with our expert-curated roadmaps designed for real-world outcomes.
            </p>
          </div>
        </section>

        {/* Feature 2 */}
        <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <div className="max-w-lg md:order-first">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Track Your Progress</h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Visual progress tracking helps you stay motivated and see how far you've come on your learning journey.
            </p>
          </div>
          <div className="bg-indigo-600 rounded-[2.5rem] p-16 shadow-2xl">
            <div className="border-4 border-white/30 rounded-2xl p-10 text-center">
              <h4 className="text-white text-5xl font-black">78%</h4>
              <p className="text-white/80 font-bold mt-4 tracking-widest uppercase">Avg. Completion</p>
            </div>
          </div>
        </section>

        {/* Feature 3 */}
        <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <div className="bg-purple-600 rounded-[2.5rem] p-16 shadow-2xl">
            <div className="border-4 border-white/30 rounded-2xl p-10 text-center">
              <h4 className="text-white text-5xl font-black uppercase">10K+</h4>
              <p className="text-white/80 font-bold mt-4 tracking-widest uppercase">Community</p>
            </div>
          </div>
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Join a Growing Community</h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Connect with thousands of students and professionals on the same path. Share projects, get feedback, and grow together.
            </p>
          </div>
        </section>
      </main>

      <GuestFooter />
    </div>
  )
}
