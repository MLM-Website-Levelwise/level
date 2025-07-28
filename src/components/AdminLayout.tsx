import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Settings,
  Users,
  DollarSign,
  CreditCard,
  Eye,
  Building2,
  Ticket,
  UserCog,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true); // default hidden on mobile
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the admin dashboard",
    });
    navigate("/login");
  };

  const handleProfileAction = (action: string) => {
    switch (action) {
      case "profile":
        navigate("/profile");
        break;
      case "settings":
        navigate("/settings");
        break;
      case "logout":
        handleLogout();
        break;
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsCollapsed(true); // auto-close on mobile navigation
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      id: "members",
      title: "Members",
      icon: Users,
      children: [
        { title: "Add Member", path: "/members/add-member" },
        { title: "View Members", path: "/members/view-members" },
        { title: "Direct Members", path: "/members/direct-members" },
        { title: "Bank Details", path: "/members/members-bankdetails" },
      ],
    },
    {
      id: "geneology",
      title: "Geneology",
      icon: UserCog,
      children: [
        { title: "Level Wise Team", path: "/geneology/level-wise-team" },
        { title: "Tree Wise Team", path: "/geneology/binary-team" },
      ],
    },
    {
      id: "package",
      title: "Package",
      icon: CreditCard,
      children: [{ title: "Add Package", path: "/package/add-package" }],
    },
    {
      id: "fund",
      title: "Fund",
      icon: DollarSign,
      children: [
        { title: "Fund Generate", path: "/master/fund-generate" },
        { title: "Fund History", path: "/master/fund-history" },
      ],
    },
    {
      id: "income-history",
      title: "Income History",
      icon: Eye,
      children: [
        { title: "Matching Income", path: "/income/matching" },
        { title: "Cashback Income", path: "/income/cashback" },
        { title: "Sponsor Income", path: "/income/sponsor" },
        { title: "Autopool Income", path: "/income/autopool" },
        { title: "Royalty Income", path: "/income/royalty" },
      ],
    },
    {
      id: "withdrawal",
      title: "Withdrawal",
      icon: CreditCard,
      children: [
        { title: "Withdraw Requests", path: "/withdrawal/todays-request" },
        // { title: "Pending's Request", path: "/withdrawal/pending-request" },
        { title: "History", path: "/withdrawal/history" },
      ],
    },
    {
      id: "setting",
      title: "Setting",
      icon: UserCog,
      children: [{ title: "Password", path: "/settings/password" }],
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Overlay */}
      {isCollapsed === false && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-40 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed z-40 inset-y-0 left-0 transform transition-transform duration-300 w-64 bg-gradient-to-b from-blue-800 via-blue-900 to-blue-950 text-white flex flex-col md:relative md:translate-x-0 ${
          isCollapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-4 border-b border-white-600 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-purple-700 font-bold text-sm">PN</span>
            </div>
            <span className="font-semibold text-white">Prime Next</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(true)}
            className="p-2 text-white hover:bg-purple-600 md:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Sidebar Menu */}
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.id}>
                {item.children && item.children.length > 0 ? (
                  <>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white text-base h-11 px-3"
                      onClick={() => toggleMenu(item.id)}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="ml-3 flex-1 text-left">
                        {item.title}
                      </span>
                      <div className="flex-shrink-0">
                        {expandedMenus.includes(item.id) ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </div>
                    </Button>

                    {expandedMenus.includes(item.id) && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <Button
                            key={child.path}
                            variant="ghost"
                            className={`w-full justify-start text-white text-base h-11 px-3 ${
                              isActive(child.path)
                                ? "bg-white text-purple-700"
                                : "hover:bg-white hover:text-purple-700"
                            }`}
                            onClick={() => handleNavigate(child.path)}
                          >
                            <span className="flex-1 text-left">
                              {child.title}
                            </span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-white text-sm h-10 px-3 ${
                      isActive(item.path)
                        ? "bg-white text-purple-700"
                        : "hover:bg-white hover:text-purple-700"
                    }`}
                    onClick={() => handleNavigate(item.path!)}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="ml-3 flex-1 text-left">{item.title}</span>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Logout Button */}
        <div className="p-3 border-t border-white-600">
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-red-600 hover:text-white text-white text-base h-11 px-3"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span className="ml-3 flex-1 text-left">Logout</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <div className="h-16 bg-gradient-to-r from-blue-900 to-blue-950 border-b border-gray-200 px-2 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              onClick={() => setIsCollapsed(false)}
              className="md:hidden p-3"
              variant="ghost"
            >
              <Menu className="h-7 w-7 text-white" />
            </Button>
            <h2 className="text-xl font-bold text-white my-2 ml-2">
              Prime Next
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="group flex items-center space-x-2 hover:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">A</span>
                  </div>
                  <span className="text-sm font-medium hidden sm:block text-white group-hover:text-black transition-colors duration-200">
                    Admin
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-700 hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => handleProfileAction("profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleProfileAction("settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleProfileAction("logout")}
                  className="text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-2 bg-gray-300">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
