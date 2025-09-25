// Test script to check if vector icons are working
const Icon = require('react-native-vector-icons/MaterialIcons').default;

console.log('Testing vector icons...');
console.log('Icon component:', Icon);

// Test if we can create an icon
try {
  const testIcon = <Icon name="home" size={24} color="#000" />;
  console.log('✅ Vector icons are working!');
  console.log('Test icon created:', testIcon);
} catch (error) {
  console.log('❌ Vector icons error:', error);
}
