import { useState, useEffect } from "react";
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
import { AddressInput } from "@/components/AddressInput";
import { LocationServiceAreaForm } from "@/components/LocationServiceAreaForm";
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
  Check,
  Droplet
} from "lucide-react";

const serviceIcons = {
  "Domestic Cleaning": Home,
  "Bond Cleaning": Key,
  "End of Lease Cleaning": Key,
  "Carpet Cleaning": Sofa,
  "Pest Control": Bug,
  "Gardening": Sprout,
  "Removals": Truck,
  "Handyman": Wrench,
  "Plumbing": Droplet,
  "Electrician": Zap,
};

export default function ProviderSignup() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isExistingProvider, setIsExistingProvider] = useState(false);
  const [isCheckingProgress, setIsCheckingProgress] = useState(true);
  
  // Check for existing provider and determine current step
  useEffect(() => {
    const checkProviderProgress = async () => {
    setIsCheckingProgress(true);
      
      try {
        // Check if provider is logged in via API
        const storedProviderId = localStorage.getItem('providerId');
        if (!storedProviderId) {
          throw new Error('No provider session');
        }
        
        const response = await fetch('/api/provider/profile', {
          credentials: 'include',
          headers: {
            'X-Provider-Id': storedProviderId
          }
        });
        
        if (response.ok) {
          const provider = await response.json();
          setIsExistingProvider(true);
          setProviderId(provider.id);
          localStorage.setItem('providerId', provider.id.toString());
          
          // Determine current step based on completed data
          let targetStep = 1;
          
          // Step 1: Basic info (always completed if provider exists)
          if (provider.firstName && provider.lastName && provider.email) {
            targetStep = 2;
            
            // Check if services are selected (Step 2)
            const servicesResponse = await fetch('/api/provider/services', {
              credentials: 'include',
              headers: {
                'X-Provider-Id': provider.id.toString()
              }
            });
            if (servicesResponse.ok) {
              const services = await servicesResponse.json();
              if (services && services.length > 0) {
                targetStep = 3;
                
                // Check if service areas are set (Step 3) - check both old and new format
                const areasResponse = await fetch(`/api/provider/${provider.id}/service-areas`, {
                  credentials: 'include',
                  headers: {
                    'X-Provider-Id': provider.id.toString()
                  }
                });
                
                const locationAreasResponse = await fetch(`/api/provider/${provider.id}/location-service-areas`, {
                  credentials: 'include',
                  headers: {
                    'X-Provider-Id': provider.id.toString()
                  }
                });
                
                let hasServiceAreas = false;
                
                if (areasResponse.ok) {
                  const areas = await areasResponse.json();
                  if (areas && areas.length > 0) {
                    hasServiceAreas = true;
                  }
                }
                
                if (locationAreasResponse.ok) {
                  const locationAreas = await locationAreasResponse.json();
                  if (locationAreas && locationAreas.length > 0) {
                    hasServiceAreas = true;
                  }
                }
                
                if (hasServiceAreas) {
                  targetStep = 4; // Documents step
                  
                  // Check if documents are uploaded (Step 4)
                  if (provider.documentsUploaded) {
                    // All steps complete, redirect to dashboard
                    navigate('/provider-dashboard');
                    setIsCheckingProgress(false);
                    return;
                  }
                }
              }
            }
          }
          
          // Check URL parameter override
          const urlParams = new URLSearchParams(window.location.search);
          const stepParam = urlParams.get('step');
          if (stepParam && parseInt(stepParam) >= targetStep) {
            setCurrentStep(parseInt(stepParam));
          } else {
            setCurrentStep(targetStep);
          }
        }
      } catch (error) {
        console.log('No existing provider session, starting fresh');
        // No existing provider, start from step 1
        setCurrentStep(1);
      } finally {
        setIsCheckingProgress(false);
      }
    };

    checkProviderProgress();
  }, [navigate]);
  
  // Reset validation state when moving between steps
  useEffect(() => {
    setHasAttemptedSubmit(false);
  }, [currentStep]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobileNumber: "",
    address: "",
    businessName: "",
    businessAbn: "",
    parsedAddress: null as any,
    selectedServices: [] as number[],
    selectedState: "",
    postcode: "",
    selectedSuburbs: [] as number[],
  });

  // Document upload state
  const [documentFiles, setDocumentFiles] = useState({
    license: null as File | null,
    policeCheck: null as File | null,
    insuranceCertificate: null as File | null,
  });

  const [locationData, setLocationData] = useState({
    selectedStateForLocation: "",
    selectedRegion: "",
    availableRegions: [] as any[],
    isLoadingRegions: false,
    showRegionOptions: false,
    regionSelection: "all", // "all" or "custom"
    postcodeForLocation: "",
    availableSuburbs: [] as any[],
    isLoadingSuburbs: false,
    addedPostcodes: [] as string[],
  });

  // Store the provider ID once created
  const [providerId, setProviderId] = useState<number | null>(() => {
    const storedId = localStorage.getItem('providerId');
    return storedId ? parseInt(storedId) : null;
  });

  const { data: categories = [] as any[], isLoading: isLoadingCategories, error: categoriesError, refetch: refetchCategories } = useQuery({
    queryKey: ["/api/service-categories"],
  });

  // Debug logging for categories and refetch when step 2 is shown
  useEffect(() => {
    if (currentStep === 2) {
      console.log('Step 2 - Categories state:', {
        isLoading: isLoadingCategories,
        error: categoriesError,
        categoriesCount: categories.length,
        categories: categories
      });
      // Refetch categories when step 2 is shown to ensure fresh data
      if (!isLoadingCategories && categories.length === 0 && !categoriesError) {
        console.log('Refetching categories...');
        refetchCategories();
      }
    }
  }, [currentStep, isLoadingCategories, categoriesError, categories, refetchCategories]);

  const { data: states = [] as any[] } = useQuery({
    queryKey: ["/api/australian-states"],
  });

  // Fetch provider profile if existing provider
  const { data: providerProfileData } = useQuery({
    queryKey: ["/api/provider/profile"],
    retry: false,
    enabled: isExistingProvider,
  });

  // Fetch provider services to populate form
  const { data: providerServices } = useQuery({
    queryKey: ["/api/provider/services"],
    retry: false,
    enabled: isExistingProvider,
  });

  // Update form data when provider services are loaded
  useEffect(() => {
    if (providerServices && Array.isArray(providerServices) && providerServices.length > 0) {
      const serviceIds = providerServices.map((service: any) => service.categoryId);
      setFormData(prev => ({ 
        ...prev, 
        selectedServices: serviceIds 
      }));
    }
  }, [providerServices]);

  // Update form data when provider profile is loaded
  useEffect(() => {
    if (providerProfileData && typeof providerProfileData === 'object') {
      const profile = providerProfileData as any;
      setFormData(prev => ({ 
        ...prev,
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        mobileNumber: profile.mobileNumber || "",
        address: profile.address || "",
        businessName: profile.businessName || "",
        businessAbn: profile.businessAbn || "",
      }));
    }
  }, [providerProfileData]);

  // Fetch regions when state is selected
  useEffect(() => {
    const fetchRegions = async () => {
      if (locationData.selectedStateForLocation) {
        setLocationData(prev => ({ ...prev, isLoadingRegions: true }));
        try {
          const selectedState = states.find((s: any) => s.name === locationData.selectedStateForLocation);
          if (selectedState) {
            const response = await fetch(`/api/regions/state/${selectedState.id}`);
            const regions = await response.json();
            setLocationData(prev => ({ 
              ...prev, 
              availableRegions: regions,
              isLoadingRegions: false,
              showRegionOptions: true,
              // Reset dependent fields
              selectedRegion: "",
              regionSelection: "all",
              postcodeForLocation: "",
              availableSuburbs: [],
              addedPostcodes: []
            }));
          }
        } catch (error) {
          console.error("Error fetching regions:", error);
          setLocationData(prev => ({ 
            ...prev, 
            availableRegions: [],
            isLoadingRegions: false,
            showRegionOptions: false
          }));
        }
      } else {
        setLocationData(prev => ({ 
          ...prev, 
          availableRegions: [],
          showRegionOptions: false,
          selectedRegion: "",
          regionSelection: "all",
          postcodeForLocation: "",
          availableSuburbs: [],
          addedPostcodes: []
        }));
      }
    };

    fetchRegions();
  }, [locationData.selectedStateForLocation]); // Remove states from dependencies to prevent infinite loop

  // Fetch suburbs when postcode changes (for custom selection)
  useEffect(() => {
    const fetchSuburbs = async () => {
      if (locationData.postcodeForLocation.length >= 4 && locationData.regionSelection === "custom") {
        setLocationData(prev => ({ ...prev, isLoadingSuburbs: true }));
        try {
          const response = await fetch(`/api/suburbs/${locationData.postcodeForLocation}`);
          const suburbs = await response.json();
          setLocationData(prev => ({ 
            ...prev, 
            availableSuburbs: suburbs,
            isLoadingSuburbs: false 
          }));
        } catch (error) {
          console.error("Error fetching suburbs:", error);
          setLocationData(prev => ({ 
            ...prev, 
            availableSuburbs: [],
            isLoadingSuburbs: false 
          }));
        }
      } else {
        setLocationData(prev => ({ ...prev, availableSuburbs: [] }));
      }
    };

    const timeoutId = setTimeout(fetchSuburbs, 300);
    return () => clearTimeout(timeoutId);
  }, [locationData.postcodeForLocation, locationData.regionSelection]);

  const registerProviderMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('Registering provider with data:', data);
      try {
        // Register provider with their own authentication system
        const response = await apiRequest("POST", "/api/provider/register", {
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          mobileNumber: data.mobileNumber,
          address: data.address,
          businessName: data.businessName,
          businessAbn: data.businessAbn,
        });
        
        const provider = await response.json();
        console.log('Provider registered successfully:', provider);
        
        return provider;
      } catch (error) {
        console.error('Error in registerProviderMutation:', error);
        throw error; // Re-throw to be caught by onError
      }
    },
    onSuccess: (provider) => {
      console.log('Provider registered successfully:', provider);
      try {
        // Store provider ID for next steps and authentication
        setProviderId(provider.id);
        localStorage.setItem('providerId', provider.id.toString());
        
        // Store provider info in localStorage for this session
        localStorage.setItem('currentProvider', JSON.stringify(provider));
        
        // Move to step 2
        setCurrentStep(2);
        
        // Show success message
        toast({
          title: "Account Created!",
          description: "Welcome to ServicePanda! Now select the services you provide.",
          variant: "default",
        });
        
        console.log('Step 1 completed successfully, moving to Step 2');
      } catch (error) {
        console.error('Error in onSuccess:', error);
        // Don't let this error block the flow
        setProviderId(provider.id);
        localStorage.setItem('providerId', provider.id.toString());
        setCurrentStep(2);
      }
    },
    onError: (error: any) => {
      console.error('Error registering provider:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addServicesMutation = useMutation({
    mutationFn: async ({ providerId, categoryIds }: { providerId: number; categoryIds: number[] }) => {
      console.log('Adding services for provider:', providerId, 'categories:', categoryIds);
      await apiRequest("POST", `/api/service-providers/${providerId}/services`, { categoryIds });
    },
    onSuccess: () => {
      console.log('Services added successfully');
      setCurrentStep(3);
      toast({
        title: "Step 2 Complete!",
        description: "Your services have been saved. Now select your service areas.",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error('Error adding services:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // New location-based service areas mutation (replaces suburb-based approach)
  const [serviceAreas, setServiceAreas] = useState([]);

  const handleServiceAreasChange = (areas: any[]) => {
    setServiceAreas(areas);
  };

  const handleStep3Next = () => {
    if (serviceAreas.length === 0) {
      toast({
        title: "Please add at least one service area",
        description: "You must add at least one location where you provide services",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep(4);
    toast({
      title: "Step 3 Complete!",
      description: "Your service areas have been saved. Upload your documents to complete registration.",
      variant: "default",
    });
  };

  const uploadDocumentsMutation = useMutation({
    mutationFn: async ({ providerId, documents }: { providerId: number; documents: { license?: File; policeCheck?: File; insuranceCertificate?: File } }) => {
      const formData = new FormData();
      
      if (documents.license) {
        formData.append("license", documents.license);
      }
      if (documents.policeCheck) {
        formData.append("policeCheck", documents.policeCheck);
      }
      if (documents.insuranceCertificate) {
        formData.append("insuranceCertificate", documents.insuranceCertificate);
      }
      
      await apiRequest("POST", `/api/service-providers/${providerId}/documents`, formData);
    },
    onSuccess: () => {
      setCurrentStep(5);
      toast({
        title: "Documents Uploaded!",
        description: "Your documents have been uploaded successfully. Application submitted for review.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Upload Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStep1Submit = () => {
    // Prevent multiple submissions
    if (registerProviderMutation.isPending) {
      return;
    }

    // Mark that form submission was attempted
    setHasAttemptedSubmit(true);

    // Validate required fields first
    const errors = [];
    
    if (!formData.firstName.trim()) {
      errors.push("First name is required");
    }
    
    if (!formData.lastName.trim()) {
      errors.push("Last name is required");
    }
    
    if (!formData.email.trim()) {
      errors.push("Email address is required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push("Please enter a valid email address");
    }
    
    if (!formData.mobileNumber.trim()) {
      errors.push("Mobile number is required");
    } else if (!/^(\+61|0)[2-9]\d{8}$/.test(formData.mobileNumber.replace(/[\s\-\(\)]/g, ''))) {
      errors.push("Please enter a valid Australian mobile number");
    }
    
    if (!formData.address.trim()) {
      errors.push("Business address is required");
    }
    
    if (!formData.password.trim()) {
      errors.push("Password is required");
    } else if (formData.password.trim().length < 6) {
      errors.push("Password must be at least 6 characters");
    }

    if (errors.length > 0) {
      toast({
        title: "Please fix the following errors:",
        description: errors.join(", "),
        variant: "destructive",
      });
      return;
    }

    // Only check authentication for Step 2 and beyond
    if (currentStep > 1 && !isAuthenticated && !isLoading) {
      console.log('User not authenticated for Step 2+, redirecting to auth page...');
      navigate("/auth?returnTo=/provider-signup");
      return;
    }

    registerProviderMutation.mutate({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      mobileNumber: formData.mobileNumber.trim(),
      address: formData.address.trim(),
      businessName: formData.businessName.trim(),
      businessAbn: formData.businessAbn.trim(),
    });
  };

  const handleStep2Submit = () => {
    // Prevent multiple submissions
    if (addServicesMutation.isPending) {
      return;
    }

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

    if (!providerId) {
      toast({
        title: "Error",
        description: "Provider information not found. Please start from Step 1.",
        variant: "destructive",
      });
      setCurrentStep(1);
      return;
    }

    addServicesMutation.mutate({
      providerId: providerId,
      categoryIds: formData.selectedServices,
    });
  };

  // Note: handleStep3Submit is not used in the current implementation
  // Step 3 now uses handleStep3Next which doesn't make API calls
  const handleStep3Submit = () => {
    // This function is deprecated - Step 3 now uses handleStep3Next
    console.warn('handleStep3Submit is deprecated, use handleStep3Next instead');
  };

  const handleDocumentUpload = () => {
    // Prevent multiple submissions
    if (uploadDocumentsMutation.isPending) {
      return;
    }

    if (!providerId) {
      toast({
        title: "Error",
        description: "Provider information not found. Please start from Step 1.",
        variant: "destructive",
      });
      setCurrentStep(1);
      return;
    }

    // Check if all three documents are uploaded
    const missingDocs = [];
    if (!documentFiles.license) missingDocs.push("License Document");
    if (!documentFiles.policeCheck) missingDocs.push("Police Check");
    if (!documentFiles.insuranceCertificate) missingDocs.push("Insurance Certificate");
    
    if (missingDocs.length > 0) {
      toast({
        title: "All Documents Required",
        description: `Please upload the following documents: ${missingDocs.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    uploadDocumentsMutation.mutate({
      providerId: providerId,
      documents: documentFiles,
    });
  };

  const progressPercent = (currentStep / 5) * 100;

  // Show loading screen while checking progress
  if (isCheckingProgress) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking your progress...</p>
        </div>
      </div>
    );
  }

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

        {/* Step 1: Account Creation - Hidden for existing providers */}
        {currentStep === 1 && !isExistingProvider && (
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
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter your first name"
                    className={hasAttemptedSubmit && !formData.firstName.trim() ? "border-red-300 focus:border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter your last name"
                    className={hasAttemptedSubmit && !formData.lastName.trim() ? "border-red-300 focus:border-red-500" : ""}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email address"
                  className={hasAttemptedSubmit && (!formData.email.trim() || (formData.email && !/\S+@\S+\.\S+/.test(formData.email))) ? "border-red-300 focus:border-red-500" : ""}
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Create a secure password (min 6 characters)"
                  className={hasAttemptedSubmit && (!formData.password.trim() || formData.password.trim().length < 6) ? "border-red-300 focus:border-red-500" : ""}
                />
              </div>
              
              <div>
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, mobileNumber: e.target.value }))}
                  placeholder="Enter your mobile number (e.g., 0412 345 678)"
                  className={hasAttemptedSubmit && (!formData.mobileNumber.trim() || (formData.mobileNumber && !/^(\+61|0)[2-9]\d{8}$/.test(formData.mobileNumber.replace(/[\s\-\(\)]/g, '')))) ? "border-red-300 focus:border-red-500" : ""}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                    placeholder="Enter your business name (optional)"
                  />
                </div>
                <div>
                  <Label htmlFor="businessAbn">Business ABN/ACN</Label>
                  <Input
                    id="businessAbn"
                    value={formData.businessAbn}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessAbn: e.target.value }))}
                    placeholder="Enter your ABN or ACN (optional)"
                  />
                </div>
              </div>
              
              <div>
                <AddressInput
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
                  label="Business Address *"
                  placeholder="Start typing your business address..."
                  required
                  error={hasAttemptedSubmit && !formData.address.trim() ? "Address is required" : ""}
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleStep1Submit}
                  disabled={registerProviderMutation.isPending}
                >
                  {registerProviderMutation.isPending ? "Creating Account..." : "Create Account & Continue"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Service Selection */}
        {currentStep === 2 && (
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
                  onClick={handleStep2Submit}
                  disabled={addServicesMutation.isPending || formData.selectedServices.length === 0}
                  className="ml-4"
                >
                  {addServicesMutation.isPending ? "Saving..." : "Next Step"}
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

              {/* Loading state */}
              {isLoadingCategories && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading services...</p>
                  </div>
                </div>
              )}

              {/* Error state */}
              {categoriesError && !isLoadingCategories && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-600 text-sm font-medium">
                    Failed to load services. Please refresh the page or try again later.
                  </p>
                  <p className="text-red-500 text-xs mt-2">
                    {categoriesError instanceof Error ? categoriesError.message : "Unknown error"}
                  </p>
                </div>
              )}

              {/* Empty state */}
              {!isLoadingCategories && !categoriesError && categories.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800 text-sm font-medium">
                    No services available. Please contact support.
                  </p>
                </div>
              )}

              {/* Services grid */}
              {!isLoadingCategories && !categoriesError && categories.length > 0 && (
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
                        setFormData(prev => ({
                          ...prev,
                          selectedServices: isSelected
                            ? prev.selectedServices.filter(id => id !== category.id)
                            : [...prev.selectedServices, category.id]
                        }));
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
              )}

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
              
              <div className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  disabled={isExistingProvider}
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

        {/* Step 3: Service Areas - New Location-Based Approach */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                <h2 className="text-2xl font-bold mb-2">Service Areas</h2>
                <p className="text-gray-600 font-normal">
                  Define your service locations with coverage radius
                </p>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <LocationServiceAreaForm
                providerId={parseInt(localStorage.getItem('providerId') || '0')}
                initialAddress={providerProfileData?.address || formData.address || ""}
                onServiceAreasChange={handleServiceAreasChange}
              />
              
              <div className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                >
                  Previous
                </Button>
                <Button 
                  onClick={handleStep3Next}
                >
                  Next Step
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
                  Upload all three required documents for verification (all mandatory)
                </p>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Compact 3-column document upload sections */}
              <div className="grid md:grid-cols-3 gap-3">
                {/* License Document Upload */}
                <div className="border rounded-lg p-3">
                  <h3 className="font-medium text-gray-900 mb-1 text-sm">License Document *</h3>
                  <DocumentUpload
                    label="Choose File"
                    description="PDF, JPG, PNG (10MB max)"
                    onUpload={(files) => {
                      if (files.length > 0) {
                        setDocumentFiles(prev => ({ ...prev, license: files[0] }));
                      }
                    }}
                    loading={uploadDocumentsMutation.isPending}
                    multiple={false}
                  />
                  {documentFiles.license && (
                    <div className="mt-1 p-1 bg-green-50 border border-green-200 rounded text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-green-700 flex items-center">
                          <Check className="h-3 w-3 mr-1" />
                          Selected
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDocumentFiles(prev => ({ ...prev, license: null }))}
                          className="h-5 w-5 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Police Check Document Upload */}
                <div className="border rounded-lg p-3">
                  <h3 className="font-medium text-gray-900 mb-1 text-sm">Police Check *</h3>
                  <DocumentUpload
                    label="Choose File"
                    description="PDF, JPG, PNG (10MB max)"
                    onUpload={(files) => {
                      if (files.length > 0) {
                        setDocumentFiles(prev => ({ ...prev, policeCheck: files[0] }));
                      }
                    }}
                    loading={uploadDocumentsMutation.isPending}
                    multiple={false}
                  />
                  {documentFiles.policeCheck && (
                    <div className="mt-1 p-1 bg-green-50 border border-green-200 rounded text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-green-700 flex items-center">
                          <Check className="h-3 w-3 mr-1" />
                          Selected
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDocumentFiles(prev => ({ ...prev, policeCheck: null }))}
                          className="h-5 w-5 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Insurance Certificate Upload */}
                <div className="border rounded-lg p-3">
                  <h3 className="font-medium text-gray-900 mb-1 text-sm">Insurance Certificate *</h3>
                  <DocumentUpload
                    label="Choose File"
                    description="PDF, JPG, PNG (10MB max)"
                    onUpload={(files) => {
                      if (files.length > 0) {
                        setDocumentFiles(prev => ({ ...prev, insuranceCertificate: files[0] }));
                      }
                    }}
                    loading={uploadDocumentsMutation.isPending}
                    multiple={false}
                  />
                  {documentFiles.insuranceCertificate && (
                    <div className="mt-1 p-1 bg-green-50 border border-green-200 rounded text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-green-700 flex items-center">
                          <Check className="h-3 w-3 mr-1" />
                          Selected
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDocumentFiles(prev => ({ ...prev, insuranceCertificate: null }))}
                          className="h-5 w-5 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(3)}
                >
                  Previous
                </Button>
                <Button 
                  onClick={handleDocumentUpload}
                  disabled={uploadDocumentsMutation.isPending}
                >
                  {uploadDocumentsMutation.isPending ? "Uploading..." : "Complete Registration"}
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
                  <strong>Please Remember:</strong> Our office hours are from<br/>
                  <strong>9 AM to 5 PM, Monday to Friday</strong>
                </p>
              </div>
              <Button onClick={() => navigate("/provider-login")}>
                Login Now
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
