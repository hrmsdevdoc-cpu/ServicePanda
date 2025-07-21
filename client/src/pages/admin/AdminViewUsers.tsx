import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  Shield,
  Search,
  Eye,
  Users,
  Mail,
  Calendar,
  Phone,
} from "lucide-react";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export default function AdminViewUsers() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin-login');
    }
  }, [navigate]);

  // All Users Query
  const { data: allUsers, isLoading } = useQuery({
    queryKey: ['/api/admin/users'],
    queryFn: async () => {
      const response = await fetch('/api/admin/users', {
        headers: {
          'x-admin-token': localStorage.getItem('adminToken') || '',
        },
      });
      return response.json();
    },
  });

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  // Filter users based on search term
  const filteredUsers = allUsers?.filter((user: User) => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phoneNumber && user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <AdminSidebar onLogout={handleLogout} />
      
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow border-b border-gray-200 dark:border-gray-700">
          <div className="px-8 py-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Customer Users
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  View and manage all registered customers
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Customer Directory</CardTitle>
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Badge variant="outline">
                  {filteredUsers?.length || 0} Total Users
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading users...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">User</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Phone</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Joined</th>
                        <th className="text-left p-3">Last Login</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers?.map((user: User) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{user.firstName} {user.lastName}</p>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-2 text-gray-400" />
                              <span className="text-sm">{user.email}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-2 text-gray-400" />
                              <span className="text-sm">{user.phoneNumber || '-'}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge 
                              variant={user.isActive ? "default" : "destructive"}
                              className={user.isActive ? "bg-green-100 text-green-800" : ""}
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-2 text-gray-400" />
                              <span className="text-sm">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="text-sm text-gray-600">
                              {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                            </span>
                          </td>
                          <td className="p-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/admin/users/${user.id}`)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {(!filteredUsers || filteredUsers.length === 0) && !isLoading && (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-gray-500">
                            No users found matching your criteria
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}