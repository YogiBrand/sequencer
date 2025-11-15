/**
 * Helper functions for working with sequence nodes
 */

import type { SequenceNodeType, SequenceNodeData } from '../types';

/**
 * Get display information for a node type
 */
export interface NodeTypeInfo {
  type: SequenceNodeType;
  label: string;
  icon: string;
  color: string;
  description: string;
  category: 'control' | 'communication' | 'action' | 'ai';
}

/**
 * Node type metadata for UI display
 */
export const NODE_TYPE_INFO: Record<SequenceNodeType, NodeTypeInfo> = {
  start: {
    type: 'start',
    label: 'Start',
    icon: '▶',
    color: '#10b981',
    description: 'Entry point of the sequence',
    category: 'control',
  },
  end: {
    type: 'end',
    label: 'End',
    icon: '⏹',
    color: '#ef4444',
    description: 'Exit point of the sequence',
    category: 'control',
  },
  email: {
    type: 'email',
    label: 'Email',
    icon: '✉',
    color: '#3b82f6',
    description: 'Send an email to the lead',
    category: 'communication',
  },
  sms: {
    type: 'sms',
    label: 'SMS',
    icon: '💬',
    color: '#8b5cf6',
    description: 'Send an SMS message to the lead',
    category: 'communication',
  },
  voice_call: {
    type: 'voice_call',
    label: 'Voice Call',
    icon: '📞',
    color: '#f59e0b',
    description: 'Make an AI-powered voice call',
    category: 'communication',
  },
  wait: {
    type: 'wait',
    label: 'Wait',
    icon: '⏱',
    color: '#6b7280',
    description: 'Wait for a specified duration',
    category: 'control',
  },
  condition: {
    type: 'condition',
    label: 'Condition',
    icon: '◇',
    color: '#ec4899',
    description: 'Branch based on a condition',
    category: 'control',
  },
  smartscan: {
    type: 'smartscan',
    label: 'SmartScan',
    icon: '🔍',
    color: '#14b8a6',
    description: 'AI-powered roof assessment with damage detection, measurements, and heatmaps',
    category: 'ai',
  },
  task: {
    type: 'task',
    label: 'Task',
    icon: '✓',
    color: '#84cc16',
    description: 'Assign a task to a team member',
    category: 'action',
  },
  lead_replacement: {
    type: 'lead_replacement',
    label: 'Lead Replacement',
    icon: '🔄',
    color: '#f97316',
    description: 'Replace with a new lead if needed',
    category: 'action',
  },
  report: {
    type: 'report',
    label: 'Report',
    icon: '📊',
    color: '#06b6d4',
    description: 'Generate roof inspection reports with imagery, financing, and insurance docs',
    category: 'action',
  },
};

/**
 * Get default data for a new node of a given type
 */
export function getDefaultNodeData(type: SequenceNodeType): SequenceNodeData {
  const baseData = {
    label: NODE_TYPE_INFO[type].label,
  };

  switch (type) {
    case 'start':
      return { ...baseData };

    case 'end':
      return { ...baseData, outcome: 'completed' };

    case 'email':
      return {
        ...baseData,
        delay_days: 0,
        delay_hours: 0,
        subject: '',
        body: '',
        use_ai_writer: false,
      };

    case 'sms':
      return {
        ...baseData,
        delay_days: 0,
        delay_hours: 0,
        message: '',
        use_ai_writer: false,
      };

    case 'voice_call':
      return {
        ...baseData,
        delay_days: 0,
        delay_hours: 0,
        ai_instructions: '',
        conversation_goal: '',
        max_turns: 10,
        enable_barge_in: true,
      };

    case 'wait':
      return {
        ...baseData,
        delay_days: 1,
        delay_hours: 0,
      };

    case 'condition':
      return {
        ...baseData,
        condition: 'lead_responded',
        // Roofing-specific conditions available:
        // - storm_damage_detected
        // - roof_age_over_10_years
        // - roof_age_over_20_years
        // - lead_score_above_70
        // - insurance_claim_filed
        // - project_scope_full_replacement
        // - urgent_repair_needed
      };

    case 'smartscan':
      return {
        ...baseData,
        scan_type: 'full_roof_assessment',
        include_heatmap: true,
        notify_team: false,
        // Roofing-specific scan options:
        detect_damage: true,
        measure_dimensions: true,
        capture_photos: false,
        // Scan types: full_roof_assessment, storm_damage, routine_inspection, leak_detection
      };

    case 'task':
      return {
        ...baseData,
        assignee: '',
        due_days: 1,
        instructions: '',
      };

    case 'lead_replacement':
      return {
        ...baseData,
        quality_threshold: 80,
        auto_credit: true,
        review_window_hours: 24,
      };

    case 'report':
      return {
        ...baseData,
        template: 'full_inspection',
        attach_imagery: true,
        include_financing: true,
        delivery_channel: 'email',
        // Roofing-specific report options:
        include_insurance_docs: false,
        include_warranty_info: false,
        include_material_options: false,
        // Templates: full_inspection, storm_damage, routine_maintenance, estimate_proposal
      };

    default:
      return baseData;
  }
}

/**
 * Check if a node type can have multiple outgoing edges
 */
export function canHaveMultipleOutputs(type: SequenceNodeType): boolean {
  return type === 'condition';
}

/**
 * Check if a node type can have multiple incoming edges
 */
export function canHaveMultipleInputs(type: SequenceNodeType): boolean {
  return type !== 'start';
}

/**
 * Get the category nodes grouped by category
 */
export function getNodesByCategory() {
  const categories: Record<string, NodeTypeInfo[]> = {
    control: [],
    communication: [],
    action: [],
    ai: [],
  };

  Object.values(NODE_TYPE_INFO).forEach((info) => {
    if (info.type !== 'start' && info.type !== 'end') {
      // Don't include start/end in palette
      categories[info.category].push(info);
    }
  });

  return categories;
}
