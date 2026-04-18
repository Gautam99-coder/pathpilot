import { useParams, Link } from 'react-router-dom'
import GuestNavbar from '../../components/guest/GuestNavbar'
import GuestFooter from '../../components/guest/GuestFooter'

const details = {
  'Frontend Developer': { icon: 'fa-code', color: 'indigo', steps: ['HTML & CSS Basics', 'JavaScript Fundamentals', 'React.js', 'State Management', 'API Integration', 'Testing', 'Performance', 'Deployment'], tags: ['React','JavaScript','Tailwind'], level: 'Beginner → Advanced' },
  'Backend Developer': { icon: 'fa-server', color: 'amber', steps: ['Java Fundamentals', 'OOP Concepts', 'Spring Boot Basics', 'REST APIs', 'Database Design', 'Security', 'Microservices', 'Cloud Deployment', 'Testing', 'CI/CD', 'Monitoring', 'Optimization'], tags: ['Java','Spring','SQL'], level: 'Intermediate → Senior' },
  'Full Stack Developer': { icon: 'fa-layer-group', color: 'green', steps: ['Frontend Fundamentals', 'React Mastery', 'Node.js Backend', 'Express.js', 'MongoDB', 'Authentication', 'REST APIs', 'GraphQL', 'Docker', 'AWS', 'CI/CD', 'Advanced Patterns', 'Performance', 'Security', 'Monitoring', 'Capstone Project', 'Portfolio', 'Interview Prep', 'System Design', 'Launch'], tags: ['MERN','AWS','Docker'], level: 'Beginner → Senior' },
}

export default function GuestCourseDetail() {
  const { title } = useParams()
  const decoded = decodeURIComponent(title)
  const path = details[decoded] || {
    icon: 'fa-graduation-cap', color: 'indigo',
    steps: ['Introduction', 'Core Concepts', 'Practical Skills', 'Advanced Topics', 'Projects', 'Deployment'],
    tags: ['Technology'], level: 'All Levels'
  }

  return (
    <div className="bg-[#f8f9fc] antialiased">
      <GuestNavbar />

      <header className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex text-sm text-gray-400 mb-6 items-center gap-2">
            <Link to="/guest/home" className="hover:text-primary">Home</Link>
            <span className="material-icons-round text-xs">chevron_right</span>
            <Link to="/guest/career-paths" className="hover:text-primary">Career Paths</Link>
            <span className="material-icons-round text-xs">chevron_right</span>
            <span className="text-gray-900 font-bold">{decoded}</span>
          </nav>
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 bg-${path.color}-50 rounded-2xl flex items-center justify-center`}>
              <i className={`fas ${path.icon} text-${path.color}-600 text-3xl`}></i>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{decoded}</h1>
              <div className="flex gap-2 mt-3">
                {path.tags.map(t => (
                  <span key={t} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase">{t}</span>
                ))}
                <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase">{path.level}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-8 text-gray-900">Learning Roadmap</h2>
          <div className="space-y-4">
            {path.steps.map((step, i) => (
              <div key={i} className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-primary/20 transition-all">
                <div className="w-10 h-10 bg-indigo-50 text-primary rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                  {i + 1}
                </div>
                <span className="font-semibold text-gray-800">{step}</span>
                <div className="ml-auto">
                  <span className="material-icons-round text-gray-300">lock</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-6">Ready to start?</h3>
            <Link to="/register" className="block w-full text-center bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all mb-4">
              Enroll for Free
            </Link>
            <Link to="/login" className="block w-full text-center border border-indigo-100 text-primary bg-indigo-50 font-bold py-4 rounded-2xl hover:bg-indigo-100 transition-all">
              Member Login
            </Link>
          </div>

          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Course Details</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-center gap-2"><span className="material-icons-round text-primary text-sm">schedule</span>{path.steps.length} Learning Steps</li>
              <li className="flex items-center gap-2"><span className="material-icons-round text-primary text-sm">workspace_premium</span>Certificate on Completion</li>
              <li className="flex items-center gap-2"><span className="material-icons-round text-primary text-sm">devices</span>Access on All Devices</li>
              <li className="flex items-center gap-2"><span className="material-icons-round text-primary text-sm">all_inclusive</span>Lifetime Access</li>
            </ul>
          </div>
        </div>
      </main>

      <GuestFooter />
    </div>
  )
}
