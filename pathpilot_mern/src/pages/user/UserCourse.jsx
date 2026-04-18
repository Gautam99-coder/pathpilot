import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function EnrollPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // get title from route (like ?title=Web Dev)
  const queryParams = new URLSearchParams(location.search);
  const title = queryParams.get("title") || "New Career Path";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
      isValid = false;
    }

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!form.email.match(emailPattern)) {
      newErrors.email = "Enter valid email address";
      isValid = false;
    }

    const phonePattern = /^[0-9]{10}$/;
    if (form.phone && !form.phone.match(phonePattern)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Form Data:", form, "Course:", title);
      alert("Enrollment Successful 🚀");

      // redirect (optional)
      // navigate("/progress");
    }
  };

  return (
    <div className="bg-[#f8f9fc] min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-12">

          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Enroll in Course
          </h1>
          <p className="text-gray-500 mb-10 font-medium">
            Complete your enrollment to start your professional learning journey.
          </p>

          {/* Selected Path */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-[2rem] p-8 mb-10">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-2 text-center">
              Selected Career Path
            </span>
            <h2 className="text-2xl font-extrabold text-primary text-center">
              {title}
            </h2>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-8">

            <div className="grid md:grid-cols-2 gap-8">
              {/* Name */}
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full bg-gray-50 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="Ram Kurmi"
                />
                <span className="text-red-500 text-xs ml-1">
                  {errors.name}
                </span>
              </div>

              {/* Phone */}
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2 ml-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                  className="w-full bg-gray-50 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-purple-300"
                  placeholder="9876543210"
                />
                <span className="text-red-500 text-xs ml-1">
                  {errors.phone}
                </span>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2 ml-1">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full bg-gray-50 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-purple-300"
                placeholder="ram@example.com"
              />
              <span className="text-red-500 text-xs ml-1">
                {errors.email}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-4 pt-6">
              <button
                type="submit"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-5 rounded-2xl shadow-lg transition active:scale-95"
              >
                Confirm Enrollment
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-10 py-5 rounded-2xl border border-gray-200 font-bold text-gray-400 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
