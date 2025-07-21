import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, User } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import ProviderSidebar from "@/components/ProviderSidebar";
import { AddressInput } from "@/components/AddressInput";

interface Provider {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address: string;
  businessName?: string;
  businessAbn?: string;
  status: string;
}

export default function ProviderPersonalDetails() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    address: "",
    businessName: "",
    businessAbn: "",
  });
  const [hasChanges, setHasChanges] = useState(false);
  
  // Sidebar state for complex ProviderSidebar component
  const [activeMenuItem, setActiveMenuItem] = useState("Personal Details");
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["settings"]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get provider profile
  const { data: provider, isLoading } = useQuery<Provider>({
    queryKey: ["/api/provider/profile"],
    retry: false,
  });

  // Update form when provider data loads
  useEffect(() => {
    if (provider) {
      const newFormData = {
        firstName: provider.firstName || "",
        lastName: provider.lastName || "",
        mobileNumber: provider.mobileNumber || "",
        address: provider.address || "",
        businessName: provider.businessName || "",
        businessAbn: provider.businessAbn || "",
      };
      setFormData(newFormData);
    }
  }, [provider]);

  // Track form changes
  useEffect(() => {
    if (provider) {
      const hasChanged = 
        formData.firstName !== (provider.firstName || "") ||
        formData.lastName !== (provider.lastName || "") ||
        formData.mobileNumber !== (provider.mobileNumber || "") ||
        formData.address !== (provider.address || "") ||
        formData.businessName !== (provider.businessName || "") ||
        formData.businessAbn !== (provider.businessAbn || "");
      setHasChanges(hasChanged);
    }
  }, [formData, provider]);

  // Update provider mutation
  const updateProviderMutation = useMutation({
    mutationFn: async (data: Partial<Provider>) => {
      const providerId = localStorage.getItem('providerId');
      if (!providerId) {
        throw new Error('Provider ID not found');
      }
      
      const response = await apiRequest("PUT", `/api/provider/${providerId}/profile`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/provider/profile"] });
      toast({
        title: "Profile Updated",
        description: "Your personal details have been updated successfully.",
        variant: "default",
      });
      setHasChanges(false);
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const errors = [];
    
    if (!formData.firstName.trim()) {
      errors.push("First name is required");
    }
    
    if (!formData.lastName.trim()) {
      errors.push("Last name is required");
    }
    
    if (!formData.mobileNumber.trim()) {
      errors.push("Mobile number is required");
    } else if (!/^(\+61|0)[2-9]\d{8}$/.test(formData.mobileNumber.replace(/[\s\-\(\)]/g, ''))) {
      errors.push("Please enter a valid Australian mobile number");
    }
    
    if (!formData.address.trim()) {
      errors.push("Address is required");
    }

    if (errors.length > 0) {
      toast({
        title: "Please fix the following errors:",
        description: errors.join(", "),
        variant: "destructive",
      });
      return;
    }

    updateProviderMutation.mutate({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      mobileNumber: formData.mobileNumber.trim(),
      address: formData.address.trim(),
      businessName: formData.businessName.trim() || null,
      businessAbn: formData.businessAbn.trim() || null,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <ProviderSidebar 
          activeMenuItem={activeMenuItem}
          setActiveMenuItem={setActiveMenuItem}
          expandedMenus={expandedMenus}
          setExpandedMenus={setExpandedMenus}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          newLeadsCount={0}
          provider={null}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="flex h-screen bg-gray-50">
        <ProviderSidebar 
          activeMenuItem={activeMenuItem}
          setActiveMenuItem={setActiveMenuItem}
          expandedMenus={expandedMenus}
          setExpandedMenus={setExpandedMenus}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          newLeadsCount={0}
          provider={null}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Unable to load profile data.</p>
            <Button onClick={() => navigate("/provider-login")}>
              Login Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <ProviderSidebar 
        activeMenuItem={activeMenuItem}
        setActiveMenuItem={setActiveMenuItem}
        expandedMenus={expandedMenus}
        setExpandedMenus={setExpandedMenus}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        newLeadsCount={0}
        provider={provider}
      />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <User className="h-6 w-6 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Personal Details</h1>
            </div>
            <p className="text-gray-600">Update your personal information and business details</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Name Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                {/* Email (Read-only) */}
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={provider.email}
                    disabled
                    className="bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Email cannot be changed. Please contact support if you need to update your email.
                  </p>
                </div>

                {/* Mobile Number */}
                <div>
                  <Label htmlFor="mobileNumber">Mobile Number *</Label>
                  <Input
                    id="mobileNumber"
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                    placeholder="Enter your mobile number (e.g., 0412 345 678)"
                  />
                </div>

                {/* Address */}
                <div>
                  <AddressInput
                    value={formData.address}
                    onChange={(address) => handleInputChange("address", address)}
                    label="Business Address *"
                    placeholder="Start typing your business address..."
                    required
                  />
                </div>

                {/* Business Details */}
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Business Details</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange("businessName", e.target.value)}
                        placeholder="Enter your business name (optional)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessAbn">Business ABN/ACN</Label>
                      <Input
                        id="businessAbn"
                        value={formData.businessAbn}
                        onChange={(e) => handleInputChange("businessAbn", e.target.value)}
                        placeholder="Enter your ABN or ACN (optional)"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/provider-dashboard")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!hasChanges || updateProviderMutation.isPending}
                    className="flex items-center"
                  >
                    {updateProviderMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}