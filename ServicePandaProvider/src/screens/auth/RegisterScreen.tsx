import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Paragraph, Card } from 'react-native-paper';
import { colors } from '../../utils/theme';

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Provider Registration</Title>
          <Paragraph>Register as a new service provider here.</Paragraph>
        </Card.Content>
      </Card>
    </View>
  );
}

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











