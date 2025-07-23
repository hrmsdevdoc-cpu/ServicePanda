import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  Gift,
} from "lucide-react";

interface AdminSidebarProps {
  onLogout: () => void;
}

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const [location] = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/admin",
      subItems: [],
    },
    {
      icon: UserCheck,
      label: "Providers",
      href: "/admin/providers",
      subItems: [
        { label: "Pending Applications", href: "/admin/providers/pending" },
        { label: "All Providers", href: "/admin/providers" },
      ],
    },
    {
      icon: Users,
      label: "Users",
      href: "/admin/users",
      subItems: [],
    },
    {
      icon: TrendingUp,
      label: "Leads",
      href: "/admin/leads",
      subItems: [],
    },
    {
      icon: Gift,
      label: "Vouchers",
      href: "/admin/vouchers",
      subItems: [],
    },
    {
      icon: BarChart3,
      label: "Reports",
      href: "/admin/reports",
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
      subItems: [
        { label: "Stripe Settings", href: "/admin/settings/stripe" },
        { label: "Mailgun Settings", href: "/admin/settings/mailgun" },
        { label: "Lead Management", href: "/admin/lead-settings" },
      ],
    },
  ];

  const isActiveRoute = (href: string) => {
    if (href === "/admin") {
      return location === "/admin";
    }
    return location.startsWith(href);
  };

  const hasActiveSubItem = (subItems: any[]) => {
    return subItems.some(item => location === item.href);
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
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">ServicePanda</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.href}>
              {item.subItems.length > 0 ? (
                <Button
                  variant={isActiveRoute(item.href) || hasActiveSubItem(item.subItems) ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    isActiveRoute(item.href) || hasActiveSubItem(item.subItems)
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => toggleMenu(item.href)}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                  {isMenuExpanded(item.href) ? (
                    <ChevronDown className="h-4 w-4 ml-auto" />
                  ) : (
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  )}
                </Button>
              ) : (
                <Link href={item.href}>
                  <Button
                    variant={isActiveRoute(item.href) ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      isActiveRoute(item.href)
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              )}
              
              {/* Sub-items */}
              {item.subItems.length > 0 && isMenuExpanded(item.href) && (
                <div className="ml-4 mt-2 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link key={subItem.href} href={subItem.href}>
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
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          onClick={onLogout}
          className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}