import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '../types';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';

export const storage = {
  // Auth token methods
  getToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  setToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  },

  removeToken: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },

  // User methods
  getUser: async (): Promise<User | null> => {
    try {
      const userJson = await AsyncStorage.getItem(USER_KEY);
      if (userJson) {
        return JSON.parse(userJson);
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  setUser: async (user: User): Promise<void> => {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user:', error);
    }
  },

  removeUser: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Error removing user:', error);
    }
  },

  // Clear all auth data
  clearAuth: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_KEY]);
    } catch (error) {
      console.error('Error clearing auth:', error);
    }
  },
};
