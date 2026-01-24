import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {api} from '../api/api';
import {ScreenHeader} from '../components';

export function SubmitUrlScreen() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!url.trim()) {
      Toast.show({
        type: 'error',
        text1: 'URL required',
        text2: 'Please enter a valid URL',
      });
      return;
    }

    setIsLoading(true);
    const {error} = await api.submitUrl(url);

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Submission failed',
        text2: error,
      });
    } else {
      setSubmitted(true);
      Toast.show({
        type: 'success',
        text1: 'URL submitted successfully!',
        text2: 'Processing manga data...',
      });
      setTimeout(() => {
        setUrl('');
        setSubmitted(false);
      }, 3000);
    }

    setIsLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <ScreenHeader
          title="Submit URL"
          subtitle="Add new manga to your collection"
          icon="+"
        />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Manga URL</Text>
          <Text style={styles.cardDescription}>
            Enter a manga website URL to add it to your tracking list
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Website URL</Text>
            <TextInput
              style={styles.input}
              placeholder="https://example.com/manga/..."
              placeholderTextColor="#71717a"
              value={url}
              onChangeText={setUrl}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading && !submitted}
            />
            <Text style={styles.hint}>
              Supported sites: MangaDex, MangaPlus, and more
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              (isLoading || submitted) && styles.buttonDisabled,
              submitted && styles.buttonSuccess,
            ]}
            onPress={handleSubmit}
            disabled={isLoading || submitted}>
            {isLoading ? (
              <Text style={styles.buttonText}>Processing...</Text>
            ) : submitted ? (
              <Text style={styles.buttonText}>Submitted!</Text>
            ) : (
              <Text style={styles.buttonText}>Submit URL</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How it works</Text>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Submit URL</Text>
              <Text style={styles.stepDescription}>
                Paste the URL of the manga page you want to track
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Processing</Text>
              <Text style={styles.stepDescription}>
                Backend extracts manga information and chapter list
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Track Progress</Text>
              <Text style={styles.stepDescription}>
                Start tracking your reading progress across all chapters
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  scrollContent: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#71717a',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#27272a',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#3f3f46',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  hint: {
    fontSize: 12,
    color: '#71717a',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#7c3aed',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonSuccess: {
    backgroundColor: '#22c55e',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  step: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7c3aed',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: 13,
    color: '#71717a',
  },
});
