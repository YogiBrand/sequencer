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
];

/**
 * In-memory storage for mock data (simulates database)
 */
export class MockDatabase {
  private sequences: Map<number, Sequence> = new Map();
  private nextId = 4;

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
    this.nextId = 4;
    mockSequences.forEach((seq) => this.sequences.set(seq.id, { ...seq }));
  }
}
