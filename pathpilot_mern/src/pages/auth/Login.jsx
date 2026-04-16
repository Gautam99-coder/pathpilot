import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  const validate = (e) => {
    e.preventDefault()
    const errs = {}
    if (!email) errs.email = 'Email required'
    else if (!email.includes('@') || !email.includes('.')) errs.email = 'Enter valid email'
    if (!password) errs.password = 'Password required'
    else if (password.length < 6) errs.password = 'Min 6 characters'
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      if (email === 'admin@gmail.com' && password === '123456') {
        window.location.href = '/admin/dashboard'
      } else if (email === 'user@gmail.com' && password === '123456') {
        window.location.href = '/user/home'
      } else {
        setErrors({ email: 'Invalid email or password' })
      }
    }
  }

  return (
    <div className="bg-white antialiased">
      <Link to="/guest/home" className="absolute top-6 left-6 flex items-center space-x-2 bg-white/80 backdrop-blur-md border px-4 py-2 rounded-xl shadow z-10">
        <span className="material-icons-round">arrow_back</span>
        <span className="text-sm font-semibold">Back</span>
      </Link>

      <div className="flex h-screen overflow-hidden">
        {/* Left panel */}
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

        {/* Right panel */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
              <p className="text-gray-500">Enter your credentials</p>
            </div>

            <form onSubmit={validate} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Email Address</label>
                <div className="relative">
                  <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">mail_outline</span>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="name@company.com"
                  />
                </div>
                {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>}
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-semibold">Password</label>
                  <Link to="/forgot-password" className="text-sm font-bold text-indigo-600">Forgot Password?</Link>
                </div>
                <div className="relative">
                  <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">lock_outline</span>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password}</span>}
              </div>

              <div className="flex items-center">
                <input type="checkbox" className="w-4 h-4" />
                <label className="ml-2 text-sm text-gray-600">Remember me</label>
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all">
                Login
              </button>
            </form>

            <div className="relative py-8">
              <div className="border-t"></div>
            </div>

            {/* <button className="w-full bg-white border py-3 rounded-xl flex justify-center gap-3 items-center hover:bg-gray-50 transition">
              <img src="https://www.svgrepo.com/show/355037/google.svg" className="h-5" alt="Google" />
              Continue with Google
            </button> */}

            <p className="text-center mt-8 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-indigo-600">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
