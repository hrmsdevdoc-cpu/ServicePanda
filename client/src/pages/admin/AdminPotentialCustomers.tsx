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
  
  // State for SMS sending
  const [isSmsDialogOpen, setIsSmsDialogOpen] = useState(false);
  const [selectedCustomersForSms, setSelectedCustomersForSms] = useState<PotentialCustomer[]>([]);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState<'pagination' | 'loadMore'>('pagination');
  const [loadedCount, setLoadedCount] = useState(10);

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
      const response = await adminApiRequest('POST', '/api/admin/potential-customers/send-sms', { customerIds });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "SMS Sent Successfully",
        description: `SMS sent to ${data.count} customers.`,
      });
      setIsSmsDialogOpen(false);
      setSelectedCustomersForSms([]);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/potential-customers'] });
    },
    onError: (error: any) => {
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
    
    return matchesSearch && matchesImportId && matchesState;
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
  }, [searchTerm, selectedImportId, selectedState]);

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
                <Button onClick={() => setIsImportDialogOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Customers
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          <Tabs defaultValue="list" className="space-y-6">
            <TabsList>
              <TabsTrigger value="list">Customer List</TabsTrigger>
              <TabsTrigger value="imports">Import Groups</TabsTrigger>
              <TabsTrigger value="sms">SMS Campaigns</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                          {Array.from(new Set(potentialCustomers.map((c: PotentialCustomer) => c.state))).map((state) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
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
                        }}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer List */}
              <Card>
                <CardHeader>
                  <CardTitle>Potential Customers ({filteredCustomers.length})</CardTitle>
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
                              <div className="flex items-center gap-2">
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
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="imports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Import Groups</CardTitle>
                  <CardDescription>
                    Overview of imported customer batches
                  </CardDescription>
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
              <Card>
                <CardHeader>
                  <CardTitle>SMS Campaigns</CardTitle>
                  <CardDescription>
                    Manage SMS campaigns for potential customers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-yellow-600" />
                        <h3 className="font-semibold">Not Sent</h3>
                      </div>
                      <p className="text-2xl font-bold text-yellow-600">
                        {potentialCustomers.filter((c: PotentialCustomer) => c.smsDeliveryStatus === 'not_sent').length}
                      </p>
                      <p className="text-sm text-gray-500">Customers</p>
                    </div>
                    <div className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                        <h3 className="font-semibold">1st SMS Sent</h3>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">
                        {potentialCustomers.filter((c: PotentialCustomer) => c.smsDeliveryStatus === '1st_sent').length}
                      </p>
                      <p className="text-sm text-gray-500">Customers</p>
                    </div>
                    <div className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold">2nd SMS Sent</h3>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        {potentialCustomers.filter((c: PotentialCustomer) => c.smsDeliveryStatus === '2nd_sent').length}
                      </p>
                      <p className="text-sm text-gray-500">Customers</p>
                    </div>
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
    </div>
  );
} 