import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useMutation, queryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check, X } from "lucide-react";
import { DocumentUpload } from "@/components/DocumentUpload";

export default function ProviderDocuments() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Document upload state - same as registration
  const [documentFiles, setDocumentFiles] = useState({
    license: null as File | null,
    policeCheck: null as File | null,
    insuranceCertificate: null as File | null,
  });

  const uploadDocumentsMutation = useMutation({
    mutationFn: async (documents: { license?: File; policeCheck?: File; insuranceCertificate?: File }) => {
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
      
      // Get provider ID from localStorage (same as registration)
      const providerId = localStorage.getItem('providerId');
      if (!providerId) {
        throw new Error("Provider information not found.");
      }
      
      await apiRequest("POST", `/api/service-providers/${providerId}/documents`, formData);
    },
    onSuccess: () => {
      toast({
        title: "Documents Updated!",
        description: "Your documents have been uploaded successfully.",
        variant: "default",
      });
      
      // Reset form
      setDocumentFiles({
        license: null,
        policeCheck: null,
        insuranceCertificate: null,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload documents.",
        variant: "destructive",
      });
    },
  });

  const handleDocumentUpload = () => {
    // Check if at least one document is uploaded
    const hasDocuments = documentFiles.license || documentFiles.policeCheck || documentFiles.insuranceCertificate;
    
    if (!hasDocuments) {
      toast({
        title: "No Documents Selected",
        description: "Please select at least one document to upload.",
        variant: "destructive",
      });
      return;
    }

    uploadDocumentsMutation.mutate(documentFiles);
  };

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
            <h1 className="text-3xl font-bold text-gray-900">Upload Documents</h1>
            <p className="text-lg text-gray-600 mt-2">
              Upload all three required documents for verification (all mandatory)
            </p>
          </div>
        </div>

        {/* Exact replication of Step 4 from registration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              <h2 className="text-2xl font-bold mb-2">Upload Documents</h2>
              <p className="text-gray-600 font-normal">
                Upload all three required documents for verification (all mandatory)
              </p>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Compact document upload sections */}
            <div className="grid md:grid-cols-1 gap-4">
              {/* License Document Upload */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">License Document *</h3>
                <p className="text-sm text-gray-600 mb-3">Business license or professional certification (Required)</p>
                <DocumentUpload
                  label="Choose License File"
                  description="PDF, JPG, PNG supported (Max 10MB)"
                  onUpload={(files) => {
                    if (files.length > 0) {
                      setDocumentFiles(prev => ({ ...prev, license: files[0] }));
                    }
                  }}
                  loading={uploadDocumentsMutation.isPending}
                  multiple={false}
                />
                {documentFiles.license && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-green-700 flex items-center">
                        <Check className="h-4 w-4 mr-1" />
                        {documentFiles.license.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDocumentFiles(prev => ({ ...prev, license: null }))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Police Check Document Upload */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Police Check *</h3>
                <p className="text-sm text-gray-600 mb-3">Police check certificate (Required)</p>
                <DocumentUpload
                  label="Choose Police Check File"
                  description="PDF, JPG, PNG supported (Max 10MB)"
                  onUpload={(files) => {
                    if (files.length > 0) {
                      setDocumentFiles(prev => ({ ...prev, policeCheck: files[0] }));
                    }
                  }}
                  loading={uploadDocumentsMutation.isPending}
                  multiple={false}
                />
                {documentFiles.policeCheck && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-green-700 flex items-center">
                        <Check className="h-4 w-4 mr-1" />
                        {documentFiles.policeCheck.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDocumentFiles(prev => ({ ...prev, policeCheck: null }))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Insurance Certificate Upload */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Insurance Certificate *</h3>
                <p className="text-sm text-gray-600 mb-3">Public liability insurance certificate (Required)</p>
                <DocumentUpload
                  label="Choose Insurance File"
                  description="PDF, JPG, PNG supported (Max 10MB)"
                  onUpload={(files) => {
                    if (files.length > 0) {
                      setDocumentFiles(prev => ({ ...prev, insuranceCertificate: files[0] }));
                    }
                  }}
                  loading={uploadDocumentsMutation.isPending}
                  multiple={false}
                />
                {documentFiles.insuranceCertificate && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-green-700 flex items-center">
                        <Check className="h-4 w-4 mr-1" />
                        {documentFiles.insuranceCertificate.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDocumentFiles(prev => ({ ...prev, insuranceCertificate: null }))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Upload button at bottom */}
            <div className="flex justify-end">
              <Button 
                onClick={handleDocumentUpload}
                disabled={uploadDocumentsMutation.isPending}
                className="bg-primary hover:bg-primary/90"
              >
                {uploadDocumentsMutation.isPending ? "Uploading..." : "Upload Documents"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}