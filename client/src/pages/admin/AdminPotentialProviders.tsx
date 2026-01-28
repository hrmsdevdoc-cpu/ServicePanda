import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { adminApiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  UserSearch,
  Plus,
  Upload,
  Search,
  Filter,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Download,
  FileText,
  Users,
  AlertCircle,
  Check,
  X,
  UserPlus,
  List,
  Kanban,
  CheckSquare,
  ArrowRight,
  ArrowLeft,
  MapPin,
  ChevronLeft,
  ChevronRight,
  User,
  Tag,
  RefreshCw,
  Crown,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface PotentialProvider {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName?: string;
  businessAbn?: string;
  address: string;
  state: string;
  city: string;
  postcode: string;
  serviceCategories?: string;
  source: string;
  importId?: string;
  importName?: string;
  status: string;
  priority: string;
  assignedTo?: string;
  assignedAdminName?: string;
  taskTitle?: string;
  taskAssignedTo?: string | null;
  taskAssignedToName?: string;
  notes?: string;
  nextFollowUpDate?: string;
  lastContactDate?: string;
  lastContactType?: string;
  createdAt: string;
  updatedAt: string;
}

interface TeamTask {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate: string;
  completedAt?: string;
  potentialProviderId?: number;
  providerId?: number;
  customerId?: string;
  adminId: string;
  assignedTo?: string;
  comments?: string;
  taskType: string;
  tags?: any[];
  createdAt: string;
  updatedAt: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  providers: PotentialProvider[];
  tasks: TeamTask[];
}

interface PendingImport {
  id: string;
  importName: string;
  providers: PotentialProvider[];
  fieldMapping?: { [csvHeader: string]: string };
  csvHeaders?: string[];
  unmappedHeaders?: string[];
  createdAt: Date;
}

const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: "overdue24h", title: "Overdue + 24h", color: "bg-red-200", providers: [], tasks: [] },
  { id: "overdue", title: "Overdue", color: "bg-red-100", providers: [], tasks: [] },
  { id: "today", title: "Today", color: "bg-blue-100", providers: [], tasks: [] },
  { id: "tomorrow", title: "Tomorrow", color: "bg-yellow-100", providers: [], tasks: [] },
  { id: "upcoming", title: "Upcoming", color: "bg-green-100", providers: [], tasks: [] },
];

type ViewMode = 'member-list' | 'list' | 'kanban' | 'completed' | 'lost' | 'new-member-list';

export default function AdminPotentialProviders() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  
  // State management
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assignedToFilter, setAssignedToFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [kanbanColumns, setKanbanColumns] = useState(KANBAN_COLUMNS);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isSmsDialogOpen, setIsSmsDialogOpen] = useState(false);
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
  const [isWonAlertOpen, setIsWonAlertOpen] = useState(false);
  const [isLostAlertOpen, setIsLostAlertOpen] = useState(false);
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<PotentialProvider | null>(null);
  
  // Team task state
  const [teamTasks, setTeamTasks] = useState<TeamTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<TeamTask | null>(null);
  const [taskPriorityFilter, setTaskPriorityFilter] = useState("all");
  const [taskCustomerTypeFilter, setTaskCustomerTypeFilter] = useState("all");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState('admin');

  // New Members bulk assign (checkboxes + create tasks)
  const [selectedNewMemberIds, setSelectedNewMemberIds] = useState<Set<number>>(new Set());
  const [bulkAssignedTo, setBulkAssignedTo] = useState("");
  const [bulkTaskType, setBulkTaskType] = useState("follow_up");
  
  // Toast hook
  const { toast } = useToast();
  
  // Toast state for mutations
  const [toastMessage, setToastMessage] = useState<{type: 'success' | 'error', title: string, description: string} | null>(null);
  
  // Handle toast messages
  useEffect(() => {
    if (toastMessage) {
      toast({
        title: toastMessage.title,
        description: toastMessage.description,
        variant: toastMessage.type === 'error' ? 'destructive' : 'default'
      });
      setToastMessage(null);
    }
  }, [toastMessage, toast]);
  
  // Kanban scroll functionality
  const kanbanRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // List view table horizontal scroll
  const listViewTableRef = useRef<HTMLDivElement>(null);
  const [showListViewLeftArrow, setShowListViewLeftArrow] = useState(false);
  const [showListViewRightArrow, setShowListViewRightArrow] = useState(true);

  // New state for member confirmation and pagination
  const [pendingImports, setPendingImports] = useState<PendingImport[]>([]);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [selectedPendingImport, setSelectedPendingImport] = useState<PendingImport | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Form states
  const [newProvider, setNewProvider] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    businessAbn: "",
    address: "",
    state: "",
    city: "",
    postcode: "",
    serviceCategories: "",
    priority: "medium",
    assignedTo: "",
    notes: "",
  });

  const [importData, setImportData] = useState({
    importName: "",
    csvData: "",
  });
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [fieldMapping, setFieldMapping] = useState<{ [csvHeader: string]: string } | null>(null);

  const [taskData, setTaskData] = useState({
    taskType: "general",
    title: "",
    description: "",
    scheduledDate: "",
    assignedTo: "",
    priority: "P3",
    customerType: "all",
    comments: "",
    taskOwner: "admin", // Default to current admin
  });

  // Fetch admin users for task assignment
  const { data: adminUsers = [] } = useQuery({
    queryKey: ['/api/admin/users'],
    queryFn: async () => {
      const response = await adminApiRequest('GET', '/api/admin/users');
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

  // Get current admin user info
  const { data: currentAdminUser } = useQuery({
    queryKey: ["/api/admin/current-user"],
    queryFn: async () => {
      const response = await adminApiRequest("GET", "/api/admin/current-user");
      return response.json();
    },
  });

  // Update taskData when currentAdminUser is loaded and also update super admin status
  useEffect(() => {
    if (currentAdminUser?.username) {
      console.log('=== DEBUG: Current admin user loaded ===');
      console.log('Current admin user:', currentAdminUser);
      console.log('Current admin user role:', currentAdminUser.role);
      
      setTaskData(prev => ({
        ...prev,
        assignedTo: currentAdminUser.id != null ? String(currentAdminUser.id) : currentAdminUser.username
      }));
      
      // Also check role from currentAdminUser (from API) - more reliable than token
      if (currentAdminUser.role) {
        const roleLower = (currentAdminUser.role || '').toLowerCase();
        const isSuperAdminRole = roleLower === 'administrator' || 
                                 roleLower === 'super_admin' || 
                                 currentAdminUser.role === 'Administrator' ||
                                 currentAdminUser.role === 'Super Admin';
        setIsSuperAdmin(isSuperAdminRole);
        console.log('Updated isSuperAdmin from currentAdminUser.role:', isSuperAdminRole);
      }
    }
  }, [currentAdminUser]);

  // Get current user's permissions
  const getUserPermissions = () => {
    if (!currentUserRole || !roles) return [];
    
    // Special case for super_admin - give all permissions
    if (currentUserRole === 'super_admin') {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]; // All permission IDs
    }
    
    const userRole = roles.find((role: any) => role.name === currentUserRole);
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
      'manage_new_members': 8, // Use potential_providers permission for now
    };

    const permissionId = permissionMap[permissionName];
    return permissionId ? userPermissions.includes(permissionId) : false;
  };



  const [emailData, setEmailData] = useState({
    subject: "",
    content: "",
  });
  const [emailMode, setEmailMode] = useState<'followup' | 'custom'>('followup');

  const [smsData, setSmsData] = useState({
    content: "",
  });

  // Check admin authentication and role
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin-login');
      return;
    }

    // Decode token to check role
    try {
      const tokenPayload = JSON.parse(atob(adminToken.split('.')[1]));
      const role = tokenPayload.role;
      setCurrentUserRole(role);
      // Check for super admin - case insensitive, also check for "Administrator"
      const roleLower = (role || '').toLowerCase();
      const isSuperAdminRole = roleLower === 'administrator' || 
                               roleLower === 'super_admin' || 
                               role === 'Administrator' ||
                               role === 'Super Admin';
      setIsSuperAdmin(isSuperAdminRole);
      setIsManager(roleLower === 'manager');
      
      console.log('=== DEBUG: User role loaded ===');
      console.log('User role:', role);
      console.log('Role (lowercase):', roleLower);
      console.log('Is super admin:', isSuperAdminRole);
      
      // If team member is on member-list view, redirect to list view
      if (currentAdminUser?.role === 'Team Member' && viewMode === 'member-list') {
        setViewMode('list');
      }
    } catch (error) {
      console.error('Error decoding admin token:', error);
      setIsSuperAdmin(false);
      setIsManager(false);
      setCurrentUserRole('admin');
    }
  }, [navigate, viewMode]);

  // Clear New Members selection when leaving the view
  useEffect(() => {
    if (viewMode !== 'member-list') setSelectedNewMemberIds(new Set());
  }, [viewMode]);

  // Dummy data for development/testing - DISABLED (using dynamic data from database)
  // All dummy data has been removed to use real database data

  // Fetch potential providers
  const { data: potentialProviders = [], isLoading } = useQuery({
    queryKey: ['/api/admin/potential-providers'],
    queryFn: async () => {
      const response = await adminApiRequest('GET', '/api/admin/potential-providers');
      const data = await response.json();
      console.log('=== DEBUG: Potential providers from API ===');
      console.log('Total providers:', data.length);
      if (data.length > 0) {
        console.log('First provider:', {
          id: data[0].id,
          name: `${data[0].firstName} ${data[0].lastName}`,
          assignedTo: data[0].assignedTo,
          taskTitle: data[0].taskTitle,
          status: data[0].status
        });
        // Log status distribution
        const statusCounts = data.reduce((acc: any, p: any) => {
          acc[p.status] = (acc[p.status] || 0) + 1;
          return acc;
        }, {});
        console.log('Status distribution:', statusCounts);
        console.log('Providers with tasks:', data.filter((p: any) => p.taskTitle).length);
        console.log('Providers without tasks:', data.filter((p: any) => !p.taskTitle).length);
      } else {
        console.log('⚠️ WARNING: API returned empty array!');
      }
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch service types (categories) from database for filter dropdown
  const { data: serviceCategories = [] } = useQuery({
    queryKey: ['/api/admin/service-categories'],
    queryFn: async () => {
      const response = await adminApiRequest('GET', '/api/admin/service-categories');
      const data = await response.json();
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });

  // Fetch team tasks for Kanban view
  const { data: kanbanTasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/admin/team-tasks/kanban', isSuperAdmin, currentUserRole],
    queryFn: async () => {
      try {
        let url = '/api/admin/team-tasks/kanban';
        
        // If super admin, fetch all tasks
        if (isSuperAdmin) {
          url += '?all=true';
        }
        // For all other users (managers, team members, etc), server will automatically
        // filter by assignedTo field to show only their assigned tasks
        
        console.log('Fetching kanban tasks for user role:', currentUserRole, 'isSuperAdmin:', isSuperAdmin);
        
        const response = await adminApiRequest('GET', url);
        return await response.json();
      } catch (error) {
        console.error('Error fetching team tasks:', error);
        return {
          overdue24h: [],
          overdue: [],
          today: [],
          tomorrow: [],
          upcoming: []
        };
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Create potential provider mutation
  const createProviderMutation = useMutation({
    mutationFn: async (providerData: any) => {
      const response = await adminApiRequest('POST', '/api/admin/potential-providers', providerData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/potential-providers'] });
      setIsCreateDialogOpen(false);
      setNewProvider({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        businessName: "",
        businessAbn: "",
        address: "",
        state: "",
        city: "",
        postcode: "",
        serviceCategories: "",
        priority: "medium",
        assignedTo: "",
        notes: "",
      });
    },
  });

  // Update potential provider mutation
  const updateProviderMutation = useMutation({
    mutationFn: async (updateData: { id: number; status?: string; nextFollowUpDate?: string }) => {
      const response = await adminApiRequest('PATCH', `/api/admin/potential-providers/${updateData.id}`, {
        ...(updateData.status && { status: updateData.status }),
        ...(updateData.nextFollowUpDate && { nextFollowUpDate: updateData.nextFollowUpDate }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/potential-providers'] });
    },
  });

  // Import providers mutation - NOW DIRECTLY INSERTS INTO DATABASE
  const importProvidersMutation = useMutation({
    mutationFn: async (importData: any) => {
      const response = await adminApiRequest('POST', '/api/admin/potential-providers/import', importData);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to import CSV' }));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: (data, variables) => {
      const inserted = data.inserted || 0;
      const skipped = data.skipped || 0;
      const message = data.message || '';
      
      // Refresh the providers list immediately since data is now in database
      queryClient.invalidateQueries({ queryKey: ['/api/admin/potential-providers'] });
      
      setIsImportDialogOpen(false);
      setImportData({ importName: "", csvData: "" });
      setCsvFile(null);
      setFieldMapping(null);
      
      // Show success message with insertion details - use server message if available
      const toastMessage = message || (inserted > 0 
        ? `✅ Successfully inserted ${inserted} potential providers into database!${skipped > 0 ? ` ${skipped} providers were skipped.` : ''}`
        : `⚠️ No providers were inserted. ${skipped} providers were skipped due to missing required fields.`);
      
      toast({
        title: inserted > 0 ? "Import Successful" : "Import Partially Successful",
        description: toastMessage,
        variant: inserted > 0 ? "default" : "default",
      });
    },
    onError: (error: any) => {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import CSV. Please check your CSV data and try again.",
        variant: "destructive",
      });
    },
  });

  // Confirm import mutation
  const confirmImportMutation = useMutation({
    mutationFn: async (pendingImport: PendingImport) => {
      // Add the providers to the actual list
      const response = await adminApiRequest('POST', '/api/admin/potential-providers/confirm-import', {
        importId: pendingImport.id,
        providers: pendingImport.providers,
      });
      return response.json();
    },
    onSuccess: (data, pendingImport) => {
      const inserted = data.inserted || data.count || 0;
      const skipped = data.skipped || 0;
      const errors = data.errors || [];

      // Remove from pending imports and refresh the main list
      setPendingImports(prev => prev.filter(imp => imp.id !== pendingImport.id));
      queryClient.invalidateQueries({ queryKey: ['/api/admin/potential-providers'] });
      setIsConfirmationDialogOpen(false);
      setSelectedPendingImport(null);

      // Show success/error message
      if (skipped > 0 || errors.length > 0) {
        toast({
          title: "Import Partially Successful",
          description: `Inserted ${inserted} providers. ${skipped} providers were skipped due to missing required fields (firstName, lastName, email, phone, address, city, state, postcode).`,
          variant: "default",
        });
      } else {
        toast({
          title: "Import Successful",
          description: `Successfully imported ${inserted} potential providers`,
          variant: "default",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import potential providers. Please check that all required fields (firstName, lastName, email, phone, address, city, state, postcode) are provided.",
        variant: "destructive",
      });
    },
  });

  // Reject import mutation
  const rejectImportMutation = useMutation({
    mutationFn: async (pendingImport: PendingImport) => {
      // Remove from pending imports
      setPendingImports(prev => prev.filter(imp => imp.id !== pendingImport.id));
      setIsConfirmationDialogOpen(false);
      setSelectedPendingImport(null);
    },
  });


  // Convert to actual provider mutation
  const convertToProviderMutation = useMutation({
    mutationFn: async (providerId: number) => {
      const response = await adminApiRequest('POST', `/api/admin/potential-providers/${providerId}/convert`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/potential-providers'] });
      setIsConvertDialogOpen(false);
      setSelectedProvider(null);
    },
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (taskData: any) => {
      const response = await adminApiRequest('POST', '/api/admin/potential-providers/tasks', taskData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/potential-providers'] });
      setIsTaskDialogOpen(false);
      setSelectedProvider(null);
      setTaskData({
        taskType: "general",
        title: "",
        description: "",
        scheduledDate: "",
        assignedTo: currentAdminUser?.username || "",
        priority: "P3",
        customerType: "all",
        comments: "",
        taskOwner: "admin"
      });
    },
  });

  // Bulk create tasks for selected New Members (Assigned To + Task type)
  const bulkCreateTasksMutation = useMutation({
    mutationFn: async ({
      providerIds,
      assignedTo,
      taskType,
      providersById,
    }: {
      providerIds: number[];
      assignedTo: string;
      taskType: string;
      providersById: Map<number, PotentialProvider>;
    }) => {
      const results = [];
      for (const id of providerIds) {
        const p = providersById.get(id);
        const title = p
          ? `${taskType.replace(/_/g, ' ')} - ${p.firstName} ${p.lastName}${p.businessName ? ` (${p.businessName})` : ''}`
          : `Task for provider #${id}`;
        const res = await adminApiRequest('POST', '/api/admin/potential-providers/tasks', {
          potentialProviderId: id,
          title,
          description: p ? `Contact ${p.firstName} ${p.lastName} regarding their potential provider application.` : '',
          taskType,
          assignedTo: assignedTo || null,
        });
        results.push(await res.json());
      }
      return results;
    },
    onSuccess: (_, variables) => {
      setSelectedNewMemberIds(new Set());
      queryClient.invalidateQueries({ queryKey: ['/api/admin/potential-providers'] });
      setToastMessage({
        type: 'success',
        title: 'Tasks created',
        description: `Created ${variables.providerIds.length} task(s) and assigned to selected admin.`,
      });
    },
    onError: (error: Error) => {
      setToastMessage({
        type: 'error',
        title: 'Bulk create failed',
        description: error?.message || 'Failed to create tasks.',
      });
    },
  });

  // Send email mutation
  const sendEmailMutation = useMutation({
    mutationFn: async (emailData: any) => {
      const response = await adminApiRequest('POST', '/api/admin/potential-providers/email', emailData);
      return response.json();
    },
    onSuccess: (data, variables) => {
      setIsEmailDialogOpen(false);
      setEmailData({ subject: "", content: "" });
      setEmailMode('followup');
      
      // Update provider status based on email mode
      if (selectedProvider) {
        const newStatus = variables.emailMode === 'followup' ? 'follow_up' : 'email';
        updateProviderMutation.mutate({
          id: selectedProvider.id,
          status: newStatus
        });
      }
      
      setToastMessage({
        type: 'success',
        title: "Email Sent",
        description: `Email sent successfully to ${selectedProvider?.firstName} ${selectedProvider?.lastName}`,
      });
    },
    onError: (error) => {
      setToastMessage({
        type: 'error',
        title: "Email Failed",
        description: error.message || "Failed to send email",
      });
    },
  });

  // Send SMS mutation
  const sendSmsMutation = useMutation({
    mutationFn: async (smsData: any) => {
      const response = await adminApiRequest('POST', '/api/admin/potential-providers/sms', smsData);
      return response.json();
    },
    onSuccess: () => {
      setIsSmsDialogOpen(false);
      setSmsData({ content: "" });
      
      // Update provider status to "SMS Sent"
      if (selectedProvider) {
        updateProviderMutation.mutate({
          id: selectedProvider.id,
          status: 'sms_sent'
        });
      }
      
      setToastMessage({
        type: 'success',
        title: "SMS Sent",
        description: `SMS sent successfully to ${selectedProvider?.firstName} ${selectedProvider?.lastName}`,
      });
    },
    onError: (error) => {
      setToastMessage({
        type: 'error',
        title: "SMS Failed",
        description: error.message || "Failed to send SMS",
      });
    },
  });

  // Create team task mutation
  const createTeamTaskMutation = useMutation({
    mutationFn: async (taskData: any) => {
      console.log('Mutation called with data:', taskData);
      const response = await adminApiRequest('POST', '/api/admin/team-tasks', taskData);
      const result = await response.json();
      console.log('Mutation response:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('Task created successfully:', data);
      // Invalidate all queries that start with the kanban key
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          return query.queryKey[0] === '/api/admin/team-tasks/kanban';
        }
      });
      setIsTaskDialogOpen(false);
      setTaskData({
        taskType: "general",
        title: "",
        description: "",
        scheduledDate: "",
        assignedTo: "",
        priority: "P3",
        customerType: "all",
        comments: "",
        taskOwner: "admin"
      });
    },
    onError: (error: Error) => {
      console.error('Error creating team task:', error);
    },
  });

  // Filter and organize providers into kanban columns
  useEffect(() => {
    console.log('🔥 useEffect TRIGGERED for Kanban!');
    console.log('potentialProviders:', potentialProviders?.length || 0);
    console.log('currentAdminUser:', currentAdminUser?.username);
    console.log('isSuperAdmin:', isSuperAdmin);
    
    if (potentialProviders) {
      console.log('=== DEBUG: Kanban columns update ===');
      console.log('Current user:', currentAdminUser?.username);
      console.log('Is super admin:', isSuperAdmin);
      console.log('Total providers:', potentialProviders.length);
      
      // Apply the same filtering logic as getFilteredProviders but for kanban view
      const selectedCategoryKanban = serviceTypeFilter === "all" ? null : (serviceCategories as { id: number; name: string }[]).find((c: { id: number; name: string }) => String(c.id) === serviceTypeFilter);
      const parseServiceCategories = (raw: string | undefined): string[] => {
        const s = raw?.trim();
        if (!s) return [];
        try {
          const parsed = JSON.parse(s);
          return Array.isArray(parsed) ? parsed.map((x: any) => String(x).trim()) : s.split(',').map((x: string) => x.trim());
        } catch {
          return s.split(',').map((x: string) => x.trim());
        }
      };
      const filtered = potentialProviders.filter((provider: PotentialProvider) => {
        const matchesSearch = searchTerm === "" || 
          provider.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          provider.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          provider.phone.includes(searchTerm) ||
          (provider.businessName && provider.businessName.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === "all" || 
          provider.status === statusFilter ||
          (statusFilter === "sms_1st" && (provider as any).smsDeliveryStatus === "1st_sent") ||
          (statusFilter === "sms_2nd" && (provider as any).smsDeliveryStatus === "2nd_sent");
        const matchesPriority = priorityFilter === "all" || provider.priority === priorityFilter;
        const matchesAssignedTo = assignedToFilter === "all" || 
          (assignedToFilter === "unassigned" && (!provider.taskAssignedTo || provider.taskAssignedTo === "")) ||
          provider.taskAssignedTo === assignedToFilter ||
          (adminUsers.find((u: any) => String(u.id) === assignedToFilter)?.username === provider.taskAssignedTo);
        const matchesSource = sourceFilter === "all" || provider.source === sourceFilter;
        const providerCats = parseServiceCategories(provider.serviceCategories);
        const matchesServiceType = !selectedCategoryKanban || providerCats.some((item: string) => item.toLowerCase() === selectedCategoryKanban.name.toLowerCase() || item.toLowerCase().includes(selectedCategoryKanban.name.toLowerCase()));
        
        // Exclude won, lost, and new providers from kanban view, and only show providers with tasks
        const isNotWonOrLost = provider.status !== 'won' && provider.status !== 'lost' && provider.status !== 'new';
        const hasTask = provider.taskTitle && provider.taskTitle.trim() !== '';
        
        // For non-super-admin users, show providers assigned to them OR unassigned (null)
        const isAssignedToCurrentUser = isSuperAdmin || !currentAdminUser?.username || 
          provider.taskAssignedTo === currentAdminUser.username || 
          provider.taskAssignedTo === null || 
          provider.taskAssignedTo === '' ||
          (currentAdminUser.id != null && String(provider.taskAssignedTo) === String(currentAdminUser.id));

        // Debug filtering for first few providers
        if (potentialProviders.indexOf(provider) < 3) {
          console.log(`Provider ${provider.firstName}:`, {
            matchesSearch,
            matchesStatus,
            matchesPriority,
            matchesAssignedTo,
            matchesSource,
            matchesServiceType,
            isNotWonOrLost,
            hasTask: !!hasTask,
            taskTitle: provider.taskTitle,
            taskAssignedTo: provider.taskAssignedTo,
            taskAssignedToName: provider.taskAssignedToName,
            isAssignedToCurrentUser,
            assignedTo: provider.assignedTo,
            currentUser: currentAdminUser?.username,
            status: provider.status,
            PASSES: matchesSearch && matchesStatus && matchesPriority && matchesAssignedTo && matchesSource && matchesServiceType && isNotWonOrLost && hasTask && isAssignedToCurrentUser
          });
        }

        return matchesSearch && matchesStatus && matchesPriority && matchesAssignedTo && matchesSource && matchesServiceType && isNotWonOrLost && hasTask && isAssignedToCurrentUser;
      });
      
      console.log('Filtered providers for Kanban:', filtered.length);
      if (filtered.length > 0) {
        console.log('First filtered provider:', {
          name: `${filtered[0].firstName} ${filtered[0].lastName}`,
          assignedTo: filtered[0].assignedTo,
          taskTitle: filtered[0].taskTitle,
          taskAssignedTo: filtered[0].taskAssignedTo,
          taskAssignedToName: filtered[0].taskAssignedToName
        });
      }

      const updatedColumns = KANBAN_COLUMNS.map(column => ({
        ...column,
        providers: filtered.filter((provider: PotentialProvider) => {
          // Organize providers by time/urgency based on their nextFollowUpDate or createdAt
          const now = new Date();
          const providerDate = provider.nextFollowUpDate ? new Date(provider.nextFollowUpDate) : new Date(provider.createdAt);
          const daysDiff = Math.ceil((providerDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          // Debug first provider in each iteration
          if (filtered.indexOf(provider) === 0) {
            console.log('Sample provider date calculation:', {
              provider: `${provider.firstName} ${provider.lastName}`,
              nextFollowUpDate: provider.nextFollowUpDate,
              createdAt: provider.createdAt,
              providerDate: providerDate.toISOString(),
              daysDiff,
              column: column.id
            });
          }
          
          switch (column.id) {
            case 'overdue24h':
              return daysDiff < -1; // Overdue by more than 24 hours
            case 'overdue':
              return daysDiff >= -1 && daysDiff < 0; // Overdue but within 24 hours
            case 'today':
              return daysDiff === 0; // Due today
            case 'tomorrow':
              return daysDiff === 1; // Due tomorrow
            case 'upcoming':
              return daysDiff > 1; // Due in the future
            default:
              return false;
          }
        })
      }));
      
      console.log('Updated Kanban columns:', updatedColumns.map(col => ({
        id: col.id,
        title: col.title,
        count: col.providers.length
      })));

      setKanbanColumns(updatedColumns);
      
      // Update arrow visibility after columns are updated
      setTimeout(() => {
        updateArrowVisibility();
      }, 100);
    }
  }, [potentialProviders, searchTerm, statusFilter, priorityFilter, assignedToFilter, sourceFilter, serviceTypeFilter, serviceCategories, isSuperAdmin, currentAdminUser]);

  // Update arrow visibility based on scroll position
  const updateArrowVisibility = () => {
    if (!kanbanRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = kanbanRef.current;
    const isAtStart = scrollLeft <= 0;
    const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 1; // -1 for rounding errors
    
    setShowLeftArrow(!isAtStart);
    setShowRightArrow(!isAtEnd);
  };

  // Add scroll event listener
  useEffect(() => {
    if (viewMode !== 'kanban' || !kanbanRef.current) return;
    
    const handleScroll = () => {
      updateArrowVisibility();
    };
    
    kanbanRef.current.addEventListener('scroll', handleScroll);
    
    // Initial check
    updateArrowVisibility();
    
    // Add resize observer to handle window resizing
    const resizeObserver = new ResizeObserver(() => {
      updateArrowVisibility();
    });
    resizeObserver.observe(kanbanRef.current);
    
    return () => {
      if (kanbanRef.current) {
        kanbanRef.current.removeEventListener('scroll', handleScroll);
      }
      resizeObserver.disconnect();
    };
  }, [viewMode, kanbanColumns]);

  // List view: the Table component renders an inner div (relative w-full overflow-auto) - that's the actual scroll container
  const getListViewScrollEl = (): HTMLElement | null => {
    const container = listViewTableRef.current;
    if (!container) return null;
    const inner = container.firstElementChild as HTMLElement | null;
    return inner ?? container;
  };

  const updateListViewArrowVisibility = () => {
    const el = getListViewScrollEl();
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const isAtStart = scrollLeft <= 0;
    const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 1;
    setShowListViewLeftArrow(!isAtStart);
    setShowListViewRightArrow(!isAtEnd);
  };

  const scrollListView = (delta: number) => {
    const el = getListViewScrollEl();
    if (el) {
      el.scrollBy({ left: delta, behavior: 'smooth' });
      // Update arrow visibility after scroll (smooth scroll may not fire 'scroll' in time)
      requestAnimationFrame(() => updateListViewArrowVisibility());
      setTimeout(updateListViewArrowVisibility, 150);
      setTimeout(updateListViewArrowVisibility, 400);
    }
  };

  useEffect(() => {
    if (viewMode !== 'list') return;
    const el = getListViewScrollEl();
    if (!el) {
      const t = setTimeout(updateListViewArrowVisibility, 100);
      return () => clearTimeout(t);
    }
    const handleScroll = () => updateListViewArrowVisibility();
    el.addEventListener('scroll', handleScroll);
    updateListViewArrowVisibility();
    const resizeObserver = new ResizeObserver(() => updateListViewArrowVisibility());
    resizeObserver.observe(el);
    return () => {
      el.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, [viewMode]);

  // Handle drag and drop

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  const handleCreateProvider = () => {
    createProviderMutation.mutate({
      ...newProvider,
      status: 'new' // Ensure new providers start in member list
    });
  };

  const handleCsvFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    
    // Read file content
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setImportData(prev => ({ ...prev, csvData: text }));
      // Field mapping will be shown in confirmation dialog after import
    };
    reader.readAsText(file);
  };

  const handleCsvDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setImportData(prev => ({ ...prev, csvData: text }));
    // Clear field mapping when data changes - will be shown after import
    if (!text.trim()) {
      setFieldMapping(null);
    }
  };

  const handleImportProviders = () => {
    if (!importData.csvData.trim()) {
      toast({
        title: "Error",
        description: "Please provide CSV data or upload a CSV file",
        variant: "destructive"
      });
      return;
    }
    importProvidersMutation.mutate({
      ...importData,
      defaultStatus: 'new' // Ensure imported providers start in member list
    });
  };

  const handleConfirmImport = (pendingImport: PendingImport) => {
    setSelectedPendingImport(pendingImport);
    setIsConfirmationDialogOpen(true);
  };

  const handleConfirmImportYes = () => {
    if (selectedPendingImport) {
      confirmImportMutation.mutate(selectedPendingImport);
    }
  };

  const handleConfirmImportNo = () => {
    if (selectedPendingImport) {
      rejectImportMutation.mutate(selectedPendingImport);
    }
  };

  const handleCreateTask = () => {
    if (selectedProvider) {
      createTaskMutation.mutate({
        ...taskData,
        potentialProviderId: selectedProvider.id,
      });
    }
  };

  const handleProviderStatusChange = (providerId: number, newStatus: string) => {
    // Update provider status via API
    updateProviderMutation.mutate({
      id: providerId,
      status: newStatus,
    });
  };

  const handleProviderTimeChange = (providerId: number, columnId: string) => {
    // Calculate new follow-up date based on column
    const now = new Date();
    let newFollowUpDate;
    
    switch (columnId) {
      case 'overdue24h':
        newFollowUpDate = new Date(now.getTime() - (2 * 24 * 60 * 60 * 1000)); // 2 days ago
        break;
      case 'overdue':
        newFollowUpDate = new Date(now.getTime() - (12 * 60 * 60 * 1000)); // 12 hours ago
        break;
      case 'today':
        newFollowUpDate = new Date(now.getTime()); // Today
        break;
      case 'tomorrow':
        newFollowUpDate = new Date(now.getTime() + (24 * 60 * 60 * 1000)); // Tomorrow
        break;
      case 'upcoming':
        newFollowUpDate = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000)); // 3 days from now
        break;
      default:
        return;
    }

    // Update provider follow-up date via API
    updateProviderMutation.mutate({
      id: providerId,
      nextFollowUpDate: newFollowUpDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
    });
  };

  const handleSendEmail = () => {
    if (selectedProvider) {
      sendEmailMutation.mutate({
        ...emailData,
        potentialProviderId: selectedProvider.id,
        emailMode: emailMode, // Include email mode for status update
      });
    }
  };

  const handleSendSms = () => {
    if (selectedProvider) {
      sendSmsMutation.mutate({
        ...smsData,
        potentialProviderId: selectedProvider.id,
      });
    }
  };

  const handleConvertToProvider = () => {
    if (selectedProvider) {
      convertToProviderMutation.mutate(selectedProvider.id);
    }
  };

  const handleCreateTeamTask = () => {
    // Validate required fields
    if (!taskData.title || !taskData.scheduledDate) {
      alert('Please fill in all required fields (Title and Due Date)');
      return;
    }

    // Prepare task data for API
    const teamTaskData = {
      title: taskData.title,
      description: taskData.description || '',
      priority: taskData.priority || 'P3',
      dueDate: new Date(taskData.scheduledDate).toISOString(), // Convert to ISO string
      adminId: taskData.taskOwner || 'admin', // Use selected task owner or default to admin
      assignedTo: taskData.assignedTo || null,
      taskType: taskData.taskType || 'general',
      comments: taskData.comments || '',
      status: 'pending',
      // Set customer type based on selection
      ...(taskData.customerType === 'potential_provider' && { potentialProviderId: null }),
      ...(taskData.customerType === 'provider' && { providerId: null }),
      ...(taskData.customerType === 'customer' && { customerId: null }),
    };

    console.log('Creating team task with data:', teamTaskData);
    createTeamTaskMutation.mutate(teamTaskData);
  };

  const handleTaskMove = async (taskId: number, fromColumn: string, toColumn: string) => {
    if (fromColumn === toColumn) return;

    try {
      // Update task status based on the new column
      let newStatus = 'pending';
      switch (toColumn) {
        case 'overdue24h':
        case 'overdue':
          newStatus = 'overdue';
          break;
        case 'today':
          newStatus = 'today';
          break;
        case 'tomorrow':
          newStatus = 'tomorrow';
          break;
        case 'upcoming':
          newStatus = 'upcoming';
          break;
        default:
          newStatus = 'pending';
      }

      // Call API to update task status
      await adminApiRequest('PUT', `/api/admin/team-tasks/${taskId}`, {
        status: newStatus
      });

      // Refresh the kanban data
      queryClient.invalidateQueries({ queryKey: ['/api/admin/team-tasks/kanban'] });
    } catch (error) {
      console.error('Error moving task:', error);
    }
  };


  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-500";
      case "active": return "bg-green-500";
      case "first_call": return "bg-purple-500";
      case "follow_up": return "bg-orange-500";
      case "email": return "bg-indigo-500";
      case "sms_1st": return "bg-cyan-500";
      case "sms_2nd": return "bg-teal-500";
      case "won": return "bg-emerald-500";
      case "lost": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusLabel = (provider: any) => {
    if (provider.smsDeliveryStatus === '1st_sent') return '1st SMS';
    if (provider.smsDeliveryStatus === '2nd_sent') return '2nd SMS';
    
    switch (provider.status) {
      case "new": return "New";
      case "active": return "Active";
      case "first_call": return "First Call";
      case "follow_up": return "Follow Up";
      case "email": return "Email";
      case "won": return "Won";
      case "lost": return "Lost";
      default: return provider.status;
    }
  };

  const getStatusCount = (status: string) => {
    return kanbanColumns.find(col => col.id === status)?.providers.length || 0;
  };

  // Get team member by username or by id (when assignedTo stores admin user id as number or string "1")
  const getTeamMemberByAssignedTo = (assignedTo: string | number | undefined | null): { firstName: string; lastName: string } | undefined => {
    if (assignedTo === undefined || assignedTo === null) return undefined;
    const s = String(assignedTo).trim();
    if (!s) return undefined;
    const first = (u: any) => u?.firstName ?? u?.first_name ?? '';
    const last = (u: any) => u?.lastName ?? u?.last_name ?? '';
    // If it looks like a numeric id, try finding by id first (loose equality: 1 == "1")
    if (/^\d+$/.test(s)) {
      const numId = parseInt(s, 10);
      const byId = adminUsers.find((u: any) => u?.id != null && (Number(u.id) === numId || String(u.id) === s));
      if (byId) return { firstName: first(byId), lastName: last(byId) };
    }
    // Otherwise try by username
    const byUsername = adminUsers.find((u: any) => u?.username === s);
    return byUsername ? { firstName: first(byUsername), lastName: last(byUsername) } : undefined;
  };

  // Get team member name from username or id
  const getTeamMemberName = (usernameOrId: string | number) => {
    const user = getTeamMemberByAssignedTo(usernameOrId);
    return user ? `${user.firstName} ${user.lastName}` : String(usernameOrId);
  };

  // Get team member object from username or id
  const getTeamMember = (usernameOrId: string | number | undefined | null) => {
    if (usernameOrId === undefined || usernameOrId === null) return undefined;
    const s = String(usernameOrId).trim();
    if (!s) return undefined;
    if (/^\d+$/.test(s)) {
      const numId = parseInt(s, 10);
      const byId = adminUsers.find((u: any) => u?.id != null && (Number(u.id) === numId || String(u.id) === s));
      if (byId) return byId;
    }
    return adminUsers.find((u: any) => u?.username === s);
  };

  // Resolve assigned-to display name: API assignedAdminName (skip if it's just an id like "1"), or lookup from adminUsers by assignedTo (id or username), or 'Unassigned'
  const getAssignedDisplayName = (provider: { assignedAdminName?: string; assignedTo?: string | number | null }) => {
    const fromApi = provider.assignedAdminName != null ? String(provider.assignedAdminName).trim() : '';
    // Don't use API value if it looks like a numeric id (e.g. "1" or 1)
    if (fromApi && !/^\d+$/.test(fromApi)) return fromApi;
    const to = provider.assignedTo;
    if (to !== undefined && to !== null && String(to).trim() !== '') return getTeamMemberName(to);
    return 'Unassigned';
  };

  // Initials for assigned-to avatar (2 chars max)
  const getAssignedInitials = (provider: { assignedAdminName?: string; assignedTo?: string | null }) => {
    const displayName = getAssignedDisplayName(provider);
    if (displayName === 'Unassigned') return '?';
    const parts = displayName.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    return displayName.slice(0, 2).toUpperCase() || '?';
  };

  const hasAssignedUser = (provider: { assignedAdminName?: string; assignedTo?: string | number | null }) =>
    (provider.assignedAdminName && provider.assignedAdminName.trim() !== '') || (provider.assignedTo !== undefined && provider.assignedTo !== null && String(provider.assignedTo).trim() !== '');

  // Task assignee (from potential_provider_tasks) — use this for display/filter instead of provider-level assignedTo
  const getTaskAssignedDisplayName = (provider: { taskAssignedToName?: string; taskAssignedTo?: string | null }) => {
    const name = provider.taskAssignedToName != null ? String(provider.taskAssignedToName).trim() : '';
    if (name) return name;
    const to = provider.taskAssignedTo;
    if (to !== undefined && to !== null && String(to).trim() !== '') return getTeamMemberName(to);
    return 'Unassigned';
  };
  const getTaskAssignedInitials = (provider: { taskAssignedToName?: string; taskAssignedTo?: string | null }) => {
    const displayName = getTaskAssignedDisplayName(provider);
    if (displayName === 'Unassigned') return '?';
    const parts = displayName.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    return displayName.slice(0, 2).toUpperCase() || '?';
  };
  const hasTaskAssignedUser = (provider: { taskAssignedToName?: string; taskAssignedTo?: string | null }) =>
    (provider.taskAssignedToName && provider.taskAssignedToName.trim() !== '') || (provider.taskAssignedTo !== undefined && provider.taskAssignedTo !== null && String(provider.taskAssignedTo).trim() !== '');

  const totalProviders = potentialProviders?.length || 0;
  const filteredCount = kanbanColumns.reduce((sum, col) => sum + col.providers.length, 0);
  const wonProviders = potentialProviders?.filter((p: PotentialProvider) => p.status === 'won') || [];
  const lostProviders = potentialProviders?.filter((p: PotentialProvider) => p.status === 'lost') || [];
  const activeProviders = potentialProviders?.filter((p: PotentialProvider) => p.status !== 'won' && p.status !== 'lost') || [];
  const newProviders = potentialProviders?.filter((p: PotentialProvider) => p.status === 'new') || [];

  // Helper: parse provider serviceCategories (JSON array or comma-separated) and check if it includes the given category name
  const providerMatchesServiceType = (provider: PotentialProvider, categoryName: string): boolean => {
    const raw = provider.serviceCategories?.trim();
    if (!raw) return false;
    let items: string[] = [];
    try {
      const parsed = JSON.parse(raw);
      items = Array.isArray(parsed) ? parsed.map((x: any) => String(x).trim()) : raw.split(',').map((s: string) => s.trim());
    } catch {
      items = raw.split(',').map((s: string) => s.trim());
    }
    const nameLower = categoryName.toLowerCase();
    return items.some((item: string) => item.toLowerCase() === nameLower || item.toLowerCase().includes(nameLower));
  };

  // Filter providers based on current view
  const getFilteredProviders = () => {
    if (!potentialProviders) return [];
    
    const selectedCategory = serviceTypeFilter === "all" ? null : (serviceCategories as { id: number; name: string }[]).find((c: { id: number; name: string }) => String(c.id) === serviceTypeFilter);
    
    const filtered = potentialProviders.filter((provider: PotentialProvider) => {
      const matchesSearch = searchTerm === "" || 
        provider.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.phone.includes(searchTerm) ||
        (provider.businessName && provider.businessName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === "all" || 
        provider.status === statusFilter ||
        (statusFilter === "sms_1st" && (provider as any).smsDeliveryStatus === "1st_sent") ||
        (statusFilter === "sms_2nd" && (provider as any).smsDeliveryStatus === "2nd_sent");
      const matchesPriority = priorityFilter === "all" || provider.priority === priorityFilter;
      const matchesAssignedTo = assignedToFilter === "all" || 
        (assignedToFilter === "unassigned" && (!provider.taskAssignedTo || provider.taskAssignedTo === "")) ||
        provider.taskAssignedTo === assignedToFilter ||
        (adminUsers.find((u: any) => String(u.id) === assignedToFilter)?.username === provider.taskAssignedTo);
      const matchesSource = sourceFilter === "all" || provider.source === sourceFilter;
      const matchesServiceType = !selectedCategory || providerMatchesServiceType(provider, selectedCategory.name);

      return matchesSearch && matchesStatus && matchesPriority && matchesAssignedTo && matchesSource && matchesServiceType;
    });

    // Debug: Log current state
    console.log('=== DEBUG: Filtering logic ===');
    console.log('Current user:', currentAdminUser?.username);
    console.log('Current user role:', currentAdminUser?.role);
    console.log('Is super admin:', isSuperAdmin);
    console.log('Filtered providers before user filter:', filtered.length);
    
    // Apply user filtering logic (same as Kanban view)
    const userFiltered = filtered.filter((provider: PotentialProvider) => {
      // If super admin, show all
      if (isSuperAdmin) {
        return true;
      }
      
      // If user data not loaded yet, show all
      if (!currentAdminUser?.username) {
        return true;
      }
      
      // Show if assigned to current user OR if not assigned to anyone (null/empty)
      const isAssignedToCurrentUser = provider.taskAssignedTo === currentAdminUser.username || 
        provider.taskAssignedTo === null || 
        provider.taskAssignedTo === '' ||
        (currentAdminUser.id != null && String(provider.taskAssignedTo) === String(currentAdminUser.id));
      console.log('Provider taskAssignedTo:', provider.taskAssignedTo, 'Current user:', currentAdminUser?.username, 'Is super admin:', isSuperAdmin, 'Show:', isAssignedToCurrentUser);
      return isAssignedToCurrentUser;
    });
    
    console.log('Filtered providers after user filter:', userFiltered.length);

    if (viewMode === 'completed') {
      return userFiltered.filter((p: PotentialProvider) => p.status === 'won');
    }
    
    if (viewMode === 'lost') {
      return userFiltered.filter((p: PotentialProvider) => p.status === 'lost');
    }
    
    if (viewMode === 'member-list') {
      return userFiltered.filter((p: PotentialProvider) => p.status === 'new');
    }
    
    if (viewMode === 'kanban') {
      // Kanban view: providers with tasks (excluding new), same assignment rules as list
      return userFiltered.filter((p: PotentialProvider) => 
        p.status !== 'won' && 
        p.status !== 'lost' && 
        p.status !== 'new' && 
        p.taskTitle && 
        p.taskTitle.trim() !== ''
      );
    }
    
    // List view: same list as kanban - providers with tasks only (excluding new).
    // Assigned users see their assigned providers; administrators see all.
    return userFiltered.filter((p: PotentialProvider) => 
      p.status !== 'won' && 
      p.status !== 'lost' && 
      p.status !== 'new' && 
      p.taskTitle && 
      p.taskTitle.trim() !== ''
    );
  };

  const filteredProviders = getFilteredProviders();
  
  // Debug: Log filtered providers
  console.log('=== DEBUG: Filtered providers ===');
  console.log('View mode:', viewMode);
  console.log('Total providers from API:', potentialProviders?.length || 0);
  console.log('Total filtered providers:', filteredProviders.length);
  console.log('Current page:', currentPage);
  console.log('Items per page:', itemsPerPage);
  if (potentialProviders && potentialProviders.length > 0) {
    const statusCounts = potentialProviders.reduce((acc: any, p: any) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {});
    console.log('Status distribution in API data:', statusCounts);
    console.log('New providers:', newProviders.length);
    console.log('Active providers (not won/lost):', activeProviders.length);
  }
  if (filteredProviders.length > 0) {
    console.log('First filtered provider:', {
      id: filteredProviders[0].id,
      name: `${filteredProviders[0].firstName} ${filteredProviders[0].lastName}`,
      assignedTo: filteredProviders[0].assignedTo,
      taskTitle: filteredProviders[0].taskTitle,
      taskAssignedTo: filteredProviders[0].taskAssignedTo,
      taskAssignedToName: filteredProviders[0].taskAssignedToName,
      status: filteredProviders[0].status
    });
  } else {
    console.log('⚠️ No filtered providers found!');
    console.log('Potential reasons:');
    console.log('- View mode filters:', viewMode);
    console.log('- Status filter:', statusFilter);
    console.log('- Search term:', searchTerm);
    console.log('- Assigned filter:', assignedToFilter);
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProviders = filteredProviders.slice(startIndex, endIndex);
  
  // Debug: Log pagination
  console.log('=== DEBUG: Pagination ===');
  console.log('Total pages:', totalPages);
  console.log('Start index:', startIndex);
  console.log('End index:', endIndex);
  console.log('Paginated providers:', paginatedProviders.length);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
        <AdminSidebar 
          onLogout={handleLogout} 
          adminUser={currentAdminUser}
        />
      </div>
      
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto relative z-10">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-sm dark:bg-gray-800 shadow-lg shadow-slate-200/20 border-b border-slate-200/50 dark:border-gray-700">
          <div className="px-8 py-3" style={{ paddingTop: '1.2rem', paddingBottom: '0.8rem' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                  <UserSearch className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Potential Providers
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Manage potential service providers before they become actual providers
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button onClick={() => setIsImportDialogOpen(true)} variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Provider
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* View Mode Tabs */}
        <div className="px-8 py-4 bg-white/95 backdrop-blur-sm dark:bg-gray-800 border-b border-slate-200/50 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {/* Hide "New Members" tab for team members only */}
              {currentAdminUser?.role !== 'Team Member' && (
                <Button
                  variant={viewMode === 'member-list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('member-list')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                    viewMode === 'member-list' 
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span className="font-medium">New Members (New) ({newProviders.length})</span>
                </Button>
              )}
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <List className="h-4 w-4" />
                <span className="font-medium">List View</span>
              </Button>
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  viewMode === 'kanban' 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Kanban className="h-4 w-4" />
                <span className="font-medium">Kanban View</span>
              </Button>
              
              {/* New Member List - only show for managers */}
              {isManager && (
                <Button
                  variant={viewMode === 'new-member-list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('new-member-list')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                    viewMode === 'new-member-list' 
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span className="font-medium">New Member List</span>
                </Button>
              )}
            </div>
            
            {/* Create Task Button - Hidden as per user request */}
            {/* {viewMode === 'kanban' && (
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => setIsTaskDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
                {isSuperAdmin && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    <Crown className="h-3 w-3 mr-1" />
                    Super Admin - All Tasks
                  </Badge>
                )}
              </div>
            )} */}
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="completed-filter"
                  checked={viewMode === 'completed'}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setViewMode('completed');
                    } else {
                      setViewMode('member-list');
                    }
                  }}
                />
                <Label htmlFor="completed-filter" className="text-sm font-medium">
                  Won ({wonProviders.length})
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="lost-filter"
                  checked={viewMode === 'lost'}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setViewMode('lost');
                    } else {
                      setViewMode('member-list');
                    }
                  }}
                />
                <Label htmlFor="lost-filter" className="text-sm font-medium">
                  Lost ({lostProviders.length})
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="px-8 py-6 bg-white/95 backdrop-blur-sm dark:bg-gray-800 border-b border-slate-200/50 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  queryClient.invalidateQueries({ queryKey: ['/api/admin/potential-providers'] });
                }}
                className="h-10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36 h-10">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="first_call">First Call</SelectItem>
                  <SelectItem value="follow_up">Follow Up</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms_1st">1st SMS</SelectItem>
                  <SelectItem value="sms_2nd">2nd SMS</SelectItem>
                  {/* <SelectItem value="won">Won</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem> */}
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-36 h-10">
                  <SelectValue placeholder="All Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-36 h-10">
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="import">Import</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                </SelectContent>
              </Select>

              <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
                <SelectTrigger className="w-40 h-10">
                  <SelectValue placeholder="All Service Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Service Types</SelectItem>
                  {(serviceCategories as { id: number; name: string }[]).map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={assignedToFilter} onValueChange={setAssignedToFilter}>
                <SelectTrigger className="w-40 h-10">
                  <SelectValue placeholder="All Assigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assigned</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {adminUsers.map((user: any) => (
                    <SelectItem key={user.id} value={String(user.id)}>
                      {user.firstName} {user.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Task-specific filters for Kanban view */}
              {viewMode === 'kanban' && (
                <>
                  <Select value={taskPriorityFilter} onValueChange={setTaskPriorityFilter}>
                    <SelectTrigger className="w-36 h-10">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="P1">P1</SelectItem>
                      <SelectItem value="P2">P2</SelectItem>
                      <SelectItem value="P3">P3</SelectItem>
                      <SelectItem value="P4">P4</SelectItem>
                      <SelectItem value="P5">P5</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={taskCustomerTypeFilter} onValueChange={setTaskCustomerTypeFilter}>
                    <SelectTrigger className="w-40 h-10">
                      <SelectValue placeholder="Customer Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="potential_provider">Potential Provider</SelectItem>
                      <SelectItem value="provider">Provider</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>

            {/* Counts - Hidden as per user request */}
            {/* <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400 font-medium">
              <span>Total: {totalProviders}</span>
              <span>New: {newProviders.length}</span>
              <span>Active: {activeProviders.length}</span>
              <span>Won: {wonProviders.length}</span>
            </div> */}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pt-4 pb-8 min-h-screen">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading potential providers...</p>
            </div>
          ) : (
            <>
              {/* Show message for team members */}
              {currentAdminUser?.role === 'Team Member' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Team Member Access
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300">
                    As a team member, you can view and manage tasks assigned to you. 
                    Use the List View or Kanban View to see your assigned tasks.
                  </p>
                </div>
              )}

              {viewMode === 'member-list' && currentAdminUser?.role !== 'Team Member' && (
                <div className="space-y-6">
                  {/* Pending Imports Section */}
                  {pendingImports.length > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 flex items-center">
                          <AlertCircle className="h-5 w-5 mr-2" />
                          Pending Imports ({pendingImports.length})
                        </h3>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          Awaiting Confirmation
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        {pendingImports.map((pendingImport) => (
                          <div key={pendingImport.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {pendingImport.importName}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {pendingImport.providers.length} providers imported at {pendingImport.createdAt.toLocaleString()}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() => handleConfirmImport(pendingImport)}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Review
                                </Button>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <p>These providers will not appear in the main list until confirmed.</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-white/90 backdrop-blur-sm border-slate-200/50 shadow-lg shadow-slate-200/20 hover:shadow-xl hover:shadow-slate-300/30 transition-all duration-300 dark:bg-gray-800 rounded-lg">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                        <Users className="h-5 w-5 text-blue-600 mr-2" />
                        New Members (New) ({filteredProviders.length})
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Review new potential providers and create tasks for follow-up
                      </p>
                      {/* Bulk assign bar when at least one member selected */}
                      {selectedNewMemberIds.size > 0 && (
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 flex flex-wrap items-center gap-4">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {selectedNewMemberIds.size} selected
                          </span>
                          <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Assigned To</label>
                            <Select value={bulkAssignedTo} onValueChange={setBulkAssignedTo}>
                              <SelectTrigger className="w-44 h-9">
                                <SelectValue placeholder="Select admin" />
                              </SelectTrigger>
                              <SelectContent>
                                {adminUsers.map((user: any) => (
                                  <SelectItem key={user.id} value={String(user.id)}>
                                    {user.firstName} {user.lastName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Task type</label>
                            <Select value={bulkTaskType} onValueChange={setBulkTaskType}>
                              <SelectTrigger className="w-36 h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="follow_up">Follow up</SelectItem>
                                <SelectItem value="call">Call</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="sms">SMS</SelectItem>
                                <SelectItem value="note">Note</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            onClick={() => {
                              if (!bulkAssignedTo?.trim()) {
                                setToastMessage({ type: 'error', title: 'Select admin', description: 'Please select an admin for Assigned To.' });
                                return;
                              }
                              const ids = Array.from(selectedNewMemberIds);
                              const providersById = new Map<number, PotentialProvider>(
                                (potentialProviders || []).map((p: PotentialProvider) => [p.id, p] as [number, PotentialProvider])
                              );
                              bulkCreateTasksMutation.mutate({
                                providerIds: ids,
                                assignedTo: bulkAssignedTo,
                                taskType: bulkTaskType,
                                providersById,
                              });
                            }}
                            disabled={bulkCreateTasksMutation.isPending || !bulkAssignedTo?.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            size="sm"
                          >
                            {bulkCreateTasksMutation.isPending ? 'Creating...' : `Create tasks for ${selectedNewMemberIds.size} members`}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedNewMemberIds(new Set())}>
                            Clear selection
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      {filteredProviders.length === 0 ? (
                        <div className="text-center py-8">
                          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No new members</h3>
                          <p className="text-gray-500">All new potential providers have been processed.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                            <Checkbox
                              id="new-members-select-all"
                              checked={paginatedProviders.length > 0 && paginatedProviders.every((p: PotentialProvider) => selectedNewMemberIds.has(p.id))}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedNewMemberIds((prev) => new Set([...Array.from(prev), ...paginatedProviders.map((p: PotentialProvider) => p.id)]));
                                } else {
                                  const pageIds = new Set(paginatedProviders.map((p: PotentialProvider) => p.id));
                                  setSelectedNewMemberIds((prev) => new Set(Array.from(prev).filter((id) => !pageIds.has(id))));
                                }
                              }}
                            />
                            <label htmlFor="new-members-select-all" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                              Select all on this page
                            </label>
                          </div>
                          <div className="grid gap-3">
                          {paginatedProviders.map((provider: PotentialProvider) => (
                            <div
                              key={provider.id}
                              role="button"
                              tabIndex={0}
                              onClick={() => {
                                setSelectedProvider(provider);
                                setIsViewDetailsDialogOpen(true);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  setSelectedProvider(provider);
                                  setIsViewDetailsDialogOpen(true);
                                }
                              }}
                              className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all flex items-start gap-3 cursor-pointer"
                            >
                              <div className="pt-0.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                  id={`new-member-${provider.id}`}
                                  checked={selectedNewMemberIds.has(provider.id)}
                                  onCheckedChange={(checked) => {
                                    setSelectedNewMemberIds((prev) => {
                                      const next = new Set(prev);
                                      if (checked) next.add(provider.id);
                                      else next.delete(provider.id);
                                      return next;
                                    });
                                  }}
                                />
                              </div>
                              <div className="w-9 h-9 flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                                  {provider.firstName.charAt(0)}{provider.lastName.charAt(0)}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                                    {provider.firstName} {provider.lastName}
                                  </h3>
                                  <span className="text-gray-500 dark:text-gray-400 text-xs truncate max-w-[200px]" title={provider.email}>
                                    {provider.email}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-0 text-xs text-gray-600 dark:text-gray-400">
                                  <span>Phone: {provider.phone}</span>
                                  <span>Business: {(provider.businessName || 'N/A')}</span>
                                  <span>{provider.city}, {provider.state} {provider.postcode}</span>
                                  <span>Services: {provider.serviceCategories || 'N/A'}</span>
                                </div>
                                {provider.notes && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate max-w-full" title={provider.notes}>
                                    Notes: {provider.notes}
                                  </p>
                                )}
                              </div>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedProvider(provider);
                                  setTaskData({
                                    taskType: "follow_up",
                                    title: `Follow up with ${provider.firstName} ${provider.lastName}`,
                                    description: `Contact ${provider.firstName} ${provider.lastName} regarding their potential provider application.`,
                                    scheduledDate: "",
                                    assignedTo: "",
                                    priority: "P3",
                                    customerType: "potential_provider",
                                    comments: "",
                                    taskOwner: "admin"
                                  });
                                  setIsTaskDialogOpen(true);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0"
                                size="sm"
                              >
                                <Calendar className="h-4 w-4 mr-1" />
                                Create Task
                              </Button>
                            </div>
                          ))}
                          </div>
                          
                          {/* Pagination Controls */}
                          {totalPages > 1 && (
                          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-sm text-gray-500">
                              Showing {startIndex + 1} to {Math.min(endIndex, filteredProviders.length)} of {filteredProviders.length} providers
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                              >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                              </Button>
                              <div className="flex items-center space-x-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                  const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                                  return (
                                    <Button
                                      key={page}
                                      variant={currentPage === page ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => handlePageChange(page)}
                                      className="w-8 h-8 p-0"
                                    >
                                      {page}
                                    </Button>
                                  );
                                })}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                              >
                                Next
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {viewMode === 'list' && (
                <div className="relative">
                  {/* Fixed scroll arrows - always visible when scrolling the page */}
                  {showListViewLeftArrow && (
                    <button
                      type="button"
                      onClick={() => scrollListView(-300)}
                      className="fixed left-[18rem] top-1/2 -translate-y-1/2 z-30 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full p-2.5 shadow-lg transition-all duration-200 hover:shadow-xl"
                      title="Scroll left"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  )}
                  {showListViewRightArrow && (
                    <button
                      type="button"
                      onClick={() => scrollListView(300)}
                      className="fixed right-4 top-1/2 -translate-y-1/2 z-30 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full p-2.5 shadow-lg transition-all duration-200 hover:shadow-xl"
                      title="Scroll right"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  )}
                  <div ref={listViewTableRef} className="bg-white/90 backdrop-blur-sm border-slate-200/50 shadow-lg shadow-slate-200/20 hover:shadow-xl hover:shadow-slate-300/30 transition-all duration-300 dark:bg-gray-800 rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead className="min-w-[200px]">Task</TableHead>
                        <TableHead className="min-w-[140px]">First Name</TableHead>
                        {/* <TableHead>Last Name</TableHead> */}
                        <TableHead>Email</TableHead>
                        <TableHead>Service Categories</TableHead>
                        <TableHead>Business Name</TableHead>
                        {/* <TableHead>Suburb</TableHead>
                        <TableHead>State</TableHead>
                        <TableHead>Postcode</TableHead> */}
                        <TableHead>Address</TableHead>
                        <TableHead className="min-w-[130px]">Phone</TableHead>
                        {/* <TableHead>Notes</TableHead> */}
                        <TableHead>Status</TableHead>
                        {/* <TableHead>Priority</TableHead> */}
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedProviders.map((provider: PotentialProvider, index: number) => (
                        <TableRow
                          key={provider.id}
                          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          onClick={() => {
                            setSelectedProvider(provider);
                            setIsViewDetailsDialogOpen(true);
                          }}
                        >
                          <TableCell>
                            <div className="text-sm font-medium text-gray-500">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[200px]">
                            <div className="font-bold text-sm">
                              {provider.taskTitle || '-'}
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[140px]">
                            <div className="text-sm">
                              {provider.firstName || '-'}
                            </div>
                          </TableCell>
                          {/* <TableCell>
                            <div className="text-sm">
                              {provider.lastName || '-'}
                            </div>
                          </TableCell> */}
                          <TableCell>
                            <div className="text-sm max-w-[200px] truncate" title={provider.email || ''}>
                              {provider.email || '-'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm max-w-xs truncate" title={provider.serviceCategories || ''}>
                              {provider.serviceCategories || '-'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm max-w-[180px] truncate" title={provider.businessName || ''}>
                              {provider.businessName || '-'}
                            </div>
                          </TableCell>
                          {/* <TableCell>
                            <div className="text-sm">
                              {provider.city || '-'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                            {provider.address || '-'}  {provider.state || '-'} {provider.city || '-'} {provider.postcode || '-'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {provider.postcode || '-'}
                            </div>
                          </TableCell> */}
                        <TableCell>
                          <div className="text-sm max-w-xs truncate">
                            {[provider.address, provider.city, provider.state, provider.postcode]
                              .filter(Boolean)
                              .join(', ')}
                          </div>
                        </TableCell>

                          <TableCell className="min-w-[130px]">
                            <div className="text-sm">
                              {provider.phone || '-'}
                            </div>
                          </TableCell>
                          {/* <TableCell>
                            <div className="text-sm max-w-xs truncate">
                              {provider.notes || '-'}
                            </div>
                          </TableCell> */}
                          <TableCell>
                            <Badge className={`${getStatusColor(
                              (provider as any).smsDeliveryStatus === '1st_sent' ? 'sms_1st' :
                              (provider as any).smsDeliveryStatus === '2nd_sent' ? 'sms_2nd' :
                              provider.status
                            )} text-white`}>
                              {getStatusLabel(provider)}
                            </Badge>
                          </TableCell>
                          {/* <TableCell>
                            <Badge className={`${getPriorityColor(provider.priority)} text-white`}>
                              {provider.priority}
                            </Badge>
                          </TableCell> */}
                          <TableCell>
                            <div className="flex items-center space-x-2 min-w-0">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Avatar className="h-8 w-8 flex-shrink-0">
                                      {hasTaskAssignedUser(provider) ? (
                                        <>
                                          <AvatarImage 
                                            src={getTeamMember(provider.taskAssignedTo)?.profileImage ?? ''} 
                                            alt={getTaskAssignedDisplayName(provider)}
                                          />
                                          <AvatarFallback className="bg-blue-500 text-white text-sm">
                                            {getTaskAssignedInitials(provider)}
                                          </AvatarFallback>
                                        </>
                                      ) : (
                                        <AvatarFallback className="bg-gray-400 text-white text-sm">
                                          ?
                                        </AvatarFallback>
                                      )}
                                    </Avatar>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{getTaskAssignedDisplayName(provider)}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <span className="text-sm truncate">{getTaskAssignedDisplayName(provider)}</span>
                            </div>
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {
                                  // Update status to "First Call" before opening phone
                                  updateProviderMutation.mutate({
                                    id: provider.id,
                                    status: 'first_call'
                                  });
                                  // Open phone dialer
                                  window.open(`tel:${provider.phone}`, '_self');
                                }}>
                                  <Phone className="h-4 w-4 mr-2" />
                                  Call
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  setSelectedProvider(provider);
                                  setIsEmailDialogOpen(true);
                                }}>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Follow Up
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  setSelectedProvider(provider);
                                  setIsSmsDialogOpen(true);
                                }}>
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Send SMS
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem onClick={() => {
                                  setSelectedProvider(provider);
                                  setIsConvertDialogOpen(true);
                                }}>
                                  <UserPlus className="h-4 w-4 mr-2" />
                                  Convert to Provider
                                </DropdownMenuItem> */}
                                <DropdownMenuItem onClick={() => {
                                  setSelectedProvider(provider);
                                  setIsWonAlertOpen(true);
                                }}>
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                  Mark as Won
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  setSelectedProvider(provider);
                                  setIsLostAlertOpen(true);
                                }}>
                                  <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                  Mark as Lost
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  setSelectedProvider(provider);
                                  setIsViewDetailsDialogOpen(true);
                                }}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {/* Pagination Controls for List View */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-sm text-gray-500">
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredProviders.length)} of {filteredProviders.length} providers
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                            return (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(page)}
                                className="w-8 h-8 p-0"
                              >
                                {page}
                              </Button>
                            );
                          })}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  </div>
                </div>
              )}

              {viewMode === 'kanban' && (
                <div className="relative">
                  {/* Left Arrow Button - Auto Hide/Show */}
                  {showLeftArrow && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (kanbanRef.current) {
                          kanbanRef.current.scrollBy({ left: -300, behavior: 'smooth' });
                        }
                      }}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full p-2 shadow-lg transition-all duration-200 hover:shadow-xl"
                      title="Scroll Left"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  )}

                  {/* Right Arrow Button - Auto Hide/Show */}
                  {showRightArrow && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (kanbanRef.current) {
                          kanbanRef.current.scrollBy({ left: 300, behavior: 'smooth' });
                        }
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full p-2 shadow-lg transition-all duration-200 hover:shadow-xl"
                      title="Scroll Right"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  )}

                  <div 
                    ref={kanbanRef}
                    className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {/* Original time-based columns for providers */}
                    {kanbanColumns.map((column) => {
                      const columnProviders = column.providers;
                      return (
                        <div key={column.id} className="flex-shrink-0 w-80 space-y-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {column.title}
                            </h3>
                            <Badge variant="secondary" className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                              {columnProviders.length}
                            </Badge>
                          </div>
                          
                          <div 
                            className={`min-h-[500px] max-h-[600px] p-4 rounded-xl ${column.color} dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              const providerId = parseInt(e.dataTransfer.getData('text/plain'));
                              handleProviderTimeChange(providerId, column.id);
                            }}
                          >
                          {columnProviders.length === 0 ? (
                            <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                              <p className="text-sm">No providers in this status</p>
                            </div>
                          ) : (
                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e0 #f1f5f9' }}>
                              {columnProviders.map((provider: PotentialProvider) => (
                                <div
                                  key={provider.id}
                                  role="button"
                                  tabIndex={0}
                                  className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200 group cursor-pointer"
                                  draggable
                                  onDragStart={(e) => {
                                    e.dataTransfer.setData('text/plain', provider.id.toString());
                                  }}
                                  onClick={() => {
                                    setSelectedProvider(provider);
                                    setIsViewDetailsDialogOpen(true);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      setSelectedProvider(provider);
                                      setIsViewDetailsDialogOpen(true);
                                    }
                                  }}
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                        {provider.firstName} {provider.lastName}
                                      </h4>
                                      {provider.businessName && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                                          {provider.businessName}
                                        </p>
                                      )}
                                    </div>
                                     <div className="flex items-center space-x-2">
                                       <Badge 
                                         className={`${
                                           provider.priority === 'high' ? 'bg-red-500' :
                                           provider.priority === 'medium' ? 'bg-yellow-500' :
                                           'bg-gray-500'
                                         } text-white text-xs font-medium`}
                                       >
                                         {provider.priority}
                                       </Badge>
                                       {/* Status Badge - Show SMS status if available, otherwise show regular status */}
                                       {((provider as any).smsDeliveryStatus && (provider as any).smsDeliveryStatus !== 'not_sent') ? (
                                         <Badge 
                                           className={`${
                                             (provider as any).smsDeliveryStatus === '1st_sent' ? 'bg-indigo-500' :
                                             (provider as any).smsDeliveryStatus === '2nd_sent' ? 'bg-indigo-600' :
                                             'bg-gray-400'
                                           } text-white text-xs font-medium`}
                                         >
                                           {(provider as any).smsDeliveryStatus === '1st_sent' ? '1st SMS' :
                                            (provider as any).smsDeliveryStatus === '2nd_sent' ? '2nd SMS' :
                                            'SMS'}
                                         </Badge>
                                       ) : (
                                         <Badge 
                                           className={`${
                                             provider.status === 'email' ? 'bg-blue-500' :
                                             provider.status === 'email_sent' ? 'bg-blue-500' :
                                             provider.status === 'follow_up' ? 'bg-green-500' :
                                             provider.status === 'first_call' ? 'bg-purple-500' :
                                             provider.status === 'active' ? 'bg-blue-400' :
                                             provider.status === 'won' ? 'bg-green-600' :
                                             provider.status === 'lost' ? 'bg-red-500' :
                                             'bg-gray-400'
                                           } text-white text-xs font-medium`}
                                         >
                                           {provider.status === 'email' ? 'Email' :
                                            provider.status === 'email_sent' ? 'Email' :
                                            provider.status === 'follow_up' ? 'Follow Up' :
                                            provider.status === 'first_call' ? 'First Call' :
                                            provider.status === 'active' ? 'Active' :
                                            provider.status === 'won' ? 'Won' :
                                            provider.status === 'lost' ? 'Lost' :
                                            'New'}
                                         </Badge>
                                       )}
                                       
                                       {/* Actions Dropdown - Top Right */}
                                       <DropdownMenu>
                                         <DropdownMenuTrigger asChild>
                                           <Button 
                                             variant="ghost" 
                                             size="sm" 
                                             className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-600"
                                             onClick={(e) => e.stopPropagation()}
                                           >
                                             <MoreVertical className="h-4 w-4" />
                                           </Button>
                                         </DropdownMenuTrigger>
                                         <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                           <DropdownMenuItem onClick={() => {
                                             // Update status to "First Call" before opening phone
                                             updateProviderMutation.mutate({
                                               id: provider.id,
                                               status: 'first_call'
                                             });
                                             // Open phone dialer
                                             window.open(`tel:${provider.phone}`, '_self');
                                           }}>
                                             <Phone className="h-4 w-4 mr-2" />
                                             Call
                                           </DropdownMenuItem>
                                           <DropdownMenuItem onClick={() => {
                                             setSelectedProvider(provider);
                                             setIsEmailDialogOpen(true);
                                           }}>
                                             <Mail className="h-4 w-4 mr-2" />
                                             Follow Up
                                           </DropdownMenuItem>
                                           <DropdownMenuItem onClick={() => {
                                             setSelectedProvider(provider);
                                             setIsSmsDialogOpen(true);
                                           }}>
                                             <MessageSquare className="h-4 w-4 mr-2" />
                                             Send SMS
                                           </DropdownMenuItem>
                                           {/* <DropdownMenuItem onClick={() => {
                                             setSelectedProvider(provider);
                                             setIsConvertDialogOpen(true);
                                           }}>
                                             <UserPlus className="h-4 w-4 mr-2" />
                                             Convert to Provider
                                           </DropdownMenuItem> */}
                                           <DropdownMenuItem onClick={() => {
                                             setSelectedProvider(provider);
                                             setIsWonAlertOpen(true);
                                           }}>
                                             <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                             Mark as Won
                                           </DropdownMenuItem>
                                           <DropdownMenuItem onClick={() => {
                                             setSelectedProvider(provider);
                                             setIsLostAlertOpen(true);
                                           }}>
                                             <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                             Mark as Lost
                                           </DropdownMenuItem>
                                           <DropdownMenuItem onClick={() => {
                                             setSelectedProvider(provider);
                                             setIsViewDetailsDialogOpen(true);
                                           }}>
                                             <Eye className="h-4 w-4 mr-2" />
                                             View Details
                                           </DropdownMenuItem>
                                         </DropdownMenuContent>
                                       </DropdownMenu>
                                     </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                      <Mail className="h-3 w-3 mr-2 flex-shrink-0" />
                                      <span className="truncate">{provider.email}</span>
                                    </div>
                                    
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                      <Phone className="h-3 w-3 mr-2 flex-shrink-0" />
                                      <span className="truncate">{provider.phone}</span>
                                    </div>
                                    
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                      <MapPin className="h-3 w-3 mr-2 flex-shrink-0" />
                                      <span className="truncate">{provider.city}, {provider.state}</span>
                                    </div>
                                    
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Avatar className="h-6 w-6 mr-2 flex-shrink-0">
                                              {hasTaskAssignedUser(provider) ? (
                                                <>
                                                  <AvatarImage 
                                                    src={getTeamMember(provider.taskAssignedTo)?.profileImage ?? ''} 
                                                    alt={getTaskAssignedDisplayName(provider)}
                                                  />
                                                  <AvatarFallback className="bg-blue-500 text-white text-xs">
                                                    {getTaskAssignedInitials(provider)}
                                                  </AvatarFallback>
                                                </>
                                              ) : (
                                                <AvatarFallback className="bg-gray-400 text-white text-xs">
                                                  ?
                                                </AvatarFallback>
                                              )}
                                            </Avatar>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>{getTaskAssignedDisplayName(provider)}</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                      <span className="truncate">{getTaskAssignedDisplayName(provider)}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-gray-600">
                                      <Badge variant="outline" className="text-xs">
                                        {provider.source}
                                      </Badge>
                                      <div className="flex items-center text-xs text-gray-500">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {new Date(provider.createdAt).toLocaleDateString()}
                                      </div>
                                    </div>
                                    
                                  </div>
                              </div>
                            ))}
                          </div>
                        )}
                        </div>
                      </div>
                    );
                  })}
                  </div>
                </div>
              )}

              {viewMode === 'completed' && (
                <div className="space-y-6">
                  <div className="bg-white/90 backdrop-blur-sm border-slate-200/50 shadow-lg shadow-slate-200/20 hover:shadow-xl hover:shadow-slate-300/30 transition-all duration-300 dark:bg-gray-800 rounded-lg">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        Won Providers ({wonProviders.length})
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Successfully converted potential providers
                      </p>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Business</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Converted Date</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProviders.map((provider: PotentialProvider) => (
                          <TableRow key={provider.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {provider.firstName} {provider.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {provider.email}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {provider.businessName || '-'}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{provider.phone}</div>
                                <div className="text-gray-500">{provider.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{provider.city}, {provider.state}</div>
                                <div className="text-gray-500">{provider.postcode}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {new Date(provider.updatedAt).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {provider.source}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {/* <DropdownMenuItem onClick={() => {
                                    setSelectedProvider(provider);
                                    setIsConvertDialogOpen(true);
                                  }}>
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Convert to Provider
                                  </DropdownMenuItem> */}
                                  <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {viewMode === 'lost' && (
                <div className="space-y-6">
                  <div className="bg-white/90 backdrop-blur-sm border-slate-200/50 shadow-lg shadow-slate-200/20 hover:shadow-xl hover:shadow-slate-300/30 transition-all duration-300 dark:bg-gray-800 rounded-lg">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                        <XCircle className="h-5 w-5 text-red-600 mr-2" />
                        Lost Providers ({lostProviders.length})
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Potential providers that were not converted
                      </p>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Business</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Lost Date</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProviders.map((provider: PotentialProvider) => (
                          <TableRow key={provider.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {provider.firstName} {provider.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {provider.email}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {provider.businessName || '-'}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{provider.phone}</div>
                                <div className="text-gray-500">{provider.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{provider.city}, {provider.state}</div>
                                <div className="text-gray-500">{provider.postcode}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {new Date(provider.updatedAt).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {provider.source}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => {
                                    updateProviderMutation.mutate({
                                      id: provider.id,
                                      status: 'new'
                                    });
                                  }}>
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Reactivate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* New Member List View - for managers */}
              {viewMode === 'new-member-list' && (
                <div className="space-y-6">
                  <div className="bg-white/90 backdrop-blur-sm border-slate-200/50 shadow-lg shadow-slate-200/20 hover:shadow-xl hover:shadow-slate-300/30 transition-all duration-300 dark:bg-gray-800 rounded-lg">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                        <Users className="h-5 w-5 text-blue-600 mr-2" />
                        New Member List - My Tasks
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Tasks assigned to you as a manager
                      </p>
                    </div>
                    
                    {/* Task filters for managers */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <label className="text-sm font-medium">Priority:</label>
                          <Select value={taskPriorityFilter} onValueChange={setTaskPriorityFilter}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="P1">P1</SelectItem>
                              <SelectItem value="P2">P2</SelectItem>
                              <SelectItem value="P3">P3</SelectItem>
                              <SelectItem value="P4">P4</SelectItem>
                              <SelectItem value="P5">P5</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <label className="text-sm font-medium">Status:</label>
                          <Select value={taskCustomerTypeFilter} onValueChange={setTaskCustomerTypeFilter}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Tasks list */}
                    <div className="p-6">
                      {tasksLoading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="text-gray-500 mt-2">Loading tasks...</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {kanbanTasks && Object.values(kanbanTasks).flat().length > 0 ? (
                            (Object.values(kanbanTasks).flat() as TeamTask[])
                              .filter((task: TeamTask) => {
                                const matchesPriority = taskPriorityFilter === "all" || task.priority === taskPriorityFilter;
                                const matchesStatus = taskCustomerTypeFilter === "all" || task.status === taskCustomerTypeFilter;
                                return matchesPriority && matchesStatus;
                              })
                              .map((task: TeamTask) => (
                                <div key={task.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                          {task.title}
                                        </h3>
                                        <Badge 
                                          className={`${getPriorityColor(task.priority)} text-white text-xs`}
                                        >
                                          {task.priority}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                          {task.status}
                                        </Badge>
                                      </div>
                                      
                                      {task.description && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                          {task.description}
                                        </p>
                                      )}
                                      
                                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                                        <div className="flex items-center space-x-1">
                                          <Calendar className="h-4 w-4" />
                                          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <Tag className="h-4 w-4" />
                                          <span className="capitalize">{task.taskType}</span>
                                        </div>
                                        {task.assignedTo && (
                                          <div className="flex items-center space-x-1">
                                            <User className="h-4 w-4" />
                                            <span>Assigned to: {task.assignedTo}</span>
                                          </div>
                                        )}
                                      </div>
                                      
                                      {task.comments && (
                                        <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                                          <span className="font-medium">Comments:</span> {task.comments}
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="flex items-center space-x-2 ml-4">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          // Mark as in progress
                                          handleTaskMove(task.id, 'pending', 'in_progress');
                                        }}
                                      >
                                        Start
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          // Mark as completed
                                          handleTaskMove(task.id, task.status, 'completed');
                                        }}
                                      >
                                        Complete
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))
                          ) : (
                            <div className="text-center py-12">
                              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tasks assigned</h3>
                              <p className="text-gray-500">You don't have any tasks assigned to you yet.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create Provider Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Potential Provider</DialogTitle>
            <DialogDescription>
              Add a new potential service provider to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <Input
                value={newProvider.firstName}
                onChange={(e) => setNewProvider({...newProvider, firstName: e.target.value})}
                placeholder="First Name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Last Name</label>
              <Input
                value={newProvider.lastName}
                onChange={(e) => setNewProvider({...newProvider, lastName: e.target.value})}
                placeholder="Last Name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={newProvider.email}
                onChange={(e) => setNewProvider({...newProvider, email: e.target.value})}
                placeholder="Email"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={newProvider.phone}
                onChange={(e) => setNewProvider({...newProvider, phone: e.target.value})}
                placeholder="Phone"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Business Name</label>
              <Input
                value={newProvider.businessName}
                onChange={(e) => setNewProvider({...newProvider, businessName: e.target.value})}
                placeholder="Business Name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Business ABN</label>
              <Input
                value={newProvider.businessAbn}
                onChange={(e) => setNewProvider({...newProvider, businessAbn: e.target.value})}
                placeholder="ABN"
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">Address</label>
              <Input
                value={newProvider.address}
                onChange={(e) => setNewProvider({...newProvider, address: e.target.value})}
                placeholder="Full Address"
              />
            </div>
            <div>
              <label className="text-sm font-medium">City</label>
              <Input
                value={newProvider.city}
                onChange={(e) => setNewProvider({...newProvider, city: e.target.value})}
                placeholder="City"
              />
            </div>
            <div>
              <label className="text-sm font-medium">State</label>
              <Input
                value={newProvider.state}
                onChange={(e) => setNewProvider({...newProvider, state: e.target.value})}
                placeholder="State"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Postcode</label>
              <Input
                value={newProvider.postcode}
                onChange={(e) => setNewProvider({...newProvider, postcode: e.target.value})}
                placeholder="Postcode"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select value={newProvider.priority} onValueChange={(value) => setNewProvider({...newProvider, priority: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* <div>
              <label className="text-sm font-medium">Assigned To</label>
              <Select value={newProvider.assignedTo} onValueChange={(value) => setNewProvider({...newProvider, assignedTo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {adminUsers.map((user: any) => (
                    <SelectItem key={user.id} value={user.username}>
                      {user.firstName} {user.lastName} ({user.username})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
            <div className="col-span-2">
              <label className="text-sm font-medium">Service Categories</label>
              <Input
                value={newProvider.serviceCategories}
                onChange={(e) => setNewProvider({...newProvider, serviceCategories: e.target.value})}
                placeholder="e.g., Plumbing, Electrical, Cleaning"
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={newProvider.notes}
                onChange={(e) => setNewProvider({...newProvider, notes: e.target.value})}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProvider} disabled={createProviderMutation.isPending}>
              {createProviderMutation.isPending ? "Creating..." : "Create Provider"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Import Potential Providers</DialogTitle>
            <DialogDescription>
              Import potential providers from a CSV file. Upload a file or paste CSV data. The system will automatically map CSV columns to database fields.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Import Name</label>
              <Input
                value={importData.importName}
                onChange={(e) => setImportData({...importData, importName: e.target.value})}
                placeholder="e.g., Gold Coast Import"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Upload CSV File</label>
              <Input
                type="file"
                accept=".csv"
                onChange={handleCsvFileChange}
                className="cursor-pointer"
              />
              {csvFile && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Selected: {csvFile.name}
                </p>
              )}
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400 text-center">OR</div>

            {/* Expected CSV Fields - Show before textarea */}
            <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20">
              <h4 className="font-medium text-sm mb-3 text-blue-900 dark:text-blue-100">
                📋 Expected CSV Fields (Your CSV should include these columns):
              </h4>
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-semibold text-blue-800 dark:text-blue-200 mb-1">Required Fields:</p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs bg-white dark:bg-gray-800">firstName</Badge>
                    <Badge variant="outline" className="text-xs bg-white dark:bg-gray-800">lastName</Badge>
                    <Badge variant="outline" className="text-xs bg-white dark:bg-gray-800">email</Badge>
                    <Badge variant="outline" className="text-xs bg-white dark:bg-gray-800">phone</Badge>
                    <Badge variant="outline" className="text-xs bg-white dark:bg-gray-800">address</Badge>
                    <Badge variant="outline" className="text-xs bg-white dark:bg-gray-800">city</Badge>
                    <Badge variant="outline" className="text-xs bg-white dark:bg-gray-800">state</Badge>
                    <Badge variant="outline" className="text-xs bg-white dark:bg-gray-800">postcode</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-blue-800 dark:text-blue-200 mb-1">Optional Fields:</p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs bg-white dark:bg-gray-800">serviceCategories</Badge>
                    <Badge variant="outline" className="text-xs bg-white dark:bg-gray-800">businessName</Badge>
                    <Badge variant="outline" className="text-xs bg-white dark:bg-gray-800">businessAbn</Badge>
                    <Badge variant="outline" className="text-xs bg-white dark:bg-gray-800">notes</Badge>
                    <Badge variant="outline" className="text-xs bg-white dark:bg-gray-800">priority</Badge>
                    <Badge variant="outline" className="text-xs bg-white dark:bg-gray-800">status</Badge>
                    <Badge variant="outline" className="text-xs bg-white dark:bg-gray-800">assignedTo</Badge>
                  </div>
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                  💡 <strong>Note:</strong> Column names are matched automatically (case-insensitive). Variations like "First Name", "first_name", "firstName" all work.
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Paste CSV Data</label>
              <Textarea
                value={importData.csvData}
                onChange={handleCsvDataChange}
                placeholder="Paste CSV data here (with headers in first row). Example: firstName,lastName,email,phone,address,city,state,postcode..."
                rows={8}
              />
            </div>

            {/* Info about field mapping */}
            {importData.csvData.trim() && (
              <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                <p className="text-sm text-green-900 dark:text-green-100">
                  <strong>✓ CSV Data Detected:</strong> After clicking "Import Providers", you'll see a field mapping showing which CSV columns were matched to database fields. 
                  Fields not found in CSV will be set to empty/null.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsImportDialogOpen(false);
              setCsvFile(null);
              setFieldMapping(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleImportProviders} disabled={importProvidersMutation.isPending || !importData.csvData.trim()}>
              {importProvidersMutation.isPending ? "Importing..." : "Import Providers"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Team Task Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
            <DialogDescription>
              {selectedProvider ? 
                `Create a task for ${selectedProvider.firstName} ${selectedProvider.lastName}` :
                'Create a new task for team management'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pr-2">
            {/* Show selected provider info */}
            {selectedProvider && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Creating task for:</h4>
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p><strong>Name:</strong> {selectedProvider.firstName} {selectedProvider.lastName}</p>
                  <p><strong>Email:</strong> {selectedProvider.email}</p>
                  <p><strong>Phone:</strong> {selectedProvider.phone}</p>
                  {selectedProvider.businessName && <p><strong>Business:</strong> {selectedProvider.businessName}</p>}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Task Title *</label>
                <Input
                  value={taskData.title}
                  onChange={(e) => setTaskData({...taskData, title: e.target.value})}
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Priority *</label>
                <Select value={taskData.priority || "P3"} onValueChange={(value) => setTaskData({...taskData, priority: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="P1">P1 - Critical</SelectItem>
                    <SelectItem value="P2">P2 - High</SelectItem>
                    <SelectItem value="P3">P3 - Medium</SelectItem>
                    <SelectItem value="P4">P4 - Low</SelectItem>
                    <SelectItem value="P5">P5 - Very Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={taskData.description}
                onChange={(e) => setTaskData({...taskData, description: e.target.value})}
                placeholder="Enter task description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Due Date *</label>
                <Input
                  type="datetime-local"
                  value={taskData.scheduledDate}
                  onChange={(e) => setTaskData({...taskData, scheduledDate: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Task Type</label>
                <Select value={taskData.taskType} onValueChange={(value) => setTaskData({...taskData, taskType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="follow_up">Follow Up</SelectItem>
                    <SelectItem value="call">Call</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Customer Type</label>
                <Select value={taskData.customerType || "all"} onValueChange={(value) => setTaskData({...taskData, customerType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="potential_provider">Potential Provider</SelectItem>
                    <SelectItem value="provider">Provider</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Assigned To</label>
                <Select value={taskData.assignedTo} onValueChange={(value) => setTaskData({...taskData, assignedTo: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {adminUsers.map((user: any) => (
                      <SelectItem key={user.id} value={String(user.id)}>
                        {user.firstName} {user.lastName} ({user.username})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Super Admin: Task Owner Selection */}
            {isSuperAdmin && (
              <div>
                <label className="text-sm font-medium">Task Owner (Admin)</label>
                <Select value={taskData.taskOwner || "admin"} onValueChange={(value) => setTaskData({...taskData, taskOwner: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select task owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {adminUsers.map((user: any) => (
                      <SelectItem key={user.id} value={user.username}>
                        {user.firstName} {user.lastName} ({user.username}) - {user.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">Super Admin can assign tasks to any admin</p>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium">Comments</label>
              <Textarea
                value={taskData.comments || ""}
                onChange={(e) => setTaskData({...taskData, comments: e.target.value})}
                placeholder="Add any additional comments or notes"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask} disabled={createTaskMutation.isPending}>
              {createTaskMutation.isPending ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
            <DialogDescription>
              Send an email to {selectedProvider?.firstName} {selectedProvider?.lastName} ({selectedProvider?.email})
            </DialogDescription>
          </DialogHeader>
          
          {/* Email Mode Switch */}
          <div className="flex items-center justify-center space-x-4 py-4">
            <span className={`text-sm font-medium ${emailMode === 'followup' ? 'text-blue-600' : 'text-gray-500'}`}>
              Follow Up
            </span>
            <button
              onClick={() => setEmailMode(emailMode === 'followup' ? 'custom' : 'followup')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                emailMode === 'followup' ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  emailMode === 'followup' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${emailMode === 'custom' ? 'text-blue-600' : 'text-gray-500'}`}>
              Custom Email
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Subject</label>
              <Input
                value={emailData.subject}
                onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                placeholder={emailMode === 'followup' ? "Follow up on your application" : "Email subject"}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={emailData.content}
                onChange={(e) => setEmailData({...emailData, content: e.target.value})}
                placeholder={
                  emailMode === 'followup' 
                    ? `Hi ${selectedProvider?.firstName},\n\nThank you for your interest in joining ServicePanda as a service provider. We would like to follow up on your application.\n\nPlease let us know if you have any questions or if you need any additional information.\n\nBest regards,\nServicePanda Team`
                    : "Email content..."
                }
                rows={8}
              />
            </div>
            
            {/* Template Preview */}
            {emailMode === 'followup' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Follow Up Template</h4>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  This template will automatically update the provider status to "Follow Up" after sending.
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEmailDialogOpen(false);
              setEmailData({ subject: "", content: "" });
              setEmailMode('followup');
            }}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail} disabled={sendEmailMutation.isPending}>
              {sendEmailMutation.isPending ? "Sending..." : "Send Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SMS Dialog */}
      <Dialog open={isSmsDialogOpen} onOpenChange={setIsSmsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send SMS</DialogTitle>
            <DialogDescription>
              Send an SMS to {selectedProvider?.firstName} {selectedProvider?.lastName} ({selectedProvider?.phone})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea
                value={smsData.content}
                onChange={(e) => setSmsData({...smsData, content: e.target.value})}
                placeholder="SMS message..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSmsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendSms} disabled={sendSmsMutation.isPending}>
              {sendSmsMutation.isPending ? "Sending..." : "Send SMS"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Convert to Provider Dialog */}
      <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convert to Provider</DialogTitle>
            <DialogDescription>
              Convert {selectedProvider?.firstName} {selectedProvider?.lastName} to an actual service provider?
              This will create a new provider account and remove them from potential providers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600 mb-2" />
              <p className="text-sm text-yellow-800">
                This action will:
              </p>
              <ul className="text-sm text-yellow-800 mt-2 list-disc list-inside">
                <li>Create a new service provider account</li>
                <li>Send welcome email to the provider</li>
                <li>Remove from potential providers list</li>
                <li>Set initial status to "pending"</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConvertDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConvertToProvider} 
              disabled={convertToProviderMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {convertToProviderMutation.isPending ? "Converting..." : "Convert to Provider"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Confirmation Dialog */}
      <Dialog open={isConfirmationDialogOpen} onOpenChange={setIsConfirmationDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Confirm Import</DialogTitle>
            <DialogDescription>
              Review the imported providers before adding them to the system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedPendingImport && (
              <>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Import Details
                  </h4>
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p><strong>Import Name:</strong> {selectedPendingImport.importName}</p>
                    <p><strong>Providers:</strong> {selectedPendingImport.providers.length}</p>
                    <p><strong>Imported:</strong> {selectedPendingImport.createdAt.toLocaleString()}</p>
                  </div>
                </div>

                {/* CSV Headers and Field Mapping Display */}
                <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20 mb-4">
                  <h4 className="font-medium text-sm mb-2 text-blue-900 dark:text-blue-100">
                    CSV Headers Found
                  </h4>
                  {selectedPendingImport.csvHeaders && selectedPendingImport.csvHeaders.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedPendingImport.csvHeaders.map((header, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {header}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-600 dark:text-gray-400">No headers found in CSV</p>
                  )}
                  
                  {selectedPendingImport.unmappedHeaders && selectedPendingImport.unmappedHeaders.length > 0 && (
                    <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-700">
                      <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                        ⚠️ Unmapped Headers (not recognized):
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {selectedPendingImport.unmappedHeaders.map((header, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs bg-yellow-100">
                            {header}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-2">
                        These columns were not matched to any database fields. Consider renaming them to match expected field names.
                      </p>
                    </div>
                  )}
                </div>

                {/* Field Mapping Display */}
                {selectedPendingImport.fieldMapping && Object.keys(selectedPendingImport.fieldMapping).length > 0 && (
                  <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/20 mb-4">
                    <h4 className="font-medium text-sm mb-3 text-green-900 dark:text-green-100">
                      Field Mapping Used (CSV Column → Database Field)
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      {Object.entries(selectedPendingImport.fieldMapping).map(([csvHeader, dbField]) => (
                        <div key={csvHeader} className="flex items-center gap-2">
                          <span className="font-medium text-gray-700 dark:text-gray-300">{csvHeader}</span>
                          <ArrowRight className="h-4 w-4 text-gray-500" />
                          <span className="text-green-700 dark:text-green-300 font-semibold">{dbField}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-700">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        Fields not found in CSV were set to empty/null. You can rename your CSV columns to match these field names for future imports.
                      </p>
                      {selectedPendingImport.providers.length > 0 && (
                        <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-700">
                          <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-200 mb-1">⚠️ Sample Data Check:</p>
                          <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                            <p><strong>First Provider Sample:</strong></p>
                            <p><strong>First Name:</strong> {selectedPendingImport.providers[0].firstName || '(empty)'}</p>
                            <p><strong>Last Name:</strong> {selectedPendingImport.providers[0].lastName || '(empty)'}</p>
                            <p><strong>Email:</strong> {selectedPendingImport.providers[0].email || '(empty)'}</p>
                            <p><strong>Phone:</strong> {selectedPendingImport.providers[0].phone || '(empty)'}</p>
                            <p><strong>Service Categories:</strong> {selectedPendingImport.providers[0].serviceCategories || '(empty)'}</p>
                            <p><strong>Business Name:</strong> {selectedPendingImport.providers[0].businessName || '(empty)'}</p>
                            <p><strong>Suburb:</strong> {selectedPendingImport.providers[0].city || '(empty)'}</p>
                            <p><strong>State:</strong> {selectedPendingImport.providers[0].state || '(empty)'}</p>
                            <p><strong>Postcode:</strong> {selectedPendingImport.providers[0].postcode || '(empty)'}</p>
                            <p><strong>Address:</strong> {selectedPendingImport.providers[0].address || '(empty)'}</p>
                            <p><strong>Notes:</strong> {selectedPendingImport.providers[0].notes || '(empty)'}</p>
                            {(!selectedPendingImport.providers[0].email || !selectedPendingImport.providers[0].email.includes('@')) && (
                              <p className="text-red-600 dark:text-red-400 font-semibold">⚠️ Email doesn't look valid - check your CSV column mapping!</p>
                            )}
                            {(!selectedPendingImport.providers[0].phone || selectedPendingImport.providers[0].phone.length < 5) && (
                              <p className="text-red-600 dark:text-red-400 font-semibold">⚠️ Phone doesn't look valid - check your CSV column mapping!</p>
                            )}
                            {(!selectedPendingImport.providers[0].firstName || selectedPendingImport.providers[0].firstName.length < 2) && (
                              <p className="text-red-600 dark:text-red-400 font-semibold">⚠️ First name doesn't look valid - check your CSV column mapping!</p>
                            )}
                            {(!selectedPendingImport.providers[0].lastName || selectedPendingImport.providers[0].lastName.length < 2) && (
                              <p className="text-red-600 dark:text-red-400 font-semibold">⚠️ Last name doesn't look valid - check your CSV column mapping!</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="max-h-96 overflow-y-auto">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Imported Providers</h4>
                  <div className="space-y-2">
                    {selectedPendingImport.providers.map((provider, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {provider.firstName} {provider.lastName}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {provider.city}, {provider.state} {provider.postcode}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <p><strong>Email:</strong> {provider.email || '-'}</p>
                            <p><strong>Phone:</strong> {provider.phone || '-'}</p>
                            <p><strong>Service Categories:</strong> {provider.serviceCategories || '-'}</p>
                            <p><strong>Business Name:</strong> {provider.businessName || '-'}</p>
                            <p><strong>Suburb:</strong> {provider.city || '-'}</p>
                            <p><strong>State:</strong> {provider.state || '-'}</p>
                            <p><strong>Postcode:</strong> {provider.postcode || '-'}</p>
                            <p><strong>Address:</strong> {provider.address || '-'}</p>
                            {provider.notes && (
                              <p className="col-span-2"><strong>Notes:</strong> {provider.notes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleConfirmImportNo}>
              No, Reject Import
            </Button>
            <Button onClick={handleConfirmImportYes} disabled={confirmImportMutation.isPending}>
              {confirmImportMutation.isPending ? "Confirming..." : "Yes, Add to System"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Won Alert Dialog */}
      <Dialog open={isWonAlertOpen} onOpenChange={setIsWonAlertOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="text-center text-2xl font-bold text-green-800">
              🎉 Congratulations!
            </DialogTitle>
            <DialogDescription className="text-center text-lg text-gray-600">
              You've successfully won <strong>{selectedProvider?.firstName} {selectedProvider?.lastName}</strong>!
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-800 font-medium">
                {selectedProvider?.businessName ? `${selectedProvider.businessName} - ` : ''}
                {selectedProvider?.firstName} {selectedProvider?.lastName}
              </p>
              <p className="text-green-600 text-sm mt-1">
                Status updated to <span className="font-semibold">Won</span>
              </p>
            </div>
          </div>
          <DialogFooter className="flex justify-center">
            <Button 
              onClick={() => {
                updateProviderMutation.mutate({
                  id: selectedProvider?.id!,
                  status: 'won'
                });
                setIsWonAlertOpen(false);
                setSelectedProvider(null);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
            >
              Confirm & Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lost Alert Dialog */}
      <Dialog open={isLostAlertOpen} onOpenChange={setIsLostAlertOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <DialogTitle className="text-center text-2xl font-bold text-red-800">
              Provider Lost
            </DialogTitle>
            <DialogDescription className="text-center text-lg text-gray-600">
              <strong>{selectedProvider?.firstName} {selectedProvider?.lastName}</strong> has been marked as lost.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-800 font-medium">
                {selectedProvider?.businessName ? `${selectedProvider.businessName} - ` : ''}
                {selectedProvider?.firstName} {selectedProvider?.lastName}
              </p>
              <p className="text-red-600 text-sm mt-1">
                Status updated to <span className="font-semibold">Lost</span>
              </p>
            </div>
          </div>
          <DialogFooter className="flex justify-center">
            <Button 
              onClick={() => {
                updateProviderMutation.mutate({
                  id: selectedProvider?.id!,
                  status: 'lost'
                });
                setIsLostAlertOpen(false);
                setSelectedProvider(null);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-2"
            >
              Confirm & Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewDetailsDialogOpen} onOpenChange={setIsViewDetailsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Provider Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedProvider?.firstName} {selectedProvider?.lastName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedProvider && (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedProvider.firstName} {selectedProvider.lastName}
                  </h3>
                  {selectedProvider.businessName && (
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                      {selectedProvider.businessName}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    className={`${
                      selectedProvider.priority === 'high' ? 'bg-red-500' :
                      selectedProvider.priority === 'medium' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    } text-white text-sm font-medium`}
                  >
                    {selectedProvider.priority}
                  </Badge>
                  {((selectedProvider as any).smsDeliveryStatus && (selectedProvider as any).smsDeliveryStatus !== 'not_sent') ? (
                    <Badge 
                      className={`${
                        (selectedProvider as any).smsDeliveryStatus === '1st_sent' ? 'bg-indigo-500' :
                        (selectedProvider as any).smsDeliveryStatus === '2nd_sent' ? 'bg-indigo-600' :
                        'bg-gray-400'
                      } text-white text-sm font-medium`}
                    >
                      {(selectedProvider as any).smsDeliveryStatus === '1st_sent' ? '1st SMS' :
                       (selectedProvider as any).smsDeliveryStatus === '2nd_sent' ? '2nd SMS' :
                       'SMS'}
                    </Badge>
                  ) : (
                    <Badge 
                      className={`${
                        selectedProvider.status === 'email' ? 'bg-blue-500' :
                        selectedProvider.status === 'email_sent' ? 'bg-blue-500' :
                        selectedProvider.status === 'follow_up' ? 'bg-green-500' :
                        selectedProvider.status === 'first_call' ? 'bg-purple-500' :
                        selectedProvider.status === 'active' ? 'bg-blue-400' :
                        selectedProvider.status === 'won' ? 'bg-green-600' :
                        selectedProvider.status === 'lost' ? 'bg-red-500' :
                        'bg-gray-400'
                      } text-white text-sm font-medium`}
                    >
                      {selectedProvider.status === 'email' ? 'Email' :
                       selectedProvider.status === 'email_sent' ? 'Email' :
                       selectedProvider.status === 'follow_up' ? 'Follow Up' :
                       selectedProvider.status === 'first_call' ? 'First Call' :
                       selectedProvider.status === 'active' ? 'Active' :
                       selectedProvider.status === 'won' ? 'Won' :
                       selectedProvider.status === 'lost' ? 'Lost' :
                       'New'}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-900 dark:text-white">{selectedProvider.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-gray-900 dark:text-white">{selectedProvider.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="text-gray-900 dark:text-white">
                          {selectedProvider.city}, {selectedProvider.state} {selectedProvider.postcode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Business Information</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Business Name</p>
                      <p className="text-gray-900 dark:text-white">{selectedProvider.businessName || 'N/A'}</p>
                    </div>
                    {selectedProvider.businessAbn && (
                      <div>
                        <p className="text-sm text-gray-500">ABN</p>
                        <p className="text-gray-900 dark:text-white">{selectedProvider.businessAbn}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Service Categories</p>
                      <p className="text-gray-900 dark:text-white">{selectedProvider.serviceCategories || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Source</p>
                      <Badge variant="outline" className="text-xs">
                        {selectedProvider.source}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Additional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                    <p className="text-sm text-gray-500">Assigned To (Task)</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Avatar className="h-8 w-8">
                              {hasTaskAssignedUser(selectedProvider) ? (
                                <>
                                  <AvatarImage 
                                    src={getTeamMember(selectedProvider.taskAssignedTo)?.profileImage ?? ''} 
                                    alt={getTaskAssignedDisplayName(selectedProvider)}
                                  />
                                  <AvatarFallback className="bg-blue-500 text-white text-sm">
                                    {getTaskAssignedInitials(selectedProvider)}
                                  </AvatarFallback>
                                </>
                              ) : (
                                <AvatarFallback className="bg-gray-400 text-white text-sm">
                                  ?
                                </AvatarFallback>
                              )}
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{getTaskAssignedDisplayName(selectedProvider)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {getTaskAssignedDisplayName(selectedProvider)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created Date</p>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(selectedProvider.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(selectedProvider.updatedAt || selectedProvider.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              {selectedProvider.notes && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Notes</h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                      {selectedProvider.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
