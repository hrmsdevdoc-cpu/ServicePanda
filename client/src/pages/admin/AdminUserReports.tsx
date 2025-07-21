import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  BarChart3,
  Users,
  TrendingUp,
  Download,
  Calendar,
  Mail,
} from "lucide-react";

interface UserReport {
  totalUsers: number;
  newUsersThisMonth: number;
  activeUsers: number;
  userGrowthRate: number;
  averageSessionTime: string;
  topServiceCategories: Array<{
    category: string;
    requestCount: number;
  }>;
}

export default function AdminUserReports() {
  const [, navigate] = useLocation();

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin-login');
    }
  }, [navigate]);

  // User Reports Query
  const { data: userReports, isLoading } = useQuery({
    queryKey: ['/api/admin/reports/users'],
    queryFn: async () => {
      const response = await fetch('/api/admin/reports/users', {
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

  const handleExportReport = () => {
    // This would typically generate and download a CSV/PDF report
    console.log('Exporting user report...');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <AdminSidebar onLogout={handleLogout} />
      
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow border-b border-gray-200 dark:border-gray-700">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    User Reports
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Customer analytics and usage statistics
                  </p>
                </div>
              </div>
              <Button onClick={handleExportReport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-8 py-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading user reports...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userReports?.totalUsers || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      All registered customers
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">New This Month</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {userReports?.newUsersThisMonth || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      New registrations
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <Users className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {userReports?.activeUsers || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Last 30 days
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">
                      {userReports?.userGrowthRate || 0}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Month over month
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts and Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Service Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {userReports?.topServiceCategories?.map((category, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{category.category}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ 
                                  width: `${(category.requestCount / Math.max(...(userReports.topServiceCategories?.map(c => c.requestCount) || [1]))) * 100}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{category.requestCount}</span>
                          </div>
                        </div>
                      )) || (
                        <p className="text-gray-500 text-center py-4">No data available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Average Session Time</span>
                        <span className="font-medium">{userReports?.averageSessionTime || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">User Retention Rate</span>
                        <span className="font-medium">75%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email Open Rate</span>
                        <span className="font-medium">65%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Support Tickets</span>
                        <span className="font-medium">12</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent User Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>User activity timeline will be displayed here</p>
                    <p className="text-sm">Feature in development</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}