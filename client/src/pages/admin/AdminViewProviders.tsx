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
import { adminApiRequest } from "@/lib/adminAuth";
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
  User,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  Home,
  Wrench,
  Zap,
  Droplets,
  Car,
  Hammer,
  TreePine,
  Bug,
  Sparkles,
  Building
} from "lucide-react";

// Service icons mapping
const serviceIcons = {
  'Air Conditioning': Zap,
  'Bond Cleaning': Sparkles,
  'Carpet Cleaning': Home,
  'Domestic Cleaning': Home,
  'Electrical': Zap,
  'Gardening': TreePine,
  'Handyman': Hammer,
  'Pest Control': Bug,
  'Plumbing': Droplets,
  'Removals': Car,
  'Solar Installation': Zap,
  'Office Cleaning': Building,
};

// Admin Service Category Selector Component
interface AdminServiceCategorySelectorProps {
  providerId: number | undefined;
  currentServices: any[];
  onServicesUpdate: () => void;
  queryClient: any;
}

function AdminServiceCategorySelector({ 
  providerId, 
  currentServices = [], 
  onServicesUpdate,
  queryClient
}: AdminServiceCategorySelectorProps) {
  const { toast } = useToast();
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch all service categories
  const { data: allCategories = [] } = useQuery({
    queryKey: ['/api/service-categories'],
    retry: false,
  });

  // Initialize selected services from current provider services
  useEffect(() => {
    if (currentServices.length > 0) {
      const serviceIds = currentServices.map(service => service.categoryId);
      setSelectedServices(Array.from(new Set(serviceIds)));
    }
  }, [currentServices]);

  const updateServicesMutation = useMutation({
    mutationFn: async (categoryIds: number[]) => {
      if (!providerId) throw new Error('Provider ID is required');
      
      setIsUpdating(true);
      const response = await adminApiRequest('POST', `/api/admin/providers/${providerId}/services`, {
        categoryIds
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Services Updated",
        description: "Provider service categories have been updated successfully",
        variant: "default",
      });
      // Invalidate all related provider data caches
      queryClient.invalidateQueries({ queryKey: ['/api/admin/providers', providerId] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/providers'] });
      onServicesUpdate();
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed", 
        description: error.message || "Failed to update service categories",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsUpdating(false);
    }
  });

  const handleServiceToggle = (categoryId: number) => {
    setSelectedServices(prev => {
      const newSelection = prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId];
      return newSelection;
    });
  };

  const handleSaveServices = () => {
    updateServicesMutation.mutate(selectedServices);
  };

  const hasChanges = () => {
    const currentServiceIds = currentServices.map(s => s.categoryId).sort();
    const newServiceIds = [...selectedServices].sort();
    return JSON.stringify(currentServiceIds) !== JSON.stringify(newServiceIds);
  };

  return (
    <div className="space-y-4">
      {/* Service Category Grid */}
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {(allCategories as any[])?.map((category: any) => {
          const IconComponent = serviceIcons[category.name as keyof typeof serviceIcons] || Home;
          const isSelected = selectedServices.includes(category.id);
          
          return (
            <div
              key={category.id}
              className={`relative border-2 rounded-lg p-2 text-center cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? "border-primary bg-blue-50 shadow-md" 
                  : "border-gray-300 hover:border-primary hover:shadow-sm"
              }`}
              onClick={() => handleServiceToggle(category.id)}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${
                isSelected ? "bg-primary text-white" : "bg-blue-100"
              }`}>
                <IconComponent className={`h-4 w-4 ${isSelected ? "text-white" : "text-primary"}`} />
              </div>
              <span className={`text-xs font-medium leading-tight block ${
                isSelected ? "text-primary" : "text-gray-600"
              }`}>
                {category.name}
              </span>
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-2.5 w-2.5 text-white" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      {hasChanges() && (
        <div className="flex justify-end pt-4 border-t">
          <Button 
            onClick={handleSaveServices}
            disabled={isUpdating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isUpdating ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Updating...
              </>
            ) : (
              'Save Service Changes'
            )}
          </Button>
        </div>
      )}

      {/* Current Services Summary */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Selected Services ({selectedServices.length}):
        </p>
        <div className="text-sm text-gray-600">
          {selectedServices.length > 0 
            ? (allCategories as any[])
                .filter((cat: any) => selectedServices.includes(cat.id))
                .map((cat: any) => cat.name)
                .join(', ')
            : 'No services selected'
          }
        </div>
      </div>
    </div>
  );
}

interface ServiceProvider {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address: string;
  businessName?: string;
  businessAbn?: string;
  status: string;
  documentsUploaded: boolean;
  createdAt: string;
  services?: Array<{ id: number; name: string; categoryName: string }>;
  serviceAreas?: Array<{ id: number; suburb: string; postcode: string }>;
}



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
  const { data: providerServices, isLoading: isLoadingServices } = useQuery({
    queryKey: ['/api/admin/providers', selectedProvider?.id, 'services'],
    queryFn: async () => {
      if (!selectedProvider) return [];
      const response = await adminApiRequest('GET', `/api/admin/providers/${selectedProvider.id}/services`);
      return response.json();
    },
    enabled: !!selectedProvider && activeTab === 'services',
    staleTime: 0,
    gcTime: 0,
  });

  // Provider Documents Query for popup
  const { data: providerDocuments, isLoading: isLoadingDocuments } = useQuery({
    queryKey: ['/api/admin/providers', selectedProvider?.id, 'documents'],
    queryFn: async () => {
      if (!selectedProvider) return [];
      const response = await adminApiRequest('GET', `/api/admin/providers/${selectedProvider.id}/documents`);
      return response.json();
    },
    enabled: !!selectedProvider && activeTab === 'documents',
    staleTime: 0,
    gcTime: 0,
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

  // Save notes mutation
  const saveNotesMutation = useMutation({
    mutationFn: async ({ notes, insuranceExpiryDate }: { notes: string; insuranceExpiryDate?: string }) => {
      if (!selectedProvider) return;
      const response = await adminApiRequest('PUT', `/api/admin/providers/${selectedProvider.id}/notes`, {
        adminNotes: notes,
        insuranceExpiryDate: insuranceExpiryDate || null,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Insurance Date Saved",
        description: "Insurance expiry date has been updated successfully.",
        variant: "default",
      });
      // Invalidate all relevant caches to refresh the display
      queryClient.invalidateQueries({ queryKey: ['/api/admin/providers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/providers', selectedProvider?.id, 'details'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/providers', selectedProvider?.id, 'activity'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to Save Note",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Document status mutation
  const documentStatusMutation = useMutation({
    mutationFn: async ({ documentId, status }: { documentId: number; status: string }) => {
      const response = await adminApiRequest('PUT', `/api/admin/providers/${selectedProvider?.id}/documents/${documentId}/status`, {
        status,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Document Status Updated",
        description: "Document approval status has been changed successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/providers', selectedProvider?.id] });
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

  // Provider status mutation
  const providerStatusMutation = useMutation({
    mutationFn: async ({ providerId, status }: { providerId: number; status: string }) => {
      const response = await adminApiRequest('PUT', `/api/admin/providers/${providerId}/provider-status`, {
        providerStatus: status,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Provider Status Updated",
        description: "Provider status has been changed successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/providers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/providers', selectedProvider?.id, 'details'] });
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

  // Delete service area mutation  
  const deleteServiceAreaMutation = useMutation({
    mutationFn: async (serviceAreaId: number) => {
      const response = await adminApiRequest('DELETE', `/api/admin/providers/${selectedProvider?.id}/service-areas/${serviceAreaId}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Service Area Deleted",
        description: "Service area has been removed successfully.",
        variant: "default",
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

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

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
                            <div className="text-sm max-w-48">
                              {provider.services?.length ? (
                                <div className="flex flex-wrap gap-1">
                                  {provider.services.slice(0, 3).map((service: any, index: number) => {
                                    const IconComponent = serviceIcons[service.categoryName as keyof typeof serviceIcons] || Wrench;
                                    return (
                                      <div key={index} className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs">
                                        <IconComponent className="h-3 w-3 mr-1" />
                                        {service.categoryName}
                                      </div>
                                    );
                                  })}
                                  {provider.services.length > 3 && (
                                    <div className="text-xs text-gray-500 px-2 py-1">
                                      +{provider.services.length - 3} more
                                    </div>
                                  )}
                                </div>
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
          <DialogContent className="max-w-5xl h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Provider Details - {selectedProvider?.firstName} {selectedProvider?.lastName}
              </DialogTitle>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="personal" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal Details
                </TabsTrigger>
                <TabsTrigger value="service-area" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Service Area
                </TabsTrigger>
                <TabsTrigger value="services" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Services
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex items-center gap-2">
                  <StickyNote className="h-4 w-4" />
                  Notes
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Activity
                </TabsTrigger>
              </TabsList>

              {/* Personal Details Tab */}
              <TabsContent value="personal" className="space-y-6 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label className="text-sm font-medium">First Name</Label>
                        <p className="mt-1 p-2 bg-gray-50 rounded border">{selectedProvider?.firstName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Last Name</Label>
                        <p className="mt-1 p-2 bg-gray-50 rounded border">{selectedProvider?.lastName}</p>
                      </div>
                      <div className="border-l-4 border-blue-500 pl-3">
                        <Label className="text-sm font-medium text-blue-700">Business Name</Label>
                        <p className="mt-1 p-2 bg-blue-50 rounded border border-blue-200">
                          {selectedProvider?.businessName || 'Not provided'}
                        </p>
                      </div>
                      <div className="border-l-4 border-blue-500 pl-3">
                        <Label className="text-sm font-medium text-blue-700">ABN/ACN Number</Label>
                        <p className="mt-1 p-2 bg-blue-50 rounded border border-blue-200">
                          {selectedProvider?.businessAbn || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Email Address</Label>
                        <p className="mt-1 p-2 bg-gray-50 rounded border">{selectedProvider?.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Mobile Number</Label>
                        <p className="mt-1 p-2 bg-gray-50 rounded border">{selectedProvider?.mobileNumber}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Address</Label>
                        <p className="mt-1 p-2 bg-gray-50 rounded border">{selectedProvider?.address}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Official Use</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="insuranceExpiry" className="text-sm font-medium">
                          Insurance Expiry Date
                        </Label>
                        <Input
                          id="insuranceExpiry"
                          type="date"
                          defaultValue={providerDetails?.insuranceExpiryDate ? 
                            new Date(providerDetails.insuranceExpiryDate).toISOString().split('T')[0] : ''}
                          className="mt-1"
                        />
                        <Button
                          size="sm"
                          onClick={() => {
                            const insuranceExpiryElement = document.getElementById('insuranceExpiry') as HTMLInputElement;
                            const insuranceDate = insuranceExpiryElement?.value;
                            if (insuranceDate) {
                              saveNotesMutation.mutate({
                                notes: providerDetails?.adminNotes || '',
                                insuranceExpiryDate: insuranceDate,
                              });
                            } else {
                              toast({
                                title: "Please select a date",
                                description: "Please select an insurance expiry date before saving.",
                                variant: "destructive",
                              });
                            }
                          }}
                          disabled={saveNotesMutation.isPending}
                          className="mt-2 bg-blue-600 hover:bg-blue-700"
                        >
                          {saveNotesMutation.isPending ? 'Saving...' : 'Save Insurance Date'}
                        </Button>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Application Status</Label>
                        <Badge 
                          variant={selectedProvider?.status === 'pending' ? 'outline' : 
                                  selectedProvider?.status === 'approved' ? 'default' : 'destructive'}
                          className="mt-1 capitalize"
                        >
                          {selectedProvider?.status}
                        </Badge>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Provider Status</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-sm font-medium ${providerDetails?.providerStatus === 'activated' ? 'text-green-600' : 'text-red-600'}`}>
                            {providerDetails?.providerStatus === 'activated' ? 'Activated' : 'Deactivated'}
                          </span>
                          <Switch
                            checked={providerDetails?.providerStatus === 'activated'}
                            onCheckedChange={(checked) => {
                              if (selectedProvider?.id) {
                                providerStatusMutation.mutate({
                                  providerId: selectedProvider.id,
                                  status: checked ? 'activated' : 'deactivated'
                                });
                              }
                            }}
                            disabled={providerStatusMutation.isPending}
                            className="data-[state=checked]:bg-green-600"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Application Date</Label>
                        <p className="mt-1 p-2 bg-gray-50 rounded border">
                          {selectedProvider ? new Date(selectedProvider.createdAt).toLocaleDateString('en-AU') : 'N/A'}
                        </p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Documents Status</Label>
                        <Badge 
                          variant={selectedProvider?.documentsUploaded ? 'default' : 'destructive'}
                          className="mt-1"
                        >
                          {selectedProvider?.documentsUploaded ? 'Complete' : 'Missing'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Service Area Tab */}
              <TabsContent value="service-area" className="space-y-6">
                {/* Current Service Areas - View Only */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      Service Areas ({providerDetails?.serviceAreas?.length || 0})
                    </CardTitle>
                    <p className="text-sm text-gray-600">View provider's configured service areas</p>
                  </CardHeader>
                  <CardContent>
                    {isLoadingDetails ? (
                      <div className="text-center py-8">
                        <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-2 text-gray-500">Loading service areas...</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {providerDetails?.serviceAreas?.map((area: any) => (
                          <div 
                            key={area.id} 
                            className="p-4 border rounded-lg bg-white"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="h-4 w-4 text-green-600" />
                              <span className="font-medium">
                                {area.areaName || `Service Area ${area.id}`}
                              </span>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {area.radiusKm}km radius
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 ml-6">
                              {area.centerAddress}
                            </p>
                          </div>
                        )) || (
                          <div className="text-center py-8">
                            <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No service areas configured</p>
                            <p className="text-sm text-gray-400">Provider can configure service areas from their dashboard</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Provider Services</h3>
                  <p className="text-sm text-gray-600">Select or deselect service categories for this provider</p>
                  {isLoadingDetails ? (
                    <div className="text-center py-4">
                      <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                      <p className="mt-2 text-gray-500">Loading services...</p>
                    </div>
                  ) : (
                    <AdminServiceCategorySelector 
                      providerId={selectedProvider?.id}
                      currentServices={providerDetails?.services || []}
                      queryClient={queryClient}
                      onServicesUpdate={() => {
                        // Refresh provider details and activity logs
                        queryClient.invalidateQueries({ 
                          queryKey: ['/api/admin/providers', selectedProvider?.id, 'details'] 
                        });
                        queryClient.invalidateQueries({ 
                          queryKey: ['/api/admin/providers', selectedProvider?.id, 'activity'] 
                        });
                      }}
                    />
                  )}
                </div>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-6">
                <div className="space-y-4">
                  {!viewingDocument ? (
                    <>
                      <h3 className="text-lg font-semibold">Uploaded Documents</h3>
                      {isLoadingDetails ? (
                        <div className="text-center py-4">
                          <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                          <p className="mt-2 text-gray-500">Loading documents...</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {providerDetails?.documents?.map((doc: any) => (
                            <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 border rounded">
                              <div>
                                <p className="font-medium capitalize">{doc.documentType.replace('_', ' ')}</p>
                                <p className="text-sm text-gray-500">{doc.fileName}</p>
                                <p className="text-sm text-gray-400">
                                  Uploaded: {new Date(doc.uploadedAt).toLocaleDateString('en-AU')}
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm font-medium ${doc.status === 'approved' ? 'text-green-600' : 'text-orange-600'}`}>
                                    {doc.status === 'approved' ? 'Approved' : 'Pending'}
                                  </span>
                                  <Switch
                                    checked={doc.status === 'approved'}
                                    onCheckedChange={() => documentStatusMutation.mutate({ documentId: doc.id, status: doc.status === 'approved' ? 'pending' : 'approved' })}
                                    disabled={documentStatusMutation.isPending}
                                    className="data-[state=checked]:bg-green-600"
                                  />
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setViewingDocument(doc)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </div>
                            </div>
                          )) || (
                            <p className="text-center py-8 text-gray-500">No documents uploaded</p>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold capitalize">{viewingDocument.documentType.replace('_', ' ')}</h3>
                          <p className="text-sm text-gray-500">{viewingDocument.fileName}</p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setViewingDocument(null)}
                        >
                          ← Back to Documents
                        </Button>
                      </div>
                      <div className="border rounded-lg overflow-hidden bg-white" style={{ height: '500px' }}>
                        {viewingDocument.fileName.toLowerCase().endsWith('.pdf') ? (
                          <iframe
                            src={`/api/provider/documents/view/${viewingDocument.fileName}/${selectedProvider?.id}`}
                            className="w-full h-full border-0"
                            title={viewingDocument.fileName}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center p-4">
                            <img
                              src={`/api/provider/documents/view/${viewingDocument.fileName}/${selectedProvider?.id}`}
                              alt={viewingDocument.fileName}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Admin Notes</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="newNote" className="text-sm font-medium">Add New Note</Label>
                        <Textarea
                          id="newNote"
                          placeholder="Enter admin notes for this provider..."
                          className="mt-2"
                          rows={3}
                        />
                        <Button
                          size="sm"
                          onClick={() => {
                            if (!selectedProvider) return;
                            
                            const newNoteElement = document.getElementById('newNote') as HTMLTextAreaElement;
                            const newNoteValue = newNoteElement?.value?.trim();
                            
                            if (!newNoteValue) {
                              toast({
                                title: "No Note Added",
                                description: "Please enter a note before saving.",
                                variant: "destructive",
                              });
                              return;
                            }
                            
                            saveNotesMutation.mutate({
                              notes: newNoteValue,
                              insuranceExpiryDate: providerDetails?.insuranceExpiryDate,
                            });
                          }}
                          disabled={saveNotesMutation.isPending}
                          className="mt-2 bg-blue-600 hover:bg-blue-700"
                        >
                          {saveNotesMutation.isPending ? 'Saving...' : 'Save Note'}
                        </Button>
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

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Provider Activity History</h3>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <Select value={activityFilter} onValueChange={(value: 'all' | 'admin' | 'provider') => setActivityFilter(value)}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Filter by..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Activity</SelectItem>
                          <SelectItem value="admin">Admin Only</SelectItem>
                          <SelectItem value="provider">Provider Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {isLoadingActivity ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                      <p className="mt-2 text-gray-500">Loading activity...</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {activityLogs && activityLogs.length > 0 ? activityLogs.map((activity: any) => (
                        <div key={activity.id} className="p-4 border rounded-lg bg-white">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                  {activity.actorName}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {new Date(activity.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm mt-2 font-medium">{activity.description}</p>
                              
                              {(activity.oldValue || activity.newValue) && (
                                <div className="mt-3 space-y-1 text-xs">
                                  {activity.oldValue && (
                                    <div className="text-red-600">
                                      <span className="font-medium">Previous:</span> {activity.oldValue}
                                    </div>
                                  )}
                                  {activity.newValue && (
                                    <div className="text-green-600">
                                      <span className="font-medium">Updated:</span> {activity.newValue}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-6 text-gray-500">
                          No activity logs found for this provider.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}