import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [counter, setCounter] = useState(0);
  const [name, setName] = useState('');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
    flex: 1,
  };

  const textColor = isDarkMode ? '#ffffff' : '#000000';

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, {color: textColor}]}>
              Welcome to React Native!
            </Text>
            <Text style={[styles.subtitle, {color: textColor}]}>
              📱 A Simple Demo App
            </Text>
          </View>

          {/* Counter Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: textColor}]}>
              Counter Demo
            </Text>
            <Text style={[styles.counterText, {color: textColor}]}>
              Count: {counter}
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.incrementButton]}
                onPress={() => setCounter(counter + 1)}>
                <Text style={styles.buttonText}>+ Increment</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.decrementButton]}
                onPress={() => setCounter(counter - 1)}>
                <Text style={styles.buttonText}>- Decrement</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={() => setCounter(0)}>
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </View>

          {/* Text Input Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: textColor}]}>
              Input Demo
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  color: textColor,
                  borderColor: isDarkMode ? '#444' : '#ddd',
                  backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
                },
              ]}
              placeholder="Enter your name"
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              value={name}
              onChangeText={setName}
            />
            {name ? (
              <Text style={[styles.greeting, {color: textColor}]}>
                Hello, {name}! 👋
              </Text>
            ) : null}
          </View>

          {/* Info Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: textColor}]}>
              Learn More
            </Text>
            <Text style={[styles.infoText, {color: textColor}]}>
              This is a simple React Native app demonstrating:
            </Text>
            <Text style={[styles.bulletPoint, {color: textColor}]}>
              • State management with useState
            </Text>
            <Text style={[styles.bulletPoint, {color: textColor}]}>
              • Dark mode support
            </Text>
            <Text style={[styles.bulletPoint, {color: textColor}]}>
              • Interactive buttons and inputs
            </Text>
            <Text style={[styles.bulletPoint, {color: textColor}]}>
              • Responsive styling
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'rgba(100, 100, 100, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  counterText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  incrementButton: {
    backgroundColor: '#4CAF50',
  },
  decrementButton: {
    backgroundColor: '#f44336',
  },
  resetButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  greeting: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
  bulletPoint: {
    fontSize: 14,
    marginBottom: 5,
    lineHeight: 20,
  },
});

export default App;
