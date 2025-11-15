/**
 * API Client for Sequence Builder
 *
 * This module provides a configurable HTTP client for interacting with the FishMouth
 * backend API for sequences and enrollments.
 *
 * @example
 * ```typescript
 * const client = createSequenceClient({
 *   baseURL: 'http://localhost:8000',
 *   headers: { Authorization: 'Bearer token' }
 * });
 *
 * const sequences = await client.sequences.list();
 * ```
 */

import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import type {
  Sequence,
  CreateSequencePayload,
  UpdateSequencePayload,
  SequenceTemplate,
  EnrollLeadsPayload,
  SequenceEnrollmentResponse,
  UpdateEnrollmentPayload,
  SequenceAnalytics,
  SequencePerformance,
} from '../types';

/**
 * Configuration for the sequence API client
 */
export interface SequenceClientConfig {
  /** Base URL of the API (e.g., 'http://localhost:8000') */
  baseURL: string;
  /** Optional headers to include with every request */
  headers?: Record<string, string>;
  /** Optional axios configuration */
  axiosConfig?: AxiosRequestConfig;
}

/**
 * Response wrapper for common API responses
 */
interface ApiResponse<T> {
  data?: T;
  message?: string;
  status?: string;
}

/**
 * Delete response
 */
interface DeleteResponse {
  status: string;
  message: string;
}

/**
 * Process response
 */
interface ProcessResponse {
  status: string;
  message: string;
  processed_count?: number;
}

/**
 * Sequence API methods
 */
export interface SequenceAPI {
  /**
   * List all sequences for the current user
   */
  list(): Promise<Sequence[]>;

  /**
   * Get a single sequence by ID
   */
  get(sequenceId: number): Promise<Sequence>;

  /**
   * Create a new sequence (blank or from template)
   */
  create(payload: CreateSequencePayload): Promise<Sequence>;

  /**
   * Update an existing sequence
   */
  update(sequenceId: number, payload: UpdateSequencePayload): Promise<Sequence>;

  /**
   * Delete a sequence
   */
  delete(sequenceId: number): Promise<DeleteResponse>;

  /**
   * Get available sequence templates
   */
  getTemplates(): Promise<SequenceTemplate[]>;

  /**
   * Enroll leads in a sequence
   */
  enrollLeads(sequenceId: number, payload: EnrollLeadsPayload): Promise<SequenceEnrollmentResponse>;

  /**
   * Update an enrollment
   */
  updateEnrollment(enrollmentId: number, payload: UpdateEnrollmentPayload): Promise<ApiResponse<any>>;

  /**
   * Trigger background processing of pending steps
   */
  process(): Promise<ProcessResponse>;

  /**
   * Get performance metrics for a sequence
   */
  getPerformance(sequenceId: number): Promise<SequencePerformance>;

  /**
   * Get detailed analytics for a sequence
   */
  getAnalytics(sequenceId: number): Promise<SequenceAnalytics>;
}

/**
 * Main API client interface
 */
export interface SequenceClient {
  /** Sequence-related API methods */
  sequences: SequenceAPI;
  /** Raw axios instance for custom requests */
  axios: AxiosInstance;
}

/**
 * Create a configured sequence API client
 *
 * @param config - Client configuration
 * @returns Configured API client
 *
 * @example
 * ```typescript
 * const client = createSequenceClient({
 *   baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
 *   headers: {
 *     Authorization: `Bearer ${token}`
 *   }
 * });
 * ```
 */
export function createSequenceClient(config: SequenceClientConfig): SequenceClient {
  // Create axios instance with base configuration
  const axiosInstance = axios.create({
    baseURL: config.baseURL,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers,
    },
    ...config.axiosConfig,
  });

  // Sequence API implementation
  const sequences: SequenceAPI = {
    async list() {
      const response = await axiosInstance.get<Sequence[]>('/api/sequences');
      return response.data;
    },

    async get(sequenceId: number) {
      const response = await axiosInstance.get<Sequence>(`/api/sequences/${sequenceId}`);
      return response.data;
    },

    async create(payload: CreateSequencePayload) {
      const response = await axiosInstance.post<Sequence>('/api/sequences', payload);
      return response.data;
    },

    async update(sequenceId: number, payload: UpdateSequencePayload) {
      const response = await axiosInstance.put<Sequence>(
        `/api/sequences/${sequenceId}`,
        payload
      );
      return response.data;
    },

    async delete(sequenceId: number) {
      const response = await axiosInstance.delete<DeleteResponse>(
        `/api/sequences/${sequenceId}`
      );
      return response.data;
    },

    async getTemplates() {
      const response = await axiosInstance.get<SequenceTemplate[]>('/api/sequences/templates');
      return response.data;
    },

    async enrollLeads(sequenceId: number, payload: EnrollLeadsPayload) {
      const response = await axiosInstance.post<SequenceEnrollmentResponse>(
        `/api/sequences/${sequenceId}/enroll`,
        payload
      );
      return response.data;
    },

    async updateEnrollment(enrollmentId: number, payload: UpdateEnrollmentPayload) {
      const response = await axiosInstance.put<ApiResponse<any>>(
        `/api/sequences/enrollments/${enrollmentId}`,
        payload
      );
      return response.data;
    },

    async process() {
      const response = await axiosInstance.post<ProcessResponse>('/api/sequences/process');
      return response.data;
    },

    async getPerformance(sequenceId: number) {
      const response = await axiosInstance.get<SequencePerformance>(
        `/api/sequences/${sequenceId}/performance`
      );
      return response.data;
    },

    async getAnalytics(sequenceId: number) {
      const response = await axiosInstance.get<SequenceAnalytics>(
        `/api/sequences/${sequenceId}/analytics`
      );
      return response.data;
    },
  };

  return {
    sequences,
    axios: axiosInstance,
  };
}

/**
 * Default export for convenience
 */
export default createSequenceClient;
