import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  ChevronRight,
  Check,
  X,
  Home,
  Zap,
  Droplets,
  Car,
  Hammer,
  TreePine,
  Bug,
  Sparkles,
  Building,
  Save,
  Plus
} from "lucide-react";
import { LocationServiceAreaForm } from "@/components/LocationServiceAreaForm";
import { DocumentUpload } from "@/components/DocumentUpload";

// Service icons mapping - same as registration
const serviceIcons = {
  "Domestic Cleaning": Sparkles,
  "Bond Cleaning": Building,
  "Carpet Cleaning": Home,
  "Pest Control": Bug,
  "Gardening": TreePine,
  "Removals": Car,
  "Handyman": Hammer,
  "Electrical": Zap,
  "Air Conditioning": Wrench,
  "Plumbing": Droplets,
};

export default function ProviderDashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["leads", "settings"]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<{
    fileName: string;
    filePath: string;
    documentType: string;
  } | null>(null);
  
  // Services panel state
  const [formData, setFormData] = useState({
    selectedServices: [] as number[],
  });
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  
  // Service areas panel state
  const [serviceAreas, setServiceAreas] = useState([]);
  
  // Documents panel state
  const [documentFiles, setDocumentFiles] = useState({
    license: null as File | null,
    policeCheck: null as File | null,
    insuranceCertificate: null as File | null,
  });

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

  // Fetch service categories for services panel
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/service-categories"],
    retry: false,
  });

  // Fetch existing provider documents
  const { data: existingDocuments = [], isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/service-providers", provider?.id, "documents"],
    enabled: !!provider?.id,
    retry: false,
  });

  // Set initial selected services when data loads
  useEffect(() => {
    if (services && services.length > 0) {
      const serviceIds = services.map((service: any) => service.categoryId);
      setFormData(prev => ({ 
        ...prev, 
        selectedServices: serviceIds 
      }));
    }
  }, [services]);

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

  // Services mutations
  const addServicesMutation = useMutation({
    mutationFn: async (categoryIds: number[]) => {
      const providerId = localStorage.getItem('providerId');
      if (!providerId) {
        throw new Error("Provider information not found.");
      }
      await apiRequest("POST", `/api/service-providers/${providerId}/services`, { categoryIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/provider/services"] });
      toast({
        title: "Services Updated!",
        description: "Your service offerings have been updated successfully.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update services.",
        variant: "destructive",
      });
    },
  });

  // Document upload mutation
  const uploadDocumentsMutation = useMutation({
    mutationFn: async (documents: { license?: File; policeCheck?: File; insuranceCertificate?: File }) => {
      const formData = new FormData();
      
      if (documents.license) {
        formData.append("license", documents.license);
      }
      if (documents.policeCheck) {
        formData.append("policeCheck", documents.policeCheck);
      }
      if (documents.insuranceCertificate) {
        formData.append("insuranceCertificate", documents.insuranceCertificate);
      }
      
      const providerId = localStorage.getItem('providerId');
      if (!providerId) {
        throw new Error("Provider information not found.");
      }
      
      await apiRequest("POST", `/api/service-providers/${providerId}/documents`, formData);
    },
    onSuccess: () => {
      // Invalidate documents query to refresh the uploaded documents section
      queryClient.invalidateQueries({ queryKey: ["/api/service-providers", provider?.id, "documents"] });
      
      toast({
        title: "Documents Updated!",
        description: "Your documents have been uploaded successfully.",
        variant: "default",
      });
      
      setDocumentFiles({
        license: null,
        policeCheck: null,
        insuranceCertificate: null,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload documents.",
        variant: "destructive",
      });
    },
  });

  // Panel handlers
  const handleSaveServices = () => {
    setHasAttemptedSubmit(true);

    if (formData.selectedServices.length === 0) {
      toast({
        title: "Please select your services",
        description: "You must select at least one service you specialize in",
        variant: "destructive",
      });
      return;
    }

    addServicesMutation.mutate(formData.selectedServices);
  };

  const handleServiceAreasChange = (areas: any[]) => {
    setServiceAreas(areas);
  };

  const handleDocumentUpload = () => {
    const hasDocuments = documentFiles.license || documentFiles.policeCheck || documentFiles.insuranceCertificate;
    
    if (!hasDocuments) {
      toast({
        title: "No Documents Selected",
        description: "Please select at least one document to upload.",
        variant: "destructive",
      });
      return;
    }

    uploadDocumentsMutation.mutate(documentFiles);
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
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Left Sidebar - Fixed Height with Internal Scrolling */}
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
                  }}
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
                  onClick={() => setActiveMenuItem("services")}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                    activeMenuItem === "services" 
                      ? "bg-red-50 text-red-700" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Services
                </button>
                <button
                  onClick={() => setActiveMenuItem("service-area")}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                    activeMenuItem === "service-area" 
                      ? "bg-red-50 text-red-700" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Service Area
                </button>
                <button
                  onClick={() => setActiveMenuItem("documents")}
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
            onClick={() => setActiveMenuItem("payment")}
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

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 flex flex-col h-full">
        {/* Mobile header with hamburger */}
        <div className="md:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center">
            <Briefcase className="h-6 w-6 text-red-600 mr-2" />
            <span className="text-lg font-bold text-gray-900">ServicePanda</span>
          </div>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
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

        {/* Main Content - Scrollable Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="px-6 py-6 min-h-full">
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

            {/* Services Panel */}
            {activeMenuItem === "services" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Wrench className="h-5 w-5 mr-2" />
                      Manage Your Services
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Select the services you offer to your customers. This will determine what types of jobs you receive.
                    </p>
                  </CardHeader>
                  <CardContent>
                    {categoriesLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading services...</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Validation message */}
                        {hasAttemptedSubmit && formData.selectedServices.length === 0 && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-red-600 text-sm font-medium">
                              Please select at least one service you specialize in
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                          {categories.map((category: any) => {
                            const IconComponent = serviceIcons[category.name as keyof typeof serviceIcons] || Home;
                            const isSelected = formData.selectedServices.includes(category.id);
                            
                            return (
                              <div
                                key={category.id}
                                className={`relative border-2 rounded-lg p-2 text-center cursor-pointer transition-all duration-200 ${
                                  isSelected 
                                    ? "border-primary bg-blue-50 shadow-md" 
                                    : "border-gray-300 hover:border-primary hover:shadow-sm"
                                }`}
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    selectedServices: isSelected
                                      ? prev.selectedServices.filter(id => id !== category.id)
                                      : [...prev.selectedServices, category.id]
                                  }));
                                }}
                              >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${
                                  isSelected ? "bg-primary text-white" : "bg-blue-100"
                                }`}>
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                <h3 className={`text-xs font-medium truncate ${
                                  isSelected ? "text-primary" : "text-gray-700"
                                }`}>
                                  {category.name}
                                </h3>
                                {isSelected && (
                                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                    <Check className="w-2.5 h-2.5 text-white" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        
                        <div className="flex justify-end pt-4">
                          <Button 
                            onClick={handleSaveServices}
                            disabled={addServicesMutation.isPending}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            {addServicesMutation.isPending ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Services
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Service Area Panel */}
            {activeMenuItem === "service-area" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Configure Service Area
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Set up your service coverage area. This determines which job requests you'll receive.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <LocationServiceAreaForm 
                      providerId={provider?.id || 0}
                      initialAddress={provider?.businessAddress || ""} 
                      onServiceAreasChange={handleServiceAreasChange}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Documents Panel */}
            {activeMenuItem === "documents" && (
              <div className="space-y-6">
                {/* Existing Documents Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Uploaded Documents
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      View your currently uploaded documents. These are used for verification and building customer trust.
                    </p>
                  </CardHeader>
                  <CardContent>
                    {documentsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                      </div>
                    ) : existingDocuments.length > 0 ? (
                      <div className="grid gap-4">
                        {/* Group documents by type and show latest */}
                        {['license', 'police_check', 'insurance'].map(docType => {
                          const filteredDocs = existingDocuments.filter((doc: any) => doc.documentType === docType);
                          const document = filteredDocs
                            .sort((a: any, b: any) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0];
                          
                          // Debug logging
                          if (docType === 'insurance') {
                            console.log('Insurance documents:', filteredDocs.map(d => ({ fileName: d.fileName, uploadedAt: d.uploadedAt, mimeType: d.mimeType })));
                            console.log('Selected insurance document:', document ? { fileName: document.fileName, uploadedAt: document.uploadedAt, mimeType: document.mimeType } : 'none');
                          }
                          
                          const docTypeLabels = {
                            license: 'License Document',
                            police_check: 'Police Check',
                            insurance: 'Insurance Certificate'
                          };
                          
                          return (
                            <div key={docType} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                              <div className="flex items-center space-x-3">
                                <FileText className="h-5 w-5 text-gray-400" />
                                <div>
                                  <p className="font-medium text-gray-900">{docTypeLabels[docType as keyof typeof docTypeLabels]}</p>
                                  {document ? (
                                    <p className="text-sm text-gray-500">
                                      Uploaded: {new Date(document.uploadedAt).toLocaleDateString()}
                                    </p>
                                  ) : (
                                    <p className="text-sm text-red-500">Not uploaded</p>
                                  )}
                                </div>
                              </div>
                              {document && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setViewingDocument({
                                    fileName: document.fileName,
                                    filePath: document.filePath,
                                    documentType: docTypeLabels[docType as keyof typeof docTypeLabels]
                                  })}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No documents uploaded yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Update Documents Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Upload className="h-5 w-5 mr-2" />
                      Update Documents
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Upload new versions of your documents. You can update individual documents as needed.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Compact document upload sections - 1/3 height */}
                      <div className="grid md:grid-cols-3 gap-3">
                        {/* License Document Upload */}
                        <div className="border rounded-lg p-3">
                          <h3 className="font-medium text-gray-900 mb-1 text-sm">License Document</h3>
                          <DocumentUpload
                            label="Choose File"
                            description="PDF, JPG, PNG (10MB max)"
                            onUpload={(files) => {
                              if (files.length > 0) {
                                setDocumentFiles(prev => ({ ...prev, license: files[0] }));
                              }
                            }}
                            loading={uploadDocumentsMutation.isPending}
                            multiple={false}
                          />
                          {documentFiles.license && (
                            <div className="mt-1 p-1 bg-green-50 border border-green-200 rounded text-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-green-700 flex items-center">
                                  <Check className="h-3 w-3 mr-1" />
                                  Selected
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDocumentFiles(prev => ({ ...prev, license: null }))}
                                  className="h-5 w-5 p-0"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Police Check Document Upload */}
                        <div className="border rounded-lg p-3">
                          <h3 className="font-medium text-gray-900 mb-1 text-sm">Police Check</h3>
                          <DocumentUpload
                            label="Choose File"
                            description="PDF, JPG, PNG (10MB max)"
                            onUpload={(files) => {
                              if (files.length > 0) {
                                setDocumentFiles(prev => ({ ...prev, policeCheck: files[0] }));
                              }
                            }}
                            loading={uploadDocumentsMutation.isPending}
                            multiple={false}
                          />
                          {documentFiles.policeCheck && (
                            <div className="mt-1 p-1 bg-green-50 border border-green-200 rounded text-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-green-700 flex items-center">
                                  <Check className="h-3 w-3 mr-1" />
                                  Selected
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDocumentFiles(prev => ({ ...prev, policeCheck: null }))}
                                  className="h-5 w-5 p-0"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Insurance Certificate Upload */}
                        <div className="border rounded-lg p-3">
                          <h3 className="font-medium text-gray-900 mb-1 text-sm">Insurance Certificate</h3>
                          <DocumentUpload
                            label="Choose File"
                            description="PDF, JPG, PNG (10MB max)"
                            onUpload={(files) => {
                              if (files.length > 0) {
                                setDocumentFiles(prev => ({ ...prev, insuranceCertificate: files[0] }));
                              }
                            }}
                            loading={uploadDocumentsMutation.isPending}
                            multiple={false}
                          />
                          {documentFiles.insuranceCertificate && (
                            <div className="mt-1 p-1 bg-green-50 border border-green-200 rounded text-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-green-700 flex items-center">
                                  <Check className="h-3 w-3 mr-1" />
                                  Selected
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setDocumentFiles(prev => ({ ...prev, insuranceCertificate: null }))}
                                  className="h-5 w-5 p-0"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-4">
                        <Button 
                          onClick={handleDocumentUpload}
                          disabled={uploadDocumentsMutation.isPending}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          {uploadDocumentsMutation.isPending ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Update Selected
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Payment Panel */}
            {activeMenuItem === "payment" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Payment Methods
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Manage your payment methods for receiving lead fees. Add a card to start receiving job requests.
                    </p>
                  </CardHeader>
                  <CardContent>
                    {paymentMethodsLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading payment methods...</p>
                      </div>
                    ) : paymentMethods.length === 0 ? (
                      <div className="text-center py-12">
                        <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No payment methods</h3>
                        <p className="text-gray-500 mb-6">
                          Add your first payment method to start receiving leads.
                        </p>
                        <Button
                          onClick={() => navigate("/provider-payment")}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Payment Method
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Your Cards</h3>
                          <Button
                            onClick={() => navigate("/provider-payment")}
                            variant="outline"
                            size="sm"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Card
                          </Button>
                        </div>
                        
                        {paymentMethods.map((method: any) => (
                          <div key={method.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                                  <CreditCard className="h-4 w-4 text-gray-600" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                      {method.cardBrand} **** **** **** {method.cardLastFour}
                                    </span>
                                    {method.isPrimary && (
                                      <Badge className="bg-green-100 text-green-800">Primary</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    Expires {method.cardExpMonth}/{method.cardExpYear}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-blue-500 mr-3" />
                            <div>
                              <h4 className="font-medium text-blue-900">Lead Pricing</h4>
                              <p className="text-sm text-blue-700">
                                Your first 3 leads are free! After that, leads cost $5 each. You're only charged when you accept a lead.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Other menu items (coming soon) */}
            {(activeMenuItem === "accepted-leads" || activeMenuItem === "billing" || activeMenuItem === "help") && (
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

      {/* Document Viewer Dialog */}
      <Dialog open={!!viewingDocument} onOpenChange={() => setViewingDocument(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {viewingDocument?.documentType} - {viewingDocument?.fileName}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {viewingDocument && provider && (
              <div className="w-full h-[70vh] border rounded bg-white overflow-auto">
                {/* Check file extension to determine display method */}
                {viewingDocument.fileName.toLowerCase().endsWith('.pdf') ? (
                  <embed
                    src={`/api/provider/documents/view/${viewingDocument.filePath.split('/').pop()}/${provider.id}#toolbar=1&navpanes=1&scrollbar=1`}
                    className="w-full h-full min-h-[70vh]"
                    type="application/pdf"
                  />
                ) : (
                  <img
                    src={`/api/provider/documents/view/${viewingDocument.filePath.split('/').pop()}/${provider.id}`}
                    alt={viewingDocument.fileName}
                    className="max-w-full h-auto mx-auto block"
                    style={{ maxHeight: '70vh', objectFit: 'contain' }}
                  />
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}