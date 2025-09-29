import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from "react";
import { AuthProvider, AuthContext } from "../context/Authcontext";
import { CourseProvider } from "../context/CourseContext";
import { UserInfoProvider } from "../context/UserInfoContext";
import '@fortawesome/fontawesome-free/css/all.min.css';
import useDocumentTitle from './hooks/useDocumentTitle';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// first pages
import Home from './pages/home';
import About from './pages/about';
import Register from './pages/auth';
import Login from './pages/login';
import Courses from './pages/courses';
import TechBlog from './pages/Techblog';

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
import ContentCreation from './pages/coursesPages/contentCreation';
import PowerBi from './pages/coursesPages/powerBi';
import Backend from './pages/coursesPages/backend';

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
import UpcomingLectureBatchCreation from './pages/admin/upcomingLectureBatchCreation';
import OnSite from './pages/onSite';
import AssignCourse from './pages/admin/AssignCourse';
import OnsiteAsset from './pages/admin/onsiteAsset';
import PerLecture from './pages/perLecture';
import Onboarding from './pages/onboarding/onboarding';
import OnboardingUsers from './pages/admin/onboardingUsers';
import MeetingRoom from './pages/stream/meetingRoom';
import RoomLobby from './pages/stream/room';
import ApplyAsinstructor from './pages/job/applyAsinstructor';

// Helper component for protected routes
function ProtectedRoute({ children, adminOnly, userOnly, verificationOnly, requireOnSite }) {
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

    // Check if the route requires on-site access and if user is not on-site
    if (requireOnSite && !user.onSite === true) {
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
      <Route path="/meeting" element={
        <ProtectedRoute userOnly>
          <RoomLobby />
        </ProtectedRoute>
      } />
      <Route path="/meeting-room/:roomId" element={
        <ProtectedRoute userOnly>
          <MeetingRoom />
        </ProtectedRoute>
      } />
      {/* <Route path="/meeting-room" element={
        <ProtectedRoute userOnly>
          <MeetingRoom />
        </ProtectedRoute>
      } /> */}
      <Route path="/onboarding" element={<Onboarding />} />
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
      <Route path="/apply" element={<Apply />} />
      {/* Specific route must come before the general one */}
      <Route path="/profile-search/:userId" element={
        <ProtectedRoute userOnly>
          <GeneralProfile />
        </ProtectedRoute>
      } />
      <Route path="/per-lecture/:lectureId" element={
        <ProtectedRoute userOnly>
          <PerLecture />  {/* Changed from <perLecture /> to <PerLecture /> */}
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
      <Route 
        path="/on-site" 
        element={
          <ProtectedRoute userOnly requireOnSite>
            <OnSite />
          </ProtectedRoute>
        } 
      />

      <Route path="/courses" element={<Courses />} />
      <Route path="/techblog" element={<TechBlog />} />

      {/* Course description pages */}
      <Route path="/copy-right" element={<CopyRight />} />
      <Route path='/basic-computing' element={<BasicComputing />} />
      <Route path='/virtual-assistant' element={<VirtualAssistant />} />
      <Route path='/data-entry' element={<DataEntry />} />
      <Route path='/content-creation' element={<ContentCreation />} />
      <Route path='/power-bi' element={<PowerBi />} />
      <Route path='/backend-programming' element={<Backend />} />

      {/* Job application route */}
      <Route path='/instructor-form' element={<ApplyAsinstructor />} />

      <Route
        path="/google-success"
        element={
          <GoogleSuccess />
        }
      />

      {/* Email verification pages */}
      <Route path="/verify-email-info" element={<VerifyEmailInfo />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/resend-verification" element={<ResendVerification />} />

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
      <Route path="/admin/upcoming-lecture-batch-creation" element={
        <ProtectedRoute adminOnly>
          <UpcomingLectureBatchCreation />
        </ProtectedRoute>
      } />
      <Route path="/admin/assign-course" element={
        <ProtectedRoute adminOnly>
          <AssignCourse />
        </ProtectedRoute>
      } />
      <Route path="/admin/onsite-asset" element={
        <ProtectedRoute adminOnly>
          <OnsiteAsset />
        </ProtectedRoute>
      } />
      <Route path="/admin/onboarding-users" element={
        <ProtectedRoute adminOnly>
          <OnboardingUsers />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function AppWithTitle() {
  useDocumentTitle();
  
  return (
    <AppRoutes />
  );
}

function App() {
  return (
    <Router>
      <CourseProvider>
        <AuthProvider>
          <UserInfoProvider>
            <AppWithTitle />
          </UserInfoProvider>
        </AuthProvider>
      </CourseProvider>
    </Router>
  );
}

export default App;