import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TrendingUp, Users, MapPin, Calendar, Filter, Search, X, FileText, Clock, CheckCircle, AlertCircle, Phone, Mail, User, Globe, BarChart3, MoreVertical, MessageSquare, Activity, Eye, EyeOff, Columns } from "lucide-react";
import { format } from "date-fns";
import { AdminLeadOfferDetails } from "@/components/AdminLeadOfferDetails";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

// Import the centralized admin API request function
import { adminApiRequest } from "@/lib/adminAuth";

interface ServiceRequest {
  id: number;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  categoryName: string;
  serviceType: string;
  description: string;
  location: string;
  suburb: string;
  postcode: string;
  state: string;
  preferredDate: string;
  bookingType: string;
  status: string;
  createdAt: string;
  leadSource?: string;
  // New lead offers structure
  leadOffers?: Array<{
    id: number;
    providerId: number;
    providerName: string;
    offerType: string;
    status: string;
    isCurrentOffer: boolean;
    offerStartTime?: string;
    expiresAt?: string;
    createdAt: string;
  }>;
  offerMetrics?: {
    totalOffered: number;
    totalAccepted: number;
    totalPending: number;
    totalExpired: number;
  };
  // Legacy for backward compatibility
  leadAssignments?: Array<{
    id: number;
    providerId: number;
    providerName: string;
    status: string;
    assignedAt: string;
  }>;
  notes?: Array<{
    id: number;
    note: string;
    createdAt: string;
    adminName?: string;
  }>;
}

interface ProviderInteraction {
  id: number;
  providerId: number;
  leadId: number;
  interactionType: 'call' | 'sms' | 'email';
  createdAt: string;
}

export default function AdminLeads() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<ServiceRequest | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [isOfferDetailsOpen, setIsOfferDetailsOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [isInteractionsOpen, setIsInteractionsOpen] = useState(false);
  const [selectedLeadForInteractions, setSelectedLeadForInteractions] = useState<number | null>(null);
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const { toast } = useToast();

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    customerName: true,
    state: true,
    suburb: true,
    leadDate: true,
    jobDate: false,
    email: false,
    phone: false,
    type: true,
    category: true,
    offered: true,
    accepted: true,
    pending: true,
    status: true,
    actions: true,
  });

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
  };

  // Close column menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showColumnMenu && !target.closest('.column-menu-container')) {
        setShowColumnMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showColumnMenu]);

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
      const response = await adminApiRequest('GET', '/api/admin/leads');
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

  // Query to fetch provider interactions for a specific lead
  const { data: interactions = [], isLoading: interactionsLoading } = useQuery({
    queryKey: ["/api/admin/leads", selectedLeadForInteractions, "interactions"],
    queryFn: async () => {
      if (!selectedLeadForInteractions) return [];
      const response = await adminApiRequest('GET', `/api/admin/leads/${selectedLeadForInteractions}/interactions`);
      return response.json();
    },
    enabled: !!selectedLeadForInteractions,
  });

  // Mutation to add notes to a lead
  const addNoteMutation = useMutation({
    mutationFn: async ({ leadId, note }: { leadId: number, note: string }) => {
      const response = await adminApiRequest('POST', `/api/admin/leads/${leadId}/notes`, { note });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Note Added",
        description: "Lead note has been added successfully.",
      });
      setNewNote("");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leads"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLeadClick = (lead: ServiceRequest) => {
    setSelectedLead(lead);
    setIsPanelOpen(true);
  };

  const handleViewOfferDetails = (requestId: number) => {
    setSelectedRequestId(requestId);
    setIsOfferDetailsOpen(true);
  };

  // No need for separate query - AdminLeadOfferDetails now handles its own data fetching

  // Query for service categories to use in filters
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/service-categories"],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/service-categories');
      return response.json();
    },
  });

  const handleAddNote = () => {
    if (!selectedLead || !newNote.trim()) return;
    
    addNoteMutation.mutate({
      leadId: selectedLead.id,
      note: newNote.trim(),
    });
  };

  const getLeadStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'in-progress':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'assigned':
        return <Badge variant="default" className="bg-purple-100 text-purple-800">Assigned</Badge>;
      case 'expired':
        return <Badge variant="default" className="bg-gray-100 text-gray-800">Expired</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getLeadTypeBadge = (bookingType: string) => {
    switch (bookingType?.toLowerCase()) {
      case 'one-time':
        return <Badge variant="outline" className="text-purple-600 text-xs px-2 py-0 h-5">One-time</Badge>;
      case 'regular':
        return <Badge variant="outline" className="text-blue-600 text-xs px-2 py-0 h-5">Regular</Badge>;
      case 'emergency':
        return <Badge variant="outline" className="text-red-600 text-xs px-2 py-0 h-5">Emergency</Badge>;
      case 'quote-only':
        return <Badge variant="outline" className="text-orange-600 text-xs px-2 py-0 h-5">Quote Only</Badge>;
      default:
        return <Badge variant="outline" className="text-xs px-2 py-0 h-5">{bookingType || 'Standard'}</Badge>;
    }
  };

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

  const getLeadMetrics = (lead: ServiceRequest) => {
    // Use new offerMetrics if available, otherwise fallback to leadAssignments for backward compatibility
    if (lead.offerMetrics) {
      return {
        totalOffered: lead.offerMetrics.totalOffered,
        totalAccepted: lead.offerMetrics.totalAccepted,
        totalPending: lead.offerMetrics.totalPending
      };
    }
    
    // Legacy fallback for backward compatibility
    const leadAssignments = lead.leadAssignments || [];
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
    <div className="h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 flex relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(156, 146, 172, 0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      {/* Subtle Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-blue-100/20 pointer-events-none"></div>
      {/* Sidebar */}
      <div className="relative z-20">
        <AdminSidebar onLogout={handleLogout} />
      </div>
      
      {/* Main content area */}
      <div className="flex-1 overflow-hidden relative z-10">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-sm dark:bg-gray-800 shadow-lg shadow-slate-200/20 border-b border-slate-200/50 dark:border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Lead Management
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage service requests and track provider responses
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex h-[calc(100vh-100px)]">
          {/* List View */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Filters */}
            <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
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

                {/* Column Visibility Toggle */}
                <div className="relative column-menu-container">
                  <Button
                    variant="outline"
                    onClick={() => setShowColumnMenu(!showColumnMenu)}
                    className="w-full"
                  >
                    <Columns className="h-4 w-4 mr-2" />
                    Columns
                  </Button>
                  
                  {showColumnMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-50 column-menu-dropdown">
                      <div className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Show/Hide Columns</div>
                      <div className="space-y-2 max-h-80 overflow-y-auto">
                        {[
                          { key: 'id', label: 'ID' },
                          { key: 'customerName', label: 'Customer Name' },
                          { key: 'state', label: 'State' },
                          { key: 'suburb', label: 'Suburb' },
                          { key: 'leadDate', label: 'Lead Date' },
                          { key: 'jobDate', label: 'Job Date' },
                          { key: 'email', label: 'Email' },
                          { key: 'phone', label: 'Phone' },
                          { key: 'type', label: 'Type' },
                          { key: 'category', label: 'Category' },
                          { key: 'offered', label: 'Offered' },
                          { key: 'accepted', label: 'Accepted' },
                          { key: 'pending', label: 'Pending' },
                          { key: 'status', label: 'Status' },
                        ].map((column) => (
                          <label key={column.key} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
                            <input
                              type="checkbox"
                              checked={visibleColumns[column.key as keyof typeof visibleColumns]}
                              onChange={() => toggleColumn(column.key as keyof typeof visibleColumns)}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{column.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    {visibleColumns.id && <th className="px-3 py-3 text-left font-medium text-gray-600 dark:text-gray-400 sticky left-0 bg-gray-50 dark:bg-gray-700 z-10">ID</th>}
                    {visibleColumns.customerName && <th className="px-3 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Customer Name</th>}
                    {visibleColumns.state && <th className="px-3 py-3 text-left font-medium text-gray-600 dark:text-gray-400">State</th>}
                    {visibleColumns.suburb && <th className="px-3 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Suburb</th>}
                    {visibleColumns.leadDate && <th className="px-3 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Lead Date</th>}
                    {visibleColumns.jobDate && <th className="px-3 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Job Date</th>}
                    {visibleColumns.email && <th className="px-3 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Email</th>}
                    {visibleColumns.phone && <th className="px-3 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Phone</th>}
                    {visibleColumns.type && <th className="px-3 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Type</th>}
                    {visibleColumns.category && <th className="px-3 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Category</th>}
                    {visibleColumns.offered && <th className="px-3 py-3 text-center font-medium text-gray-600 dark:text-gray-400">Offered</th>}
                    {visibleColumns.accepted && <th className="px-3 py-3 text-center font-medium text-gray-600 dark:text-gray-400">Accepted</th>}
                    {visibleColumns.pending && <th className="px-3 py-3 text-center font-medium text-gray-600 dark:text-gray-400">Pending</th>}
                    {visibleColumns.status && <th className="px-3 py-3 text-left font-medium text-gray-600 dark:text-gray-400">Status</th>}
                    {visibleColumns.actions && <th className="px-3 py-3 text-center font-medium text-gray-600 dark:text-gray-400">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-600">
                  {leads?.map((lead) => {
                    const metrics = getLeadMetrics(lead);
                    
                    return (
                      <tr 
                        key={lead.id} 
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                        onClick={() => handleLeadClick(lead)}
                      >
                        {visibleColumns.id && (
                          <td className="px-3 py-2 text-blue-600 font-medium sticky left-0 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                            #{lead.id}
                          </td>
                        )}
                        {visibleColumns.customerName && <td className="px-3 py-2 font-medium">{lead.customerName}</td>}
                        {visibleColumns.state && <td className="px-3 py-2">{lead.state || 'NSW'}</td>}
                        {visibleColumns.suburb && <td className="px-3 py-2">{lead.suburb}</td>}
                        {visibleColumns.leadDate && <td className="px-3 py-2 whitespace-nowrap">{format(new Date(lead.createdAt), "MMM d, yy")}</td>}
                        {visibleColumns.jobDate && (
                          <td className="px-3 py-2 whitespace-nowrap">
                            {lead.preferredDate ? format(new Date(lead.preferredDate), "MMM d, yy") : '-'}
                          </td>
                        )}
                        {visibleColumns.email && <td className="px-3 py-2 text-gray-600">{lead.customerEmail}</td>}
                        {visibleColumns.phone && <td className="px-3 py-2 text-gray-600">{lead.customerPhone || '-'}</td>}
                        {visibleColumns.type && (
                          <td className="px-3 py-2">
                            <span className="inline-flex items-center gap-1">
                              {getLeadTypeBadge(lead.bookingType)}
                              {lead.status === 'active' && <span className="text-green-600 text-xs">●</span>}
                            </span>
                          </td>
                        )}
                        {visibleColumns.category && <td className="px-3 py-2 text-gray-600">{lead.categoryName}</td>}
                        {visibleColumns.offered && <td className="px-3 py-2 text-center font-medium">{metrics.totalOffered}</td>}
                        {visibleColumns.accepted && <td className="px-3 py-2 text-center font-medium text-green-600">{metrics.totalAccepted}</td>}
                        {visibleColumns.pending && <td className="px-3 py-2 text-center font-medium text-orange-600">{metrics.totalPending}</td>}
                        {visibleColumns.status && <td className="px-3 py-2">{getLeadStatusBadge(lead.status)}</td>}
                        {visibleColumns.actions && (
                          <td className="px-3 py-2">
                            <div className="flex gap-1 justify-center">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewOfferDetails(lead.id);
                                }}
                                className="text-blue-600 border-blue-300 hover:bg-blue-50 text-xs px-2 py-1"
                              >
                                <BarChart3 className="h-3 w-3 mr-1" />
                                Offers
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLeadForInteractions(lead.id);
                                  setIsInteractionsOpen(true);
                                }}
                                className="text-green-600 border-green-300 hover:bg-green-50 text-xs px-2 py-1"
                              >
                                <Activity className="h-3 w-3 mr-1" />
                                Activity
                              </Button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {leads?.length === 0 && (
                <div className="p-12 text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No leads found</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchTerm || statusFilter !== "all" || categoryFilter !== "all" 
                      ? "Try adjusting your filters to see more results." 
                      : "No service requests have been submitted yet."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side Panel */}
          <Sheet open={isPanelOpen} onOpenChange={setIsPanelOpen}>
            <SheetContent side="right" className="w-full sm:w-[400px] md:w-[500px] p-0 overflow-hidden">
              {selectedLead && (
                <div className="h-full flex flex-col overflow-hidden">
                  {/* Panel Header */}
                  <SheetHeader className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <div>
                      <SheetTitle className="text-xl">Lead #{selectedLead.id}</SheetTitle>
                      <p className="text-sm text-gray-500 mt-1">{selectedLead.categoryName}</p>
                    </div>
                  </SheetHeader>

                  {/* Panel Content */}
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top 65% - Details */}
                    <div className="flex-1 p-6 overflow-y-auto overflow-x-hidden">
                      {/* Lead Details */}
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Customer Details</Label>
                          <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="font-medium">{selectedLead.customerName}</div>
                            <div className="text-sm text-gray-600">{selectedLead.customerEmail}</div>
                            {selectedLead.customerPhone && (
                              <div className="text-sm text-gray-600">{selectedLead.customerPhone}</div>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-600">Location</Label>
                          <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>{selectedLead.location}</div>
                            <div className="text-sm text-gray-600">{selectedLead.suburb}, {selectedLead.postcode}</div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-600">Service Description</Label>
                          <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <p className="text-sm">{selectedLead.description}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Lead Date</Label>
                            <div className="mt-1 text-sm">{format(new Date(selectedLead.createdAt), "MMM d, yyyy")}</div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Preferred Date</Label>
                            <div className="mt-1 text-sm">
                              {selectedLead.preferredDate ? format(new Date(selectedLead.preferredDate), "MMM d, yyyy") : 'Not specified'}
                            </div>
                          </div>
                        </div>

                        {/* Provider Responses */}
                        {selectedLead.leadAssignments && selectedLead.leadAssignments.length > 0 && (
                          <div>
                            <Label className="text-sm font-medium text-gray-600">Provider Responses</Label>
                            <div className="mt-2 space-y-2">
                              {selectedLead.leadAssignments.map((assignment) => (
                                <div key={assignment.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">{assignment.providerName}</span>
                                    <Badge variant={assignment.status === "accepted" ? "default" : "secondary"}>
                                      {assignment.status}
                                    </Badge>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {format(new Date(assignment.assignedAt), "MMM d, yyyy 'at' h:mm a")}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom 35% - Notes Section */}
                    <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-4 flex-shrink-0 overflow-y-auto" style={{ maxHeight: '35vh' }}>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Add Note</Label>
                        <div className="mt-2 flex gap-2">
                          <Textarea
                            placeholder="Add a note about this lead..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            className="flex-1 min-h-[60px]"
                          />
                          <Button 
                            onClick={handleAddNote}
                            disabled={!newNote.trim() || addNoteMutation.isPending}
                            size="sm"
                          >
                            {addNoteMutation.isPending ? "Adding..." : "Add"}
                          </Button>
                        </div>
                      </div>

                      {/* Existing Notes */}
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Activity & Notes</Label>
                        <div className="mt-2 space-y-2">
                          {selectedLead.notes && selectedLead.notes.length > 0 ? (
                            selectedLead.notes.map((note) => (
                              <div key={note.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="text-sm">{note.note}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {format(new Date(note.createdAt), "MMM d, yyyy 'at' h:mm a")}
                                  {note.adminName && ` by ${note.adminName}`}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-500 text-center py-4">
                              No notes or activity yet
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Lead Offer Details Popup */}
      <AdminLeadOfferDetails
        isOpen={isOfferDetailsOpen}
        onClose={() => {
          setIsOfferDetailsOpen(false);
          setSelectedRequestId(null);
        }}
        requestId={selectedRequestId || 0}
      />

      {/* Provider Interactions Dialog */}
      <Dialog open={isInteractionsOpen} onOpenChange={setIsInteractionsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Provider Lead Activity - Lead #{selectedLeadForInteractions}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden">
            {interactionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full mr-3" />
                <span className="text-gray-600">Loading provider interactions...</span>
              </div>
            ) : interactions.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Provider Activity</h3>
                <p className="text-gray-500">
                  No provider interactions have been recorded for this lead yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="text-sm text-gray-600 mb-4">
                  Showing {interactions.length} provider interaction{interactions.length !== 1 ? 's' : ''}
                </div>
                
                {interactions.map((interaction: ProviderInteraction & { providerName: string; providerEmail: string }) => (
                  <div key={interaction.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-gray-100">
                          {interaction.interactionType === 'call' && <Phone className="h-4 w-4 text-blue-600" />}
                          {interaction.interactionType === 'sms' && <MessageSquare className="h-4 w-4 text-green-600" />}
                          {interaction.interactionType === 'email' && <Mail className="h-4 w-4 text-purple-600" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {interaction.providerName}
                            </span>
                            <Badge variant="outline" className={
                              interaction.interactionType === 'call' ? 'text-blue-600 border-blue-300' :
                              interaction.interactionType === 'sms' ? 'text-green-600 border-green-300' :
                              'text-purple-600 border-purple-300'
                            }>
                              {interaction.interactionType.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {interaction.providerEmail}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {interaction.interactionType === 'call' && 'Made a phone call to customer'}
                            {interaction.interactionType === 'sms' && 'Sent SMS to customer'}
                            {interaction.interactionType === 'email' && 'Sent email to customer'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {format(new Date(interaction.createdAt), "MMM d, yyyy")}
                        </div>
                        <div className="text-xs text-gray-400">
                          {format(new Date(interaction.createdAt), "h:mm a")}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}