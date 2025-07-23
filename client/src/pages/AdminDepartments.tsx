import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Edit, Plus, Building2 } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { adminApiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Department {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDepartments() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  // Fetch departments
  const { data: departments = [], isLoading } = useQuery({
    queryKey: ["/api/admin/departments"],
    queryFn: async () => {
      const response = await adminApiRequest("GET", "/api/admin/departments");
      return await response.json();
    },
  });

  // Add department mutation
  const addDepartmentMutation = useMutation({
    mutationFn: async (departmentData: { name: string }) => {
      const response = await adminApiRequest("POST", "/api/admin/departments", departmentData);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/departments"] });
      toast({
        title: "Success",
        description: "Department added successfully",
      });
      setIsAddDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add department",
        variant: "destructive",
      });
    },
  });

  // Update department mutation
  const updateDepartmentMutation = useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      const response = await adminApiRequest("PUT", `/api/admin/departments/${id}`, { name });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/departments"] });
      toast({
        title: "Success",
        description: "Department updated successfully",
      });
      setIsEditDialogOpen(false);
      setEditingDepartment(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update department",
        variant: "destructive",
      });
    },
  });

  // Delete department mutation
  const deleteDepartmentMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await adminApiRequest("DELETE", `/api/admin/departments/${id}`);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/departments"] });
      toast({
        title: "Success",
        description: "Department deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete department",
        variant: "destructive",
      });
    },
  });

  // Filter departments
  const filteredDepartments = departments.filter((dept: Department) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    // Redirect to admin login
    window.location.href = '/admin-login';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
              <p className="text-gray-600 mt-1">Manage organizational departments</p>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Department
                </Button>
              </DialogTrigger>
              <AddDepartmentDialog 
                onSubmit={(name) => addDepartmentMutation.mutate({ name })}
                isLoading={addDepartmentMutation.isPending}
              />
            </Dialog>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <Input
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredDepartments.map((department: Department) => (
                <Card key={department.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{department.name}</h3>
                          <p className="text-sm text-gray-500">
                            Created {new Date(department.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Dialog open={isEditDialogOpen && editingDepartment?.id === department.id} onOpenChange={(open) => {
                          setIsEditDialogOpen(open);
                          if (!open) setEditingDepartment(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingDepartment(department)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <EditDepartmentDialog
                            department={editingDepartment}
                            onSubmit={(name) => updateDepartmentMutation.mutate({ id: department.id, name })}
                            isLoading={updateDepartmentMutation.isPending}
                          />
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this department?")) {
                              deleteDepartmentMutation.mutate(department.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredDepartments.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
                  <p className="text-gray-600">
                    {searchTerm ? "Try adjusting your search." : "Get started by adding your first department."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AddDepartmentDialog({ onSubmit, isLoading }: {
  onSubmit: (name: string) => void;
  isLoading: boolean;
}) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      setName("");
    }
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Add New Department</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="department-name">Department Name</Label>
          <Input
            id="department-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter department name"
            required
          />
        </div>
        <Button type="submit" disabled={isLoading || !name.trim()} className="w-full">
          {isLoading ? "Adding..." : "Add Department"}
        </Button>
      </form>
    </DialogContent>
  );
}

function EditDepartmentDialog({ department, onSubmit, isLoading }: {
  department: Department | null;
  onSubmit: (name: string) => void;
  isLoading: boolean;
}) {
  const [name, setName] = useState(department?.name || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  if (!department) return null;

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Edit Department</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="edit-department-name">Department Name</Label>
          <Input
            id="edit-department-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter department name"
            required
          />
        </div>
        <Button type="submit" disabled={isLoading || !name.trim()} className="w-full">
          {isLoading ? "Updating..." : "Update Department"}
        </Button>
      </form>
    </DialogContent>
  );
}