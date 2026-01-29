import {Platform} from 'react-native';
import Toast from 'react-native-toast-message';
import {storage} from '../utils/storage';
import {
  ApiResponse,
  AuthResponse,
  MediaWithProgressDto,
  MediaWithProgressesAndSitesDto,
  MediaProgressUserRequest,
  UserProgressAnalytics,
  MessageResponse,
  ValidateResponse,
  SubmitUrlResponse,
  // Request types
  LoginRequest,
  RegisterRequest,
  EmailLoginRequest,
  ResetPasswordRequest,
  SendEmailLoginLinkRequest,
  AddMediaProgressRequest,
  DeleteTrackedMediaRequest,
  MediaMergeRequest,
  MediaProgressId,
  MediaProgressDto,
  // ToJSON serializers
  LoginRequestToJSON,
  RegisterRequestToJSON,
  EmailLoginRequestToJSON,
  ResetPasswordRequestToJSON,
  SendEmailLoginLinkRequestToJSON,
  AddMediaProgressRequestToJSON,
  DeleteTrackedMediaRequestToJSON,
  MediaMergeRequestToJSON,
} from '../types';
import {
  AddUserSubmissionRequest,
  AddUserSubmissionRequestToJSON,
} from '../../generated-types/models';

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
      // 401 = Unauthorized, 403 = Forbidden, 404 = Not Found, 440 = Login Timeout
      if (
        response.status === 401 ||
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

    return {error: errorMessage};
  }
}

export const api = {
  // Auth endpoints
  login: (email: string, password: string) => {
    const request: LoginRequest = {email, password};
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(LoginRequestToJSON(request)),
    });
  },

  signup: (email: string, password: string) => {
    const request: RegisterRequest = {email, password};
    return apiRequest<MessageResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(RegisterRequestToJSON(request)),
    });
  },

  validateAuth: () =>
    apiRequest<ValidateResponse>('/auth/validate', {
      method: 'POST',
    }),

  sendEmailLoginLink: (email: string) => {
    const request: SendEmailLoginLinkRequest = {email};
    return apiRequest<MessageResponse>('/auth/sendEmailLoginLink', {
      method: 'POST',
      body: JSON.stringify(SendEmailLoginLinkRequestToJSON(request)),
    });
  },

  emailLogin: (token: string) => {
    const request: EmailLoginRequest = {loginToken: token};
    return apiRequest<AuthResponse>('/auth/loginViaEmailLink', {
      method: 'POST',
      body: JSON.stringify(EmailLoginRequestToJSON(request)),
    });
  },

  resetPassword: async (newPassword: string) => {
    const token = await storage.getToken();
    const request: ResetPasswordRequest = {newPassword};
    return apiRequest<MessageResponse>('/auth/resetPassword', {
      method: 'POST',
      body: JSON.stringify(ResetPasswordRequestToJSON(request)),
      headers: {
        ...(token && {Authorization: `Bearer ${token}`}),
      },
    });
  },

  // Media endpoints
  getRecentMedia: () => apiRequest<MediaWithProgressDto[]>('/medias/recent'),

  getMediaDetails: (mediaId: string) =>
    apiRequest<MediaWithProgressesAndSitesDto>(`/medias/${mediaId}`),

  // URL submission
  submitUrl: (url: string) => {
    const request: AddMediaProgressRequest = {
      providedUrl: url,
      requestSource: 'Mobile-App',
    };
    return apiRequest<SubmitUrlResponse>('/mediaProgresses/mediaProgress', {
      method: 'POST',
      body: JSON.stringify(AddMediaProgressRequestToJSON(request)),
    });
  },

  // Media progress merge
  requestMediaMerge: (mediaProgressId: MediaProgressId) => {
    const request: MediaMergeRequest = {mediaProgressToMergeID: mediaProgressId};
    return apiRequest<MessageResponse>('/mediaProgresses/requestMediaMerge', {
      method: 'POST',
      body: JSON.stringify(MediaMergeRequestToJSON(request)),
    });
  },

  // Delete tracked media
  deleteTrackedMedia: (mediaId: number) => {
    const request: DeleteTrackedMediaRequest = {mediaId};
    return apiRequest<MessageResponse>('/mediaProgresses/deleteTrackedMedia', {
      method: 'POST',
      body: JSON.stringify(DeleteTrackedMediaRequestToJSON(request)),
    });
  },

  // Delete single media progress (chapter)
  deleteMediaProgress: (mediaProgressDto: MediaProgressDto) => {
    return apiRequest<MessageResponse>('/mediaProgresses/deleteMediaProgress', {
      method: 'POST',
      body: JSON.stringify(mediaProgressDto),
    });
  },

  // Media progress requests
  getMediaProgressUserRequests: () =>
    apiRequest<MediaProgressUserRequest[]>('/mediaProgressUserRequests'),

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

  // User submissions (feedback)
  getMyUserSubmissions: () =>
    apiRequest<object[]>('/userSubmission/getMyUserSubmissions'),

  addUserSubmission: (submissionType: string, description: string) => {
    const request: AddUserSubmissionRequest = {
      submissionType: submissionType as AddUserSubmissionRequest['submissionType'],
      description,
    };
    return apiRequest<MessageResponse>('/userSubmission/addUserSubmission', {
      method: 'POST',
      body: JSON.stringify(AddUserSubmissionRequestToJSON(request)),
    });
  },
};
