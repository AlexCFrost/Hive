import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import { HomeIcon, UsersIcon, PlusCircleIcon, LogOutIcon, ArrowLeftIcon, MenuIcon } from "lucide-react";

const HomeContent = () => {
  const username = localStorage.getItem("username") || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="fixed  left-0 top-0 z-50 p-2">
        <SidebarTrigger />
      </div>
      
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2">
            <h2 className="text-lg px-10 font-semibold">Hive</h2>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive tooltip="Home">
                <HomeIcon />
                <span>Home</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton as={Link} to="/create-community" tooltip="Create Community">
                <PlusCircleIcon />
                <span>Create Community</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton as={Link} to="/join-community" tooltip="Join Community">
                <UsersIcon />
                <span>Join Community</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                <LogOutIcon />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton as={Link} to="/" tooltip="Return to landing page">
                <ArrowLeftIcon />
                <span>Return to landing page</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col items-center justify-center p-6 pt-12">
          <h1 className="text-3xl font-bold mb-4">Welcome to Hive, {username}!</h1>
          <p className="text-lg text-center mb-8">
            Your community hub for sharing news and connecting with others.
          </p>
          <div className="space-y-4">
            {/* Main content goes here */}
          </div>
        </div>
      </SidebarInset>
    </div>
  );
};

const Home = () => {
  return (
    <SidebarProvider>
      <HomeContent />
    </SidebarProvider>
  );
};

export default Home;