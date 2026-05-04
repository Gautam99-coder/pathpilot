  
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function AdminAddUser() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
    phone: "",
    location: "",
    bio: "",
    website: ""
  });
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};
    
    // Required fields
    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Optional field validations
    if (form.phone && !/^\+?\d{10,13}$/.test(form.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Invalid phone number";
    }
    if (form.website && !/^https?:\/\/.+/.test(form.website)) {
      newErrors.website = "Website must be a valid URL (include http:// or https://)";
    }
    if (form.bio && form.bio.length > 150) {
      newErrors.bio = "Bio must be under 150 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const token = localStorage.getItem('token');
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          status: form.status,
          phone: form.phone,
          location: form.location,
          bio: form.bio,
          website: form.website
        })
      });

      if (res.ok) {
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          navigate("/admin/users");
        }, 1500);
      } else {
        const data = await res.json();
        setErrors({ email: data.message });
      }
    } catch (err) {
      console.error(err);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background-light">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-neutral-border flex items-center px-6 sticky top-0 z-10">
          <nav className="text-sm text-neutral-text-subtle flex items-center">
            Admin <span className="material-icons-round mx-1 text-gray-400">chevron_right</span>
            <span className="text-primary font-semibold">Add New User</span>
          </nav>
        </header>

        <main className="flex-1 overflow-y-auto p-10 bg-gray-50/50">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl border shadow-sm p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-icons-round">person_add</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Create User Account</h2>
                  <p className="text-xs text-gray-400">Register a new student to the platform</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Required Fields Section */}
                <div className="border-b border-gray-100 pb-6">
                  <h3 className="text-sm font-bold text-gray-600 mb-4">Required Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Full Name *</label>
                      <input
                        placeholder="Enter full name"
                        value={form.name}
                        onChange={(e)=>{
                          setForm({...form, name: e.target.value});
                          if (errors.name) setErrors({...errors, name: ""});
                        }}
                        className={`w-full border px-4 py-3 rounded-xl bg-gray-100 transition focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none ${errors.name ? 'border-red-500' : 'border-transparent'}`}
                      />
                      {errors.name && <span className="text-red-500 text-[10px] ml-1 mt-1 block">{errors.name}</span>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Email Address *</label>
                      <input
                        type="email"
                        placeholder="example@domain.com"
                        value={form.email}
                        onChange={(e)=>{
                          setForm({...form, email: e.target.value});
                          if (errors.email) setErrors({...errors, email: ""});
                        }}
                        className={`w-full border px-4 py-3 rounded-xl bg-gray-100 transition focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none ${errors.email ? 'border-red-500' : 'border-transparent'}`}
                      />
                      {errors.email && <span className="text-red-500 text-[10px] ml-1 mt-1 block">{errors.email}</span>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Password *</label>
                      <input
                        type="password"
                        placeholder="Enter password (min 6 characters)"
                        value={form.password}
                        onChange={(e)=>{
                          setForm({...form, password: e.target.value});
                          if (errors.password) setErrors({...errors, password: ""});
                        }}
                        className={`w-full border px-4 py-3 rounded-xl bg-gray-100 transition focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none ${errors.password ? 'border-red-500' : 'border-transparent'}`}
                      />
                      {errors.password && <span className="text-red-500 text-[10px] ml-1 mt-1 block">{errors.password}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Role</label>
                        <select
                          value={form.role}
                          onChange={(e)=> setForm({...form, role: e.target.value})}
                          className="w-full border px-4 py-3 rounded-xl bg-gray-100 transition focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none border-transparent"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Status</label>
                        <select
                          value={form.status}
                          onChange={(e)=> setForm({...form, status: e.target.value})}
                          className="w-full border px-4 py-3 rounded-xl bg-gray-100 transition focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none border-transparent"
                        >
                          <option value="active">Active</option>
                          <option value="banned">Banned</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Optional Fields Section */}
                <div>
                  <h3 className="text-sm font-bold text-gray-600 mb-4">Additional Information (Optional)</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Phone Number</label>
                        <input
                          type="tel"
                          placeholder="Enter phone number"
                          value={form.phone}
                          onChange={(e)=>{
                            setForm({...form, phone: e.target.value});
                            if (errors.phone) setErrors({...errors, phone: ""});
                          }}
                          className={`w-full border px-4 py-3 rounded-xl bg-gray-100 transition focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none ${errors.phone ? 'border-red-500' : 'border-transparent'}`}
                        />
                        {errors.phone && <span className="text-red-500 text-[10px] ml-1 mt-1 block">{errors.phone}</span>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Location</label>
                        <input
                          placeholder="Enter location"
                          value={form.location}
                          onChange={(e)=> setForm({...form, location: e.target.value})}
                          className="w-full border px-4 py-3 rounded-xl bg-gray-100 transition focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Website</label>
                      <input
                        type="url"
                        placeholder="https://yourwebsite.com"
                        value={form.website}
                        onChange={(e)=>{
                          setForm({...form, website: e.target.value});
                          if (errors.website) setErrors({...errors, website: ""});
                        }}
                        className={`w-full border px-4 py-3 rounded-xl bg-gray-100 transition focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none ${errors.website ? 'border-red-500' : 'border-transparent'}`}
                      />
                      {errors.website && <span className="text-red-500 text-[10px] ml-1 mt-1 block">{errors.website}</span>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Bio ({form.bio.length}/150)</label>
                      <textarea
                        rows="3"
                        placeholder="Tell us about this user"
                        value={form.bio}
                        onChange={(e)=>{
                          setForm({...form, bio: e.target.value});
                          if (errors.bio) setErrors({...errors, bio: ""});
                        }}
                        maxLength="150"
                        className={`w-full border px-4 py-3 rounded-xl bg-gray-100 transition focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none resize-none ${errors.bio ? 'border-red-500' : 'border-transparent'}`}
                      />
                      {errors.bio && <span className="text-red-500 text-[10px] ml-1 mt-1 block">{errors.bio}</span>}
                    </div>
                  </div>
                </div>

                {/* General Error */}
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-600 text-sm">{errors.general}</p>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Link to="/admin/users" className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:bg-gray-100 transition">
                    Cancel
                  </Link>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="bg-primary text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Creating...' : 'Create User'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </main>

        {showToast && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce z-50">
            <span className="material-icons-round text-green-400 text-xl">check_circle</span>
            <span className="font-bold">User Account Created Successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
}
