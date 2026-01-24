// TypeScript type definitions for the Manga Tracker app

export interface User {
  id: string;
  email: string;
  username: string;
}

export interface Manga {
  id: string;
  title: string;
  coverImage?: string;
  imageUrl?: string;
  status?: string;
  type?: string;
  description?: string;
  genres?: string[];
}

export interface MangaProgress {
  id: string;
  chapterNumber: number;
  status?: string;
  lastUpdatedAt: string;
  recentChapterUrl?: string;
  chapterUrl?: string;
}

export interface MangaWithProgress {
  manga: Manga;
  mangaProgress: MangaProgress;
}

export interface MediaSiteWithUrl {
  baseUrl: string;
  mediaSite: {
    siteName: string;
  };
}

export interface MangaDetails {
  manga: Manga;
  mangaProgresses: MangaProgress[];
  mediaSitesWithUrls: MediaSiteWithUrl[];
}

export interface MediaProgressRequest {
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

export interface MessageResponse {
  message: string;
}

export interface ValidateResponse {
  valid: boolean;
}

export interface SubmitUrlResponse {
  success: boolean;
}
