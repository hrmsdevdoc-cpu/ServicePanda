import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminSidebar } from "@/components/AdminSidebar";
import AdminVoucherManagement from "./admin/AdminVoucherManagement";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { adminApiRequest } from "@/lib/adminAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  Shield,
  Users,
  UserCheck,
  UserX,
  FileText,
  Mail,
  BarChart3,
  Settings,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Download,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Wrench,
  MessageSquare,
  DollarSign,
  Key,
} from "lucide-react";

interface ServiceProvider {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address: string;
  status: string;
  documentsUploaded: boolean;
  createdAt: string;
  services?: Array<{ id: number; name: string; categoryName: string }>;
  serviceAreas?: Array<{ id: number; suburb: string; postcode: string }>;
}

interface ServiceRequest {
  id: number;
  customerName: string;
  customerEmail: string;
  serviceCategory: string;
  status: string;
  location: string;
  createdAt: string;
  budget?: string;
}

interface AdminStats {
  totalProviders: number;
  pendingApprovals: number;
  totalCustomers: number;
  activeRequests: number;
  monthlyRevenue: number;
  completedJobs: number;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [providerFilter, setProviderFilter] = useState("all");

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin-login');
    }
  }, [navigate]);

  // Admin Statistics Query
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: async () => {
      const response = await adminApiRequest('GET', '/api/admin/stats');
      return response.json();
    },
    retry: false,
  });

  // Pending Providers Query
  const { data: pendingProviders, isLoading: loadingProviders } = useQuery({
    queryKey: ['/api/admin/providers', 'pending'],
    queryFn: async () => {
      const response = await adminApiRequest('GET', '/api/admin/providers?status=pending');
      return response.json();
    },
    retry: false,
  });

  // All Providers Query
  const { data: allProviders } = useQuery({
    queryKey: ['/api/admin/providers', 'all'],
    queryFn: async () => {
      const response = await adminApiRequest('GET', '/api/admin/providers');
      return response.json();
    },
    retry: false,
  });

  // Service Requests Query
  const { data: serviceRequests = [] } = useQuery({
    queryKey: ['/api/admin/service-requests'],
    queryFn: async () => {
      const response = await adminApiRequest('GET', '/api/admin/service-requests');
      return response.json();
    },
  });

  // Provider Approval Mutation
  const approveProviderMutation = useMutation({
    mutationFn: async ({ providerId, action }: { providerId: number; action: 'approve' | 'reject' }) => {
      const response = await adminApiRequest('POST', `/api/admin/providers/${providerId}/${action}`, {});
      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: `Provider ${variables.action === 'approve' ? 'Approved' : 'Rejected'}`,
        description: `Provider has been successfully ${variables.action === 'approve' ? 'approved' : 'rejected'}.`,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/providers'] });
    },
    onError: (error) => {
      toast({
        title: "Action Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Get current admin user info
  const { data: currentAdminUser } = useQuery({
    queryKey: ["/api/admin/current-user"],
    queryFn: async () => {
      const response = await adminApiRequest("GET", "/api/admin/current-user");
      return response.json();
    },
  });

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  // Filter providers based on search term and status
  const filteredProviders = Array.isArray(allProviders) ? allProviders.filter((provider: ServiceProvider) => {
    const matchesSearch = 
      provider.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      providerFilter === 'all' || 
      provider.status === providerFilter;

    return matchesSearch && matchesFilter;
  }) : [];

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <AdminSidebar 
        onLogout={handleLogout} 
        adminUser={currentAdminUser}
      />
      
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow border-b border-gray-200 dark:border-gray-700">
          <div className="px-8 py-4" style={{ paddingTop: '1.7rem', paddingBottom: '1rem' }}>
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Dashboard Overview
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Platform statistics and management overview
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="vouchers">Vouchers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Providers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalProviders || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Active service providers
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                  <Clock className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats?.pendingApprovals || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Waiting for review
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
                  <Wrench className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats?.activeRequests || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Current service requests
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    ${stats?.monthlyRevenue?.toLocaleString() || '0'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Current month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Provider Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.isArray(pendingProviders) && pendingProviders.slice(0, 5).map((provider: ServiceProvider) => (
                      <div key={provider.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{provider.firstName} {provider.lastName}</p>
                          <p className="text-sm text-gray-500">{provider.email}</p>
                        </div>
                        <Badge variant="outline" className="text-orange-600">
                          Pending
                        </Badge>
                      </div>
                    ))}
                    {(!pendingProviders || pendingProviders.length === 0) && (
                      <p className="text-gray-500 text-center py-4">No pending applications</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Service Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.isArray(serviceRequests) && serviceRequests.slice(0, 5).map((request: ServiceRequest) => (
                      <div key={request.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{request.serviceCategory}</p>
                          <p className="text-sm text-gray-500">{request.location}</p>
                        </div>
                        <Badge variant="outline" className="text-blue-600">
                          {request.status}
                        </Badge>
                      </div>
                    ))}
                    {(!serviceRequests || serviceRequests.length === 0) && (
                      <p className="text-gray-500 text-center py-4">No recent requests</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Providers Tab */}
          <TabsContent value="providers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Service Providers</CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search providers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={providerFilter}
                    onChange={(e) => setProviderFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Provider</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Mobile</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Joined</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProviders?.map((provider: ServiceProvider) => (
                        <tr key={provider.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{provider.firstName} {provider.lastName}</p>
                              <p className="text-gray-500 text-xs">{provider.address}</p>
                            </div>
                          </td>
                          <td className="p-3">{provider.email}</td>
                          <td className="p-3">{provider.mobileNumber}</td>
                          <td className="p-3">
                            <Badge 
                              variant={
                                provider.status === 'approved' ? 'default' :
                                provider.status === 'pending' ? 'outline' : 'destructive'
                              }
                            >
                              {provider.status}
                            </Badge>
                          </td>
                          <td className="p-3">{new Date(provider.createdAt).toLocaleDateString()}</td>
                          <td className="p-3">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value="approvals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="h-5 w-5 mr-2" />
                  Provider Approvals ({Array.isArray(pendingProviders) ? pendingProviders.length : 0} pending)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingProviders ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading applications...</p>
                  </div>
                ) : Array.isArray(pendingProviders) && pendingProviders.length > 0 ? (
                  <div className="space-y-6">
                    {pendingProviders.map((provider: ServiceProvider) => (
                      <div key={provider.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold">
                              {provider.firstName} {provider.lastName}
                            </h3>
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p><strong>Email:</strong> {provider.email}</p>
                                <p><strong>Mobile:</strong> {provider.mobileNumber}</p>
                                <p><strong>Address:</strong> {provider.address}</p>
                              </div>
                              <div>
                                <p><strong>Applied:</strong> {new Date(provider.createdAt).toLocaleDateString()}</p>
                                <p><strong>Documents:</strong> {provider.documentsUploaded ? 'Uploaded' : 'Pending'}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button
                              onClick={() => approveProviderMutation.mutate({ providerId: provider.id, action: 'approve' })}
                              className="bg-green-600 hover:bg-green-700"
                              disabled={approveProviderMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => approveProviderMutation.mutate({ providerId: provider.id, action: 'reject' })}
                              variant="destructive"
                              disabled={approveProviderMutation.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                    <p className="text-gray-500">No pending provider applications to review.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Service Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Requests Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Customer</th>
                        <th className="text-left p-3">Service</th>
                        <th className="text-left p-3">Location</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Date</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(serviceRequests) && serviceRequests.map((request: ServiceRequest) => (
                        <tr key={request.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{request.customerName}</p>
                              <p className="text-gray-500 text-xs">{request.customerEmail}</p>
                            </div>
                          </td>
                          <td className="p-3">{request.serviceCategory}</td>
                          <td className="p-3">{request.location}</td>
                          <td className="p-3">
                            <Badge variant="outline">{request.status}</Badge>
                          </td>
                          <td className="p-3">{new Date(request.createdAt).toLocaleDateString()}</td>
                          <td className="p-3">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vouchers Tab */}
          <TabsContent value="vouchers" className="space-y-6">
            <AdminVoucherManagement />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Growth Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Provider Growth</p>
                      <p className="text-2xl font-bold text-green-600">+12%</p>
                      <p className="text-xs text-gray-500">vs last month</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Request Volume</p>
                      <p className="text-2xl font-bold text-blue-600">+8%</p>
                      <p className="text-xs text-gray-500">vs last month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Top Locations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Sydney</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Melbourne</span>
                      <span className="text-sm font-medium">32%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Brisbane</span>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Perth</span>
                      <span className="text-sm font-medium">8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wrench className="h-5 w-5 mr-2" />
                    Popular Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Domestic Cleaning</span>
                      <span className="text-sm font-medium">28%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Gardening</span>
                      <span className="text-sm font-medium">22%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Handyman</span>
                      <span className="text-sm font-medium">18%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Pest Control</span>
                      <span className="text-sm font-medium">12%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key className="h-5 w-5 mr-2" />
                    Stripe Configuration
                  </CardTitle>
                  <CardDescription>Set up payment processing for provider leads</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Configure Stripe API keys to enable payment processing for lead purchases.
                  </p>
                  <Button 
                    onClick={() => navigate('/admin/stripe-config')} 
                    className="w-full"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Configure Stripe
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Mailgun Configuration
                  </CardTitle>
                  <CardDescription>Set up email notifications and password resets</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Configure Mailgun API keys to enable email sending for password resets and notifications.
                  </p>
                  <Button 
                    onClick={() => navigate('/admin/mailgun-config')} 
                    variant="outline"
                    className="w-full"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Configure Mailgun
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Manage system security and access control</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Advanced security configuration and user access management.
                  </p>
                  <Button 
                    onClick={() => navigate('/admin/settings')} 
                    variant="outline"
                    className="w-full"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Security Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    System Information
                  </CardTitle>
                  <CardDescription>System status and information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Database:</span>
                      <span className="font-medium">PostgreSQL</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Provider Auth:</span>
                      <span className="font-medium text-green-600">Active</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment System:</span>
                      <span className="font-medium text-orange-600">Setup Required</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
}