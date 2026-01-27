// TypeScript type definitions for the One Read Mobile app

// Re-export generated DTO types (responses)
export {
  MediaDto,
  MediaProgressDto,
  MediaWithProgressDto,
  MediaWithProgressesAndSitesDto,
  MediaSiteWithMediaUrlDto,
  MediaSiteDto,
  MediaProgressId,
  UserDto,
  // Generated MessageResponse with body/error fields
  MessageResponse,
} from '../../generated-types/models';

// Re-export generated request types and their serializers
export {
  // Request types
  LoginRequest,
  RegisterRequest,
  EmailLoginRequest,
  ResetPasswordRequest,
  SendEmailLoginLinkRequest,
  AddMediaProgressRequest,
  DeleteTrackedMediaRequest,
  MediaMergeRequest,
  // ToJSON serializers (handle snake_case conversion for backend)
  LoginRequestToJSON,
  RegisterRequestToJSON,
  EmailLoginRequestToJSON,
  ResetPasswordRequestToJSON,
  SendEmailLoginLinkRequestToJSON,
  AddMediaProgressRequestToJSON,
  DeleteTrackedMediaRequestToJSON,
  MediaMergeRequestToJSON,
} from '../../generated-types/models';

export interface User {
  id: string;
  email: string;
  username: string;
}

export interface MediaProgressUserRequest {
  id: string;
  url: string;
  createdAt: string;
  status: string;
  requestSource?: string;
}

export enum AnalyticsPeriod {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export enum MediaProgressStatus {
  Read = 'READ',
  ReRead = 'RE_READ',
  InProgress = 'IN_PROGRESS',
}

export interface UserProgressAnalytics {
  userid: number;
  date: string;
  status: MediaProgressStatus;
  dailyResult: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ValidateResponse {
  valid: boolean;
}

export interface SubmitUrlResponse {
  success: boolean;
}
