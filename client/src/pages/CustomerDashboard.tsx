import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
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
  Zap
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

export default function CustomerDashboard() {
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [, navigate] = useLocation();

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/service-categories"],
  });

  const { data: myRequests = [] } = useQuery({
    queryKey: ["/api/service-requests/my-requests"],
  });

  const handleLogout = () => {
    logoutMutation.mutate();
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
                    My Bookings
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
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          <span className="text-sm text-gray-600">Cleaning service completed</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                          <span className="text-sm text-gray-600">Quote received for plumbing</span>
                        </div>
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
              <Card>
                <CardHeader>
                  <CardTitle>My Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {myRequests.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No bookings yet. Start by requesting a service!</p>
                      <Button 
                        className="mt-4"
                        onClick={() => navigate("/request-service")}
                      >
                        Request Service
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myRequests.map((request: any) => (
                        <div key={request.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{request.title}</h3>
                            <span className="text-sm text-gray-500">{request.status}</span>
                          </div>
                          <p className="text-sm text-gray-600">{request.description}</p>
                          <div className="mt-2 text-sm text-gray-500">
                            {request.suburb}, {request.postcode}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        defaultValue={user?.firstName || ""}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        defaultValue={user?.lastName || ""}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        defaultValue={user?.email || ""}
                        disabled
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
