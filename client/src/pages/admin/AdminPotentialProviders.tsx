import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { adminApiRequest } from "@/lib/queryClient";
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
  notes?: string;
  nextFollowUpDate?: string;
  lastContactDate?: string;
  lastContactType?: string;
  createdAt: string;
  updatedAt: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  providers: PotentialProvider[];
}

interface PendingImport {
  id: string;
  importName: string;
  providers: PotentialProvider[];
  createdAt: Date;
}

const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: "new", title: "New", color: "bg-gray-100", providers: [] },
  { id: "first_call", title: "First Call", color: "bg-blue-100", providers: [] },
  { id: "follow_up", title: "Follow Up", color: "bg-yellow-100", providers: [] },
  { id: "email", title: "Email", color: "bg-purple-100", providers: [] },
  { id: "won", title: "Won", color: "bg-green-100", providers: [] },
  { id: "lost", title: "Lost", color: "bg-red-100", providers: [] },
];

type ViewMode = 'member-list' | 'list' | 'kanban' | 'completed';

export default function AdminPotentialProviders() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  
  // State management
  const [viewMode, setViewMode] = useState<ViewMode>('member-list');
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assignedToFilter, setAssignedToFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [kanbanColumns, setKanbanColumns] = useState(KANBAN_COLUMNS);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isSmsDialogOpen, setIsSmsDialogOpen] = useState(false);
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<PotentialProvider | null>(null);

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
    notes: "",
  });

  const [importData, setImportData] = useState({
    importName: "",
    csvData: "",
  });

  const [taskData, setTaskData] = useState({
    taskType: "",
    title: "",
    description: "",
    scheduledDate: "",
    assignedTo: "",
  });

  const [emailData, setEmailData] = useState({
    subject: "",
    content: "",
  });

  const [smsData, setSmsData] = useState({
    content: "",
  });

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin-login');
    }
  }, [navigate]);

  // Dummy data for development/testing
  const dummyProviders: PotentialProvider[] = [
    // New providers (for member list)
    {
      id: 1,
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@example.com",
      phone: "0412 345 678",
      businessName: "Smith Plumbing Services",
      businessAbn: "12 345 678 901",
      address: "123 Main Street",
      state: "NSW",
      city: "Sydney",
      postcode: "2000",
      serviceCategories: "Plumbing, Emergency Repairs",
      source: "Website",
      status: "new",
      priority: "high",
      assignedTo: "Sarah Johnson",
      notes: "Interested in emergency plumbing services. Has 10 years experience.",
      nextFollowUpDate: "2024-01-15",
      lastContactDate: "2024-01-10",
      lastContactType: "email",
      createdAt: "2024-01-08T10:00:00Z",
      updatedAt: "2024-01-10T14:30:00Z"
    },
    {
      id: 2,
      firstName: "Maria",
      lastName: "Garcia",
      email: "maria.garcia@example.com",
      phone: "0423 456 789",
      businessName: "Garcia Electrical",
      businessAbn: "23 456 789 012",
      address: "456 Oak Avenue",
      state: "VIC",
      city: "Melbourne",
      postcode: "3000",
      serviceCategories: "Electrical, Installation",
      source: "Referral",
      status: "new",
      priority: "medium",
      assignedTo: "Mike Chen",
      notes: "Specializes in residential electrical work. Licensed electrician.",
      nextFollowUpDate: "2024-01-16",
      lastContactDate: "2024-01-11",
      lastContactType: "phone",
      createdAt: "2024-01-09T09:15:00Z",
      updatedAt: "2024-01-11T16:45:00Z"
    },
    {
      id: 3,
      firstName: "David",
      lastName: "Wilson",
      email: "david.wilson@example.com",
      phone: "0434 567 890",
      businessName: "Wilson Cleaning Services",
      businessAbn: "34 567 890 123",
      address: "789 Pine Road",
      state: "QLD",
      city: "Brisbane",
      postcode: "4000",
      serviceCategories: "Cleaning, Commercial",
      source: "Social Media",
      status: "new",
      priority: "low",
      assignedTo: "Lisa Wang",
      notes: "Focuses on commercial cleaning. Has 5 employees.",
      nextFollowUpDate: "2024-01-18",
      lastContactDate: "2024-01-12",
      lastContactType: "email",
      createdAt: "2024-01-10T11:30:00Z",
      updatedAt: "2024-01-12T10:20:00Z"
    },
    {
      id: 4,
      firstName: "Emma",
      lastName: "Thompson",
      email: "emma.thompson@example.com",
      phone: "0445 678 901",
      businessName: "Thompson Gardening",
      businessAbn: "45 678 901 234",
      address: "321 Garden Street",
      state: "WA",
      city: "Perth",
      postcode: "6000",
      serviceCategories: "Gardening, Landscaping",
      source: "Website",
      status: "new",
      priority: "medium",
      assignedTo: "Tom Anderson",
      notes: "Specializes in sustainable gardening. Certified horticulturist.",
      nextFollowUpDate: "2024-01-17",
      lastContactDate: "2024-01-13",
      lastContactType: "phone",
      createdAt: "2024-01-11T13:45:00Z",
      updatedAt: "2024-01-13T15:10:00Z"
    },
    {
      id: 5,
      firstName: "James",
      lastName: "Brown",
      email: "james.brown@example.com",
      phone: "0456 789 012",
      businessName: "Brown Carpentry",
      businessAbn: "56 789 012 345",
      address: "654 Wood Lane",
      state: "SA",
      city: "Adelaide",
      postcode: "5000",
      serviceCategories: "Carpentry, Renovations",
      source: "Referral",
      status: "new",
      priority: "high",
      assignedTo: "Sarah Johnson",
      notes: "Expert in custom furniture and home renovations. 15 years experience.",
      nextFollowUpDate: "2024-01-14",
      lastContactDate: "2024-01-12",
      lastContactType: "email",
      createdAt: "2024-01-12T08:20:00Z",
      updatedAt: "2024-01-12T17:30:00Z"
    },
    {
      id: 6,
      firstName: "Sophie",
      lastName: "Davis",
      email: "sophie.davis@example.com",
      phone: "0467 890 123",
      businessName: "Davis Painting Co",
      businessAbn: "67 890 123 456",
      address: "987 Color Street",
      state: "TAS",
      city: "Hobart",
      postcode: "7000",
      serviceCategories: "Painting, Interior Design",
      source: "Social Media",
      status: "new",
      priority: "medium",
      assignedTo: "Mike Chen",
      notes: "Specializes in interior and exterior painting. Uses eco-friendly paints.",
      nextFollowUpDate: "2024-01-19",
      lastContactDate: "2024-01-14",
      lastContactType: "phone",
      createdAt: "2024-01-13T10:15:00Z",
      updatedAt: "2024-01-14T11:45:00Z"
    },
    {
      id: 7,
      firstName: "Michael",
      lastName: "Johnson",
      email: "michael.johnson@example.com",
      phone: "0478 901 234",
      businessName: "Johnson Security",
      businessAbn: "78 901 234 567",
      address: "147 Security Blvd",
      state: "NT",
      city: "Darwin",
      postcode: "0800",
      serviceCategories: "Security, CCTV Installation",
      source: "Website",
      status: "new",
      priority: "high",
      assignedTo: "Lisa Wang",
      notes: "Provides security systems for homes and businesses. Licensed security provider.",
      nextFollowUpDate: "2024-01-15",
      lastContactDate: "2024-01-13",
      lastContactType: "email",
      createdAt: "2024-01-14T09:30:00Z",
      updatedAt: "2024-01-13T14:20:00Z"
    },
    {
      id: 8,
      firstName: "Amanda",
      lastName: "Lee",
      email: "amanda.lee@example.com",
      phone: "0489 012 345",
      businessName: "Lee Photography",
      businessAbn: "89 012 345 678",
      address: "258 Camera Road",
      state: "ACT",
      city: "Canberra",
      postcode: "2600",
      serviceCategories: "Photography, Events",
      source: "Referral",
      status: "new",
      priority: "low",
      assignedTo: "Tom Anderson",
      notes: "Specializes in wedding and event photography. Professional equipment.",
      nextFollowUpDate: "2024-01-20",
      lastContactDate: "2024-01-15",
      lastContactType: "phone",
      createdAt: "2024-01-15T12:00:00Z",
      updatedAt: "2024-01-15T16:30:00Z"
    },
    // First call status providers
    {
      id: 9,
      firstName: "Robert",
      lastName: "Taylor",
      email: "robert.taylor@example.com",
      phone: "0490 123 456",
      businessName: "Taylor HVAC",
      businessAbn: "90 123 456 789",
      address: "369 Air Street",
      state: "NSW",
      city: "Newcastle",
      postcode: "2300",
      serviceCategories: "HVAC, Air Conditioning",
      source: "Website",
      status: "first_call",
      priority: "high",
      assignedTo: "Sarah Johnson",
      notes: "Specializes in commercial HVAC systems. Available for emergency calls.",
      nextFollowUpDate: "2024-01-16",
      lastContactDate: "2024-01-14",
      lastContactType: "phone",
      createdAt: "2024-01-13T14:20:00Z",
      updatedAt: "2024-01-14T09:15:00Z"
    },
    {
      id: 10,
      firstName: "Jennifer",
      lastName: "White",
      email: "jennifer.white@example.com",
      phone: "0491 234 567",
      businessName: "White Landscaping",
      businessAbn: "91 234 567 890",
      address: "741 Nature Way",
      state: "VIC",
      city: "Geelong",
      postcode: "3220",
      serviceCategories: "Landscaping, Garden Design",
      source: "Referral",
      status: "first_call",
      priority: "medium",
      assignedTo: "Mike Chen",
      notes: "Creates beautiful outdoor spaces. Uses sustainable materials.",
      nextFollowUpDate: "2024-01-17",
      lastContactDate: "2024-01-15",
      lastContactType: "email",
      createdAt: "2024-01-14T11:30:00Z",
      updatedAt: "2024-01-15T16:45:00Z"
    },
    // Follow up status providers
    {
      id: 11,
      firstName: "Christopher",
      lastName: "Anderson",
      email: "christopher.anderson@example.com",
      phone: "0492 345 678",
      businessName: "Anderson Roofing",
      businessAbn: "92 345 678 901",
      address: "852 Roof Road",
      state: "QLD",
      city: "Gold Coast",
      postcode: "4215",
      serviceCategories: "Roofing, Repairs",
      source: "Social Media",
      status: "follow_up",
      priority: "high",
      assignedTo: "Lisa Wang",
      notes: "Expert in all types of roofing. Licensed and insured.",
      nextFollowUpDate: "2024-01-18",
      lastContactDate: "2024-01-16",
      lastContactType: "phone",
      createdAt: "2024-01-15T09:45:00Z",
      updatedAt: "2024-01-16T14:20:00Z"
    },
    {
      id: 12,
      firstName: "Nicole",
      lastName: "Martinez",
      email: "nicole.martinez@example.com",
      phone: "0493 456 789",
      businessName: "Martinez Cleaning",
      businessAbn: "93 456 789 012",
      address: "963 Clean Street",
      state: "WA",
      city: "Fremantle",
      postcode: "6160",
      serviceCategories: "Cleaning, Domestic",
      source: "Website",
      status: "follow_up",
      priority: "medium",
      assignedTo: "Tom Anderson",
      notes: "Provides regular cleaning services. Uses eco-friendly products.",
      nextFollowUpDate: "2024-01-19",
      lastContactDate: "2024-01-17",
      lastContactType: "email",
      createdAt: "2024-01-16T13:15:00Z",
      updatedAt: "2024-01-17T10:30:00Z"
    },
    // Email status providers
    {
      id: 13,
      firstName: "Daniel",
      lastName: "Clark",
      email: "daniel.clark@example.com",
      phone: "0494 567 890",
      businessName: "Clark Plumbing",
      businessAbn: "94 567 890 123",
      address: "147 Pipe Lane",
      state: "SA",
      city: "Mount Gambier",
      postcode: "5290",
      serviceCategories: "Plumbing, Emergency",
      source: "Referral",
      status: "email",
      priority: "high",
      assignedTo: "Sarah Johnson",
      notes: "24/7 emergency plumbing services. Licensed plumber.",
      nextFollowUpDate: "2024-01-20",
      lastContactDate: "2024-01-18",
      lastContactType: "email",
      createdAt: "2024-01-17T08:30:00Z",
      updatedAt: "2024-01-18T15:45:00Z"
    },
    {
      id: 14,
      firstName: "Rachel",
      lastName: "Gonzalez",
      email: "rachel.gonzalez@example.com",
      phone: "0495 678 901",
      businessName: "Gonzalez Electrical",
      businessAbn: "95 678 901 234",
      address: "258 Wire Street",
      state: "TAS",
      city: "Launceston",
      postcode: "7250",
      serviceCategories: "Electrical, Commercial",
      source: "Social Media",
      status: "email",
      priority: "medium",
      assignedTo: "Mike Chen",
      notes: "Specializes in commercial electrical work. Certified electrician.",
      nextFollowUpDate: "2024-01-21",
      lastContactDate: "2024-01-19",
      lastContactType: "email",
      createdAt: "2024-01-18T12:00:00Z",
      updatedAt: "2024-01-19T11:20:00Z"
    },
    // Won status providers
    {
      id: 15,
      firstName: "Steven",
      lastName: "Rodriguez",
      email: "steven.rodriguez@example.com",
      phone: "0496 789 012",
      businessName: "Rodriguez Construction",
      businessAbn: "96 789 012 345",
      address: "369 Build Street",
      state: "NT",
      city: "Alice Springs",
      postcode: "0870",
      serviceCategories: "Construction, Renovations",
      source: "Website",
      status: "won",
      priority: "high",
      assignedTo: "Lisa Wang",
      notes: "Full-service construction company. Licensed builder.",
      nextFollowUpDate: "2024-01-22",
      lastContactDate: "2024-01-20",
      lastContactType: "phone",
      createdAt: "2024-01-19T10:15:00Z",
      updatedAt: "2024-01-20T13:30:00Z"
    },
    {
      id: 16,
      firstName: "Melissa",
      lastName: "Turner",
      email: "melissa.turner@example.com",
      phone: "0497 890 123",
      businessName: "Turner Photography",
      businessAbn: "97 890 123 456",
      address: "741 Photo Lane",
      state: "ACT",
      city: "Belconnen",
      postcode: "2617",
      serviceCategories: "Photography, Portraits",
      source: "Referral",
      status: "won",
      priority: "medium",
      assignedTo: "Tom Anderson",
      notes: "Professional portrait photographer. Studio available.",
      nextFollowUpDate: "2024-01-23",
      lastContactDate: "2024-01-21",
      lastContactType: "email",
      createdAt: "2024-01-20T14:45:00Z",
      updatedAt: "2024-01-21T09:15:00Z"
    },
    {
      id: 1,
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@example.com",
      phone: "0412 345 678",
      businessName: "Smith Plumbing Services",
      businessAbn: "12 345 678 901",
      address: "123 Main Street",
      state: "NSW",
      city: "Sydney",
      postcode: "2000",
      serviceCategories: "Plumbing, Emergency Repairs",
      source: "Website",
      status: "new",
      priority: "high",
      assignedTo: "Sarah Johnson",
      notes: "Interested in emergency plumbing services. Has 10 years experience.",
      nextFollowUpDate: "2024-01-15",
      lastContactDate: "2024-01-10",
      lastContactType: "email",
      createdAt: "2024-01-08T10:00:00Z",
      updatedAt: "2024-01-10T14:30:00Z"
    },
    {
      id: 2,
      firstName: "Maria",
      lastName: "Garcia",
      email: "maria.garcia@example.com",
      phone: "0423 456 789",
      businessName: "Garcia Electrical",
      businessAbn: "23 456 789 012",
      address: "456 Oak Avenue",
      state: "VIC",
      city: "Melbourne",
      postcode: "3000",
      serviceCategories: "Electrical, Installation",
      source: "Referral",
      status: "new",
      priority: "medium",
      assignedTo: "Mike Chen",
      notes: "Specializes in residential electrical work. Licensed electrician.",
      nextFollowUpDate: "2024-01-16",
      lastContactDate: "2024-01-11",
      lastContactType: "phone",
      createdAt: "2024-01-09T09:15:00Z",
      updatedAt: "2024-01-11T16:45:00Z"
    },
    {
      id: 3,
      firstName: "David",
      lastName: "Wilson",
      email: "david.wilson@example.com",
      phone: "0434 567 890",
      businessName: "Wilson Cleaning Services",
      businessAbn: "34 567 890 123",
      address: "789 Pine Road",
      state: "QLD",
      city: "Brisbane",
      postcode: "4000",
      serviceCategories: "Cleaning, Commercial",
      source: "Social Media",
      status: "new",
      priority: "low",
      assignedTo: "Lisa Wang",
      notes: "Focuses on commercial cleaning. Has 5 employees.",
      nextFollowUpDate: "2024-01-18",
      lastContactDate: "2024-01-12",
      lastContactType: "email",
      createdAt: "2024-01-10T11:30:00Z",
      updatedAt: "2024-01-12T10:20:00Z"
    },
    {
      id: 4,
      firstName: "Emma",
      lastName: "Thompson",
      email: "emma.thompson@example.com",
      phone: "0445 678 901",
      businessName: "Thompson Gardening",
      businessAbn: "45 678 901 234",
      address: "321 Garden Street",
      state: "WA",
      city: "Perth",
      postcode: "6000",
      serviceCategories: "Gardening, Landscaping",
      source: "Website",
      status: "new",
      priority: "medium",
      assignedTo: "Tom Anderson",
      notes: "Specializes in sustainable gardening. Certified horticulturist.",
      nextFollowUpDate: "2024-01-17",
      lastContactDate: "2024-01-13",
      lastContactType: "phone",
      createdAt: "2024-01-11T13:45:00Z",
      updatedAt: "2024-01-13T15:10:00Z"
    },
    {
      id: 5,
      firstName: "James",
      lastName: "Brown",
      email: "james.brown@example.com",
      phone: "0456 789 012",
      businessName: "Brown Carpentry",
      businessAbn: "56 789 012 345",
      address: "654 Wood Lane",
      state: "SA",
      city: "Adelaide",
      postcode: "5000",
      serviceCategories: "Carpentry, Renovations",
      source: "Referral",
      status: "new",
      priority: "high",
      assignedTo: "Sarah Johnson",
      notes: "Expert in custom furniture and home renovations. 15 years experience.",
      nextFollowUpDate: "2024-01-14",
      lastContactDate: "2024-01-12",
      lastContactType: "email",
      createdAt: "2024-01-12T08:20:00Z",
      updatedAt: "2024-01-12T17:30:00Z"
    },
    {
      id: 6,
      firstName: "Sophie",
      lastName: "Davis",
      email: "sophie.davis@example.com",
      phone: "0467 890 123",
      businessName: "Davis Painting Co",
      businessAbn: "67 890 123 456",
      address: "987 Color Street",
      state: "TAS",
      city: "Hobart",
      postcode: "7000",
      serviceCategories: "Painting, Interior Design",
      source: "Social Media",
      status: "new",
      priority: "medium",
      assignedTo: "Mike Chen",
      notes: "Specializes in interior and exterior painting. Uses eco-friendly paints.",
      nextFollowUpDate: "2024-01-19",
      lastContactDate: "2024-01-14",
      lastContactType: "phone",
      createdAt: "2024-01-13T10:15:00Z",
      updatedAt: "2024-01-14T11:45:00Z"
    },
    {
      id: 7,
      firstName: "Michael",
      lastName: "Johnson",
      email: "michael.johnson@example.com",
      phone: "0478 901 234",
      businessName: "Johnson Security",
      businessAbn: "78 901 234 567",
      address: "147 Security Blvd",
      state: "NT",
      city: "Darwin",
      postcode: "0800",
      serviceCategories: "Security, CCTV Installation",
      source: "Website",
      status: "new",
      priority: "high",
      assignedTo: "Lisa Wang",
      notes: "Provides security systems for homes and businesses. Licensed security provider.",
      nextFollowUpDate: "2024-01-15",
      lastContactDate: "2024-01-13",
      lastContactType: "email",
      createdAt: "2024-01-14T09:30:00Z",
      updatedAt: "2024-01-13T14:20:00Z"
    },
    {
      id: 8,
      firstName: "Amanda",
      lastName: "Lee",
      email: "amanda.lee@example.com",
      phone: "0489 012 345",
      businessName: "Lee Photography",
      businessAbn: "89 012 345 678",
      address: "258 Camera Road",
      state: "ACT",
      city: "Canberra",
      postcode: "2600",
      serviceCategories: "Photography, Events",
      source: "Referral",
      status: "new",
      priority: "low",
      assignedTo: "Tom Anderson",
      notes: "Specializes in wedding and event photography. Professional equipment.",
      nextFollowUpDate: "2024-01-20",
      lastContactDate: "2024-01-15",
      lastContactType: "phone",
      createdAt: "2024-01-15T12:00:00Z",
      updatedAt: "2024-01-15T16:30:00Z"
    }
  ];

  // Fetch potential providers
  const { data: potentialProviders, isLoading } = useQuery({
    queryKey: ['/api/admin/potential-providers'],
    queryFn: async () => {
      try {
        const response = await adminApiRequest('GET', '/api/admin/potential-providers');
        const data = await response.json();
        return data;
      } catch (error) {
        console.log('Using dummy data due to API error:', error);
        return dummyProviders;
      }
    },
    staleTime: 5 * 60 * 1000,
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
        notes: "",
      });
    },
  });

  // Import providers mutation
  const importProvidersMutation = useMutation({
    mutationFn: async (importData: any) => {
      const response = await adminApiRequest('POST', '/api/admin/potential-providers/import', importData);
      return response.json();
    },
    onSuccess: (data) => {
      // Instead of immediately adding to the list, add to pending imports
      const pendingImport: PendingImport = {
        id: `pending_${Date.now()}`,
        importName: importData.importName,
        providers: data.providers || [],
        createdAt: new Date(),
      };
      setPendingImports(prev => [...prev, pendingImport]);
      setIsImportDialogOpen(false);
      setImportData({ importName: "", csvData: "" });
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
      // Remove from pending imports and refresh the main list
      setPendingImports(prev => prev.filter(imp => imp.id !== pendingImport.id));
      queryClient.invalidateQueries({ queryKey: ['/api/admin/potential-providers'] });
      setIsConfirmationDialogOpen(false);
      setSelectedPendingImport(null);
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

  // Update provider status mutation
  const updateProviderStatusMutation = useMutation({
    mutationFn: async ({ providerId, status }: { providerId: number; status: string }) => {
      const response = await adminApiRequest('PATCH', `/api/admin/potential-providers/${providerId}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/potential-providers'] });
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
      setTaskData({
        taskType: "call",
        title: "",
        description: "",
        scheduledDate: "",
        assignedTo: "",
      });
    },
  });

  // Send email mutation
  const sendEmailMutation = useMutation({
    mutationFn: async (emailData: any) => {
      const response = await adminApiRequest('POST', '/api/admin/potential-providers/email', emailData);
      return response.json();
    },
    onSuccess: () => {
      setIsEmailDialogOpen(false);
      setEmailData({ subject: "", content: "" });
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
    },
  });

  // Filter and organize providers into kanban columns
  useEffect(() => {
    if (potentialProviders) {
      // Apply the same filtering logic as getFilteredProviders but for kanban view
      const filtered = potentialProviders.filter((provider: PotentialProvider) => {
        const matchesSearch = searchTerm === "" || 
          provider.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          provider.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          provider.phone.includes(searchTerm) ||
          (provider.businessName && provider.businessName.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === "all" || provider.status === statusFilter;
        const matchesPriority = priorityFilter === "all" || provider.priority === priorityFilter;
        const matchesAssignedTo = assignedToFilter === "all" || provider.assignedTo === assignedToFilter;
        const matchesSource = sourceFilter === "all" || provider.source === sourceFilter;

        return matchesSearch && matchesStatus && matchesPriority && matchesAssignedTo && matchesSource;
      });

      const updatedColumns = KANBAN_COLUMNS.map(column => ({
        ...column,
        providers: filtered.filter((provider: PotentialProvider) => provider.status === column.id)
      }));

      setKanbanColumns(updatedColumns);
    }
  }, [potentialProviders, searchTerm, statusFilter, priorityFilter, assignedToFilter, sourceFilter]);

  // Handle drag and drop
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    const providerId = parseInt(draggableId);
    const newStatus = destination.droppableId;

    updateProviderStatusMutation.mutate({ providerId, status: newStatus });
  };

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

  const handleImportProviders = () => {
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

  const handleSendEmail = () => {
    if (selectedProvider) {
      sendEmailMutation.mutate({
        ...emailData,
        potentialProviderId: selectedProvider.id,
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

  const handleStatusChange = (providerId: number, newStatus: string) => {
    updateProviderStatusMutation.mutate({ providerId, status: newStatus });
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

  const getStatusCount = (status: string) => {
    return kanbanColumns.find(col => col.id === status)?.providers.length || 0;
  };

  const totalProviders = potentialProviders?.length || 0;
  const filteredCount = kanbanColumns.reduce((sum, col) => sum + col.providers.length, 0);
  const wonProviders = potentialProviders?.filter((p: PotentialProvider) => p.status === 'won') || [];
  const activeProviders = potentialProviders?.filter((p: PotentialProvider) => p.status !== 'won' && p.status !== 'lost') || [];
  const newProviders = potentialProviders?.filter((p: PotentialProvider) => p.status === 'new') || [];

  // Filter providers based on current view
  const getFilteredProviders = () => {
    if (!potentialProviders) return [];
    
    const filtered = potentialProviders.filter((provider: PotentialProvider) => {
      const matchesSearch = searchTerm === "" || 
        provider.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.phone.includes(searchTerm) ||
        (provider.businessName && provider.businessName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === "all" || provider.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || provider.priority === priorityFilter;
      const matchesAssignedTo = assignedToFilter === "all" || provider.assignedTo === assignedToFilter;
      const matchesSource = sourceFilter === "all" || provider.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesAssignedTo && matchesSource;
    });

    if (viewMode === 'completed') {
      return filtered.filter((p: PotentialProvider) => p.status === 'won');
    }
    
    if (viewMode === 'member-list') {
      return filtered.filter((p: PotentialProvider) => p.status === 'new');
    }
    
    if (viewMode === 'kanban') {
      return filtered; // Return all filtered providers for kanban view
    }
    
    return filtered.filter((p: PotentialProvider) => p.status !== 'won' && p.status !== 'lost' && p.status !== 'new');
  };

  const filteredProviders = getFilteredProviders();

  // Pagination logic
  const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProviders = filteredProviders.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
                <UserSearch className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Potential Providers
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
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
        <div className="px-8 py-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
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
                <span className="font-medium">Member List ({newProviders.length})</span>
              </Button>
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
            </div>
            
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
                  Completed ({wonProviders.length})
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="px-8 py-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36 h-10">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="first_call">First Call</SelectItem>
                  <SelectItem value="follow_up">Follow Up</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="won">Won</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
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
            </div>

            {/* Counts */}
            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400 font-medium">
              <span>Total: {totalProviders}</span>
              <span>New: {newProviders.length}</span>
              <span>Active: {activeProviders.length}</span>
              <span>Won: {wonProviders.length}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading potential providers...</p>
            </div>
          ) : (
            <>
              {viewMode === 'member-list' && (
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

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                        <Users className="h-5 w-5 text-blue-600 mr-2" />
                        Member List ({filteredProviders.length})
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Review and approve new potential providers
                      </p>
                    </div>
                    <div className="p-6">
                      {filteredProviders.length === 0 ? (
                        <div className="text-center py-8">
                          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No new members</h3>
                          <p className="text-gray-500">All new potential providers have been processed.</p>
                        </div>
                      ) : (
                        <div className="grid gap-4">
                          {paginatedProviders.map((provider: PotentialProvider) => (
                            <div key={provider.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                                        {provider.firstName.charAt(0)}{provider.lastName.charAt(0)}
                                      </span>
                                    </div>
                                    <div>
                                      <h3 className="font-medium text-gray-900 dark:text-white">
                                        {provider.firstName} {provider.lastName}
                                      </h3>
                                      <p className="text-sm text-gray-500">{provider.email}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium text-gray-700 dark:text-gray-300">Phone:</span>
                                      <span className="ml-2 text-gray-600 dark:text-gray-400">{provider.phone}</span>
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-700 dark:text-gray-300">Business:</span>
                                      <span className="ml-2 text-gray-600 dark:text-gray-400">{provider.businessName || 'N/A'}</span>
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-700 dark:text-gray-300">Location:</span>
                                      <span className="ml-2 text-gray-600 dark:text-gray-400">{provider.city}, {provider.state} {provider.postcode}</span>
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-700 dark:text-gray-300">Services:</span>
                                      <span className="ml-2 text-gray-600 dark:text-gray-400">{provider.serviceCategories || 'N/A'}</span>
                                    </div>
                                  </div>
                                  
                                  {provider.notes && (
                                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                      <span className="font-medium text-gray-700 dark:text-gray-300">Notes:</span>
                                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{provider.notes}</p>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex flex-col space-y-2 ml-4">
                                  <Button
                                    onClick={() => handleStatusChange(provider.id, 'first_call')}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    size="sm"
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Yes
                                  </Button>
                                  <Button
                                    onClick={() => handleStatusChange(provider.id, 'lost')}
                                    variant="destructive"
                                    size="sm"
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    No
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                          
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
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Business</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedProviders.map((provider: PotentialProvider) => (
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
                            <Select 
                              value={provider.status} 
                              onValueChange={(value) => handleStatusChange(provider.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="first_call">First Call</SelectItem>
                                <SelectItem value="follow_up">Follow Up</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="won">Won</SelectItem>
                                <SelectItem value="lost">Lost</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getPriorityColor(provider.priority)} text-white`}>
                              {provider.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {provider.assignedTo || '-'}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {
                                  setSelectedProvider(provider);
                                  setIsTaskDialogOpen(true);
                                }}>
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Add Task
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  setSelectedProvider(provider);
                                  setIsEmailDialogOpen(true);
                                }}>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Send Email
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  setSelectedProvider(provider);
                                  setIsSmsDialogOpen(true);
                                }}>
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Send SMS
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  setSelectedProvider(provider);
                                  setIsConvertDialogOpen(true);
                                }}>
                                  <UserPlus className="h-4 w-4 mr-2" />
                                  Convert to Provider
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
              )}

              {viewMode === 'kanban' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
                  {kanbanColumns.filter(col => col.id !== 'won' && col.id !== 'lost').map((column) => (
                    <div key={column.id} className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {column.title}
                        </h3>
                        <Badge variant="secondary" className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          {column.providers.length}
                        </Badge>
                      </div>
                      
                      <div className={`min-h-[500px] max-h-[600px] p-4 rounded-xl ${column.color} dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden`}>
                        {column.providers.length === 0 ? (
                          <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                            <p className="text-sm">No providers in this stage</p>
                          </div>
                        ) : (
                          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e0 #f1f5f9' }}>
                            {column.providers.map((provider) => (
                              <div
                                key={provider.id}
                                className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200 cursor-move group"
                                draggable
                                onDragStart={(e) => {
                                  e.dataTransfer.setData('text/plain', provider.id.toString());
                                }}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  const providerId = parseInt(e.dataTransfer.getData('text/plain'));
                                  if (providerId !== provider.id) {
                                    handleStatusChange(providerId, column.id);
                                  }
                                }}
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                      {provider.firstName} {provider.lastName}
                                    </h4>
                                    {provider.businessName && (
                                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                        {provider.businessName}
                                      </p>
                                    )}
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => {
                                        setSelectedProvider(provider);
                                        setIsTaskDialogOpen(true);
                                      }}>
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Add Task
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => {
                                        setSelectedProvider(provider);
                                        setIsEmailDialogOpen(true);
                                      }}>
                                        <Mail className="h-4 w-4 mr-2" />
                                        Send Email
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => {
                                        setSelectedProvider(provider);
                                        setIsSmsDialogOpen(true);
                                      }}>
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Send SMS
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => {
                                        setSelectedProvider(provider);
                                        setIsConvertDialogOpen(true);
                                      }}>
                                        <UserPlus className="h-4 w-4 mr-2" />
                                        Convert to Provider
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
                                  
                                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-gray-600">
                                    <Badge 
                                      className={`${getPriorityColor(provider.priority)} text-white text-xs font-medium`}
                                    >
                                      {provider.priority}
                                    </Badge>
                                    {provider.assignedTo && (
                                      <Badge variant="outline" className="text-xs">
                                        {provider.assignedTo}
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  {provider.nextFollowUpDate && (
                                    <div className="flex items-center text-xs text-gray-500 mt-2">
                                      <Clock className="h-3 w-3 mr-1" />
                                      Follow up: {new Date(provider.nextFollowUpDate).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {viewMode === 'completed' && (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
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
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => {
                                    setSelectedProvider(provider);
                                    setIsConvertDialogOpen(true);
                                  }}>
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Convert to Provider
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
            </>
          )}
        </div>
      </div>

      {/* Create Provider Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Potential Providers</DialogTitle>
            <DialogDescription>
              Import potential providers from a CSV file. The CSV should have columns: firstName, lastName, email, phone, businessName, address, city, state, postcode, serviceCategories
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
              <label className="text-sm font-medium">CSV Data</label>
              <Textarea
                value={importData.csvData}
                onChange={(e) => setImportData({...importData, csvData: e.target.value})}
                placeholder="Paste CSV data here..."
                rows={10}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImportProviders} disabled={importProvidersMutation.isPending}>
              {importProvidersMutation.isPending ? "Importing..." : "Import Providers"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
            <DialogDescription>
              Create a new task for {selectedProvider?.firstName} {selectedProvider?.lastName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Task Type</label>
              <Select value={taskData.taskType} onValueChange={(value) => setTaskData({...taskData, taskType: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="follow_up">Follow Up</SelectItem>
                  <SelectItem value="note">Note</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={taskData.title}
                onChange={(e) => setTaskData({...taskData, title: e.target.value})}
                placeholder="Task title"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={taskData.description}
                onChange={(e) => setTaskData({...taskData, description: e.target.value})}
                placeholder="Task description"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Scheduled Date</label>
              <Input
                type="datetime-local"
                value={taskData.scheduledDate}
                onChange={(e) => setTaskData({...taskData, scheduledDate: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Assigned To</label>
              <Input
                value={taskData.assignedTo}
                onChange={(e) => setTaskData({...taskData, assignedTo: e.target.value})}
                placeholder="Admin username"
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
            <DialogDescription>
              Send an email to {selectedProvider?.firstName} {selectedProvider?.lastName} ({selectedProvider?.email})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Subject</label>
              <Input
                value={emailData.subject}
                onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                placeholder="Email subject"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={emailData.content}
                onChange={(e) => setEmailData({...emailData, content: e.target.value})}
                placeholder="Email content..."
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
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
                
                <div className="max-h-96 overflow-y-auto">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Imported Providers</h4>
                  <div className="space-y-2">
                    {selectedPendingImport.providers.map((provider, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {provider.firstName} {provider.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{provider.email}</p>
                            <p className="text-sm text-gray-500">{provider.phone}</p>
                            {provider.businessName && (
                              <p className="text-sm text-gray-500">{provider.businessName}</p>
                            )}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {provider.city}, {provider.state}
                          </Badge>
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
    </div>
  );
}
