import { Route } from "react-router-dom"
import ProtectedRoute from "../components/guards/ProtectedRoute"


import UserHome from '../pages/user/UserHome'
import UserProfile from '../pages/user/UserProfile'
import UserCareerPath from '../pages/user/UserCareerPath'
import UserFeatures from '../pages/user/UserFeatures'
import UserResources from '../pages/user/UserResources'
import UserAbout from '../pages/user/UserAbout'
import UserContact from '../pages/user/UserContact'
import UserCourseDetail from '../pages/user/UserCourseDetail'
import UserEnroll from '../pages/user/UserEnroll'
import UserCertificates from '../pages/user/UserCertificates'
import UserProgress from '../pages/user/UserProgress'
import UserSettings from '../pages/user/UserSettings'
import UserRoadmaps from '../pages/user/UserRoadmaps'

import UserEditPath from '../pages/user/UserEditPath'
import UserCourse from "../pages/user/UserCourse"
import UserModule from "../pages/user/UserModule"
import UserQuiz from "../pages/user/UserQuize"
import CertificatePage from "../pages/user/CertificatePage"
import PathFinder from "../pages/user/PathFinder"

export const userRoutes = (
  <Route element={<ProtectedRoute requiredRole="user" />}>
    <Route path="/user/home" element={<UserHome />} />
    <Route path="/user/profile" element={<UserProfile />} />
    <Route path="/user/career-paths" element={<UserCareerPath />} />
    <Route path="/user/features" element={<UserFeatures />} />
    <Route path="/user/resources" element={<UserResources />} />
    <Route path="/user/about" element={<UserAbout />} />
    <Route path="/user/contact" element={<UserContact />} />
    <Route path="/user/course/:id" element={<UserCourseDetail />} />
    <Route path="/user/enroll/:id" element={<UserEnroll />} />
    <Route path="/user/enrolluser" element={<UserEnroll />} />    
    <Route path="/user/certificates" element={<UserCertificates />} />
    <Route path="/user/progress/:id" element={<UserProgress />} />
    <Route path="/user/settings" element={<UserSettings />} />
    <Route path="/user/career-mgmt" element={<UserRoadmaps />} />

    <Route path="/user/edit-path/:id" element={<UserEditPath />} />
    <Route path="/user/course/:title/learn" element={<UserCourse />} />
    <Route path="/user/module" element={<UserModule />} />
    <Route path="/user/quiz" element={<UserQuiz />} />
    <Route path="/certificate" element={<CertificatePage />} />
    <Route path="/user/path-finder" element={<PathFinder />} />
  </Route>
)
