const React = require('react');
const { useState } = require('react');
const { View, StyleSheet, ScrollView, TouchableOpacity, Text, RefreshControl, Animated, Linking, Alert } = require('react-native');
const { Title, Paragraph, Card, Button, Chip, ActivityIndicator } = require('react-native-paper');
const { useQuery } = require('@tanstack/react-query');
const apiService = require('../../services/api');
const { colors } = require('../../utils/theme');
const LeadDetailsModal = require('../../components/LeadDetailsModal');
const CloseLeadModal = require('../../components/CloseLeadModal');

function ActiveLeadsScreen({ onNavigate }: { onNavigate: (screen: string, params?: any) => void }) {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const [showCloseLead, setShowCloseLead] = useState(false);

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

  // Fetch active leads from API
  const { data: activeLeads = [], isLoading: leadsLoading, refetch: refetchLeads } = useQuery({
    queryKey: ['/api/provider/leads'],
    queryFn: () => apiService.getLeads(),
    retry: false,
  });

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetchLeads();
    setRefreshing(false);
  }, [refetchLeads]);

  // Modal handlers
  const handleLeadDetails = (lead: any) => {
    setSelectedLead(lead);
    setShowLeadDetails(true);
  };

  const handleCloseLead = (lead: any) => {
    setSelectedLead(lead);
    setShowCloseLead(true);
  };

  const handleCloseLeadConfirm = async (isJobBooked: boolean) => {
    try {
      console.log('Closing lead:', selectedLead?.requestId || selectedLead?.id, 'Job booked:', isJobBooked);
      await apiService.closeLead(selectedLead?.requestId || selectedLead?.id, isJobBooked);
      await refetchLeads(); // Refresh the leads list
      Alert.alert('Success', 'Lead closed successfully!');
    } catch (error) {
      console.error('Error closing lead:', error);
      Alert.alert('Error', 'Failed to close lead. Please try again.');
    }
  };

  // Contact action handlers
  const handleCallCustomer = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleSendSMS = (phone: string) => {
    Linking.openURL(`sms:${phone}`);
  };

  const handleSendEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  // Fetch lead statuses for accurate filtering
  const [leadStatuses, setLeadStatuses] = React.useState<{[leadId: number]: string}>({});
  
  // Fetch lead statuses when leads change
  React.useEffect(() => {
    const fetchLeadStatuses = async () => {
      if (activeLeads.length > 0) {
        const statusPromises = activeLeads
          .filter((l: any) => l.status === 'purchased')
          .map(async (lead: any) => {
            try {
              const response = await apiService.request('GET', `/api/provider/leads/${lead.requestId}/status`);
              return { leadId: lead.requestId, status: response.status || 'new' };
            } catch (error) {
              console.error(`Failed to fetch status for lead ${lead.requestId}:`, error);
              return { leadId: lead.requestId, status: 'new' };
            }
          });
        
        const statusResults = await Promise.all(statusPromises);
        const statusMap = statusResults.reduce((acc, { leadId, status }) => {
          acc[leadId] = status;
          return acc;
        }, {} as {[leadId: number]: string});
        
        setLeadStatuses(statusMap);
      }
    };

    fetchLeadStatuses();
  }, [activeLeads]);

  const getLeadStatus = (leadId: number) => {
    return leadStatuses[leadId] || 'new';
  };

  // Filter active leads (status === 'purchased' only - avoid async filtering that causes count issues)
  const purchasedLeads = activeLeads.filter((lead: any) => lead.status === 'purchased');

  // Debug logging to see what leads we're getting
  React.useEffect(() => {
    console.log('🔍 ACTIVE LEADS SCREEN DEBUG:');
    console.log(`  Total leads: ${activeLeads.length}`);
    console.log(`  Purchased leads: ${purchasedLeads.length}`);
    console.log('  All lead statuses:', activeLeads.map(l => ({ id: l.requestId, status: l.status, category: l.categoryName })));
    console.log('  Purchased leads:', purchasedLeads.map(l => ({ id: l.requestId, status: l.status, category: l.categoryName })));
  }, [activeLeads, purchasedLeads]);

  // Animation effects on mount
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        {/* Modern Header */}
        <View style={styles.modernHeader}>
          <View style={styles.headerContent}>
            <Text style={styles.modernTitle}>Active Leads ({purchasedLeads.length})</Text>
            <Text style={styles.modernSubtitle}>Manage your current projects</Text>
          </View>
          <View style={styles.headerIcon}>
            <Text style={styles.headerEmoji}>⚡</Text>
          </View>
        </View>

        {/* Loading State */}
        {leadsLoading ? (
          <View style={styles.modernLoadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.modernLoadingText}>Loading active leads...</Text>
          </View>
        ) : (
          <>
            {/* Modern Summary Stats */}
            <View style={styles.modernStatsContainer}>
              <View style={styles.statsGrid}>
                <View style={[styles.modernStatCard, styles.primaryStatCard]}>
                  <View style={styles.statIconWrapper}>
                    <Text style={styles.statIcon}>📋</Text>
                  </View>
                  <Text style={styles.modernStatNumber}>{purchasedLeads.length}</Text>
                  <Text style={styles.modernStatLabel}>Active Projects</Text>
                </View>

                <View style={[styles.modernStatCard, styles.secondaryStatCard]}>
                  <View style={styles.statIconWrapper}>
                    <Text style={styles.statIcon}>💰</Text>
                  </View>
                  <Text style={styles.modernStatNumber}>
                    ${purchasedLeads.reduce((sum: number, lead: any) => {
                      const budget = lead.budget || 0;
                      return sum + budget;
                    }, 0).toLocaleString()}
                  </Text>
                  <Text style={styles.modernStatLabel}>Total Value</Text>
                </View>
              </View>

              <View style={[styles.modernStatCard, styles.tertiaryStatCard, styles.fullWidthCard]}>
                <View style={styles.statIconWrapper}>
                  <Text style={styles.statIcon}>💳</Text>
                </View>
                <Text style={styles.modernStatNumber}>
                  ${purchasedLeads.reduce((sum: number, lead: any) => {
                    const leadCost = lead.leadCost || 0;
                    return sum + leadCost;
                  }, 0).toLocaleString()}
                </Text>
                <Text style={styles.modernStatLabel}>Total Lead Cost</Text>
              </View>
            </View>

            {/* Modern Active Leads List */}
            <View style={styles.modernLeadsContainer}>
              {purchasedLeads.length === 0 ? (
                <View style={styles.modernEmptyContainer}>
                  <View style={styles.emptyIconContainer}>
                    <Text style={styles.emptyIcon}>📋</Text>
                  </View>
                  <Text style={styles.modernEmptyTitle}>No Active Leads</Text>
                  <Text style={styles.modernEmptyText}>You don't have any active leads yet.</Text>
                  <TouchableOpacity 
                    style={styles.exploreButton}
                    onPress={() => onNavigate('newLeads')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.exploreButtonText}>Browse New Leads</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                purchasedLeads.map((lead: any) => (
                  <View key={lead.requestId || lead.id} style={styles.modernLeadCard}>
                    {/* Lead Header */}
                    <View style={styles.leadCardHeader}>
                      <View style={styles.leadTitleSection}>
                        <Text style={styles.modernLeadTitle}>
                          {lead.categoryName} - {lead.suburb?.toUpperCase() || 'LOCATION'}
                        </Text>
                        {/* New badge for recently purchased leads */}
                        {lead.createdAt && new Date(lead.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000) && (
                          <View style={styles.newBadge}>
                            <Text style={styles.newBadgeText}>New</Text>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Customer Info with Details Button */}
                    <View style={styles.customerInfoRow}>
                      <View style={styles.customerInfo}>
                        <Text style={styles.customerName}>
                          {lead.customerName || 'Customer Name N/A'} - {lead.customerPhone || 'N/A'}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.detailsButton}
                        onPress={() => handleLeadDetails(lead)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.detailsButtonIcon}>📄</Text>
                        <Text style={styles.detailsButtonText}>Details</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Action Buttons Row */}
                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={styles.closeLeadButton}
                        onPress={() => handleCloseLead(lead)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.closeLeadIcon}>✕</Text>
                        <Text style={styles.closeLeadText}>Close Lead</Text>
                      </TouchableOpacity>

                      {/* Contact Icons */}
                      <View style={styles.contactIcons}>
                        <TouchableOpacity
                          style={styles.contactIcon}
                          onPress={() => handleCallCustomer(lead.customerPhone)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.contactIconText}>📞</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.contactIcon}
                          onPress={() => handleSendSMS(lead.customerPhone)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.contactIconText}>💬</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.contactIcon}
                          onPress={() => handleSendEmail(lead.customerEmail)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.contactIconText}>✉️</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
          </>
        )}
      </Animated.View>

      {/* Lead Details Modal */}
      <LeadDetailsModal
        visible={showLeadDetails}
        lead={selectedLead}
        onClose={() => setShowLeadDetails(false)}
        onCallCustomer={handleCallCustomer}
        onSendSMS={handleSendSMS}
        onSendEmail={handleSendEmail}
      />

      {/* Close Lead Modal */}
      <CloseLeadModal
        visible={showCloseLead}
        lead={selectedLead}
        onClose={() => setShowCloseLead(false)}
        onConfirm={handleCloseLeadConfirm}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  animatedContainer: {
    flex: 1,
  },
  // Modern Header
  modernHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  headerContent: {
    flex: 1,
  },
  modernTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  modernSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.success + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 28,
  },
  // Modern Loading Container
  modernLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  modernLoadingText: {
    marginTop: 16,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  // Modern Stats Container
  modernStatsContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  modernStatCard: {
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    alignItems: 'center',
    flex: 1,
  },
  fullWidthCard: {
    flex: 1,
  },
  primaryStatCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  secondaryStatCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.success + '20',
  },
  tertiaryStatCard: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.warning + '20',
  },
  statIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statIcon: {
    fontSize: 20,
  },
  modernStatNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -1,
    textAlign: 'center',
  },
  modernStatLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  // Modern Leads Container
  modernLeadsContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  modernLeadCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  leadCardHeader: {
    marginBottom: 12,
  },
  leadTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modernLeadTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  newBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  customerInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  closeLeadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error + '10',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  closeLeadIcon: {
    fontSize: 14,
    color: colors.error,
    marginRight: 6,
  },
  closeLeadText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.error,
  },
  contactIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  contactIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactIconText: {
    fontSize: 16,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  detailsButtonIcon: {
    fontSize: 14,
    color: '#ffffff',
    marginRight: 6,
  },
  detailsButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  // Modern Empty Container
  modernEmptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.textSecondary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 32,
    opacity: 0.6,
  },
  modernEmptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  modernEmptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  exploreButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});

module.exports = ActiveLeadsScreen;








