import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Eye
} from "lucide-react";

export default function ProviderDashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

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
    queryKey: ["/api/provider/payment-methods"],
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ServicePanda Partners</h1>
                <p className="text-sm text-gray-600">Provider Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {provider.firstName} {provider.lastName}
                </p>
                <p className="text-xs text-gray-500">{provider.email}</p>
              </div>
              {getStatusBadge(provider.status)}
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-gray-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="leads">Leads & Jobs</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">New Leads</CardTitle>
                    <Bell className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{leads.filter((l: any) => l.status === 'new').length}</div>
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
                    <div className="text-2xl font-bold">-</div>
                    <p className="text-xs text-muted-foreground">No reviews yet</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Leads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {leadsLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-500">Loading leads...</p>
                      </div>
                    ) : leads.length === 0 ? (
                      <div className="text-center py-8">
                        <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 mb-2">No leads yet</p>
                        <p className="text-sm text-gray-400">Leads will appear here when customers request your services.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {leads.slice(0, 5).map((lead: any) => (
                          <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{lead.service}</p>
                              <p className="text-xs text-gray-500">{lead.location}</p>
                            </div>
                            <Badge variant="outline">{lead.status}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>My Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {servicesLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-500">Loading services...</p>
                      </div>
                    ) : services.length === 0 ? (
                      <div className="text-center py-8">
                        <Settings className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 mb-2">No services configured</p>
                        <Button variant="outline" size="sm" onClick={() => setActiveTab("profile")}>
                          Set Up Services
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {services.map((service: any) => (
                          <div key={service.id} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">{service.name}</span>
                            <Badge variant="secondary">{service.areas?.length || 0} areas</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Leads & Jobs Tab */}
            <TabsContent value="leads" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Leads & Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  {leadsLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading your leads...</p>
                    </div>
                  ) : leads.length === 0 ? (
                    <div className="text-center py-12">
                      <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No leads yet</h3>
                      <p className="text-gray-500 mb-4">
                        When customers request services in your area, they'll appear here.
                      </p>
                      <Button variant="outline" onClick={() => setActiveTab("profile")}>
                        Update Your Profile
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {leads.map((lead: any) => (
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
                              {lead.description && (
                                <p className="text-sm text-gray-700 mt-2">{lead.description}</p>
                              )}
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              {lead.status === 'new' && (
                                <Button size="sm">
                                  Respond
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Provider Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Name</label>
                      <p className="text-sm">{provider.firstName} {provider.lastName}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <p className="text-sm">{provider.email}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Mobile</label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <p className="text-sm">{provider.mobileNumber}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Address</label>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <p className="text-sm">{provider.address}</p>
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button variant="outline" className="w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Application Status</span>
                      {getStatusBadge(provider.status)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Documents Uploaded</span>
                      {provider.documentsUploaded ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complete
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          <XCircle className="h-3 w-3 mr-1" />
                          Incomplete
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Services Configured</span>
                      <Badge variant="outline">{services.length} services</Badge>
                    </div>
                    <div className="pt-4">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setActiveTab("documents")}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Manage Documents
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Required Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Document Management</h3>
                    <p className="text-gray-500 mb-4">
                      Upload and manage your required business documents.
                    </p>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}