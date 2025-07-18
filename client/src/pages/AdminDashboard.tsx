import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  PawPrint,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
  Shield,
  Settings,
  BarChart3
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("pending-providers");

  const { data: pendingProviders = [] } = useQuery({
    queryKey: ["/api/admin/providers"],
  });

  const approveProviderMutation = useMutation({
    mutationFn: async (providerId: number) => {
      await apiRequest("POST", `/api/admin/providers/${providerId}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/providers"] });
      toast({
        title: "Success",
        description: "Provider approved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleApproveProvider = (providerId: number) => {
    approveProviderMutation.mutate(providerId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <PawPrint className="h-8 w-8 text-primary mr-2" />
              <span className="text-xl font-bold text-gray-900">ServicePanda Admin</span>
            </div>
            <Button onClick={handleLogout} variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage ServicePanda platform</p>
        </div>
        
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      Administrator
                    </Badge>
                  </div>
                </div>
                
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab("pending-providers")}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === "pending-providers"
                        ? "text-primary bg-blue-50"
                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                    }`}
                  >
                    <Clock className="h-4 w-4 mr-3" />
                    Pending Providers
                    {pendingProviders.length > 0 && (
                      <Badge className="ml-auto" variant="secondary">
                        {pendingProviders.length}
                      </Badge>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("all-providers")}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === "all-providers"
                        ? "text-primary bg-blue-50"
                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                    }`}
                  >
                    <Users className="h-4 w-4 mr-3" />
                    All Providers
                  </button>
                  <button
                    onClick={() => setActiveTab("service-requests")}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === "service-requests"
                        ? "text-primary bg-blue-50"
                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                    }`}
                  >
                    <FileText className="h-4 w-4 mr-3" />
                    Service Requests
                  </button>
                  <button
                    onClick={() => setActiveTab("analytics")}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === "analytics"
                        ? "text-primary bg-blue-50"
                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                    }`}
                  >
                    <BarChart3 className="h-4 w-4 mr-3" />
                    Analytics
                  </button>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === "settings"
                        ? "text-primary bg-blue-50"
                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                    }`}
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "pending-providers" && (
              <Card>
                <CardHeader>
                  <CardTitle>Pending Provider Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingProviders.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No pending provider applications.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingProviders.map((provider: any) => (
                        <div
                          key={provider.id}
                          className="border border-gray-200 rounded-lg p-6"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {provider.firstName} {provider.lastName}
                              </h3>
                              <p className="text-sm text-gray-600">{provider.email}</p>
                              <p className="text-sm text-gray-600">{provider.mobileNumber}</p>
                            </div>
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              Pending
                            </Badge>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Address</p>
                              <p className="font-medium text-gray-900">{provider.address}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Documents Uploaded</p>
                              <p className="font-medium text-gray-900">
                                {provider.documentsUploaded ? "Yes" : "No"}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex gap-3">
                            <Button
                              onClick={() => handleApproveProvider(provider.id)}
                              disabled={approveProviderMutation.isPending}
                              size="sm"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {activeTab === "all-providers" && (
              <Card>
                <CardHeader>
                  <CardTitle>All Service Providers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-500">Provider management coming soon.</p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "service-requests" && (
              <Card>
                <CardHeader>
                  <CardTitle>Service Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-500">Service request management coming soon.</p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "analytics" && (
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-500">Analytics dashboard coming soon.</p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "settings" && (
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Free Leads Setting</h3>
                      <p className="text-sm text-gray-600">
                        Configure how many free leads new providers receive
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Service Categories</h3>
                      <p className="text-sm text-gray-600">
                        Manage available service categories
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Email Templates</h3>
                      <p className="text-sm text-gray-600">
                        Configure email templates for notifications
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
