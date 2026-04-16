import { useState, useRef } from 'react'
import AdminSidebar from '../../components/admin/AdminSidebar'

export default function UserSettings() {
  const [form, setForm] = useState({
    fullName: 'Ram Kurmi',
    email: 'rkurmi101@rku.ac.in',
    phone: '+91 9876543210',
    location: 'Rajkot, GJ',
    bio: 'B.Tech student passionate about full-stack development.'
  })

  const [saved, setSaved] = useState(false)

  // ✅ validation errors
  const [errors, setErrors] = useState({})

  const [image, setImage] = useState(null)
  const fileInputRef = useRef(null)

  // ✅ VALIDATION FUNCTION
  const validate = () => {
    let newErrors = {}

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Invalid email format"
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\+?\d{10,13}$/.test(form.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Invalid phone number"
    }

    if (!form.location.trim()) {
      newErrors.location = "Location is required"
    }

    if (form.bio.length > 150) {
      newErrors.bio = "Bio must be under 150 characters"
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validate()) return

    localStorage.setItem("userName", form.fullName)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setImage(imageUrl)
    }
  }

  return (
    <div className="bg-[#f8f9fc] min-h-screen flex antialiased">
      <AdminSidebar />

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

                {/* AVATAR */}
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
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
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
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
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
                    {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
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
                  {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
                </div>
              </div>
            </div>

            {/* PASSWORD (no validation added to keep UI same) */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">
                Change Password
              </h2>

              <div className="space-y-6">
                {['Current Password', 'New Password', 'Confirm New Password'].map((label, i) => (
                  <div key={i}>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">
                      {label}
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-gray-50 rounded-2xl px-5 py-4 font-medium outline-none focus:ring-2 focus:ring-primary/20 border-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* BUTTON */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                Save Changes
              </button>

              {saved && (
                <span className="flex items-center gap-2 text-green-600 font-bold text-sm">
                  <span className="material-icons-round text-sm">
                    check_circle
                  </span>
                  Saved successfully!
                </span>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
