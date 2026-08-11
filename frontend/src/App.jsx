import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/profile";
import Dashboard from "./pages/Dashboard";
import CalendarPage from "./pages/CalendarPage";
import PathfinderAssessment from "./pages/PathfinderAssessment";
import Assessment from "./pages/Assessment";
import CareerPathfinder from "./pages/CareerPathfinder";
import CareerDetailsPage from "./pages/CareerDetailsPage";
import CareerJourney from "./pages/CareerJourney";
import Resources from "./pages/Resources";
import Projects from "./pages/Projects";
import Challenges from "./pages/Challenges";
import Skills from "./pages/Skills";
import AcademicTracker from "./pages/AcademicTracker";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";

import ResumeDashboard from "./pages/ResumeDashboard";
import ResumeTemplateSelector from "./pages/ResumeTemplateSelector";
import ResumeBuilder from "./pages/ResumeBuilder";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected Student Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile-setup"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessment"
          element={
            <ProtectedRoute>
              <Assessment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pathfinder-assessment"
          element={
            <ProtectedRoute>
              <PathfinderAssessment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/career-pathfinder"
          element={
            <ProtectedRoute>
              <CareerPathfinder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/career/details/:onetCode"
          element={
            <ProtectedRoute>
              <CareerDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/career-journey"
          element={
            <ProtectedRoute>
              <CareerJourney />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <Resources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/challenges"
          element={
            <ProtectedRoute>
              <Challenges />
            </ProtectedRoute>
          }
        />
        <Route
          path="/skills"
          element={
            <ProtectedRoute>
              <Skills />
            </ProtectedRoute>
          }
        />
        <Route
          path="/academics"
          element={
            <ProtectedRoute>
              <AcademicTracker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Resume Builder Routes */}
        <Route
          path="/resumes"
          element={
            <ProtectedRoute>
              <ResumeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume/templates"
          element={
            <ProtectedRoute>
              <ResumeTemplateSelector />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume/builder"
          element={
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;