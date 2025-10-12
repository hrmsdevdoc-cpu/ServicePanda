import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { adminApiRequest } from "@/lib/adminAuth";
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
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
  Snowflake,
  Paintbrush,
  Truck,
  Shield,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  X,
} from "lucide-react";

// Service icons mapping
const serviceIcons = {
  'home': Home,
  'key': Sparkles,
  'sofa': Home,
  'bug': Bug,
  'sprout': TreePine,
  'truck': Car,
  'wrench': Hammer,
  'zap': Zap,
  'snowflake': Snowflake,
  'paintbrush': Paintbrush,
  'droplets': Droplets,
  'sparkles': Sparkles,
  'building': Building,
  'shield': Shield,
  'car': Car,
  'hammer': Hammer,
  'treepine': TreePine,
};

interface ServiceCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  imageUrl?: string;
  active: boolean;
  popular: boolean;
  trending: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminLeadManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<ServiceCategory | null>(null);
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    icon: 'home',
    imageFile: null as File | null,
    active: true,
    popular: false,
    trending: false,
  });

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin-login');
    }
  }, [navigate]);

  // Fetch service categories
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['/api/admin/service-categories'],
    queryFn: async () => {
      console.log('Fetching service categories...');
      const response = await adminApiRequest('GET', '/api/admin/service-categories');
      const data = await response.json();
      console.log('Service categories response:', data);
      return data;
    },
  });

  // Create service category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (category: any) => {
      const response = await adminApiRequest('POST', '/api/admin/service-categories', category);
      return response.json();
    },
    onSuccess: async (data) => {
      // If there's an image file, upload it after category creation
      if (newCategory.imageFile) {
        try {
          console.log('Starting image upload for category ID:', data.id);
          console.log('Image file:', newCategory.imageFile);
          setUploadingImage(data.id);
          
          // Show uploading message
          toast({
            title: "Uploading Image",
            description: "Please wait while the image is being uploaded...",
          });
          
          // Upload image directly using fetch
          const formData = new FormData();
          formData.append('image', newCategory.imageFile);
          
          console.log('FormData created, sending request...');
          const uploadResponse = await fetch(`/api/admin/service-categories/${data.id}/image`, {
            method: 'POST',
            headers: {
              'x-admin-token': localStorage.getItem('adminToken') || '',
            },
            body: formData,
          });
          
          console.log('Upload response status:', uploadResponse.status);
          console.log('Upload response:', uploadResponse);
          
          if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            console.error('Upload error response:', errorText);
            throw new Error(`Failed to upload image: ${uploadResponse.status} - ${errorText}`);
          }
          
          const result = await uploadResponse.json();
          console.log('Image uploaded successfully:', result);
          
          // Show success message for image upload
          toast({
            title: "Image Uploaded Successfully",
            description: "Service type and image have been created successfully.",
          });
        } catch (error) {
          console.error('Image upload failed:', error);
          toast({
            title: "Image Upload Failed",
            description: "Service type created but image upload failed. You can upload it later.",
            variant: "destructive",
          });
        } finally {
          setUploadingImage(null);
        }
      } else {
        // No image file, just show success message
        toast({
          title: "Service Type Created",
          description: "New service type has been created successfully.",
        });
      }
      
      setIsAddDialogOpen(false);
      setNewCategory({
        name: '',
        description: '',
        icon: 'home',
        imageFile: null,
        active: true,
        popular: false,
        trending: false,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/service-categories'] });
    },
    onError: (error: any) => {
      console.error('Create category error:', error);
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create service type",
        variant: "destructive",
      });
    },
  });

   // Update service category mutation
   const updateCategoryMutation = useMutation({
     mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
       const response = await adminApiRequest('PUT', `/api/admin/service-categories/${id}`, updates);
       return response.json();
     },
     onSuccess: () => {
       toast({
         title: "Service Type Updated",
         description: "Service type has been updated successfully.",
       });
       setEditingCategory(null);
       queryClient.invalidateQueries({ queryKey: ['/api/admin/service-categories'] });
     },
     onError: (error: any) => {
       console.error('Update category error:', error);
       toast({
         title: "Update Failed",
         description: error.message || "Failed to update service type",
         variant: "destructive",
       });
     },
   });

   // Delete service category mutation
   const deleteCategoryMutation = useMutation({
     mutationFn: async (id: number) => {
       const response = await adminApiRequest('DELETE', `/api/admin/service-categories/${id}`);
       return response.json();
     },
     onSuccess: () => {
       toast({
         title: "Service Type Deleted",
         description: "Service type has been deleted successfully.",
       });
       setDeleteCategory(null);
       queryClient.invalidateQueries({ queryKey: ['/api/admin/service-categories'] });
     },
    onError: (error: any) => {
      console.error('Delete category error:', error);
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to delete service type",
        variant: "destructive",
      });
    },
  });

  // Image upload mutation
  const uploadImageMutation = useMutation({
    mutationFn: async ({ categoryId, file }: { categoryId: number; file: File }) => {
      console.log('Uploading image for category ID:', categoryId);
      console.log('File:', file);
      
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`/api/admin/service-categories/${categoryId}/image`, {
        method: 'POST',
        headers: {
          'x-admin-token': localStorage.getItem('adminToken') || '',
        },
        body: formData,
      });
      
      console.log('Upload response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload error response:', errorText);
        throw new Error(`Failed to upload image: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Upload successful:', result);
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Image Uploaded Successfully",
        description: "Service type image has been uploaded successfully.",
      });
      setUploadingImage(null);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/service-categories'] });
    },
    onError: (error: any) => {
      console.error('Image upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
      setUploadingImage(null);
    },
  });

  const handleCreateCategory = () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Service type name is required",
        variant: "destructive",
      });
      return;
    }
    
    console.log('Creating category with data:', newCategory);
    console.log('Image file:', newCategory.imageFile);
    
    // Extract imageFile and send the rest of the data
    const { imageFile, ...categoryData } = newCategory;
    createCategoryMutation.mutate(categoryData);
  };

  const handleUpdateCategory = () => {
    if (!editingCategory) return;
    if (!editingCategory.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Service type name is required",
        variant: "destructive",
      });
      return;
    }
    updateCategoryMutation.mutate({
      id: editingCategory.id,
      updates: {
        name: editingCategory.name,
        description: editingCategory.description,
        icon: editingCategory.icon,
        active: editingCategory.active,
        popular: editingCategory.popular,
        trending: editingCategory.trending,
      },
    });
  };

  const handleDeleteCategory = () => {
    if (!deleteCategory) return;
    deleteCategoryMutation.mutate(deleteCategory.id);
  };

  const handleImageUpload = (categoryId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (PNG, JPG, JPEG)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingImage(categoryId);
    uploadImageMutation.mutate({ categoryId, file });
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = serviceIcons[iconName as keyof typeof serviceIcons];
    return IconComponent || Home;
  };

     if (categoriesLoading) {
     return (
       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
         <div className="text-lg">Loading...</div>
       </div>
     );
   }

   if (categoriesError) {
     console.error('Categories error:', categoriesError);
     return (
       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
         <div className="text-lg text-red-500">Error loading service types: {categoriesError.message}</div>
       </div>
     );
   }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 flex relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(156, 146, 172, 0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      {/* Subtle Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-blue-100/20 pointer-events-none"></div>
      {/* Sidebar */}
      <div className="relative z-20">
        <AdminSidebar onLogout={() => {}} />
      </div>
      <div className="flex-1 overflow-y-auto relative z-10 p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Service Type</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage service types dynamically
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Service Types Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Service Types Management
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Service Type
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Service Type</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Service Type Name</Label>
                        <Input
                          id="name"
                          value={newCategory.name}
                          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                          placeholder="e.g., Domestic Cleaning"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newCategory.description}
                          onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                          placeholder="Brief description of the service"
                        />
                      </div>
                      <div>
                        <Label htmlFor="icon">Icon</Label>
                        <select
                          id="icon"
                          value={newCategory.icon}
                          onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="home">Home</option>
                          <option value="key">Key (Bond Cleaning)</option>
                          <option value="sofa">Sofa (Carpet Cleaning)</option>
                          <option value="bug">Bug (Pest Control)</option>
                          <option value="sprout">Sprout (Gardening)</option>
                          <option value="truck">Truck (Removals)</option>
                          <option value="wrench">Wrench (Handyman)</option>
                          <option value="zap">Zap (Electrical)</option>
                          <option value="snowflake">Snowflake (Air Conditioning)</option>
                          <option value="paintbrush">Paintbrush (Painting)</option>
                          <option value="droplets">Droplets (Plumbing)</option>
                          <option value="sparkles">Sparkles (Cleaning)</option>
                          <option value="building">Building (Office Cleaning)</option>
                          <option value="shield">Shield (Security)</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="image">Service Image (Optional)</Label>
                        <div className="mt-2">
                          <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              console.log('File selected:', file);
                              console.log('File type:', file?.type);
                              console.log('File size:', file?.size);
                              if (file) {
                                // Validate file type
                                if (!file.type.startsWith('image/')) {
                                  toast({
                                    title: "Invalid File Type",
                                    description: "Please select an image file (PNG, JPG, JPEG)",
                                    variant: "destructive",
                                  });
                                  return;
                                }

                                // Validate file size (10MB limit)
                                if (file.size > 10 * 1024 * 1024) {
                                  toast({
                                    title: "File Too Large",
                                    description: "Please select an image smaller than 10MB",
                                    variant: "destructive",
                                  });
                                  return;
                                }

                                // Store the file for later upload after category creation
                                setNewCategory({ ...newCategory, imageFile: file });
                                console.log('Image file set in state');
                                
                                // Show success message for file selection
                                toast({
                                  title: "Image Selected",
                                  description: `${file.name} is ready to upload`,
                                });
                              }
                            }}
                            className="hidden"
                          />
                          <label
                            htmlFor="image"
                            className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                              newCategory.imageFile 
                                ? 'border-green-400 bg-green-50 hover:border-green-500' 
                                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                            }`}
                          >
                            <div className="text-center">
                              <Upload className={`h-8 w-8 mx-auto mb-2 ${
                                newCategory.imageFile ? 'text-green-500' : 'text-gray-400'
                              }`} />
                              <p className={`text-sm ${
                                newCategory.imageFile ? 'text-green-700 font-medium' : 'text-gray-600'
                              }`}>
                                {newCategory.imageFile ? newCategory.imageFile.name : 'Click to upload image'}
                              </p>
                              <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                              {newCategory.imageFile && (
                                <p className="text-xs text-green-600 mt-1">✓ Ready to upload</p>
                              )}
                            </div>
                          </label>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Active</Label>
                        <Switch
                          checked={newCategory.active}
                          onCheckedChange={(checked) => setNewCategory({ ...newCategory, active: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Popular</Label>
                        <Switch
                          checked={newCategory.popular}
                          onCheckedChange={(checked) => setNewCategory({ ...newCategory, popular: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Trending</Label>
                        <Switch
                          checked={newCategory.trending}
                          onCheckedChange={(checked) => setNewCategory({ ...newCategory, trending: checked })}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleCreateCategory}
                          disabled={createCategoryMutation.isPending}
                          className="flex-1"
                        >
                          {createCategoryMutation.isPending ? "Creating..." : "Create Service Type"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsAddDialogOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
                         <CardContent>
               <div className="space-y-4">
                 {!Array.isArray(categories) ? (
                   <div className="text-center py-8 text-gray-500">
                     <Wrench className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                     <p>Error loading service types</p>
                     <p className="text-sm">Please refresh the page</p>
                   </div>
                 ) : categories.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Wrench className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No service types found</p>
                    <p className="text-sm">Click "Add Service Type" to create your first service type</p>
                  </div>
                ) : (
                  categories.map((category: ServiceCategory) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {/* Image or Icon */}
                        <div className="flex items-center gap-2">
                          {category.imageUrl ? (
                            <img
                              src={category.imageUrl}
                              alt={category.name}
                              className="h-8 w-8 rounded object-cover"
                            />
                          ) : (
                            (() => {
                              const IconComponent = getIconComponent(category.icon);
                              return <IconComponent className="h-4 w-4" />;
                            })()
                          )}
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="flex gap-1">
                          {category.active ? (
                            <Badge variant="default" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </Badge>
                          )}
                          {category.popular && (
                            <Badge variant="outline" className="text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {/* Image Upload Button */}
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(category.id, e)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={uploadingImage === category.id}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={uploadingImage === category.id}
                            className="relative"
                          >
                            {uploadingImage === category.id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                            ) : (
                              <ImageIcon className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteCategory(category)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Category Dialog */}
        <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Service Type</DialogTitle>
            </DialogHeader>
            {editingCategory && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Service Type Name</Label>
                  <Input
                    id="edit-name"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingCategory.description}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-icon">Icon</Label>
                  <select
                    id="edit-icon"
                    value={editingCategory.icon}
                    onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="home">Home</option>
                    <option value="key">Key (Bond Cleaning)</option>
                    <option value="sofa">Sofa (Carpet Cleaning)</option>
                    <option value="bug">Bug (Pest Control)</option>
                    <option value="sprout">Sprout (Gardening)</option>
                    <option value="truck">Truck (Removals)</option>
                    <option value="wrench">Wrench (Handyman)</option>
                    <option value="zap">Zap (Electrical)</option>
                    <option value="snowflake">Snowflake (Air Conditioning)</option>
                    <option value="paintbrush">Paintbrush (Painting)</option>
                    <option value="droplets">Droplets (Plumbing)</option>
                    <option value="sparkles">Sparkles (Cleaning)</option>
                    <option value="building">Building (Office Cleaning)</option>
                    <option value="shield">Shield (Security)</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="edit-image">Service Image</Label>
                  <div className="mt-2">
                    {editingCategory.imageUrl && (
                      <div className="mb-2">
                        <img
                          src={editingCategory.imageUrl}
                          alt={editingCategory.name}
                          className="h-16 w-16 rounded object-cover"
                        />
                      </div>
                    )}
                    <input
                      id="edit-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        console.log('Edit dialog - File selected:', file);
                        if (file) {
                          // Validate file type
                          if (!file.type.startsWith('image/')) {
                            toast({
                              title: "Invalid File Type",
                              description: "Please select an image file (PNG, JPG, JPEG)",
                              variant: "destructive",
                            });
                            return;
                          }

                          // Validate file size (10MB limit)
                          if (file.size > 10 * 1024 * 1024) {
                            toast({
                              title: "File Too Large",
                              description: "Please select an image smaller than 10MB",
                              variant: "destructive",
                            });
                            return;
                          }

                          // Show success message for file selection
                          toast({
                            title: "Image Selected",
                            description: `${file.name} is ready to upload`,
                          });

                          handleImageUpload(editingCategory.id, e);
                        }
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="edit-image"
                      className={`flex items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        uploadingImage === editingCategory.id 
                          ? 'border-blue-400 bg-blue-50' 
                          : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-center">
                        <Upload className={`h-6 w-6 mx-auto mb-1 ${
                          uploadingImage === editingCategory.id ? 'text-blue-500' : 'text-gray-400'
                        }`} />
                        <p className={`text-xs ${
                          uploadingImage === editingCategory.id ? 'text-blue-700' : 'text-gray-600'
                        }`}>
                          {uploadingImage === editingCategory.id ? 'Uploading...' : 'Click to upload new image'}
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Active</Label>
                  <Switch
                    checked={editingCategory.active}
                    onCheckedChange={(checked) => setEditingCategory({ ...editingCategory, active: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Popular</Label>
                  <Switch
                    checked={editingCategory.popular}
                    onCheckedChange={(checked) => setEditingCategory({ ...editingCategory, popular: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Trending</Label>
                  <Switch
                    checked={editingCategory.trending}
                    onCheckedChange={(checked) => setEditingCategory({ ...editingCategory, trending: checked })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleUpdateCategory}
                    disabled={updateCategoryMutation.isPending}
                    className="flex-1"
                  >
                    {updateCategoryMutation.isPending ? "Updating..." : "Update Service Type"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingCategory(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteCategory} onOpenChange={() => setDeleteCategory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Delete Service Type
              </DialogTitle>
            </DialogHeader>
            {deleteCategory && (
              <div className="space-y-4">
                <p>
                  Are you sure you want to delete the service type "{deleteCategory.name}"? This action cannot be undone.
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleDeleteCategory}
                    disabled={deleteCategoryMutation.isPending}
                    variant="destructive"
                    className="flex-1"
                  >
                    {deleteCategoryMutation.isPending ? "Deleting..." : "Delete Service Type"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteCategory(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 