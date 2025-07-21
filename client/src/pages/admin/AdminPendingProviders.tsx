import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  Shield,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
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

export default function AdminPendingProviders() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

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

  // Provider Approval Mutation
  const approveProviderMutation = useMutation({
    mutationFn: async ({ providerId, action }: { providerId: number; action: 'approve' | 'reject' }) => {
      const response = await apiRequest('POST', `/api/admin/providers/${providerId}/${action}`, {});
      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: `Provider ${variables.action === 'approve' ? 'Approved' : 'Rejected'}`,
        description: `Provider has been successfully ${variables.action === 'approve' ? 'approved' : 'rejected'}.`,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/providers'] });
    },
    onError: (error) => {
      toast({
        title: "Action Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
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
                                onClick={() => navigate(`/admin/providers/${provider.id}`)}
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
    </div>
  );
}