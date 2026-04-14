import { useState, useRef, useEffect } from 'react'
import UserSidebar from '../../components/user/UserSidebar'

export default function UserSettings() {
  const [form, setForm] = useState(() => {
    try {
      const c = JSON.parse(sessionStorage.getItem('profile'))
      if (c) return { fullName: c.name||'', email: c.email||'', phone: c.phone||'', location: c.location||'', bio: c.bio||'' }
    } catch {}
    return { fullName: localStorage.getItem('userName')||'', email: localStorage.getItem('userEmail')||'', phone: '', location: '', bio: '' }
  })
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [image, setImage] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/auth/profile', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        setForm({ fullName: data.name||'', email: data.email||'', phone: data.phone||'', location: data.location||'', bio: data.bio||'' })
        if (data.avatar) setImage(data.avatar)
        sessionStorage.setItem('profile', JSON.stringify(data))
      })
      .catch(() => {})
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token');
    
    try {
      setIsUploading(true);
      setError('');
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
           name: form.fullName,
           bio: form.bio,
           location: form.location,
           phone: form.phone,
           avatar: image
        })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", form.fullName);
        localStorage.setItem("userEmail", form.email);
        // update session cache too
        sessionStorage.setItem('profile', JSON.stringify({ ...data, name: form.fullName, email: form.email }))
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(data.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }

  // ✅ NEW: image change handler (Base64 conversion)
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className="bg-[#f8f9fc] min-h-screen flex antialiased">
      <UserSidebar />

      <main className="flex-grow p-10">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Account Settings
          </h1>
          <p className="text-gray-500 text-sm mb-10">
            Manage your profile and preferences
          </p>

          <form onSubmit={handleSubmit}>
            {/* PROFILE */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">
                Profile Information
              </h2>

              <div className="space-y-6">

                {/* ✅ UPDATED AVATAR SECTION */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-3xl overflow-hidden border-4 border-white shadow-md bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-700">
                    
                    {image ? (
                      <img
                        src={image}
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      form.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                    )}

                  </div>

                  <div>
                    <p className="font-bold text-gray-800">
                      {form.fullName}
                    </p>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="text-xs text-primary font-bold mt-1 hover:underline"
                    >
                      Change Photo
                    </button>

                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* FORM */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) =>
                        setForm({ ...form, fullName: e.target.value })
                      }
                      className="w-full bg-gray-50 rounded-2xl px-5 py-4 font-medium outline-none focus:ring-2 focus:ring-primary/20 border-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full bg-gray-50 rounded-2xl px-5 py-4 font-medium outline-none focus:ring-2 focus:ring-primary/20 border-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="w-full bg-gray-50 rounded-2xl px-5 py-4 font-medium outline-none focus:ring-2 focus:ring-primary/20 border-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) =>
                        setForm({ ...form, location: e.target.value })
                      }
                      className="w-full bg-gray-50 rounded-2xl px-5 py-4 font-medium outline-none focus:ring-2 focus:ring-primary/20 border-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">
                    Bio
                  </label>
                  <textarea
                    rows="3"
                    value={form.bio}
                    onChange={(e) =>
                      setForm({ ...form, bio: e.target.value })
                    }
                    className="w-full bg-gray-50 rounded-2xl px-5 py-4 font-medium outline-none focus:ring-2 focus:ring-primary/20 border-none resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* PASSWORD */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Password & Security
              </h2>
              <p className="text-gray-500 mb-6 text-sm">
                For security reasons, password changes are handled securely via email OTP verification. 
              </p>
              <button
                type="button"
                onClick={() => window.location.href = '/forgot-password'}
                className="px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-2xl w-full sm:w-auto transition-all"
              >
                Reset Password
              </button>
            </div>

            {/* BUTTON */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isUploading}
                className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {isUploading ? 'Saving...' : 'Save Changes'}
              </button>

              {saved && (
                <span className="flex items-center gap-2 text-green-600 font-bold text-sm">
                  <span className="material-icons-round text-sm">
                    check_circle
                  </span>
                  Profile updated successfully!
                </span>
              )}

              {error && (
                <span className="flex items-center gap-2 text-red-500 font-bold text-sm">
                  <span className="material-icons-round text-sm">
                    error
                  </span>
                  {error}
                </span>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
