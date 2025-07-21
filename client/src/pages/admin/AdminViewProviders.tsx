import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  Search,
  Eye,
  Users,
  MapPin,
  Calendar,
  Phone,
  Mail,
  MapPin as LocationIcon,
  FileText,
  Settings,
  Activity,
  StickyNote,
  Filter,
  Plus,
  Trash2,
  X,
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

// Helper function for admin API requests
const adminApiRequest = async (method: string, endpoint: string, data?: any) => {
  const token = localStorage.getItem('adminToken');
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': token || '',
    },
  };

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(endpoint, options);
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || `HTTP ${response.status}`);
  }
  return response;
};

export default function AdminViewProviders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [activityFilter, setActivityFilter] = useState<'all' | 'admin' | 'provider'>('all');
  const [viewingDocument, setViewingDocument] = useState<any>(null);

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin-login');
    }
  }, [navigate]);

  // All Providers Query
  const { data: allProviders, isLoading } = useQuery({
    queryKey: ['/api/admin/providers', 'all'],
    queryFn: async () => {
      const response = await fetch('/api/admin/providers', {
        headers: {
          'x-admin-token': localStorage.getItem('adminToken') || '',
        },
      });
      return response.json();
    },
  });

  // Service Categories Query
  const { data: serviceCategories } = useQuery({
    queryKey: ['/api/service-categories'],
    queryFn: async () => {
      const response = await fetch('/api/service-categories');
      return response.json();
    },
  });

  // Provider Details Query for popup
  const { data: providerDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['/api/admin/providers', selectedProvider?.id, 'details'],
    queryFn: async () => {
      if (!selectedProvider) return null;
      const response = await adminApiRequest('GET', `/api/admin/providers/${selectedProvider.id}/details`);
      return response.json();
    },
    enabled: !!selectedProvider,
    staleTime: 0,
    gcTime: 0,
  });

  // Service Areas Query for popup
  const { data: serviceAreas, isLoading: isLoadingServiceAreas } = useQuery({
    queryKey: ['/api/admin/providers', selectedProvider?.id, 'service-areas'],
    queryFn: async () => {
      if (!selectedProvider) return [];
      const response = await adminApiRequest('GET', `/api/admin/providers/${selectedProvider.id}/service-areas`);
      return response.json();
    },
    enabled: !!selectedProvider && activeTab === 'service-area',
    staleTime: 0,
    gcTime: 0,
  });

  // Provider Services Query for popup
  const { data: providerServices } = useQuery({
    queryKey: ['/api/admin/providers', selectedProvider?.id, 'services'],
    queryFn: async () => {
      if (!selectedProvider) return [];
      const response = await adminApiRequest('GET', `/api/admin/providers/${selectedProvider.id}/services`);
      return response.json();
    },
    enabled: !!selectedProvider && activeTab === 'services',
  });

  // Provider Documents Query for popup
  const { data: providerDocuments } = useQuery({
    queryKey: ['/api/admin/providers', selectedProvider?.id, 'documents'],
    queryFn: async () => {
      if (!selectedProvider) return [];
      const response = await adminApiRequest('GET', `/api/admin/providers/${selectedProvider.id}/documents`);
      return response.json();
    },
    enabled: !!selectedProvider && activeTab === 'documents',
  });

  // Activity logs query for popup
  const { data: activityLogs, isLoading: isLoadingActivity } = useQuery({
    queryKey: ['/api/admin/providers', selectedProvider?.id, 'activity', activityFilter],
    queryFn: async () => {
      if (!selectedProvider) return [];
      const filterParam = activityFilter !== 'all' ? `?actorType=${activityFilter}` : '';
      const response = await adminApiRequest('GET', `/api/admin/providers/${selectedProvider.id}/activity${filterParam}`);
      return response.json();
    },
    enabled: !!selectedProvider && (activeTab === 'activity' || activeTab === 'notes'),
    staleTime: 0,
    gcTime: 0,
  });

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  // Document Status Toggle Mutation
  const documentStatusMutation = useMutation({
    mutationFn: async ({ documentId, status }: { documentId: number; status: string }) => {
      if (!selectedProvider) throw new Error('No provider selected');
      const response = await adminApiRequest('PUT', `/api/admin/providers/${selectedProvider.id}/documents/${documentId}/status`, {
        status: status
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Document Status Updated",
        description: "Document approval status has been updated successfully.",
      });
      // Refresh queries
      queryClient.invalidateQueries({ queryKey: ['/api/admin/providers', selectedProvider?.id, 'documents'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/providers', selectedProvider?.id, 'activity'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Admin Notes Save Mutation
  const saveNotesMutation = useMutation({
    mutationFn: async ({ notes, insuranceExpiryDate }: { notes: string; insuranceExpiryDate?: string }) => {
      if (!selectedProvider) throw new Error('No provider selected');
      const response = await adminApiRequest('PUT', `/api/admin/providers/${selectedProvider.id}/admin-notes`, {
        adminNotes: notes,
        insuranceExpiryDate: insuranceExpiryDate || null,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Notes Saved",
        description: "Admin notes have been saved successfully.",
      });
      // Refresh queries
      queryClient.invalidateQueries({ queryKey: ['/api/admin/providers', selectedProvider?.id, 'details'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/providers', selectedProvider?.id, 'activity'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Service Area Delete Mutation
  const deleteServiceAreaMutation = useMutation({
    mutationFn: async (areaId: number) => {
      if (!selectedProvider) throw new Error('No provider selected');
      const response = await adminApiRequest('DELETE', `/api/admin/providers/${selectedProvider.id}/service-areas/${areaId}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Service Area Deleted",
        description: "Service area has been removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/providers', selectedProvider?.id, 'service-areas'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/providers', selectedProvider?.id, 'activity'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter providers based on search term, status, and service category
  const filteredProviders = allProviders?.filter((provider: ServiceProvider) => {
    const matchesSearch = 
      provider.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      provider.status === statusFilter;

    const matchesCategory = 
      categoryFilter === 'all' || 
      (provider.services && provider.services.some(service => service.categoryName === categoryFilter));

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <AdminSidebar onLogout={handleLogout} />
      
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow border-b border-gray-200 dark:border-gray-700">
          <div className="px-8 py-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  All Service Providers
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage and view all registered service providers
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Service Provider Directory</CardTitle>
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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Services</option>
                  {serviceCategories?.map((category: any) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <Badge variant="outline">
                  {filteredProviders?.length || 0} Total
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading providers...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Provider</th>
                        <th className="text-left p-3">Contact</th>
                        <th className="text-left p-3">Location</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Services</th>
                        <th className="text-left p-3">Joined</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProviders?.map((provider: ServiceProvider) => (
                        <tr key={provider.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{provider.firstName} {provider.lastName}</p>
                              <p className="text-gray-500 text-xs">ID: {provider.id}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <div>
                              <p className="text-sm">{provider.email}</p>
                              <p className="text-gray-500 text-xs">{provider.mobileNumber}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                              <span className="text-sm text-gray-600 truncate max-w-32">
                                {provider.address}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            {getStatusBadge(provider.status)}
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              {provider.services?.length ? (
                                <span className="text-blue-600">
                                  {provider.services.length} service{provider.services.length !== 1 ? 's' : ''}
                                </span>
                              ) : (
                                <span className="text-gray-400">None</span>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            {new Date(provider.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedProvider(provider);
                                setIsViewDialogOpen(true);
                                setActiveTab("personal");
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {(!filteredProviders || filteredProviders.length === 0) && !isLoading && (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-gray-500">
                            No providers found matching your criteria
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* View Provider Details Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Provider Details - {selectedProvider?.firstName} {selectedProvider?.lastName}
              </DialogTitle>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="personal" className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Personal Details
                </TabsTrigger>
                <TabsTrigger value="service-area" className="flex items-center gap-1">
                  <LocationIcon className="h-4 w-4" />
                  Service Area
                </TabsTrigger>
                <TabsTrigger value="services" className="flex items-center gap-1">
                  <Settings className="h-4 w-4" />
                  Services
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex items-center gap-1">
                  <StickyNote className="h-4 w-4" />
                  Admin Notes
                </TabsTrigger>
              </TabsList>

              {/* Personal Details Tab */}
              <TabsContent value="personal" className="flex-1 overflow-y-auto p-4">
                {isLoadingDetails ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">First Name</Label>
                        <p className="text-lg font-semibold">{providerDetails?.firstName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Last Name</Label>
                        <p className="text-lg font-semibold">{providerDetails?.lastName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Email Address</Label>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <p className="text-lg">{providerDetails?.email}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Mobile Number</Label>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <p className="text-lg">{providerDetails?.mobileNumber}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Business Address</Label>
                        <div className="flex items-center gap-2">
                          <LocationIcon className="h-4 w-4 text-gray-400" />
                          <p className="text-lg">{providerDetails?.address}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Registration Date</Label>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <p className="text-lg">
                            {providerDetails?.createdAt ? new Date(providerDetails.createdAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Current Status</Label>
                        <div className="mt-1">
                          {providerDetails?.status === 'approved' && (
                            <Badge className="bg-green-100 text-green-800">Approved</Badge>
                          )}
                          {providerDetails?.status === 'pending' && (
                            <Badge className="bg-orange-100 text-orange-800">Pending Review</Badge>
                          )}
                          {providerDetails?.status === 'rejected' && (
                            <Badge className="bg-red-100 text-red-800">Rejected</Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Insurance Expiry Date</Label>
                        <Input
                          type="date"
                          value={providerDetails?.insuranceExpiryDate || ''}
                          onChange={(e) => {
                            saveNotesMutation.mutate({
                              notes: providerDetails?.adminNotes || '',
                              insuranceExpiryDate: e.target.value
                            });
                          }}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Service Area Tab */}
              <TabsContent value="service-area" className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Service Coverage Areas</h3>
                  {isLoadingServiceAreas ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : serviceAreas && serviceAreas.length > 0 ? (
                    <div className="grid gap-3">
                      {serviceAreas.map((area: any) => (
                        <div key={area.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <LocationIcon className="h-4 w-4 text-blue-600" />
                              <span className="font-medium">{area.areaName}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Radius: {area.radiusKm}km
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteServiceAreaMutation.mutate(area.id)}
                            disabled={deleteServiceAreaMutation.isPending}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No service areas configured</p>
                  )}
                </div>
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services" className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Selected Services</h3>
                  {providerServices && providerServices.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {providerServices.map((service: any) => (
                        <div key={service.id} className="p-3 border rounded-lg bg-blue-50 border-blue-200">
                          <p className="font-medium text-blue-900">{service.name}</p>
                          <p className="text-sm text-blue-700">{service.categoryName}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No services selected</p>
                  )}
                </div>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="flex-1 overflow-y-auto p-4">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Provider Documents</h3>
                  {providerDocuments && providerDocuments.length > 0 ? (
                    <div className="grid gap-4">
                      {providerDocuments.map((doc: any) => (
                        <div key={doc.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium capitalize">{doc.documentType.replace('_', ' ')}</h4>
                              <p className="text-sm text-gray-600">{doc.filename}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  {doc.status === 'approved' ? (
                                    <span className="text-green-600">Approved</span>
                                  ) : (
                                    <span className="text-orange-600">Pending</span>
                                  )}
                                </span>
                                <Switch
                                  checked={doc.status === 'approved'}
                                  onCheckedChange={(checked) => {
                                    documentStatusMutation.mutate({
                                      documentId: doc.id,
                                      status: checked ? 'approved' : 'pending'
                                    });
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* Inline Document Viewer */}
                          <div className="mt-4 border rounded-lg bg-gray-50 h-64 overflow-hidden">
                            {doc.filename?.toLowerCase().match(/\.(jpg|jpeg|png)$/) ? (
                              <img
                                src={`/api/admin/providers/${selectedProvider?.id}/documents/view/${doc.filename}`}
                                alt={doc.documentType}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling!.style.display = 'block';
                                }}
                              />
                            ) : (
                              <iframe
                                src={`/api/admin/providers/${selectedProvider?.id}/documents/view/${doc.filename}`}
                                className="w-full h-full border-0"
                                title={doc.documentType}
                              />
                            )}
                            <div style={{ display: 'none' }} className="flex items-center justify-center h-full text-gray-500">
                              <div className="text-center">
                                <FileText className="h-8 w-8 mx-auto mb-2" />
                                <p>Unable to preview document</p>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="mt-2"
                                  onClick={() => {
                                    window.open(`/api/admin/providers/${selectedProvider?.id}/documents/view/${doc.filename}`, '_blank');
                                  }}
                                >
                                  Open in New Tab
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No documents uploaded</p>
                  )}
                </div>
              </TabsContent>

              {/* Admin Notes Tab */}
              <TabsContent value="notes" className="flex-1 overflow-y-auto p-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Admin Notes</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="admin-notes">Add New Note</Label>
                        <Textarea
                          id="admin-notes"
                          placeholder="Enter admin notes..."
                          className="mt-2"
                          rows={3}
                          onBlur={(e) => {
                            if (e.target.value.trim()) {
                              saveNotesMutation.mutate({
                                notes: e.target.value,
                                insuranceExpiryDate: providerDetails?.insuranceExpiryDate
                              });
                            }
                          }}
                        />
                      </div>

                      {/* Previous Notes History */}
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Previous Notes</Label>
                        <div className="mt-2 max-h-64 overflow-y-auto border rounded-lg bg-gray-50 p-4">
                          {activityLogs && activityLogs.length > 0 ? (
                            <div className="space-y-3">
                              {activityLogs
                                .filter((log: any) => log.activityType === 'admin_notes' || log.description?.includes('notes'))
                                .map((log: any) => (
                                  <div key={log.id} className="bg-white p-3 rounded border">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <p className="text-sm">{log.description}</p>
                                        {log.newValue && (
                                          <p className="text-sm mt-2 bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                                            {log.newValue}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                      <Badge variant="outline" className="text-xs">
                                        {log.actorName}
                                      </Badge>
                                      <span>{new Date(log.createdAt).toLocaleString()}</span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-center py-4">No previous notes found</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}