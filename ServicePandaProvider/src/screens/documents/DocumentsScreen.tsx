const React = require('react');
const { View, StyleSheet } = require('react-native');
const { Title, Paragraph, Card } = require('react-native-paper');
const { colors } = require('../../utils/theme');

const DocumentsScreen = ({ onNavigate, onBack }) => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Document Management</Title>
          <Paragraph>Upload and manage your business documents here.</Paragraph>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  card: {
    elevation: 2,
  },
});

module.exports = DocumentsScreen;







