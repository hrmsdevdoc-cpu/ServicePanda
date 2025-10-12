import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdminSidebar } from '@/components/AdminSidebar';
import { adminApiRequest } from '@/lib/adminAuth';
import { 
  Shield, 
  Users, 
  UserCheck, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Eye,
  EyeOff
} from 'lucide-react';

interface Permission {
  id: number;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: number[];
  userCount: number;
  isDefault?: boolean;
}

const AdminRolePermissions: React.FC = () => {
  const [activeTab, setActiveTab] = useState('roles');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);
  const [savingPermission, setSavingPermission] = useState<number | null>(null);

  // Fetch current admin user data
  const { data: currentAdminUser } = useQuery({
    queryKey: ['adminUser'],
    queryFn: async () => {
      const response = await adminApiRequest("GET", "/api/admin/current-user");
      return response.json();
    },
  });

  // Fetch roles from API
  const { data: apiRoles, refetch: refetchRoles, isLoading: rolesLoading, error: rolesError } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await adminApiRequest("GET", "/api/admin/roles");
      return response.json();
    },
  });

  // Fetch permissions from API
  const { data: apiPermissions, isLoading: permissionsLoading, error: permissionsError } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const response = await adminApiRequest("GET", "/api/admin/permissions");
      return response.json();
    },
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Mutations for role management
  const createRoleMutation = useMutation({
    mutationFn: async (roleData: { name: string; description: string; permissions: number[] }) => {
      const response = await adminApiRequest("POST", "/api/admin/roles", roleData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({
        title: "Success",
        description: "Role created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create role",
        variant: "destructive",
      });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ roleId, roleData }: { roleId: number; roleData: { name: string; description: string; permissions: number[] } }) => {
      const response = await adminApiRequest("PUT", `/api/admin/roles/${roleId}`, roleData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({
        title: "Success",
        description: "Role updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update role",
        variant: "destructive",
      });
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: async (roleId: number) => {
      const response = await adminApiRequest("DELETE", `/api/admin/roles/${roleId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({
        title: "Success",
        description: "Role deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete role",
        variant: "destructive",
      });
    },
  });

  // Use API data directly
  const permissions: Permission[] = apiPermissions || [];
  const roles: Role[] = apiRoles || [];

  // Debug logging
  console.log('API Data:', { apiRoles, apiPermissions, roles, permissions });

  // Update selected role when roles data changes
  React.useEffect(() => {
    if (roles.length > 0 && !selectedRole) {
      setSelectedRole(roles[0]);
    }
  }, [roles, selectedRole]);

  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] as number[]
  });

  const categories = [...new Set(permissions.map(p => p.category))];

  const handlePermissionToggle = (permissionId: number, checked: boolean) => {
    if (!selectedRole) return;

    const updatedPermissions = checked
      ? [...selectedRole.permissions, permissionId]
      : selectedRole.permissions.filter(id => id !== permissionId);

    // Update local state immediately for UI responsiveness
    const updatedRole = {
      ...selectedRole,
      permissions: updatedPermissions
    };
    setSelectedRole(updatedRole);

    // Show loading state for this permission
    setSavingPermission(permissionId);

    // Automatically save changes to API
    updateRoleMutation.mutate({
      roleId: selectedRole.id,
      roleData: {
        name: selectedRole.name,
        description: selectedRole.description,
        permissions: updatedPermissions
      }
    }, {
      onSettled: () => {
        // Clear loading state when done
        setSavingPermission(null);
      }
    });
  };

  const handleSaveRole = () => {
    if (!selectedRole) return;

    updateRoleMutation.mutate({
      roleId: selectedRole.id,
      roleData: {
        name: selectedRole.name,
        description: selectedRole.description,
        permissions: selectedRole.permissions
      }
    });
    setIsEditing(false);
  };

  const handleAddRole = () => {
    if (!newRole.name.trim()) return;

    createRoleMutation.mutate({
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions
    });
    
    setNewRole({ name: '', description: '', permissions: [] });
    setShowAddRole(false);
  };

  const handleDeleteRole = (roleId: number) => {
    deleteRoleMutation.mutate(roleId);
    if (selectedRole?.id === roleId) {
      setSelectedRole(null);
    }
  };

  const getPermissionCount = (role: Role) => {
    return role.permissions.length;
  };

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
        <AdminSidebar adminUser={currentAdminUser} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-sm dark:bg-gray-800 shadow-lg shadow-slate-200/20 border-b border-slate-200/50 dark:border-gray-700">
          <div className="px-8 py-3" style={{ paddingTop: '1.2rem', paddingBottom: '0.8rem' }}>
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Role & Permissions Management
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Manage user roles and their access permissions
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-8 py-8">
            {rolesLoading || permissionsLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading roles and permissions...</p>
                </div>
              </div>
            ) : rolesError || permissionsError ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-red-500 text-lg mb-4">❌ Error loading data</div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {rolesError?.message || permissionsError?.message || 'Failed to load roles and permissions'}
                  </p>
                  <button 
                    onClick={() => { refetchRoles(); }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>

          {/* Roles Tab */}
          <TabsContent value="roles" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Roles List */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Roles</CardTitle>
                      <CardDescription>Manage user roles</CardDescription>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => setShowAddRole(true)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {roles.map((role) => (
                      <div
                        key={role.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedRole?.id === role.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        onClick={() => setSelectedRole(role)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {role.name}
                              </h3>
                              {role.isDefault && (
                                <Badge variant="secondary" className="text-xs">
                                  Default
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {role.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>{getPermissionCount(role)} permissions</span>
                              <span>{role.userCount} users</span>
                            </div>
                          </div>
                          {!role.isDefault && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRole(role.id);
                              }}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Role Details */}
              <div className="lg:col-span-2">
                {selectedRole ? (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {selectedRole.name}
                          {selectedRole.isDefault && (
                            <Badge variant="secondary">Default</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{selectedRole.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {isEditing ? (
                          <>
                            <Button size="sm" onClick={handleSaveRole}>
                              <Save className="h-4 w-4 mr-2" />
                              Save
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => setIsEditing(false)}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => setIsEditing(true)}
                            disabled={selectedRole.isDefault}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Permission Categories */}
                        {categories.map((category) => {
                          const categoryPermissions = permissions.filter(p => p.category === category);
                          const selectedCount = categoryPermissions.filter(p => 
                            selectedRole.permissions.includes(p.id)
                          ).length;

                          return (
                            <div key={category} className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                  {category}
                                </h3>
                                <Badge variant="outline">
                                  {selectedCount}/{categoryPermissions.length}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 gap-3">
                                {categoryPermissions.map((permission) => (
                                  <div
                                    key={permission.id}
                                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                                  >
                                    <div className="flex-1">
                                      <h4 className="font-medium text-gray-900 dark:text-white">
                                        {permission.name}
                                      </h4>
                                      <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {permission.description}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Switch
                                        checked={selectedRole.permissions.includes(permission.id)}
                                        onCheckedChange={(checked) => 
                                          handlePermissionToggle(permission.id, checked)
                                        }
                                        disabled={selectedRole.isDefault || savingPermission === permission.id}
                                      />
                                      {savingPermission === permission.id && (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          Select a Role
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Choose a role from the list to view and edit its permissions
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Permissions</CardTitle>
                <CardDescription>
                  Overview of all available permissions in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {categories.map((category) => {
                    const categoryPermissions = permissions.filter(p => p.category === category);
                    
                    return (
                      <div key={category} className="space-y-3">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b pb-2">
                          {category}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {categoryPermissions.map((permission) => (
                            <div
                              key={permission.id}
                              className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                                {permission.name}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {permission.description}
                              </p>
                              <Badge variant="outline" className="mt-2 text-xs">
                                {permission.id}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
            )}

        {/* Add Role Modal */}
        {showAddRole && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Add New Role</CardTitle>
                <CardDescription>Create a new user role with specific permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="roleName">Role Name</Label>
                  <Input
                    id="roleName"
                    value={newRole.name}
                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                    placeholder="Enter role name"
                  />
                </div>
                <div>
                  <Label htmlFor="roleDescription">Description</Label>
                  <Input
                    id="roleDescription"
                    value={newRole.description}
                    onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                    placeholder="Enter role description"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddRole} className="flex-1">
                    Create Role
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddRole(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRolePermissions;
