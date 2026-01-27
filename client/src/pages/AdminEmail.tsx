import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { adminApiRequest } from "@/lib/adminAuth";
import { useQuery } from "@tanstack/react-query";
import { emailTemplates as defaultTemplates } from "@/lib/emailTemplates";
import { getEmailSignature, formatSignatureForDisplay } from "@/lib/emailSignatures";
import {
  Search,
  Filter,
  Plus,
  Star,
  Trash2,
  Archive,
  Send,
  Eye,
  MoreHorizontal,
  Calendar,
  ChevronRight,
  FolderPlus,
  Shield,
  X,
  FileText,
  Clock,
  Truck,
  Scissors,
  Copy,
  RotateCcw,
  RotateCw,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  Mail,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  Image,
  Table,
  Minus,
  Quote,
  Code,
  HelpCircle,
  Palette,
  Highlighter,
  Loader2,
} from "lucide-react";

interface Email {
  id: number;
  from: string;
  to: string;
  subject: string;
  body: string;
  status: 'inbox' | 'sent' | 'draft' | 'trash' | 'spam' | 'archive';
  isRead: boolean;
  isStarred: boolean;
  hasAttachments: boolean;
  createdAt: string;
  userId?: string;
}

// Users for filter will be fetched from backend

export default function AdminEmail() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  // Get current logged-in user
  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ['adminUser'],
    queryFn: async () => {
      const response = await adminApiRequest("GET", "/api/admin/current-user");
      if (!response.ok) {
        throw new Error('Failed to fetch current user');
      }
      const userData = await response.json();
      console.log('Fetched current user:', userData);
      return userData;
    },
  });

  const initialSelectedUser = (typeof window !== 'undefined' && localStorage.getItem('adminEmail.selectedUser')) || (currentUser?.username || 'admin');
  const initialActiveTab = (typeof window !== 'undefined' && localStorage.getItem('adminEmail.activeTab')) || 'inbox';
  const initialSearch = (typeof window !== 'undefined' && localStorage.getItem('adminEmail.searchTerm')) || '';
  const initialFrom = (typeof window !== 'undefined' && localStorage.getItem('adminEmail.fromDate')) || '';
  const initialTo = (typeof window !== 'undefined' && localStorage.getItem('adminEmail.toDate')) || '';

  const [emails, setEmails] = useState<Email[]>([]);
  const [users, setUsers] = useState<{ id: string; numericId?: number; username?: string; firstName: string; lastName: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>(initialSelectedUser);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [fromDate, setFromDate] = useState(initialFrom);
  const [toDate, setToDate] = useState(initialTo);
  const [activeTab, setActiveTab] = useState<string>(initialActiveTab);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isComposeDialogOpen, setIsComposeDialogOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [emailTemplates, setEmailTemplates] = useState<{ id: number; name: string; subject: string; body: string }[]>(defaultTemplates);
  const [isFetchingEmails, setIsFetchingEmails] = useState(false);
  const [fetchEmailDialogOpen, setFetchEmailDialogOpen] = useState(false);
  const [fetchEmailData, setFetchEmailData] = useState({ email: '', password: '', fetchAll: true });
  const [composeData, setComposeData] = useState({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    body: "",
    template: "none",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [tabCounts, setTabCounts] = useState<Record<string, number>>({
    inbox: 0,
    sent: 0,
    draft: 0,
    trash: 0,
    spam: 0,
    archive: 0,
    unread: 0,
  });
  
  // Confirmation dialog states
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'archive' | 'trash' | 'spam';
    email: Email;
    message: string;
  } | null>(null);

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin-login');
    }
  }, [navigate]);

  // Persist filters/tabs in localStorage
  useEffect(() => {
    localStorage.setItem('adminEmail.activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('adminEmail.selectedUser', selectedUser);
  }, [selectedUser]);

  useEffect(() => {
    localStorage.setItem('adminEmail.searchTerm', searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    localStorage.setItem('adminEmail.fromDate', fromDate);
    localStorage.setItem('adminEmail.toDate', toDate);
  }, [fromDate, toDate]);

  const authHeaders = () => {
    const adminToken = localStorage.getItem('adminToken');
    return {
      'Authorization': `Bearer ${adminToken || ''}`,
      'Content-Type': 'application/json',
    } as HeadersInit;
  };

  // Fetch users for filter
  const fetchUsers = async () => {
    try {
      const res = await adminApiRequest('GET', '/api/admin/users');
      if (!res.ok) return;
      const list = await res.json();
      // Use numeric ID as the id (emails are stored with numeric IDs)
      const mapped = list.map((u: any) => ({ 
        id: u.id.toString(), // Convert to string for consistency
        numericId: u.id,
        username: u.username,
        firstName: u.firstName || u.username || 'User', 
        lastName: u.lastName || '' 
      }));
      setUsers(mapped);
    } catch {}
  };

  // Check if database has templates, otherwise use file templates
  const fetchEmailTemplates = async () => {
    try {
      const res = await adminApiRequest('GET', '/api/admin/email-templates');
      if (res.ok) {
        const templates = await res.json();
        // If database has templates, use them; otherwise keep default file templates
        if (templates && templates.length > 0) {
          setEmailTemplates(templates);
        }
      }
    } catch (error) {
      // Use default file templates (already set in state)
      console.log('Using default email templates from file');
    }
  };

  // Fetch emails based on current filters
  const fetchEmails = async () => {
    try {
      const params = new URLSearchParams({
        tab: activeTab,
        user: selectedUser,
        search: searchTerm,
        fromDate,
        toDate,
      });
      const res = await adminApiRequest('GET', `/api/admin/emails?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch emails');
      const data = await res.json();
      setEmails(data);
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to load emails', variant: 'destructive' });
    }
  };

  // Fetch counts for side tabs
  const fetchCounts = async () => {
    try {
      const tabs = ['inbox','sent','draft','trash','spam','archive','unread'];
      const results = await Promise.all(
        tabs.map(async (tab) => {
          const params = new URLSearchParams({ tab, user: selectedUser, search: '', fromDate: '', toDate: '' });
          const res = await adminApiRequest('GET', `/api/admin/emails?${params.toString()}`);
          if (!res.ok) return [tab, 0] as const;
          const data = await res.json();
          return [tab, Array.isArray(data) ? data.length : 0] as const;
        })
      );
      const next: Record<string, number> = {};
      for (const [tab, count] of results) next[tab] = count;
      setTabCounts((prev) => ({ ...prev, ...next }));
    } catch {}
  };

  // Track previous user to detect user changes (logout/login)
  const prevUsernameRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    fetchUsers();
    // Try to fetch templates from database, but use defaults if not available
    fetchEmailTemplates();
  }, []);

  // Clear email data when user changes (logout/login with different user)
  useEffect(() => {
    const currentUsername = currentUser?.username;
    const prevUsername = prevUsernameRef.current;

    // If user changed (different user logged in), clear all email-related data
    if (prevUsername && currentUsername && prevUsername !== currentUsername) {
      console.log('User changed from', prevUsername, 'to', currentUsername, '- clearing email data');
      // Clear localStorage
      localStorage.removeItem('adminEmail.selectedUser');
      localStorage.removeItem('adminEmail.activeTab');
      localStorage.removeItem('adminEmail.searchTerm');
      localStorage.removeItem('adminEmail.fromDate');
      localStorage.removeItem('adminEmail.toDate');
      // Clear state
      setEmails([]);
      setSelectedIds([]);
      setTabCounts({});
      setSearchTerm('');
      setFromDate('');
      setToDate('');
      setActiveTab('inbox');
      setSelectedUser('admin'); // Reset to default, will be set below
    }

    // Update ref to current username
    prevUsernameRef.current = currentUsername;
  }, [currentUser?.username]);

  // Set selectedUser to current user's numeric ID when they log in
  useEffect(() => {
    if (currentUser?.username && users.length > 0) {
      // Find the user in the users list to get their numeric ID
      const currentUserInList = users.find(u => u.username === currentUser.username);
      if (currentUserInList) {
        // Use numeric ID (emails are stored with numeric IDs)
        // Only update if different to avoid unnecessary re-renders
        if (selectedUser !== currentUserInList.id) {
          setSelectedUser(currentUserInList.id);
          console.log('Setting selectedUser to current user ID:', currentUserInList.id, 'for user:', currentUser.username);
        }
      } else {
        console.log('Current user not found in users list');
      }
    }
  }, [currentUser?.username, users]);

  // Fetch emails when filters change, but only if selectedUser is set and currentUser is loaded
  useEffect(() => {
    if (selectedUser && selectedUser !== '' && selectedUser !== 'admin' && currentUser?.username) {
      console.log('Fetching emails for user:', selectedUser, 'tab:', activeTab);
      fetchEmails();
      fetchCounts();
    }
  }, [activeTab, selectedUser, searchTerm, fromDate, toDate, currentUser?.username]);

  const getTabCount = (tab: string) => tabCounts[tab] || 0;
  const getUnreadCount = () => tabCounts['unread'] || 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const extractEmail = (emailString: string) => {
    if (!emailString) return '';
    // Check if it's in format "Name" <email@domain.com>
    const match = emailString.match(/<([^>]+)>/);
    if (match) {
      return match[1];
    }
    // If it's already just an email, return it
    return emailString;
  };

  // Fetch emails from IMAP
  const handleFetchEmails = async () => {
    if (!fetchEmailData.email || !fetchEmailData.password) {
      toast({
        title: 'Error',
        description: 'Please enter email and password',
        variant: 'destructive',
      });
      return;
    }

    setIsFetchingEmails(true);
    try {
      const res = await adminApiRequest('POST', '/api/admin/emails/fetch-imap', {
        email: fetchEmailData.email,
        password: fetchEmailData.password,
        fetchAll: fetchEmailData.fetchAll,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch emails');
      }

      const result = await res.json();
      toast({
        title: 'Success',
        description: `Fetched ${result.count} emails from ${fetchEmailData.email}`,
      });

      // Refresh email list
      await fetchEmails();
      await fetchCounts();

      // Close dialog and reset form
      setFetchEmailDialogOpen(false);
      setFetchEmailData({ email: '', password: '', fetchAll: true });
    } catch (error: any) {
      console.error('Error fetching emails:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch emails from IMAP',
        variant: 'destructive',
      });
    } finally {
      setIsFetchingEmails(false);
    }
  };

  const handleViewEmail = async (email: Email) => {
    setSelectedEmail(email);
    setIsViewDialogOpen(true);
    // mark as read in backend
    try {
      if (!email.isRead) {
        await adminApiRequest('PATCH', `/api/admin/emails/${email.id}/read`);
        // reflect locally
        setEmails((prev) => prev.map((e) => e.id === email.id ? { ...e, isRead: true } : e));
        fetchCounts();
      }
    } catch {}
  };

  // Confirmation dialog handlers
  const showConfirmDialogForAction = (type: 'archive' | 'trash' | 'spam', email: Email) => {
    const messages = {
      archive: `Are you sure you want to move "${email.subject}" to Archive?`,
      trash: `Are you sure you want to move "${email.subject}" to Trash?`,
      spam: `Are you sure you want to mark "${email.subject}" as Spam?`
    };
    
    setConfirmAction({ type, email, message: messages[type] });
    setShowConfirmDialog(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    
    const { type, email } = confirmAction;
    
    try {
      switch (type) {
        case 'archive':
          await handleArchive(email);
          break;
        case 'trash':
          await handleMoveToTrash(email);
          break;
        case 'spam':
          await handleMarkAsSpam(email);
          break;
      }
    } finally {
      setShowConfirmDialog(false);
      setConfirmAction(null);
    }
  };

  const handleCancelAction = () => {
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  const handleArchive = async (email: Email) => {
    try {
      // Get admin token for authentication
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        toast({
          title: "Authentication required",
          description: "Please log in as admin to perform this action.",
          variant: "destructive",
        });
        return;
      }

      // Update email status to archive via API
      const response = await adminApiRequest('PATCH', `/api/admin/emails/${email.id}/status`, {
        status: 'archive',
        folder: 'archive'
      });

      if (response.ok) {
        await fetchEmails();
        await fetchCounts();
        toast({
          title: "Email archived",
          description: "Email has been moved to archive.",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Failed to archive email",
          description: error.message || "An error occurred while archiving the email.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error archiving email:', error);
      toast({
        title: "Error",
        description: "Failed to archive email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMoveToTrash = async (email: Email) => {
    try {
      // Get admin token for authentication
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        toast({
          title: "Authentication required",
          description: "Please log in as admin to perform this action.",
          variant: "destructive",
        });
        return;
      }

      // Update email status to trash via API
      const response = await adminApiRequest('PATCH', `/api/admin/emails/${email.id}/status`, {
        status: 'trash',
        folder: 'trash'
      });

      if (response.ok) {
        await fetchEmails();
        await fetchCounts();
        toast({
          title: "Email moved to trash",
          description: "Email has been moved to trash.",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Failed to move email to trash",
          description: error.message || "An error occurred while moving the email to trash.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error moving email to trash:', error);
      toast({
        title: "Error",
        description: "Failed to move email to trash. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsSpam = async (email: Email) => {
    try {
      // Get admin token for authentication
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        toast({
          title: "Authentication required",
          description: "Please log in as admin to perform this action.",
          variant: "destructive",
        });
        return;
      }

      // Update email status to spam via API
      const response = await adminApiRequest('PATCH', `/api/admin/emails/${email.id}/status`, {
        status: 'spam',
        folder: 'spam'
      });

      if (response.ok) {
        await fetchEmails();
        await fetchCounts();
        toast({
          title: "Email marked as spam",
          description: "Email has been marked as spam.",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Failed to mark email as spam",
          description: error.message || "An error occurred while marking the email as spam.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error marking email as spam:', error);
      toast({
        title: "Error",
        description: "Failed to mark email as spam. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendEmail = async () => {
    if (!composeData.to || !composeData.subject || !composeData.body) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingEmail(true);
    try {
      // Get admin token for authentication
      const adminToken = localStorage.getItem('adminToken');
      console.log('Admin token:', adminToken ? 'Present' : 'Missing');
      console.log('Admin token value:', adminToken);
      
      if (!adminToken) {
        setIsSendingEmail(false);
        toast({
          title: "Authentication required",
          description: "Please log in as admin to send emails.",
          variant: "destructive",
        });
        return;
      }

      console.log('Sending email to:', composeData.to);
      console.log('Subject:', composeData.subject);

      // Send email via API
      const response = await adminApiRequest('POST', '/api/admin/emails/send', {
          to: composeData.to,
          cc: composeData.cc,
          bcc: composeData.bcc,
          subject: composeData.subject,
          body: composeData.body,
          template: composeData.template
        });


      if (response.ok) {
        const result = await response.json();
        console.log('Success response ff:', result);
        toast({
          title: "Email sent successfully",
          description: result.message || "Your email has been sent.",
        });
        setIsComposeDialogOpen(false);
        setComposeData({ to: "", cc: "", bcc: "", subject: "", body: "", template: "none" });
        setSelectedFiles([]);
        // Refresh email list and counts to show the sent email immediately
        await fetchEmails();
        await fetchCounts();
      } else {
        let errorMessage = 'Unknown error occurred';
        try {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
          console.log('Error response:', error);
        } catch (parseError) {
          const errorText = await response.text();
          console.log('Error response text:', errorText);
          console.log('Error response length:', errorText.length);
          console.log('Error response first 200 chars:', errorText.substring(0, 200));
          errorMessage = `HTTP ${response.status}: ${errorText.substring(0, 100)}...`;
        }
        
        toast({
          title: "Failed to send email",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Error",
        description: `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      // Get admin token for authentication
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        toast({
          title: "Authentication required",
          description: "Please log in as admin to save drafts.",
          variant: "destructive",
        });
        return;
      }

      // Save draft via API
      const response = await adminApiRequest('POST', '/api/admin/emails/send', {
        to: composeData.to,
        cc: composeData.cc,
        bcc: composeData.bcc,
        subject: composeData.subject,
        body: composeData.body,
        template: composeData.template,
        status: 'draft' // Mark as draft
      });

      if (response.ok) {
        toast({
          title: "Draft saved",
          description: "Your email has been saved as a draft.",
        });
        // Refresh email list and counts to show the draft immediately
        await fetchEmails();
        await fetchCounts();
        // Don't close the compose dialog for drafts
      } else {
        const error = await response.json();
        toast({
          title: "Failed to save draft",
          description: error.message || "An error occurred while saving the draft.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleScheduleEmail = async () => {
    try {
      // Get admin token for authentication
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        toast({
          title: "Authentication required",
          description: "Please log in as admin to schedule emails.",
          variant: "destructive",
        });
        return;
      }

      // For now, we'll save as a draft with a scheduled flag
      // In a full implementation, you'd want a separate scheduled emails table
      const response = await adminApiRequest('POST', '/api/admin/emails/send', {
        to: composeData.to,
        cc: composeData.cc,
        bcc: composeData.bcc,
        subject: composeData.subject,
        body: composeData.body,
        template: composeData.template,
        status: 'draft', // Save as draft for now
        scheduled: true // Flag as scheduled
      });

      if (response.ok) {
        toast({
          title: "Email scheduled",
          description: "Your email has been scheduled for later delivery.",
        });
        // Refresh email list and counts to show the scheduled email immediately
        await fetchEmails();
        await fetchCounts();
        // Don't close the compose dialog for scheduled emails
      } else {
        const error = await response.json();
        toast({
          title: "Failed to schedule email",
          description: error.message || "An error occurred while scheduling the email.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error scheduling email:', error);
      toast({
        title: "Error",
        description: "Failed to schedule email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // If some rows are selected, use bulk; otherwise, apply to the single email
  const executeStatusAction = async (status: 'archive' | 'trash' | 'spam', email: Email) => {
    if (selectedIds.length > 0) {
      await bulkUpdateStatus(status);
      return;
    }
    if (status === 'archive') await handleArchive(email);
    if (status === 'trash') await handleMoveToTrash(email);
    if (status === 'spam') await handleMarkAsSpam(email);
  };

  // Bulk actions
  const bulkUpdateStatus = async (status: 'archive' | 'trash' | 'spam' | 'draft') => {
    try {
      if (selectedIds.length === 0) {
        toast({ title: 'Select emails first', variant: 'destructive' });
        return;
      }

      const res = await adminApiRequest('PATCH', '/api/admin/emails/bulk-status', { ids: selectedIds, status });
      if (!res.ok) {
        let detail = '';
        try { const j = await res.json(); detail = j?.message || ''; } catch {}
        console.error('Bulk status failed', res.status, detail);
        throw new Error(detail || `HTTP ${res.status}`);
      }
      const payload = await res.json();
      console.log('bulk-status response', payload);
      toast({ title: 'Updated', description: `Applied ${status} to ${selectedIds.length} email(s).` });
      await fetchEmails();
      await fetchCounts();
      setSelectedIds([]);
    } catch (err) {
      console.error('bulkUpdateStatus error', err);
      toast({ title: 'Bulk action failed', description: err instanceof Error ? err.message : '', variant: 'destructive' });
    }
  };

  const bulkDelete = async () => {
    try {
      if (selectedIds.length === 0) {
        toast({ title: 'Select emails first', variant: 'destructive' });
        return;
      }

      const res = await adminApiRequest('POST', '/api/admin/emails/bulk-delete', { ids: selectedIds });
      if (!res.ok) {
        let detail = '';
        try { const j = await res.json(); detail = j?.message || ''; } catch {}
        console.error('Bulk delete failed', res.status, detail);
        throw new Error(detail || `HTTP ${res.status}`);
      }
      toast({ title: 'Deleted', description: `${selectedIds.length} email(s) deleted.` });
      await fetchEmails();
      await fetchCounts();
      setSelectedIds([]);
    } catch (err) {
      console.error('bulkDelete error', err);
      toast({ title: 'Bulk delete failed', description: err instanceof Error ? err.message : '', variant: 'destructive' });
    }
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
          onLogout={() => {
            // Clear all email-related localStorage before logout
            localStorage.removeItem('adminEmail.selectedUser');
            localStorage.removeItem('adminEmail.activeTab');
            localStorage.removeItem('adminEmail.searchTerm');
            localStorage.removeItem('adminEmail.fromDate');
            localStorage.removeItem('adminEmail.toDate');
            // Clear admin token
            localStorage.removeItem('adminToken');
            // Reload page to ensure fresh state
            window.location.href = '/admin-login';
          }} 
          adminUser={currentUser ? {
            firstName: currentUser.firstName || currentUser.username,
            lastName: currentUser.lastName || '',
            username: currentUser.username || 'admin'
          } : undefined}
        />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Top Filter Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search Anything"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>

              {/* Select Dropdown */}
              <div className="flex items-center space-x-2">
                <Label htmlFor="user-filter" className="text-sm font-medium">Select:</Label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users
                      .filter((user) => {
                        // Super admin or Administrator can see all users
                        const canSeeAllUsers = currentUser?.role === 'super_admin' 
                          || currentUser?.role === 'Administrator' 
                          || currentUser?.username === 'admin';
                        if (canSeeAllUsers) {
                          return true;
                        }
                        // Regular users can only see their own emails
                        if (currentUser?.username) {
                          return user.id === currentUser.username || user.firstName === currentUser.firstName;
                        }
                        return true; // Fallback to show all users if currentUser is not loaded
                      })
                      .map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.firstName} {user.lastName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Filters */}
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-40"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-40"
                />
              </div>

              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Reset
              </Button>
              
              {/* Fetch Emails from IMAP Button */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setFetchEmailDialogOpen(true)}
                disabled={isFetchingEmails}
              >
                {isFetchingEmails ? 'Fetching...' : 'Fetch Emails'}
              </Button>

              {selectedIds.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Action <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="z-50">
                    <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => bulkUpdateStatus('archive')}>
                      <Archive className="h-4 w-4 mr-2" /> Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => bulkUpdateStatus('trash')}>
                      <Trash2 className="h-4 w-4 mr-2" /> Move to Trash
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => bulkUpdateStatus('spam')}>
                      <Shield className="h-4 w-4 mr-2" /> Mark as Spam
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => bulkUpdateStatus('draft')}>
                      <FileText className="h-4 w-4 mr-2" /> Save as Draft
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => bulkDelete()}>
                      <X className="h-4 w-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>

        {/* User/Category Filter Buttons */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {users
              .filter((user) => {
                // Super admin or Administrator can see all users
                const canSeeAllUsers = currentUser?.role === 'super_admin' 
                  || currentUser?.role === 'Administrator' 
                  || currentUser?.username === 'admin';
                if (canSeeAllUsers) {
                  return true;
                }
                // Regular users can only see their own emails
                if (currentUser?.username) {
                  return user.id === currentUser.username || user.firstName === currentUser.firstName;
                }
                return true; // Fallback to show all users if currentUser is not loaded
              })
              .map((user) => (
                <Button
                  key={user.id}
                  variant={selectedUser === user.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedUser(user.id)}
                  className="whitespace-nowrap"
                >
                  {user.firstName} {user.lastName}
                </Button>
              ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Email Folders */}
          <div className="w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200/50 flex flex-col shadow-lg">
            <div className="p-4">
              <Button
                onClick={() => setIsComposeDialogOpen(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Compose
              </Button>
            </div>

            <div className="flex-1 px-4 space-y-1">
              <div className="space-y-1">
                <div 
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    activeTab === 'inbox' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg shadow-blue-500/30' : 'hover:bg-gray-100 hover:translate-x-1'
                  }`}
                  onClick={() => setActiveTab('inbox')}
                >
                  <span className="text-sm font-medium">INBOX</span>
                  <Badge variant={activeTab === 'inbox' ? 'secondary' : 'secondary'} className={activeTab === 'inbox' ? 'bg-white/20 text-white border-0' : ''}>({getTabCount('inbox')})</Badge>
                </div>
                <div 
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    activeTab === 'sent' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg shadow-green-500/30' : 'hover:bg-gray-100 hover:translate-x-1'
                  }`}
                  onClick={() => setActiveTab('sent')}
                >
                  <span className="text-sm font-medium">Sent</span>
                  <Badge variant="secondary" className={activeTab === 'sent' ? 'bg-white/20 text-white border-0' : ''}>({getTabCount('sent')})</Badge>
                </div>
                <div 
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    activeTab === 'draft' ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold shadow-lg shadow-orange-500/30' : 'hover:bg-gray-100 hover:translate-x-1'
                  }`}
                  onClick={() => setActiveTab('draft')}
                >
                  <span className="text-sm font-medium">Drafts</span>
                  <Badge variant="secondary" className={activeTab === 'draft' ? 'bg-white/20 text-white border-0' : ''}>({getTabCount('draft')})</Badge>
                </div>
                <div 
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    activeTab === 'spam' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg shadow-red-500/30' : 'hover:bg-gray-100 hover:translate-x-1'
                  }`}
                  onClick={() => setActiveTab('spam')}
                >
                  <span className="text-sm font-medium">Spam</span>
                  <Badge variant="secondary" className={activeTab === 'spam' ? 'bg-white/20 text-white border-0' : ''}>({getTabCount('spam')})</Badge>
                </div>
                <div 
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    activeTab === 'trash' ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold shadow-lg shadow-gray-600/30' : 'hover:bg-gray-100 hover:translate-x-1'
                  }`}
                  onClick={() => setActiveTab('trash')}
                >
                  <span className="text-sm font-medium">Trash</span>
                  <Badge variant="secondary" className={activeTab === 'trash' ? 'bg-white/20 text-white border-0' : ''}>({getTabCount('trash')})</Badge>
                </div>
                <div 
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    activeTab === 'archive' ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold shadow-lg shadow-purple-500/30' : 'hover:bg-gray-100 hover:translate-x-1'
                  }`}
                  onClick={() => setActiveTab('archive')}
                >
                  <span className="text-sm font-medium">Archive</span>
                  <Badge variant="secondary" className={activeTab === 'archive' ? 'bg-white/20 text-white border-0' : ''}>({getTabCount('archive')})</Badge>
                </div>
                <div 
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    activeTab === 'unread' ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold shadow-lg shadow-indigo-500/30' : 'hover:bg-gray-100 hover:translate-x-1'
                  }`}
                  onClick={() => setActiveTab('unread')}
                >
                  <span className="text-sm font-medium">Unread</span>
                  <Badge variant="secondary" className={activeTab === 'unread' ? 'bg-white/20 text-white border-0' : ''}>({getUnreadCount()})</Badge>
                </div>
                <div 
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    activeTab === 'test' ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold shadow-lg shadow-cyan-500/30' : 'hover:bg-gray-100 hover:translate-x-1'
                  }`}
                  onClick={() => setActiveTab('test')}
                >
                  <span className="text-sm font-medium">Test</span>
                  <div className="flex items-center gap-1">
                    <Badge variant="secondary" className={activeTab === 'test' ? 'bg-white/20 text-white border-0' : ''}>(0)</Badge>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="p-4 border-t border-gray-200">
              <Button variant="outline" className="w-full">
                <FolderPlus className="h-4 w-4 mr-2" />
                Create Folder
              </Button>
            </div> */}
          </div>

          {/* Right Side - Email List */}
          <div className="flex-1 bg-white">
            {/* Email List Header */}
            {/* <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 capitalize">
                  {activeTab === 'inbox' ? 'Inbox' : 
                   activeTab === 'sent' ? 'Sent' : 
                   activeTab === 'draft' ? 'Drafts' : 
                   activeTab === 'spam' ? 'Spam' : 
                   activeTab === 'trash' ? 'Trash' : 
                   activeTab === 'archive' ? 'Archive' : 
                   activeTab === 'unread' ? 'Unread' : 
                   activeTab === 'test' ? 'Test' : 'Emails'}
                </h2>
                                 <span className="text-sm text-gray-500">
                   {filteredEmails.length} email{filteredEmails.length !== 1 ? 's' : ''}
                 </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  Action <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
                <Button variant="outline" size="sm">
                  Show All Emails
                </Button>
                <Button variant="outline" size="sm">
                  Show Unread Emails
                </Button>
                <Button variant="outline" size="sm">
                  Show Read Emails
                </Button>
              </div>
            </div> */}

            {selectedIds.length > 0 && (
              <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
                <div className="text-sm">{selectedIds.length} selected</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={async () => { await bulkUpdateStatus('archive'); }}>Archive</Button>
                  <Button variant="outline" size="sm" onClick={async () => { await bulkUpdateStatus('trash'); }}>Move to Trash</Button>
                  <Button variant="outline" size="sm" onClick={async () => { await bulkUpdateStatus('spam'); }}>Mark as Spam</Button>
                  <Button variant="outline" size="sm" onClick={async () => { await bulkUpdateStatus('draft'); }}>Save as Draft</Button>
                  <Button variant="destructive" size="sm" onClick={async () => { await bulkDelete(); }}>Delete</Button>
                </div>
              </div>
            )}
            {/* Email Table */}
            <div className="overflow-x-auto max-h-[80vh] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-3 text-left">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={emails.length > 0 && selectedIds.length === emails.length}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          if (checked) setSelectedIds(emails.map((e) => e.id)); else setSelectedIds([]);
                        }}
                      />
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-16">
                      #
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider max-w-[300px]">
                      SUBJECT
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      NAME
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      TO
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      DATE
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-24">
                      ACTION
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {emails.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Mail className="h-8 w-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No emails found</h3>
                          <p className="text-sm text-gray-500 max-w-sm text-center">
                            {activeTab === 'inbox' ? 'Your inbox is empty. New emails will appear here.' :
                             activeTab === 'sent' ? 'No sent emails yet. Start composing to send your first email.' :
                             activeTab === 'draft' ? 'No draft emails. Start composing to create your first draft.' :
                             activeTab === 'trash' ? 'Trash is empty. Deleted emails will appear here.' :
                             activeTab === 'spam' ? 'No spam emails. Spam emails will appear here.' :
                             activeTab === 'archive' ? 'No archived emails. Archived emails will appear here.' :
                             activeTab === 'unread' ? 'No unread emails. All emails have been read.' :
                             'No emails found in this folder.'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    emails.map((email, index) => (
                      <tr 
                        key={email.id} 
                        className={`hover:bg-blue-50/50 cursor-pointer transition-all duration-200 border-b border-gray-100 hover:shadow-md ${email.isRead ? '' : 'bg-blue-50/40 font-semibold'}`} 
                        onClick={() => handleViewEmail(email)}
                      >
                        <td className="px-3 py-3" onClick={(e) => { e.stopPropagation(); }}>
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300" 
                            checked={selectedIds.includes(email.id)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setSelectedIds((prev) => checked ? Array.from(new Set([...prev, email.id])) : prev.filter((id) => id !== email.id));
                            }}
                          />
                        </td>
                        <td className="px-3 py-3">
                          <span className="font-semibold text-gray-600">{index + 1}</span>
                        </td>
                        <td className="px-3 py-3 max-w-[250px]">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg shadow-blue-500/30 flex-shrink-0">
                              {email.from.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-900 truncate max-w-[350px]">{email.subject}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-900 max-w-xs truncate">{email.body}</td>
                        <td className="px-3 py-3 text-sm text-gray-900 truncate max-w-[200px]">{extractEmail(email.to)}</td>
                        <td className="px-3 py-3 text-sm text-gray-500 whitespace-nowrap">{formatDate(email.createdAt)}</td>
                        <td className="px-3 py-3">
                                                 <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="h-8 w-8 p-0"
                               onClick={(e) => e.stopPropagation()}
                             >
                               <MoreHorizontal className="h-4 w-4" />
                             </Button>
                           </DropdownMenuTrigger>
                                                     <DropdownMenuContent align="end" className="z-50">
                             <DropdownMenuLabel>Actions</DropdownMenuLabel>
                             <DropdownMenuSeparator />
                             <DropdownMenuItem onClick={(e) => {
                               e.stopPropagation();
                               handleViewEmail(email);
                             }}>
                               <Eye className="h-4 w-4 mr-2" />
                               View
                             </DropdownMenuItem>
                             <DropdownMenuItem onClick={async (e) => {
                               e.stopPropagation();
                               await executeStatusAction('archive', email);
                             }}>
                                <Archive className="h-4 w-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={async (e) => {
                                e.stopPropagation();
                                await executeStatusAction('trash', email);
                              }}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Move to Trash
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={async (e) => {
                                e.stopPropagation();
                                await executeStatusAction('spam', email);
                              }}>
                                <Shield className="h-4 w-4 mr-2" />
                                Mark as Spam
                              </DropdownMenuItem>
                           </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                   )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* View Email Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Email Details</DialogTitle>
          </DialogHeader>
          
          {selectedEmail && (
            <div className="space-y-4">
              {/* Email Header */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{selectedEmail.subject}</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">From:</span>
                    <span className="ml-2 text-gray-900">{selectedEmail.from}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">To:</span>
                    <span className="ml-2 text-gray-900">{selectedEmail.to}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Date:</span>
                    <span className="ml-2 text-gray-900">{formatDate(selectedEmail.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Email Body */}
              <div className="prose max-w-none">
                <div>{selectedEmail.body}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Compose Email Dialog - Updated to match screenshot */}
      <Dialog open={isComposeDialogOpen} onOpenChange={setIsComposeDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex items-center justify-between">
            <DialogTitle>New Message</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsComposeDialogOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Recipient and Subject Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  placeholder="Email Id"
                  value={composeData.to}
                  onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="cc">CC</Label>
                <Input
                  id="cc"
                  placeholder="Email Id"
                  value={composeData.cc}
                  onChange={(e) => setComposeData({ ...composeData, cc: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="bcc">BCC</Label>
                <Input
                  id="bcc"
                  placeholder="Email Id"
                  value={composeData.bcc}
                  onChange={(e) => setComposeData({ ...composeData, bcc: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="template">Template</Label>
                <Select 
                  value={composeData.template} 
                  onValueChange={(value) => {
                    if (value === "none") {
                      setComposeData({ ...composeData, template: "none", subject: "", body: "" });
                    } else {
                      const templateId = parseInt(value);
                      const selectedTemplate = emailTemplates.find(t => t.id === templateId);
                      if (selectedTemplate) {
                        setComposeData({ 
                          ...composeData, 
                          template: value, 
                          subject: selectedTemplate.subject,
                          body: selectedTemplate.body
                        });
                      }
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No template</SelectItem>
                    {emailTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id.toString()}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Subject"
                  value={composeData.subject}
                  onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
                />
              </div>
            </div>

            {/* File Attachment */}
            <div>
              <Label>Attachments</Label>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => document.getElementById('file-input')?.click()}>
                  Choose Files
                </Button>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <span className="text-sm text-gray-500">
                  {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : 'No file chosen'}
                </span>
              </div>
              {selectedFiles.length > 0 && (
                <div className="mt-2 space-y-1">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span>{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rich Text Editor Toolbar */}
            <div className="border border-gray-200 rounded-lg p-2 bg-gray-50">
              <div className="flex flex-wrap items-center gap-1">
                {/* Basic Actions */}
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Scissors className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Copy className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <FileText className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <RotateCcw className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <RotateCw className="h-3 w-3" />
                </Button>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                {/* Text Formatting */}
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Bold className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Italic className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Underline className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Strikethrough className="h-3 w-3" />
                </Button>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                {/* Lists and Alignment */}
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <List className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ListOrdered className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <AlignLeft className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <AlignCenter className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <AlignRight className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <AlignJustify className="h-3 w-3" />
                </Button>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                {/* Insert Options */}
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Link className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Image className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Table className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Minus className="h-3 w-3" />
                </Button>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                {/* Special Formatting */}
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Quote className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Code className="h-3 w-3" />
                </Button>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                {/* Color Options */}
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Palette className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Highlighter className="h-3 w-3" />
                </Button>
                
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                
                {/* Help */}
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <HelpCircle className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Email Body with Signature */}
            <div>
              <Label htmlFor="body">Message</Label>
              <Textarea
                id="body"
                placeholder="Write your message here..."
                value={composeData.body}
                onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
                rows={12}
                className="font-mono text-sm"
              />
              <div className="mt-2 p-3 bg-gray-50 rounded border text-sm text-gray-600">
                {(() => {
                  // Get identifier from currentUser - try username first, then email
                  const identifier = currentUser?.username || currentUser?.email;
                  
                  // Debug logging
                  console.log('🔍 Signature Debug:', {
                    currentUser,
                    identifier,
                    username: currentUser?.username,
                    email: currentUser?.email,
                    hasCurrentUser: !!currentUser
                  });
                  
                  // Get signature
                  const signature = getEmailSignature(identifier);
                  
                  console.log('📝 Signature lookup result:', signature);
                  
                  // If signature found, display it
                  if (signature && signature.name) {
                    // Format email with capital first letter for display
                    const displayEmail = signature.email.charAt(0).toUpperCase() + signature.email.slice(1);
                    
                    return (
                      <>
                        <div className="font-medium text-gray-900">
                          {signature.name} | {signature.role}
                          {identifier && (
                            <span className="text-xs text-gray-400 ml-2"></span>
                          )}
                        </div>
                        {signature.directNumber ? (
                          <div>Direct Number: {signature.directNumber} | Intl Number: {signature.intlNumber}</div>
                        ) : (
                          <div>Intl Number: {signature.intlNumber}</div>
                        )}
                        <div>Email: <a href={`mailto:${signature.email}`} className="text-blue-600 hover:underline">{displayEmail}</a></div>
                        <div>Website: <a href={`https://${signature.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{signature.website}</a></div>
                      </>
                    );
                  }
                  
                  // Default signature if no match found or signature is invalid
                  return (
                    <>
                      <div className="font-medium text-gray-900">
                        ServicePanda Support Team
                        {identifier && (
                          <span className="text-xs text-gray-400 ml-2">(User: {identifier})</span>
                        )}
                      </div>
                      <div>Intl Number: +61 7 5606 0808</div>
                      <div>Email: <a href="mailto:support@servicepanda.com.au" className="text-blue-600 hover:underline">support@servicepanda.com.au</a></div>
                      <div>Website: <a href="https://www.servicepanda.com.au" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.servicepanda.com.au</a></div>
                    </>
                  );
                })()}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleScheduleEmail}
                className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
              >
                <Clock className="h-4 w-4 mr-2" />
                Schedule
              </Button>
              <Button
                variant="outline"
                onClick={handleSaveDraft}
              >
                <FileText className="h-4 w-4 mr-2" />
                Draft
              </Button>
              <Button
                onClick={handleSendEmail}
                disabled={isSendingEmail}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSendingEmail ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </>
                )}
              </Button>
            </div>
                     </div>
         </DialogContent>
       </Dialog>

       {/* Confirmation Dialog */}
       <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
         <DialogContent className="max-w-md">
           <DialogHeader>
             <DialogTitle>Confirm Action</DialogTitle>
           </DialogHeader>
           
           <div className="space-y-4">
             <p className="text-gray-700">
               {confirmAction?.message}
             </p>
             
             <div className="flex items-center justify-end space-x-2 pt-4">
               <Button
                 variant="outline"
                 onClick={handleCancelAction}
               >
                 Cancel
               </Button>
               <Button
                 variant="destructive"
                 onClick={handleConfirmAction}
               >
                 Confirm
               </Button>
             </div>
           </div>
         </DialogContent>
      </Dialog>

      {/* Fetch Emails Dialog */}
      <Dialog open={fetchEmailDialogOpen} onOpenChange={setFetchEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fetch Emails from IMAP</DialogTitle>
            <DialogDescription>
              Enter email credentials to fetch emails from mail.servicepanda.com.au
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fetch-email">Email Address</Label>
              <Input
                id="fetch-email"
                type="email"
                placeholder="rohan@servicepanda.com.au"
                value={fetchEmailData.email}
                onChange={(e) => setFetchEmailData({ ...fetchEmailData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="fetch-password">Password</Label>
              <Input
                id="fetch-password"
                type="password"
                placeholder="Email password"
                value={fetchEmailData.password}
                onChange={(e) => setFetchEmailData({ ...fetchEmailData, password: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="fetch-all"
                checked={fetchEmailData.fetchAll}
                onChange={(e) => setFetchEmailData({ ...fetchEmailData, fetchAll: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="fetch-all">Fetch all emails (not just unread)</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setFetchEmailDialogOpen(false);
                  setFetchEmailData({ email: '', password: '', fetchAll: true });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleFetchEmails} disabled={isFetchingEmails}>
                {isFetchingEmails ? 'Fetching...' : 'Fetch Emails'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
