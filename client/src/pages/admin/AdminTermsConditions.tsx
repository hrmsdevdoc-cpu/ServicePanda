import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save, FileText, Users, Globe, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useLocation } from "wouter";

const termsSchema = z.object({
  providersTerms: z.string().min(10, "Terms must be at least 10 characters long"),
  customersTerms: z.string().min(10, "Terms must be at least 10 characters long"),
  websiteTerms: z.string().min(10, "Terms must be at least 10 characters long"),
});

type TermsFormData = z.infer<typeof termsSchema>;

export default function AdminTermsConditions() {
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Check admin authentication
  useState(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin-login');
    }
  });

  // Fetch current terms and conditions
  const { data: terms, isLoading } = useQuery({
    queryKey: ["/api/admin/terms-conditions"],
    retry: false,
  });

  const form = useForm<TermsFormData>({
    resolver: zodResolver(termsSchema),
    defaultValues: {
      providersTerms: "",
      customersTerms: "",
      websiteTerms: "",
    },
  });

  const updateTermsMutation = useMutation({
    mutationFn: async (data: TermsFormData) => {
      const response = await apiRequest("PUT", "/api/admin/terms-conditions", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/terms-conditions"] });
      toast({
        title: "Terms Updated",
        description: "Terms and conditions have been successfully updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TermsFormData) => {
    updateTermsMutation.mutate(data);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading terms and conditions...</div>
      </div>
    );
  }

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
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Terms & Conditions
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Manage terms and conditions for different user types
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-8 py-8">
          <Tabs defaultValue="providers" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="providers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Providers T&C
              </TabsTrigger>
              <TabsTrigger value="customers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Customers T&C
              </TabsTrigger>
              <TabsTrigger value="website" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Website T&C
              </TabsTrigger>
            </TabsList>

            <TabsContent value="providers" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Service Providers Terms & Conditions
                  </CardTitle>
                  <CardDescription>
                    Terms and conditions that service providers must agree to when registering and using the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      These terms will be displayed to service providers during registration and can be updated at any time.
                    </AlertDescription>
                  </Alert>

                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="providersTerms">Providers Terms & Conditions</Label>
                      <Textarea
                        {...form.register("providersTerms")}
                        placeholder="Enter terms and conditions for service providers..."
                        className="min-h-[400px]"
                        defaultValue={terms?.providersTerms || ""}
                      />
                      {form.formState.errors.providersTerms && (
                        <p className="text-sm text-red-600">
                          {form.formState.errors.providersTerms.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-500">
                        Last updated: {terms?.providersUpdatedAt ? new Date(terms.providersUpdatedAt).toLocaleDateString() : 'Never'}
                      </div>
                      <Button 
                        type="submit" 
                        disabled={updateTermsMutation.isPending}
                        className="flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {updateTermsMutation.isPending ? "Saving..." : "Save Providers Terms"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customers" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Customer Terms & Conditions
                  </CardTitle>
                  <CardDescription>
                    Terms and conditions that customers must agree to when using the platform to request services.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      These terms will be displayed to customers during service requests and can be updated at any time.
                    </AlertDescription>
                  </Alert>

                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="customersTerms">Customer Terms & Conditions</Label>
                      <Textarea
                        {...form.register("customersTerms")}
                        placeholder="Enter terms and conditions for customers..."
                        className="min-h-[400px]"
                        defaultValue={terms?.customersTerms || ""}
                      />
                      {form.formState.errors.customersTerms && (
                        <p className="text-sm text-red-600">
                          {form.formState.errors.customersTerms.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-500">
                        Last updated: {terms?.customersUpdatedAt ? new Date(terms.customersUpdatedAt).toLocaleDateString() : 'Never'}
                      </div>
                      <Button 
                        type="submit" 
                        disabled={updateTermsMutation.isPending}
                        className="flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {updateTermsMutation.isPending ? "Saving..." : "Save Customer Terms"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="website" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Website Terms & Conditions
                  </CardTitle>
                  <CardDescription>
                    General terms and conditions for the website that apply to all users and visitors.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      These terms apply to all website visitors and can be displayed on the main website.
                    </AlertDescription>
                  </Alert>

                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="websiteTerms">Website Terms & Conditions</Label>
                      <Textarea
                        {...form.register("websiteTerms")}
                        placeholder="Enter general website terms and conditions..."
                        className="min-h-[400px]"
                        defaultValue={terms?.websiteTerms || ""}
                      />
                      {form.formState.errors.websiteTerms && (
                        <p className="text-sm text-red-600">
                          {form.formState.errors.websiteTerms.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-500">
                        Last updated: {terms?.websiteUpdatedAt ? new Date(terms.websiteUpdatedAt).toLocaleDateString() : 'Never'}
                      </div>
                      <Button 
                        type="submit" 
                        disabled={updateTermsMutation.isPending}
                        className="flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {updateTermsMutation.isPending ? "Saving..." : "Save Website Terms"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 