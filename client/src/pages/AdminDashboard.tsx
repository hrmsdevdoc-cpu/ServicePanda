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
  Calendar,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Line, LineChart, Area, AreaChart } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('line');
  const [isServiceRequestExpanded, setIsServiceRequestExpanded] = useState(false);
  const [isProviderChartExpanded, setIsProviderChartExpanded] = useState(false);
  const [serviceRequestChartType, setServiceRequestChartType] = useState<'bar' | 'line' | 'area'>('bar');
  const [serviceRequestYear, setServiceRequestYear] = useState<string>('2024');

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

  // Provider Reports Query for Chart
  const { data: providerReports } = useQuery({
    queryKey: ['/api/admin/reports/providers'],
    queryFn: async () => {
      const response = await adminApiRequest('GET', '/api/admin/reports/providers');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
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
    if (!currentAdminUser || !roles) return [];
    
    // Special case for super_admin - give all permissions
    if (currentAdminUser.role === 'super_admin') {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]; // All permission IDs
    }
    
    const userRole = roles.find((role: any) => role.name === currentAdminUser.role);
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

  // Chart data filtering logic
  const getFilteredMonthlyData = () => {
    if (!providerReports?.monthlyJoins) {
      return [];
    }
    
    // Filter by selected year
    const yearData = providerReports.monthlyJoins.filter((month: any) => 
      month.month.includes(selectedYear)
    );
    
    // Always generate all 12 months for the selected year
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = months.map(month => {
      const monthKey = `${month} ${selectedYear}`;
      const existingData = yearData.find((data: any) => data.month === monthKey);
      
      return {
        month: monthKey,
        approved: existingData ? existingData.approved : 0,
        pending: existingData ? existingData.pending : 0,
        rejected: existingData ? existingData.rejected : 0,
        total: existingData ? existingData.count : 0
      };
    });
    
    return result;
  };

  const monthlyData = getFilteredMonthlyData();

  // Service Request Chart data processing
  const getServiceRequestMonthlyData = () => {
    if (!serviceRequests || serviceRequests.length === 0) {
      console.log('No service requests data available');
      return [];
    }
    
    console.log('Total service requests:', serviceRequests.length);
    console.log('Sample service request:', serviceRequests[0]);
    
    // Log available years in the data
    const availableYears = [...new Set(serviceRequests.map((r: ServiceRequest) => 
      new Date(r.createdAt).getFullYear()
    ))].sort((a, b) => b - a);
    console.log('Available years in data:', availableYears);
    
    // Filter by selected year
    let yearData = serviceRequests.filter((request: ServiceRequest) => 
      new Date(request.createdAt).getFullYear().toString() === serviceRequestYear
    );
    
    console.log(`Service requests for year ${serviceRequestYear}:`, yearData.length);
    
    // If no data for selected year, show all data
    if (yearData.length === 0) {
      console.log('No data for selected year, showing all data');
      yearData = serviceRequests;
    }
    
    // Generate all 12 months for the selected year
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = months.map(month => {
      const monthKey = `${month} ${serviceRequestYear}`;
      const monthIndex = months.indexOf(month);
      
      // Count requests by status for this month
      const monthRequests = yearData.filter((request: ServiceRequest) => 
        new Date(request.createdAt).getMonth() === monthIndex
      );
      
      // Include more status types that might exist
      const pending = monthRequests.filter((r: ServiceRequest) => 
        ['pending', 'new', 'active'].includes(r.status?.toLowerCase())
      ).length;
      const inProgress = monthRequests.filter((r: ServiceRequest) => 
        ['in_progress', 'inprogress', 'assigned', 'active'].includes(r.status?.toLowerCase())
      ).length;
      const completed = monthRequests.filter((r: ServiceRequest) => 
        ['completed', 'done', 'finished'].includes(r.status?.toLowerCase())
      ).length;
      const cancelled = monthRequests.filter((r: ServiceRequest) => 
        ['cancelled', 'canceled', 'rejected'].includes(r.status?.toLowerCase())
      ).length;
      
      if (monthRequests.length > 0) {
        console.log(`Month ${monthKey}:`, {
          total: monthRequests.length,
          pending,
          inProgress,
          completed,
          cancelled,
          statuses: monthRequests.map(r => r.status)
        });
      }
      
      return {
        month: monthKey,
        pending,
        inProgress,
        completed,
        cancelled,
        total: monthRequests.length
      };
    });
    
    console.log('Service request chart data:', result);
    return result;
  };

  const serviceRequestChartData = getServiceRequestMonthlyData();

  // Auto-switch to first available tab if current tab is not accessible
  useEffect(() => {
    if (userPermissions.length > 0) {
      const allTabs = [
        { value: "overview", permission: "dashboard" },
        { value: "providers", permission: "providers" },
        { value: "approvals", permission: "providers" },
        { value: "requests", permission: "leads" },
        { value: "vouchers", permission: "vouchers" },
        { value: "analytics", permission: "reports" },
        { value: "settings", permission: "settings" },
      ];

      const currentTab = allTabs.find(tab => tab.value === activeTab);
      if (currentTab && !hasPermission(currentTab.permission)) {
        // Find first available tab
        const firstAvailableTab = allTabs.find(tab => hasPermission(tab.permission));
        if (firstAvailableTab) {
          setActiveTab(firstAvailableTab.value);
        }
      }
    }
  }, [userPermissions, activeTab, hasPermission]);

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
          {(() => {
            // Define all possible tabs with their permissions
            const allTabs = [
              { value: "overview", label: "Overview", permission: "dashboard" },
              { value: "providers", label: "Providers", permission: "providers" },
              { value: "approvals", label: "Approvals", permission: "providers" },
              { value: "requests", label: "Requests", permission: "leads" },
              { value: "vouchers", label: "Vouchers", permission: "vouchers" },
              { value: "analytics", label: "Analytics", permission: "reports" },
              { value: "settings", label: "Settings", permission: "settings" },
            ];

            // Filter tabs based on permissions
            const visibleTabs = allTabs.filter(tab => hasPermission(tab.permission));

            return (
              <TabsList className="flex w-full">
                {visibleTabs.map(tab => (
                  <TabsTrigger key={tab.value} value={tab.value} className="flex-1">
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            );
          })()}

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

            {/* Charts Section */}
            <div className="grid grid-cols-12 gap-6">
              {/* Provider Join Trends Chart */}
              <Card className={isProviderChartExpanded ? "col-span-12" : "col-span-6"}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-lg">Provider Join</CardTitle>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsProviderChartExpanded(!isProviderChartExpanded)}
                      className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                    >
                      {isProviderChartExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          <span className="text-xs">Collapse</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          <span className="text-xs">Expand</span>
                        </>
                      )}
                    </Button>

                    {/* Year Filter */}
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Chart Type Filter */}
                    <Select value={chartType} onValueChange={(value: 'bar' | 'line' | 'area') => setChartType(value)}>
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Chart" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bar">Bar</SelectItem>
                        <SelectItem value="line">Line</SelectItem>
                        <SelectItem value="area">Area</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className={isProviderChartExpanded ? "h-80" : "h-48"}>
                  {monthlyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === 'bar' ? (
                        <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="month" 
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            axisLine={{ stroke: '#e5e7eb' }}
                            tickLine={{ stroke: '#e5e7eb' }}
                          />
                          <YAxis 
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            axisLine={{ stroke: '#e5e7eb' }}
                            tickLine={{ stroke: '#e5e7eb' }}
                          />
                          <Tooltip 
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                    <p className="font-semibold">{label}</p>
                                    {payload.map((entry: any, index: number) => (
                                      <p key={index} className={`font-bold`} style={{ color: entry.color }}>
                                        {entry.value} {entry.dataKey} providers
                                      </p>
                                    ))}
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar 
                            dataKey="approved" 
                            stackId="a"
                            fill="#10b981" 
                            radius={[0, 0, 0, 0]}
                            name="Approved"
                          />
                          <Bar 
                            dataKey="pending" 
                            stackId="a"
                            fill="#f59e0b" 
                            radius={[0, 0, 0, 0]}
                            name="Pending"
                          />
                          <Bar 
                            dataKey="rejected" 
                            stackId="a"
                            fill="#ef4444" 
                            radius={[4, 4, 0, 0]}
                            name="Rejected"
                          />
                        </BarChart>
                      ) : chartType === 'line' ? (
                        <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="month" 
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            axisLine={{ stroke: '#e5e7eb' }}
                            tickLine={{ stroke: '#e5e7eb' }}
                          />
                          <YAxis 
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            axisLine={{ stroke: '#e5e7eb' }}
                            tickLine={{ stroke: '#e5e7eb' }}
                          />
                          <Tooltip 
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                    <p className="font-semibold">{label}</p>
                                    {payload.map((entry: any, index: number) => (
                                      <p key={index} className={`font-bold`} style={{ color: entry.color }}>
                                        {entry.value} {entry.dataKey} providers
                                      </p>
                                    ))}
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="approved" 
                            stroke="#10b981" 
                            strokeWidth={3}
                            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                            name="Approved"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="pending" 
                            stroke="#f59e0b" 
                            strokeWidth={3}
                            dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
                            name="Pending"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="rejected" 
                            stroke="#ef4444" 
                            strokeWidth={3}
                            dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
                            name="Rejected"
                          />
                        </LineChart>
                      ) : (
                        <AreaChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="month" 
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            axisLine={{ stroke: '#e5e7eb' }}
                            tickLine={{ stroke: '#e5e7eb' }}
                          />
                          <YAxis 
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            axisLine={{ stroke: '#e5e7eb' }}
                            tickLine={{ stroke: '#e5e7eb' }}
                          />
                          <Tooltip 
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                    <p className="font-semibold">{label}</p>
                                    {payload.map((entry: any, index: number) => (
                                      <p key={index} className={`font-bold`} style={{ color: entry.color }}>
                                        {entry.value} {entry.dataKey} providers
                                      </p>
                                    ))}
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="approved" 
                            stackId="1"
                            stroke="#10b981" 
                            fill="#10b981"
                            fillOpacity={0.6}
                            strokeWidth={2}
                            name="Approved"
                          />
                          <Area 
                            type="monotone" 
                            dataKey="pending" 
                            stackId="1"
                            stroke="#f59e0b" 
                            fill="#f59e0b"
                            fillOpacity={0.6}
                            strokeWidth={2}
                            name="Pending"
                          />
                          <Area 
                            type="monotone" 
                            dataKey="rejected" 
                            stackId="1"
                            stroke="#ef4444" 
                            fill="#ef4444"
                            fillOpacity={0.6}
                            strokeWidth={2}
                            name="Rejected"
                          />
                        </AreaChart>
                      )}
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No data available for the selected year</p>
                        <p className="text-gray-400 text-xs mt-1">Try selecting a different year</p>
                      </div>
                    </div>
                  )}
                </div>
                  <div className="mt-4 text-center text-sm text-gray-600">
                    <p>Shows the number of approved, pending, and rejected providers who joined each month</p>
                    <p className="mt-1">Displaying data for the year {selectedYear}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Service Request Trends Chart */}
              <Card className={isServiceRequestExpanded ? "col-span-12" : "col-span-6"}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg">Service Requests</CardTitle>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsServiceRequestExpanded(!isServiceRequestExpanded)}
                        className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                      >
                        {isServiceRequestExpanded ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            <span className="text-xs">Collapse</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4" />
                            <span className="text-xs">Expand</span>
                          </>
                        )}
                      </Button>

                      {/* Year Filter */}
                      <Select value={serviceRequestYear} onValueChange={setServiceRequestYear}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2025">2025</SelectItem>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2023">2023</SelectItem>
                          <SelectItem value="2022">2022</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Chart Type Filter */}
                      <Select value={serviceRequestChartType} onValueChange={(value: 'bar' | 'line' | 'area') => setServiceRequestChartType(value)}>
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Chart" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bar">Bar</SelectItem>
                          <SelectItem value="line">Line</SelectItem>
                          <SelectItem value="area">Area</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={isServiceRequestExpanded ? "h-80" : "h-48"}>
                      {serviceRequestChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          {serviceRequestChartType === 'bar' ? (
                            <BarChart data={serviceRequestChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis 
                                dataKey="month" 
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                axisLine={{ stroke: '#e5e7eb' }}
                                tickLine={{ stroke: '#e5e7eb' }}
                              />
                              <YAxis 
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                axisLine={{ stroke: '#e5e7eb' }}
                                tickLine={{ stroke: '#e5e7eb' }}
                              />
                              <Tooltip 
                                content={({ active, payload, label }) => {
                                  if (active && payload && payload.length) {
                                    return (
                                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                        <p className="font-semibold">{label}</p>
                                        {payload.map((entry: any, index: number) => (
                                          <p key={index} className={`font-bold`} style={{ color: entry.color }}>
                                            {entry.value} {entry.dataKey} requests
                                          </p>
                                        ))}
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Bar 
                                dataKey="pending" 
                                stackId="a"
                                fill="#f59e0b" 
                                radius={[0, 0, 0, 0]}
                                name="Pending"
                              />
                              <Bar 
                                dataKey="inProgress" 
                                stackId="a"
                                fill="#3b82f6" 
                                radius={[0, 0, 0, 0]}
                                name="In Progress"
                              />
                              <Bar 
                                dataKey="completed" 
                                stackId="a"
                                fill="#10b981" 
                                radius={[0, 0, 0, 0]}
                                name="Completed"
                              />
                              <Bar 
                                dataKey="cancelled" 
                                stackId="a"
                                fill="#ef4444" 
                                radius={[4, 4, 0, 0]}
                                name="Cancelled"
                              />
                            </BarChart>
                          ) : serviceRequestChartType === 'line' ? (
                            <LineChart data={serviceRequestChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis 
                                dataKey="month" 
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                axisLine={{ stroke: '#e5e7eb' }}
                                tickLine={{ stroke: '#e5e7eb' }}
                              />
                              <YAxis 
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                axisLine={{ stroke: '#e5e7eb' }}
                                tickLine={{ stroke: '#e5e7eb' }}
                              />
                              <Tooltip 
                                content={({ active, payload, label }) => {
                                  if (active && payload && payload.length) {
                                    return (
                                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                        <p className="font-semibold">{label}</p>
                                        {payload.map((entry: any, index: number) => (
                                          <p key={index} className={`font-bold`} style={{ color: entry.color }}>
                                            {entry.value} {entry.dataKey} requests
                                          </p>
                                        ))}
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="pending" 
                                stroke="#f59e0b" 
                                strokeWidth={3}
                                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
                                name="Pending"
                              />
                              <Line 
                                type="monotone" 
                                dataKey="inProgress" 
                                stroke="#3b82f6" 
                                strokeWidth={3}
                                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                                name="In Progress"
                              />
                              <Line 
                                type="monotone" 
                                dataKey="completed" 
                                stroke="#10b981" 
                                strokeWidth={3}
                                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                                name="Completed"
                              />
                              <Line 
                                type="monotone" 
                                dataKey="cancelled" 
                                stroke="#ef4444" 
                                strokeWidth={3}
                                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
                                name="Cancelled"
                              />
                            </LineChart>
                          ) : (
                            <AreaChart data={serviceRequestChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis 
                                dataKey="month" 
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                axisLine={{ stroke: '#e5e7eb' }}
                                tickLine={{ stroke: '#e5e7eb' }}
                              />
                              <YAxis 
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                axisLine={{ stroke: '#e5e7eb' }}
                                tickLine={{ stroke: '#e5e7eb' }}
                              />
                              <Tooltip 
                                content={({ active, payload, label }) => {
                                  if (active && payload && payload.length) {
                                    return (
                                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                        <p className="font-semibold">{label}</p>
                                        {payload.map((entry: any, index: number) => (
                                          <p key={index} className={`font-bold`} style={{ color: entry.color }}>
                                            {entry.value} {entry.dataKey} requests
                                          </p>
                                        ))}
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="pending" 
                                stackId="1"
                                stroke="#f59e0b" 
                                fill="#f59e0b"
                                fillOpacity={0.6}
                                strokeWidth={2}
                                name="Pending"
                              />
                              <Area 
                                type="monotone" 
                                dataKey="inProgress" 
                                stackId="1"
                                stroke="#3b82f6" 
                                fill="#3b82f6"
                                fillOpacity={0.6}
                                strokeWidth={2}
                                name="In Progress"
                              />
                              <Area 
                                type="monotone" 
                                dataKey="completed" 
                                stackId="1"
                                stroke="#10b981" 
                                fill="#10b981"
                                fillOpacity={0.6}
                                strokeWidth={2}
                                name="Completed"
                              />
                              <Area 
                                type="monotone" 
                                dataKey="cancelled" 
                                stackId="1"
                                stroke="#ef4444" 
                                fill="#ef4444"
                                fillOpacity={0.6}
                                strokeWidth={2}
                                name="Cancelled"
                              />
                            </AreaChart>
                          )}
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No service request data available for the selected year</p>
                            <p className="text-gray-400 text-xs mt-1">Try selecting a different year</p>
                      </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 text-center text-sm text-gray-600">
                      <p>Shows the number of service requests by status for each month</p>
                      <p className="mt-1">Displaying data for the year {serviceRequestYear}</p>
                    </div>
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
                    {Array.isArray(pendingProviders) && pendingProviders.slice(0, 10).map((provider: ServiceProvider) => (
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
                    {Array.isArray(serviceRequests) && serviceRequests.slice(0, 10).map((request: ServiceRequest) => (
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