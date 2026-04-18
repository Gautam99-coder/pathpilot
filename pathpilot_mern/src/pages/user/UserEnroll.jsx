import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import UserNavbar from "../../components/user/UserNavbar";
import UserFooter from "../../components/user/UserFooter";

export default function UserEnroll() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: pathId } = useParams();

  const params = new URLSearchParams(location.search);
  const title = params.get("title") || "New Career Path";
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  // Enrollment state check removed for stateless visual flow

  // ✅ VALIDATION
  const validateForm = () => {
    let err = {};
    let isValid = true;

    if (!form.name.trim()) {
      err.name = "Full name is required";
      isValid = false;
    }

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!form.email.trim()) {
      err.email = "Email is required";
      isValid = false;
    } else if (!emailPattern.test(form.email)) {
      err.email = "Enter valid email address";
      isValid = false;
    }

    const phonePattern = /^[0-9]{10}$/;
    if (form.phone && !phonePattern.test(form.phone)) {
      err.phone = "Enter valid 10-digit phone number";
      isValid = false;
    }

    setErrors(err);
    return isValid;
  };

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      const token = localStorage.getItem('token');
      // pathId comes from /user/course/:id route or URL param
      const enrollPathId = pathId || params.get('pathId');

      try {
        const res = await fetch(`/api/user/enroll/${enrollPathId}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          navigate(`/user/progress/${enrollPathId}`);
        } else {
          const data = await res.json();
          setErrors({ name: data.message });
        }
      } catch (err) {
        setErrors({ name: 'Network error. Please try again.' });
      }
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f9fc] min-h-screen">
      <UserNavbar />

      <div className="max-w-4xl mx-auto py-20 px-6">
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-12">

          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Enroll in Course
          </h1>

          <p className="text-gray-500 mb-10">
            Complete your enrollment to start learning.
          </p>

          {/* COURSE TITLE */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-10 text-center">
            <p className="text-xs font-bold text-indigo-500 uppercase">
              Selected Course
            </p>
            <h2 className="text-2xl font-bold text-indigo-700">
              {title}
            </h2>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* NAME */}
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
                placeholder="Enter your name"
              />
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
                placeholder="Enter your email"
              />
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            </div>

            {/* PHONE */}
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Phone
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                className="w-full mt-2 p-3 border rounded-xl bg-gray-50"
                placeholder="Enter phone number"
              />
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Enrolling...' : 'Confirm Enrollment'}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border rounded-xl text-gray-600"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>

      <UserFooter />
    </div>
  );
}
