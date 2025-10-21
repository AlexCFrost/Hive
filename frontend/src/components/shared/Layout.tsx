import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarContent } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";

type LayoutProps = {
  children: React.ReactNode;
};

// Layout component that includes our sidebar
const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider className="bg-black">
      <div className="flex min-h-screen bg-black text-white">
        <AppSidebar />
        <SidebarContent className="flex-1 p-4 md:p-6 bg-black text-white overflow-auto w-full">
          {children}
        </SidebarContent>
      </div>
    </SidebarProvider>
  );
};

// Protected route component that checks authentication
export const ProtectedLayout = ({ children }: LayoutProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    // Short timeout to prevent immediate flicker during token check
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Show loading while checking authentication
  if (isChecking) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">
      Checking authentication...
    </div>;
  }
  
  const token = localStorage.getItem("token");
  
  // If not authenticated, redirect to login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If authenticated, render the layout with the sidebar
  return <Layout>{children}</Layout>;
};

export default Layout;