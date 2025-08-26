const React = require('react');
const { View, StyleSheet, ScrollView, Alert } = require('react-native');
const { Card, Title, Paragraph, Button, Avatar, List, Divider } = require('react-native-paper');
const { useQuery, useQueryClient } = require('@tanstack/react-query');
// const { useNavigation } = require('@react-navigation/native'); // Temporarily commented out
const apiService = require('../../services/api');
const { colors } = require('../../utils/theme');

function ProfileScreen({ onNavigate, onLogout }) {
  // const navigation = useNavigation(); // Temporarily commented out
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['/api/provider/profile'],
    queryFn: () => apiService.getProfile(),
  });

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            queryClient.clear();
            onLogout();
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
      {/* Profile Header */}
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text 
            size={80} 
            label={`${profile.firstName?.[0] || 'P'}${profile.lastName?.[0] || 'R'}`}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Title style={styles.profileName}>
              {profile.firstName} {profile.lastName}
            </Title>
            <Paragraph style={styles.profileEmail}>{profile.email}</Paragraph>
            <Paragraph style={styles.profileStatus}>
              Status: {profile.status === 'approved' ? '✅ Approved' : '⏳ Pending'}
            </Paragraph>
          </View>
        </Card.Content>
      </Card>

      {/* Business Information */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Business Information</Title>
          
          <List.Item
            title="Business Name"
            description={profile.businessName || 'Not specified'}
            left={props => <List.Icon {...props} icon="store" />}
          />
          
          <Divider />
          
          <List.Item
            title="Business ABN"
            description={profile.businessAbn || 'Not specified'}
            left={props => <List.Icon {...props} icon="card-account-details" />}
          />
          
          <Divider />
          
          <List.Item
            title="Mobile Number"
            description={profile.mobileNumber || 'Not specified'}
            left={props => <List.Icon {...props} icon="phone" />}
          />
          
          <Divider />
          
          <List.Item
            title="Address"
            description={profile.address || 'Not specified'}
            left={props => <List.Icon {...props} icon="map-marker" />}
          />
        </Card.Content>
      </Card>

      {/* Account Status */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Account Status</Title>
          
          <List.Item
            title="Provider Status"
            description={profile.providerStatus === 'activated' ? '✅ Activated' : '❌ Deactivated'}
            left={props => <List.Icon {...props} icon="account-check" />}
          />
          
          <Divider />
          
          <List.Item
            title="Documents Uploaded"
            description={profile.documentsUploaded ? '✅ Complete' : '❌ Incomplete'}
            left={props => <List.Icon {...props} icon="file-document" />}
          />
          
          <Divider />
          
          <List.Item
            title="Terms Accepted"
            description={profile.termsAccepted ? '✅ Accepted' : '❌ Not Accepted'}
            left={props => <List.Icon {...props} icon="check-circle" />}
          />
          
          <Divider />
          
          <List.Item
            title="Rating"
            description={`${profile.rating || '5.0'} ⭐ (${profile.totalReviews || 0} reviews)`}
            left={props => <List.Icon {...props} icon="star" />}
          />
        </Card.Content>
      </Card>

      {/* Account Actions */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Account Actions</Title>
          
          <Button
            mode="outlined"
            onPress={() => {/* Navigate to edit profile */}}
            style={styles.actionButton}
            icon="account-edit"
          >
            Edit Profile
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => {/* Navigate to change password */}}
            style={styles.actionButton}
            icon="lock-reset"
          >
            Change Password
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => {/* Navigate to notifications */}}
            style={styles.actionButton}
            icon="bell"
          >
            Notification Settings
          </Button>
        </Card.Content>
      </Card>

      {/* Logout Button */}
      <Card style={styles.logoutCard}>
        <Card.Content>
                     <Button
             mode="contained"
             onPress={handleLogout}
             style={styles.logoutButton}
             icon="logout"
             buttonColor={colors.error}
           >
             Logout
           </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    padding: 24,
  },
  profileCard: {
    margin: 16,
    elevation: 2,
  },
  profileContent: {
    alignItems: 'center',
    padding: 24,
  },
  avatar: {
    marginBottom: 16,
    backgroundColor: colors.primary,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 12,
    borderColor: colors.primary,
  },
  logoutCard: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  logoutButton: {
    marginTop: 8,
  },
});

module.exports = ProfileScreen;







