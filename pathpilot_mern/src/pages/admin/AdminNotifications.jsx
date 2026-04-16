import AdminSidebar from "../../components/admin/AdminSidebar";

export default function AdminNotifications() {
  return (
    <div className="flex h-screen bg-background-light overflow-hidden">

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* HEADER */}
        <header className="h-16 bg-white border-b border-neutral-border flex items-center justify-between px-6">
          <nav className="text-sm text-neutral-text-subtle flex items-center">
            <span>Admin</span>
            <span className="material-icons-round text-base mx-1">
              chevron_right
            </span>
            <span className="text-primary font-semibold">
              Notifications
            </span>
          </nav>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-4xl mx-auto">

            <h1 className="text-2xl font-bold mb-8">
              Notifications
            </h1>

            {/* EMPTY STATE (same as JSP — no content yet) */}

          </div>
        </main>

      </div>
    </div>
  );
}
