import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {useAuth} from '../contexts/AuthContext';
import {api} from '../api/api';

export function SettingsScreen() {
  const {user, logout} = useAuth();
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ],
    );
  };

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
    const {data, error} = await api.resetPassword(newPassword);

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Password Reset Failed',
        text2: error,
      });
    } else if (data) {
      Toast.show({
        type: 'success',
        text1: 'Password Reset Successful',
        text2: data.body || 'Your password has been updated',
      });
      setNewPassword('');
      setShowResetPassword(false);
    }

    setIsLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>S</Text>
        </View>
        <View>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage your account</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{user?.email || 'Not available'}</Text>
        </View>
        {user?.username && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Username</Text>
            <Text style={styles.infoValue}>{user.username}</Text>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Security</Text>

        {!showResetPassword ? (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowResetPassword(true)}>
            <Text style={styles.menuItemText}>Reset Password</Text>
            <Text style={styles.menuItemArrow}>→</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.resetPasswordForm}>
            <Text style={styles.formLabel}>New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              placeholderTextColor="#71717a"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              editable={!isLoading}
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowResetPassword(false);
                  setNewPassword('');
                }}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, isLoading && styles.buttonDisabled]}
                onPress={handleResetPassword}
                disabled={isLoading}>
                <Text style={styles.saveButtonText}>
                  {isLoading ? 'Saving...' : 'Save Password'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account Actions</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Ni-RE</Text>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </ScrollView>
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
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    color: '#71717a',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  infoLabel: {
    fontSize: 14,
    color: '#71717a',
  },
  infoValue: {
    fontSize: 14,
    color: '#ffffff',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 14,
    color: '#ffffff',
  },
  menuItemArrow: {
    fontSize: 16,
    color: '#71717a',
  },
  resetPasswordForm: {
    gap: 12,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  input: {
    backgroundColor: '#27272a',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#27272a',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#7c3aed',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#7f1d1d',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fecaca',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    padding: 32,
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#71717a',
  },
  versionText: {
    fontSize: 12,
    color: '#52525b',
    marginTop: 4,
  },
});
