import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const username = searchParams.get("username");

    const handleAuth = async () => {
      try {
        if (token && email) {
          try {
            localStorage.setItem("token", token);
            localStorage.setItem("email", email);
            if (username) {
              localStorage.setItem("username", username);
            }
          } catch (storageError) {
            console.error("Error setting localStorage:", storageError);
            setAuthStatus('error');
            return;
          }

          setAuthStatus('success');
          
          // Redirect after 5 seconds
          setTimeout(() => navigate("/home"), 5000);
        } else {
          setAuthStatus('error');
          navigate("/login");
        }
      } catch (error) {
        console.error("Authentication processing error:", error);
        setAuthStatus('error');
        navigate("/login");
      }
    };

    handleAuth();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="relative w-12 h-12 mt-6 flex items-center justify-center">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-6 h-3 bg-gray-200 rounded-sm
            before:content-[''] before:absolute before:border-l-[12px] before:border-l-transparent before:border-r-[12px] before:border-r-transparent before:border-b-[6px] before:border-b-gray-200 before:-top-[6px] 
            after:content-[''] after:absolute after:border-l-[12px] after:border-l-transparent after:border-r-[12px] after:border-r-transparent after:border-t-[6px] after:border-t-gray-200 after:-bottom-[6px]
            animate-honeycomb`}
            style={{
              left: i % 2 === 0 ? `${(i - 3) * 10}px` : `${(i - 3) * 7}px`,
              top: i % 2 === 0 ? `${(i - 3) * 7}px` : `${(i - 3) * 10}px`,
              animationDelay: `${i * 0.1}s`,
            }}
          ></div>
        ))}
        
        {authStatus === 'error' && (
          <div className="text-red-500 text-center mt-4">
            Authentication failed. Redirecting...
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthSuccess;