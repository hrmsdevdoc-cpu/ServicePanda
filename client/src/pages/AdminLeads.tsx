import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TrendingUp, Users, MapPin, Calendar, Filter, Search, X, FileText, Clock, CheckCircle, AlertCircle, Phone, Mail, User, Globe, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { AdminLeadOfferDetails } from "@/components/AdminLeadOfferDetails";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

// Admin API request helper
const adminApiRequest = async (method: string, url: string, data?: any) => {
  const token = localStorage.getItem('adminToken');
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': token || '',
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  
  // Check for 401 Unauthorized (token expired)
  if (response.status === 401) {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin-login';
    throw new Error('Session expired');
  }
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
  }
  
  return response;
};

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
  const { toast } = useToast();

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

  // Query for lead offer details
  const { data: offerDetails } = useQuery({
    queryKey: ["/api/admin/leads", selectedRequestId, "offer-details"],
    queryFn: async () => {
      if (!selectedRequestId) return null;
      const response = await adminApiRequest('GET', `/api/admin/leads/${selectedRequestId}/offer-details`);
      return response.json();
    },
    enabled: !!selectedRequestId && isOfferDetailsOpen,
  });

  // Query for service categories to use in filters
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/service-categories"],
    queryFn: async () => {
      const response = await fetch('/api/service-categories');
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
      case 'completed':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Completed</Badge>;
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
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
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
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <th className="px-2 py-2 text-left font-medium text-gray-600 dark:text-gray-400">ID</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-600 dark:text-gray-400">State</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-600 dark:text-gray-400">Suburb</th>
                    <th className="px-2 py-2 text-center font-medium text-gray-600 dark:text-gray-400"><Globe className="h-3 w-3 mx-auto" /></th>
                    <th className="px-2 py-2 text-left font-medium text-gray-600 dark:text-gray-400">Lead Date</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-600 dark:text-gray-400">Job Date</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-600 dark:text-gray-400">Customer Name</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-600 dark:text-gray-400">Email</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-600 dark:text-gray-400">Phone</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-600 dark:text-gray-400">Type</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-600 dark:text-gray-400">Category</th>
                    <th className="px-2 py-2 text-center font-medium text-gray-600 dark:text-gray-400">Offered</th>
                    <th className="px-2 py-2 text-center font-medium text-gray-600 dark:text-gray-400">Accepted</th>
                    <th className="px-2 py-2 text-center font-medium text-gray-600 dark:text-gray-400">Pending</th>
                    <th className="px-2 py-2 text-left font-medium text-gray-600 dark:text-gray-400">Status</th>
                    <th className="px-2 py-2 text-center font-medium text-gray-600 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-600">
                  {leads?.map((lead) => {
                    const metrics = getLeadMetrics(lead.leadAssignments);
                    
                    return (
                      <tr 
                        key={lead.id} 
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                        onClick={() => handleLeadClick(lead)}
                      >
                        <td className="px-2 py-1 font-medium text-blue-600">#{lead.id}</td>
                        <td className="px-2 py-1">{lead.state || 'NSW'}</td>
                        <td className="px-2 py-1 max-w-20 truncate">{lead.suburb}</td>
                        <td className="px-2 py-1 text-center">
                          <Globe className="h-3 w-3 text-gray-400 mx-auto" />
                        </td>
                        <td className="px-2 py-1">{format(new Date(lead.createdAt), "MMM d")}</td>
                        <td className="px-2 py-1">
                          {lead.preferredDate ? format(new Date(lead.preferredDate), "MMM d") : '-'}
                        </td>
                        <td className="px-2 py-1 font-medium max-w-32 truncate">{lead.customerName}</td>
                        <td className="px-2 py-1 text-gray-600 max-w-40 truncate">{lead.customerEmail}</td>
                        <td className="px-2 py-1 text-gray-600 max-w-24 truncate">{lead.customerPhone || '-'}</td>
                        <td className="px-2 py-1">
                          <span className="inline-flex items-center gap-1">
                            {getLeadTypeBadge(lead.bookingType)}
                            {lead.status === 'active' && <span className="text-green-600 text-xs">●</span>}
                          </span>
                        </td>
                        <td className="px-2 py-1 text-xs text-gray-600 max-w-24 truncate" title={lead.categoryName}>
                          {lead.categoryName}
                        </td>
                        <td className="px-2 py-1 text-center font-medium">{metrics.totalOffered}</td>
                        <td className="px-2 py-1 text-center font-medium text-green-600">{metrics.totalAccepted}</td>
                        <td className="px-2 py-1 text-center font-medium text-orange-600">{metrics.totalPending}</td>
                        <td className="px-2 py-1">{getLeadStatusBadge(lead.status)}</td>
                        <td className="px-2 py-1 text-center">
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
                        </td>
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
            <SheetContent side="right" className="w-full sm:w-[400px] md:w-[500px] p-0">
              {selectedLead && (
                <div className="h-full flex flex-col">
                  {/* Panel Header */}
                  <SheetHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <SheetTitle className="text-xl">Lead #{selectedLead.id}</SheetTitle>
                        <p className="text-sm text-gray-500 mt-1">{selectedLead.categoryName}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setIsPanelOpen(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </SheetHeader>

                  {/* Panel Content */}
                  <div className="flex-1 flex flex-col">
                    {/* Top 65% - Details */}
                    <div className="flex-1 p-6 overflow-y-auto">
                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <Button variant="outline" size="sm" className="justify-start">
                          <User className="h-4 w-4 mr-2" />
                          Customer Info
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          <MapPin className="h-4 w-4 mr-2" />
                          Location
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Customer
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start">
                          <Mail className="h-4 w-4 mr-2" />
                          Email Customer
                        </Button>
                      </div>

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
                    <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-4">
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
                        <div className="mt-2 max-h-40 overflow-y-auto space-y-2">
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
        offerDetails={offerDetails}
      />
    </div>
  );
}