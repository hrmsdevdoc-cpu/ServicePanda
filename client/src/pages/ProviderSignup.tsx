import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { DocumentUpload } from "@/components/DocumentUpload";
import AddressInputFixed from "@/components/AddressInputFixed";
import { 
  PawPrint, 
  X, 
  Home, 
  Key, 
  Sofa, 
  Bug, 
  Sprout, 
  Truck, 
  Wrench, 
  Zap,
  Check
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

export default function ProviderSignup() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    address: "",
    parsedAddress: null as any,
    selectedServices: [] as number[],
    selectedState: "",
    postcode: "",
    selectedSuburbs: [] as number[],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/service-categories"],
  });

  const { data: states = [] } = useQuery({
    queryKey: ["/api/australian-states"],
  });

  const { data: suburbs = [] } = useQuery({
    queryKey: ["/api/suburbs", formData.postcode],
    enabled: formData.postcode.length >= 4,
  });

  const createProviderMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/service-providers", data);
      return response.json();
    },
    onSuccess: (data) => {
      setFormData(prev => ({ ...prev, providerId: data.id }));
      setCurrentStep(2);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addServicesMutation = useMutation({
    mutationFn: async ({ providerId, categoryIds }: { providerId: number; categoryIds: number[] }) => {
      await apiRequest("POST", `/api/service-providers/${providerId}/services`, { categoryIds });
    },
    onSuccess: () => {
      setCurrentStep(3);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addServiceAreasMutation = useMutation({
    mutationFn: async ({ providerId, suburbIds }: { providerId: number; suburbIds: number[] }) => {
      await apiRequest("POST", `/api/service-providers/${providerId}/service-areas`, { suburbIds });
    },
    onSuccess: () => {
      setCurrentStep(4);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const uploadDocumentsMutation = useMutation({
    mutationFn: async ({ providerId, documents }: { providerId: number; documents: FileList }) => {
      const formData = new FormData();
      Array.from(documents).forEach((file) => {
        formData.append("documents", file);
      });
      await apiRequest("POST", `/api/service-providers/${providerId}/documents`, formData);
    },
    onSuccess: () => {
      setCurrentStep(5);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStep1Submit = () => {
    if (!isAuthenticated) {
      window.location.href = "/api/login";
      return;
    }

    createProviderMutation.mutate({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      mobileNumber: formData.mobileNumber,
      address: formData.address,
    });
  };

  const handleStep2Submit = () => {
    if (formData.selectedServices.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one service",
        variant: "destructive",
      });
      return;
    }

    addServicesMutation.mutate({
      providerId: (formData as any).providerId,
      categoryIds: formData.selectedServices,
    });
  };

  const handleStep3Submit = () => {
    if (formData.selectedSuburbs.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one suburb",
        variant: "destructive",
      });
      return;
    }

    addServiceAreasMutation.mutate({
      providerId: (formData as any).providerId,
      suburbIds: formData.selectedSuburbs,
    });
  };

  const handleDocumentUpload = (files: FileList) => {
    uploadDocumentsMutation.mutate({
      providerId: (formData as any).providerId,
      documents: files,
    });
  };

  const progressPercent = (currentStep / 5) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <PawPrint className="h-8 w-8 text-primary mr-3" />
              <span className="text-xl font-bold text-gray-900">ServicePanda Partners</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="flex items-center mb-6">
            <div className="flex-1">
              <Progress value={progressPercent} className="h-2" />
            </div>
            <span className="ml-4 text-sm text-gray-600">Step {currentStep} of 5</span>
          </div>
        </div>

        {/* Step 1: Account Creation */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                <h2 className="text-2xl font-bold mb-2">Create Your Account</h2>
                <p className="text-gray-600 font-normal">
                  Join thousands of verified service providers across Australia
                </p>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email address"
                />
              </div>
              
              <div>
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, mobileNumber: e.target.value }))}
                  placeholder="Enter your mobile number"
                />
              </div>
              
              <div>
                <AddressInputFixed
                  value={formData.address}
                  onChange={(address, parsedAddress) => 
                    setFormData(prev => ({ 
                      ...prev, 
                      address, 
                      parsedAddress,
                      // Auto-populate postcode if available
                      postcode: parsedAddress?.postcode || prev.postcode
                    }))
                  }
                  label="Business Address"
                  placeholder="Start typing your business address..."
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleStep1Submit}
                  disabled={createProviderMutation.isPending}
                >
                  {createProviderMutation.isPending ? "Creating..." : "Next Step"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Service Selection */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                <h2 className="text-2xl font-bold mb-2">Select Your Services</h2>
                <p className="text-gray-600 font-normal">
                  Choose the services you specialize in (you can select multiple)
                </p>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {categories.map((category: any) => {
                  const IconComponent = serviceIcons[category.name as keyof typeof serviceIcons] || Home;
                  const isSelected = formData.selectedServices.includes(category.id);
                  
                  return (
                    <div
                      key={category.id}
                      className={`border-2 rounded-xl p-6 text-center cursor-pointer transition-colors ${
                        isSelected 
                          ? "border-primary bg-blue-50" 
                          : "border-gray-300 hover:border-primary"
                      }`}
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          selectedServices: isSelected
                            ? prev.selectedServices.filter(id => id !== category.id)
                            : [...prev.selectedServices, category.id]
                        }));
                      }}
                    >
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                >
                  Previous
                </Button>
                <Button 
                  onClick={handleStep2Submit}
                  disabled={addServicesMutation.isPending}
                >
                  {addServicesMutation.isPending ? "Saving..." : "Next Step"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Location Selection */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                <h2 className="text-2xl font-bold mb-2">Service Areas</h2>
                <p className="text-gray-600 font-normal">
                  Select the areas where you provide services
                </p>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>State</Label>
                  <Select
                    value={formData.selectedState}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, selectedState: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state: any) => (
                        <SelectItem key={state.id} value={state.name}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input
                    id="postcode"
                    value={formData.postcode}
                    onChange={(e) => setFormData(prev => ({ ...prev, postcode: e.target.value }))}
                    placeholder="Enter postcode"
                  />
                </div>
              </div>
              
              {suburbs.length > 0 && (
                <div>
                  <Label>Select Suburbs</Label>
                  <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                    <div className="space-y-2">
                      {suburbs.map((suburb: any) => (
                        <div key={suburb.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`suburb-${suburb.id}`}
                            checked={formData.selectedSuburbs.includes(suburb.id)}
                            onCheckedChange={(checked) => {
                              setFormData(prev => ({
                                ...prev,
                                selectedSuburbs: checked
                                  ? [...prev.selectedSuburbs, suburb.id]
                                  : prev.selectedSuburbs.filter(id => id !== suburb.id)
                              }));
                            }}
                          />
                          <Label htmlFor={`suburb-${suburb.id}`} className="text-sm">
                            {suburb.suburb}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                >
                  Previous
                </Button>
                <Button 
                  onClick={handleStep3Submit}
                  disabled={addServiceAreasMutation.isPending}
                >
                  {addServiceAreasMutation.isPending ? "Saving..." : "Next Step"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Document Upload */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                <h2 className="text-2xl font-bold mb-2">Upload Documents</h2>
                <p className="text-gray-600 font-normal">
                  Upload your required documents for verification
                </p>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <DocumentUpload
                label="Upload Documents"
                description="Upload your license, police check, and insurance documents"
                onUpload={handleDocumentUpload}
                loading={uploadDocumentsMutation.isPending}
              />
              
              <div className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(3)}
                >
                  Previous
                </Button>
                <Button 
                  onClick={() => setCurrentStep(5)}
                  disabled={uploadDocumentsMutation.isPending}
                >
                  Complete Registration
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Success */}
        {currentStep === 5 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Congratulations!</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Thank you for joining ServicePanda. Someone from our team will be looking at your documents and give you a call shortly to onboard you.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto mb-8">
                <p className="text-sm text-gray-700">
                  <strong>Please Remember:</strong> Our office hours are from 9 AM to 5 PM, Monday to Friday
                </p>
              </div>
              <Button onClick={() => navigate("/")}>
                Back to Home
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
