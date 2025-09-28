import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Upload,
  Download,
  Filter,
  Plus,
  Trash2,
  X,
  User,
  UserPlus,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  Send,
  Database,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";

interface PotentialCustomer {
  id: number;
  name: string;
  email: string;
  phone: string;
  state: string;
  city: string;
  address: string;
  importId: string;
  importName: string;
  smsDeliveryStatus: 'not_sent' | '1st_sent' | '2nd_sent';
  firstSmsSentAt?: string;
  secondSmsSentAt?: string;
  createdAt: string;
}

interface ImportGroup {
  importId: string;
  importName: string;
  count: number;
  createdAt: string;
  smsDeliveryStatus: string;
}

interface AustralianRegion {
  id: number;
  name: string;
  code: string;
  stateId: number;
}

interface AustralianState {
  id: number;
  name: string;
  abbreviation: string;
}

interface SMSCampaign {
  id: number;
  name: string;
  message: string;
  voucherCode?: string;
  voucherAmount?: number;
  selectedStates: string[];
  selectedRegions: number[];
  selectedStatuses: string[];
  scheduledAt?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  totalSent: number;
  createdAt: string;
  sentAt?: string;
}

export default function AdminPotentialCustomers() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for import dialog
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importName, setImportName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImportId, setSelectedImportId] = useState<string>("all");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedCustomerStatus, setSelectedCustomerStatus] = useState<string>("all");
  const [selectedRegionId, setSelectedRegionId] = useState<string>("all");
  
  // State for SMS sending
  const [isSmsDialogOpen, setIsSmsDialogOpen] = useState(false);
  const [selectedCustomersForSms, setSelectedCustomersForSms] = useState<PotentialCustomer[]>([]);
  
  // State for SMS Campaigns
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);
  const [isEditCampaignDialogOpen, setIsEditCampaignDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<SMSCampaign | null>(null);
  const [campaigns, setCampaigns] = useState<SMSCampaign[]>([]);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    message: '',
    voucherCode: '',
    voucherAmount: 0,
    selectedStates: [] as string[],
    selectedRegions: [] as number[],
    selectedStatuses: [] as string[],
    scheduledAt: '',
  });
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState<'pagination' | 'loadMore'>('pagination');
  const [loadedCount, setLoadedCount] = useState(10);

  // Local status state per customer (UI only for now)
  const [customerStatusMap, setCustomerStatusMap] = useState<Record<number, string>>({});

  const setCustomerStatus = (customerId: number, status: string) => {
    setCustomerStatusMap(prev => ({ ...prev, [customerId]: status }));
  };

  // List/Kanban toggle for customer list
  const [customerListView, setCustomerListView] = useState<'list' | 'kanban'>('list');

  const CUSTOMER_STATUSES: { id: string; title: string; color: string }[] = [
    { id: 'New', title: 'New', color: 'bg-gray-100' },
    { id: 'Added to Campaign', title: 'Added to Campaign', color: 'bg-blue-100' },
    { id: 'SMS Sent', title: 'SMS Sent', color: 'bg-indigo-100' },
    { id: '2nd SMS', title: '2nd SMS', color: 'bg-yellow-100' },
    { id: '3rd Sent', title: '3rd Sent', color: 'bg-purple-100' },
    { id: 'Lost', title: 'Lost', color: 'bg-red-100' },
    { id: 'Won', title: 'Won', color: 'bg-green-100' },
    { id: 'Unsubscribe', title: 'Unsubscribe', color: 'bg-slate-200' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setLocation('/admin-login');
  };

  // Fetch potential customers
  const { data: potentialCustomers = [], isLoading } = useQuery({
    queryKey: ['/api/admin/potential-customers'],
    queryFn: async () => {
      const response = await adminApiRequest('GET', '/api/admin/potential-customers');
      return response.json();
    },
  });

  // Fetch import groups
  const { data: importGroups = [] } = useQuery({
    queryKey: ['/api/admin/potential-customers/import-groups'],
    queryFn: async () => {
      const response = await adminApiRequest('GET', '/api/admin/potential-customers/import-groups');
      return response.json();
    },
  });

  // Derived unique states for filter dropdown
  const uniqueStates = React.useMemo(() => {
    return Array.from(new Set(potentialCustomers.map((c: PotentialCustomer) => c.state))) as string[];
  }, [potentialCustomers]);

  // Fetch Australian states (master list)
  const { data: allStates = [] } = useQuery<AustralianState[]>({
    queryKey: ['/api/australian-states'],
    queryFn: async () => {
      const resp = await adminApiRequest('GET', '/api/australian-states');
      return resp.json();
    },
  });

  // Fetch Australian regions (SA4)
  const { data: allRegions = [] } = useQuery<AustralianRegion[]>({
    queryKey: ['/api/regions'],
    queryFn: async () => {
      const resp = await adminApiRequest('GET', '/api/regions');
      return resp.json();
    },
  });

  // Regions filtered by selected state (if selected)
  const displayRegions = React.useMemo(() => {
    if (selectedState === 'all') return allRegions as AustralianRegion[];
    const stateRecord = (allStates as AustralianState[]).find(s => s.name === selectedState || s.abbreviation === selectedState);
    if (!stateRecord) return allRegions as AustralianRegion[];
    return (allRegions as AustralianRegion[]).filter(r => r.stateId === stateRecord.id);
  }, [allRegions, allStates, selectedState]);

  // Import customers mutation
  const importCustomersMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await adminApiRequest('POST', '/api/admin/potential-customers/import', formData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Import Successful",
        description: `Successfully imported ${data.count} potential customers.`,
      });
      setIsImportDialogOpen(false);
      setImportName("");
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/potential-customers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/potential-customers/import-groups'] });
    },
    onError: (error: any) => {
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import customers",
        variant: "destructive",
      });
    },
  });

  // Send SMS mutation
  const sendSmsMutation = useMutation({
    mutationFn: async (customerIds: number[]) => {
      console.log("Sending SMS to customer IDs:", customerIds);  // 👈 log before request
      const response = await adminApiRequest(
        'POST', 
        '/api/admin/potential-customers/send-sms', 
        { customerIds }
      );
      console.log("Raw Response 1:", response); // 👈 log full response
      return response.json();
    },
    onSuccess: (data) => {
      console.log("SMS Success Response1:", data); // 👈 log parsed data
      if (data?.details) {
        console.table(data.details);
      }
      toast({
        title: "SMS Sent",
        description: `Attempted: ${data.details?.length ?? 0}, Success: ${data.count}`,
      });
      setIsSmsDialogOpen(false);
      setSelectedCustomersForSms([]);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/potential-customers'] });
    },
    onError: (error: any) => {
      console.error("SMS Error:", error); // 👈 log error details
      toast({
        title: "SMS Failed",
        description: error.message || "Failed to send SMS",
        variant: "destructive",
      });
    },
  });
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = async () => {
    if (!selectedFile || !importName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a file and enter an import name.",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('importName', importName);

    try {
      await importCustomersMutation.mutateAsync(formData);
    } finally {
      setIsImporting(false);
    }
  };

  const handleSendSms = async () => {
    
    if (selectedCustomersForSms.length === 0) {
      toast({
        title: "No Customers Selected",
        description: "Please select customers to send SMS to.",
        variant: "destructive",
      });
      return;
    }

    const customerIds = selectedCustomersForSms.map(customer => customer.id);
    await sendSmsMutation.mutateAsync(customerIds);
  };

  // Campaign management functions
  const generateVoucherCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateCampaign = () => {
    if (!newCampaign.name.trim() || !newCampaign.message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in campaign name and message.",
        variant: "destructive",
      });
      return;
    }

    const campaign: SMSCampaign = {
      id: Date.now(),
      name: newCampaign.name,
      message: newCampaign.message,
      voucherCode: newCampaign.voucherCode || undefined,
      voucherAmount: newCampaign.voucherAmount || undefined,
      selectedStates: newCampaign.selectedStates,
      selectedRegions: newCampaign.selectedRegions,
      selectedStatuses: newCampaign.selectedStatuses,
      scheduledAt: newCampaign.scheduledAt || undefined,
      status: newCampaign.scheduledAt ? 'scheduled' : 'draft',
      totalSent: 0,
      createdAt: new Date().toISOString(),
    };

    setCampaigns(prev => [campaign, ...prev]);
    setNewCampaign({
      name: '',
      message: '',
      voucherCode: '',
      voucherAmount: 0,
      selectedStates: [],
      selectedRegions: [],
      selectedStatuses: [],
      scheduledAt: '',
    });
    setIsCampaignDialogOpen(false);
    
    toast({
      title: "Campaign Created",
      description: "SMS campaign has been created successfully.",
    });
  };

  const handleEditCampaign = (campaign: SMSCampaign) => {
    if (campaign.status === 'sent') {
      toast({
        title: "Cannot Edit",
        description: "Sent campaigns cannot be edited. Create a duplicate instead.",
        variant: "destructive",
      });
      return;
    }
    setEditingCampaign(campaign);
    setNewCampaign({
      name: campaign.name,
      message: campaign.message,
      voucherCode: campaign.voucherCode || '',
      voucherAmount: campaign.voucherAmount || 0,
      selectedStates: campaign.selectedStates,
      selectedRegions: campaign.selectedRegions,
      selectedStatuses: campaign.selectedStatuses,
      scheduledAt: campaign.scheduledAt || '',
    });
    setIsEditCampaignDialogOpen(true);
  };

  const handleUpdateCampaign = () => {
    if (!editingCampaign) return;

    const updatedCampaigns = campaigns.map(c => 
      c.id === editingCampaign.id 
        ? {
            ...c,
            name: newCampaign.name,
            message: newCampaign.message,
            voucherCode: newCampaign.voucherCode || undefined,
            voucherAmount: newCampaign.voucherAmount || undefined,
            selectedStates: newCampaign.selectedStates,
            selectedRegions: newCampaign.selectedRegions,
            selectedStatuses: newCampaign.selectedStatuses,
            scheduledAt: newCampaign.scheduledAt || undefined,
            status: newCampaign.scheduledAt ? 'scheduled' as const : 'draft' as const,
          }
        : c
    );
    
    setCampaigns(updatedCampaigns);
    setIsEditCampaignDialogOpen(false);
    setEditingCampaign(null);
    
    toast({
      title: "Campaign Updated",
      description: "SMS campaign has been updated successfully.",
    });
  };

  const handleDuplicateCampaign = (campaign: SMSCampaign) => {
    const duplicatedCampaign: SMSCampaign = {
      ...campaign,
      id: Date.now(),
      name: `${campaign.name} (Copy)`,
      status: 'draft',
      totalSent: 0,
      createdAt: new Date().toISOString(),
      sentAt: undefined,
    };
    
    setCampaigns(prev => [duplicatedCampaign, ...prev]);
    
    toast({
      title: "Campaign Duplicated",
      description: "SMS campaign has been duplicated successfully.",
    });
  };



  const getSmsStatusBadge = (status: string) => {
    switch (status) {
      case 'not_sent':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Not Sent</Badge>;
      case '1st_sent':
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="h-3 w-3 mr-1" />1st SMS Sent</Badge>;
      case '2nd_sent':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />2nd SMS Sent</Badge>;
      default:
        return <Badge variant="secondary"><AlertCircle className="h-3 w-3 mr-1" />Unknown</Badge>;
    }
  };

  const filteredCustomers = potentialCustomers.filter((customer: PotentialCustomer) => {
    const matchesSearch = !searchTerm || customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesImportId = selectedImportId === "all" || customer.importId === selectedImportId;
    const matchesState = selectedState === "all" || customer.state === selectedState;
    const currentStatus = customerStatusMap[customer.id] ?? 'New';
    const matchesCustomerStatus = selectedCustomerStatus === 'all' || currentStatus === selectedCustomerStatus;
    
    return matchesSearch && matchesImportId && matchesState && matchesCustomerStatus;
  });

  // Pagination logic
  const totalCustomers = filteredCustomers.length;
  const totalPages = Math.ceil(totalCustomers / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  // Handle both pagination and load more modes
  const displayedCustomers = viewMode === 'pagination' 
    ? filteredCustomers.slice(startIndex, endIndex)
    : filteredCustomers.slice(0, loadedCount);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
    setLoadedCount(10);
  }, [searchTerm, selectedImportId, selectedState, selectedCustomerStatus]);

  // Sync tabs with route
  const currentTab: 'list' | 'imports' | 'sms' = React.useMemo(() => {
    if (location.startsWith('/admin/potential-customers/imports')) return 'imports';
    if (location.startsWith('/admin/potential-customers/sms')) return 'sms';
    return 'list';
  }, [location]);

  const handleTabChange = (value: string) => {
    if (value === 'imports') setLocation('/admin/potential-customers/imports');
    else if (value === 'sms') setLocation('/admin/potential-customers/sms');
    else setLocation('/admin/potential-customers');
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
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <UserPlus className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Potential Customers
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Import and manage potential customer data
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {/* Move Import button into Imports page; keep header clean */}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
            {/* Tabs are now hidden - navigation via sidebar */}

            <TabsContent value="list" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div>
                      <Label htmlFor="search">Search</Label>
                      <Input
                        id="search"
                        placeholder="Search by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="import-group">Import Group</Label>
                      <Select value={selectedImportId} onValueChange={setSelectedImportId}>
                        <SelectTrigger>
                          <SelectValue placeholder="All import groups" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All import groups</SelectItem>
                          {importGroups.map((group: ImportGroup) => (
                            <SelectItem key={group.importId} value={group.importId}>
                              {group.importName} ({group.count})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Select value={selectedState} onValueChange={setSelectedState}>
                        <SelectTrigger>
                          <SelectValue placeholder="All states" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All states</SelectItem>
                          {uniqueStates.map((state: string) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="region">Region</Label>
                      <Select value={selectedRegionId} onValueChange={setSelectedRegionId} disabled={selectedState === 'all'}>
                        <SelectTrigger>
                          <SelectValue placeholder="All regions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All regions</SelectItem>
                          {displayRegions.map((r: AustralianRegion) => (
                            <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="customer-status">Customer Status</Label>
                      <Select value={selectedCustomerStatus} onValueChange={setSelectedCustomerStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All statuses</SelectItem>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Added to Campaign">Added to Campaign</SelectItem>
                          <SelectItem value="SMS Sent">SMS Sent</SelectItem>
                          <SelectItem value="2nd SMS">2nd SMS</SelectItem>
                          <SelectItem value="3rd Sent">3rd Sent</SelectItem>
                          <SelectItem value="Lost">Lost</SelectItem>
                          <SelectItem value="Won">Won</SelectItem>
                          <SelectItem value="Unsubscribe">Unsubscribe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedImportId("all");
                          setSelectedState("all");
                          setSelectedCustomerStatus("all");
                          setSelectedRegionId("all");
                        }}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer List / Kanban */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Potential Customers ({filteredCustomers.length})</CardTitle>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">View:</Label>
                      <Select value={customerListView} onValueChange={(v) => setCustomerListView(v as 'list' | 'kanban')}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="list">List</SelectItem>
                          <SelectItem value="kanban">Kanban</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <CardDescription>
                    Imported customer data with SMS delivery status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="text-gray-500 mt-2">Loading customers...</p>
                    </div>
                  ) : filteredCustomers.length === 0 ? (
                    <div className="text-center py-8">
                      <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Customers Found</h3>
                      <p className="text-gray-500">Import customer data to get started.</p>
                    </div>
                  ) : (
                    <div>
                      {customerListView === 'list' ? (
                        <>
                          <div className="space-y-4">
                            {displayedCustomers.map((customer: PotentialCustomer) => (
                              <div key={customer.id} className="border rounded-lg p-4 bg-white">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h3 className="font-semibold text-lg">{customer.name}</h3>
                                      {getSmsStatusBadge(customer.smsDeliveryStatus)}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                      <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        <span>{customer.email}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        <span>{customer.phone}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>{customer.city}, {customer.state}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Database className="h-4 w-4" />
                                        <span>{customer.importName}</span>
                                      </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                      Imported: {new Date(customer.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                      <Label className="text-sm whitespace-nowrap">Customer Status</Label>
                                      <Select
                                        value={customerStatusMap[customer.id] ?? 'New'}
                                        onValueChange={(value) => setCustomerStatus(customer.id, value)}
                                      >
                                        <SelectTrigger className="w-56">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="New">New</SelectItem>
                                          <SelectItem value="Added to Campaign">Added to Campaign</SelectItem>
                                          <SelectItem value="SMS Sent">SMS Sent</SelectItem>
                                          <SelectItem value="2nd SMS">2nd SMS</SelectItem>
                                          <SelectItem value="3rd Sent">3rd Sent</SelectItem>
                                          <SelectItem value="Lost">Lost</SelectItem>
                                          <SelectItem value="Won">Won</SelectItem>
                                          <SelectItem value="Unsubscribe">Unsubscribe</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedCustomersForSms([customer]);
                                        setIsSmsDialogOpen(true);
                                      }}
                                      disabled={customer.smsDeliveryStatus === '2nd_sent'}
                                    >
                                      <Send className="h-4 w-4 mr-2" />
                                      Send SMS
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* View Mode Toggle */}
                          <div className="flex items-center justify-between mt-6">
                            <div className="flex items-center gap-2">
                              <Label className="text-sm">View Mode:</Label>
                              <Select value={viewMode} onValueChange={(value: 'pagination' | 'loadMore') => {
                                setViewMode(value);
                                setCurrentPage(1);
                                setLoadedCount(10);
                              }}>
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pagination">Pagination</SelectItem>
                                  <SelectItem value="loadMore">Load More</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>
                                Showing {viewMode === 'pagination' 
                                  ? `${startIndex + 1}-${Math.min(endIndex, totalCustomers)}` 
                                  : `1-${Math.min(loadedCount, totalCustomers)}`
                                } of {totalCustomers} customers
                              </span>
                            </div>
                          </div>

                          {/* Pagination Controls */}
                          {viewMode === 'pagination' && totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setCurrentPage(currentPage - 1)}
                                  disabled={currentPage === 1}
                                >
                                  <ChevronLeft className="h-4 w-4 mr-1" />
                                  Previous
                                </Button>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                      pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                      pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                      pageNum = totalPages - 4 + i;
                                    } else {
                                      pageNum = currentPage - 2 + i;
                                    }
                                    
                                    return (
                                      <Button
                                        key={pageNum}
                                        variant={currentPage === pageNum ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setCurrentPage(pageNum)}
                                        className="w-8 h-8 p-0"
                                      >
                                        {pageNum}
                                      </Button>
                                    );
                                  })}
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setCurrentPage(currentPage + 1)}
                                  disabled={currentPage === totalPages}
                                >
                                  Next
                                  <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-2">
                                <Label htmlFor="page-size" className="text-sm">Show:</Label>
                                <Select value={pageSize.toString()} onValueChange={(value) => {
                                  setPageSize(parseInt(value));
                                  setCurrentPage(1);
                                }}>
                                  <SelectTrigger className="w-20">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}

                          {/* Load More Controls */}
                          {viewMode === 'loadMore' && loadedCount < totalCustomers && (
                            <div className="flex items-center justify-center mt-4">
                              <Button
                                variant="outline"
                                onClick={() => setLoadedCount(prev => Math.min(prev + 10, totalCustomers))}
                              >
                                Load More ({Math.min(10, totalCustomers - loadedCount)} more)
                              </Button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="overflow-x-auto">
                          <div className="flex gap-6 min-w-max pr-2">
                            {(CUSTOMER_STATUSES).map((column) => {
                              const columnCustomers = filteredCustomers.filter((c: PotentialCustomer) => (customerStatusMap[c.id] ?? 'New') === column.id);
                              return (
                                <div key={column.id} className="space-y-3 w-80 flex-shrink-0">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">{column.title}</h3>
                                    <Badge variant="secondary">{columnCustomers.length}</Badge>
                                  </div>
                                  <div
                                    className={"min-h-[400px] max-h-[600px] p-3 rounded-xl " + column.color + " border border-gray-200 overflow-hidden"}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      const idStr = e.dataTransfer.getData('text/plain');
                                      const cid = parseInt(idStr);
                                      if (!isNaN(cid)) {
                                        setCustomerStatus(cid, column.id);
                                      }
                                    }}
                                  >
                                    <div className="space-y-3 max-h-[560px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e0 #f1f5f9' }}>
                                      {columnCustomers.map((customer: PotentialCustomer) => (
                                        <div
                                          key={customer.id}
                                          className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md transition cursor-move"
                                          draggable
                                          onDragStart={(e) => {
                                            e.dataTransfer.setData('text/plain', customer.id.toString());
                                          }}
                                        >
                                          <div className="flex items-start justify-between">
                                            <div className="min-w-0">
                                              <h4 className="font-semibold text-gray-900 truncate">{customer.name}</h4>
                                              <div className="mt-1 text-sm text-gray-600 space-y-1">
                                                <div className="flex items-center gap-2"><Mail className="h-4 w-4" /><span className="truncate">{customer.email}</span></div>
                                                <div className="flex items-center gap-2"><Phone className="h-4 w-4" /><span>{customer.phone}</span></div>
                                                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{customer.city}, {customer.state}</span></div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="imports" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <CardTitle>Import Groups</CardTitle>
                      <CardDescription>
                        Overview of imported customer batches
                      </CardDescription>
                    </div>
                    <div className="mt-2">
                      <Button onClick={() => setIsImportDialogOpen(true)} className="whitespace-nowrap">
                        <Upload className="h-4 w-4 mr-2" />
                        Import Customers
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {importGroups.length === 0 ? (
                    <div className="text-center py-8">
                      <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Import Groups</h3>
                      <p className="text-gray-500">Import customer data to see groups here.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {importGroups.map((group: ImportGroup) => (
                        <div key={group.importId} className="border rounded-lg p-4 bg-white">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{group.importName}</h3>
                              <p className="text-sm text-gray-600">Import ID: {group.importId}</p>
                              <p className="text-sm text-gray-500">
                                {group.count} customers • Imported {new Date(group.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {getSmsStatusBadge(group.smsDeliveryStatus)}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const groupCustomers = potentialCustomers.filter((c: PotentialCustomer) => c.importId === group.importId);
                                  setSelectedCustomersForSms(groupCustomers);
                                  setIsSmsDialogOpen(true);
                                }}
                              >
                                <Send className="h-4 w-4 mr-2" />
                                Send SMS to Group
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sms" className="space-y-6">
              {/* SMS Campaigns Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>SMS Campaigns</CardTitle>
                      <CardDescription>
                        Create and manage SMS campaigns for potential customers
                      </CardDescription>
                    </div>
                    <Button onClick={() => setIsCampaignDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Campaign
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-yellow-600" />
                        <h3 className="font-semibold">Draft</h3>
                      </div>
                      <p className="text-2xl font-bold text-yellow-600">
                        {campaigns.filter(c => c.status === 'draft').length}
                      </p>
                      <p className="text-sm text-gray-500">Campaigns</p>
                    </div>
                    <div className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold">Scheduled</h3>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">
                        {campaigns.filter(c => c.status === 'scheduled').length}
                      </p>
                      <p className="text-sm text-gray-500">Campaigns</p>
                    </div>
                    <div className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold">Sent</h3>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        {campaigns.filter(c => c.status === 'sent').length}
                      </p>
                      <p className="text-sm text-gray-500">Campaigns</p>
                    </div>
                    <div className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <h3 className="font-semibold">Failed</h3>
                      </div>
                      <p className="text-2xl font-bold text-red-600">
                        {campaigns.filter(c => c.status === 'failed').length}
                      </p>
                      <p className="text-sm text-gray-500">Campaigns</p>
                    </div>
                  </div>

                  {/* View Campaigns Table */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">View Campaigns</h3>
                    {campaigns.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Campaigns</h3>
                        <p className="text-gray-500">Create your first SMS campaign to get started.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-200 px-4 py-2 text-left">Campaign Name</th>
                              <th className="border border-gray-200 px-4 py-2 text-left">Date Created</th>
                              <th className="border border-gray-200 px-4 py-2 text-left">Total Sent</th>
                              <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
                              <th className="border border-gray-200 px-4 py-2 text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {campaigns.map((campaign) => (
                              <tr key={campaign.id}>
                                <td className="border border-gray-200 px-4 py-2">
                                  <div>
                                    <div className="font-medium">{campaign.name}</div>
                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                      {campaign.message.substring(0, 50)}...
                                    </div>
                                  </div>
                                </td>
                                <td className="border border-gray-200 px-4 py-2">
                                  {new Date(campaign.createdAt).toLocaleDateString()}
                                </td>
                                <td className="border border-gray-200 px-4 py-2">
                                  {campaign.totalSent}
                                </td>
                                <td className="border border-gray-200 px-4 py-2">
                                  <Badge 
                                    variant={
                                      campaign.status === 'sent' ? 'default' :
                                      campaign.status === 'scheduled' ? 'secondary' :
                                      campaign.status === 'failed' ? 'destructive' : 'outline'
                                    }
                                  >
                                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                  </Badge>
                                </td>
                                <td className="border border-gray-200 px-4 py-2">
                                  <div className="flex gap-2">
                                    {campaign.status !== 'sent' ? (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEditCampaign(campaign)}
                                      >
                                        Edit
                                      </Button>
                                    ) : null}
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDuplicateCampaign(campaign)}
                                    >
                                      Duplicate
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Potential Customers</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="import-name">Import Name</Label>
              <Input
                id="import-name"
                placeholder="e.g., QLD Campaign March 2024"
                value={importName}
                onChange={(e) => setImportName(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                This name will help identify this batch of imported customers
              </p>
            </div>
            <div>
              <Label htmlFor="file">CSV/Excel File</Label>
              <Input
                id="file"
                type="file"
                accept=".csv,.xlsx,.xls"
                ref={fileInputRef}
                onChange={handleFileSelect}
              />
              <p className="text-xs text-gray-500 mt-1">
                File must contain: Name, Email, Phone, State, City, Address
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleImport} disabled={isImporting || !selectedFile || !importName.trim()}>
                {isImporting ? "Importing..." : "Import Customers"}
              </Button>
              <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* SMS Dialog */}
      <Dialog open={isSmsDialogOpen} onOpenChange={setIsSmsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send SMS to Customers</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">
                Send SMS to {selectedCustomersForSms.length} selected customer{selectedCustomersForSms.length !== 1 ? 's' : ''}
              </p>
              <div className="mt-2 max-h-40 overflow-y-auto">
                {selectedCustomersForSms.map((customer) => (
                  <div key={customer.id} className="text-sm py-1 border-b">
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-gray-500">{customer.phone}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSendSms} disabled={sendSmsMutation.isPending}>
                {sendSmsMutation.isPending ? "Sending..." : "Send SMS"}
              </Button>
              <Button variant="outline" onClick={() => setIsSmsDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Campaign Dialog */}
      <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input
                  id="campaign-name"
                  placeholder="e.g., QLD Launch Campaign"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="scheduled-at">Schedule Date & Time (Optional)</Label>
                <Input
                  id="scheduled-at"
                  type="datetime-local"
                  value={newCampaign.scheduledAt}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, scheduledAt: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="campaign-message">SMS Message</Label>
              <textarea
                id="campaign-message"
                className="w-full p-3 border border-gray-300 rounded-md resize-none"
                rows={4}
                placeholder="Hello Welcome to ServicePanda your friendly Service Provider app, click here to download the app https://tinurl/123 as per our first launch, here is a $30 voucher for your first job with us. Voucher 'XYZ123'. If you do not wish to receive any sms, please reply STOP"
                value={newCampaign.message}
                onChange={(e) => setNewCampaign(prev => ({ ...prev, message: e.target.value }))}
              />
              <p className="text-xs text-gray-500 mt-1">
                Include "reply STOP" to unsubscribe option
              </p>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium mb-3">Voucher Settings (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="voucher-code">Voucher Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="voucher-code"
                      placeholder="XYZ123"
                      value={newCampaign.voucherCode}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, voucherCode: e.target.value }))}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setNewCampaign(prev => ({ ...prev, voucherCode: generateVoucherCode() }))}
                    >
                      Generate
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="voucher-amount">Voucher Amount ($)</Label>
                  <Input
                    id="voucher-amount"
                    type="number"
                    placeholder="30"
                    value={newCampaign.voucherAmount}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, voucherAmount: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Target Audience</h4>
              
              <div>
                <Label>States (Multi-select)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto border rounded p-2">
                  {uniqueStates.map((state) => (
                    <label key={state} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newCampaign.selectedStates.includes(state)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewCampaign(prev => ({
                              ...prev,
                              selectedStates: [...prev.selectedStates, state]
                            }));
                          } else {
                            setNewCampaign(prev => ({
                              ...prev,
                              selectedStates: prev.selectedStates.filter(s => s !== state)
                            }));
                          }
                        }}
                      />
                      <span className="text-sm">{state}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label>Regions (Multi-select)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto border rounded p-2">
                  {displayRegions.map((region) => (
                    <label key={region.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newCampaign.selectedRegions.includes(region.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewCampaign(prev => ({
                              ...prev,
                              selectedRegions: [...prev.selectedRegions, region.id]
                            }));
                          } else {
                            setNewCampaign(prev => ({
                              ...prev,
                              selectedRegions: prev.selectedRegions.filter(r => r !== region.id)
                            }));
                          }
                        }}
                      />
                      <span className="text-sm">{region.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label>Customer Status (Multi-select)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto border rounded p-2">
                  {CUSTOMER_STATUSES.map((status) => (
                    <label key={status.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newCampaign.selectedStatuses.includes(status.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewCampaign(prev => ({
                              ...prev,
                              selectedStatuses: [...prev.selectedStatuses, status.id]
                            }));
                          } else {
                            setNewCampaign(prev => ({
                              ...prev,
                              selectedStatuses: prev.selectedStatuses.filter(s => s !== status.id)
                            }));
                          }
                        }}
                      />
                      <span className="text-sm">{status.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateCampaign}>
                Create Campaign
              </Button>
              <Button variant="outline" onClick={() => setIsCampaignDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Campaign Dialog */}
      <Dialog open={isEditCampaignDialogOpen} onOpenChange={setIsEditCampaignDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-campaign-name">Campaign Name</Label>
                <Input
                  id="edit-campaign-name"
                  placeholder="e.g., QLD Launch Campaign"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-scheduled-at">Schedule Date & Time (Optional)</Label>
                <Input
                  id="edit-scheduled-at"
                  type="datetime-local"
                  value={newCampaign.scheduledAt}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, scheduledAt: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-campaign-message">SMS Message</Label>
              <textarea
                id="edit-campaign-message"
                className="w-full p-3 border border-gray-300 rounded-md resize-none"
                rows={4}
                placeholder="Hello Welcome to ServicePanda your friendly Service Provider app..."
                value={newCampaign.message}
                onChange={(e) => setNewCampaign(prev => ({ ...prev, message: e.target.value }))}
              />
            </div>

            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium mb-3">Voucher Settings (Optional)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-voucher-code">Voucher Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="edit-voucher-code"
                      placeholder="XYZ123"
                      value={newCampaign.voucherCode}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, voucherCode: e.target.value }))}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setNewCampaign(prev => ({ ...prev, voucherCode: generateVoucherCode() }))}
                    >
                      Generate
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-voucher-amount">Voucher Amount ($)</Label>
                  <Input
                    id="edit-voucher-amount"
                    type="number"
                    placeholder="30"
                    value={newCampaign.voucherAmount}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, voucherAmount: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Target Audience</h4>
              
              <div>
                <Label>States (Multi-select)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto border rounded p-2">
                  {uniqueStates.map((state) => (
                    <label key={state} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newCampaign.selectedStates.includes(state)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewCampaign(prev => ({
                              ...prev,
                              selectedStates: [...prev.selectedStates, state]
                            }));
                          } else {
                            setNewCampaign(prev => ({
                              ...prev,
                              selectedStates: prev.selectedStates.filter(s => s !== state)
                            }));
                          }
                        }}
                      />
                      <span className="text-sm">{state}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label>Regions (Multi-select)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto border rounded p-2">
                  {displayRegions.map((region) => (
                    <label key={region.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newCampaign.selectedRegions.includes(region.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewCampaign(prev => ({
                              ...prev,
                              selectedRegions: [...prev.selectedRegions, region.id]
                            }));
                          } else {
                            setNewCampaign(prev => ({
                              ...prev,
                              selectedRegions: prev.selectedRegions.filter(r => r !== region.id)
                            }));
                          }
                        }}
                      />
                      <span className="text-sm">{region.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label>Customer Status (Multi-select)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto border rounded p-2">
                  {CUSTOMER_STATUSES.map((status) => (
                    <label key={status.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newCampaign.selectedStatuses.includes(status.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewCampaign(prev => ({
                              ...prev,
                              selectedStatuses: [...prev.selectedStatuses, status.id]
                            }));
                          } else {
                            setNewCampaign(prev => ({
                              ...prev,
                              selectedStatuses: prev.selectedStatuses.filter(s => s !== status.id)
                            }));
                          }
                        }}
                      />
                      <span className="text-sm">{status.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleUpdateCampaign}>
                Update Campaign
              </Button>
              <Button variant="outline" onClick={() => setIsEditCampaignDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 