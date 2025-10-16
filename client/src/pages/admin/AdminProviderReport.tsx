import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { adminApiRequest } from "@/lib/queryClient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart3,
  Users,
  Star,
  Filter,
  Download,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ProviderReportData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  abn: string;
  status: string;
  providerStatus: string;
  createdAt: string;
  updatedAt: string;
  rating: string;
  totalReviews: number;
  averageResponseTime: string;
  completionRate: number;
  services: Array<{
    id: number;
    categoryId: number;
    categoryName: string;
    categoryIcon: string;
  }>;
  serviceAreas: Array<{
    id: number;
    centerAddress: string;
    radiusKm: number;
    areaName: string | null;
  }>;
}

// Star Rating Component
const StarRating = ({ rating, totalReviews, showTooltip = true }: { rating: string; totalReviews: number; showTooltip?: boolean }) => {
  const ratingNum = parseFloat(rating) || 0;
  const fullStars = Math.floor(ratingNum);
  const hasHalfStar = ratingNum % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const stars = [];
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
    );
  }
  
  // Half star
  if (hasHalfStar) {
    stars.push(
      <Star key="half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />
    );
  }
  
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
    );
  }

  const content = (
    <div className="flex items-center space-x-1">
      {stars}
      <span className="text-sm text-gray-600 ml-1">({totalReviews})</span>
    </div>
  );

  if (showTooltip) {
    return (
      <div className="group relative">
        {content}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
          {ratingNum.toFixed(1)} stars ({totalReviews} reviews)
        </div>
      </div>
    );
  }

  return content;
};

// Service Type Badge Component
const ServiceTypeBadge = ({ categoryName }: { categoryName: string }) => {
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Cleaning': 'bg-blue-100 text-blue-800',
      'Carpet': 'bg-green-100 text-green-800',
      'Pest Control': 'bg-red-100 text-red-800',
      'Plumbing': 'bg-purple-100 text-purple-800',
      'Electrical': 'bg-yellow-100 text-yellow-800',
      'Handyman': 'bg-orange-100 text-orange-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Badge className={`text-xs ${getCategoryColor(categoryName)}`}>
      {categoryName}
    </Badge>
  );
};

// Location Badge Component
const LocationBadge = ({ address }: { address: string }) => {
  // Extract suburb/city from address
  const parts = address.split(',');
  const location = parts[parts.length - 2]?.trim() || address;
  
  return (
    <Badge variant="outline" className="text-xs">
      {location}
    </Badge>
  );
};

export default function AdminProviderReport() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin-login');
    }
  }, [navigate]);

  // Provider Report Query
  const { data: providers, isLoading, error } = useQuery({
    queryKey: ['/api/admin/providers/report', statusFilter, ratingFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (ratingFilter !== 'all') params.append('rating', ratingFilter);
      
      const response = await adminApiRequest('GET', `/api/admin/providers/report?${params.toString()}`);
      const data = await response.json();
      console.log('Provider report data received:', data);
      return data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  const handleExportReport = () => {
    console.log('Exporting provider report...');
    // TODO: Implement export functionality
  };

  // Filter providers based on search term
  const filteredProviders = providers?.filter((provider: ProviderReportData) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      provider.firstName?.toLowerCase().includes(searchLower) ||
      provider.lastName?.toLowerCase().includes(searchLower) ||
      provider.businessName?.toLowerCase().includes(searchLower) ||
      provider.email?.toLowerCase().includes(searchLower) ||
      provider.phone?.includes(searchTerm)
    );
  }) || [];

  // Get status badge
  const getStatusBadge = (status: string, providerStatus: string) => {
    if (status === 'pending') {
      return <Badge variant="outline" className="text-orange-600 border-orange-200"><Clock className="h-3 w-3 mr-1" />Waiting Approval</Badge>;
    } else if (status === 'approved' && providerStatus === 'activated') {
      return <Badge variant="outline" className="text-green-600 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
    } else if (providerStatus === 'deactivated') {
      return <Badge variant="outline" className="text-red-600 border-red-200"><XCircle className="h-3 w-3 mr-1" />Deactivated</Badge>;
    } else {
      return <Badge variant="outline" className="text-gray-600 border-gray-200"><AlertCircle className="h-3 w-3 mr-1" />Unknown</Badge>;
    }
  };

  // Group providers by service type for the report table
  const groupProvidersByService = () => {
    const serviceGroups: { [key: string]: ProviderReportData[] } = {};
    
    filteredProviders.forEach((provider: ProviderReportData) => {
      provider.services.forEach(service => {
        if (!serviceGroups[service.categoryName]) {
          serviceGroups[service.categoryName] = [];
        }
        serviceGroups[service.categoryName].push(provider);
      });
    });

    return serviceGroups;
  };

  const serviceGroups = groupProvidersByService();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <AdminSidebar onLogout={handleLogout} />
      
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-sm dark:bg-gray-800 shadow-lg shadow-slate-200/20 border-b border-slate-200/50 dark:border-gray-700">
          <div className="px-8 py-3" style={{ paddingTop: '1.2rem', paddingBottom: '0.8rem' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Provider Report
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Comprehensive provider analytics and performance metrics
                  </p>
                </div>
              </div>
              {/* <Button onClick={handleExportReport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button> */}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-8 py-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading provider report...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading provider report: {error.message}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Search</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search providers..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Status Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="waiting_approval">Waiting Approval</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="deactivated">Deactivated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Rating Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Rating</label>
                      <Select value={ratingFilter} onValueChange={setRatingFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Ratings" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All (1-5 stars)</SelectItem>
                          <SelectItem value="5">5 Stars</SelectItem>
                          <SelectItem value="4">4 Stars</SelectItem>
                          <SelectItem value="3">3 Stars</SelectItem>
                          <SelectItem value="2">2 Stars</SelectItem>
                          <SelectItem value="1">1 Star</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Providers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{filteredProviders.length}</div>
                    <p className="text-xs text-muted-foreground">
                      All providers
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Approved</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {filteredProviders.filter(p => p.status === 'approved' && p.providerStatus === 'activated').length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Active providers
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    <Clock className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      {filteredProviders.filter(p => p.status === 'pending').length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Awaiting review
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Deactivated</CardTitle>
                    <XCircle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {filteredProviders.filter(p => p.providerStatus === 'deactivated').length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Inactive providers
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Provider Report Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Provider Report by Service Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium text-gray-900">Service Type</th>
                          <th className="text-left p-3 font-medium text-gray-900">Gold Coast</th>
                          <th className="text-left p-3 font-medium text-gray-900">Sunshine Coast</th>
                          <th className="text-left p-3 font-medium text-gray-900">Adelaide</th>
                          <th className="text-left p-3 font-medium text-gray-900">Newcastle</th>
                          <th className="text-left p-3 font-medium text-gray-900">Brisbane</th>
                          <th className="text-left p-3 font-medium text-gray-900">Melbourne</th>
                          <th className="text-left p-3 font-medium text-gray-900">Canberra</th>
                          <th className="text-left p-3 font-medium text-gray-900">Sydney</th>
                          <th className="text-left p-3 font-medium text-gray-900">Wollongong</th>
                          <th className="text-left p-3 font-medium text-gray-900">Perth</th>
                          <th className="text-left p-3 font-medium text-gray-900">Townsville</th>
                          <th className="text-left p-3 font-medium text-gray-900">Geelong</th>
                          <th className="text-left p-3 font-medium text-gray-900">Hobart</th>
                          <th className="text-left p-3 font-medium text-gray-900">Port Macquarie</th>
                          <th className="text-left p-3 font-medium text-gray-900">Darwin</th>
                          <th className="text-left p-3 font-medium text-gray-900">Ipswich</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(serviceGroups).map(([serviceType, providers]) => (
                          <tr key={serviceType} className="border-b hover:bg-gray-50">
                            <td className="p-3">
                              <ServiceTypeBadge categoryName={serviceType} />
                            </td>
                              {['Gold Coast', 'Sunshine Coast', 'Adelaide', 'Newcastle', 'Brisbane', 'Melbourne', 'Canberra', 'Sydney', 'Wollongong', 'Perth', 'Townsville', 'Geelong', 'Hobart', 'Port Macquarie', 'Darwin', 'Ipswich'].map((location) => {
                                const locationProviders = providers.filter(provider => 
                                  provider.serviceAreas && provider.serviceAreas.some(area => 
                                    area.centerAddress.toLowerCase().includes(location.toLowerCase())
                                  )
                                );
                              return (
                                <td key={location} className="p-3">
                                  <div className="group relative">
                                    <span className="text-lg font-bold text-blue-600 cursor-pointer hover:text-blue-800">
                                      {locationProviders.length}
                                    </span>
                                    {locationProviders.length > 0 && (
                                      <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 min-w-max">
                                        <div className="space-y-1">
                                          {locationProviders.map((provider) => (
                                            <div key={provider.id} className="flex items-center justify-between space-x-2">
                                              <span className="font-medium">
                                                {provider.businessName || `${provider.firstName} ${provider.lastName}`}
                                              </span>
                                              <StarRating 
                                                rating={provider.rating} 
                                                totalReviews={provider.totalReviews}
                                                showTooltip={false}
                                              />
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Provider List */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Provider List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredProviders.map((provider: ProviderReportData) => (
                      <div key={provider.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold text-lg">
                                {provider.businessName || `${provider.firstName} ${provider.lastName}`}
                              </h3>
                              {getStatusBadge(provider.status, provider.providerStatus)}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{provider.email}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="flex items-start space-x-2">
                                <span className="text-sm font-medium">Services:</span>
                                <div className="flex flex-wrap gap-1 max-w-md">
                                  {provider.services.map((service) => (
                                    <ServiceTypeBadge key={service.id} categoryName={service.categoryName} />
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-start space-x-2">
                                <span className="text-sm font-medium">Locations:</span>
                                <div className="flex flex-wrap gap-1 max-w-md">
                                  {provider.serviceAreas && provider.serviceAreas.map((area) => (
                                    <LocationBadge key={area.id} address={area.centerAddress} />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <StarRating 
                              rating={provider.rating} 
                              totalReviews={provider.totalReviews}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Joined: {new Date(provider.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
