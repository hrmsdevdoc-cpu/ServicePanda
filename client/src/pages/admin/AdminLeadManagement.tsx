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
  active: boolean;
  popular: boolean;
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
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    icon: 'home',
    active: true,
    popular: false,
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
    onSuccess: () => {
      toast({
        title: "Service Type Created",
        description: "New service type has been created successfully.",
      });
      setIsAddDialogOpen(false);
      setNewCategory({
        name: '',
        description: '',
        icon: 'home',
        active: true,
        popular: false,
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

  const handleCreateCategory = () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Service type name is required",
        variant: "destructive",
      });
      return;
    }
         createCategoryMutation.mutate(newCategory);
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
      },
    });
  };

  const handleDeleteCategory = () => {
    if (!deleteCategory) return;
    deleteCategoryMutation.mutate(deleteCategory.id);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <AdminSidebar onLogout={() => {}} />
      <div className="flex-1 p-8 space-y-6">
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
                        <div className="flex items-center gap-2">
                          {(() => {
                            const IconComponent = getIconComponent(category.icon);
                            return <IconComponent className="h-4 w-4" />;
                          })()}
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