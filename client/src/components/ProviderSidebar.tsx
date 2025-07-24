import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  Target,
  Settings,
  CreditCard,
  Receipt,
  HelpCircle,
  LogOut,
  Briefcase,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from "lucide-react";

interface ProviderSidebarProps {
  activeMenuItem: string;
  setActiveMenuItem: (item: string) => void;
  expandedMenus: string[];
  setExpandedMenus: React.Dispatch<React.SetStateAction<string[]>>;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  newLeadsCount: number;
  provider: any;
}

export default function ProviderSidebar({
  activeMenuItem,
  setActiveMenuItem,
  expandedMenus,
  setExpandedMenus,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  newLeadsCount,
  provider
}: ProviderSidebarProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  // Proper logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/provider/logout");
    },
    onSuccess: () => {
      // Clear stored provider ID
      localStorage.removeItem('providerId');
      
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
      navigate("/");
    },
    onError: (error: any) => {
      // Clear stored provider ID even on error
      localStorage.removeItem('providerId');
      
      toast({
        title: "Logout Failed", 
        description: error.message || "Failed to logout.",
        variant: "destructive",
      });
      navigate("/");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending Review</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800"><AlertCircle className="h-3 w-3 mr-1" />Unknown</Badge>;
    }
  };

  return (
    <div className={`w-64 bg-white border-r border-gray-200 flex flex-col h-full md:relative fixed left-0 top-0 z-40 transform transition-transform duration-300 ease-in-out ${
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
    } md:transform-none`}>
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <Briefcase className="h-8 w-8 text-red-600 mr-3" />
          <div>
            <h1 className="text-lg font-bold text-gray-900">ServicePanda</h1>
            <p className="text-xs text-gray-600">Partners</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {/* Dashboard */}
        <button
          onClick={() => {
            setActiveMenuItem("dashboard");
            setIsMobileMenuOpen(false);
            navigate("/provider-dashboard");
          }}
          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            activeMenuItem === "dashboard" 
              ? "bg-red-50 text-red-700 border-r-2 border-red-600" 
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <LayoutDashboard className="h-4 w-4 mr-3" />
          Dashboard
        </button>

        {/* Leads Section */}
        <div className="space-y-1">
          <button
            onClick={() => toggleMenu("leads")}
            className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"
          >
            <div className="flex items-center">
              <Target className="h-4 w-4 mr-3" />
              Leads
            </div>
            {expandedMenus.includes("leads") ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {expandedMenus.includes("leads") && (
            <div className="ml-6 space-y-1">
              <button
                onClick={() => {
                  setActiveMenuItem("new-leads");
                  setIsMobileMenuOpen(false);
                  navigate("/provider-dashboard");
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md ${
                  activeMenuItem === "new-leads" 
                    ? "bg-red-50 text-red-700" 
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>New Leads</span>
                {newLeadsCount > 0 && (
                  <Badge className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {newLeadsCount}
                  </Badge>
                )}
              </button>
              <button
                onClick={() => {
                  setActiveMenuItem("accepted-leads");
                  setIsMobileMenuOpen(false);
                  navigate("/provider-dashboard");
                }}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                  activeMenuItem === "accepted-leads" 
                    ? "bg-red-50 text-red-700" 
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Active Leads
              </button>
              <button
                onClick={() => {
                  setActiveMenuItem("closed-leads");
                  setIsMobileMenuOpen(false);
                  navigate("/provider-dashboard");
                }}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                  activeMenuItem === "closed-leads" 
                    ? "bg-red-50 text-red-700" 
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Closed Leads
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Footer Menu */}
      <div className="border-t border-gray-200 px-4 py-4 space-y-1">
        {/* Settings Section */}
        <div className="space-y-1">
          <button
            onClick={() => toggleMenu("settings")}
            className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50"
          >
            <div className="flex items-center">
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </div>
            {expandedMenus.includes("settings") ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {expandedMenus.includes("settings") && (
            <div className="ml-6 space-y-1">
              <button
                onClick={() => {
                  setActiveMenuItem("Personal Details");
                  setIsMobileMenuOpen(false);
                  navigate("/provider-personal-details");
                }}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                  activeMenuItem === "Personal Details" 
                    ? "bg-red-50 text-red-700" 
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Personal Details
              </button>
              <button
                onClick={() => {
                  setActiveMenuItem("services");
                  setIsMobileMenuOpen(false);
                  navigate("/provider-dashboard");
                }}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                  activeMenuItem === "services" 
                    ? "bg-red-50 text-red-700" 
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Services
              </button>
              <button
                onClick={() => {
                  setActiveMenuItem("service-area");
                  setIsMobileMenuOpen(false);
                  navigate("/provider-dashboard");
                }}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                  activeMenuItem === "service-area" 
                    ? "bg-red-50 text-red-700" 
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Service Area
              </button>
              <button
                onClick={() => {
                  setActiveMenuItem("documents");
                  setIsMobileMenuOpen(false);
                  navigate("/provider-dashboard");
                }}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                  activeMenuItem === "documents" 
                    ? "bg-red-50 text-red-700" 
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Documents
              </button>
            </div>
          )}
        </div>

        {/* Payment */}
        <button
          onClick={() => {
            setActiveMenuItem("payment");
            navigate("/provider-payment");
          }}
          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            activeMenuItem === "payment" 
              ? "bg-red-50 text-red-700 border-r-2 border-red-600" 
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <CreditCard className="h-4 w-4 mr-3" />
          Payment
        </button>

        {/* Billing */}
        <button
          onClick={() => setActiveMenuItem("billing")}
          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            activeMenuItem === "billing" 
              ? "bg-red-50 text-red-700" 
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Receipt className="h-4 w-4 mr-3" />
          Billing
        </button>

        {/* Help */}
        <button
          onClick={() => setActiveMenuItem("help")}
          className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            activeMenuItem === "help" 
              ? "bg-red-50 text-red-700" 
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <HelpCircle className="h-4 w-4 mr-3" />
          Help
        </button>
      </div>

      {/* User Profile Section */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center min-w-0">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-red-600">
                {provider?.firstName?.[0]}{provider?.lastName?.[0]}
              </span>
            </div>
            <div className="ml-3 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {provider?.firstName} {provider?.lastName}
              </p>
              <div className="flex items-center">
                {getStatusBadge(provider?.status)}
              </div>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-600"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}