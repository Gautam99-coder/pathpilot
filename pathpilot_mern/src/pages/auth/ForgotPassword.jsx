  
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const navigate = useNavigate()

  const handleSendOtp = (e) => {
    e.preventDefault()
    
    if (!email) {
      setError('Email required')
      return
    } else if (!email.includes('@') || !email.includes('.')) {
      setError('Enter valid email')
      return
    }

    setError('')
    // Fake OTP send
    setShowPopup(true)
    
    // Auto redirect after 3 seconds
    setTimeout(() => {
      navigate('/login')
    }, 3000)
  }

  return (
    <div className="bg-white antialiased">
      <Link to="/login" className="absolute top-6 left-6 flex items-center space-x-2 bg-white border px-4 py-2 rounded-xl shadow z-10 hover:bg-gray-50 transition">
        <span className="material-icons-round">arrow_back</span>
        <span className="text-sm font-semibold">Back to Login</span>
      </Link>

      <div className="flex h-screen overflow-hidden">
        {/* Left panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 p-12 flex-col justify-between text-white">
          <div>
            <div className="flex items-center space-x-2 mb-12">
              <span className="material-icons-round text-3xl">rocket_launch</span>
              <span className="text-2xl font-bold">PathPilot</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Forgot your <br />Password?
            </h1>
            <p className="opacity-80 max-w-md">No worries, we'll send you reset instructions.</p>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
          
          {/* Popup Modal */}
          {showPopup && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center max-w-sm mx-4 transform animate-bounce">
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-icons-round text-3xl">mark_email_read</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">OTP Sent!</h3>
                <p className="text-gray-500 mb-6">Please check your inbox at <span className="font-bold text-gray-700">{email}</span> for instructions to reset your password.</p>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-1.5 rounded-full animate-pulse w-full"></div>
                </div>
                <p className="text-xs text-gray-400 mt-4">Redirecting to login...</p>
              </div>
            </div>
          )}

          <div className="w-full max-w-md">
            <div className="mb-10">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <span className="material-icons-round">key</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
              <p className="text-gray-500">Enter your Gmail and we'll send you an OTP to reset your password.</p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Email Address</label>
                <div className="relative">
                  <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">mail_outline</span>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="name@gmail.com"
                  />
                </div>
                {error && <span className="text-red-500 text-xs mt-1 block">{error}</span>}
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95">
                Send OTP
              </button>
            </form>

            <p className="text-center mt-8 text-sm text-gray-500">
              Remember your password?{' '}
              <Link to="/login" className="font-bold text-indigo-600 hover:underline">Log In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
