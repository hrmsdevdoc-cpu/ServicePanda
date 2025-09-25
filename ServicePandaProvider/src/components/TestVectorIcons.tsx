const React = require('react');
const { View, Text, StyleSheet } = require('react-native');
// Import vector icons like customer app
const Icon = require('react-native-vector-icons/MaterialIcons').default;

const TestVectorIcons = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vector Icons Test</Text>
      
      <View style={styles.iconRow}>
        <Icon name="home" size={30} color="#3B82F6" />
        <Text style={styles.label}>Home</Text>
      </View>
      
      <View style={styles.iconRow}>
        <Icon name="assignment" size={30} color="#10B981" />
        <Text style={styles.label}>Assignment</Text>
      </View>
      
      <View style={styles.iconRow}>
        <Icon name="build" size={30} color="#F59E0B" />
        <Text style={styles.label}>Build</Text>
      </View>
      
      <View style={styles.iconRow}>
        <Icon name="person" size={30} color="#EF4444" />
        <Text style={styles.label}>Person</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#1f2937',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    marginLeft: 15,
    fontSize: 18,
    color: '#374151',
  },
});

module.exports = TestVectorIcons;
