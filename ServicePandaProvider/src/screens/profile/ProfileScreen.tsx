const React = require('react');
const { View, StyleSheet, ScrollView, Alert, Animated, Dimensions, TouchableOpacity, Text } = require('react-native');
const { Card, Title, Paragraph, Button, Avatar, List, Divider } = require('react-native-paper');
const { useQuery, useQueryClient } = require('@tanstack/react-query');
// const { useNavigation } = require('@react-navigation/native'); // Temporarily commented out
const apiService = require('../../services/api');
const { useAuth } = require('../../contexts/AuthContext');
const { colors } = require('../../utils/theme');

const { width } = Dimensions.get('window');

interface ProfileScreenProps {
  onNavigate?: (screen: string) => void;
  onLogout?: () => void; // Deprecated - now using useAuth hook directly
}

function ProfileScreen({ onNavigate, onLogout }: ProfileScreenProps) {
  // const navigation = useNavigation(); // Temporarily commented out
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  const { data: profile, isLoading } = useQuery({
    queryKey: ['/api/provider/profile'],
    queryFn: () => apiService.getProfile(),
  });

  // Animation on mount
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogout = () => {
    console.log('🔍 Profile screen logout button pressed');
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🔍 Profile screen logout confirmed, starting logout process...');
              queryClient.clear();
              await logout();
              console.log('✅ Profile screen logout successful');
            } catch (error) {
              console.error('❌ Profile screen logout failed:', error);
            }
          }
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Title>Loading profile...</Title>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <Title>Error loading profile</Title>
        <Button onPress={() => queryClient.invalidateQueries()}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
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
        {/* Modern Profile Header */}
        <View style={styles.modernProfileCard}>
          <View style={styles.modernProfileContent}>
            <View style={styles.modernAvatarContainer}>
          <Avatar.Text 
                size={100} 
            label={`${profile.firstName?.[0] || 'P'}${profile.lastName?.[0] || 'R'}`}
                style={styles.modernAvatar}
              />
              <View style={styles.modernStatusBadge}>
                <Text style={styles.modernStatusText}>
                  {profile.status === 'approved' ? '✅' : '⏳'}
                </Text>
              </View>
            </View>
            <View style={styles.modernProfileInfo}>
              <Text style={styles.modernProfileName}>
              {profile.firstName} {profile.lastName}
              </Text>
              <Text style={styles.modernProfileEmail}>{profile.email}</Text>
              <View style={styles.modernStatusContainer}>
                <Text style={styles.modernStatusLabel}>
                  {profile.status === 'approved' ? 'Approved' : 'Pending Review'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Modern Business Information */}
        <View style={styles.modernInfoCard}>
          <View style={styles.modernInfoHeader}>
            <View style={styles.modernInfoIcon}>
              <Text style={styles.modernInfoEmoji}>🏢</Text>
            </View>
            <View style={styles.modernInfoInfo}>
              <Text style={styles.modernInfoTitle}>Business Information</Text>
              <Text style={styles.modernInfoSubtitle}>
                Your business details and contact information
              </Text>
            </View>
          </View>
          
          <View style={styles.modernInfoList}>
            <View style={styles.modernInfoItem}>
              <View style={styles.modernInfoItemIcon}>
                <Text style={styles.modernInfoItemEmoji}>🏪</Text>
              </View>
              <View style={styles.modernInfoItemContent}>
                <Text style={styles.modernInfoItemTitle}>Business Name</Text>
                <Text style={styles.modernInfoItemValue}>
                  {profile.businessName || 'Not specified'}
                </Text>
              </View>
            </View>
            
            <View style={styles.modernInfoDivider} />
            
            <View style={styles.modernInfoItem}>
              <View style={styles.modernInfoItemIcon}>
                <Text style={styles.modernInfoItemEmoji}>🆔</Text>
              </View>
              <View style={styles.modernInfoItemContent}>
                <Text style={styles.modernInfoItemTitle}>Business ABN</Text>
                <Text style={styles.modernInfoItemValue}>
                  {profile.businessAbn || 'Not specified'}
                </Text>
              </View>
            </View>
            
            <View style={styles.modernInfoDivider} />
            
            <View style={styles.modernInfoItem}>
              <View style={styles.modernInfoItemIcon}>
                <Text style={styles.modernInfoItemEmoji}>📱</Text>
              </View>
              <View style={styles.modernInfoItemContent}>
                <Text style={styles.modernInfoItemTitle}>Mobile Number</Text>
                <Text style={styles.modernInfoItemValue}>
                  {profile.mobileNumber || 'Not specified'}
                </Text>
              </View>
            </View>
            
            <View style={styles.modernInfoDivider} />
            
            <View style={styles.modernInfoItem}>
              <View style={styles.modernInfoItemIcon}>
                <Text style={styles.modernInfoItemEmoji}>📍</Text>
              </View>
              <View style={styles.modernInfoItemContent}>
                <Text style={styles.modernInfoItemTitle}>Address</Text>
                <Text style={styles.modernInfoItemValue}>
                  {profile.address || 'Not specified'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Modern Account Status */}
        <View style={styles.modernStatusCard}>
          <View style={styles.modernStatusHeader}>
            <View style={styles.modernStatusIcon}>
              <Text style={styles.modernStatusEmoji}>📊</Text>
            </View>
            <View style={styles.modernStatusInfo}>
              <Text style={styles.modernStatusTitle}>Account Status</Text>
              <Text style={styles.modernStatusSubtitle}>
                Your account status and verification details
              </Text>
            </View>
          </View>
          
          <View style={styles.modernStatusList}>
            <View style={styles.modernStatusItem}>
              <View style={styles.modernStatusItemIcon}>
                <Text style={styles.modernStatusItemEmoji}>👤</Text>
              </View>
              <View style={styles.modernStatusItemContent}>
                <Text style={styles.modernStatusItemTitle}>Provider Status</Text>
                <View style={styles.modernStatusItemValueContainer}>
                  <Text style={[
                    styles.modernStatusItemValue,
                    profile.providerStatus === 'activated' ? styles.modernStatusActive : styles.modernStatusInactive
                  ]}>
                    {profile.providerStatus === 'activated' ? '✅ Activated' : '❌ Deactivated'}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.modernStatusDivider} />
            
            <View style={styles.modernStatusItem}>
              <View style={styles.modernStatusItemIcon}>
                <Text style={styles.modernStatusItemEmoji}>📄</Text>
              </View>
              <View style={styles.modernStatusItemContent}>
                <Text style={styles.modernStatusItemTitle}>Documents Uploaded</Text>
                <View style={styles.modernStatusItemValueContainer}>
                  <Text style={[
                    styles.modernStatusItemValue,
                    profile.documentsUploaded ? styles.modernStatusActive : styles.modernStatusInactive
                  ]}>
                    {profile.documentsUploaded ? '✅ Complete' : '❌ Incomplete'}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.modernStatusDivider} />
            
            <View style={styles.modernStatusItem}>
              <View style={styles.modernStatusItemIcon}>
                <Text style={styles.modernStatusItemEmoji}>✅</Text>
              </View>
              <View style={styles.modernStatusItemContent}>
                <Text style={styles.modernStatusItemTitle}>Terms Accepted</Text>
                <View style={styles.modernStatusItemValueContainer}>
                  <Text style={[
                    styles.modernStatusItemValue,
                    profile.termsAccepted ? styles.modernStatusActive : styles.modernStatusInactive
                  ]}>
                    {profile.termsAccepted ? '✅ Accepted' : '❌ Not Accepted'}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.modernStatusDivider} />
            
            <View style={styles.modernStatusItem}>
              <View style={styles.modernStatusItemIcon}>
                <Text style={styles.modernStatusItemEmoji}>⭐</Text>
              </View>
              <View style={styles.modernStatusItemContent}>
                <Text style={styles.modernStatusItemTitle}>Rating</Text>
                <Text style={styles.modernStatusItemValue}>
                  {profile.rating || '5.0'} ⭐ ({profile.totalReviews || 0} reviews)
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Modern Account Actions */}
        <View style={styles.modernActionsCard}>
          <View style={styles.modernActionsHeader}>
            <View style={styles.modernActionsIcon}>
              <Text style={styles.modernActionsEmoji}>⚙️</Text>
            </View>
            <View style={styles.modernActionsInfo}>
              <Text style={styles.modernActionsTitle}>Account Actions</Text>
              <Text style={styles.modernActionsSubtitle}>
                Manage your account settings and preferences
              </Text>
            </View>
          </View>
          
          <View style={styles.modernActionsList}>
            <TouchableOpacity 
              style={styles.modernActionButton}
              onPress={() => onNavigate?.('personalDetails')}
              activeOpacity={0.7}
            >
              <View style={styles.modernActionIcon}>
                <Text style={styles.modernActionEmoji}>✏️</Text>
              </View>
              <View style={styles.modernActionContent}>
                <Text style={styles.modernActionTitle}>Edit Profile</Text>
                <Text style={styles.modernActionSubtitle}>Update your personal information</Text>
              </View>
              <Text style={styles.modernActionArrow}>›</Text>
            </TouchableOpacity>
            
            {/* <View style={styles.modernActionDivider} />
            
            <TouchableOpacity 
              style={styles.modernActionButton}
              onPress={() => onNavigate?.('changePassword')}
              activeOpacity={0.7}
            >
              <View style={styles.modernActionIcon}>
                <Text style={styles.modernActionEmoji}>🔒</Text>
              </View>
              <View style={styles.modernActionContent}>
                <Text style={styles.modernActionTitle}>Change Password</Text>
                <Text style={styles.modernActionSubtitle}>Update your account password</Text>
              </View>
              <Text style={styles.modernActionArrow}>›</Text>
            </TouchableOpacity>
            
            <View style={styles.modernActionDivider} /> */}
            
            <TouchableOpacity 
              style={styles.modernActionButton}
            onPress={() => {/* Navigate to notifications */}}
              activeOpacity={0.7}
            >
              <View style={styles.modernActionIcon}>
                <Text style={styles.modernActionEmoji}>🔔</Text>
              </View>
              <View style={styles.modernActionContent}>
                <Text style={styles.modernActionTitle}>Notification Settings</Text>
                <Text style={styles.modernActionSubtitle}>Manage your notification preferences</Text>
              </View>
              <Text style={styles.modernActionArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modern Logout Button */}
        <View style={styles.modernLogoutCard}>
          <TouchableOpacity 
            style={styles.modernLogoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <View style={styles.modernLogoutIcon}>
              <Text style={styles.modernLogoutEmoji}>🚪</Text>
            </View>
            <Text style={styles.modernLogoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  animatedContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  // Modern Profile Header
  modernProfileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  modernProfileContent: {
    alignItems: 'center',
  },
  modernAvatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  modernAvatar: {
    backgroundColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  modernStatusBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modernStatusText: {
    fontSize: 16,
  },
  modernProfileInfo: {
    alignItems: 'center',
  },
  modernProfileName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  modernProfileEmail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  modernStatusContainer: {
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modernStatusLabel: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  // Modern Info Card
  modernInfoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  modernInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modernInfoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modernInfoEmoji: {
    fontSize: 24,
  },
  modernInfoInfo: {
    flex: 1,
  },
  modernInfoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  modernInfoSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    lineHeight: 20,
  },
  modernInfoList: {
    gap: 0,
  },
  modernInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  modernInfoItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modernInfoItemEmoji: {
    fontSize: 20,
  },
  modernInfoItemContent: {
    flex: 1,
  },
  modernInfoItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.1,
  },
  modernInfoItemValue: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  modernInfoDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: 56,
  },
  // Modern Status Card
  modernStatusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  modernStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modernStatusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modernStatusEmoji: {
    fontSize: 24,
  },
  modernStatusInfo: {
    flex: 1,
  },
  modernStatusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  modernStatusSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    lineHeight: 20,
  },
  modernStatusList: {
    gap: 0,
  },
  modernStatusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  modernStatusItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modernStatusItemEmoji: {
    fontSize: 20,
  },
  modernStatusItemContent: {
    flex: 1,
  },
  modernStatusItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.1,
  },
  modernStatusItemValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modernStatusItemValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  modernStatusActive: {
    color: colors.success,
  },
  modernStatusInactive: {
    color: colors.error,
  },
  modernStatusDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: 56,
  },
  // Modern Actions Card
  modernActionsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  modernActionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modernActionsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modernActionsEmoji: {
    fontSize: 24,
  },
  modernActionsInfo: {
    flex: 1,
  },
  modernActionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  modernActionsSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    lineHeight: 20,
  },
  modernActionsList: {
    gap: 0,
  },
  modernActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  modernActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modernActionEmoji: {
    fontSize: 20,
  },
  modernActionContent: {
    flex: 1,
  },
  modernActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
    letterSpacing: -0.1,
  },
  modernActionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  modernActionArrow: {
    fontSize: 20,
    color: colors.textSecondary,
    fontWeight: '300',
  },
  modernActionDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: 56,
  },
  // Modern Logout Card
  modernLogoutCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  modernLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error + '15',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  modernLogoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.error + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modernLogoutEmoji: {
    fontSize: 20,
  },
  modernLogoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.error,
    letterSpacing: 0.5,
  },
  profileCard: {
    margin: 12,
    elevation: 1,
  },
  profileContent: {
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    marginBottom: 12,
    backgroundColor: colors.primary,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  profileEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 3,
  },
  profileStatus: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  infoCard: {
    margin: 12,
    marginTop: 0,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  actionButton: {
    marginBottom: 10,
    borderColor: colors.primary,
  },
  logoutCard: {
    margin: 12,
    marginTop: 0,
    elevation: 1,
  },
  logoutButton: {
    marginTop: 6,
  },
});

module.exports = ProfileScreen;







