/**
 * Mock data for development and testing
 */

import type { Sequence, SequenceTemplate, FlowData } from '../types';

/**
 * Sample flow data for templates and examples
 */
export const sampleFlows: Record<string, FlowData> = {
  hot_lead_followup: {
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        position: { x: 250, y: 50 },
        data: { label: 'Start' },
      },
      {
        id: 'email-1',
        type: 'email',
        position: { x: 250, y: 150 },
        data: {
          label: 'Initial Outreach',
          delay_days: 0,
          delay_hours: 1,
          subject: 'Thanks for your interest!',
          body: 'Hi {{lead_name}}, thank you for reaching out...',
          use_ai_writer: true,
        },
      },
      {
        id: 'wait-1',
        type: 'wait',
        position: { x: 250, y: 250 },
        data: {
          label: 'Wait 2 days',
          delay_days: 2,
          delay_hours: 0,
        },
      },
      {
        id: 'condition-1',
        type: 'condition',
        position: { x: 250, y: 350 },
        data: {
          label: 'Did they respond?',
          condition: 'lead_responded',
        },
      },
      {
        id: 'voice-1',
        type: 'voice_call',
        position: { x: 100, y: 500 },
        data: {
          label: 'Follow-up Call',
          delay_days: 0,
          delay_hours: 0,
          conversation_goal: 'Schedule a consultation',
          ai_instructions: 'Be friendly and helpful',
        },
      },
      {
        id: 'task-1',
        type: 'task',
        position: { x: 400, y: 500 },
        data: {
          label: 'Personal Follow-up',
          assignee: 'sales_team',
          due_days: 1,
          instructions: 'Lead is engaged, schedule a meeting',
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 250, y: 650 },
        data: {
          label: 'End - Completed',
          outcome: 'completed',
        },
      },
    ],
    edges: [
      { source: 'start-1', target: 'email-1' },
      { source: 'email-1', target: 'wait-1' },
      { source: 'wait-1', target: 'condition-1' },
      { source: 'condition-1', target: 'voice-1', data: { condition: 'false' } },
      { source: 'condition-1', target: 'task-1', data: { condition: 'true' } },
      { source: 'voice-1', target: 'end-1' },
      { source: 'task-1', target: 'end-1' },
    ],
  },

  nurture_sequence: {
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        position: { x: 250, y: 50 },
        data: { label: 'Start' },
      },
      {
        id: 'email-1',
        type: 'email',
        position: { x: 250, y: 150 },
        data: {
          label: 'Educational Email 1',
          delay_days: 0,
          subject: 'Getting Started Guide',
          body: 'Here are some tips...',
        },
      },
      {
        id: 'wait-1',
        type: 'wait',
        position: { x: 250, y: 250 },
        data: { label: 'Wait 5 days', delay_days: 5 },
      },
      {
        id: 'email-2',
        type: 'email',
        position: { x: 250, y: 350 },
        data: {
          label: 'Educational Email 2',
          delay_days: 0,
          subject: 'Success Stories',
          body: 'Check out these amazing results...',
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 250, y: 450 },
        data: { label: 'End - Nurture', outcome: 'nurture' },
      },
    ],
    edges: [
      { source: 'start-1', target: 'email-1' },
      { source: 'email-1', target: 'wait-1' },
      { source: 'wait-1', target: 'email-2' },
      { source: 'email-2', target: 'end-1' },
    ],
  },

  // ROOFING-SPECIFIC WORKFLOWS
  storm_damage_response: {
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        position: { x: 250, y: 50 },
        data: { label: 'Storm Lead Enters' },
      },
      {
        id: 'smartscan-1',
        type: 'smartscan',
        position: { x: 250, y: 150 },
        data: {
          label: 'Roof Assessment Scan',
          delay_days: 0,
          delay_hours: 0,
          scan_type: 'storm_damage',
          include_heatmap: true,
          detect_damage: true,
          notify_team: true,
        },
      },
      {
        id: 'condition-1',
        type: 'condition',
        position: { x: 250, y: 280 },
        data: {
          label: 'Damage Severity Check',
          condition: 'storm_damage_detected',
        },
      },
      {
        id: 'voice-1',
        type: 'voice_call',
        position: { x: 100, y: 420 },
        data: {
          label: 'Urgent: Schedule Inspection',
          delay_days: 0,
          delay_hours: 1,
          conversation_goal: 'Schedule emergency roof inspection within 24-48 hours',
          ai_instructions: 'Emphasize urgency due to storm damage. Mention insurance claim assistance.',
          use_ai_writer: true,
        },
      },
      {
        id: 'sms-1',
        type: 'sms',
        position: { x: 400, y: 420 },
        data: {
          label: 'Standard Follow-up',
          delay_days: 1,
          message: 'Hi {{lead_name}}, we noticed potential storm damage. Schedule a free inspection: {{booking_link}}',
          use_ai_writer: false,
        },
      },
      {
        id: 'task-1',
        type: 'task',
        position: { x: 100, y: 560 },
        data: {
          label: 'Inspector Assignment',
          assignee: 'inspection_team',
          due_days: 0,
          instructions: 'High-priority storm damage case. Contact within 2 hours.',
        },
      },
      {
        id: 'report-1',
        type: 'report',
        position: { x: 250, y: 700 },
        data: {
          label: 'Inspection Report',
          template: 'storm_damage',
          attach_imagery: true,
          include_financing: true,
          include_insurance_docs: true,
          delivery_channel: 'email',
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 250, y: 820 },
        data: { label: 'Storm Response Complete', outcome: 'completed' },
      },
    ],
    edges: [
      { source: 'start-1', target: 'smartscan-1' },
      { source: 'smartscan-1', target: 'condition-1' },
      { source: 'condition-1', target: 'voice-1', data: { condition: 'true' } },
      { source: 'condition-1', target: 'sms-1', data: { condition: 'false' } },
      { source: 'voice-1', target: 'task-1' },
      { source: 'sms-1', target: 'end-1' },
      { source: 'task-1', target: 'report-1' },
      { source: 'report-1', target: 'end-1' },
    ],
  },

  roofing_lead_qualification: {
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        position: { x: 250, y: 50 },
        data: { label: 'New Roofing Lead' },
      },
      {
        id: 'voice-1',
        type: 'voice_call',
        position: { x: 250, y: 150 },
        data: {
          label: 'Lead Qualification Call',
          delay_days: 0,
          delay_hours: 0,
          conversation_goal: 'Qualify lead: roof age, damage type, timeline, budget',
          ai_instructions: 'Ask about roof age, recent storms, leaks, urgency. Score lead quality.',
          use_ai_writer: true,
          max_turns: 8,
        },
      },
      {
        id: 'condition-1',
        type: 'condition',
        position: { x: 250, y: 280 },
        data: {
          label: 'High-Quality Lead?',
          condition: 'lead_score_above_70',
        },
      },
      {
        id: 'task-1',
        type: 'task',
        position: { x: 100, y: 420 },
        data: {
          label: 'Route to Sales Team',
          assignee: 'sales_team',
          due_days: 0,
          instructions: 'Hot roofing lead - roof age >15 years or active damage. Schedule in-person inspection.',
        },
      },
      {
        id: 'email-1',
        type: 'email',
        position: { x: 400, y: 420 },
        data: {
          label: 'Educational Nurture',
          delay_days: 2,
          subject: 'When to Replace Your Roof: Signs & Timeline',
          body: 'Hi {{lead_name}}, based on our conversation, here are key signs your roof needs attention...',
          use_ai_writer: true,
        },
      },
      {
        id: 'smartscan-1',
        type: 'smartscan',
        position: { x: 100, y: 560 },
        data: {
          label: 'Property Scan',
          scan_type: 'full_roof_assessment',
          include_heatmap: true,
          detect_damage: true,
          measure_dimensions: true,
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 250, y: 700 },
        data: { label: 'Qualification Complete', outcome: 'completed' },
      },
    ],
    edges: [
      { source: 'start-1', target: 'voice-1' },
      { source: 'voice-1', target: 'condition-1' },
      { source: 'condition-1', target: 'task-1', data: { condition: 'true' } },
      { source: 'condition-1', target: 'email-1', data: { condition: 'false' } },
      { source: 'task-1', target: 'smartscan-1' },
      { source: 'smartscan-1', target: 'end-1' },
      { source: 'email-1', target: 'end-1' },
    ],
  },

  roofing_inspection_workflow: {
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        position: { x: 250, y: 50 },
        data: { label: 'Inspection Scheduled' },
      },
      {
        id: 'sms-1',
        type: 'sms',
        position: { x: 250, y: 150 },
        data: {
          label: '24hr Reminder',
          delay_days: 0,
          delay_hours: 0,
          message: 'Hi {{lead_name}}! Your roof inspection is tomorrow at {{appointment_time}}. See you then!',
        },
      },
      {
        id: 'wait-1',
        type: 'wait',
        position: { x: 250, y: 250 },
        data: { label: 'Wait for Inspection', delay_days: 1, delay_hours: 0 },
      },
      {
        id: 'smartscan-1',
        type: 'smartscan',
        position: { x: 250, y: 350 },
        data: {
          label: 'Inspector-Led Scan',
          scan_type: 'full_roof_assessment',
          include_heatmap: true,
          detect_damage: true,
          measure_dimensions: true,
          capture_photos: true,
        },
      },
      {
        id: 'report-1',
        type: 'report',
        position: { x: 250, y: 480 },
        data: {
          label: 'Comprehensive Inspection Report',
          template: 'full_inspection',
          attach_imagery: true,
          include_financing: true,
          include_warranty_info: true,
          delivery_channel: 'email',
        },
      },
      {
        id: 'wait-2',
        type: 'wait',
        position: { x: 250, y: 610 },
        data: { label: 'Wait for Decision', delay_days: 3, delay_hours: 0 },
      },
      {
        id: 'condition-1',
        type: 'condition',
        position: { x: 250, y: 740 },
        data: {
          label: 'Customer Responded?',
          condition: 'lead_responded',
        },
      },
      {
        id: 'voice-1',
        type: 'voice_call',
        position: { x: 100, y: 880 },
        data: {
          label: 'Follow-up Call',
          delay_days: 0,
          conversation_goal: 'Answer questions about inspection report and pricing',
          ai_instructions: 'Review report findings. Address concerns. Offer financing options.',
        },
      },
      {
        id: 'task-1',
        type: 'task',
        position: { x: 400, y: 880 },
        data: {
          label: 'Sales Close Task',
          assignee: 'sales_team',
          due_days: 1,
          instructions: 'Customer engaged with report. Schedule proposal meeting.',
        },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 250, y: 1020 },
        data: { label: 'Inspection Workflow Complete', outcome: 'completed' },
      },
    ],
    edges: [
      { source: 'start-1', target: 'sms-1' },
      { source: 'sms-1', target: 'wait-1' },
      { source: 'wait-1', target: 'smartscan-1' },
      { source: 'smartscan-1', target: 'report-1' },
      { source: 'report-1', target: 'wait-2' },
      { source: 'wait-2', target: 'condition-1' },
      { source: 'condition-1', target: 'task-1', data: { condition: 'true' } },
      { source: 'condition-1', target: 'voice-1', data: { condition: 'false' } },
      { source: 'voice-1', target: 'end-1' },
      { source: 'task-1', target: 'end-1' },
    ],
  },
};

/**
 * Mock sequence templates
 */
export const mockTemplates: SequenceTemplate[] = [
  {
    name: 'hot_lead_followup',
    display_name: 'Hot Lead Follow-up',
    description: 'Quick response sequence for hot leads with email, wait, and call',
    category: 'conversion',
    estimated_duration_days: 3,
    node_count: 7,
    preview_flow_data: sampleFlows.hot_lead_followup,
  },
  {
    name: 'nurture_sequence',
    display_name: 'Long-term Nurture',
    description: 'Educational email sequence to nurture cold leads over time',
    category: 'nurturing',
    estimated_duration_days: 30,
    node_count: 5,
    preview_flow_data: sampleFlows.nurture_sequence,
  },
  {
    name: 'smartscan_workflow',
    display_name: 'SmartScan Workflow',
    description: 'Automated property scan with AI-generated report',
    category: 'automation',
    estimated_duration_days: 1,
    node_count: 4,
  },
  {
    name: 'voice_first',
    display_name: 'Voice-First Outreach',
    description: 'Lead with an AI voice call, then follow up via email',
    category: 'conversion',
    estimated_duration_days: 2,
    node_count: 5,
  },
  // ROOFING-SPECIFIC TEMPLATES
  {
    name: 'storm_damage_response',
    display_name: '🌩️ Storm Damage Response',
    description: 'Urgent workflow for storm-damaged roofs with SmartScan, severity routing, and insurance support',
    category: 'roofing',
    estimated_duration_days: 2,
    node_count: 8,
    preview_flow_data: sampleFlows.storm_damage_response,
  },
  {
    name: 'roofing_lead_qualification',
    display_name: '🏠 Roofing Lead Qualification',
    description: 'AI-powered qualification call to score leads based on roof age, damage, urgency, and budget',
    category: 'roofing',
    estimated_duration_days: 3,
    node_count: 7,
    preview_flow_data: sampleFlows.roofing_lead_qualification,
  },
  {
    name: 'roofing_inspection_workflow',
    display_name: '🔍 Roof Inspection Workflow',
    description: 'Complete inspection lifecycle: scheduling, reminders, on-site scan, detailed report, and follow-up',
    category: 'roofing',
    estimated_duration_days: 5,
    node_count: 10,
    preview_flow_data: sampleFlows.roofing_inspection_workflow,
  },
];

/**
 * Mock sequences for testing
 */
export const mockSequences: Sequence[] = [
  {
    id: 1,
    name: 'Hot Lead Follow-up',
    description: 'Quick response for interested leads',
    is_active: true,
    flow_data: sampleFlows.hot_lead_followup,
    total_enrolled: 45,
    total_completed: 32,
    total_converted: 18,
    conversion_rate: 0.4,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    name: 'Long-term Nurture',
    description: 'Educational sequence for cold leads',
    is_active: true,
    flow_data: sampleFlows.nurture_sequence,
    total_enrolled: 120,
    total_completed: 85,
    total_converted: 12,
    conversion_rate: 0.1,
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    name: 'Testing Sequence',
    description: 'For internal testing',
    is_active: false,
    flow_data: null,
    total_enrolled: 5,
    total_completed: 2,
    total_converted: 0,
    conversion_rate: 0,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // ROOFING-SPECIFIC SEQUENCES
  {
    id: 4,
    name: '🌩️ Post-Storm Response (Active)',
    description: 'Urgent workflow for storm-damaged properties',
    is_active: true,
    flow_data: sampleFlows.storm_damage_response,
    total_enrolled: 87,
    total_completed: 62,
    total_converted: 48,
    conversion_rate: 0.55,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    name: '🏠 Roofing Lead Qualifier',
    description: 'AI-powered lead scoring and routing',
    is_active: true,
    flow_data: sampleFlows.roofing_lead_qualification,
    total_enrolled: 203,
    total_completed: 178,
    total_converted: 71,
    conversion_rate: 0.35,
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    name: '🔍 Inspection Lifecycle',
    description: 'Complete inspection workflow with follow-up',
    is_active: true,
    flow_data: sampleFlows.roofing_inspection_workflow,
    total_enrolled: 156,
    total_completed: 124,
    total_converted: 89,
    conversion_rate: 0.57,
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * In-memory storage for mock data (simulates database)
 */
export class MockDatabase {
  private sequences: Map<number, Sequence> = new Map();
  private nextId = 7; // Updated to accommodate roofing sequences

  constructor() {
    // Initialize with mock sequences
    mockSequences.forEach((seq) => this.sequences.set(seq.id, { ...seq }));
  }

  getAllSequences(): Sequence[] {
    return Array.from(this.sequences.values());
  }

  getSequence(id: number): Sequence | undefined {
    return this.sequences.get(id);
  }

  createSequence(data: Partial<Sequence>): Sequence {
    const newSequence: Sequence = {
      id: this.nextId++,
      name: data.name || 'Untitled Sequence',
      description: data.description || null,
      is_active: data.is_active ?? false,
      is_template: false,
      flow_data: data.flow_data || null,
      total_enrolled: 0,
      total_completed: 0,
      total_converted: 0,
      conversion_rate: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.sequences.set(newSequence.id, newSequence);
    return { ...newSequence };
  }

  updateSequence(id: number, updates: Partial<Sequence>): Sequence | undefined {
    const existing = this.sequences.get(id);
    if (!existing) return undefined;

    const updated: Sequence = {
      ...existing,
      ...updates,
      id: existing.id, // Ensure ID doesn't change
      updated_at: new Date().toISOString(),
    };

    this.sequences.set(id, updated);
    return { ...updated };
  }

  deleteSequence(id: number): boolean {
    return this.sequences.delete(id);
  }

  reset() {
    this.sequences.clear();
    this.nextId = 7;
    mockSequences.forEach((seq) => this.sequences.set(seq.id, { ...seq }));
  }
}
