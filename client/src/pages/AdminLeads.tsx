import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Users, MapPin, Calendar, Filter, Search } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AdminSidebar } from "@/components/AdminSidebar";

interface ServiceRequest {
  id: number;
  customerId: string;
  customerName: string;
  customerEmail: string;
  categoryName: string;
  serviceType: string;
  description: string;
  location: string;
  suburb: string;
  postcode: string;
  preferredDate: string;
  bookingType: string;
  status: string;
  createdAt: string;
  leadAssignments?: Array<{
    id: number;
    providerId: number;
    providerName: string;
    status: string;
    assignedAt: string;
  }>;
}

export default function AdminLeads() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin-login');
    }
  }, [navigate]);

  const { data: leads, isLoading } = useQuery({
    queryKey: ["/api/admin/leads"],
    queryFn: async () => {
      const response = await fetch('/api/admin/leads', {
        headers: {
          'x-admin-token': localStorage.getItem('adminToken') || '',
        },
      });
      return response.json();
    },
    select: (data: ServiceRequest[]) => {
      return data.filter((lead) => {
        const matchesSearch = 
          lead.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.location?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
        const matchesCategory = categoryFilter === "all" || lead.categoryName === categoryFilter;
        
        return matchesSearch && matchesStatus && matchesCategory;
      });
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/service-categories"],
  });

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Pending", variant: "secondary" as const },
      assigned: { label: "Assigned", variant: "default" as const },
      completed: { label: "Completed", variant: "default" as const },
      cancelled: { label: "Cancelled", variant: "destructive" as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: "secondary" as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getBookingTypeBadge = (bookingType: string) => {
    const typeConfig = {
      "one-time": { label: "One-time", variant: "outline" as const },
      "recurring": { label: "Recurring", variant: "outline" as const },
      "emergency": { label: "Emergency", variant: "destructive" as const },
      "quote-only": { label: "Quote Only", variant: "outline" as const },
    };
    
    const config = typeConfig[bookingType as keyof typeof typeConfig] || { label: bookingType, variant: "outline" as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getLeadMetrics = (leadAssignments: any[] = []) => {
    const totalOffered = leadAssignments.length;
    const totalAccepted = leadAssignments.filter(assignment => assignment.status === "accepted").length;
    const totalPending = leadAssignments.filter(assignment => assignment.status === "pending").length;
    
    return { totalOffered, totalAccepted, totalPending };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <AdminSidebar onLogout={handleLogout} />
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <AdminSidebar onLogout={handleLogout} />
      
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow border-b border-gray-200 dark:border-gray-700">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Lead Management
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Manage service requests and track provider responses
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 space-y-6">


      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads?.filter(lead => lead.status === "pending" || lead.status === "assigned").length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads?.filter(lead => lead.status === "completed").length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Providers/Lead</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads?.length ? 
                Math.round((leads.reduce((sum, lead) => sum + (lead.leadAssignments?.length || 0), 0) / leads.length) * 10) / 10 
                : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((category: any) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      <div className="space-y-4">
        {leads?.map((lead) => {
          const metrics = getLeadMetrics(lead.leadAssignments);
          
          return (
            <Card key={lead.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{lead.categoryName}</h3>
                      {getStatusBadge(lead.status)}
                      {getBookingTypeBadge(lead.bookingType)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {lead.customerName} ({lead.customerEmail})
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {lead.suburb}, {lead.postcode}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(lead.createdAt), "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-2xl font-bold text-blue-600">#{lead.id}</div>
                    <div className="text-sm text-gray-500">
                      {lead.preferredDate && format(new Date(lead.preferredDate), "MMM d, yyyy")}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-600 dark:text-gray-400">{lead.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Providers Offered</div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{metrics.totalOffered}</div>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <div className="text-sm text-green-600 dark:text-green-400 font-medium">Providers Accepted</div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">{metrics.totalAccepted}</div>
                  </div>
                  
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                    <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">Pending Responses</div>
                    <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">{metrics.totalPending}</div>
                  </div>
                </div>
                
                {lead.leadAssignments && lead.leadAssignments.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Provider Responses</h4>
                    <div className="space-y-2">
                      {lead.leadAssignments.map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <span className="font-medium">{assignment.providerName}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant={assignment.status === "accepted" ? "default" : "secondary"}>
                              {assignment.status}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {format(new Date(assignment.assignedAt), "MMM d, yyyy")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        
        {leads?.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No leads found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || statusFilter !== "all" || categoryFilter !== "all" 
                  ? "Try adjusting your filters to see more results." 
                  : "No service requests have been submitted yet."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      </div>
    </div>
    </div>
  );
}