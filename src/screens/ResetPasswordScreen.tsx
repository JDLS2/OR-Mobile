import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {api} from '../api/api';
import {useAuth} from '../contexts/AuthContext';
import {RootStackParamList} from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function ResetPasswordScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {logout} = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Invalid password',
        text2: 'Password must be at least 6 characters',
      });
      return;
    }

    setIsLoading(true);
    const {data, error, statusCode} = await api.resetPassword(newPassword);

    if (statusCode === 401) {
      Toast.show({
        type: 'error',
        text1: 'Session Expired',
        text2: 'Your session has expired. Please log in again.',
      });
      logout();
    } else if (error) {
      Toast.show({
        type: 'error',
        text1: 'Password Reset Failed',
        text2: error,
      });
    } else if (data) {
      Toast.show({
        type: 'success',
        text1: 'Password Reset Successful',
        text2: data.message || 'Your password has been updated',
      });
      navigation.goBack();
    }

    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Reset Password</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.description}>
            Enter your new password below. Password must be at least 6
            characters.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              placeholderTextColor="#71717a"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleResetPassword}
            disabled={isLoading}>
            <Text style={styles.buttonText}>
              {isLoading ? 'Changing Password...' : 'Change Password'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#27272a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  description: {
    fontSize: 14,
    color: '#a1a1aa',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
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
    padding: 14,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#3f3f46',
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
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
