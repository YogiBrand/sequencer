/**
 * Core type definitions for the Sequence Builder
 * These types match the backend API contracts for the FishMouth system
 */

/**
 * Supported node types in a sequence workflow
 */
export type SequenceNodeType =
  | 'start'
  | 'end'
  | 'email'
  | 'sms'
  | 'voice_call'
  | 'wait'
  | 'condition'
  | 'smartscan'
  | 'task'
  | 'lead_replacement'
  | 'report';

/**
 * Position of a node on the canvas
 */
export interface NodePosition {
  x: number;
  y: number;
}

/**
 * Base interface for all node data types
 */
export interface BaseNodeData {
  label?: string;
  delay_days?: number;
  delay_hours?: number;
  send_time?: string;
  require_review?: boolean;
  manual_send?: boolean;
}

/**
 * Voice call node specific data
 */
export interface VoiceCallNodeData extends BaseNodeData {
  ai_instructions?: string;
  script?: string;
  conversation_goal?: string;
  suggested_replies?: string[];
  max_turns?: number;
  silence_timeout_seconds?: number;
  enable_barge_in?: boolean;
}

/**
 * Email node specific data
 */
export interface EmailNodeData extends BaseNodeData {
  use_ai_writer?: boolean;
  ai_prompt?: string;
  subject?: string;
  template?: string;
  body?: string;
  suggested_replies?: string[];
}

/**
 * SMS node specific data
 */
export interface SmsNodeData extends BaseNodeData {
  message?: string;
  use_ai_writer?: boolean;
  ai_prompt?: string;
  suggested_replies?: string[];
}

/**
 * Wait node specific data
 */
export interface WaitNodeData extends BaseNodeData {
  // Only uses base fields
}

/**
 * Condition node specific data
 */
export interface ConditionNodeData extends BaseNodeData {
  condition?: string; // e.g., 'lead_responded', 'lead_booked'
}

/**
 * SmartScan node specific data
 */
export interface SmartScanNodeData extends BaseNodeData {
  scan_type?: string;
  include_heatmap?: boolean;
  notify_team?: boolean;
  notes?: string;
  // Roofing-specific fields
  detect_damage?: boolean;
  measure_dimensions?: boolean;
  capture_photos?: boolean;
}

/**
 * Task node specific data
 */
export interface TaskNodeData extends BaseNodeData {
  assignee?: string;
  due_days?: number;
  instructions?: string;
}

/**
 * Lead replacement node specific data
 */
export interface LeadReplacementNodeData extends BaseNodeData {
  quality_threshold?: number;
  auto_credit?: boolean;
  review_window_hours?: number;
  notes?: string;
}

/**
 * Report node specific data
 */
export interface ReportNodeData extends BaseNodeData {
  template?: string;
  attach_imagery?: boolean;
  include_financing?: boolean;
  delivery_channel?: string;
  notes?: string;
  // Roofing-specific fields
  include_insurance_docs?: boolean;
  include_warranty_info?: boolean;
  include_material_options?: boolean;
}

/**
 * End node specific data
 */
export interface EndNodeData extends BaseNodeData {
  outcome?: 'completed' | 'nurture' | 'lost' | string;
}

/**
 * Union type for all possible node data types
 */
export type SequenceNodeData =
  | BaseNodeData
  | VoiceCallNodeData
  | EmailNodeData
  | SmsNodeData
  | WaitNodeData
  | ConditionNodeData
  | SmartScanNodeData
  | TaskNodeData
  | LeadReplacementNodeData
  | ReportNodeData
  | EndNodeData;

/**
 * A single node in the sequence flow
 */
export interface FlowNode {
  id: string;
  type: SequenceNodeType;
  position: NodePosition;
  data: SequenceNodeData & Record<string, any>; // Allow additional fields
}

/**
 * Edge/connection data (for condition branching)
 */
export interface EdgeData {
  condition?: 'true' | 'false' | string;
  [key: string]: any; // Allow additional fields
}

/**
 * An edge connecting two nodes in the flow
 */
export interface FlowEdge {
  source: string; // source node id
  target: string; // target node id
  data?: EdgeData;
  id?: string; // Optional edge id for React Flow
}

/**
 * Complete flow graph structure
 */
export interface FlowData {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

/**
 * Sequence summary/full object returned by API
 */
export interface Sequence {
  id: number;
  name: string;
  description?: string | null;
  is_active: boolean;
  is_template?: boolean;
  flow_data: FlowData | null;
  total_enrolled?: number;
  total_completed?: number;
  total_converted?: number;
  conversion_rate?: number;
  working_hours_start?: string;
  working_hours_end?: string;
  working_days?: number[] | string[];
  timezone?: string;
  created_at: string; // ISO timestamp
  updated_at?: string | null; // ISO timestamp
}

/**
 * Payload for creating a new sequence
 */
export type CreateSequencePayload =
  | {
      name: string;
      description?: string;
      template_name: string; // Create from template
    }
  | {
      name: string;
      description?: string;
      flow_data?: FlowData; // Create blank or custom
    };

/**
 * Payload for updating an existing sequence
 */
export interface UpdateSequencePayload {
  name?: string;
  description?: string | null;
  is_active?: boolean;
  flow_data?: FlowData;
  working_hours_start?: string;
  working_hours_end?: string;
  working_days?: number[] | string[];
  timezone?: string;
}

/**
 * Template for creating sequences
 */
export interface SequenceTemplate {
  name: string; // machine name, e.g., "hot_lead_followup"
  display_name: string; // human-readable label
  description: string;
  category: string; // e.g., "conversion", "nurturing"
  estimated_duration_days: number;
  node_count: number;
  preview_flow_data?: FlowData; // Optional preview of the template structure
}

/**
 * Outcome for a single lead enrollment
 */
export interface SequenceEnrollmentOutcome {
  lead_id: number;
  enrollment_id: number;
  status: string; // e.g., "enrolled"
}

/**
 * Error for a single lead enrollment
 */
export interface SequenceEnrollmentError {
  lead_id: number;
  error: string;
}

/**
 * Response from enrolling leads
 */
export interface SequenceEnrollmentResponse {
  enrolled_count: number;
  error_count: number;
  enrollments: SequenceEnrollmentOutcome[];
  errors: SequenceEnrollmentError[];
}

/**
 * Payload for enrolling leads in a sequence
 */
export interface EnrollLeadsPayload {
  lead_ids: number[];
}

/**
 * Actions that can be performed on an enrollment
 */
export type EnrollmentAction = 'pause' | 'resume' | 'cancel' | 'mark_converted' | 'mark_failed';

/**
 * Payload for updating an enrollment
 */
export interface UpdateEnrollmentPayload {
  action: EnrollmentAction;
  notes?: string;
}

/**
 * Validation error for a sequence
 */
export interface SequenceValidationError {
  field?: string;
  message: string;
  node_id?: string;
}

/**
 * Result of validating a sequence
 */
export interface SequenceValidationResult {
  valid: boolean;
  errors: SequenceValidationError[];
}
