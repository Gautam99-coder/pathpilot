  
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [errors, setErrors] = useState({})

  const validate = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = 'Full name required'
    if (!form.email.trim()) errs.email = 'Email required'
    if (form.password.length < 6) errs.password = 'Min 6 characters'
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      window.location.href = '/user/home'
    }
  }

  return (
    <div className="bg-white antialiased">
      <Link to="/guest/home" className="absolute top-6 left-6 flex items-center space-x-2 bg-white/80 backdrop-blur-md border px-4 py-2 rounded-xl shadow z-10">
        <span className="material-icons-round">arrow_back</span>
        <span className="text-sm font-semibold">Back</span>
      </Link>

      <div className="flex h-screen overflow-hidden">
        <div className="hidden lg:flex lg:w-1/2 login-gradient p-12 flex-col justify-between text-white">
          <div>
            <div className="flex items-center space-x-2 mb-12">
              <span className="material-icons-round text-3xl">rocket_launch</span>
              <span className="text-2xl font-bold">PathPilot</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Your journey to a<br />tech career starts<br />here.
            </h1>
            <p className="opacity-80 max-w-md">Join our community of aspiring professionals.</p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-2">Create Your Account</h2>
              <p className="text-gray-500">Join our community</p>
            </div>

            <form onSubmit={validate} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={e => setForm({...form, fullName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Ram Kurmi"
                />
                {errors.fullName && <span className="text-red-500 text-xs mt-1 block">{errors.fullName}</span>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="you@example.com"
                />
                {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="••••••••"
                />
                {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password}</span>}
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition">
                Sign Up
              </button>
            </form>

            <p className="text-center mt-8 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-indigo-600">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
