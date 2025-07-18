import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft, MapPin, Calendar as CalendarIconLucide, FileText, Search, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function RequestService() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    categoryId: "",
    postcode: "",
    suburb: "",
    preferredDate: undefined as Date | undefined,
    description: "",
  });
  
  const [step, setStep] = useState(1);
  const [postcodeSearch, setPostcodeSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  // Handle URL parameters for direct navigation from dashboard
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');
    const stepParam = urlParams.get('step');
    
    if (categoryId) {
      setFormData(prev => ({ ...prev, categoryId }));
    }
    
    if (stepParam === '2' && categoryId) {
      setStep(2);
    }
  }, []);

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/service-categories"],
  });

  const { data: suburbs = [] } = useQuery({
    queryKey: [`/api/suburbs/${postcodeSearch}`],
    enabled: postcodeSearch.length >= 4,
  });

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return categories;
    
    const searchTerm = categorySearch.toLowerCase();
    return categories.filter((category: any) =>
      category.name.toLowerCase().includes(searchTerm) ||
      category.description.toLowerCase().includes(searchTerm)
    );
  }, [categories, categorySearch]);

  const createServiceRequestMutation = useMutation({
    mutationFn: async (requestData: any) => {
      const response = await apiRequest("POST", "/api/service-requests", requestData);
      return response.json();
    },
    onSuccess: (data) => {
      // Show success step instead of navigating away
      setStep(3);
      queryClient.invalidateQueries({ queryKey: ["/api/service-requests"] });
    },
    onError: (error: any) => {
      toast({
        title: "Request Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!user) {
      toast({
        title: "Please Sign In",
        description: "You need to be signed in to request services.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!formData.categoryId || !formData.postcode || !formData.suburb || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createServiceRequestMutation.mutate({
      categoryId: parseInt(formData.categoryId),
      postcode: formData.postcode,
      suburb: formData.suburb,
      preferredDate: formData.preferredDate?.toISOString(),
      description: formData.description,
    });
  };

  const selectedCategory = categories.find((cat: any) => cat.id.toString() === formData.categoryId);

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Request a Service</h1>
            <p className="text-gray-600 mt-1">What type of service do you need?</p>
          </div>

          {/* Search Bar */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search for services (e.g., cleaning, plumbing, electrical)..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Service Categories Grid */}
          <Card>
            <CardContent className="pt-6">
              {filteredCategories.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No services found matching "{categorySearch}"</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setCategorySearch("")}
                    className="mt-2"
                  >
                    Clear search
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredCategories.map((category: any) => (
                    <Button
                      key={category.id}
                      variant={formData.categoryId === category.id.toString() ? "default" : "outline"}
                      className="h-auto p-3 text-left justify-start hover:shadow-md transition-all"
                      onClick={() => {
                        setFormData({ ...formData, categoryId: category.id.toString() });
                        setStep(2);
                      }}
                    >
                      <div className="w-full">
                        <div className="font-medium text-sm">{category.name}</div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">{category.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing {filteredCategories.length} of {categories.length} services
          </div>
        </div>
      </div>
    );
  }

  // Success step after service request submission
  if (step === 3) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Card className="text-center">
            <CardContent className="pt-8 pb-8">
              <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You for Contacting Us!</h1>
                <p className="text-lg text-gray-600 mb-6">
                  Your service request has been successfully submitted.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-3">What happens next?</h2>
                <div className="space-y-3 text-left">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</div>
                    <p className="text-blue-800">We are locating qualified professionals in your area</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
                    <p className="text-blue-800">Service providers will review your requirements</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
                    <p className="text-blue-800">They will connect with you directly to provide the best quotes</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={() => navigate("/")}
                  className="w-full"
                  size="lg"
                >
                  Back to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setStep(1);
                    setFormData({
                      categoryId: "",
                      postcode: "",
                      suburb: "",
                      preferredDate: undefined,
                      description: "",
                    });
                    setPostcodeSearch("");
                    setCategorySearch("");
                  }}
                  className="w-full"
                >
                  Request Another Service
                </Button>
              </div>

              <p className="text-sm text-gray-500 mt-6">
                Expected response time: Within 24 hours
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setStep(1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Service Selection
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Service Details</h1>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-gray-600">
              Selected: <span className="font-semibold text-primary">{selectedCategory?.name}</span>
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Clear URL params and go back to step 1
                window.history.replaceState({}, '', '/request-service');
                setStep(1);
              }}
              className="text-xs"
            >
              Change Service
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Top Row: Location and Date */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Location */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Label htmlFor="postcode">Postcode and Suburb *</Label>
                  <div className="relative">
                    <Input
                      id="postcode"
                      value={postcodeSearch}
                      onChange={(e) => {
                        setPostcodeSearch(e.target.value);
                        setFormData({ ...formData, postcode: e.target.value, suburb: "" });
                      }}
                      placeholder="Enter postcode (e.g., 2000, 3000, 4000)"
                      maxLength={4}
                      className={cn(
                        suburbs.length > 0 && "rounded-b-none border-b-0"
                      )}
                    />
                    
                    {suburbs.length > 0 && (
                      <div className="absolute top-full left-0 right-0 z-50 max-h-48 overflow-y-auto border border-t-0 rounded-b-md bg-white shadow-lg">
                        {suburbs.map((suburb: any) => (
                          <button
                            key={suburb.id}
                            type="button"
                            className={cn(
                              "w-full px-3 py-2 text-left text-sm hover:bg-gray-100 border-b border-gray-100 last:border-b-0",
                              formData.suburb === suburb.suburb && "bg-primary text-primary-foreground hover:bg-primary/90"
                            )}
                            onClick={() => {
                              setFormData({ ...formData, suburb: suburb.suburb });
                              setPostcodeSearch(""); // Clear search to hide dropdown
                            }}
                          >
                            <div className="font-medium">{suburb.suburb}</div>
                            <div className="text-xs text-gray-500">
                              {suburb.postcode}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {formData.suburb && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-800">
                          Selected: {formData.suburb}, {formData.postcode}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, suburb: "", postcode: "" });
                            setPostcodeSearch("");
                          }}
                          className="text-green-600 hover:text-green-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Preferred Date */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg">
                  <CalendarIconLucide className="h-4 w-4 mr-2 text-primary" />
                  Preferred Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="date" className="text-sm">When do you need this service? (optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-2",
                        !formData.preferredDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.preferredDate ? (
                        format(formData.preferredDate, "PPP")
                      ) : (
                        <span>Select a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.preferredDate}
                      onSelect={(date) => setFormData({ ...formData, preferredDate: date })}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>
          </div>

          {/* Service Details - Full Width */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <FileText className="h-4 w-4 mr-2 text-primary" />
                Service Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="description" className="text-sm font-medium">
                Please explain what you need done *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your service requirements in detail... 

For example:
• What specific tasks need to be completed?
• What is the size/scope of the area or items?
• Are there any special requirements or preferences?
• When would you like the work completed?
• Any access considerations or preparation needed?"
                rows={8}
                className="mt-2 min-h-[200px]"
              />
              <p className="text-sm text-gray-500 mt-3">
                💡 The more details you provide, the more accurate quotes you'll receive from service providers
              </p>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <Button
                  onClick={handleSubmit}
                  disabled={createServiceRequestMutation.isPending}
                  className="w-full"
                  size="lg"
                >
                  {createServiceRequestMutation.isPending ? (
                    <>
                      <Search className="mr-2 h-4 w-4 animate-spin" />
                      Finding Providers...
                    </>
                  ) : (
                    "Submit Service Request"
                  )}
                </Button>
                <p className="text-sm text-gray-500 text-center mt-3">
                  We'll match you with qualified providers in your area
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}