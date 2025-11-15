/**
 * Type definitions for sequence analytics and performance metrics
 */

/**
 * Performance metrics for a sequence
 */
export interface SequencePerformance {
  sequence_id: number;
  total_enrolled: number;
  total_completed: number;
  total_active: number;
  total_paused: number;
  total_cancelled: number;
  total_converted: number;
  total_failed: number;
  conversion_rate: number;
  completion_rate: number;
  average_completion_days?: number;
  last_updated: string; // ISO timestamp
}

/**
 * Step-level analytics
 */
export interface StepAnalytics {
  node_id: string;
  node_type: string;
  label: string;
  total_sent: number;
  total_delivered: number;
  total_failed: number;
  total_responded: number;
  response_rate: number;
  average_response_time_hours?: number;
}

/**
 * Channel-level analytics
 */
export interface ChannelAnalytics {
  channel: 'email' | 'sms' | 'voice_call' | 'task' | 'other';
  total_sent: number;
  total_delivered: number;
  total_failed: number;
  total_responded: number;
  response_rate: number;
  delivery_rate: number;
}

/**
 * Time-series data point
 */
export interface TimeSeriesDataPoint {
  date: string; // ISO date
  enrolled: number;
  completed: number;
  converted: number;
  active: number;
}

/**
 * Complete analytics response
 */
export interface SequenceAnalytics {
  sequence_id: number;
  performance: SequencePerformance;
  step_analytics: StepAnalytics[];
  channel_analytics: ChannelAnalytics[];
  time_series?: TimeSeriesDataPoint[];
  last_updated: string; // ISO timestamp
}
