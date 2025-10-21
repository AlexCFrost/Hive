import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from "@/components/ui/sidebar";
import { 
  HomeIcon, 
  UsersIcon, 
  LogOutIcon, 
  ChevronDownIcon, 
  ChevronRightIcon,
  ShieldIcon,
  UserIcon 
} from "lucide-react";
import { jwtDecode } from "jwt-decode";

type UserInfo = {
  email: string;
  name?: string;
  picture?: string;
  isAdmin?: boolean;
};

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [communitiesOpen, setCommunitiesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  
  // Check if current path is active
  const isActive = (path: string) => location.pathname === path;
  
  // Fetch user info from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    const username = localStorage.getItem("username");
    
    if (token) {
      try {
        // Try to decode JWT for user info
        const decoded = jwtDecode(token) as UserInfo;
        setUserInfo({
          email: decoded.email || email || "",
          name: decoded.name || username || "User",
          picture: decoded.picture,
          isAdmin: true // For development - ensure admin button always shows
        });
      } catch {
        // Fallback if token can't be decoded
        setUserInfo({
          email: email || "",
          name: username || "User",
          isAdmin: true // For development - ensure admin button always shows
        });
      }
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    window.location.href = "/";
  };

  return (
    <>
      <div className="fixed left-0 top-0 z-50 p-2">
        <SidebarTrigger />
      </div>
      
      <Sidebar className="bg-black text-amber-300 border-r border-gray-800" variant="sidebar" side="left">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-25 py-4">
            <h2 className="text-xl font-bold">Hive</h2>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarMenu>
            {/* Home button */}
            <SidebarMenuItem>
              <SidebarMenuButton 
                isActive={isActive("/home")} 
                tooltip="Home"
                onClick={() => navigate("/home")}
              >
                <HomeIcon />
                <span>Home</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            {/* Communities dropdown */}
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => setCommunitiesOpen(!communitiesOpen)} 
                tooltip="Communities"
              >
                <UsersIcon />
                <span>Communities</span>
                {communitiesOpen ? 
                  <ChevronDownIcon className="ml-auto h-4 w-4" /> : 
                  <ChevronRightIcon className="ml-auto h-4 w-4" />
                }
              </SidebarMenuButton>
              
              {communitiesOpen && (
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton 
                      onClick={() => navigate("/community")}
                      isActive={isActive("/community")}
                    >
                      All Communities
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton 
                      onClick={() => navigate("/joinCommunity")}
                      isActive={isActive("/joinCommunity")}
                    >
                      Join Community
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton 
                      onClick={() => navigate("/createCommunity")}
                      isActive={isActive("/createCommunity")}
                    >
                      Create Community
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        
        <SidebarFooter>
          <div className="relative p-2">
            {/* User profile with dropdown */}
            <div 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-3 cursor-pointer hover:bg-gray-800 rounded-lg border border-gray-800 transition-colors"
            >
              <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                {userInfo?.picture ? (
                  <img 
                    src={userInfo.picture} 
                    alt="Profile" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserIcon className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {userInfo?.name || "User"}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {userInfo?.email || ""}
                </p>
              </div>
              {userMenuOpen ? 
                <ChevronDownIcon className="h-5 w-5 text-gray-400" /> : 
                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
              }
            </div>
            
            {/* User dropdown menu - Show above the user profile */}
            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                {/* Always show Admin option for testing */}
                <div 
                  onClick={() => navigate("/admin")}
                  className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-800 cursor-pointer border-b border-gray-800"
                >
                  <ShieldIcon className="h-5 w-5 text-red-500" />
                  <span className="text-white">Admin Dashboard</span>
                </div>
                
                <div 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-800 cursor-pointer text-red-400"
                >
                  <LogOutIcon className="h-5 w-5" />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default AppSidebar;