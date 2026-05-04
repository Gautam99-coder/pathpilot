import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';

const formatDate = value =>
  new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

export default function AdminNotifications() {
  const [contacts, setContacts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [replyingId, setReplyingId] = useState('');
  const [replyDrafts, setReplyDrafts] = useState({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    title: '',
    message: '',
    type: 'broadcast',
    audience: 'all'
  });

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const [contactsRes, notificationsRes] = await Promise.all([
        fetch('/api/admin/contacts', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/notifications', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const contactsData = await contactsRes.json();
      const notificationsData = await notificationsRes.json();

      if (!contactsRes.ok) throw new Error(contactsData.message || 'Failed to load contacts');
      if (!notificationsRes.ok) throw new Error(notificationsData.message || 'Failed to load notifications');

      setContacts(Array.isArray(contactsData) ? contactsData : []);
      setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submitNotification = async e => {
    e.preventDefault();

    if (!form.title.trim() || !form.message.trim()) {
      setError('Title and message are required');
      return;
    }

    try {
      setSaving(true);
      setError('');
      setMessage('');

      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: form.title.trim(),
          message: form.message.trim(),
          type: form.type,
          audience: form.audience
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send notification');

      setForm({ title: '', message: '', type: 'broadcast', audience: 'all' });
      setMessage('Notification sent successfully');
      await fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateContact = async (contactId, status) => {
    try {
      const res = await fetch(`/api/admin/contacts/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update contact');

      setContacts(current => current.map(contact => (contact._id === contactId ? data : contact)));
    } catch (err) {
      setError(err.message);
    }
  };

  const sendReply = async contactId => {
    const reply = (replyDrafts[contactId] || '').trim();

    if (!reply) {
      setError('Reply message is required');
      return;
    }

    try {
      setReplyingId(contactId);
      setError('');
      setMessage('');

      const res = await fetch(`/api/admin/contacts/${contactId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reply })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send reply');

      setContacts(current => current.map(contact => (contact._id === contactId ? data : contact)));
      setReplyDrafts(current => ({ ...current, [contactId]: '' }));
      setMessage('Reply sent successfully');
      await fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setReplyingId('');
    }
  };

  const markNotificationRead = async notificationId => {
    try {
      const res = await fetch(`/api/admin/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to mark notification as read');

      setNotifications(current =>
        current.map(notification => (notification._id === notificationId ? data : notification))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const newContacts = contacts.filter(contact => contact.status === 'new').length;
  const unreadNotifications = notifications.filter(notification => !notification.isRead).length;

  return (
    <div className="flex h-screen bg-background-light overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-neutral-border flex items-center justify-between px-6">
          <nav className="text-sm text-neutral-text-subtle flex items-center">
            <span>Admin</span>
            <span className="material-icons-round text-base mx-1">chevron_right</span>
            <span className="text-primary font-semibold">Notifications</span>
          </nav>
          <div className="text-sm text-gray-500">
            {newContacts} new contact messages, {unreadNotifications} unread notifications
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h1 className="text-2xl font-bold mb-2">Messages & Broadcasts</h1>
              <p className="text-sm text-gray-500">
                Review contact form messages, reply to users, and send broadcasts from one place.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm">{error}</div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-2xl text-sm">{message}</div>
            )}

            <div className="grid xl:grid-cols-[1.1fr,0.9fr] gap-8">
              <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Incoming Contact Messages</h2>
                    <p className="text-sm text-gray-500 mt-1">Messages submitted from guest and user contact forms.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase">
                    {contacts.length} Total
                  </span>
                </div>

                {loading ? (
                  <p className="text-sm text-gray-400">Loading messages...</p>
                ) : contacts.length === 0 ? (
                  <div className="py-12 text-center text-gray-400">
                    <span className="material-icons-round text-4xl">mail_outline</span>
                    <p className="mt-3 text-sm">No contact messages yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contacts.map(contact => (
                      <article key={contact._id} className="border border-gray-100 rounded-2xl p-5 bg-gray-50/50">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                          <div>
                            <h3 className="font-bold text-gray-900">{contact.subject || 'No Subject'}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {contact.name} • {contact.email}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {contact.source} • {formatDate(contact.createdAt)}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                              contact.status === 'new'
                                ? 'bg-red-50 text-red-600'
                                : contact.status === 'reviewed'
                                  ? 'bg-amber-50 text-amber-600'
                                  : 'bg-green-50 text-green-600'
                            }`}
                          >
                            {contact.status}
                          </span>
                        </div>

                        <p className="text-sm text-gray-700 whitespace-pre-line">{contact.message}</p>

                        {contact.adminReply && (
                          <div className="mt-4 rounded-2xl bg-white border border-green-100 p-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-green-600">Last Reply</p>
                            <p className="text-sm text-gray-700 whitespace-pre-line mt-2">{contact.adminReply}</p>
                            {contact.repliedAt && (
                              <p className="text-xs text-gray-400 mt-2">Sent on {formatDate(contact.repliedAt)}</p>
                            )}
                          </div>
                        )}

                        <div className="mt-4">
                          <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">
                            Admin Reply
                          </label>
                          <textarea
                            rows="4"
                            value={replyDrafts[contact._id] || ''}
                            onChange={e =>
                              setReplyDrafts(current => ({ ...current, [contact._id]: e.target.value }))
                            }
                            className="w-full rounded-2xl bg-white px-4 py-3 outline-none resize-none border border-gray-200 focus:ring-2 focus:ring-primary/20"
                            placeholder={`Reply to ${contact.name}...`}
                          />
                        </div>

                        <div className="flex flex-wrap gap-3 mt-4">
                          <button
                            type="button"
                            onClick={() => updateContact(contact._id, 'reviewed')}
                            className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:border-indigo-300"
                          >
                            Mark Reviewed
                          </button>
                          <button
                            type="button"
                            onClick={() => updateContact(contact._id, 'resolved')}
                            className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
                          >
                            Mark Resolved
                          </button>
                          <button
                            type="button"
                            onClick={() => sendReply(contact._id)}
                            disabled={replyingId === contact._id}
                            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60"
                          >
                            {replyingId === contact._id ? 'Sending Reply...' : 'Send Reply'}
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              <div className="space-y-8">
                <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">Create Notification</h2>
                  <p className="text-sm text-gray-500 mb-6">Send updates, feedback, or broadcasts that appear in the admin message center.</p>

                  <form onSubmit={submitNotification} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">Title</label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        className="w-full rounded-2xl bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Platform update"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">Type</label>
                        <select
                          value={form.type}
                          onChange={e => setForm({ ...form, type: e.target.value })}
                          className="w-full rounded-2xl bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="broadcast">Broadcast</option>
                          <option value="feedback">Feedback</option>
                          <option value="update">Update</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">Audience</label>
                        <select
                          value={form.audience}
                          onChange={e => setForm({ ...form, audience: e.target.value })}
                          className="w-full rounded-2xl bg-gray-50 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="all">All</option>
                          <option value="users">Users</option>
                          <option value="admins">Admins</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">Message</label>
                      <textarea
                        rows="5"
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        className="w-full rounded-2xl bg-gray-50 px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Write your broadcast or update here..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full rounded-2xl bg-primary text-white font-bold py-3 hover:bg-primary-dark disabled:opacity-60"
                    >
                      {saving ? 'Sending...' : 'Send Notification'}
                    </button>
                  </form>
                </section>

                <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Recent Notifications</h2>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{notifications.length} Items</span>
                  </div>

                  {loading ? (
                    <p className="text-sm text-gray-400">Loading notifications...</p>
                  ) : notifications.length === 0 ? (
                    <p className="text-sm text-gray-400">No notifications yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {notifications.map(notification => (
                        <div key={notification._id} className="border border-gray-100 rounded-2xl p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-2">
                                {notification.type} • {notification.audience} • {formatDate(notification.createdAt || notification.date)}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <button
                                type="button"
                                onClick={() => markNotificationRead(notification._id)}
                                className="text-xs font-bold text-indigo-600 hover:underline"
                              >
                                Mark read
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
