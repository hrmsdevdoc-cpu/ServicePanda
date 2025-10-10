import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageSquare, Phone, Calendar, User, Send, MoreVertical, RefreshCw } from "lucide-react";
import { format } from 'date-fns';
import { AdminSidebar } from "@/components/AdminSidebar";
import { adminApiRequest } from "@/lib/adminAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface SmsMessage {
  id: number;
  recipientType: 'customer' | 'provider' | 'potential_customer' | 'potential_provider';
  recipientId?: number;
  recipientPhone: string;
  recipientName?: string;
  message: string;
  direction: 'inbound' | 'outbound';
  status: 'sent' | 'delivered' | 'failed' | 'received';
  smsType?: '1st_sent' | '2nd_sent' | 'custom' | 'notification';
  sentAt?: string;
}

interface Conversation {
  id: string;
  recipientType: 'customer' | 'provider' | 'potential_customer' | 'potential_provider';
  recipientId?: number;
  recipientPhone: string;
  recipientName?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'active' | 'archived';
}

export default function AdminSmsMenu() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversationMessages, setConversationMessages] = useState<SmsMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Fetch SMS messages from API
  const { data: smsMessages = [], isLoading: messagesLoading, refetch: refetchMessages } = useQuery({
    queryKey: ['/api/admin/sms/messages'],
    queryFn: async () => {
      const response = await adminApiRequest('GET', '/api/admin/sms/messages');
      return response.json();
    },
    refetchInterval: 5000, // Refresh every 5 seconds for real-time updates
  });

  // Fetch potential customers for customer tab
  const { data: potentialCustomers = [] } = useQuery({
    queryKey: ['/api/admin/potential-customers'],
    queryFn: async () => {
      const response = await adminApiRequest('GET', '/api/admin/potential-customers');
      return response.json();
    },
  });

  // Fetch providers for provider tab
  const { data: providers = [] } = useQuery({
    queryKey: ['/api/admin/providers'],
    queryFn: async () => {
      const response = await adminApiRequest('GET', '/api/admin/providers');
      return response.json();
    },
  });

  // Send SMS mutation
  const sendSmsMutation = useMutation({
    mutationFn: async (data: { customerId: number; message: string }) => {
      const response = await adminApiRequest('POST', '/api/admin/sms/send', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "SMS Sent",
        description: "Message sent successfully",
      });
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ['/api/admin/sms/messages'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send SMS",
        variant: "destructive",
      });
    },
  });

  // Clear selected conversation when switching tabs
  useEffect(() => {
    setSelectedConversation(null);
  }, [activeTab]);

  // Build conversations from SMS messages and potential customers/providers
  useEffect(() => {
    const map = new Map<string, Conversation>();
    
    // Add conversations from SMS messages
    for (const msg of smsMessages) {
      const key = `${msg.recipientType}:${msg.recipientId || msg.recipientPhone}`;
      const existing = map.get(key);
      const conv: Conversation = existing || {
        id: key,
        recipientType: msg.recipientType,
        recipientId: msg.recipientId,
        recipientPhone: msg.recipientPhone,
        recipientName: msg.recipientName,
        lastMessage: msg.message,
        lastMessageTime: new Date().toISOString(), // Use current time since we don't have sentAt in existing table
        unreadCount: 0,
        status: 'active',
      };
      // Always update with latest message
      conv.lastMessage = msg.message;
      map.set(key, conv);
    }

    // Only show users who have actually sent messages
    // No need to add users who haven't sent any messages

    const allConversations = Array.from(map.values());
    const customerConvs = allConversations.filter(c => c.recipientType === 'customer' || c.recipientType === 'potential_customer');
    const providerConvs = allConversations.filter(c => c.recipientType === 'provider' || c.recipientType === 'potential_provider');

    setConversations(activeTab === 'customers' ? customerConvs : providerConvs);
  }, [smsMessages, potentialCustomers, providers, activeTab]);

  // Load conversation messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) {
      setConversationMessages([]);
      return;
    }
    
    // Check if the selected conversation is valid for the current tab
    const isCustomerTab = activeTab === 'customers';
    const isCustomerConversation = selectedConversation.recipientType === 'customer' || selectedConversation.recipientType === 'potential_customer';
    const isProviderConversation = selectedConversation.recipientType === 'provider' || selectedConversation.recipientType === 'potential_provider';
    
    if ((isCustomerTab && !isCustomerConversation) || (!isCustomerTab && !isProviderConversation)) {
      // Clear the selected conversation if it doesn't match the current tab
      setSelectedConversation(null);
      setConversationMessages([]);
      return;
    }
    
    const filtered = smsMessages.filter((m: SmsMessage) => {
      const key = `${m.recipientType}:${m.recipientId || m.recipientPhone}`;
      return key === selectedConversation.id;
    }).sort((a: SmsMessage, b: SmsMessage) => {
      const aTime = a.sentAt ? new Date(a.sentAt).getTime() : 0;
      const bTime = b.sentAt ? new Date(b.sentAt).getTime() : 0;
      return aTime - bTime;
    });
    setConversationMessages(filtered);
  }, [selectedConversation, smsMessages, activeTab]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDirectionIcon = (direction: string) => {
    return direction === 'outbound' ? 
      <Phone className="h-4 w-4 text-blue-600" /> : 
      <MessageSquare className="h-4 w-4 text-green-600" />;
  };

  const getRecipientTypeColor = (type: string) => {
    switch (type) {
      case 'customer': return 'bg-blue-100 text-blue-800';
      case 'provider': return 'bg-green-100 text-green-800';
      case 'potential_customer': return 'bg-yellow-100 text-yellow-800';
      case 'potential_provider': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !selectedConversation.recipientId) return;
    
    // Send SMS via API
    sendSmsMutation.mutate({
      customerId: selectedConversation.recipientId,
      message: newMessage.trim(),
    });
  };

  const filteredConversations = conversations.filter(conv => {
    // Filter by search term
    const matchesSearch = conv.recipientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.recipientPhone.includes(searchTerm) ||
                         conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by main tab (customer/provider)
    const isCustomerConversation = conv.recipientType === 'customer' || conv.recipientType === 'potential_customer';
    const isProviderConversation = conv.recipientType === 'provider' || conv.recipientType === 'potential_provider';
    const matchesMainTab = activeTab === 'customers' ? isCustomerConversation : isProviderConversation;
    
    return matchesSearch && matchesMainTab;
  });

  if (messagesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading SMS conversations...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Admin Sidebar */}
      <AdminSidebar onLogout={() => {}} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">SMS Conversations</h1>
              <p className="text-xs text-gray-600">Manage all SMS communications</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Tabs - Customer/Provider */}
             <div className="flex bg-gray-100 rounded-lg p-1 shadow-inner">
               <button
                 onClick={() => setActiveTab('customers')}
                 className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 transform ${
                   activeTab === 'customers' 
                     ? 'bg-yellow-100 text-yellow-800 shadow-lg scale-105 border border-yellow-200' 
                     : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:scale-102'
                 }`}
               >
                 Customer
               </button>
               <button
                 onClick={() => setActiveTab('providers')}
                 className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 transform ${
                   activeTab === 'providers' 
                     ? 'bg-purple-100 text-purple-800 shadow-lg scale-105 border border-purple-200' 
                     : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:scale-102'
                 }`}
               >
                 Provider
               </button>
             </div>
              

              
              {/* Refresh Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchMessages()}
                disabled={messagesLoading}
                className="transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
              >
                <RefreshCw className={`h-4 w-4 mr-2 transition-transform duration-300 ${messagesLoading ? 'animate-spin' : 'hover:rotate-180'}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex">
          {/* Conversations List */}
          <div className={`w-80 border-r border-gray-200 flex flex-col transition-all duration-500 ease-in-out ${
            activeTab === 'customers' ? 'bg-yellow-50' : 'bg-purple-50'
          }`}>
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              {filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {activeTab === 'customers' ? 'No Customer Conversations' : 'No Provider Conversations'}
                  </h3>
                  <p className="text-sm text-gray-500 max-w-sm">
                    {activeTab === 'customers' 
                      ? 'No customers have sent messages yet. Conversations will appear here once customers start messaging.'
                      : 'No providers have sent messages yet. Conversations will appear here once providers start messaging.'
                    }
                  </p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleConversationClick(conversation)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md ${
                      selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200 shadow-lg scale-[1.01]' : ''
                    }`}
                  >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getRecipientTypeColor(conversation.recipientType)}>
                        {conversation.recipientType === 'customer' ? 'Customer' : 
                         conversation.recipientType === 'provider' ? 'Provider' :
                         conversation.recipientType === 'potential_customer' ? 'Potential Customer' : 'Potential Provider'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {conversation.unreadCount > 0 && (
                        <Badge className="bg-red-500 text-white text-xs">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="mb-1">
                    <span className="font-medium text-gray-900">
                      {conversation.recipientName || 'Unknown'}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({conversation.recipientPhone})
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {conversation.lastMessage}
                  </p>
                  
                  <div className="text-xs text-gray-500">
                    {format(new Date(conversation.lastMessageTime), 'MMM dd, HH:mm')}
                  </div>
                </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 flex flex-col bg-gray-50">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {selectedConversation.recipientName || 'Unknown'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {selectedConversation.recipientPhone}
                        </p>
                      </div>
                    </div>
                    <Badge className={getRecipientTypeColor(selectedConversation.recipientType)}>
                      {selectedConversation.recipientType === 'customer' ? 'Customer' : 
                       selectedConversation.recipientType === 'provider' ? 'Provider' :
                       selectedConversation.recipientType === 'potential_customer' ? 'Potential Customer' : 'Potential Provider'}
                    </Badge>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {conversationMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.direction === 'outbound' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}>
                        <p className="text-sm">{message.message}</p>
                        <div className={`flex items-center justify-between mt-2 text-xs ${
                          message.direction === 'outbound' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          <span>{format(new Date(), 'HH:mm')}</span>
                          <div className="flex items-center gap-1">
                            {getDirectionIcon(message.direction)}
                            <Badge className={`text-xs ${getStatusColor(message.status)}`}>
                              {message.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="bg-white border-t border-gray-200 p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!newMessage.trim() || sendSmsMutation.isPending}
                    >
                      <Send className="h-4 w-4" />
                      {sendSmsMutation.isPending ? "Sending..." : ""}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium">Select a conversation</h3>
                  <p className="text-sm">Choose a conversation from the list to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
