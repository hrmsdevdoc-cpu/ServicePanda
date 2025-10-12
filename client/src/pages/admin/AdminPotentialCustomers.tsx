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
  ChevronDown,
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
  region?: string;
  importId: string;
  importName: string;
  smsDeliveryStatus: 'not_sent' | '1st_sent' | '2nd_sent';
  campaignStatus: 'New' | 'Added to Campaign' | 'Lost' | 'Won' | 'Unsubscribe';
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
  selectedRegions?: string[];
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
  const [selectedCustomerStatuses, setSelectedCustomerStatuses] = useState<string[]>(["New", "Added to Campaign", "1st SMS", "2nd SMS"]);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  // Region filter removed - customers don't have region data
  
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
    selectedRegions: [] as string[],
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

  const setCustomerStatus = async (customerId: number, status: string) => {
    try {
      console.log(`🔄 Updating customer ${customerId} status to ${status}`);
      
      const response = await adminApiRequest('PUT', `/api/admin/potential-customers/${customerId}/status`, {
        status: status
      });
      
      console.log(`📡 API Response status: ${response.status}`);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log(`✅ API Response data:`, responseData);
        
        setCustomerStatusMap(prev => ({ ...prev, [customerId]: status }));
        console.log(`✅ Customer ${customerId} status updated to ${status} in UI`);
        
        // Refresh the data to get updated customer information
        queryClient.invalidateQueries({ queryKey: ['/api/admin/potential-customers'] });
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to update customer status:', response.status, errorText);
        toast({
          title: "Error",
          description: "Failed to update customer status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Error updating customer status:', error);
      toast({
        title: "Error",
        description: "Failed to update customer status",
        variant: "destructive",
      });
    }
  };

  // List/Kanban toggle for customer list
  const [customerListView, setCustomerListView] = useState<'list' | 'kanban'>('list');
  
  // Kanban ref for keyboard navigation
  const kanbanRef = useRef<HTMLDivElement>(null);
  
  // Arrow visibility state
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Update arrow visibility based on scroll position
  const updateArrowVisibility = () => {
    if (!kanbanRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = kanbanRef.current;
    const isAtStart = scrollLeft <= 0;
    const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 1; // -1 for rounding errors
    
    setShowLeftArrow(!isAtStart);
    setShowRightArrow(!isAtEnd);
  };

  // Scroll event listener for arrow visibility
  React.useEffect(() => {
    if (customerListView !== 'kanban' || !kanbanRef.current) return;
    
    const handleScroll = () => {
      updateArrowVisibility();
    };
    
    kanbanRef.current.addEventListener('scroll', handleScroll);
    
    // Initial check
    updateArrowVisibility();
    
    return () => {
      if (kanbanRef.current) {
        kanbanRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [customerListView]);

  // Keyboard shortcuts for Kanban navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (customerListView !== 'kanban' || !kanbanRef.current) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        kanbanRef.current.scrollLeft -= 200;
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        kanbanRef.current.scrollLeft += 200;
      } else if (e.key === 'Home') {
        e.preventDefault();
        kanbanRef.current.scrollLeft = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        kanbanRef.current.scrollLeft = kanbanRef.current.scrollWidth;
      }
    };

    if (customerListView === 'kanban') {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [customerListView]);

  const CUSTOMER_STATUSES: { id: string; title: string; color: string }[] = [
    { id: 'New', title: 'New', color: 'bg-gray-100' },
    { id: 'Added to Campaign', title: 'Added to Campaign', color: 'bg-blue-100' },
    { id: '1st_sent', title: '1st SMS Sent', color: 'bg-indigo-100' },
    { id: '2nd_sent', title: '2nd SMS Sent', color: 'bg-green-100' },
    { id: 'Lost', title: 'Lost', color: 'bg-red-100' },
    { id: 'Won', title: 'Won', color: 'bg-emerald-100' },
    { id: 'Unsubscribe', title: 'Unsubscribe', color: 'bg-slate-200' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setLocation('/admin-login');
  };





  // Fetch potential customers
  const { data: potentialCustomers = [], isLoading, error } = useQuery({
    queryKey: ['/api/admin/potential-customers'],
    queryFn: async () => {
      try {
        console.log('🔄 [API] Fetching potential customers...');
      const response = await adminApiRequest('GET', '/api/admin/potential-customers');
        console.log('📡 [API] Response status:', response.status);
        
        if (!response.ok) {
          console.error('❌ [API] Response not OK:', response.status, response.statusText);
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
      const data = await response.json();
        console.log('📊 [API] Potential customers data received:');
        console.log('  - Total customers:', data.length);
        
        if (data && data.length > 0) {
        console.log('  - First customer fields:', Object.keys(data[0]));
          console.log('  - Sample customer:', data[0]);
        
          // Log unique regions in the data
          const uniqueRegions = Array.from(new Set(data.map((c: any) => c.region).filter(Boolean)));
          console.log('  - Unique regions in database:', uniqueRegions);
        } else {
          console.log('📊 [API] No potential customers data received or empty array');
      }
      return data;
      } catch (error) {
        console.error('❌ [API] Error fetching potential customers:', error);
        throw error;
      }
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

  // Initialize customer status map when customers are loaded
  React.useEffect(() => {
    if (potentialCustomers && potentialCustomers.length > 0) {
      setCustomerStatusMap(prev => {
        const newStatusMap = { ...prev };
        let hasNewCustomers = false;
        
        potentialCustomers.forEach((customer: PotentialCustomer) => {
          // Use campaignStatus from database if available, otherwise default to 'New'
          const status = customer.campaignStatus || 'New';
          if (!newStatusMap[customer.id]) {
            newStatusMap[customer.id] = status;
            hasNewCustomers = true;
          }
        });
        
        if (hasNewCustomers) {
          console.log('🔄 [Status Map] Initialized customer status map from database');
        }
        
        return newStatusMap;
      });
    }
  }, [potentialCustomers]);

  // Debug logging for filter data
  React.useEffect(() => {
    console.log('[Filter Debug] Filter states:', {
      searchTerm,
      selectedImportId,
      selectedState,
      selectedCustomerStatuses,
      allStatesCount: allStates.length,
      allStates: allStates.map(s => ({ name: s.name, abbreviation: s.abbreviation })),
      potentialCustomersCount: potentialCustomers.length,
      sampleCustomerStates: potentialCustomers.slice(0, 3).map((c: PotentialCustomer) => ({ id: c.id, name: c.name, state: c.state, smsStatus: c.smsDeliveryStatus })),
      customerStatusMapSample: Object.keys(customerStatusMap).slice(0, 3).map(id => ({ id, status: customerStatusMap[parseInt(id)] })),
      isLoading,
      error: error?.message
    });
  }, [searchTerm, selectedImportId, selectedState, selectedCustomerStatuses, allStates, potentialCustomers, customerStatusMap, isLoading, error]);

  // Calculate target audience for campaigns
  const getTargetAudience = React.useMemo(() => {
    if (!potentialCustomers || newCampaign.selectedStates.length === 0) return [];
    
    console.log('🎯 Calculating target audience:');
    console.log('  - Selected states:', newCampaign.selectedStates);
    console.log('  - Selected statuses:', newCampaign.selectedStatuses);
    console.log('  - Total customers:', potentialCustomers.length);
    
    const filtered = potentialCustomers.filter((customer: PotentialCustomer) => {
      // Check if customer state matches selected states
      const customerStateObj = allStates.find(state => state.abbreviation === customer.state);
      if (!customerStateObj) return false;
      
      const stateMatches = newCampaign.selectedStates.includes(customerStateObj.name);
      if (!stateMatches) return false;
      
      // Region filtering disabled - using state-based filtering only
      
      // Check customer status if specified
      if (newCampaign.selectedStatuses.length > 0) {
        const currentStatus = customerStatusMap[customer.id] ?? 'New';
        const statusMatches = newCampaign.selectedStatuses.includes(currentStatus);
        if (!statusMatches) return false;
      }
      
      return true;
    });
    
    // Remove duplicates based on phone number (most reliable unique identifier)
    const uniqueCustomers = filtered.reduce((acc: PotentialCustomer[], current: PotentialCustomer) => {
      const exists = acc.find(customer => customer.phone === current.phone);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);
    
    console.log(`  - Filtered customers: ${filtered.length}`);
    console.log(`  - Unique customers: ${uniqueCustomers.length}`);
    return uniqueCustomers;
  }, [potentialCustomers, newCampaign.selectedStates, newCampaign.selectedStatuses, allStates, customerStatusMap]);

  // Fetch SMS campaigns
  const { data: campaignsData = [], isLoading: campaignsLoading, refetch: refetchCampaigns } = useQuery<SMSCampaign[]>({
    queryKey: ['/api/admin/sms/campaigns'],
    queryFn: async () => {
      const resp = await adminApiRequest('GET', '/api/admin/sms/campaigns');
      return resp.json();
    },
  });

  // Update campaigns state when data changes
  React.useEffect(() => {
    setCampaigns(campaignsData);
  }, [campaignsData]);

  // Campaign mutations
  const createCampaignMutation = useMutation({
    mutationFn: async (campaignData: any) => {
      const resp = await adminApiRequest('POST', '/api/admin/sms/campaigns', campaignData);
      return resp.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/sms/campaigns'] });
      toast({
        title: "Campaign Created",
        description: "SMS campaign has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateCampaignMutation = useMutation({
    mutationFn: async ({ id, campaignData }: { id: number; campaignData: any }) => {
      const resp = await adminApiRequest('PUT', `/api/admin/sms/campaigns/${id}`, campaignData);
      return resp.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/sms/campaigns'] });
      toast({
        title: "Campaign Updated",
        description: "SMS campaign has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to update campaign. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteCampaignMutation = useMutation({
    mutationFn: async (campaignId: number) => {
      const resp = await adminApiRequest('DELETE', `/api/admin/sms/campaigns/${campaignId}`);
      return resp.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/sms/campaigns'] });
      toast({
        title: "Campaign Deleted",
        description: "SMS campaign has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to delete campaign. Please try again.",
        variant: "destructive",
      });
    },
  });

  const sendCampaignMutation = useMutation({
    mutationFn: async ({ campaignId, customerIds, adminName }: { campaignId: number; customerIds: number[]; adminName: string }) => {
      const resp = await adminApiRequest('POST', `/api/admin/sms/campaigns/${campaignId}/send`, { customerIds, adminName });
      return resp.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/sms/campaigns'] });
      
      // Update customer statuses based on SMS results
      if (data.results) {
        data.results.forEach(async (result: any) => {
          if (result.status === 'sent') {
            // Move from "Added to Campaign" to appropriate SMS status
            if (result.smsType === '1st_sent') {
              await setCustomerStatus(result.customerId, '1st_sent');
            } else if (result.smsType === '2nd_sent') {
              await setCustomerStatus(result.customerId, '2nd_sent');
            }
          }
        });
      }
      
      toast({
        title: "Campaign Sent",
        description: `SMS campaign sent to ${data.successCount} customers successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to send campaign. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Fetch Australian regions (SA4) - needed for SMS campaigns
  const { data: allRegions = [] } = useQuery<AustralianRegion[]>({
    queryKey: ['/api/regions'],
    queryFn: async () => {
      const resp = await adminApiRequest('GET', '/api/regions');
      return resp.json();
    },
  });

  // Regions filtered by selected states in campaign - for SMS campaigns only
  const displayRegions = React.useMemo(() => {
    console.log('DisplayRegions - allRegions:', allRegions);
    console.log('DisplayRegions - selectedStates:', newCampaign.selectedStates);
    // If no regions are loaded from API, show sample regions for testing
    if (!allRegions || allRegions.length === 0) {
      const sampleRegions = [
        { id: 1, name: 'Sydney - Inner West', code: '10101', stateId: 1 },
        { id: 2, name: 'Sydney - Eastern Suburbs', code: '10102', stateId: 1 },
        { id: 3, name: 'Sydney - Northern Beaches', code: '10103', stateId: 1 },
        { id: 4, name: 'Sydney - South West', code: '10104', stateId: 1 },
        { id: 5, name: 'Melbourne - Inner', code: '20101', stateId: 2 },
        { id: 6, name: 'Melbourne - Inner East', code: '20102', stateId: 2 },
        { id: 7, name: 'Melbourne - Inner South', code: '20103', stateId: 2 },
        { id: 8, name: 'Melbourne - North East', code: '20104', stateId: 2 },
        { id: 9, name: 'Brisbane - Inner City', code: '30101', stateId: 3 },
        { id: 10, name: 'Brisbane - East', code: '30102', stateId: 3 },
        { id: 11, name: 'Brisbane - North', code: '30103', stateId: 3 },
        { id: 12, name: 'Brisbane - South', code: '30104', stateId: 3 },
        { id: 13, name: 'Perth - Inner', code: '40101', stateId: 5 },
        { id: 14, name: 'Perth - North East', code: '40102', stateId: 5 },
        { id: 15, name: 'Adelaide - Central', code: '50101', stateId: 4 },
        { id: 16, name: 'Adelaide - North', code: '50102', stateId: 4 },
        { id: 17, name: 'Hobart', code: '60101', stateId: 6 },
        { id: 18, name: 'Darwin', code: '70101', stateId: 7 },
        { id: 19, name: 'Australian Capital Territory', code: '80101', stateId: 8 },
      ];
      
      // Filter regions based on selected states in the campaign
      if (newCampaign.selectedStates.length === 0) {
        return sampleRegions; // Show all regions if no states selected
      }
      
      // Use name-based filtering instead of ID-based for more reliability
      const filteredRegions = sampleRegions.filter(region => {
        const regionName = region.name.toLowerCase();
        
        // Check if any selected state matches the region
        return newCampaign.selectedStates.some(stateName => {
          const stateLower = stateName.toLowerCase();
          
          // Direct state-region mapping
          if (stateLower.includes('queensland') && regionName.includes('brisbane')) return true;
          if (stateLower.includes('new south wales') && regionName.includes('sydney')) return true;
          if (stateLower.includes('victoria') && regionName.includes('melbourne')) return true;
          if (stateLower.includes('western australia') && regionName.includes('perth')) return true;
          if (stateLower.includes('south australia') && regionName.includes('adelaide')) return true;
          if (stateLower.includes('tasmania') && regionName.includes('hobart')) return true;
          if (stateLower.includes('northern territory') && regionName.includes('darwin')) return true;
          if (stateLower.includes('australian capital territory') && regionName.includes('canberra')) return true;
          
          return false;
        });
      });
      
      console.log('DisplayRegions - Using sample regions, filtered by name:', filteredRegions.map(r => ({ id: r.id, name: r.name, stateId: r.stateId })));
      return filteredRegions;
    }
    
    // Filter regions based on selected states in the campaign
    if (newCampaign.selectedStates.length === 0) {
      console.log('DisplayRegions - No states selected, returning all regions:', allRegions);
      return allRegions as AustralianRegion[]; // Show all regions if no states selected
    }
    
    // Use name-based filtering for API regions as well
    const filteredRegions = (allRegions as AustralianRegion[]).filter(region => {
      const regionName = region.name.toLowerCase();
      
      // Check if any selected state matches the region
      return newCampaign.selectedStates.some(stateName => {
        const stateLower = stateName.toLowerCase();
        
        // Direct state-region mapping
        if (stateLower.includes('queensland') && regionName.includes('brisbane')) return true;
        if (stateLower.includes('new south wales') && regionName.includes('sydney')) return true;
        if (stateLower.includes('victoria') && regionName.includes('melbourne')) return true;
        if (stateLower.includes('western australia') && regionName.includes('perth')) return true;
        if (stateLower.includes('south australia') && regionName.includes('adelaide')) return true;
        if (stateLower.includes('tasmania') && regionName.includes('hobart')) return true;
        if (stateLower.includes('northern territory') && regionName.includes('darwin')) return true;
        if (stateLower.includes('australian capital territory') && regionName.includes('canberra')) return true;
        
        return false;
      });
    });
    
    console.log('DisplayRegions - Using API regions, filtered by name:', filteredRegions.map(r => ({ id: r.id, name: r.name, stateId: r.stateId })));
    return filteredRegions;
  }, [allRegions, allStates, newCampaign.selectedStates]);

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

    const customerIds = selectedCustomersForSms.map((customer: PotentialCustomer) => customer.id);
    await sendSmsMutation.mutateAsync(customerIds);
  };

  // Execute campaign mutation
  const executeCampaignMutation = useMutation({
    mutationFn: async (campaignData: {
      campaignId: number;
      messageTemplate: string;
      voucherAmount: number;
      customerIds: number[];
      adminName: string;
    }) => {
      console.log("Executing campaign with unique vouchers:", campaignData);
      const response = await adminApiRequest(
        'POST',
        '/api/admin/campaigns/execute',
        campaignData
      );
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Campaign executed successfully:", data);
      toast({
        title: "Campaign Executed Successfully",
        description: `Campaign sent to ${data.sent} customers with unique vouchers. ${data.failed} failed.`,
      });
      // Refresh the data
      queryClient.invalidateQueries({ queryKey: ['/api/admin/potential-customers'] });
    },
    onError: (error: any) => {
      console.error("Error executing campaign:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to execute campaign",
        variant: "destructive",
      });
    },
  });

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

    // Get target audience for this campaign
    const targetAudience = potentialCustomers.filter((customer: PotentialCustomer) => {
      // Check if customer state matches selected states
      const customerStateObj = allStates.find(state => state.abbreviation === customer.state);
      if (!customerStateObj) return false;
      
      const stateMatches = newCampaign.selectedStates.length === 0 || 
        newCampaign.selectedStates.includes(customerStateObj.name);
      if (!stateMatches) return false;
      
      // Check customer status if specified
      const matchesStatus = newCampaign.selectedStatuses.length === 0 || 
        newCampaign.selectedStatuses.includes(customerStatusMap[customer.id] || 'New');
      return matchesStatus;
    });

    const campaignData = {
      name: newCampaign.name,
      message: newCampaign.message,
      voucherCode: newCampaign.voucherCode || null,
      voucherAmount: newCampaign.voucherAmount || null,
      selectedStates: newCampaign.selectedStates,
      selectedRegions: newCampaign.selectedRegions || null,
      selectedStatuses: newCampaign.selectedStatuses,
      scheduledAt: newCampaign.scheduledAt || null,
      status: newCampaign.scheduledAt ? 'scheduled' : 'draft',
    };

    createCampaignMutation.mutate(campaignData, {
      onSuccess: async () => {
        // Move target customers to "Added to Campaign" status
        for (const customer of targetAudience) {
          await setCustomerStatus(customer.id, 'Added to Campaign');
        }
        
        toast({
          title: "Campaign Created",
          description: `${targetAudience.length} customers added to campaign`,
        });
      }
    });
    
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
      selectedRegions: campaign.selectedRegions || [],
      selectedStatuses: campaign.selectedStatuses,
      scheduledAt: campaign.scheduledAt || '',
    });
    setIsEditCampaignDialogOpen(true);
  };

  const handleUpdateCampaign = () => {
    if (!editingCampaign) return;

    const campaignData = {
            name: newCampaign.name,
            message: newCampaign.message,
      voucherCode: newCampaign.voucherCode || null,
      voucherAmount: newCampaign.voucherAmount || null,
            selectedStates: newCampaign.selectedStates,
      selectedRegions: newCampaign.selectedRegions || null,
            selectedStatuses: newCampaign.selectedStatuses,
      scheduledAt: newCampaign.scheduledAt || null,
      status: newCampaign.scheduledAt ? 'scheduled' : 'draft',
    };

    updateCampaignMutation.mutate({ id: editingCampaign.id, campaignData });
    
    setIsEditCampaignDialogOpen(false);
    setEditingCampaign(null);
  };

  const handleDuplicateCampaign = (campaign: SMSCampaign) => {
    const campaignData = {
      name: `${campaign.name} (Copy)`,
      message: campaign.message,
      voucherCode: campaign.voucherCode || null,
      voucherAmount: campaign.voucherAmount || null,
      selectedStates: campaign.selectedStates,
      selectedRegions: campaign.selectedRegions || null,
      selectedStatuses: campaign.selectedStatuses,
      scheduledAt: null,
      status: 'draft',
    };

    createCampaignMutation.mutate(campaignData);
  };

  const handleExecuteCampaign = async (campaign: SMSCampaign) => {
    // Get target audience for this campaign
    const targetAudience = potentialCustomers.filter((customer: PotentialCustomer) => {
      // Check if customer state matches selected states
      const customerStateObj = allStates.find(state => state.abbreviation === customer.state);
      if (!customerStateObj) return false;
      
      const stateMatches = campaign.selectedStates.length === 0 || 
        campaign.selectedStates.includes(customerStateObj.name);
      if (!stateMatches) return false;
      
      // Region filtering disabled - using state-based filtering only
      
      // Check customer status if specified
      const matchesStatus = campaign.selectedStatuses.length === 0 || 
        campaign.selectedStatuses.includes(customerStatusMap[customer.id] || 'New');
      return matchesStatus;
    });

    if (targetAudience.length === 0) {
      toast({
        title: "No Target Audience",
        description: "No customers match the campaign criteria.",
        variant: "destructive",
      });
      return;
    }

    const customerIds = targetAudience.map((customer: PotentialCustomer) => customer.id);

    sendCampaignMutation.mutate({
        campaignId: campaign.id,
        customerIds,
        adminName: 'admin', // You can get this from auth context
      });
  };

  const handleDeleteCampaign = (campaignId: number) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      deleteCampaignMutation.mutate(campaignId);
    }
  };



  const getSmsStatusBadge = (status: string) => {
    switch (status) {
      case 'not_sent':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Not Sent</Badge>;
      case '1st_sent':
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="h-3 w-3 mr-1" />1st</Badge>;
      case '2nd_sent':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />2nd</Badge>;
      case 'unsubscribed':
        return <Badge className="bg-red-100 text-red-800"><X className="h-3 w-3 mr-1" />Unsubscribed</Badge>;
      default:
        return <Badge variant="secondary"><AlertCircle className="h-3 w-3 mr-1" />Not Set</Badge>;
    }
  };

  const filteredCustomers = potentialCustomers.filter((customer: PotentialCustomer) => {
    const matchesSearch = !searchTerm || customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesImportId = selectedImportId === "all" || customer.importId === selectedImportId;
    
    // Fix state matching: customer.state contains abbreviations, selectedState contains full names
    const matchesState = selectedState === "all" || (() => {
      if (selectedState === "all") return true;
      // Find the state object that matches the selected state name
      const selectedStateObj = allStates.find(state => state.name === selectedState);
      if (!selectedStateObj) {
        console.log(`[Filter] State not found: ${selectedState}`, allStates);
        return false;
      }
      // Compare customer state (abbreviation) with the abbreviation of selected state
      const matches = customer.state === selectedStateObj.abbreviation;
      if (!matches) {
        console.log(`[Filter] State mismatch: customer.state=${customer.state}, selectedStateObj.abbreviation=${selectedStateObj.abbreviation}`);
      }
      return matches;
    })();
    
    // Use campaignStatus directly from the customer data instead of customerStatusMap
    const currentStatus = customer.campaignStatus || 'New';
    const smsStatus = customer.smsDeliveryStatus || 'not_sent';
    
    // Handle customer status filtering with multiple selections
    let matchesCustomerStatus = false;
    
    // Check if customer matches any of the selected statuses
    matchesCustomerStatus = selectedCustomerStatuses.some(status => {
      if (status === '1st SMS') {
        // Match customers who have received first SMS AND are still in New or Added to Campaign status
        return smsStatus === '1st_sent' && (currentStatus === 'New' || currentStatus === 'Added to Campaign');
      } else if (status === '2nd SMS') {
        // Match customers who have received second SMS AND are still in New or Added to Campaign status
        return smsStatus === '2nd_sent' && (currentStatus === 'New' || currentStatus === 'Added to Campaign');
      } else {
        // For other statuses (New, Added to Campaign, Lost, Won, Unsubscribe), use campaign status
        return currentStatus === status;
      }
    });
    
    const result = matchesSearch && matchesImportId && matchesState && matchesCustomerStatus;
    
    // Debug logging for Lost customers
    if (currentStatus === 'Lost') {
      console.log(`[Filter] Lost Customer ${customer.id} (${customer.name}):`, {
        matchesSearch,
        matchesImportId,
        matchesState,
        matchesCustomerStatus,
        result,
        customerState: customer.state,
        selectedState,
        currentStatus,
        smsStatus,
        selectedCustomerStatuses,
        customerStatusMapValue: customerStatusMap[customer.id],
        isLostSelected: selectedCustomerStatuses.includes('Lost')
      });
    }
    
    return result;
  });

  // Remove duplicates from filtered customers based on phone number
  const uniqueFilteredCustomers = filteredCustomers.reduce((acc: PotentialCustomer[], current: PotentialCustomer) => {
    const exists = acc.find(customer => customer.phone === current.phone);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, []);

  // Pagination logic
  const totalCustomers = uniqueFilteredCustomers.length;
  const totalPages = Math.ceil(totalCustomers / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  // Handle both pagination and load more modes
  const displayedCustomers = viewMode === 'pagination' 
    ? uniqueFilteredCustomers.slice(startIndex, endIndex)
    : uniqueFilteredCustomers.slice(0, loadedCount);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
    setLoadedCount(10);
  }, [searchTerm, selectedImportId, selectedState, selectedCustomerStatuses]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      <div className="flex-1 overflow-y-auto relative z-10">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-sm dark:bg-gray-800 shadow-lg shadow-slate-200/20 border-b border-slate-200/50 dark:border-gray-700">
          <div className="px-8 py-3" style={{ paddingTop: '1.2rem', paddingBottom: '0.8rem' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mr-3">
                  <UserPlus className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Potential Customers
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
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
        <div className="px-8 pt-4 pb-8 min-h-screen">
          <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
            {/* Tabs are now hidden - navigation via sidebar */}

            <TabsContent value="list" className="space-y-4">
              {/* Filters */}
              <Card>
                <CardContent className="pt-6">
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
                          {allStates.map((state: AustralianState) => (
                            <SelectItem key={state.id} value={state.name}>{state.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Region filter removed - customers don't have region data */}
                    <div>
                      <Label htmlFor="customer-status">Customer Status</Label>
                      <div className="relative" ref={statusDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                          className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <span className="text-sm text-gray-700">
                            {selectedCustomerStatuses.length === 0 
                              ? 'Select statuses...' 
                              : `${selectedCustomerStatuses.length} selected`
                            }
                          </span>
                          <div className="flex items-center space-x-2">
                            {selectedCustomerStatuses.length > 0 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCustomerStatuses([]);
                                }}
                                className="text-xs text-gray-500 hover:text-gray-700"
                              >
                                Clear
                              </button>
                            )}
                            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                          </div>
                        </button>
                        
                        {isStatusDropdownOpen && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                            <div className="max-h-48 overflow-y-auto">
                              {[
                                { id: 'New', label: 'New' },
                                { id: 'Added to Campaign', label: 'Added to Campaign' },
                                { id: '1st SMS', label: '1st SMS' },
                                { id: '2nd SMS', label: '2nd SMS' },
                                { id: 'Lost', label: 'Lost' },
                                { id: 'Won', label: 'Won' },
                                { id: 'Unsubscribe', label: 'Unsubscribe' }
                              ].map((status) => (
                                <label key={status.id} className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={selectedCustomerStatuses.includes(status.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedCustomerStatuses(prev => [...prev, status.id]);
                                      } else {
                                        setSelectedCustomerStatuses(prev => 
                                          prev.filter(s => s !== status.id)
                                        );
                                      }
                                    }}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-gray-700">{status.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-end">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedImportId("all");
                          setSelectedState("all");
                          setSelectedCustomerStatuses(["New", "Added to Campaign", "1st SMS", "2nd SMS"]);
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
                    <CardTitle>Potential Customers ({uniqueFilteredCustomers.length})</CardTitle>
                    <div className="flex items-center gap-3">
                      <Label className="text-sm font-medium">View:</Label>
                      <div className="flex items-center rounded-lg p-1" style={{ backgroundColor: 'rgb(231 110 110)' }}>
                        <button
                          onClick={() => setCustomerListView('list')}
                          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                            customerListView === 'list'
                              ? 'bg-white text-gray-900 shadow-sm'
                              : 'text-white hover:text-gray-200'
                          }`}
                        >
                          List
                        </button>
                        <button
                          onClick={() => setCustomerListView('kanban')}
                          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                            customerListView === 'kanban'
                              ? 'bg-white dark:bg-red-800 text-gray-900 dark:text-white shadow-sm'
                              : 'text-gray-600 dark:text-red-300 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          Kanban
                        </button>
                      </div>
                    </div>
                  </div>
                  <CardDescription>
                    Imported customer data with SMS delivery status
                    {customerListView === 'kanban' && (
                      <span className="block text-xs text-gray-500 mt-1">
                        💡 Use ← → keys or click arrow buttons to navigate • Home/End for start/end
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="text-gray-500 mt-2">Loading customers...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Customers</h3>
                      <p className="text-gray-500 mb-4">Failed to fetch customer data from the server.</p>
                      <p className="text-sm text-gray-400">Check the browser console for more details.</p>
                      <Button 
                        variant="outline" 
                        onClick={() => window.location.reload()} 
                        className="mt-4"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry
                      </Button>
                    </div>
                  ) : (
                    <div>
                      {customerListView === 'list' ? (
                        <>
                          {displayedCustomers.length === 0 ? (
                            <div className="text-center py-8">
                              <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <h3 className="text-lg font-medium text-gray-900 mb-2">No Customers Found</h3>
                              <p className="text-gray-500">Import customer data to get started.</p>
                            </div>
                          ) : (
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
                                      <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${
                                          customerStatusMap[customer.id] === 'Lost' ? 'bg-red-500' :
                                          customerStatusMap[customer.id] === 'Won' ? 'bg-emerald-500' :
                                          customerStatusMap[customer.id] === 'Unsubscribe' ? 'bg-slate-500' :
                                          customerStatusMap[customer.id] ? 'bg-green-500' : 'bg-gray-300'
                                        }`}></div>
                                      <Select
                                        value={customerStatusMap[customer.id] ?? 'New'}
                                        onValueChange={async (value) => await setCustomerStatus(customer.id, value)}
                                      >
                                          <SelectTrigger className={`w-56 ${
                                            customerStatusMap[customer.id] === 'Lost' ? 'border-red-300 bg-red-50' :
                                            customerStatusMap[customer.id] === 'Won' ? 'border-emerald-300 bg-emerald-50' :
                                            customerStatusMap[customer.id] === 'Unsubscribe' ? 'border-slate-300 bg-slate-50' :
                                            customerStatusMap[customer.id] ? 'border-green-300 bg-green-50' : 'border-gray-300'
                                          }`}>
                                            <SelectValue placeholder="Select status" />
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
                                    </div>
                                    {/* Send SMS button hidden for now */}
                                    {/* <Button
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
                                    </Button> */}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          )}
                          
                          {/* View Mode Toggle */}
                          <div className="flex items-center justify-between mt-6">
                            <div className="flex items-center gap-3">
                              <Label className="text-sm font-medium">View Mode:</Label>
                              <div className="flex items-center rounded-lg p-1" style={{ backgroundColor: 'rgb(231 110 110)' }}>
                                <button
                                  onClick={() => {
                                    setViewMode('pagination');
                                setCurrentPage(1);
                                setLoadedCount(10);
                                  }}
                                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                                    viewMode === 'pagination'
                                      ? 'bg-white text-gray-900 shadow-sm'
                                      : 'text-white hover:text-gray-200'
                                  }`}
                                >
                                  Pagination
                                </button>
                                <button
                                  onClick={() => {
                                    setViewMode('loadMore');
                                    setCurrentPage(1);
                                    setLoadedCount(10);
                                  }}
                                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                                    viewMode === 'loadMore'
                                      ? 'bg-white text-gray-900 shadow-sm'
                                      : 'text-white hover:text-gray-200'
                                  }`}
                                >
                                  Load More
                                </button>
                              </div>
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
                        <div className="relative">
                          {/* Left Arrow Button - Auto Hide/Show */}
                          {showLeftArrow && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (kanbanRef.current) {
                                  kanbanRef.current.scrollBy({
                                    left: -300,
                                    behavior: 'smooth'
                                  });
                                }
                              }}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-white hover:bg-gray-50 border border-gray-300 rounded-full p-2 shadow-lg transition-all duration-200 hover:shadow-xl"
                              title="Scroll Left"
                            >
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                          )}

                          {/* Right Arrow Button - Auto Hide/Show */}
                          {showRightArrow && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (kanbanRef.current) {
                                  kanbanRef.current.scrollBy({
                                    left: 300,
                                    behavior: 'smooth'
                                  });
                                }
                              }}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-white hover:bg-gray-50 border border-gray-300 rounded-full p-2 shadow-lg transition-all duration-200 hover:shadow-xl"
                              title="Scroll Right"
                            >
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          )}

                          <div 
                            ref={kanbanRef}
                            className="overflow-x-auto transition-all duration-200"
                            style={{
                              scrollbarWidth: 'thin',
                              scrollbarColor: '#cbd5e0 #f1f5f9'
                            }}
                          >
                          <div className="flex gap-6 min-w-max pr-2">
                            {(CUSTOMER_STATUSES).map((column) => {
                              const columnCustomers = uniqueFilteredCustomers.filter((c: PotentialCustomer) => {
                                const smsStatus = c.smsDeliveryStatus || 'not_sent';
                                const campaignStatus = customerStatusMap[c.id] || 'New';
                                
                                // First check if this column should be shown based on selected statuses
                                let shouldShowColumn = false;
                                
                                if (column.id === '1st_sent' && selectedCustomerStatuses.includes('1st SMS')) {
                                  shouldShowColumn = true;
                                } else if (column.id === '2nd_sent' && selectedCustomerStatuses.includes('2nd SMS')) {
                                  shouldShowColumn = true;
                                } else if (column.id === 'New' && selectedCustomerStatuses.includes('New')) {
                                  shouldShowColumn = true;
                                } else if (column.id === 'Added to Campaign' && selectedCustomerStatuses.includes('Added to Campaign')) {
                                  shouldShowColumn = true;
                                } else if (column.id === 'Lost' && selectedCustomerStatuses.includes('Lost')) {
                                  shouldShowColumn = true;
                                } else if (column.id === 'Won' && selectedCustomerStatuses.includes('Won')) {
                                  shouldShowColumn = true;
                                } else if (column.id === 'Unsubscribe' && selectedCustomerStatuses.includes('Unsubscribe')) {
                                  shouldShowColumn = true;
                                }
                                
                                if (!shouldShowColumn) return false;
                                
                                // Priority: Campaign status over SMS status
                                // If customer has a campaign status (Lost, Won, etc.), use that
                                if (campaignStatus !== 'New' && campaignStatus !== 'Added to Campaign') {
                                  // Customer has been moved to Lost, Won, Unsubscribe - show in campaign status column
                                  if (column.id === campaignStatus) {
                                    return true;
                                  } else {
                                    return false; // Don't show in any other column
                                  }
                                }
                                
                                // For SMS status columns, use SMS status (only if no campaign status)
                                if (column.id === '1st_sent' || column.id === '2nd_sent') {
                                  return smsStatus === column.id && campaignStatus === 'New';
                                }
                                
                                // For campaign status columns, use campaign status
                                if (column.id === 'Added to Campaign' || column.id === 'Lost' || column.id === 'Won' || column.id === 'Unsubscribe') {
                                  return campaignStatus === column.id;
                                }
                                
                                // For 'New' column, show customers who haven't been added to campaigns AND haven't received SMS
                                if (column.id === 'New') {
                                  return campaignStatus === 'New' && smsStatus === 'not_sent';
                                }
                                
                                return false;
                              });
                              return (
                                <div key={column.id} className="space-y-2 w-72 flex-shrink-0">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-gray-800">{column.title}</h3>
                                    <Badge variant="secondary" className="bg-white text-gray-700 border border-gray-300 text-xs">
                                      {columnCustomers.length}
                                    </Badge>
                                  </div>
                                  <div
                                    className={"min-h-[400px] max-h-[600px] p-2 rounded-lg " + column.color + " border border-gray-200 overflow-hidden shadow-sm"}
                                    onDragOver={(e) => {
                                      e.preventDefault();
                                      // Only highlight campaign status columns as drop targets
                                      if (column.id === 'Added to Campaign' || column.id === 'Lost' || column.id === 'Won' || column.id === 'Unsubscribe' || column.id === 'New') {
                                        e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
                                      }
                                    }}
                                    onDragLeave={(e) => {
                                      e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                                    }}
                                    onDrop={async (e) => {
                                      e.preventDefault();
                                      e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                                      const idStr = e.dataTransfer.getData('text/plain');
                                      const cid = parseInt(idStr);
                                      if (!isNaN(cid)) {
                                        // Allow drag and drop for campaign status columns
                                        if (column.id === 'Added to Campaign' || column.id === 'Lost' || column.id === 'Won' || column.id === 'Unsubscribe' || column.id === 'New') {
                                        await setCustomerStatus(cid, column.id);
                                        toast({
                                          title: "Status Updated",
                                          description: `Customer moved to ${column.title}`,
                                        });
                                        } else {
                                          toast({
                                            title: "Info",
                                            description: "SMS status columns are not draggable",
                                            variant: "default",
                                          });
                                        }
                                      }
                                    }}
                                  >
                                    <div className="space-y-1.5 max-h-[660px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e0 #f1f5f9' }}>
                                      {columnCustomers.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                          <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                          <p className="text-sm">No customers in this status</p>
                                        </div>
                                      ) : (
                                        columnCustomers.map((customer: PotentialCustomer) => (
                                          <div
                                            key={customer.id}
                                            className={`bg-white rounded-md p-2 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group ${
                                              (column.id === 'Added to Campaign' || column.id === 'Lost' || column.id === 'Won' || column.id === 'Unsubscribe' || column.id === 'New' || column.id === '1st_sent' || column.id === '2nd_sent') 
                                                ? 'cursor-move hover:scale-[1.01]' 
                                                : ''
                                            }`}
                                            draggable={(column.id === 'Added to Campaign' || column.id === 'Lost' || column.id === 'Won' || column.id === 'Unsubscribe' || column.id === 'New' || column.id === '1st_sent' || column.id === '2nd_sent')}
                                            onDragStart={(e) => {
                                              if (column.id === 'Added to Campaign' || column.id === 'Lost' || column.id === 'Won' || column.id === 'Unsubscribe' || column.id === 'New' || column.id === '1st_sent' || column.id === '2nd_sent') {
                                              e.dataTransfer.setData('text/plain', customer.id.toString());
                                              e.currentTarget.classList.add('opacity-50');
                                              }
                                            }}
                                            onDragEnd={(e) => {
                                              e.currentTarget.classList.remove('opacity-50');
                                            }}
                                          >
                                            <div className="space-y-1">
                                              <div className="flex items-center justify-between">
                                                <h4 className="font-medium text-sm text-gray-900 truncate">{customer.name}</h4>
                                                <div className="flex gap-1">
                                                  <Badge variant="outline" className="text-xs px-1 py-0">
                                                    {getSmsStatusBadge(customer.smsDeliveryStatus)}
                                                  </Badge>
                                                </div>
                                              </div>
                                              <div className="text-xs text-gray-500 space-y-0.5">
                                                <div className="flex items-center gap-1">
                                                  <Mail className="h-2.5 w-2.5 text-gray-400" />
                                                    <span className="truncate">{customer.email}</span>
                                                  </div>
                                                <div className="flex items-center gap-1">
                                                  <Phone className="h-2.5 w-2.5 text-gray-400" />
                                                    <span>{customer.phone}</span>
                                                  </div>
                                                <div className="flex items-center gap-1">
                                                  <MapPin className="h-2.5 w-2.5 text-gray-400" />
                                                    <span>{customer.city}, {customer.state}</span>
                                                  </div>
                                                  {customer.importName && (
                                                  <div className="flex items-center gap-1">
                                                    <Calendar className="h-2.5 w-2.5 text-gray-400" />
                                                    <span className="text-xs text-gray-400 truncate">{customer.importName}</span>
                                                    </div>
                                                  )}
                                              </div>
                                            </div>
                                          </div>
                                        ))
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            </div>
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
                              {/* SMS status badge hidden for now */}
                              {/* {getSmsStatusBadge(group.smsDeliveryStatus)} */}
                              {/* Send SMS to Group button hidden for now */}
                              {/* <Button
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
                              </Button> */}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sms" className="space-y-4">
              {/* SMS Campaigns Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">SMS Campaigns</CardTitle>
                      <CardDescription className="text-sm">
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
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                    <div className="border rounded-lg p-3 bg-white">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <h3 className="text-sm font-semibold">Draft</h3>
                      </div>
                      <p className="text-xl font-bold text-yellow-600">
                        {campaigns.filter(c => c.status === 'draft').length}
                      </p>
                      <p className="text-xs text-gray-500">Campaigns</p>
                    </div>
                    <div className="border rounded-lg p-3 bg-white">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <h3 className="text-sm font-semibold">Scheduled</h3>
                      </div>
                      <p className="text-xl font-bold text-blue-600">
                        {campaigns.filter(c => c.status === 'scheduled').length}
                      </p>
                      <p className="text-xs text-gray-500">Campaigns</p>
                    </div>
                    <div className="border rounded-lg p-3 bg-white">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <h3 className="text-sm font-semibold">Sent</h3>
                      </div>
                      <p className="text-xl font-bold text-green-600">
                        {campaigns.filter(c => c.status === 'sent').length}
                      </p>
                      <p className="text-xs text-gray-500">Campaigns</p>
                    </div>
                    <div className="border rounded-lg p-3 bg-white">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <h3 className="text-sm font-semibold">Failed</h3>
                      </div>
                      <p className="text-xl font-bold text-red-600">
                        {campaigns.filter(c => c.status === 'failed').length}
                      </p>
                      <p className="text-xs text-gray-500">Campaigns</p>
                    </div>
                  </div>

                  {/* View Campaigns Table */}
                  <div className="space-y-3">
                    <h3 className="text-base font-semibold">View Campaigns</h3>
                    {campaignsLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="text-gray-500 mt-2">Loading campaigns...</p>
                      </div>
                    ) : campaigns.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-base font-medium text-gray-900 mb-2">No Campaigns</h3>
                        <p className="text-sm text-gray-500">Create your first SMS campaign to get started.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-200 px-3 py-2 text-left text-sm">Campaign Name</th>
                              <th className="border border-gray-200 px-3 py-2 text-left text-sm">Date Created</th>
                              <th className="border border-gray-200 px-3 py-2 text-left text-sm">Total Sent</th>
                              <th className="border border-gray-200 px-3 py-2 text-left text-sm">Status</th>
                              <th className="border border-gray-200 px-3 py-2 text-left text-sm">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {campaigns.map((campaign) => (
                              <tr key={campaign.id}>
                                <td className="border border-gray-200 px-3 py-2">
                                  <div>
                                    <div className="text-sm font-medium">{campaign.name}</div>
                                    <div className="text-xs text-gray-500 truncate max-w-xs">
                                      {campaign.message.substring(0, 50)}...
                                    </div>
                                  </div>
                                </td>
                                <td className="border border-gray-200 px-3 py-2 text-sm">
                                  {new Date(campaign.createdAt).toLocaleDateString()}
                                </td>
                                <td className="border border-gray-200 px-3 py-2 text-sm">
                                  {campaign.totalSent}
                                </td>
                                <td className="border border-gray-200 px-3 py-2">
                                  <Badge 
                                    variant={
                                      campaign.status === 'sent' ? 'default' :
                                      campaign.status === 'scheduled' ? 'secondary' :
                                      campaign.status === 'failed' ? 'destructive' : 'outline'
                                    }
                                    className="text-xs"
                                  >
                                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                                  </Badge>
                                </td>
                                <td className="border border-gray-200 px-3 py-2">
                                  <div className="flex gap-2">
                                    {campaign.status !== 'sent' ? (
                                      <>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleEditCampaign(campaign)}
                                        >
                                          Edit
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="default"
                                          onClick={() => handleExecuteCampaign(campaign)}
                                          disabled={sendCampaignMutation.isPending}
                                        >
                                          {sendCampaignMutation.isPending ? "Sending..." : "Send Campaign"}
                                        </Button>
                                      </>
                                    ) : null}
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDuplicateCampaign(campaign)}
                                    >
                                      Duplicate
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleDeleteCampaign(campaign.id)}
                                      disabled={deleteCampaignMutation.isPending}
                                    >
                                      {deleteCampaignMutation.isPending ? "Deleting..." : "Delete"}
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
                placeholder="Hello {customerName}! Welcome to ServicePanda your friendly Service Provider app, click here to download the app https://tinurl/123 as per our first launch, here is a ${voucherAmount} voucher for your first job with us. Voucher '{voucherCode}'. If you do not wish to receive any sms, please reply STOP"
                value={newCampaign.message}
                onChange={(e) => setNewCampaign(prev => ({ ...prev, message: e.target.value }))}
              />
              <p className="text-xs text-gray-500 mt-1">
                Use placeholders: {`{customerName}`}, {`{voucherCode}`}, {`{voucherAmount}`} - these will be replaced with unique values for each customer. Include "reply STOP" to unsubscribe option.
              </p>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium mb-3">Voucher Settings (Optional)</h4>
              <p className="text-xs text-gray-600 mb-3">
                💡 Each customer will receive a unique voucher code automatically generated for them.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="voucher-code">Voucher Code (Reference Only)</Label>
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
                  {allStates.map((state) => (
                    <label key={state.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newCampaign.selectedStates.includes(state.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewCampaign(prev => ({
                              ...prev,
                              selectedStates: [...prev.selectedStates, state.name]
                            }));
                          } else {
                            setNewCampaign(prev => ({
                              ...prev,
                              selectedStates: prev.selectedStates.filter(s => s !== state.name),
                              // Clear regions when states change
                              selectedRegions: []
                            }));
                          }
                        }}
                      />
                      <span className="text-sm">{state.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Regions section hidden - using state-based filtering only */}

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

            {/* Target Audience Preview */}
            {newCampaign.selectedStates.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium">Target Audience Preview</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">
                      {getTargetAudience.length} customers will receive this campaign
                    </span>
                    <span className="text-xs text-gray-500">
                      Based on selected criteria
                    </span>
                  </div>
                  
                  {getTargetAudience.length > 0 ? (
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {getTargetAudience.slice(0, 10).map((customer: PotentialCustomer) => (
                        <div key={customer.id} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-600">
                                {customer.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{customer.name}</p>
                              <p className="text-xs text-gray-500">{customer.phone}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">{customer.state}</p>
                            <p className="text-xs text-gray-400">
                              {customerStatusMap[customer.id] ?? 'New'}
                            </p>
                          </div>
                        </div>
                      ))}
                      {getTargetAudience.length > 10 && (
                        <p className="text-xs text-gray-500 text-center py-2">
                          ... and {getTargetAudience.length - 10} more customers
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">No customers match the selected criteria</p>
                      <p className="text-xs text-gray-400 mt-1">Try adjusting your state or status filters</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleCreateCampaign} disabled={getTargetAudience.length === 0}>
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
                placeholder="Hello {customerName}! Welcome to ServicePanda your friendly Service Provider app, click here to download the app https://tinurl/123 as per our first launch, here is a ${voucherAmount} voucher for your first job with us. Voucher '{voucherCode}'. If you do not wish to receive any sms, please reply STOP"
                value={newCampaign.message}
                onChange={(e) => setNewCampaign(prev => ({ ...prev, message: e.target.value }))}
              />
              <p className="text-xs text-gray-500 mt-1">
                Use placeholders: {`{customerName}`}, {`{voucherCode}`}, {`{voucherAmount}`} - these will be replaced with unique values for each customer. Include "reply STOP" to unsubscribe option.
              </p>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium mb-3">Voucher Settings (Optional)</h4>
              <p className="text-xs text-gray-600 mb-3">
                💡 Each customer will receive a unique voucher code automatically generated for them.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-voucher-code">Voucher Code (Reference Only)</Label>
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
                  {allStates.map((state) => (
                    <label key={state.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newCampaign.selectedStates.includes(state.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewCampaign(prev => ({
                              ...prev,
                              selectedStates: [...prev.selectedStates, state.name]
                            }));
                          } else {
                            setNewCampaign(prev => ({
                              ...prev,
                              selectedStates: prev.selectedStates.filter(s => s !== state.name),
                              // Clear regions when states change
                              selectedRegions: []
                            }));
                          }
                        }}
                      />
                      <span className="text-sm">{state.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Regions section hidden - using state-based filtering only */}

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

            {/* Target Audience Preview */}
            {newCampaign.selectedStates.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium">Target Audience Preview</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">
                      {getTargetAudience.length} customers will receive this campaign
                    </span>
                    <span className="text-xs text-gray-500">
                      Based on selected criteria
                    </span>
                  </div>
                  
                  {getTargetAudience.length > 0 ? (
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {getTargetAudience.slice(0, 10).map((customer: PotentialCustomer) => (
                        <div key={customer.id} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-600">
                                {customer.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{customer.name}</p>
                              <p className="text-xs text-gray-500">{customer.phone}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">{customer.state}</p>
                            <p className="text-xs text-gray-400">
                              {customerStatusMap[customer.id] ?? 'New'}
                            </p>
                          </div>
                        </div>
                      ))}
                      {getTargetAudience.length > 10 && (
                        <p className="text-xs text-gray-500 text-center py-2">
                          ... and {getTargetAudience.length - 10} more customers
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">No customers match the selected criteria</p>
                      <p className="text-xs text-gray-400 mt-1">Try adjusting your state or status filters</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleUpdateCampaign} disabled={getTargetAudience.length === 0}>
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