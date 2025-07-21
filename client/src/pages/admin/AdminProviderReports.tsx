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
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

interface ProviderReport {
  totalProviders: number;
  approvedProviders: number;
  pendingProviders: number;
  rejectedProviders: number;
  newProvidersThisMonth: number;
  topServiceCategories: Array<{
    category: string;
    providerCount: number;
  }>;
  avgApprovalTime: string;
}

export default function AdminProviderReports() {
  const [, navigate] = useLocation();

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin-login');
    }
  }, [navigate]);

  // Provider Reports Query
  const { data: providerReports, isLoading } = useQuery({
    queryKey: ['/api/admin/reports/providers'],
    queryFn: async () => {
      const response = await fetch('/api/admin/reports/providers', {
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
    console.log('Exporting provider report...');
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
                <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Provider Reports
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Service provider analytics and performance metrics
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
              <p className="mt-2 text-gray-500">Loading provider reports...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Providers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{providerReports?.totalProviders || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      All registered providers
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Approved</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {providerReports?.approvedProviders || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Active providers
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    <Clock className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      {providerReports?.pendingProviders || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Awaiting review
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                    <XCircle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {providerReports?.rejectedProviders || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Applications declined
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts and Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Provider Distribution by Service</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {providerReports?.topServiceCategories?.map((category, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{category.category}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full"
                                style={{ 
                                  width: `${(category.providerCount / Math.max(...(providerReports.topServiceCategories?.map(c => c.providerCount) || [1]))) * 100}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{category.providerCount}</span>
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
                    <CardTitle>Approval Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Average Approval Time</span>
                        <span className="font-medium">{providerReports?.avgApprovalTime || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Approval Rate</span>
                        <span className="font-medium">
                          {providerReports?.totalProviders 
                            ? Math.round((providerReports.approvedProviders / providerReports.totalProviders) * 100)
                            : 0
                          }%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">New This Month</span>
                        <span className="font-medium">{providerReports?.newProvidersThisMonth || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Document Compliance</span>
                        <span className="font-medium">95%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Provider Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">4.8</div>
                      <p className="text-sm text-gray-600">Average Rating</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">92%</div>
                      <p className="text-sm text-gray-600">Job Completion Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">24h</div>
                      <p className="text-sm text-gray-600">Avg Response Time</p>
                    </div>
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