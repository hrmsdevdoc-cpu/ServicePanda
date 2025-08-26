const React = require('react');
const { View, Text, StyleSheet, ScrollView } = require('react-native');
const { Card, Title, Paragraph } = require('react-native-paper');
const { colors } = require('../../utils/theme');

const LeadDetailsScreen = ({ onNavigate, onBack }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Lead Details</Title>
            <Paragraph style={styles.description}>
              Detailed information about the selected lead will appear here.
            </Paragraph>
            
            <View style={styles.infoSection}>
              <Text style={styles.label}>Lead ID:</Text>
              <Text style={styles.value}>#12345</Text>
            </View>
            
            <View style={styles.infoSection}>
              <Text style={styles.label}>Status:</Text>
              <Text style={styles.value}>Active</Text>
            </View>
            
            <View style={styles.infoSection}>
              <Text style={styles.label}>Customer:</Text>
              <Text style={styles.value}>John Doe</Text>
            </View>
            
            <View style={styles.infoSection}>
              <Text style={styles.label}>Service:</Text>
              <Text style={styles.value}>Plumbing</Text>
            </View>
            
            <View style={styles.infoSection}>
              <Text style={styles.label}>Location:</Text>
              <Text style={styles.value}>123 Main St, City</Text>
            </View>
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
});

module.exports = LeadDetailsScreen;
