import { Route } from "react-router-dom"
import PublicRoute from "../components/guards/PublicRoute"


import GuestHome from '../pages/guest/GuestHome'
import GuestAbout from '../pages/guest/GuestAbout'
import GuestFeatures from '../pages/guest/GuestFeatures'
import GuestCareerPath from '../pages/guest/GuestCareerPath'
import GuestResources from '../pages/guest/GuestResources'
import GuestContact from '../pages/guest/GuestContact'
import GuestCourseDetail from '../pages/guest/GuestCourseDetail'
import PathFinder from '../pages/user/PathFinder'

export const guestRoutes = (
  <Route element={<PublicRoute />}>
    <Route path="/guest/home" element={<GuestHome />} />
    <Route path="/guest/about" element={<GuestAbout />} />
    <Route path="/guest/features" element={<GuestFeatures />} />
    <Route path="/guest/career-paths" element={<GuestCareerPath />} />
    <Route path="/guest/resources" element={<GuestResources />} />
    <Route path="/guest/contact" element={<GuestContact />} />
    <Route path="/guest/course/:title" element={<GuestCourseDetail />} />
    <Route path="/path-finder" element={<PathFinder />} />
  </Route>
)
  
