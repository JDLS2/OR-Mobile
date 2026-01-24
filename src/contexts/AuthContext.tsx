import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import Toast from 'react-native-toast-message';
import {api, setLogoutCallback} from '../api/api';
import {storage} from '../utils/storage';
import {User} from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = async () => {
    await storage.clearAuth();
    setUser(null);

    Toast.show({
      type: 'info',
      text1: 'Logged out',
      text2: 'Come back soon!',
    });
  };

  useEffect(() => {
    // Register logout callback with API layer
    setLogoutCallback(() => {
      setUser(null);
    });

    // Check for existing token on mount
    const checkAuth = async () => {
      const token = await storage.getToken();
      const storedUser = await storage.getUser();

      if (token && storedUser) {
        setUser(storedUser);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    // Only set up validation interval if user is logged in
    if (!user) {
      return;
    }

    // Ping auth/validate every 1 minute
    const validateInterval = setInterval(async () => {
      const {data, error} = await api.validateAuth();

      // If validation fails, logout
      if (error || !data) {
        clearInterval(validateInterval);
        await storage.clearAuth();
        setUser(null);
        Toast.show({
          type: 'error',
          text1: 'Session expired',
          text2: 'Your session has expired. Please log back in to continue.',
        });
      }
    }, 60000); // 60000ms = 1 minute

    return () => {
      clearInterval(validateInterval);
    };
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const {data, error} = await api.login(email, password);

    if (error || !data) {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: error || 'Invalid credentials',
      });
      return false;
    }

    await storage.setToken(data.token);
    await storage.setUser(data.user);
    setUser(data.user);

    Toast.show({
      type: 'success',
      text1: 'Welcome back!',
      text2: 'Successfully logged in',
    });

    return true;
  };

  const signup = async (email: string, password: string): Promise<boolean> => {
    const {data, error} = await api.signup(email, password);

    if (error || !data) {
      Toast.show({
        type: 'error',
        text1: 'Signup failed',
        text2: error || 'Could not create account',
      });
      return false;
    }

    await storage.setToken(data.token);
    await storage.setUser(data.user);
    setUser(data.user);

    Toast.show({
      type: 'success',
      text1: 'Account created!',
      text2: 'Welcome to Manga Tracker',
    });

    return true;
  };

  return (
    <AuthContext.Provider value={{user, isLoading, login, signup, logout}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
