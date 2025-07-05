import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from "react";
import { AuthProvider, AuthContext } from "../context/Authcontext";
import { CourseProvider } from "../context/CourseContext";
import { UserInfoProvider } from "../context/UserInfoContext";
import '@fortawesome/fontawesome-free/css/all.min.css';

// first pages
import Home from './pages/home';
import About from './pages/about';
import Register from './pages/auth';
import Login from './pages/login';
import Courses from './pages/courses';

// user dashboard pages
import UserDashboard from './pages/userDashboard';
import OnlineClass from './pages/online';
import Assets from './pages/assets';
import Settings from './pages/settings';
import Profile from './pages/profile';
import GeneralProfile from './pages/generalProfile';
import Assignment from './pages/assignment';
import Certificates from './pages/certificates';
// Certificates

// courses pages
import CopyRight from './pages/coursesPages/copyRight';
import BasicComputing from './pages/coursesPages/basicComputing';
import VirtualAssistant from './pages/coursesPages/virtualAssistant';
import DataEntry from './pages/coursesPages/dataEntry';

// email verification pages
import VerifyEmailInfo from './pages/verifyEmailInfo';
import VerifyEmail from "./pages/verifyEmail";
import ResendVerification from './pages/resendVerification';
import GoogleSuccess from './pages/GoogleSuccess';

// forgot password pages
import ForgotPassword from './pages/forgotPassword';
import ResetPassword from './pages/resetPassword';

// admin pages
import Dashboard from './pages/admin/Dashboard';
import UISettings from "./pages/admin/UISettings";
import TakeLecture from "./pages/admin/TakeLecture";
import AdminProfile from "./pages/admin/Profile";
import Users from "./pages/admin/Users";
import Transactions from "./pages/admin/Transactions";
import Enrollments from "./pages/admin/Enrollments";
import AdminList from "./pages/admin/AdminList";
import ContactMessages from "./pages/admin/ContactMessages";
import PublishAsset from "./pages/admin/PublishAsset";
import PostBlog from "./pages/admin/PostBlog";
import Apply from './pages/apply';
import SuperAdminList from './pages/admin/superAdminList';
import Mailer from './pages/admin/mailer';
import CreateAssignment from './pages/admin/createAssignment';
import AssignmentCorrections from './pages/admin/assignmentCorrections';
import MediaVideo from './pages/admin/mediaVideo';
import VideoPage from './pages/videoPage';

// Helper component for protected routes
function ProtectedRoute({ children, adminOnly, userOnly, verificationOnly }) {
  const { user, authLoading } = useContext(AuthContext);

  // Wait for auth to load before making a decision
  if (authLoading) {
    return <div>Loading...</div>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Only show verification pages if not verified
  if (verificationOnly && user.verificationToken !== null) {
    return <Navigate to="/" replace />;
  }

  // Only show admin pages if isAdmin and isVerified
  if (adminOnly) {
    if (!user.isAdmin || !user.isVerified) {
      return <Navigate to="/" replace />;
    }
    return children;
  }

  // Only show user pages if not admin and isVerified
  if (userOnly) {
    if (user.isAdmin || !user.isVerified) {
      return <Navigate to="/" replace />;
    }
    // Allow access to any userOnly page, do not force redirect to dashboard
    return children;
  }

  // Default: allow
  return children;
}

// Helper for guest-only routes (e.g. login, register)
function GuestOnlyRoute({ children }) {
  const { user, authLoading } = useContext(AuthContext);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    // Redirect authenticated users to dashboard or admin dashboard ONLY when accessing login/register
    if (user.isAdmin) return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route
        path='/login'
        element={
          <GuestOnlyRoute>
            <Login />
          </GuestOnlyRoute>
        }
      />
      <Route
        path="/auth"
        element={
          <GuestOnlyRoute>
            <Register />
          </GuestOnlyRoute>
        }
      />
      <Route 
        path="/forgot-password" 
        element={
          <GuestOnlyRoute>
            <ForgotPassword />
          </GuestOnlyRoute>
        } />
      <Route 
        path="/reset-password" 
        element={
          <GuestOnlyRoute>
            <ResetPassword />
          </GuestOnlyRoute>
        } />
      <Route path="/about" element={<About />} />
      <Route path="/online-class" element={
        <ProtectedRoute userOnly>
          <OnlineClass />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute userOnly>
          <UserDashboard />
        </ProtectedRoute>
      } />
      <Route path="/assets" element={
        <ProtectedRoute userOnly>
          <Assets />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute userOnly>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="/apply-course" element={
        <ProtectedRoute userOnly>
          <Apply />
        </ProtectedRoute>
      } />
      {/* Specific route must come before the general one */}
      <Route path="/profile-search/:userId" element={
        <ProtectedRoute userOnly>
          <GeneralProfile />
        </ProtectedRoute>
      } />
      <Route path="/certificates" element={
        <ProtectedRoute userOnly>
          <Certificates />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute userOnly>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/assignment" element={
        <ProtectedRoute userOnly>
          <Assignment />
        </ProtectedRoute>
      } />
      <Route path="/video" element={
        <ProtectedRoute userOnly>
          <VideoPage />
        </ProtectedRoute>
      } />

      <Route path="/courses" element={<Courses />} />

      {/* Course description pages */}
      <Route path="/copy-right" element={<CopyRight />} />
      <Route path='/basic-computing' element={<BasicComputing />} />
      <Route path='/virtual-assistant' element={<VirtualAssistant />} />
      <Route path='/data-entry' element={<DataEntry />} />

      <Route
        path="/google-success"
        element={
          <GoogleSuccess />
        }
      />

      {/* Email verification pages (only if not verified) */}
      <Route path="/verify-email-info" element={
        <ProtectedRoute verificationOnly>
          <VerifyEmailInfo />
        </ProtectedRoute>
      } />
      <Route path="/verify-email" element={
        <ProtectedRoute verificationOnly>
          <VerifyEmail />
        </ProtectedRoute>
      } />
      <Route path="/resend-verification" element={
        <ProtectedRoute verificationOnly>
          <ResendVerification />
        </ProtectedRoute>
      } />

      {/* Admin dashboard pages (adminOnly) */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute adminOnly>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/ui-settings" element={
        <ProtectedRoute adminOnly>
          <UISettings />
        </ProtectedRoute>
      } />
      <Route path="/admin/take-lecture" element={
        <ProtectedRoute adminOnly>
          <TakeLecture />
        </ProtectedRoute>
      } />
      <Route path="/admin/profile" element={
        <ProtectedRoute adminOnly>
          <AdminProfile />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute adminOnly>
          <Users />
        </ProtectedRoute>
      } />
      <Route path="/admin/transactions" element={
        <ProtectedRoute adminOnly>
          <Transactions />
        </ProtectedRoute>
      } />
      <Route path="/admin/enrollments" element={
        <ProtectedRoute adminOnly>
          <Enrollments />
        </ProtectedRoute>
      } />
      <Route path="/admin/admin-list" element={
        <ProtectedRoute adminOnly>
          <AdminList />
        </ProtectedRoute>
      } />
      <Route path="/admin/contact-messages" element={
        <ProtectedRoute adminOnly>
          <ContactMessages />
        </ProtectedRoute>
      } />
      <Route path="/admin/publish-asset" element={
        <ProtectedRoute adminOnly>
          <PublishAsset />
        </ProtectedRoute>
      } />
      <Route path="/admin/post-blog" element={
        <ProtectedRoute adminOnly>
          <PostBlog />
        </ProtectedRoute>
      } />
      <Route path="/admin/super-admin-list" element={
        <ProtectedRoute adminOnly>
          <SuperAdminList />
        </ProtectedRoute>
      } />
      <Route path="/admin/mailer" element={
        <ProtectedRoute adminOnly>
          <Mailer />
        </ProtectedRoute>
      } />
      <Route path="/admin/create-assignment" element={
        <ProtectedRoute adminOnly>
          <CreateAssignment />
        </ProtectedRoute>
      } />
      <Route path="/admin/assignment-corrections" element={
        <ProtectedRoute adminOnly>
          <AssignmentCorrections />
        </ProtectedRoute>
      } />
      <Route path="/admin/media-video" element={
        <ProtectedRoute adminOnly>
          <MediaVideo />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <CourseProvider>
      <AuthProvider>
        <UserInfoProvider>
        <Router basename="/myteacher_super_tech/">
          <AppRoutes />
        </Router>
        </UserInfoProvider>
      </AuthProvider>
    </CourseProvider>
  );
}

export default App;