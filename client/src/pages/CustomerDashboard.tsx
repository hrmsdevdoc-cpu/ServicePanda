import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Home, 
  ClipboardList, 
  Star, 
  Settings, 
  LogOut, 
  User, 
  PawPrint,
  Key,
  Sofa,
  Bug,
  Sprout,
  Truck,
  Wrench,
  Zap,
  Eye,
  Users,
  Phone,
  Mail,
  Calendar
} from "lucide-react";

const serviceIcons = {
  "Domestic Cleaning": Home,
  "Bond Cleaning": Key,
  "Carpet Cleaning": Sofa,
  "Pest Control": Bug,
  "Gardening": Sprout,
  "Removals": Truck,
  "Handyman": Wrench,
  "Electrician": Zap,
};

function CustomerDashboard() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/service-categories"],
  });

  const { data: myRequests = [] } = useQuery({
    queryKey: ["/api/service-requests/my-requests"],
  });

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { firstName: string; lastName: string; phoneNumber?: string }) => {
      const response = await apiRequest("PUT", "/api/auth/user", data);
      return response.json();
    },
    onSuccess: (updatedUser) => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        variant: "default",
      });
      // Update the auth cache with the new user data
      queryClient.setQueryData(["/api/auth/user"], updatedUser);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      // Don't reset form data - let user continue editing if they want
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleProfileUpdate = () => {
    const firstName = (profileData.firstName || user?.firstName || "").trim();
    const lastName = (profileData.lastName || user?.lastName || "").trim();
    const phoneNumber = (profileData.phoneNumber || user?.phoneNumber || "").trim();
    
    if (!firstName || !lastName) {
      toast({
        title: "Missing Information",
        description: "Please fill in both first and last name.",
        variant: "destructive",
      });
      return;
    }

    updateProfileMutation.mutate({ firstName, lastName, phoneNumber });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <PawPrint className="h-8 w-8 text-primary mr-2" />
              <span className="text-xl font-bold text-gray-900">ServicePanda</span>
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
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName || "Customer"}!
          </h1>
          <p className="text-gray-600 mt-2">Find and book professional services with ease</p>
        </div>
        
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
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
                    <Home className="h-4 w-4 mr-3" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab("bookings")}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === "bookings"
                        ? "text-primary bg-blue-50"
                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                    }`}
                  >
                    <ClipboardList className="h-4 w-4 mr-3" />
                    Services Requested
                  </button>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === "reviews"
                        ? "text-primary bg-blue-50"
                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                    }`}
                  >
                    <Star className="h-4 w-4 mr-3" />
                    Reviews
                  </button>
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === "profile"
                        ? "text-primary bg-blue-50"
                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                    }`}
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Profile
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "dashboard" && (
              <>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={() => navigate("/request-service")}
                      >
                        Request New Service
                      </Button>
                      <Button variant="outline" className="w-full" size="lg">
                        View All Services
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {myRequests.length === 0 ? (
                          <div className="text-sm text-gray-500 text-center py-4">
                            No recent activity. Create your first service request!
                          </div>
                        ) : (
                          myRequests.slice(0, 3).map((request: any, index: number) => {
                            const category = categories.find((cat: any) => cat.id === request.categoryId);
                            const isLatest = index === 0;
                            const statusColor = {
                              'active': 'bg-blue-500',
                              'assigned': 'bg-orange-500', 
                              'completed': 'bg-green-500',
                              'cancelled': 'bg-red-500'
                            }[request.status] || 'bg-gray-500';
                            
                            return (
                              <div key={request.id} className="flex items-start">
                                <div className={`w-2 h-2 ${statusColor} rounded-full mr-3 mt-2`}></div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm text-gray-900 font-medium">
                                    {category?.name || 'Service'} request {isLatest ? '(Latest)' : ''}
                                  </div>
                                  <div className="text-xs text-gray-600 truncate">
                                    {request.suburb}, {request.postcode}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(request.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Service Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle>Browse Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {categories.map((category: any) => {
                        const IconComponent = serviceIcons[category.name as keyof typeof serviceIcons] || Home;
                        return (
                          <div
                            key={category.id}
                            className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all cursor-pointer"
                            onClick={() => navigate(`/request-service?category=${category.id}&step=2`)}
                          >
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <IconComponent className="h-6 w-6 text-primary" />
                            </div>
                            <h4 className="font-medium text-gray-900 text-center text-sm">
                              {category.name}
                            </h4>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            
            {activeTab === "bookings" && (
              <ServicesRequestedTab 
                myRequests={myRequests}
                categories={categories}
                navigate={navigate}
                queryClient={queryClient}
              />
            )}
            
            {activeTab === "reviews" && (
              <Card>
                <CardHeader>
                  <CardTitle>Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-500">No reviews yet. Complete some services to leave reviews!</p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName !== "" ? profileData.firstName : (user?.firstName || "")}
                        onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value.trim() }))}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName !== "" ? profileData.lastName : (user?.lastName || "")}
                        onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value.trim() }))}
                        placeholder="Enter your last name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={profileData.phoneNumber !== "" ? profileData.phoneNumber : (user?.phoneNumber || "")}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phoneNumber: e.target.value.trim() }))}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                    <Button 
                      onClick={handleProfileUpdate}
                      disabled={updateProfileMutation.isPending}
                      className="w-full"
                    >
                      {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
                    </Button>
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

// Services Requested Tab Component
function ServicesRequestedTab({ myRequests, categories, navigate, queryClient }: any) {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showProfessionals, setShowProfessionals] = useState(false);

  // Get detailed service request information
  const { data: requestDetails } = useQuery({
    queryKey: ["/api/service-requests", selectedRequest?.id, "details"],
    enabled: !!selectedRequest?.id,
  });

  // Get professionals who accepted quotes for the service request
  const { data: professionals = [] } = useQuery({
    queryKey: ["/api/service-requests", selectedRequest?.id, "accepted-professionals"],
    enabled: !!selectedRequest?.id && showProfessionals,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Services Requested</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/service-requests/my-requests"] })}
        >
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {myRequests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No services requested yet. Start by requesting a service!</p>
            <Button 
              className="mt-4"
              onClick={() => navigate("/request-service")}
            >
              Request Service
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {myRequests.map((request: any) => {
              const category = categories.find((cat: any) => cat.id === request.categoryId);
              const statusColor = {
                'active': 'bg-blue-500',
                'assigned': 'bg-orange-500', 
                'completed': 'bg-green-500',
                'cancelled': 'bg-red-500'
              }[request.status] || 'bg-gray-500';
              
              const professionalCount = request.offerMetrics?.professionalCount || 0;
              const acceptedCount = request.offerMetrics?.acceptedOffers || 0;
              
              return (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold">{category?.name || 'Service Request'}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-500">Job Type:</span>
                        {request.bookingType && (
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {request.bookingType.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 ${statusColor} rounded-full`}></div>
                      <span className="text-sm text-gray-500 capitalize">{request.status}</span>
                    </div>
                  </div>
                  
                  {/* Location and Dates */}
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 mb-3">
                    <div>
                      <span className="font-medium">Location:</span><br />
                      <span>{request.suburb}, {request.postcode}</span>
                    </div>
                    <div>
                      <span className="font-medium">Request Date:</span><br />
                      {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {request.preferredDate && (
                    <div className="text-xs text-gray-600 mb-3">
                      <span className="font-medium">Preferred Date:</span> {new Date(request.preferredDate).toLocaleDateString()}
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Service Request Details</DialogTitle>
                        </DialogHeader>
                        <ServiceRequestDetails 
                          request={request} 
                          category={category} 
                          details={requestDetails}
                        />
                      </DialogContent>
                    </Dialog>
                    
                    {acceptedCount > 0 && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowProfessionals(true);
                            }}
                          >
                            <Users className="h-4 w-4 mr-2" />
                            View Professionals ({acceptedCount})
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Professionals Who Accepted Your Service Request</DialogTitle>
                          </DialogHeader>
                          <AcceptedProfessionalsView 
                            professionals={professionals}
                            request={request}
                            category={category}
                          />
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Service Request Details Component
function ServiceRequestDetails({ request, category, details }: any) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-700">Service Category</Label>
          <p className="text-sm text-gray-900">{category?.name || 'Unknown Service'}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700">Status</Label>
          <Badge variant="secondary" className="capitalize">
            {request.status}
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-700">Location</Label>
          <p className="text-sm text-gray-900">{request.suburb}, {request.postcode}</p>
          {request.address && (
            <p className="text-xs text-gray-600">{request.address}</p>
          )}
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700">Booking Type</Label>
          <p className="text-sm text-gray-900">
            {request.bookingType?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Not specified'}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-700">Request Date</Label>
          <p className="text-sm text-gray-900">{new Date(request.createdAt).toLocaleDateString()}</p>
        </div>
        {request.preferredDate && (
          <div>
            <Label className="text-sm font-medium text-gray-700">Preferred Date</Label>
            <p className="text-sm text-gray-900">{new Date(request.preferredDate).toLocaleDateString()}</p>
          </div>
        )}
      </div>
      
      {request.scheduledDate && (
        <div>
          <Label className="text-sm font-medium text-gray-700">Scheduled Date</Label>
          <p className="text-sm text-gray-900">{new Date(request.scheduledDate).toLocaleDateString()}</p>
        </div>
      )}
      
      <div>
        <Label className="text-sm font-medium text-gray-700">Description</Label>
        <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{request.description}</p>
      </div>
    </div>
  );
}

// Accepted Professionals View Component
function AcceptedProfessionalsView({ professionals, request, category }: any) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        <span className="font-medium">{professionals.length}</span> professional{professionals.length !== 1 ? 's' : ''} accepted your {category?.name} service request.
      </div>
      
      {professionals.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No professionals have accepted your service request yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {professionals.map((professional: any) => (
            <div key={professional.providerId} className="border rounded-lg p-4 bg-green-50">
              <div className="flex justify-between items-start mb-3">
                <div>
                  {professional.businessName ? (
                    <div>
                      <h3 className="font-semibold text-gray-900">{professional.businessName}</h3>
                      <p className="text-sm text-gray-600">{professional.firstName} {professional.lastName}</p>
                    </div>
                  ) : (
                    <h3 className="font-semibold text-gray-900">{professional.firstName} {professional.lastName}</h3>
                  )}
                  <div className="flex items-center gap-1 mt-2">
                    {professional.rating > 0 ? (
                      // Show filled stars based on rating
                      <>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`h-4 w-4 ${
                              star <= Math.round(professional.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">
                          {professional.rating.toFixed(1)}
                        </span>
                      </>
                    ) : (
                      // Show 5 gray stars with "no rating yet" text
                      <>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className="h-4 w-4 text-gray-300"
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">
                          (no rating yet)
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{professional.providerEmail}</span>
                </div>
                
                {professional.providerPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{professional.providerPhone}</span>
                  </div>
                )}
              </div>
              
              {/* Contact Action Buttons */}
              <div className="flex gap-2 mb-3">
                {professional.providerPhone && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`tel:${professional.providerPhone}`)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                )}
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const displayName = professional.businessName || `${professional.firstName} ${professional.lastName}`;
                    window.open(`mailto:${professional.providerEmail}?subject=Regarding ${category?.name} Service Request&body=Hi ${displayName},%0D%0A%0D%0AThank you for accepting my ${category?.name} service request.%0D%0A%0D%0ABest regards`);
                  }}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Accepted on {new Date(professional.offerCreatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;
