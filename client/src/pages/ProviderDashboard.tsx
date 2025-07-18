import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { LeadCard } from "@/components/LeadCard";
import { 
  PawPrint,
  User,
  Star,
  CheckCircle,
  CreditCard,
  Settings,
  UserCog,
  LogOut,
  Gauge,
  Briefcase,
  DollarSign,
  Eye,
  Calendar,
  MapPin
} from "lucide-react";

export default function ProviderDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("dashboard");

  const { data: provider } = useQuery({
    queryKey: ["/api/service-providers/me"],
  });

  const { data: newLeads = [] } = useQuery({
    queryKey: ["/api/leads/new"],
  });

  const acceptLeadMutation = useMutation({
    mutationFn: async (leadId: number) => {
      await apiRequest("POST", `/api/leads/${leadId}/accept`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads/new"] });
      toast({
        title: "Success",
        description: "Lead accepted successfully",
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

  const handleAcceptLead = (leadId: number) => {
    acceptLeadMutation.mutate(leadId);
  };

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to ServicePanda Partners</h2>
          <p className="text-gray-600 mb-6">Complete your provider registration to access the dashboard</p>
          <Button onClick={() => window.location.href = "/provider-signup"}>
            Complete Registration
          </Button>
        </div>
      </div>
    );
  }

  if (provider.status === "pending") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold mb-4">Application Under Review</h2>
            <p className="text-gray-600 mb-6">
              Your application is still being reviewed. Please contact us on 1300 123 456 if you have any questions.
            </p>
            <Button onClick={handleLogout} variant="outline">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <PawPrint className="h-8 w-8 text-primary mr-2" />
              <span className="text-xl font-bold text-gray-900">ServicePanda Partners</span>
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
          <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your leads and grow your business</p>
        </div>
        
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">
                      {provider.firstName} {provider.lastName}
                    </p>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Approved Provider
                    </Badge>
                  </div>
                </div>
                
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === "dashboard"
                        ? "text-primary bg-blue-50"
                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                    }`}
                  >
                    <Gauge className="h-4 w-4 mr-3" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab("new-leads")}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === "new-leads"
                        ? "text-primary bg-blue-50"
                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                    }`}
                  >
                    <Star className="h-4 w-4 mr-3" />
                    New Leads
                    {newLeads.length > 0 && (
                      <Badge className="ml-auto" variant="secondary">
                        {newLeads.length}
                      </Badge>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("accepted-leads")}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === "accepted-leads"
                        ? "text-primary bg-blue-50"
                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                    }`}
                  >
                    <CheckCircle className="h-4 w-4 mr-3" />
                    Accepted Leads
                  </button>
                  <button
                    onClick={() => setActiveTab("billing")}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === "billing"
                        ? "text-primary bg-blue-50"
                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                    }`}
                  >
                    <CreditCard className="h-4 w-4 mr-3" />
                    Billing & Payment
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
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === "profile"
                        ? "text-primary bg-blue-50"
                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                    }`}
                  >
                    <UserCog className="h-4 w-4 mr-3" />
                    Personal Details
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "dashboard" && (
              <>
                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">New Leads</p>
                          <p className="text-2xl font-bold text-gray-900">{newLeads.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Star className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Active Jobs</p>
                          <p className="text-2xl font-bold text-gray-900">0</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <Briefcase className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">This Month</p>
                          <p className="text-2xl font-bold text-gray-900">$0</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <DollarSign className="h-6 w-6 text-orange-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Rating</p>
                          <p className="text-2xl font-bold text-gray-900">5.0</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Star className="h-6 w-6 text-yellow-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <Button 
                        className="h-20 flex flex-col items-center justify-center"
                        onClick={() => setActiveTab("new-leads")}
                      >
                        <Eye className="h-6 w-6 mb-2" />
                        View All Leads
                      </Button>
                      <Button 
                        className="h-20 flex flex-col items-center justify-center bg-green-600 hover:bg-green-700"
                        onClick={() => setActiveTab("billing")}
                      >
                        <CreditCard className="h-6 w-6 mb-2" />
                        Update Payment
                      </Button>
                      <Button 
                        className="h-20 flex flex-col items-center justify-center bg-orange-600 hover:bg-orange-700"
                        onClick={() => setActiveTab("settings")}
                      >
                        <Settings className="h-6 w-6 mb-2" />
                        Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            
            {activeTab === "new-leads" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>New Leads</CardTitle>
                    <Badge className="bg-green-100 text-green-800">
                      {provider.freeLeadsRemaining} Free Leads Remaining
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {newLeads.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No new leads available at the moment.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {newLeads.map((lead: any) => (
                        <LeadCard
                          key={lead.id}
                          lead={lead}
                          onAccept={handleAcceptLead}
                          loading={acceptLeadMutation.isPending}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {activeTab === "accepted-leads" && (
              <Card>
                <CardHeader>
                  <CardTitle>Accepted Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-500">No accepted leads yet.</p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "billing" && (
              <Card>
                <CardHeader>
                  <CardTitle>Billing & Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-500">Payment setup coming soon.</p>
                    <p className="text-sm text-gray-400 mt-2">
                      You'll need to add a credit card to purchase leads beyond your free allocation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "settings" && (
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Service Areas</h3>
                      <p className="text-sm text-gray-600">
                        Manage the areas where you provide services
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Services Offered</h3>
                      <p className="text-sm text-gray-600">
                        Update the services you specialize in
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Notifications</h3>
                      <p className="text-sm text-gray-600">
                        Configure how you receive lead notifications
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Personal Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          defaultValue={provider.firstName}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          defaultValue={provider.lastName}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        defaultValue={provider.email}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        defaultValue={provider.mobileNumber}
                      />
                    </div>
                    <Button>Update Profile</Button>
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
