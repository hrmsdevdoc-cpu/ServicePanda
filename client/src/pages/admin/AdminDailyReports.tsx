import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  BarChart3,
  Calendar,
  TrendingUp,
  Download,
  Activity,
  Clock,
  DollarSign,
} from "lucide-react";

interface DailyReport {
  date: string;
  newUsers: number;
  newProviders: number;
  serviceRequests: number;
  completedJobs: number;
  revenue: number;
  activeUsers: number;
}

export default function AdminDailyReports() {
  const [, navigate] = useLocation();

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin-login');
    }
  }, [navigate]);

  // Daily Reports Query
  const { data: dailyReports, isLoading } = useQuery({
    queryKey: ['/api/admin/reports/daily'],
    queryFn: async () => {
      const response = await fetch('/api/admin/reports/daily', {
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
    console.log('Exporting daily report...');
  };

  // Get today's data
  const today = new Date().toISOString().split('T')[0];
  const todayData = dailyReports?.find((report: DailyReport) => report.date === today) || {
    newUsers: 0,
    newProviders: 0,
    serviceRequests: 0,
    completedJobs: 0,
    revenue: 0,
    activeUsers: 0,
  };

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
                <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Daily Reports
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Daily platform activity and performance metrics
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
              <p className="mt-2 text-gray-500">Loading daily reports...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Today's Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Today's Activity Summary - {new Date().toLocaleDateString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{todayData.newUsers}</div>
                      <p className="text-sm text-blue-800">New Users</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{todayData.newProviders}</div>
                      <p className="text-sm text-green-800">New Providers</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{todayData.serviceRequests}</div>
                      <p className="text-sm text-purple-800">Service Requests</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{todayData.completedJobs}</div>
                      <p className="text-sm text-orange-800">Completed Jobs</p>
                    </div>
                    <div className="text-center p-4 bg-emerald-50 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-600">${todayData.revenue}</div>
                      <p className="text-sm text-emerald-800">Revenue</p>
                    </div>
                    <div className="text-center p-4 bg-indigo-50 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600">{todayData.activeUsers}</div>
                      <p className="text-sm text-indigo-800">Active Users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Last 7 Days Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Last 7 Days Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Date</th>
                          <th className="text-left p-3">Users</th>
                          <th className="text-left p-3">Providers</th>
                          <th className="text-left p-3">Requests</th>
                          <th className="text-left p-3">Jobs</th>
                          <th className="text-left p-3">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dailyReports?.slice(-7).reverse().map((report: DailyReport, index: number) => (
                          <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="p-3 font-medium">
                              {new Date(report.date).toLocaleDateString()}
                            </td>
                            <td className="p-3">{report.newUsers}</td>
                            <td className="p-3">{report.newProviders}</td>
                            <td className="p-3">{report.serviceRequests}</td>
                            <td className="p-3">{report.completedJobs}</td>
                            <td className="p-3">${report.revenue}</td>
                          </tr>
                        )) || (
                          <tr>
                            <td colSpan={6} className="text-center py-8 text-gray-500">
                              No daily reports data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Key Performance Indicators */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">System Uptime</span>
                        <span className="font-medium text-green-600">99.9%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Average Response Time</span>
                        <span className="font-medium">245ms</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Error Rate</span>
                        <span className="font-medium text-green-600">0.1%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">API Calls</span>
                        <span className="font-medium">12,847</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Business Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Conversion Rate</span>
                        <span className="font-medium">3.2%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Customer Satisfaction</span>
                        <span className="font-medium text-green-600">4.8/5</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Avg Job Value</span>
                        <span className="font-medium">$185</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Daily Active Users</span>
                        <span className="font-medium">{todayData.activeUsers}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}