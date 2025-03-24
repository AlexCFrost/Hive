import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const username = searchParams.get("username");

    if (token && email) {
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
      if (username) {
        localStorage.setItem("username", username);
      }
      // Redirect after 2 seconds
      setTimeout(() => navigate("/home"), 2000);
    } else {
      navigate("/login"); // Redirect to login if authentication fails
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Authentication Successful</h2>
        <p>Redirecting you to your dashboard...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;