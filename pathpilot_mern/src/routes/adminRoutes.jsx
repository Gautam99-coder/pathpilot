import { Route } from "react-router-dom"
import ProtectedRoute from "../components/guards/ProtectedRoute"


import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminUsers from '../pages/admin/AdminUsers'
import AdminCareerPath from '../pages/admin/AdminCareerPath'
import AdminCreatePath from '../pages/admin/AdminCreatePath'
import AdminEditPath from '../pages/admin/AdminEditPath'
import AdminSettings from '../pages/admin/AdminSettings'
import AdminAddUser from '../pages/admin/AdminAddUser'
import AdminManageHome from '../pages/admin/AdminManageHome'
import AdminManageAbout from '../pages/admin/AdminManageAbout'
import AdminManageContact from '../pages/admin/AdminManageContact'
import AdminManageFeatures from '../pages/admin/AdminManageFeatures'
import AdminManageFooter from '../pages/admin/AdminManageFooter'
import AdminManageResources from '../pages/admin/AdminManageResources'
import AdminNotifications from '../pages/admin/AdminNotifications'
import AdminUserGroups from "../pages/admin/AdminUserGroup"

export const adminRoutes = (
  <Route element={<ProtectedRoute requiredRole="admin" />}>
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/admin/users" element={<AdminUsers />} />
    <Route path="/admin/career-paths" element={<AdminCareerPath />} />
    <Route path="/admin/create-path" element={<AdminCreatePath />} />
    <Route path="/admin/edit-path/:id" element={<AdminEditPath />} />
    <Route path="/admin/settings" element={<AdminSettings />} />
    <Route path="/admin/add-user" element={<AdminAddUser />} />
    <Route path="/admin/manage-home" element={<AdminManageHome />} />
    <Route path="/admin/manage-about" element={<AdminManageAbout />} />
    <Route path="/admin/manage-contact" element={<AdminManageContact />} />
    <Route path="/admin/manage-features" element={<AdminManageFeatures />} />
    <Route path="/admin/manage-footer" element={<AdminManageFooter />} />
    <Route path="/admin/manage-resources" element={<AdminManageResources />} />
    <Route path="/admin/notifications" element={<AdminNotifications />} />
    <Route path="/admin/user-groups/:id" element={<AdminUserGroups />} />
  </Route>
)
  
