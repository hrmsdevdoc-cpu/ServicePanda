import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import API_BASE_URL from "@/lib/apiConfig";
import { 
  Search, 
  Filter,
  X,
  Home,
  Key,
  Sofa,
  Bug,
  Sprout,
  Truck,
  Wrench,
  Zap,
  Snowflake,
  Paintbrush,
  ShieldCheck,
  Waves,
  Square,
  Settings,
  Sun,
  TreePine,
  Grid3x3,
  List
} from "lucide-react";

const serviceIcons: Record<string, any> = {
  "home": Home,
  "key": Key,
  "sofa": Sofa,
  "bug": Bug,
  "sprout": Sprout,
  "truck": Truck,
  "wrench": Wrench,
  "zap": Zap,
  "snowflake": Snowflake,
  "paintbrush": Paintbrush,
  "shield-check": ShieldCheck,
  "waves": Waves,
  "square": Square,
  "settings": Settings,
  "sun": Sun,
  "tree-pine": TreePine,
};

export default function Services() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch service categories
  const { data: categories = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/service-categories"],
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Filter categories based on search and selected category
  const filteredCategories = categories.filter((category: any) => {
    const matchesSearch = 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || category.name === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique category names for filter
  const uniqueCategories = Array.from(
    new Set(categories.map((cat: any) => cat.name))
  ).sort();

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
  };

  const hasActiveFilters = searchTerm || selectedCategory;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Content with fade-in animation */}
      <div className="animate-in fade-in duration-500">

      {/* Banner/Hero Section */}
      <div className="relative bg-gradient-to-br from-primary via-blue-600 to-blue-700 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center">
            {/* Logo and Title */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <Grid3x3 className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white">
                ServicePanda
              </div>
            </div>
            
            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              All Services
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-6">
              Browse our complete range of professional services. Find exactly what you need.
            </p>
            
            {/* Decorative Line */}
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-1 bg-white/30 rounded-full"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-24 h-1 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-16 h-1 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-gray-50" fill="currentColor" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-6">
        
        {/* Search and Filter Section */}
        <Card className="shadow-xl border-0 mb-8">
          <CardContent className="pt-6 pb-6 px-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="w-full md:w-auto">
                <select
                  value={selectedCategory || ""}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                  className="w-full md:w-64 h-12 px-4 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {uniqueCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2 border border-gray-300 rounded-md p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="h-10 w-10"
                >
                  <Grid3x3 className="w-5 h-5" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="h-10 w-10"
                >
                  <List className="w-5 h-5" />
                </Button>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="h-12"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mt-4 flex flex-wrap gap-2">
                {searchTerm && (
                  <Badge variant="secondary" className="px-3 py-1">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-2 hover:text-primary"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {selectedCategory && (
                  <Badge variant="secondary" className="px-3 py-1">
                    Category: {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="ml-2 hover:text-primary"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            {isLoading ? (
              "Loading services..."
            ) : (
              <>
                Showing <span className="font-semibold text-gray-900">{filteredCategories.length}</span>{" "}
                {filteredCategories.length === 1 ? "service" : "services"}
                {hasActiveFilters && " (filtered)"}
              </>
            )}
          </p>
        </div>

        {/* Services Grid/List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <Card className="shadow-xl border-0">
            <CardContent className="pt-12 pb-12 px-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-600 mb-6">
                {hasActiveFilters
                  ? "Try adjusting your filters to see more results."
                  : "No services are currently available."}
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredCategories.map((category: any) => {
              const IconComponent = serviceIcons[category.icon?.toLowerCase()] || Home;
              const hasImage = category.imageUrl;
              
              return (
                <Card 
                  key={category.id}
                  className={`cursor-pointer hover:shadow-2xl transition-all duration-300 overflow-hidden group border-gray-200 bg-white ${
                    viewMode === "grid" ? "hover:-translate-y-2" : ""
                  }`}
                  onClick={() => {
                    // Navigate to auth or service booking
                    window.location.href = "/auth";
                  }}
                >
                  <CardContent className="p-0">
                    {/* Service Image/Icon Container */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
                      {hasImage ? (
                        <>
                          <img 
                            src={`${API_BASE_URL}${category.imageUrl}`}
                            alt={category.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) {
                                fallback.classList.remove('hidden');
                              }
                            }}
                          />
                          <div className={`hidden absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-600/10 flex items-center justify-center`}>
                            <IconComponent className="w-16 h-16 text-primary opacity-50" />
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-600/10 flex items-center justify-center">
                          <IconComponent className="w-16 h-16 text-primary opacity-50" />
                        </div>
                      )}
                      
                      {/* Popular Badge */}
                      {category.popular && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-primary text-white shadow-lg">
                            Popular
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    {/* Service Info */}
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {category.description || "Professional service providers available in your area"}
                      </p>
                      
                      {/* Action Button */}
                      <Button 
                        className="w-full bg-primary hover:bg-blue-700 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = "/auth";
                        }}
                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      </div>
      
      <Footer />
    </div>
  );
}
