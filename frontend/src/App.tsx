import "./index.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Typewriter, AllCards, FeaturesSection } from "./pages/about";
import { SignupFormDemo } from "./pages/signup";
import { LoginForm } from "./pages/login";
import Home from "./pages/home";
import CommunityApp from "./pages/community";
import CreateCommunity from "./pages/createCommunity";
import JoinCommunity from "./pages/joinCommunity";
import AdminCommunityManager from "./pages/adminPage";
import AuthSuccess from "./pages/AuthSuccess";
import { ProtectedLayout } from "./components/shared/Layout";

// Application routes
function App() {
  return (
    <Routes>
      <Route path="/" element={<AboutPage />} />
      <Route path="/signup" element={<SignupFormDemo />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/auth-success" element={<AuthSuccess />} />
      <Route path="/home" element={
        <ProtectedLayout>
          <Home />
        </ProtectedLayout>
      } />
      <Route path="/community" element={
        <ProtectedLayout>
          <CommunityApp />
        </ProtectedLayout>
      } />
      <Route path="/createCommunity" element={
        <ProtectedLayout>
          <CreateCommunity/>
        </ProtectedLayout>
      }/>
      <Route path="/joinCommunity" element={
        <ProtectedLayout>
          <JoinCommunity/>
        </ProtectedLayout>
      }/>
      <Route path="/admin" element={
        <ProtectedLayout>
          <AdminCommunityManager/>
        </ProtectedLayout>
      }/>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AboutPage() {
  return (
    <div>
      <Typewriter />
      <AllCards />
      <FeaturesSection />
    </div>
  );
}

export default App;