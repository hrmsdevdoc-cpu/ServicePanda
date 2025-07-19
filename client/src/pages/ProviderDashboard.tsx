import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  LogOut, 
  Bell, 
  DollarSign, 
  Users, 
  Calendar,
  FileText,
  Settings,
  Star,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Briefcase,
  Upload,
  Eye,
  LayoutDashboard,
  Target,
  CheckSquare,
  CreditCard,
  Receipt,
  HelpCircle,
  Wrench,
  ChevronDown,
  ChevronRight
} from "lucide-react";

export default function ProviderDashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["leads", "settings"]);

  // Fetch provider profile
  const { data: provider, isLoading: providerLoading } = useQuery({
    queryKey: ["/api/provider/profile"],
    retry: false,
  });

  // Fetch provider leads/jobs
  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ["/api/provider/leads"],
    retry: false,
  });

  // Fetch provider services
  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/provider/services"],
    retry: false,
  });

  // Fetch provider payment methods to check if payment setup is complete
  const { data: paymentMethods = [], isLoading: paymentMethodsLoading } = useQuery({
    queryKey: ["/api/provider", provider?.id, "payment-methods"],
    enabled: !!provider?.id, // Only run query when provider ID is available
    retry: false,
  });

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

  if (providerLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-4">You need to be logged in as a provider to access this area.</p>
              <Button onClick={() => navigate("/provider-login")} className="w-full">
                Go to Provider Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const newLeadsCount = leads.filter((l: any) => l.status === 'new').length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
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
            onClick={() => setActiveMenuItem("dashboard")}
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
                  onClick={() => setActiveMenuItem("new-leads")}
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
                  onClick={() => setActiveMenuItem("accepted-leads")}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                    activeMenuItem === "accepted-leads" 
                      ? "bg-red-50 text-red-700" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Leads Accepted
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
                  onClick={() => navigate("/provider-services")}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                    activeMenuItem === "services" 
                      ? "bg-red-50 text-red-700" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Services
                </button>
                <button
                  onClick={() => navigate("/provider-service-area")}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                    activeMenuItem === "service-area" 
                      ? "bg-red-50 text-red-700" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Service Area
                </button>
                <button
                  onClick={() => navigate("/provider-documents")}
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
                ? "bg-red-50 text-red-700" 
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
                  {provider.firstName?.[0]}{provider.lastName?.[0]}
                </span>
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {provider.firstName} {provider.lastName}
                </p>
                <div className="flex items-center">
                  {getStatusBadge(provider.status)}
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeMenuItem === "dashboard" && "Dashboard"}
                  {activeMenuItem === "new-leads" && "New Leads"}
                  {activeMenuItem === "accepted-leads" && "Accepted Leads"}
                  {activeMenuItem === "services" && "Services"}
                  {activeMenuItem === "service-area" && "Service Area"}
                  {activeMenuItem === "documents" && "Documents"}
                  {activeMenuItem === "payment" && "Payment"}
                  {activeMenuItem === "billing" && "Billing"}
                  {activeMenuItem === "help" && "Help"}
                </h1>
                <p className="text-sm text-gray-600">
                  {activeMenuItem === "dashboard" && "Overview of your provider activities"}
                  {activeMenuItem === "new-leads" && "Manage incoming lead requests"}
                  {activeMenuItem === "accepted-leads" && "Track your accepted leads"}
                  {activeMenuItem === "services" && "Manage your service offerings"}
                  {activeMenuItem === "service-area" && "Configure your service coverage"}
                  {activeMenuItem === "documents" && "Upload and manage your documents"}
                  {activeMenuItem === "payment" && "Manage your payment methods"}
                  {activeMenuItem === "billing" && "View billing history and invoices"}
                  {activeMenuItem === "help" && "Get support and documentation"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 py-6">
            {/* Status Alert */}
            {provider.status?.toLowerCase() === 'pending' && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <Clock className="h-5 w-5 text-yellow-400 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">Application Under Review</h3>
                    <p className="mt-1 text-sm text-yellow-700">
                      Your provider application is currently being reviewed by our team. You'll receive an email once approved.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Setup Alert - Only show if no payment methods exist */}
            {!paymentMethodsLoading && paymentMethods.length === 0 && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-red-800">Payment Setup Required</h3>
                      <p className="mt-1 text-sm text-red-700">
                        Please Add your Credit Card Details, and setup start getting your leads, Remember First 3 Leads are FREE
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => navigate("/provider-payment")}
                    className="bg-red-600 hover:bg-red-700 text-white ml-4"
                    size="sm"
                  >
                    Update
                  </Button>
                </div>
              </div>
            )}

            {/* Content based on active menu item */}
            {activeMenuItem === "dashboard" && (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">New Leads</CardTitle>
                      <Bell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{newLeadsCount}</div>
                      <p className="text-xs text-muted-foreground">Awaiting response</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{leads.filter((l: any) => l.status === 'active').length}</div>
                      <p className="text-xs text-muted-foreground">In progress</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">This Month</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$0</div>
                      <p className="text-xs text-muted-foreground">Total earnings</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Rating</CardTitle>
                      <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">5.0</div>
                      <p className="text-xs text-muted-foreground">Customer reviews</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {leadsLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading recent activity...</p>
                      </div>
                    ) : leads.length === 0 ? (
                      <div className="text-center py-8">
                        <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
                        <p className="text-gray-500 mb-4">
                          When customers request services in your area, they'll appear here.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {leads.slice(0, 5).map((lead: any) => (
                          <div key={lead.id} className="border rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-medium">{lead.service}</h3>
                                  <Badge variant="outline">{lead.status}</Badge>
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {lead.location}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(lead.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* New Leads Content */}
            {activeMenuItem === "new-leads" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      New Leads ({newLeadsCount})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {leadsLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading new leads...</p>
                      </div>
                    ) : leads.filter((l: any) => l.status === 'new').length === 0 ? (
                      <div className="text-center py-8">
                        <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No new leads</h3>
                        <p className="text-gray-500">New customer requests will appear here.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {leads.filter((l: any) => l.status === 'new').map((lead: any) => (
                          <div key={lead.id} className="border rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-medium">{lead.service}</h3>
                                  <Badge className="bg-blue-100 text-blue-800">New</Badge>
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {lead.location}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(lead.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                                {lead.description && (
                                  <p className="text-sm text-gray-700 mt-2">{lead.description}</p>
                                )}
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                                <Button size="sm">
                                  Respond
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Other menu items */}
            {(activeMenuItem === "accepted-leads" || activeMenuItem === "services" || 
              activeMenuItem === "service-area" || activeMenuItem === "documents" || 
              activeMenuItem === "billing" || activeMenuItem === "help") && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Settings className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Feature Coming Soon</h3>
                      <p className="text-gray-500">
                        This feature is currently under development.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}