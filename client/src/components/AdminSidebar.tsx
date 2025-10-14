import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApiRequest } from "@/lib/adminAuth";
import ToggleButton from "./ToggleButton";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  TrendingUp,
  Gift,
  User,
  UserPlus,
  UserSearch,
  Mail,
  MessageSquare,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SubItem = {
  href: string;
  subItems?: SubItem[];
};

interface AdminSidebarProps {
  onLogout: () => void;
  adminUser?: {
    firstName: string;
    lastName: string;
    username: string;
  };
}

export function AdminSidebar({ onLogout, adminUser }: AdminSidebarProps) {
  const [location] = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Handle scroll detection
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = nav;
      setShowScrollIndicator(scrollHeight > clientHeight);
    };

    handleScroll(); // Check initially
    nav.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      nav.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Fetch current user's role and permissions
  const { data: currentUser, error: currentUserError } = useQuery({
    queryKey: ['adminUser'],
    queryFn: async () => {
      const response = await adminApiRequest("GET", "/api/admin/current-user");
      return response.json();
    },
    retry: false,
  });

  // Fetch all roles to get permissions for current user's role
  const { data: roles, error: rolesError } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await adminApiRequest("GET", "/api/admin/roles");
      return response.json();
    },
    retry: false,
  });

  // Get current user's permissions
  const getUserPermissions = () => {
    if (!currentUser || !roles) return [];
    
    // Special case for super_admin - give all permissions
    if (currentUser.role === 'super_admin') {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]; // All permission IDs
    }
    
    const userRole = roles.find((role: any) => role.name === currentUser.role);
    return userRole ? userRole.permissions : [];
  };

  const userPermissions = getUserPermissions();

  // Check if user has a specific permission
  const hasPermission = (permissionName: string) => {
    if (!userPermissions.length) return false;
    
    // Map permission names to IDs (this should match the database)
    const permissionMap: { [key: string]: number } = {
      'dashboard': 1,
      'providers': 2,
      'leads': 5,
      'potential_customers': 7,
      'potential_providers': 8,
      'vouchers': 9,
      'email': 10,
      'sms': 11,
      'reports': 12,
      'settings': 14,
      'admin_users': 15,
      'departments': 16,
    };

    const permissionId = permissionMap[permissionName];
    return permissionId ? userPermissions.includes(permissionId) : false;
  };

  const allMenuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/admin",
      permission: "dashboard",
      subItems: [],
    },
    {
      icon: UserCheck,
      label: "Providers",
      href: "/admin/providers",
      permission: "providers",
      subItems: [
        { label: "Pending Applications", href: "/admin/providers/pending" },
        { label: "All Providers", href: "/admin/providers" },
        { label: "Provider Report", href: "/admin/providers/report" },
      ],
    },
    {
      icon: TrendingUp,
      label: "Leads",
      href: "/admin/leads",
      permission: "leads",
      subItems: [],
    },
    {
      icon: UserPlus,
      label: "Potential Customers",
      href: "/admin/potential-customers",
      permission: "potential_customers",
      subItems: [
        { label: "Import Groups", href: "/admin/potential-customers/imports", permission: "admin_users" },
        { label: "Customer List", href: "/admin/potential-customers" },
        { label: "SMS Campaigns", href: "/admin/potential-customers/sms" },
      ],
    },
    {
      icon: UserSearch,
      label: "Potential Providers",
      href: "/admin/potential-providers",
      permission: "potential_providers",
      subItems: [],
    },
    {
      icon: Gift,
      label: "Vouchers",
      href: "/admin/vouchers",
      permission: "vouchers",
      subItems: [],
    },
    {
      icon: Mail,
      label: "Email",
      href: "/admin/email",
      permission: "email",
      subItems: [],
    },
    {
      icon: MessageSquare,
      label: "SMS",
      href: "/admin/sms",
      permission: "sms",
      subItems: [],
    },
    {
      icon: BarChart3,
      label: "Reports",
      href: "/admin/reports",
      permission: "reports",
      subItems: [
        { label: "User Reports", href: "/admin/reports/users" },
        { label: "Provider Reports", href: "/admin/reports/providers" },
        { label: "Daily Reports", href: "/admin/reports/daily" },
      ],
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/admin/settings",
      permission: "settings",
      subItems: [
        { label: "Role & Permissions", href: "/admin/settings/roles-permissions", permission: "settings" },
        { label: "Users", href: "#", permission: "admin_users", subItems: [
          { label: "Admin Users", href: "/admin/admin-users", permission: "admin_users" },
          { label: "Departments", href: "/admin/departments", permission: "departments" },
        ]},
        { label: "Change Password", href: "/admin/change-password", permission: "settings" },
        { label: "Stripe Settings", href: "/admin/settings/stripe", permission: "settings" },
        { label: "Mailgun Settings", href: "/admin/settings/mailgun", permission: "settings" },
        { label: "Lead Settings", href: "/admin/lead-settings", permission: "settings" },
        { label: "Service Type", href: "/admin/service-type", permission: "settings" },
        { label: "Terms and Conditions", href: "/admin/terms-conditions", permission: "settings" },
      ],
    },
  ];

  // Filter menu items based on permissions
  const filterMenuItems = (items: any[]): any[] => {
    return items.filter((item: any) => {
      if (item.permission && !hasPermission(item.permission)) {
        return false;
      }
      
      if (item.subItems && item.subItems.length > 0) {
        const filteredSubItems = filterMenuItems(item.subItems);
        if (filteredSubItems.length === 0) {
          return false;
        }
        item.subItems = filteredSubItems;
      }
      
      return true;
    });
  };

  const menuItems = filterMenuItems(allMenuItems);



  const isActiveRoute = (href: string) => {
    if (href === "/admin") {
      return location === "/admin";
    }
    return location.startsWith(href);
  };

  const hasActiveSubItem = (subItems: SubItem[]): boolean => {
    return subItems.some(item => {
      if (item.subItems) {
        return hasActiveSubItem(item.subItems);
      }
      return location === item.href;
    });
  };

  const toggleMenu = (href: string) => {
    setExpandedMenus(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const isMenuExpanded = (href: string) => {
    return expandedMenus.includes(href) || hasActiveSubItem(menuItems.find(item => item.href === href)?.subItems || []);
  };

  return (
    <>
      {/* Sidebar toggle button - positioned near top-left outside sidebar */}

      <div className={`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col h-screen overflow-hidden transition-all duration-500 ease-in-out border-r sticky left-0 top-0 relative shadow-2xl ${
        isCollapsed ? 'w-16' : 'w-64 border-slate-700 dark:border-gray-700'
      }`}>
      {/* Header */}
          <div className={`border-b border-slate-700/50 transition-all duration-300 ${isCollapsed ? 'p-3' : 'p-6'} relative overflow-hidden`}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
        <div className="relative z-10 flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-blue-500/25 ring-1 ring-blue-500/20">
            <LayoutDashboard className="h-4 w-4 text-white transition-transform duration-300 hover:rotate-12" />
          </div>
          {!isCollapsed && (
            <div className="transition-all duration-300">
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent transition-all duration-300">ServicePanda</h1>
              <p className="text-xs text-slate-400 transition-colors duration-300">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 relative overflow-hidden">
        {/* Top fade indicator - only show when scrolled down */}
        {showScrollIndicator && (
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-slate-900 via-slate-900/80 to-transparent z-10 pointer-events-none transition-opacity duration-300"></div>
        )}
        
        {/* Bottom fade indicator - only show when there's more content */}
        {showScrollIndicator && (
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent z-10 pointer-events-none transition-opacity duration-300"></div>
        )}
        
        <nav ref={navRef} className={`h-full overflow-y-auto transition-all duration-300 ${isCollapsed ? 'p-1' : 'p-3'} scrollbar-custom scroll-smooth`}>
          <div className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.href}>
              {item.subItems.length > 0 ? (
                <Button
                  variant={isActiveRoute(item.href) || hasActiveSubItem(item.subItems) ? "default" : "ghost"}
                  className={`w-full justify-start text-sm transition-all duration-300 transform hover:scale-105 relative overflow-hidden group ${
                    isActiveRoute(item.href) || hasActiveSubItem(item.subItems)
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white hover:from-blue-500/30 hover:to-purple-500/30 shadow-lg shadow-blue-500/25 border border-blue-400/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50 hover:shadow-md hover:shadow-slate-500/10"
                  }`}
                  onClick={() => toggleMenu(item.href)}
                >
                  <item.icon className="h- w-4 mr-2 transition-transform duration-300" />
                  {!isCollapsed && <span className="transition-all duration-300">{item.label}</span>}
                  {!isCollapsed && (isMenuExpanded(item.href) ? (
                    <ChevronDown className="h-3 w-3 ml-auto transition-transform duration-300" />
                  ) : (
                    <ChevronRight className="h-3 w-3 ml-auto transition-transform duration-300" />
                  ))}
                </Button>
              ) : (
                <Link href={item.href}>
                  <Button
                    variant={isActiveRoute(item.href) ? "default" : "ghost"}
                    className={`w-full justify-start text-sm transition-all duration-300 transform hover:scale-105 relative overflow-hidden group ${
                      isActiveRoute(item.href)
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white hover:from-blue-500/30 hover:to-purple-500/30 shadow-lg shadow-blue-500/25 border border-blue-400/30"
                        : "text-slate-300 hover:text-white hover:bg-slate-700/50 hover:shadow-md hover:shadow-slate-500/10"
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                    {!isCollapsed && <span className="transition-all duration-300">{item.label}</span>}
                  </Button>
                </Link>
              )}
              
              {/* Sub-items */}
              {item.subItems.length > 0 && isMenuExpanded(item.href) && !isCollapsed && (
                <div className="ml-6 mt-3 space-y-3 transition-all duration-300 animate-in slide-in-from-top-2 border-l-2 border-slate-500/40 pl-4 bg-slate-800/30 rounded-r-lg py-2">
                  {item.subItems.map((subItem: any) => (
                    <div key={subItem.href}>
                      {subItem.subItems ? (
                        // Nested sub-item with its own sub-items
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`w-full justify-start text-xs transition-all duration-300 transform hover:scale-105 relative overflow-hidden group rounded-lg mx-2 ${
                              hasActiveSubItem(subItem.subItems)
                                ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 hover:from-blue-500/30 hover:to-purple-500/30 shadow-lg shadow-blue-500/25 border border-blue-400/30"
                                : "text-slate-300 hover:text-white hover:bg-slate-600/40 hover:shadow-md hover:shadow-slate-500/10"
                            }`}
                            onClick={() => toggleMenu(subItem.href)}
                          >
                            <Users className="h-3 w-3 mr-2 transition-transform duration-300" />
                            <span className="transition-all duration-300">{subItem.label}</span>
                            {isMenuExpanded(subItem.href) ? (
                              <ChevronDown className="h-3 w-3 ml-auto transition-transform duration-300" />
                            ) : (
                              <ChevronRight className="h-3 w-3 ml-auto transition-transform duration-300" />
                            )}
                          </Button>
                          {isMenuExpanded(subItem.href) && (
                            <div className="ml-6 mt-3 space-y-3 transition-all duration-300 animate-in slide-in-from-top-2 border-l-2 border-slate-400/30 pl-4 bg-slate-700/20 rounded-r-lg py-2">
                              {subItem.subItems.map((nestedItem: any) => (
                                <Link key={nestedItem.href} href={nestedItem.href}>
                                  <Button
                                    variant={location === nestedItem.href ? "default" : "ghost"}
                                    size="sm"
                                    className={`w-full justify-start text-xs transition-all duration-300 transform hover:scale-105 relative overflow-hidden group rounded-lg mx-2 ${
                                      location === nestedItem.href
                                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 hover:from-blue-500/30 hover:to-purple-500/30 shadow-lg shadow-blue-500/25 border border-blue-400/30"
                                        : "text-slate-400 hover:text-white hover:bg-slate-600/40 hover:shadow-md hover:shadow-slate-500/10"
                                    }`}
                                  >
                                    <span className="transition-all duration-300">{nestedItem.label}</span>
                                  </Button>
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        // Regular sub-item
                        <Link href={subItem.href}>
                          <Button
                            variant={location === subItem.href ? "default" : "ghost"}
                            size="sm"
                            className={`w-full justify-start text-sm transition-all duration-300 transform hover:scale-105 relative overflow-hidden group rounded-lg mx-2 ${
                              location === subItem.href
                                ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 hover:from-blue-500/30 hover:to-purple-500/30 shadow-lg shadow-blue-500/25 border border-blue-400/30"
                                : "text-slate-300 hover:text-white hover:bg-slate-600/40 hover:shadow-md hover:shadow-slate-500/10"
                            }`}
                          >
                            <span className="transition-all duration-300">{subItem.label}</span>
                          </Button>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
      </div>

      {/* Footer */}
      <div className={`border-t border-slate-700/50 transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-3'} relative overflow-hidden`}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 animate-pulse"></div>
        <div className="relative z-10 flex items-center justify-between w-full">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <User className="h-4 w-4 text-slate-300 transition-transform duration-300" />
              </div>
              <span className="text-xs font-medium text-slate-300 transition-all duration-300">
                {adminUser ? `${adminUser.firstName} ${adminUser.lastName}` : 'Admin'}
              </span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            {!isCollapsed && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-slate-700/50">
                    <Settings className="h-4 w-4 text-slate-400 transition-transform duration-300 hover:rotate-90 hover:text-slate-200" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-slate-800 border-slate-700">
                  <DropdownMenuItem asChild>
                    <Link href="/admin/change-password" className="w-full text-slate-300 hover:text-white">
                      Change Password
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="h-8 w-8 p-0 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <LogOut className="h-4 w-4 transition-transform duration-300 hover:rotate-12" />
              </Button>
            )}
            <div className="flex-shrink-0">
              <ToggleButton 
                isExpanded={!isCollapsed} 
                onToggle={() => {
                  console.log('Toggle clicked, current isCollapsed:', isCollapsed);
                  setIsCollapsed(!isCollapsed);
                }} 
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}