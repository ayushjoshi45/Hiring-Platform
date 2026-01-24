import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Jobs from './components/Jobs'
import Home from './components/Home'
import JobDescription from './components/JobDescription'
import Login from './components/auth/Login'
import Singup from './components/auth/Singup'
import VerifyOTP from './components/auth/VerifyOTP'
import Profile from './components/Profile'
import PostJob from './components/PostedJobs'
import Companies from './components/admin/Companies'
import CompanySetup from './components/admin/CompanySetup'
import CompanyCreate from './components/temp/CompanyCreate'
import Browse from './components/Browse'
import CreateJobs from './components/temp/CreateJobs'
import RecruiterProtectedRoute from './components/admin/ProtectedRoute'
import StudentProtectedRoute from './components/StudentProtectedRoute'
import PublicRoute from './components/PublicRoute'
import VerificationRequired from './components/VerificationRequired'
import Applicants from './components/admin/Applicants'

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/jobs",
    element: <VerificationRequired><Jobs /></VerificationRequired>
  },
  {
    path: "/description/:id",
    element: <VerificationRequired><JobDescription /></VerificationRequired>
  },
  {
    path: "/browse",
    element: <VerificationRequired><Browse /></VerificationRequired>
  },
  {
    path: "/login",
    element: <PublicRoute><Login /></PublicRoute>
  },
  {
    path: "/signup",
    element: <PublicRoute><Singup /></PublicRoute>
  },
  {
    path: "/verify-otp",
    element: <VerifyOTP />
  },
  {
    path:"/profile",
    element: <StudentProtectedRoute><Profile/></StudentProtectedRoute>
  },
  // Admin Dashboard Route Started
  {
    path:"/admin/jobs",
    element:<RecruiterProtectedRoute><PostJob/></RecruiterProtectedRoute> 
  },
  {
    path:"/admin/jobs/create",
    element:<RecruiterProtectedRoute><CreateJobs/></RecruiterProtectedRoute> 
  },
  {
    path:"/admin/jobs/:id/applicants",
    element:<RecruiterProtectedRoute><Applicants/></RecruiterProtectedRoute> 
  },
  {
    path:"/admin/companies",
    element:<RecruiterProtectedRoute><Companies/></RecruiterProtectedRoute>
  },
  {
    path:"/admin/companies/create",
    element:<RecruiterProtectedRoute><CompanyCreate/></RecruiterProtectedRoute> 
  },
  {
    path:"/admin/companies/:id",
    element:<RecruiterProtectedRoute><CompanySetup/></RecruiterProtectedRoute> 
  },
])

function App() {
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App