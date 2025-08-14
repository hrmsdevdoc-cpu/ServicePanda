import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageSquare, Phone, Calendar, User, Send, MoreVertical } from "lucide-react";
import { format } from 'date-fns';
import { AdminSidebar } from "@/components/AdminSidebar";

interface SmsMessage {
  id: number;
  recipientType: 'customer' | 'provider' | 'potential_customer' | 'potential_provider';
  recipientId?: number;
  recipientPhone: string;
  recipientName?: string;
  message: string;
  direction: 'inbound' | 'outbound';
  status: 'sent' | 'delivered' | 'failed' | 'read';
  smsType?: '1st_sent' | '2nd_sent' | 'custom' | 'notification';
  sentBy?: string;
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
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
  const [activeTab, setActiveTab] = useState('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [smsMessages, setSmsMessages] = useState<SmsMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversationMessages, setConversationMessages] = useState<SmsMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');

  // Comprehensive dummy data
  const dummyData = {
    customers: [
      {
        id: 'customer_1',
        recipientType: 'customer' as const,
        recipientId: 101,
        recipientPhone: '+61412345678',
        recipientName: 'John Smith',
        lastMessage: 'Thank you for the service! It was excellent.',
        lastMessageTime: '2024-01-15T14:30:00Z',
        unreadCount: 0,
        status: 'active' as const
      },
      {
        id: 'customer_2',
        recipientType: 'customer' as const,
        recipientId: 102,
        recipientPhone: '+61422222222',
        recipientName: 'Emma Davis',
        lastMessage: 'When will the technician arrive?',
        lastMessageTime: '2024-01-15T13:15:00Z',
        unreadCount: 1,
        status: 'active' as const
      },
      {
        id: 'potential_customer_1',
        recipientType: 'potential_customer' as const,
        recipientId: 201,
        recipientPhone: '+61433333333',
        recipientName: 'Sarah Wilson',
        lastMessage: 'Hi Sarah! ServicePanda here! We noticed you might be looking for reliable service providers in your area. Reply YES to get started!',
        lastMessageTime: '2024-01-15T12:00:00Z',
        unreadCount: 0,
        status: 'active' as const
      },
      {
        id: 'potential_customer_2',
        recipientType: 'potential_customer' as const,
        recipientId: 202,
        recipientPhone: '+61444444444',
        recipientName: 'Michael Brown',
        lastMessage: 'Just following up on our previous message about ServicePanda\'s verified service providers.',
        lastMessageTime: '2024-01-15T11:45:00Z',
        unreadCount: 2,
        status: 'active' as const
      },
      {
        id: 'customer_3',
        recipientType: 'customer' as const,
        recipientId: 103,
        recipientPhone: '+61455555555',
        recipientName: 'Lisa Johnson',
        lastMessage: 'The service was completed successfully. Thank you!',
        lastMessageTime: '2024-01-15T10:20:00Z',
        unreadCount: 0,
        status: 'active' as const
      }
    ],
    providers: [
      {
        id: 'provider_1',
        recipientType: 'provider' as const,
        recipientId: 301,
        recipientPhone: '+61466666666',
        recipientName: 'Mike Johnson',
        lastMessage: 'New lead available in your area! Check your dashboard for details.',
        lastMessageTime: '2024-01-15T15:00:00Z',
        unreadCount: 1,
        status: 'active' as const
      },
      {
        id: 'provider_2',
        recipientType: 'provider' as const,
        recipientId: 302,
        recipientPhone: '+61477777777',
        recipientName: 'David Wilson',
        lastMessage: 'Your payment has been processed successfully.',
        lastMessageTime: '2024-01-15T14:45:00Z',
        unreadCount: 0,
        status: 'active' as const
      },
      {
        id: 'potential_provider_1',
        recipientType: 'potential_provider' as const,
        recipientId: 401,
        recipientPhone: '+61488888888',
        recipientName: 'Alex Thompson',
        lastMessage: 'Hi Alex! We received your application to join ServicePanda. We\'ll review it and get back to you within 24 hours.',
        lastMessageTime: '2024-01-15T13:30:00Z',
        unreadCount: 0,
        status: 'active' as const
      },
      {
        id: 'potential_provider_2',
        recipientType: 'potential_provider' as const,
        recipientId: 402,
        recipientPhone: '+61499999999',
        recipientName: 'Rachel Green',
        lastMessage: 'Thank you for your interest in ServicePanda! Please complete your profile verification.',
        lastMessageTime: '2024-01-15T12:15:00Z',
        unreadCount: 1,
        status: 'active' as const
      },
      {
        id: 'provider_3',
        recipientType: 'provider' as const,
        recipientId: 303,
        recipientPhone: '+61400000000',
        recipientName: 'Tom Anderson',
        lastMessage: 'Your service area has been updated successfully.',
        lastMessageTime: '2024-01-15T11:00:00Z',
        unreadCount: 0,
        status: 'active' as const
      }
    ]
  };

  // Dummy messages for each conversation
  const dummyMessages = {
    'customer_1': [
      {
        id: 1,
        recipientType: 'customer',
        recipientId: 101,
        recipientPhone: '+61412345678',
        recipientName: 'John Smith',
        message: 'Hi, I need a plumber for my kitchen sink.',
        direction: 'inbound',
        status: 'delivered',
        smsType: 'custom',
        sentBy: 'john.smith@email.com',
        sentAt: '2024-01-15T09:00:00Z',
        deliveredAt: '2024-01-15T09:01:00Z'
      },
      {
        id: 2,
        recipientType: 'customer',
        recipientId: 101,
        recipientPhone: '+61412345678',
        recipientName: 'John Smith',
        message: 'Hi John! We\'ve assigned a qualified plumber to your request. They will contact you within 2 hours.',
        direction: 'outbound',
        status: 'delivered',
        smsType: 'notification',
        sentBy: 'admin@servicepanda.com',
        sentAt: '2024-01-15T09:05:00Z',
        deliveredAt: '2024-01-15T09:06:00Z'
      },
      {
        id: 3,
        recipientType: 'customer',
        recipientId: 101,
        recipientPhone: '+61412345678',
        recipientName: 'John Smith',
        message: 'Great! What time should I expect them?',
        direction: 'inbound',
        status: 'delivered',
        smsType: 'custom',
        sentBy: 'john.smith@email.com',
        sentAt: '2024-01-15T09:10:00Z',
        deliveredAt: '2024-01-15T09:11:00Z'
      },
      {
        id: 4,
        recipientType: 'customer',
        recipientId: 101,
        recipientPhone: '+61412345678',
        recipientName: 'John Smith',
        message: 'The plumber will arrive between 11:00 AM and 1:00 PM today.',
        direction: 'outbound',
        status: 'delivered',
        smsType: 'notification',
        sentBy: 'admin@servicepanda.com',
        sentAt: '2024-01-15T09:15:00Z',
        deliveredAt: '2024-01-15T09:16:00Z'
      },
      {
        id: 5,
        recipientType: 'customer',
        recipientId: 101,
        recipientPhone: '+61412345678',
        recipientName: 'John Smith',
        message: 'Perfect! Thank you for the quick response.',
        direction: 'inbound',
        status: 'delivered',
        smsType: 'custom',
        sentBy: 'john.smith@email.com',
        sentAt: '2024-01-15T10:00:00Z',
        deliveredAt: '2024-01-15T10:01:00Z'
      },
      {
        id: 6,
        recipientType: 'customer',
        recipientId: 101,
        recipientPhone: '+61412345678',
        recipientName: 'John Smith',
        message: 'Thank you for using ServicePanda! How was your experience? Rate us 1-5 stars.',
        direction: 'outbound',
        status: 'delivered',
        smsType: 'custom',
        sentBy: 'admin@servicepanda.com',
        sentAt: '2024-01-15T14:30:00Z',
        deliveredAt: '2024-01-15T14:31:00Z'
      },
      {
        id: 7,
        recipientType: 'customer',
        recipientId: 101,
        recipientPhone: '+61412345678',
        recipientName: 'John Smith',
        message: 'Thank you for the service! It was excellent.',
        direction: 'inbound',
        status: 'delivered',
        smsType: 'custom',
        sentBy: 'john.smith@email.com',
        sentAt: '2024-01-15T14:30:00Z',
        deliveredAt: '2024-01-15T14:31:00Z'
      }
    ],
    'provider_1': [
      {
        id: 8,
        recipientType: 'provider',
        recipientId: 301,
        recipientPhone: '+61466666666',
        recipientName: 'Mike Johnson',
        message: 'Hi Mike! We have a new plumbing job in your area. Check your dashboard for details.',
        direction: 'outbound',
        status: 'delivered',
        smsType: 'notification',
        sentBy: 'system@servicepanda.com',
        sentAt: '2024-01-15T14:30:00Z',
        deliveredAt: '2024-01-15T14:31:00Z'
      },
      {
        id: 9,
        recipientType: 'provider',
        recipientId: 301,
        recipientPhone: '+61466666666',
        recipientName: 'Mike Johnson',
        message: 'Thanks! I can see the job details. I\'ll contact the customer right away.',
        direction: 'inbound',
        status: 'delivered',
        smsType: 'custom',
        sentBy: 'mike.johnson@email.com',
        sentAt: '2024-01-15T14:35:00Z',
        deliveredAt: '2024-01-15T14:36:00Z'
      },
      {
        id: 10,
        recipientType: 'provider',
        recipientId: 301,
        recipientPhone: '+61466666666',
        recipientName: 'Mike Johnson',
        message: 'Great! The customer has been notified. Please update the job status once completed.',
        direction: 'outbound',
        status: 'delivered',
        smsType: 'notification',
        sentBy: 'system@servicepanda.com',
        sentAt: '2024-01-15T14:40:00Z',
        deliveredAt: '2024-01-15T14:41:00Z'
      },
      {
        id: 11,
        recipientType: 'provider',
        recipientId: 301,
        recipientPhone: '+61466666666',
        recipientName: 'Mike Johnson',
        message: 'New lead available in your area! Check your dashboard for details.',
        direction: 'outbound',
        status: 'sent',
        smsType: 'notification',
        sentBy: 'system@servicepanda.com',
        sentAt: '2024-01-15T15:00:00Z'
      }
    ]
  };

  // Update conversations when tab changes
  useEffect(() => {
    const currentConversations = activeTab === 'customers' ? dummyData.customers : dummyData.providers;
    setConversations(currentConversations);
    
    // Reset selected conversation if it's not in the current tab
    if (selectedConversation && !currentConversations.find(c => c.id === selectedConversation.id)) {
      setSelectedConversation(null);
      setConversationMessages([]);
    }
  }, [activeTab]);

  // Load conversation messages when a conversation is selected
  useEffect(() => {
    if (selectedConversation && dummyMessages[selectedConversation.id as keyof typeof dummyMessages]) {
      setConversationMessages(dummyMessages[selectedConversation.id as keyof typeof dummyMessages]);
    } else {
      setConversationMessages([]);
    }
  }, [selectedConversation]);

  // Simulate loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

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
    if (!newMessage.trim() || !selectedConversation) return;
    
    // Add new message to conversation
    const newMsg: SmsMessage = {
      id: Date.now(),
      recipientType: selectedConversation.recipientType,
      recipientId: selectedConversation.recipientId,
      recipientPhone: selectedConversation.recipientPhone,
      recipientName: selectedConversation.recipientName,
      message: newMessage,
      direction: 'outbound',
      status: 'sent',
      smsType: 'custom',
      sentBy: 'admin@servicepanda.com',
      sentAt: new Date().toISOString()
    };
    
    setConversationMessages(prev => [...prev, newMsg]);
    
    // Update conversation last message
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? { ...conv, lastMessage: newMessage, lastMessageTime: new Date().toISOString() }
        : conv
    ));
    
    setNewMessage('');
  };

  const filteredConversations = conversations.filter(conv => 
    conv.recipientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.recipientPhone.includes(searchTerm) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
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
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SMS Conversations</h1>
              <p className="text-gray-600">Manage all SMS communications</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="customers">Customer Chats ({dummyData.customers.length})</TabsTrigger>
              <TabsTrigger value="providers">Provider Chats ({dummyData.providers.length})</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex">
          {/* Conversations List */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
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
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleConversationClick(conversation)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
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
              ))}
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
                          <span>{format(new Date(message.sentAt), 'HH:mm')}</span>
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
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
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
