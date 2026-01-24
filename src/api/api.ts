import {Platform} from 'react-native';
import Toast from 'react-native-toast-message';
import {storage} from '../utils/storage';
import {
  ApiResponse,
  AuthResponse,
  MangaWithProgress,
  MangaDetails,
  MediaProgressRequest,
  UserProgressAnalytics,
  MessageResponse,
  ValidateResponse,
  SubmitUrlResponse,
} from '../types';

// API base URL configuration
// Android emulator uses 10.0.2.2 to access host localhost
// iOS simulator can use localhost directly
const getBaseUrl = () => {
  if (__DEV__) {
    return Platform.OS === 'android'
      ? 'http://192.168.1.247:8080'
      : 'http://192.168.1.247:8080';
  }
  // Production URL - change this to your production server
  return 'http://192.168.1.247:8080';
};

const API_BASE_URL = getBaseUrl();

// Global logout callback that can be set by AuthContext
let globalLogoutCallback: (() => void) | null = null;

export function setLogoutCallback(callback: () => void) {
  globalLogoutCallback = callback;
}

async function clearAuthAndLogout() {
  await storage.clearAuth();

  Toast.show({
    type: 'error',
    text1: 'Session expired',
    text2: 'Your session has expired. Please log back in to continue.',
  });

  if (globalLogoutCallback) {
    globalLogoutCallback();
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  try {
    const token = await storage.getToken();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && {Authorization: `Bearer ${token}`}),
        ...options.headers,
      },
    });

    if (!response.ok) {
      // Check for auth-related errors and force logout
      if (
        response.status === 403 ||
        response.status === 404 ||
        response.status === 440
      ) {
        await clearAuthAndLogout();
      }

      const errorData = await response
        .json()
        .catch(() => ({error: 'Request failed'}));
      return {
        data: errorData as T,
        error: errorData.error || errorData.message || `HTTP error ${response.status}`,
        statusCode: response.status,
      };
    }

    const data = await response.json();
    return {data, statusCode: response.status};
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Network error';

    if (
      errorMessage.toLowerCase().includes('fetch') ||
      errorMessage.toLowerCase().includes('network')
    ) {
      await clearAuthAndLogout();
    }

    return {error: errorMessage};
  }
}

export const api = {
  // Auth endpoints
  login: (email: string, password: string) =>
    apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({email, password}),
    }),

  signup: (email: string, password: string) =>
    apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({email, password}),
    }),

  validateAuth: () =>
    apiRequest<ValidateResponse>('/auth/validate', {
      method: 'POST',
    }),

  sendEmailLoginLink: (email: string) =>
    apiRequest<MessageResponse>('/auth/sendEmailLoginLink', {
      method: 'POST',
      body: JSON.stringify({email}),
    }),

  emailLogin: (token: string) =>
    apiRequest<AuthResponse>('/auth/loginViaEmailLink', {
      method: 'POST',
      body: JSON.stringify({login_token: token}),
    }),

  resetPassword: async (new_password: string) => {
    const token = await storage.getToken();
    return apiRequest<MessageResponse>('/auth/resetPassword', {
      method: 'POST',
      body: JSON.stringify({new_password}),
      headers: {
        ...(token && {Authorization: `Bearer ${token}`}),
      },
    });
  },

  // Manga endpoints
  getRecentManga: () => apiRequest<MangaWithProgress[]>('/mangas/recent'),

  getMangaChapters: (mangaId: string) =>
    apiRequest<MangaDetails>(`/mangas/${mangaId}`),

  // URL submission
  submitUrl: (url: string) =>
    apiRequest<SubmitUrlResponse>('/mangaProgresses/mangaProgress', {
      method: 'POST',
      body: JSON.stringify({provided_url: url, requestSource: 'Mobile-App'}),
    }),

  // Manga progress merge
  requestMediaMerge: (mangaProgressId: string) =>
    apiRequest<MessageResponse>('/mangaProgresses/requestMediaMerge', {
      method: 'POST',
      body: JSON.stringify({mediaProgressToMergeID: mangaProgressId}),
    }),

  // Delete tracked media
  deleteTrackedMedia: (mangaId: string) =>
    apiRequest<MessageResponse>('/mangaProgresses/deleteTrackedMedia', {
      method: 'POST',
      body: JSON.stringify({manga_id: mangaId}),
    }),

  // Media progress requests
  getMediaProgressUserRequests: () =>
    apiRequest<MediaProgressRequest[]>('/mediaProgressUserRequests'),

  retryProgressRequests: async () => {
    const token = await storage.getToken();
    return apiRequest<MessageResponse>(
      '/mediaProgressUserRequests/retryProgressRequests',
      {
        method: 'POST',
        headers: {
          ...(token && {Authorization: `Bearer ${token}`}),
        },
      },
    );
  },

  // Progress analytics
  getProgressAnalytics: (period: string) =>
    apiRequest<UserProgressAnalytics[]>(`/progressAnalytics?period=${period}`),
};
