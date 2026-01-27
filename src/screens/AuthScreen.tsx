import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {useAuth} from '../contexts/AuthContext';
import {api} from '../api/api';
import {NiRELogo} from '../components/NiRELogo';

type AuthTab = 'login' | 'signup';

export function AuthScreen() {
  const {login, signup} = useAuth();
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailLogin, setShowEmailLogin] = useState(false);

  const [loginData, setLoginData] = useState({email: '', password: ''});
  const [signupData, setSignupData] = useState({email: '', password: ''});
  const [emailLoginAddress, setEmailLoginAddress] = useState('');

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      Toast.show({
        type: 'error',
        text1: 'Missing fields',
        text2: 'Please enter email and password',
      });
      return;
    }

    setIsLoading(true);
    await login(loginData.email, loginData.password);
    setIsLoading(false);
  };

  const handleSignup = async () => {
    if (!signupData.email || !signupData.password) {
      Toast.show({
        type: 'error',
        text1: 'Missing fields',
        text2: 'Please enter email and password',
      });
      return;
    }

    setIsLoading(true);
    await signup(signupData.email, signupData.password);
    setIsLoading(false);
  };

  const handleEmailLogin = async () => {
    if (!emailLoginAddress) {
      Toast.show({
        type: 'error',
        text1: 'Email required',
        text2: 'Please enter your email address',
      });
      return;
    }

    setIsLoading(true);
    const {data, error} = await api.sendEmailLoginLink(emailLoginAddress);

    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Login Email Failed',
        text2: error,
      });
    } else if (data) {
      Toast.show({
        type: 'success',
        text1: 'Login Email Sent',
        text2: data.body || 'Check your inbox for a login link',
      });
      setShowEmailLogin(false);
      setEmailLoginAddress('');
    }

    setIsLoading(false);
  };

  const renderLoginForm = () => {
    if (showEmailLogin) {
      return (
        <View style={styles.form}>
          <Text style={styles.cardTitle}>Login via Email</Text>
          <Text style={styles.cardDescription}>
            Enter your email to receive a login link directly to your inbox.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#71717a"
              value={emailLoginAddress}
              onChangeText={setEmailLoginAddress}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleEmailLogin}
            disabled={isLoading}>
            {isLoading ? (
              <Text style={styles.buttonText}>Sending...</Text>
            ) : (
              <Text style={styles.buttonText}>Send Login Email</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowEmailLogin(false)}
            style={styles.linkButton}>
            <Text style={styles.linkText}>Back to login</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.form}>
        <Text style={styles.cardTitle}>Welcome back</Text>
        <Text style={styles.cardDescription}>
          Login to continue tracking your media
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#71717a"
            value={loginData.email}
            onChangeText={text => setLoginData({...loginData, email: text})}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#71717a"
            value={loginData.password}
            onChangeText={text => setLoginData({...loginData, password: text})}
            secureTextEntry
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}>
          {isLoading ? (
            <Text style={styles.buttonText}>Logging in...</Text>
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowEmailLogin(true)}
          style={styles.linkButton}>
          <Text style={styles.linkText}>Login via email</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSignupForm = () => (
    <View style={styles.form}>
      <Text style={styles.cardTitle}>Create account</Text>
      <Text style={styles.cardDescription}>
        Sign up to start tracking your media
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          placeholderTextColor="#71717a"
          value={signupData.email}
          onChangeText={text => setSignupData({...signupData, email: text})}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Create a password"
          placeholderTextColor="#71717a"
          value={signupData.password}
          onChangeText={text => setSignupData({...signupData, password: text})}
          secureTextEntry
          editable={!isLoading}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSignup}
        disabled={isLoading}>
        {isLoading ? (
          <Text style={styles.buttonText}>Creating account...</Text>
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <NiRELogo size="large" style={styles.logo} />
          <Text style={styles.subtitle}>Track your media reading journey</Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'login' && styles.activeTab]}
            onPress={() => {
              setActiveTab('login');
              setShowEmailLogin(false);
            }}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'login' && styles.activeTabText,
              ]}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'signup' && styles.activeTab]}
            onPress={() => setActiveTab('signup')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'signup' && styles.activeTabText,
              ]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          {activeTab === 'login' ? renderLoginForm() : renderSignupForm()}
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
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#71717a',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#27272a',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#71717a',
  },
  activeTabText: {
    color: '#ffffff',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  form: {},
  cardTitle: {
    fontSize: 20,
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
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: '#71717a',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
