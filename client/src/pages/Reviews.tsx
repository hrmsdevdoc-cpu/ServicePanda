import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Star, 
  Search,
  Filter,
  X,
  MapPin,
  Calendar,
  Grid3x3,
  List,
  TrendingUp,
  Users,
  Award
} from "lucide-react";

interface Review {
  id: number;
  name: string;
  initials: string;
  location: string;
  rating: number;
  reviewText: string;
  serviceCategory: string;
  date: string;
  color: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    initials: "SM",
    location: "Sydney, NSW",
    rating: 5,
    reviewText: "Fantastic service! Found a brilliant cleaner within minutes. The whole process was smooth and professional. Highly recommend ServicePanda!",
    serviceCategory: "Cleaning",
    date: "2 weeks ago",
    color: "from-primary to-blue-500"
  },
  {
    id: 2,
    name: "James Davidson",
    initials: "JD",
    location: "Melbourne, VIC",
    rating: 5,
    reviewText: "Our plumbing emergency was resolved quickly thanks to ServicePanda. The plumber was professional and the pricing was fair. Will definitely use again!",
    serviceCategory: "Plumbing",
    date: "1 month ago",
    color: "from-green-500 to-green-600"
  },
  {
    id: 3,
    name: "Lisa Patterson",
    initials: "LP",
    location: "Brisbane, QLD",
    rating: 5,
    reviewText: "Best platform for finding reliable tradies! Used it for electrical work and landscaping. Both providers were excellent. Five stars!",
    serviceCategory: "Electrical",
    date: "3 weeks ago",
    color: "from-orange-500 to-orange-600"
  },
  {
    id: 4,
    name: "Michael Chen",
    initials: "MC",
    location: "Perth, WA",
    rating: 5,
    reviewText: "Excellent experience from start to finish. The electrician arrived on time, was very professional, and completed the work efficiently. ServicePanda made it so easy!",
    serviceCategory: "Electrical",
    date: "1 week ago",
    color: "from-purple-500 to-purple-600"
  },
  {
    id: 5,
    name: "Emma Wilson",
    initials: "EW",
    location: "Adelaide, SA",
    rating: 5,
    reviewText: "I needed urgent carpet cleaning and ServicePanda connected me with a fantastic provider. Great quality work and reasonable pricing. Very satisfied!",
    serviceCategory: "Cleaning",
    date: "5 days ago",
    color: "from-pink-500 to-pink-600"
  },
  {
    id: 6,
    name: "David Thompson",
    initials: "DT",
    location: "Canberra, ACT",
    rating: 5,
    reviewText: "Used ServicePanda for garden maintenance. The landscaper was knowledgeable, professional, and transformed our backyard. Highly recommend!",
    serviceCategory: "Landscaping",
    date: "2 months ago",
    color: "from-emerald-500 to-emerald-600"
  },
  {
    id: 7,
    name: "Sophie Brown",
    initials: "SB",
    location: "Gold Coast, QLD",
    rating: 5,
    reviewText: "Amazing service for our home renovation. Found reliable carpenters and painters through ServicePanda. The platform is user-friendly and the providers are top-notch!",
    serviceCategory: "Carpentry",
    date: "3 months ago",
    color: "from-cyan-500 to-cyan-600"
  },
  {
    id: 8,
    name: "Robert Taylor",
    initials: "RT",
    location: "Newcastle, NSW",
    rating: 5,
    reviewText: "Quick response time and excellent service. The plumber fixed our leaky tap in no time. ServicePanda is now my go-to for all home services!",
    serviceCategory: "Plumbing",
    date: "1 week ago",
    color: "from-indigo-500 to-indigo-600"
  },
  {
    id: 9,
    name: "Olivia Martinez",
    initials: "OM",
    location: "Hobart, TAS",
    rating: 5,
    reviewText: "Found a great HVAC technician through ServicePanda. Professional, punctual, and fixed our air conditioning issue perfectly. Very happy with the service!",
    serviceCategory: "HVAC",
    date: "2 weeks ago",
    color: "from-teal-500 to-teal-600"
  },
  {
    id: 10,
    name: "William Anderson",
    initials: "WA",
    location: "Darwin, NT",
    rating: 5,
    reviewText: "ServicePanda made finding a reliable locksmith so easy. The provider was professional, arrived quickly, and solved our lock issue efficiently. Great platform!",
    serviceCategory: "Locksmith",
    date: "4 days ago",
    color: "from-amber-500 to-amber-600"
  },
  {
    id: 11,
    name: "Charlotte Lee",
    initials: "CL",
    location: "Geelong, VIC",
    rating: 5,
    reviewText: "Excellent experience with a window cleaner from ServicePanda. Professional service, great results, and very reasonable pricing. Will definitely use again!",
    serviceCategory: "Cleaning",
    date: "1 month ago",
    color: "from-rose-500 to-rose-600"
  },
  {
    id: 12,
    name: "Daniel White",
    initials: "DW",
    location: "Wollongong, NSW",
    rating: 5,
    reviewText: "Used ServicePanda for roof repairs. The roofer was experienced, professional, and completed the work to a high standard. Very impressed with the service quality!",
    serviceCategory: "Roofing",
    date: "3 weeks ago",
    color: "from-violet-500 to-violet-600"
  }
];

export default function Reviews() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Get unique values for filters
  const uniqueCategories = Array.from(new Set(reviews.map(r => r.serviceCategory))).sort();
  const uniqueLocations = Array.from(new Set(reviews.map(r => r.location))).sort();

  // Filter reviews
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = 
      review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.serviceCategory.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = !selectedRating || review.rating === selectedRating;
    const matchesCategory = !selectedCategory || review.serviceCategory === selectedCategory;
    const matchesLocation = !selectedLocation || review.location === selectedLocation;
    
    return matchesSearch && matchesRating && matchesCategory && matchesLocation;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedRating(null);
    setSelectedCategory(null);
    setSelectedLocation(null);
  };

  const hasActiveFilters = searchTerm || selectedRating || selectedCategory || selectedLocation;

  // Calculate statistics
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const totalReviews = reviews.length;
  const fiveStarReviews = reviews.filter(r => r.rating === 5).length;

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
                  <Star className="h-10 w-10 text-white fill-white" />
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white">
                ServicePanda
              </div>
            </div>
            
            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Customer Reviews
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-6">
              See what our customers are saying about their experiences with ServicePanda
            </p>
            
            {/* Statistics */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">{averageRating.toFixed(1)}</div>
                <div className="text-blue-100 text-sm">Average Rating</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">{totalReviews}+</div>
                <div className="text-blue-100 text-sm">Total Reviews</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">{fiveStarReviews}</div>
                <div className="text-blue-100 text-sm">5-Star Reviews</div>
              </div>
            </div>
            
            {/* Decorative Line */}
            <div className="flex items-center justify-center gap-4 mt-8">
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
            <div className="flex flex-col gap-4">
              {/* Search Bar */}
              <div className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search reviews..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-base"
                  />
                </div>
              </div>

              {/* Filters Row */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* Rating Filter */}
                <div className="flex-1">
                  <select
                    value={selectedRating || ""}
                    onChange={(e) => setSelectedRating(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div className="flex-1">
                  <select
                    value={selectedCategory || ""}
                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {uniqueCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div className="flex-1">
                  <select
                    value={selectedLocation || ""}
                    onChange={(e) => setSelectedLocation(e.target.value || null)}
                    className="w-full h-12 px-4 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map((location) => (
                      <option key={location} value={location}>
                        {location}
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
                  {selectedRating && (
                    <Badge variant="secondary" className="px-3 py-1">
                      Rating: {selectedRating} Stars
                      <button
                        onClick={() => setSelectedRating(null)}
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
                  {selectedLocation && (
                    <Badge variant="secondary" className="px-3 py-1">
                      Location: {selectedLocation}
                      <button
                        onClick={() => setSelectedLocation(null)}
                        className="ml-2 hover:text-primary"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredReviews.length}</span>{" "}
            {filteredReviews.length === 1 ? "review" : "reviews"}
            {hasActiveFilters && " (filtered)"}
          </p>
        </div>

        {/* Reviews Grid/List */}
        {filteredReviews.length === 0 ? (
          <Card className="shadow-xl border-0">
            <CardContent className="pt-12 pb-12 px-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters to see more results.
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
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredReviews.map((review) => (
              <Card 
                key={review.id}
                className="shadow-lg hover:shadow-2xl transition-all duration-300 border-0 relative overflow-hidden group"
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${review.color}`}></div>
                <CardContent className="p-6">
                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-5 w-5 ${
                          star <= review.rating 
                            ? "text-yellow-400 fill-yellow-400" 
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  
                  {/* Review Text */}
                  <p className="text-gray-700 mb-6 italic text-base leading-relaxed min-h-[80px]">
                    "{review.reviewText}"
                  </p>
                  
                  {/* Review Meta */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 bg-gradient-to-br ${review.color} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform`}>
                        {review.initials}
                      </div>
                      <div className="ml-3">
                        <div className="font-bold text-gray-900">{review.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {review.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Service Category and Date */}
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <Badge variant="outline" className="text-xs">
                      {review.serviceCategory}
                    </Badge>
                    <div className="text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {review.date}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      </div>
      
      <Footer />
    </div>
  );
}
