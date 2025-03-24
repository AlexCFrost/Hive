import "./index.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Typewriter, AllCards, FeaturesSection } from "./pages/about";
import { SignupFormDemo } from "./pages/signup";
import { LoginForm } from "./pages/login";
import Home from "./pages/home";
import AuthSuccess from "./pages/AuthSuccess";
import { useEffect, useState } from "react";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token in localStorage:", token);
    setIsAuth(!!token);
    setIsChecking(false);
  }, [location]); // Re-check when location changes

  if (isChecking) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Checking authentication...</div>;
  }

  return isAuth ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<AboutPage />} />
      <Route path="/signup" element={<SignupFormDemo />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/auth-success" element={<AuthSuccess />} />
      <Route path="/home" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
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