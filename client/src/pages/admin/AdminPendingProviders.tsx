import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

// Admin API request function with authentication
const adminApiRequest = async (method: string, url: string, data?: any) => {
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

  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }
  
  return response;
};
import {
  Shield,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  User,
  MapPin,
  Briefcase,
  StickyNote,
  Plus,
  Trash2,
  Home,
  Wrench,
  Zap,
  Droplets,
  Car,
  Hammer,
  TreePine,
  Bug,
  Sparkles,
  Building,
  Clock,
  Filter
} from "lucide-react";

// Admin Service Category Selector Component
interface AdminServiceCategorySelectorProps {
  providerId: number | undefined;
  currentServices: any[];
  onServicesUpdate: () => void;
}

function AdminServiceCategorySelector({ 
  providerId, 
  currentServices = [], 
  onServicesUpdate 
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
        {allCategories.map((category: any) => {
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
            ? allCategories
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

// Service icons mapping - same as provider pages
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
  insuranceExpiryDate?: string;
  adminNotes?: string;
  services?: Array<{ id: number; name: string; categoryName: string }>;
  serviceAreas?: Array<{ id: number; suburb: string; postcode: string }>;
}

// Service Icon Grid Component
function ServiceIconGrid({ selectedServices, readOnly = false }: { 
  selectedServices: Array<{ id: number; name: string; categoryName: string }>; 
  readOnly?: boolean;
}) {
  // Debug logging
  console.log('ServiceIconGrid - selectedServices:', selectedServices);
  
  // All available service categories with icons
  const allCategories = [
    { id: 1, name: "Domestic Cleaning" },
    { id: 2, name: "Bond Cleaning" },
    { id: 3, name: "Carpet Cleaning" },
    { id: 4, name: "Pest Control" },
    { id: 5, name: "Gardening" },
    { id: 6, name: "Removals" },
    { id: 7, name: "Handyman" },
    { id: 8, name: "Electrical" },
    { id: 9, name: "Air Conditioning" },
    { id: 10, name: "Plumbing" },
  ];

  // Get selected service names for comparison - ensure unique values
  const selectedServiceNames = Array.from(new Set(selectedServices.map(service => service.categoryName || service.name)));
  console.log('ServiceIconGrid - selectedServiceNames:', selectedServiceNames);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-2">
        {allCategories.map((category) => {
          const IconComponent = serviceIcons[category.name as keyof typeof serviceIcons] || Home;
          const isSelected = selectedServiceNames.includes(category.name);
          
          return (
            <div
              key={category.id}
              className={`relative border-2 rounded-lg p-1.5 text-center transition-all duration-200 ${
                isSelected 
                  ? "border-primary bg-blue-50 shadow-md" 
                  : "border-gray-300"
              } ${readOnly ? "cursor-default" : "cursor-pointer hover:border-primary hover:shadow-sm"}`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto mb-1 ${
                isSelected ? "bg-primary text-white" : "bg-blue-100"
              }`}>
                <IconComponent className={`h-3 w-3 ${isSelected ? "text-white" : "text-primary"}`} />
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
      

    </div>
  );
}

export default function AdminPendingProviders() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [activityFilter, setActivityFilter] = useState<'all' | 'admin' | 'provider'>('all');
  const [newServiceArea, setNewServiceArea] = useState({ address: "", radius: 25 });
  const [viewingDocument, setViewingDocument] = useState<any>(null);
  const [autocompleteInitialized, setAutocompleteInitialized] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);

  // Activity logs query
  const { data: activityLogs, isLoading: isLoadingActivity } = useQuery({
    queryKey: ['/api/admin/providers', selectedProvider?.id, 'activity', activityFilter],
    queryFn: async () => {
      if (!selectedProvider) return [];
      const filterParam = activityFilter !== 'all' ? `?actorType=${activityFilter}` : '';
      const response = await adminApiRequest('GET', `/api/admin/providers/${selectedProvider.id}/activity${filterParam}`);
      return response.json();
    },
    enabled: !!selectedProvider && activeTab === 'activity',
  });

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin-login');
    }
  }, [navigate]);

  // Pending Providers Query
  const { data: pendingProviders, isLoading } = useQuery({
    queryKey: ['/api/admin/providers', 'pending'],
    queryFn: async () => {
      const response = await fetch('/api/admin/providers?status=pending', {
        headers: {
          'x-admin-token': localStorage.getItem('adminToken') || '',
        },
      });
      return response.json();
    },
  });

  // Fetch detailed provider information
  const { data: providerDetails, isLoading: loadingDetails } = useQuery({
    queryKey: ['/api/admin/providers', selectedProvider?.id],
    queryFn: async () => {
      if (!selectedProvider?.id) return null;
      const response = await fetch(`/api/admin/providers/${selectedProvider.id}/details`, {
        headers: {
          'x-admin-token': localStorage.getItem('adminToken') || '',
        },
      });
      return response.json();
    },
    enabled: !!selectedProvider?.id,
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
      setIsViewDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Action Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Simple Add Service Area Mutation - no blocking validation
  const addServiceAreaMutation = useMutation({
    mutationFn: async ({ providerId, address, radius }: { providerId: number; address: string; radius: number }) => {
      const response = await adminApiRequest('POST', `/api/admin/providers/${providerId}/service-areas`, {
        centerAddress: address,
        radiusKm: radius,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Service Area Added",
        description: "New service area has been added successfully.",
        variant: "default",
      });
      setNewServiceArea({ address: "", radius: 25 });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/providers', selectedProvider?.id] });
    },
    onError: (error) => {
      toast({
        title: "Failed to Add Service Area",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Remove Service Area Mutation
  const removeServiceAreaMutation = useMutation({
    mutationFn: async (areaId: number) => {
      const response = await adminApiRequest('DELETE', `/api/admin/service-areas/${areaId}`, {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Service Area Removed",
        description: "Service area has been removed successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/providers', selectedProvider?.id] });
    },
    onError: (error) => {
      toast({
        title: "Failed to Remove Service Area",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Save Provider Notes Mutation
  const saveNotesMutation = useMutation({
    mutationFn: async ({ providerId, adminNotes, insuranceExpiryDate }: { 
      providerId: number; 
      adminNotes: string; 
      insuranceExpiryDate?: string; 
    }) => {
      const response = await adminApiRequest('PUT', `/api/admin/providers/${providerId}/notes`, {
        adminNotes,
        insuranceExpiryDate,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Notes Saved",
        description: "Admin notes and insurance expiry date have been saved successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/providers', selectedProvider?.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/providers'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to Save Notes",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // State for autocomplete management
  const [autocompleteInstance, setAutocompleteInstance] = useState<any>(null);

  // Initialize autocomplete when dialog opens and Google Maps is available
  useEffect(() => {
    if (!isViewDialogOpen || !activeTab || activeTab !== 'service-area') {
      return;
    }

    const initAutocomplete = () => {
      if (!addressInputRef.current || !window.google?.maps?.places) {
        setTimeout(initAutocomplete, 100);
        return;
      }

      try {
        const autocomplete = new window.google.maps.places.Autocomplete(
          addressInputRef.current,
          {
            types: ['geocode'],
            componentRestrictions: { country: 'au' },
            fields: ['formatted_address']
          }
        );

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address) {
            setNewServiceArea(prev => ({
              ...prev,
              address: place.formatted_address
            }));
          }
        });

        console.log('Google Maps autocomplete initialized successfully');
      } catch (error) {
        console.error('Autocomplete initialization error:', error);
      }
    };

    const timer = setTimeout(initAutocomplete, 300);
    return () => clearTimeout(timer);
  }, [isViewDialogOpen, activeTab]);

  const handleAddServiceArea = () => {
    if (!selectedProvider?.id || !newServiceArea.address.trim()) {
      toast({
        title: "Missing Information", 
        description: "Please enter a valid address for the service area.",
        variant: "destructive",
      });
      return;
    }

    addServiceAreaMutation.mutate({
      providerId: selectedProvider.id,
      address: newServiceArea.address,
      radius: newServiceArea.radius,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  const handleViewProvider = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    setIsViewDialogOpen(true);
    setActiveTab("personal");
  };

  const handleSaveNotes = () => {
    if (!selectedProvider) return;
    
    const adminNotesElement = document.getElementById('adminNotes') as HTMLTextAreaElement;
    const insuranceExpiryElement = document.getElementById('insuranceExpiry') as HTMLInputElement;
    
    saveNotesMutation.mutate({
      providerId: selectedProvider.id,
      adminNotes: adminNotesElement?.value || '',
      insuranceExpiryDate: insuranceExpiryElement?.value || undefined,
    });
  };

  // Filter providers based on search term
  const filteredProviders = pendingProviders?.filter((provider: ServiceProvider) => {
    const matchesSearch = 
      provider.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

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
              <Shield className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Pending Providers
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Review and approve new service provider applications
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Provider Applications Awaiting Review</CardTitle>
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
                <Badge variant="outline" className="text-orange-600">
                  {filteredProviders?.length || 0} Pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading pending providers...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Provider</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Phone</th>
                        <th className="text-left p-3">Documents</th>
                        <th className="text-left p-3">Applied</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProviders?.map((provider: ServiceProvider) => (
                        <tr key={provider.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{provider.firstName} {provider.lastName}</p>
                              <p className="text-gray-500 text-xs">{provider.address}</p>
                            </div>
                          </td>
                          <td className="p-3">{provider.email}</td>
                          <td className="p-3">{provider.mobileNumber}</td>
                          <td className="p-3">
                            <Badge variant={provider.documentsUploaded ? "default" : "destructive"}>
                              {provider.documentsUploaded ? "Complete" : "Missing"}
                            </Badge>
                          </td>
                          <td className="p-3">
                            {new Date(provider.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-3">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewProvider(provider)}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="default"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => approveProviderMutation.mutate({ providerId: provider.id, action: 'approve' })}
                                disabled={approveProviderMutation.isPending}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => approveProviderMutation.mutate({ providerId: provider.id, action: 'reject' })}
                                disabled={approveProviderMutation.isPending}
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {(!filteredProviders || filteredProviders.length === 0) && !isLoading && (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-gray-500">
                            No pending provider applications found
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
      </div>

      {/* Provider Review Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Provider Application Review - {selectedProvider?.firstName} {selectedProvider?.lastName}
            </DialogTitle>
          </DialogHeader>

          {selectedProvider && (
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
              <TabsContent value="personal" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label className="text-sm font-medium">First Name</Label>
                        <p className="mt-1 p-2 bg-gray-50 rounded border">{selectedProvider.firstName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Last Name</Label>
                        <p className="mt-1 p-2 bg-gray-50 rounded border">{selectedProvider.lastName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Email Address</Label>
                        <p className="mt-1 p-2 bg-gray-50 rounded border">{selectedProvider.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Mobile Number</Label>
                        <p className="mt-1 p-2 bg-gray-50 rounded border">{selectedProvider.mobileNumber}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Address</Label>
                        <p className="mt-1 p-2 bg-gray-50 rounded border">{selectedProvider.address}</p>
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
                          defaultValue={selectedProvider.insuranceExpiryDate ? 
                            new Date(selectedProvider.insuranceExpiryDate).toISOString().split('T')[0] : ''}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Application Status</Label>
                        <Badge 
                          variant={selectedProvider.status === 'pending' ? 'outline' : 
                                  selectedProvider.status === 'approved' ? 'default' : 'destructive'}
                          className="mt-1 capitalize"
                        >
                          {selectedProvider.status}
                        </Badge>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Application Date</Label>
                        <p className="mt-1 p-2 bg-gray-50 rounded border">
                          {new Date(selectedProvider.createdAt).toLocaleDateString('en-AU')}
                        </p>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Documents Status</Label>
                        <Badge 
                          variant={selectedProvider.documentsUploaded ? 'default' : 'destructive'}
                          className="mt-1"
                        >
                          {selectedProvider.documentsUploaded ? 'Complete' : 'Missing'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Service Area Tab */}
              <TabsContent value="service-area" className="space-y-6">
                {/* Add Service Area Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5 text-green-600" />
                      Add New Service Area
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="newAddress" className="text-sm font-medium">Service Location Address *</Label>
                        <Input
                          id="newAddress"
                          ref={addressInputRef}
                          placeholder="Enter full address (e.g., 123 Main St, Brisbane QLD 4000)"
                          value={newServiceArea.address}
                          onChange={(e) => setNewServiceArea(prev => ({ ...prev, address: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              e.stopPropagation();
                            }
                          }}
                          className="mt-1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newRadius" className="text-sm font-medium">Service Radius (km) *</Label>
                        <Input
                          id="newRadius"
                          type="number"
                          min="1"
                          max="100"
                          placeholder="25"
                          value={newServiceArea.radius}
                          onChange={(e) => setNewServiceArea(prev => ({ ...prev, radius: parseInt(e.target.value) || 25 }))}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="button"
                      onClick={handleAddServiceArea}
                      disabled={!newServiceArea.address.trim() || addServiceAreaMutation.isPending}
                      className="w-full bg-green-600 hover:bg-green-700 mt-4"
                    >
                      {addServiceAreaMutation.isPending ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Service Area
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Current Service Areas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      Current Service Areas ({providerDetails?.serviceAreas?.length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingDetails ? (
                      <div className="text-center py-8">
                        <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-2 text-gray-500">Loading service areas...</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {providerDetails?.serviceAreas?.map((area: any) => (
                          <div 
                            key={area.id} 
                            className="flex items-center justify-between p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow"
                          >
                            <div className="flex-1">
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
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeServiceAreaMutation.mutate(area.id)}
                              disabled={removeServiceAreaMutation.isPending}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )) || (
                          <div className="text-center py-8">
                            <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No service areas configured</p>
                            <p className="text-sm text-gray-400">Add a service area to get started</p>
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
                  {loadingDetails ? (
                    <div className="text-center py-4">
                      <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                      <p className="mt-2 text-gray-500">Loading services...</p>
                    </div>
                  ) : (
                    <AdminServiceCategorySelector 
                      providerId={selectedProvider?.id}
                      currentServices={providerDetails?.services || []}
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
                      {loadingDetails ? (
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
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant={doc.status === 'approved' ? 'default' : 
                                          doc.status === 'rejected' ? 'destructive' : 'outline'}
                                  className="capitalize"
                                >
                                  {doc.status}
                                </Badge>
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
                            src={`/api/provider/documents/view/${viewingDocument.fileName}/${selectedProvider.id}`}
                            className="w-full h-full border-0"
                            title={viewingDocument.fileName}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center p-4">
                            <img
                              src={`/api/provider/documents/view/${viewingDocument.fileName}/${selectedProvider.id}`}
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
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Admin Notes</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="adminNotes" className="text-sm font-medium">
                        Internal Notes (visible to admin only)
                      </Label>
                      <Textarea
                        id="adminNotes"
                        placeholder="Add internal notes about this provider application..."
                        defaultValue={selectedProvider.adminNotes || ''}
                        className="mt-1 min-h-[120px]"
                      />
                    </div>
                    <Button 
                      className="w-full"
                      onClick={handleSaveNotes}
                      disabled={saveNotesMutation.isPending}
                    >
                      <StickyNote className="h-4 w-4 mr-2" />
                      {saveNotesMutation.isPending ? 'Saving Notes...' : 'Save Notes'}
                    </Button>
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
                    <div className="text-center py-6 text-gray-500">Loading activity logs...</div>
                  ) : activityLogs && activityLogs.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {activityLogs.map((activity: any, index: number) => (
                        <div key={activity.id || index} className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant={activity.actorType === 'admin' ? 'default' : 'outline'}>
                                {activity.actorType === 'admin' ? 'Admin' : 'Provider'}
                              </Badge>
                              <span className="text-sm font-medium">{activity.actorName}</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(activity.timestamp).toLocaleString('en-AU')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{activity.description}</p>
                          {(activity.oldValue || activity.newValue) && (
                            <div className="text-xs space-y-1">
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
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No activity logs found for this provider.
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Action buttons at the bottom of dialog */}
              <div className="flex items-center justify-between pt-6 border-t">
                <div className="flex space-x-3">
                  <Button
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => approveProviderMutation.mutate({ providerId: selectedProvider.id, action: 'approve' })}
                    disabled={approveProviderMutation.isPending}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {approveProviderMutation.isPending ? 'Approving...' : 'Approve Provider'}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => approveProviderMutation.mutate({ providerId: selectedProvider.id, action: 'reject' })}
                    disabled={approveProviderMutation.isPending}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    {approveProviderMutation.isPending ? 'Rejecting...' : 'Reject Provider'}
                  </Button>
                </div>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}