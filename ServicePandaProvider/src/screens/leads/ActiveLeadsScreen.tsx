const React = require('react');
const { useState } = require('react');
const { View, StyleSheet, ScrollView, TouchableOpacity, Text, RefreshControl, Animated } = require('react-native');
const { Title, Paragraph, Card, Button, Chip, ActivityIndicator } = require('react-native-paper');
const { useQuery } = require('@tanstack/react-query');
const apiService = require('../../services/api');
const { colors } = require('../../utils/theme');

function ActiveLeadsScreen({ onNavigate }) {
  const [refreshing, setRefreshing] = useState(false);

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

  // Filter active leads (status === 'purchased')
  const purchasedLeads = activeLeads.filter(lead => lead.status === 'purchased');

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
                    ${purchasedLeads.reduce((sum, lead) => {
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
                  ${purchasedLeads.reduce((sum, lead) => {
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
                purchasedLeads.map((lead) => (
                  <TouchableOpacity 
                    key={lead.requestId || lead.id} 
                    style={styles.modernLeadCard}
                    activeOpacity={0.9}
                  >
                    <View style={styles.leadCardHeader}>
                      <View style={styles.leadTitleSection}>
                        <Text style={styles.modernLeadTitle}>
                          {lead.categoryName} - {lead.suburb?.toUpperCase() || 'LOCATION'}
                        </Text>
                        <View style={styles.statusBadge}>
                          <Text style={styles.statusText}>
                            {lead.status === 'purchased' ? 'Active' : lead.status}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.leadBudgetSection}>
                        <Text style={styles.budgetLabel}>Budget</Text>
                        <Text style={styles.modernBudgetAmount}>${lead.budget || 'N/A'}</Text>
                      </View>
                    </View>

                    <Text style={styles.modernLeadDescription}>{lead.description}</Text>

                    <View style={styles.modernLeadDetails}>
                      <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailIcon}>👤</Text>
                          <Text style={styles.detailText}>
                            {lead.customerName || 'Customer Name N/A'}
                          </Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailIcon}>📍</Text>
                          <Text style={styles.detailText}>
                            {lead.suburb}, {lead.postcode}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailIcon}>📅</Text>
                          <Text style={styles.detailText}>
                            Created: {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
                          </Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailIcon}>💰</Text>
                          <Text style={styles.detailText}>
                            Lead Cost: ${lead.leadCost || 0}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.modernLeadActions}>
                      <TouchableOpacity
                        style={styles.modernActionButton}
                        onPress={() => onNavigate('leadDetails')}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.actionButtonText}>View Details</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.modernUpdateButton}
                        onPress={() => console.log('Update progress for lead:', lead.requestId || lead.id)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.updateButtonText}>Update Progress</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </>
        )}
      </Animated.View>
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
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  leadCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  leadTitleSection: {
    flex: 1,
    marginRight: 16,
  },
  modernLeadTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.success,
  },
  leadBudgetSection: {
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  modernBudgetAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.success,
  },
  modernLeadDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  modernLeadDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  detailText: {
    fontSize: 13,
    color: colors.text,
    flex: 1,
  },
  modernLeadActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modernActionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  modernUpdateButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  updateButtonText: {
    fontSize: 14,
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








