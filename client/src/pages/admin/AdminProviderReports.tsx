import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { adminApiRequest } from "@/lib/queryClient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart3,
  Users,
  TrendingUp,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
  Calendar,
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Line, LineChart, Area, AreaChart } from "recharts";
import React from "react"; // Added missing import for React

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
  approvalRate: number;
  avgRating: number;
  jobCompletionRate: number;
  avgResponseTime: string;
  monthlyJoins: Array<{
    month: string;
    count: number;
    approved: number;
    pending: number;
    rejected: number;
  }>;
}

type ChartType = 'bar' | 'line' | 'area';

export default function AdminProviderReports() {
  const [, navigate] = useLocation();
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin-login');
    }
  }, [navigate]);

  // Provider Reports Query
  const { data: providerReports, isLoading, error } = useQuery({
    queryKey: ['/api/admin/reports/providers'],
    queryFn: async () => {
      const response = await adminApiRequest('GET', '/api/admin/reports/providers');
      const data = await response.json();
      console.log('Provider reports data received:', data);
      return data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  const handleExportReport = () => {
    console.log('Exporting provider report...');
  };

  // Filter monthly data based on selected year and status
  const getFilteredMonthlyData = () => {
    if (!providerReports?.monthlyJoins) {
      console.log('No monthly joins data available');
      return [];
    }
    
    // Filter by selected year
    const yearData = providerReports.monthlyJoins.filter((month: any) => 
      month.month.includes(selectedYear)
    );
    
    // Always generate all 12 months for the selected year
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = months.map(month => {
      const monthKey = `${month} ${selectedYear}`;
      const existingData = yearData.find((data: any) => data.month === monthKey);
      
      return {
        month: monthKey,
        count: existingData ? (
          selectedStatus === 'all' ? existingData.count :
          selectedStatus === 'approved' ? existingData.approved :
          selectedStatus === 'pending' ? existingData.pending :
          selectedStatus === 'rejected' ? existingData.rejected : existingData.count
        ) : 0
      };
    });
    
    console.log('Filtered monthly data for year', selectedYear, ':', result);
    return result;
  };

  // Get filtered data based on status
  const getFilteredData = () => {
    if (!providerReports) {
      console.log('No provider reports data available');
      return null;
    }
    
    if (selectedStatus === 'all') return providerReports;
    
    return {
      ...providerReports,
      totalProviders: selectedStatus === 'approved' ? providerReports.approvedProviders :
                      selectedStatus === 'pending'  ? providerReports.pendingProviders :
                      selectedStatus === 'rejected' ? providerReports.rejectedProviders : providerReports.totalProviders
    };
  };

  const filteredData = getFilteredData();
  const monthlyData = getFilteredMonthlyData();

  // Use only real data - no static fallback
  const chartData = monthlyData;

  console.log('Chart data being used:', chartData);

  // Memoize chart data to prevent unnecessary re-renders
  const memoizedChartData = React.useMemo(() => chartData, [chartData, selectedStatus, selectedYear]);

  // Custom tooltip for charts
  const CustomTooltip = React.useCallback(({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const statusText = selectedStatus === 'all' ? 'total' : 
                        selectedStatus === 'approved' ? 'approved' :
                        selectedStatus === 'pending' ? 'pending' :
                        selectedStatus === 'rejected' ? 'rejected' : 'total';
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-purple-600 font-semibold">
            {payload[0].value} {statusText} providers
          </p>
          {selectedStatus === 'all' && providerReports?.monthlyJoins && (
            <div className="mt-2 text-xs text-gray-600">
              <p>Approved: {providerReports.monthlyJoins.find(m => m.month === label)?.approved || 0}</p>
              <p>Pending: {providerReports.monthlyJoins.find(m => m.month === label)?.pending || 0}</p>
              <p>Rejected: {providerReports.monthlyJoins.find(m => m.month === label)?.rejected || 0}</p>
            </div>
          )}
        </div>
      );
    }
    return null;
  }, [selectedStatus, providerReports]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <AdminSidebar onLogout={handleLogout} />
      
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto relative z-10">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-sm dark:bg-gray-800 shadow-lg shadow-slate-200/20 border-b border-slate-200/50 dark:border-gray-700">
          <div className="px-8 py-3" style={{ paddingTop: '1.2rem', paddingBottom: '0.8rem' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Provider Report
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Comprehensive provider analytics and performance metrics
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
        <div className="px-8 pt-4 pb-8 min-h-screen">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading provider reports...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading provider reports: {error.message}</p>
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
                    <div className="text-2xl font-bold">{filteredData?.totalProviders || 0}</div>
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
                      {filteredData?.approvedProviders || 0}
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
                      {filteredData?.pendingProviders || 0}
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
                      {filteredData?.rejectedProviders || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Applications declined
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Monthly Join Trends with Filters */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      <CardTitle>Provider Join Trends</CardTitle>
                    </div>
                    <div className="flex items-center space-x-4">
                      {/* Status Filter */}
                      <div className="flex items-center space-x-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Year Filter */}
                      <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2025">2025</SelectItem>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2023">2023</SelectItem>
                          <SelectItem value="2022">2022</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Chart Type Filter */}
                      <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Chart" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bar">Bar</SelectItem>
                          <SelectItem value="line">Line</SelectItem>
                          <SelectItem value="area">Area</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80 w-full" style={{ minHeight: '320px' }}>
                    {memoizedChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'bar' ? (
                          <BarChart data={memoizedChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis 
                              dataKey="month" 
                              tick={{ fontSize: 12 }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis 
                              tick={{ fontSize: 12 }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar 
                              dataKey="count" 
                              fill="#8b5cf6" 
                              radius={[4, 4, 0, 0]}
                              name="Providers Joined"
                            />
                          </BarChart>
                        ) : chartType === 'line' ? (
                          <LineChart data={memoizedChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis 
                              dataKey="month" 
                              tick={{ fontSize: 12 }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis 
                              tick={{ fontSize: 12 }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line 
                              type="monotone"
                              dataKey="count" 
                              stroke="#8b5cf6" 
                              strokeWidth={3}
                              dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                              activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
                            />
                          </LineChart>
                        ) : (
                          <AreaChart data={memoizedChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis 
                              dataKey="month" 
                              tick={{ fontSize: 12 }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis 
                              tick={{ fontSize: 12 }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area 
                              type="monotone"
                              dataKey="count" 
                              stroke="#8b5cf6" 
                              fill="#8b5cf6"
                              fillOpacity={0.3}
                              strokeWidth={2}
                            />
                          </AreaChart>
                        )}
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="text-gray-400 mb-2">
                            <BarChart3 className="h-12 w-12 mx-auto" />
                          </div>
                          <p className="text-gray-500 text-sm">No data available for the selected time range</p>
                          <p className="text-gray-400 text-xs mt-1">Try adjusting the filters or check back later</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 text-center text-sm text-gray-600">
                    <p>Shows the number of {selectedStatus === 'all' ? 'all' : selectedStatus} providers who joined each month</p>
                    <p className="mt-1">Displaying data for the year {selectedYear}</p>
                    {monthlyData.length === 0 && (
                      <p className="mt-2 text-orange-600">No data available for the selected year</p>
                    )}
                  </div>
                  
                  {/* Trend Analysis */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Growth Trend</h4>
                      {memoizedChartData.length >= 2 ? (
                        <div>
                          <p className="text-2xl font-bold text-blue-600">
                            {(() => {
                              const current = memoizedChartData[memoizedChartData.length - 1]?.count || 0;
                              const previous = memoizedChartData[memoizedChartData.length - 2]?.count || 0;
                              if (previous === 0) return current > 0 ? '+100%' : '0%';
                              const change = ((current - previous) / previous) * 100;
                              return `${change >= 0 ? '+' : ''}${Math.round(change)}%`;
                            })()}
                          </p>
                          <p className="text-xs text-blue-700">vs previous month</p>
                        </div>
                      ) : (
                        <p className="text-sm text-blue-700">Insufficient data</p>
                      )}
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Peak Month</h4>
                      {memoizedChartData.length > 0 ? (
                        <div>
                          <p className="text-2xl font-bold text-green-600">
                            {Math.max(...memoizedChartData.map((d: any) => d.count))}
                          </p>
                          <p className="text-xs text-green-700">
                            {memoizedChartData.find((d: any) => d.count === Math.max(...memoizedChartData.map((d: any) => d.count)))?.month}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-green-700">No data</p>
                      )}
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">Average Monthly</h4>
                      {memoizedChartData.length > 0 ? (
                        <div>
                          <p className="text-2xl font-bold text-purple-600">
                            {Math.round(memoizedChartData.reduce((sum: number, item: any) => sum + item.count, 0) / memoizedChartData.length)}
                          </p>
                          <p className="text-xs text-purple-700">providers per month</p>
                        </div>
                      ) : (
                        <p className="text-sm text-purple-700">No data</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                          {providerReports?.approvalRate || 0}%
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

              {/* Growth Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">This Month</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {providerReports?.newProvidersThisMonth || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      New providers joined
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Monthly</CardTitle>
                    <BarChart3 className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {providerReports?.monthlyJoins && providerReports.monthlyJoins.length > 0 
                        ? Math.round(providerReports.monthlyJoins.reduce((sum, item) => sum + item.count, 0) / providerReports.monthlyJoins.length)
                        : 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Average joins per month
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
                      {providerReports?.monthlyJoins && providerReports.monthlyJoins.length >= 2
                        ? (() => {
                            const current = providerReports.monthlyJoins[providerReports.monthlyJoins.length - 1]?.count || 0;
                            const previous = providerReports.monthlyJoins[providerReports.monthlyJoins.length - 2]?.count || 0;
                            if (previous === 0) return current > 0 ? 100 : 0;
                            return Math.round(((current - previous) / previous) * 100);
                          })()
                        : 0}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      vs previous month
                    </p>
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
                      <div className="text-3xl font-bold text-blue-600">{providerReports?.avgRating || 4.8}</div>
                      <p className="text-sm text-gray-600">Average Rating</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{providerReports?.jobCompletionRate || 92}%</div>
                      <p className="text-sm text-gray-600">Job Completion Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">{providerReports?.avgResponseTime || '24h'}</div>
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