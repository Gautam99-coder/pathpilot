import { useState } from 'react'
import UserNavbar from '../../components/user/UserNavbar'
import UserFooter from '../../components/user/UserFooter'

export default function UserContact() {
  const [form, setForm] = useState({ fullName:'', email:'', subject:'', message:'' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const validate = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = 'Full name required'
    if (!form.email.match(/^[^ ]+@[^ ]+\.[a-z]{2,3}$/)) errs.email = 'Valid email required'
    if (!form.subject.trim()) errs.subject = 'Subject required'
    if (!form.message.trim()) errs.message = 'Message required'
    setErrors(errs)
    if (Object.keys(errs).length === 0) setSubmitted(true)
  }
  return (
    <div className="bg-[#f8f9fc] text-gray-900 min-h-screen flex flex-col antialiased">
      <UserNavbar />
      <section className="bg-gradient-to-br from-indigo-700 via-primary to-purple-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-12">
          <span className="bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Member Support</span>
          <h1 className="text-5xl font-bold mt-6 mb-4 tracking-tight">Get in Touch</h1>
          <p className="text-indigo-100 max-w-2xl font-medium leading-relaxed">Have questions about your learning journey? We're here to help you succeed.</p>
        </div>
      </section>
      <main className="flex-grow py-16">
        <div className="max-w-7xl mx-auto px-12">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm p-12 border border-gray-100">
              <h2 className="text-3xl font-bold mb-8">Send us a message</h2>
              {submitted ? (
                <div className="text-center py-12">
                  <span className="material-icons-round text-5xl text-green-500">check_circle</span>
                  <h3 className="text-2xl font-bold mt-4">Message Sent!</h3>
                  <p className="text-gray-500 mt-2">We'll get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={validate} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">Full Name</label>
                      <input type="text" value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium" placeholder="Ram Kurmi" />
                      {errors.fullName && <span className="text-red-500 text-xs mt-1 block">{errors.fullName}</span>}
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">Email Address</label>
                      <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium" placeholder="you@email.com" />
                      {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">Subject</label>
                    <input type="text" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 outline-none font-medium" placeholder="How can we help?" />
                    {errors.subject && <span className="text-red-500 text-xs mt-1 block">{errors.subject}</span>}
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">Message</label>
                    <textarea rows="5" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-primary/20 outline-none resize-none font-medium" placeholder="Your message..."></textarea>
                    {errors.message && <span className="text-red-500 text-xs mt-1 block">{errors.message}</span>}
                  </div>
                  <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-5 rounded-2xl shadow-xl transition-all active:scale-95">Submit</button>
                </form>
              )}
            </div>
            <div className="space-y-6">
              {[
                { icon: 'mail', bg: 'indigo-50', color: 'primary', title: 'Email', info: 'support@pathpilot.io' },
                { icon: 'location_on', bg: 'indigo-50', color: 'primary', title: 'Campus Office', info: 'RK University, Rajkot\nGujarat, India' },
                { icon: 'forum', bg: 'purple-50', color: 'purple-600', title: 'Community', info: 'Join our Discord' },
              ].map((c,i) => (
                <div key={i} className="p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:border-primary/20 transition-all">
                  <div className={`bg-${c.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                    <span className={`material-icons-round text-${c.color}`}>{c.icon}</span>
                  </div>
                  <h3 className="font-bold text-gray-900">{c.title}</h3>
                  <p className="text-gray-500 text-sm mt-1 whitespace-pre-line">{c.info}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <UserFooter />
    </div>
  )
}
