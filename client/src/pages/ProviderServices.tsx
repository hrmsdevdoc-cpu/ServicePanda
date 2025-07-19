import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Save,
  ArrowLeft,
  Wrench,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";

export default function ProviderServices() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  // Fetch service categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/service-categories"],
    retry: false,
  });

  // Fetch provider's existing services
  const { data: providerServices = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/provider/services"],
    retry: false,
  });

  // Set initial selected services when data loads
  useEffect(() => {
    if (providerServices.length > 0) {
      setSelectedServices(providerServices.map((s: any) => s.categoryId));
    }
  }, [providerServices]);

  const updateServicesMutation = useMutation({
    mutationFn: async (serviceIds: number[]) => {
      const res = await apiRequest("PUT", "/api/provider/services", {
        categoryIds: serviceIds
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/provider/services"] });
      toast({
        title: "Services Updated",
        description: "Your service offerings have been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update services.",
        variant: "destructive",
      });
    },
  });

  const handleServiceToggle = (categoryId: number) => {
    setSelectedServices(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleSave = () => {
    if (selectedServices.length === 0) {
      toast({
        title: "No Services Selected",
        description: "Please select at least one service category.",
        variant: "destructive",
      });
      return;
    }
    updateServicesMutation.mutate(selectedServices);
  };

  const getServiceIcon = (iconName: string) => {
    // Return a default wrench icon for now - can be enhanced later
    return <Wrench className="h-6 w-6" />;
  };

  if (categoriesLoading || servicesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-6">
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
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Service Categories</h1>
              <p className="text-lg text-gray-600 mt-2">
                Select the services you provide to customers
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              Step 2 of 4
            </Badge>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Registration Progress</span>
            <span>50% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-red-600 h-2 rounded-full" style={{ width: '50%' }}></div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="h-5 w-5 mr-2" />
              Available Service Categories
            </CardTitle>
            <p className="text-sm text-gray-600">
              Choose all the services you can provide. You can update this anytime.
            </p>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Service Categories</h3>
                <p className="text-gray-500">
                  Service categories are not available at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category: any) => (
                  <div
                    key={category.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedServices.includes(category.id)
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleServiceToggle(category.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={selectedServices.includes(category.id)}
                        onChange={() => {}} // Controlled by parent click
                        className="pointer-events-none"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getServiceIcon(category.icon)}
                          <h3 className="font-medium text-gray-900">{category.name}</h3>
                        </div>
                        {category.description && (
                          <p className="text-sm text-gray-600">{category.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Selected Services Summary */}
            {selectedServices.length > 0 && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <h4 className="font-medium text-green-800">
                    {selectedServices.length} Service{selectedServices.length !== 1 ? 's' : ''} Selected
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedServices.map((serviceId) => {
                    const category = categories.find((c: any) => c.id === serviceId);
                    return category ? (
                      <Badge key={serviceId} className="bg-green-100 text-green-800">
                        {category.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => navigate("/provider-dashboard")}
              >
                Cancel
              </Button>
              
              <Button
                onClick={handleSave}
                disabled={selectedServices.length === 0 || updateServicesMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {updateServicesMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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