import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Paragraph, Card } from 'react-native-paper';
const { colors } = require('../../utils/theme');

const ServicesScreen = () => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Services Overview</Title>
          <Paragraph>Manage your service offerings and categories</Paragraph>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Service Categories</Title>
          <Paragraph>Plumbing, Electrical, Cleaning, and more</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Service Areas</Title>
          <Paragraph>Configure your service coverage locations</Paragraph>
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
    marginBottom: 16,
  },
});

module.exports = ServicesScreen;







