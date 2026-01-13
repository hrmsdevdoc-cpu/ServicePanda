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
  CalendarDays,
  ChevronDown,
  FileText,
  ShoppingCart,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  // New metrics
  joined: number;
  leadsGenerated: number;
  uniqueLeadsPurchased: number;
  sharedLeadsPurchased: number;
  pendingLeads: number;
}

interface DateRange {
  from: Date;
  to: Date;
}

const datePresets = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "This Week", value: "this-week" },
  { label: "Last Week", value: "last-week" },
  { label: "This Month", value: "this-month" },
  { label: "Last Month", value: "last-month" },
  { label: "This Quarter", value: "this-quarter" },
  { label: "Last Quarter", value: "last-quarter" },
  { label: "This Year", value: "this-year" },
  { label: "Last Year", value: "last-year" },
];

export default function AdminUserReports() {
  const [, navigate] = useLocation();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Start of current month
    to: new Date(),
  });
  const [selectedPreset, setSelectedPreset] = useState<string>("this-month");

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin-login');
    }
  }, [navigate]);

  // Calculate date range based on preset
  const calculateDateRange = (preset: string): DateRange => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (preset) {
      case "today":
        return { from: today, to: today };
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return { from: yesterday, to: yesterday };
      case "this-week":
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        return { from: startOfWeek, to: today };
      case "last-week":
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
        const lastWeekEnd = new Date(lastWeekStart);
        lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
        return { from: lastWeekStart, to: lastWeekEnd };
      case "this-month":
        return { 
          from: new Date(now.getFullYear(), now.getMonth(), 1), 
          to: today 
        };
      case "last-month":
        return { 
          from: new Date(now.getFullYear(), now.getMonth() - 1, 1), 
          to: new Date(now.getFullYear(), now.getMonth(), 0) 
        };
      case "this-quarter":
        const currentQuarter = Math.floor(now.getMonth() / 3);
        const quarterStart = new Date(now.getFullYear(), currentQuarter * 3, 1);
        return { from: quarterStart, to: today };
      case "last-quarter":
        const lastQuarter = Math.floor(now.getMonth() / 3) - 1;
        const lastQuarterStart = new Date(now.getFullYear(), lastQuarter * 3, 1);
        const lastQuarterEnd = new Date(now.getFullYear(), (lastQuarter + 1) * 3, 0);
        return { from: lastQuarterStart, to: lastQuarterEnd };
      case "this-year":
        return { 
          from: new Date(now.getFullYear(), 0, 1), 
          to: today 
        };
      case "last-year":
        return { 
          from: new Date(now.getFullYear() - 1, 0, 1), 
          to: new Date(now.getFullYear() - 1, 11, 31) 
        };
      default:
        return { from: today, to: today };
    }
  };

  // Update date range when preset changes
  useEffect(() => {
    setDateRange(calculateDateRange(selectedPreset));
  }, [selectedPreset]);

  // User Reports Query with date range
  const { data: userReports, isLoading } = useQuery({
    queryKey: ['/api/admin/reports/users', dateRange],
    queryFn: async () => {
      const response = await fetch('/api/admin/reports/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': localStorage.getItem('adminToken') || '',
        },
        body: JSON.stringify({
          fromDate: dateRange.from.toISOString(),
          toDate: dateRange.to.toISOString(),
        }),
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    User Reports
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Customer analytics and usage statistics
                  </p>
                </div>
              </div>
              
              {/* Date Range Selector */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="date-preset" className="text-sm font-medium">
                    Date Range:
                  </Label>
                  <Select value={selectedPreset} onValueChange={setSelectedPreset}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {datePresets.map((preset) => (
                        <SelectItem key={preset.value} value={preset.value}>
                          {preset.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Input
                    type="date"
                    value={dateRange.from.toISOString().split('T')[0]}
                    onChange={(e) => {
                      const newFrom = new Date(e.target.value);
                      setDateRange(prev => ({ ...prev, from: newFrom }));
                      setSelectedPreset("custom");
                    }}
                    className="w-40"
                  />
                  <span className="text-gray-500">to</span>
                  <Input
                    type="date"
                    value={dateRange.to.toISOString().split('T')[0]}
                    onChange={(e) => {
                      const newTo = new Date(e.target.value);
                      setDateRange(prev => ({ ...prev, to: newTo }));
                      setSelectedPreset("custom");
                    }}
                    className="w-40"
                  />
                </div>
                
                <Button onClick={handleExportReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
            
            {/* Date Range Display */}
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <CalendarDays className="h-4 w-4 mr-2" />
              <span>
                Showing data from <strong>{formatDate(dateRange.from)}</strong> to <strong>{formatDate(dateRange.to)}</strong>
              </span>
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
              {/* New Metrics - Top Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Joined</CardTitle>
                    <Users className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {userReports?.joined || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      New registrations
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Leads Generated</CardTitle>
                    <FileText className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {userReports?.leadsGenerated || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Total service requests
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Unique Leads Purchased</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">
                      {userReports?.uniqueLeadsPurchased || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Exclusive leads bought
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Shared Leads Purchased</CardTitle>
                    <Users className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      {userReports?.sharedLeadsPurchased || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Shared leads bought
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Leads</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {userReports?.pendingLeads || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Awaiting response
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Original Metrics - Second Row */}
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