/**
 * Mock Service Worker (MSW) handlers for API mocking
 */

import { http, HttpResponse } from 'msw';
import { MockDatabase, mockTemplates, sampleFlows } from './data';
import type { CreateSequencePayload, Sequence } from '../types';
import { createDefaultFlow } from '../utils/validation';

// Create a singleton mock database instance
const db = new MockDatabase();

/**
 * API request handlers
 */
export const handlers = [
  // GET /api/sequences - List all sequences
  http.get('/api/sequences', () => {
    const sequences = db.getAllSequences();
    return HttpResponse.json(sequences);
  }),

  // GET /api/sequences/:id - Get a single sequence
  http.get('/api/sequences/:id', ({ params }) => {
    const id = Number(params.id);
    const sequence = db.getSequence(id);

    if (!sequence) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Sequence not found',
      });
    }

    return HttpResponse.json(sequence);
  }),

  // POST /api/sequences - Create a new sequence
  http.post('/api/sequences', async ({ request }) => {
    const payload = (await request.json()) as unknown as CreateSequencePayload;

    let flow_data = null;

    // Check if creating from template
    if ('template_name' in payload && payload.template_name) {
      const templateFlow = sampleFlows[payload.template_name];
      flow_data = templateFlow || createDefaultFlow();
    } else if ('flow_data' in payload && payload.flow_data) {
      flow_data = payload.flow_data;
    } else {
      // Create default flow with start and end
      flow_data = createDefaultFlow();
    }

    const newSequence = db.createSequence({
      name: payload.name,
      description: payload.description,
      flow_data,
      is_active: false,
    });

    return HttpResponse.json(newSequence, { status: 201 });
  }),

  // PUT /api/sequences/:id - Update a sequence
  http.put('/api/sequences/:id', async ({ params, request }) => {
    const id = Number(params.id);
    const updates = (await request.json()) as unknown as Partial<Sequence>;

    const updated = db.updateSequence(id, updates);

    if (!updated) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Sequence not found',
      });
    }

    return HttpResponse.json(updated);
  }),

  // DELETE /api/sequences/:id - Delete a sequence
  http.delete('/api/sequences/:id', ({ params }) => {
    const id = Number(params.id);
    const deleted = db.deleteSequence(id);

    if (!deleted) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Sequence not found',
      });
    }

    return HttpResponse.json({
      status: 'deleted',
      message: `Sequence ${id} deleted successfully`,
    });
  }),

  // GET /api/sequences/templates - Get sequence templates
  http.get('/api/sequences/templates', () => {
    return HttpResponse.json(mockTemplates);
  }),

  // POST /api/sequences/:id/enroll - Enroll leads in a sequence
  http.post('/api/sequences/:id/enroll', async ({ params, request }) => {
    const sequenceId = Number(params.id);
    const { lead_ids } = (await request.json()) as { lead_ids: number[] };

    const sequence = db.getSequence(sequenceId);
    if (!sequence) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Sequence not found',
      });
    }

    // Simulate enrollment
    const enrollments = lead_ids.map((leadId: number, index: number) => ({
      lead_id: leadId,
      enrollment_id: Date.now() + index,
      status: 'enrolled',
    }));

    // Update sequence stats
    db.updateSequence(sequenceId, {
      total_enrolled: (sequence.total_enrolled || 0) + lead_ids.length,
    });

    return HttpResponse.json({
      enrolled_count: lead_ids.length,
      error_count: 0,
      enrollments,
      errors: [],
    });
  }),

  // PUT /api/sequences/enrollments/:id - Update an enrollment
  http.put('/api/sequences/enrollments/:id', async ({ params, request }) => {
    const enrollmentId = Number(params.id);
    const { action, notes } = (await request.json()) as { action: string; notes?: string };

    return HttpResponse.json({
      status: 'success',
      message: `Enrollment ${enrollmentId} ${action} successfully`,
      data: {
        enrollment_id: enrollmentId,
        action,
        notes,
      },
    });
  }),

  // POST /api/sequences/process - Trigger sequence processing
  http.post('/api/sequences/process', () => {
    return HttpResponse.json({
      status: 'success',
      message: 'Processing triggered successfully',
      processed_count: Math.floor(Math.random() * 20) + 5,
    });
  }),

  // GET /api/sequences/:id/performance - Get sequence performance
  http.get('/api/sequences/:id/performance', ({ params }) => {
    const sequenceId = Number(params.id);
    const sequence = db.getSequence(sequenceId);

    if (!sequence) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Sequence not found',
      });
    }

    return HttpResponse.json({
      sequence_id: sequenceId,
      total_enrolled: sequence.total_enrolled || 0,
      total_completed: sequence.total_completed || 0,
      total_active: Math.floor((sequence.total_enrolled || 0) * 0.3),
      total_paused: Math.floor((sequence.total_enrolled || 0) * 0.1),
      total_cancelled: Math.floor((sequence.total_enrolled || 0) * 0.05),
      total_converted: sequence.total_converted || 0,
      total_failed: Math.floor((sequence.total_enrolled || 0) * 0.02),
      conversion_rate: sequence.conversion_rate || 0,
      completion_rate:
        sequence.total_enrolled && sequence.total_enrolled > 0
          ? (sequence.total_completed || 0) / sequence.total_enrolled
          : 0,
      average_completion_days: 5.2,
      last_updated: new Date().toISOString(),
    });
  }),

  // GET /api/sequences/:id/analytics - Get sequence analytics
  http.get('/api/sequences/:id/analytics', ({ params }) => {
    const sequenceId = Number(params.id);
    const sequence = db.getSequence(sequenceId);

    if (!sequence) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Sequence not found',
      });
    }

    // Generate mock analytics based on flow_data
    const stepAnalytics =
      sequence.flow_data?.nodes
        .filter((node) => ['email', 'sms', 'voice_call'].includes(node.type))
        .map((node) => {
          const totalSent = Math.floor(Math.random() * 100) + 50;
          const totalDelivered = Math.floor(totalSent * 0.95);
          const totalResponded = Math.floor(totalDelivered * 0.3);

          return {
            node_id: node.id,
            node_type: node.type,
            label: node.data.label || node.type,
            total_sent: totalSent,
            total_delivered: totalDelivered,
            total_failed: totalSent - totalDelivered,
            total_responded: totalResponded,
            response_rate: totalDelivered > 0 ? totalResponded / totalDelivered : 0,
            average_response_time_hours: Math.random() * 48,
          };
        }) || [];

    const channelAnalytics = [
      {
        channel: 'email' as const,
        total_sent: 250,
        total_delivered: 240,
        total_failed: 10,
        total_responded: 85,
        response_rate: 0.354,
        delivery_rate: 0.96,
      },
      {
        channel: 'sms' as const,
        total_sent: 150,
        total_delivered: 148,
        total_failed: 2,
        total_responded: 65,
        response_rate: 0.439,
        delivery_rate: 0.987,
      },
      {
        channel: 'voice_call' as const,
        total_sent: 80,
        total_delivered: 72,
        total_failed: 8,
        total_responded: 45,
        response_rate: 0.625,
        delivery_rate: 0.9,
      },
    ];

    // Generate time series data for last 30 days
    const timeSeries = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));

      return {
        date: date.toISOString().split('T')[0],
        enrolled: Math.floor(Math.random() * 10) + 2,
        completed: Math.floor(Math.random() * 8),
        converted: Math.floor(Math.random() * 3),
        active: Math.floor(Math.random() * 15) + 5,
      };
    });

    return HttpResponse.json({
      sequence_id: sequenceId,
      performance: {
        sequence_id: sequenceId,
        total_enrolled: sequence.total_enrolled || 0,
        total_completed: sequence.total_completed || 0,
        total_active: Math.floor((sequence.total_enrolled || 0) * 0.3),
        total_paused: Math.floor((sequence.total_enrolled || 0) * 0.1),
        total_cancelled: Math.floor((sequence.total_enrolled || 0) * 0.05),
        total_converted: sequence.total_converted || 0,
        total_failed: Math.floor((sequence.total_enrolled || 0) * 0.02),
        conversion_rate: sequence.conversion_rate || 0,
        completion_rate:
          sequence.total_enrolled && sequence.total_enrolled > 0
            ? (sequence.total_completed || 0) / sequence.total_enrolled
            : 0,
        last_updated: new Date().toISOString(),
      },
      step_analytics: stepAnalytics,
      channel_analytics: channelAnalytics,
      time_series: timeSeries,
      last_updated: new Date().toISOString(),
    });
  }),
];

/**
 * Reset the mock database to initial state
 */
export function resetMockDatabase() {
  db.reset();
}
