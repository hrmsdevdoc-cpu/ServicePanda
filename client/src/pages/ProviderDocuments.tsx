import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload,
  ArrowLeft,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  X,
  Download
} from "lucide-react";

export default function ProviderDocuments() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  
  // File input refs
  const licenseFileRef = useRef<HTMLInputElement>(null);
  const policeCheckFileRef = useRef<HTMLInputElement>(null);
  const insuranceFileRef = useRef<HTMLInputElement>(null);

  // Fetch provider's existing documents
  const { data: documents = [], isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/provider/documents"],
    retry: false,
  });

  const uploadDocumentMutation = useMutation({
    mutationFn: async ({ file, documentType }: { file: File; documentType: string }) => {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', documentType);

      const res = await apiRequest("POST", "/api/provider/documents", formData);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/provider/documents"] });
      toast({
        title: "Document Uploaded",
        description: `${data.documentType} has been uploaded successfully.`,
      });
      setUploadProgress({});
    },
    onError: (error: any) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload document.",
        variant: "destructive",
      });
      setUploadProgress({});
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: number) => {
      await apiRequest("DELETE", `/api/provider/documents/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/provider/documents"] });
      toast({
        title: "Document Deleted",
        description: "Document has been removed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete document.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (documentType: string, file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF, JPG, or PNG file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadProgress({ [documentType]: 0 });
    uploadDocumentMutation.mutate({ file, documentType });
  };

  const getDocumentByType = (type: string) => {
    return documents.find((doc: any) => doc.documentType === type);
  };

  const getDocumentStatus = (type: string) => {
    const doc = getDocumentByType(type);
    if (!doc) return { status: 'missing', color: 'text-gray-400', bgColor: 'bg-gray-100' };
    
    switch (doc.verificationStatus?.toLowerCase()) {
      case 'approved':
        return { status: 'approved', color: 'text-green-600', bgColor: 'bg-green-100' };
      case 'rejected':
        return { status: 'rejected', color: 'text-red-600', bgColor: 'bg-red-100' };
      default:
        return { status: 'pending', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    }
  };

  const documentTypes = [
    {
      type: 'license',
      title: 'Business License',
      description: 'Valid business license or registration document',
      required: true,
    },
    {
      type: 'policeCheck',
      title: 'Police Check',
      description: 'Recent police clearance certificate (within 12 months)',
      required: true,
    },
    {
      type: 'insurance',
      title: 'Public Liability Insurance',
      description: 'Current public liability insurance certificate',
      required: true,
    },
  ];

  const allDocumentsUploaded = documentTypes.every(docType => getDocumentByType(docType.type));
  const allDocumentsApproved = documentTypes.every(docType => {
    const doc = getDocumentByType(docType.type);
    return doc && doc.verificationStatus?.toLowerCase() === 'approved';
  });

  if (documentsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading documents...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Document Verification</h1>
              <p className="text-lg text-gray-600 mt-2">
                Upload required documents for account verification
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              Step 4 of 4
            </Badge>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Registration Progress</span>
            <span>{allDocumentsUploaded ? '100' : '75'}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-red-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${allDocumentsUploaded ? 100 : 75}%` }}
            ></div>
          </div>
        </div>

        {/* Document Status Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Document Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {documentTypes.map((docType) => {
                const { status, color, bgColor } = getDocumentStatus(docType.type);
                const doc = getDocumentByType(docType.type);
                
                return (
                  <div key={docType.type} className={`p-4 rounded-lg border ${bgColor}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{docType.title}</h3>
                      <div className={`w-3 h-3 rounded-full ${
                        status === 'approved' ? 'bg-green-500' :
                        status === 'rejected' ? 'bg-red-500' :
                        status === 'pending' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <p className={`text-sm ${color} capitalize`}>
                      {status === 'missing' ? 'Not uploaded' : status}
                    </p>
                    {doc && (
                      <p className="text-xs text-gray-500 mt-1">
                        Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {allDocumentsApproved && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <div>
                    <h4 className="font-medium text-green-800">All Documents Approved!</h4>
                    <p className="text-sm text-green-700">
                      Your account is fully verified and ready to receive leads.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Document Upload Cards */}
        <div className="space-y-6">
          {documentTypes.map((docType) => {
            const doc = getDocumentByType(docType.type);
            const { status, color } = getDocumentStatus(docType.type);
            const isUploading = uploadProgress[docType.type] !== undefined;
            
            return (
              <Card key={docType.type}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        {docType.title}
                        {docType.required && <span className="text-red-500 ml-1">*</span>}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{docType.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {status === 'approved' && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {status === 'rejected' && <AlertCircle className="h-5 w-5 text-red-600" />}
                      {status === 'pending' && <AlertCircle className="h-5 w-5 text-yellow-600" />}
                      <Badge variant="outline" className={color}>
                        {status === 'missing' ? 'Required' : status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {doc ? (
                    <div className="space-y-4">
                      {/* Uploaded Document Info */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-gray-400" />
                          <div>
                            <p className="font-medium">{doc.fileName}</p>
                            <p className="text-sm text-gray-500">
                              Uploaded on {new Date(doc.createdAt).toLocaleDateString()}
                            </p>
                            {doc.verificationStatus === 'rejected' && doc.rejectionReason && (
                              <p className="text-sm text-red-600 mt-1">
                                Reason: {doc.rejectionReason}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`/uploads/${doc.filePath}`, '_blank')}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteDocumentMutation.mutate(doc.id)}
                            disabled={deleteDocumentMutation.isPending}
                          >
                            {deleteDocumentMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Re-upload option if rejected */}
                      {status === 'rejected' && (
                        <div className="pt-4 border-t">
                          <p className="text-sm text-gray-600 mb-3">Upload a new document to replace the rejected one:</p>
                          <Button
                            onClick={() => {
                              const fileRef = docType.type === 'license' ? licenseFileRef :
                                              docType.type === 'policeCheck' ? policeCheckFileRef :
                                              insuranceFileRef;
                              fileRef.current?.click();
                            }}
                            disabled={isUploading}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload New Document
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Upload Area */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                        <div className="space-y-4">
                          <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              Upload {docType.title}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                              Supported formats: PDF, JPG, PNG (Max 10MB)
                            </p>
                            <Button
                              onClick={() => {
                                const fileRef = docType.type === 'license' ? licenseFileRef :
                                                docType.type === 'policeCheck' ? policeCheckFileRef :
                                                insuranceFileRef;
                                fileRef.current?.click();
                              }}
                              disabled={isUploading}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {isUploading ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Choose File
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Upload Progress */}
                      {isUploading && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Uploading...</span>
                            <span>{uploadProgress[docType.type]}%</span>
                          </div>
                          <Progress value={uploadProgress[docType.type]} className="w-full" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hidden File Inputs */}
                  <input
                    type="file"
                    ref={docType.type === 'license' ? licenseFileRef :
                         docType.type === 'policeCheck' ? policeCheckFileRef :
                         insuranceFileRef}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileSelect(docType.type, file);
                      }
                      e.target.value = '';
                    }}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Completion Status */}
        <div className="mt-8 text-center">
          {allDocumentsUploaded ? (
            <div className="space-y-4">
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 mb-2">
                  Registration Complete!
                </h3>
                <p className="text-blue-800">
                  All required documents have been uploaded. Our team will review them within 1-2 business days.
                  You'll receive an email notification once your account is approved.
                </p>
              </div>
              <Button
                onClick={() => navigate("/provider-dashboard")}
                className="bg-red-600 hover:bg-red-700"
              >
                Return to Dashboard
              </Button>
            </div>
          ) : (
            <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-yellow-900 mb-2">
                Complete Your Registration
              </h3>
              <p className="text-yellow-800">
                Please upload all required documents to complete your provider registration.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}