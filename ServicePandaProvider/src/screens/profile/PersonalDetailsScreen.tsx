const React = require('react');
const { View, Text, StyleSheet, ScrollView } = require('react-native');
const { Card, Title, Paragraph, Button } = require('react-native-paper');
const { colors } = require('../../utils/theme');

const PersonalDetailsScreen = ({ onNavigate, onBack }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Personal Details</Title>
            <Paragraph style={styles.description}>
              Update your personal information and contact details.
            </Paragraph>
            
            <View style={styles.infoSection}>
              <Text style={styles.label}>First Name:</Text>
              <Text style={styles.value}>John</Text>
            </View>
            
            <View style={styles.infoSection}>
              <Text style={styles.label}>Last Name:</Text>
              <Text style={styles.value}>Doe</Text>
            </View>
            
            <View style={styles.infoSection}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>john.doe@example.com</Text>
            </View>
            
            <View style={styles.infoSection}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>+1 (555) 123-4567</Text>
            </View>
            
            <View style={styles.infoSection}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>123 Business St, City, State 12345</Text>
            </View>
            
            <Button 
              mode="contained" 
              style={styles.editButton}
              onPress={() => {
                // TODO: Implement edit functionality
              }}
            >
              Edit Details
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  card: {
    elevation: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  value: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  editButton: {
    marginTop: 24,
    backgroundColor: colors.primary,
  },
});

module.exports = PersonalDetailsScreen;
