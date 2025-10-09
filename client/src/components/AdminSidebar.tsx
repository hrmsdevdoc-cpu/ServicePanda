import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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

  // Fetch current user's role and permissions
  const { data: currentUser } = useQuery({
    queryKey: ['adminUser'],
    queryFn: async () => {
      const response = await adminApiRequest("GET", "/api/admin/current-user");
      return response.json();
    },
  });

  // Fetch all roles to get permissions for current user's role
  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await adminApiRequest("GET", "/api/admin/roles");
      return response.json();
    },
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
        { label: "Import Groups", href: "/admin/potential-customers/imports" },
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

  // Debug logging
  console.log('AdminSidebar Debug:', {
    currentUser: currentUser?.role,
    userPermissions,
    hasSettingsPermission: hasPermission('settings'),
    filteredMenuItems: menuItems.map(item => item.label),
    allMenuItems: allMenuItems.map(item => item.label),
    availableRoles: roles?.map((role: any) => role.name) || []
  });

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

      <div className={`bg-white dark:bg-gray-800 flex flex-col h-screen overflow-hidden transition-all duration-300 border-r sticky left-0 top-0 relative ${
        isCollapsed ? 'w-16' : 'w-64 border-gray-200 dark:border-gray-700'
      }`}>
      {/* Header */}
          <div className={`border-b border-gray-200 dark:border-gray-700 ${isCollapsed ? 'p-3' : 'p-6'}`}>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-base font-bold text-gray-900 dark:text-white">ServicePanda</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto ${isCollapsed ? 'p-1' : 'p-3'}`}>
        <div className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.href}>
              {item.subItems.length > 0 ? (
                <Button
                  variant={isActiveRoute(item.href) || hasActiveSubItem(item.subItems) ? "default" : "ghost"}
                  className={`w-full justify-start text-sm ${
                    isActiveRoute(item.href) || hasActiveSubItem(item.subItems)
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => toggleMenu(item.href)}
                >
                  <item.icon className="h- w-4 mr-2" />
                  {!isCollapsed && item.label}
                  {!isCollapsed && (isMenuExpanded(item.href) ? (
                    <ChevronDown className="h-3 w-3 ml-auto" />
                  ) : (
                    <ChevronRight className="h-3 w-3 ml-auto" />
                  ))}
                </Button>
              ) : (
                <Link href={item.href}>
                  <Button
                    variant={isActiveRoute(item.href) ? "default" : "ghost"}
                    className={`w-full justify-start text-sm ${
                      isActiveRoute(item.href)
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {!isCollapsed && item.label}
                  </Button>
                </Link>
              )}
              
              {/* Sub-items */}
              {item.subItems.length > 0 && isMenuExpanded(item.href) && !isCollapsed && (
                <div className="ml-3 mt-1 space-y-1">
                  {item.subItems.map((subItem: any) => (
                    <div key={subItem.href}>
                      {subItem.subItems ? (
                        // Nested sub-item with its own sub-items
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`w-full justify-start text-xs ${
                              hasActiveSubItem(subItem.subItems)
                                ? "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                            onClick={() => toggleMenu(subItem.href)}
                          >
                            <Users className="h-3 w-3 mr-2" />
                            {subItem.label}
                            {isMenuExpanded(subItem.href) ? (
                              <ChevronDown className="h-3 w-3 ml-auto" />
                            ) : (
                              <ChevronRight className="h-3 w-3 ml-auto" />
                            )}
                          </Button>
                          {isMenuExpanded(subItem.href) && (
                            <div className="ml-3 mt-1 space-y-1">
                              {subItem.subItems.map((nestedItem: any) => (
                                <Link key={nestedItem.href} href={nestedItem.href}>
                                  <Button
                                    variant={location === nestedItem.href ? "default" : "ghost"}
                                    size="sm"
                                    className={`w-full justify-start text-xs ${
                                      location === nestedItem.href
                                        ? "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400"
                                        : "text-gray-500 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    }`}
                                  >
                                    {nestedItem.label}
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
                            className={`w-full justify-start text-sm ${
                              location === subItem.href
                                ? "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                          >
                            {subItem.label}
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

      {/* Footer */}
      <div className={`border-t border-gray-200 dark:border-gray-700 ${isCollapsed ? 'p-2' : 'p-3'}`}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-500" />
            {!isCollapsed && (
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {adminUser ? `${adminUser.firstName} ${adminUser.lastName}` : 'Admin'}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {!isCollapsed && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/admin/change-password" className="w-full">
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
                className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
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
    </>
  );
}