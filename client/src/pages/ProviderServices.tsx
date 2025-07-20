import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft,
  Check,
  Home,
  Wrench,
  Zap,
  Droplets,
  Car,
  Hammer,
  TreePine,
  Bug,
  Sparkles,
  Building,
  Save
} from "lucide-react";

// Service icons mapping - same as registration
const serviceIcons = {
  "Domestic Cleaning": Sparkles,
  "Bond Cleaning": Building,
  "Carpet Cleaning": Home,
  "Pest Control": Bug,
  "Gardening": TreePine,
  "Removals": Car,
  "Handyman": Hammer,
  "Electrical": Zap,
  "Air Conditioning": Wrench,
  "Plumbing": Droplets,
};

export default function ProviderServices() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    selectedServices: [] as number[],
  });
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Fetch service categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<any[]>({
    queryKey: ["/api/service-categories"],
    retry: false,
  });

  // Fetch provider's existing services
  const { data: providerServices = [], isLoading: servicesLoading } = useQuery<any[]>({
    queryKey: ["/api/provider/services"],
    retry: false,
  });

  // Set initial selected services when data loads
  useEffect(() => {
    if (Array.isArray(providerServices) && providerServices.length > 0) {
      // Extract category IDs and remove duplicates
      const serviceIds = providerServices.map((service: any) => service.categoryId);
      const uniqueServiceIds = Array.from(new Set(serviceIds));
      
      console.log('Original service IDs:', serviceIds);
      console.log('Deduplicated service IDs:', uniqueServiceIds);
      
      setFormData(prev => ({ 
        ...prev, 
        selectedServices: uniqueServiceIds 
      }));
    }
  }, [providerServices]);

  const addServicesMutation = useMutation({
    mutationFn: async (categoryIds: number[]) => {
      // Get provider ID from localStorage (same as registration)
      const providerId = localStorage.getItem('providerId');
      if (!providerId) {
        throw new Error("Provider information not found.");
      }
      
      console.log('Updating services for provider:', providerId, 'categories:', categoryIds);
      await apiRequest("POST", `/api/service-providers/${providerId}/services`, { categoryIds });
    },
    onSuccess: () => {
      console.log('Services updated successfully');
      queryClient.invalidateQueries({ queryKey: ["/api/provider/services"] });
      toast({
        title: "Services Updated!",
        description: "Your service offerings have been updated successfully.",
        variant: "default",
      });
    },
    onError: (error: any) => {
      console.error('Error updating services:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update services.",
        variant: "destructive",
      });
    },
  });

  const handleSaveServices = () => {
    // Mark that form submission was attempted
    setHasAttemptedSubmit(true);

    if (formData.selectedServices.length === 0) {
      toast({
        title: "Please select your services",
        description: "You must select at least one service you specialize in",
        variant: "destructive",
      });
      return;
    }

    addServicesMutation.mutate(formData.selectedServices);
  };

  if (categoriesLoading || servicesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/provider-dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Select Your Services</h1>
            <p className="text-lg text-gray-600 mt-2">
              Choose the services you specialize in (you can select multiple)
            </p>
          </div>
        </div>

        {/* Exact replication of Step 2 from registration */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-center flex-1">
                <h2 className="text-2xl font-bold mb-2">Select Your Services</h2>
                <p className="text-gray-600 font-normal">
                  Choose the services you specialize in (you can select multiple)
                </p>
              </CardTitle>
              <Button 
                onClick={handleSaveServices}
                disabled={addServicesMutation.isPending || formData.selectedServices.length === 0}
                className="ml-4"
              >
                {addServicesMutation.isPending ? "Saving..." : "Save Services"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Validation message */}
            {hasAttemptedSubmit && formData.selectedServices.length === 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600 text-sm font-medium">
                  Please select at least one service you specialize in
                </p>
              </div>
            )}

            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {categories.map((category: any) => {
                const IconComponent = serviceIcons[category.name as keyof typeof serviceIcons] || Home;
                const isSelected = formData.selectedServices.includes(category.id);
                
                return (
                  <div
                    key={category.id}
                    className={`relative border-2 rounded-lg p-2 text-center cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? "border-primary bg-blue-50 shadow-md" 
                        : "border-gray-300 hover:border-primary hover:shadow-sm"
                    }`}
                    onClick={() => {
                      setFormData(prev => {
                        let newSelectedServices;
                        if (isSelected) {
                          // Remove the service (filter out all instances)
                          newSelectedServices = prev.selectedServices.filter(id => id !== category.id);
                        } else {
                          // Add the service only if not already present (prevent duplicates)
                          newSelectedServices = prev.selectedServices.includes(category.id)
                            ? prev.selectedServices
                            : [...prev.selectedServices, category.id];
                        }
                        
                        // Additional safety: remove any duplicates
                        newSelectedServices = Array.from(new Set(newSelectedServices));
                        
                        console.log('Service selection updated:', {
                          categoryId: category.id,
                          action: isSelected ? 'removed' : 'added',
                          newSelection: newSelectedServices
                        });
                        
                        return {
                          ...prev,
                          selectedServices: newSelectedServices
                        };
                      });
                    }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 ${
                      isSelected ? "bg-primary text-white" : "bg-blue-100"
                    }`}>
                      <IconComponent className={`h-4 w-4 ${isSelected ? "text-white" : "text-primary"}`} />
                    </div>
                    <h3 className="text-xs font-medium text-gray-900 leading-tight">{category.name}</h3>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected services summary */}
            {formData.selectedServices.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700 text-sm font-medium mb-2">
                  Selected Services ({formData.selectedServices.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories
                    .filter((cat: any) => formData.selectedServices.includes(cat.id))
                    .map((cat: any) => (
                      <span 
                        key={cat.id}
                        className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {cat.name}
                      </span>
                    ))}
                </div>
              </div>
            )}
            
            {/* Save button at bottom */}
            <div className="flex justify-end">
              <Button 
                onClick={handleSaveServices}
                disabled={addServicesMutation.isPending}
                className="bg-primary hover:bg-primary/90"
              >
                {addServicesMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Services
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}