/**
 * Shared Provider Sidebar Navigation Component
 * Used across all provider admin pages for consistent navigation and branding
 */

import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  LayoutDashboard,
  Target,
  Settings,
  Receipt,
  HelpCircle,
  LogOut,
  MapPin,
  FileText,
  Wrench,
} from "lucide-react";

interface ProviderSidebarProps {
  /** Currently active menu item */
  activeItem?: string;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  description?: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/provider-dashboard",
    description: "Overview and quick actions"
  },
  {
    id: "leads",
    label: "Leads",
    icon: Target,
    path: "/provider-leads", 
    description: "Manage customer inquiries"
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    path: "/provider-settings",
    description: "Account and business settings"
  },
  {
    id: "services",
    label: "Services",
    icon: Wrench,
    path: "/provider-services",
    description: "Manage your service offerings"
  },
  {
    id: "service-area",
    label: "Service Area",
    icon: MapPin,
    path: "/provider-service-area",
    description: "Coverage areas and locations"
  },
  {
    id: "documents",
    label: "Documents",
    icon: FileText,
    path: "/provider-documents",
    description: "Licenses and certifications"
  },
  {
    id: "payment",
    label: "Payment",
    icon: Receipt,
    path: "/provider-payment",
    description: "Payment methods and billing"
  },
  {
    id: "help",
    label: "Help",
    icon: HelpCircle,
    path: "/provider-help",
    description: "Support and resources"
  }
];

export default function ProviderSidebar({ activeItem }: ProviderSidebarProps) {
  const [, navigate] = useLocation();

  // Fetch provider profile data
  const { data: provider } = useQuery<any>({
    queryKey: ["/api/provider/profile"],
    retry: false,
  });

  /**
   * Handle navigation to a specific menu item
   */
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  /**
   * Handle provider logout
   */
  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/provider/logout");
      localStorage.removeItem('providerId');
      navigate("/provider-login");
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if API fails
      localStorage.removeItem('providerId');
      navigate("/provider-login");
    }
  };

  /**
   * Get provider display name
   */
  const getProviderName = (): string => {
    if (!provider) return "Provider";
    
    const firstName = provider.firstName || "";
    const lastName = provider.lastName || "";
    const businessName = provider.businessName || "";
    
    // Priority: Business name > Full name > Email > "Provider"
    if (businessName) return businessName;
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    if (provider.email) return provider.email.split('@')[0];
    return "Provider";
  };

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 min-h-screen flex flex-col">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {getProviderName().charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">
              {getProviderName()}
            </h2>
            <p className="text-xs text-gray-500">Service Provider</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              title={item.description}
            >
              <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer/Logout Section */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}