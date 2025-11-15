import React from 'react';
import type { Node } from '@xyflow/react';
import { Button } from '../common/Button';
import { Input, TextArea, Select } from '../common/Input';
import { NODE_TYPE_INFO } from '../../utils/nodeHelpers';
import type { SequenceNodeType } from '../../types';

export interface NodeConfiguratorProps {
  node: Node;
  onUpdate: (data: Record<string, any>) => void;
  onDelete: () => void;
  onClose: () => void;
}

/**
 * Configuration panel for editing node properties
 */
export const NodeConfigurator: React.FC<NodeConfiguratorProps> = ({
  node,
  onUpdate,
  onDelete,
  onClose,
}) => {
  const nodeType = node.type as SequenceNodeType;
  const nodeInfo = NODE_TYPE_INFO[nodeType];
  const data = node.data as any; // Cast to any for easier access

  const handleChange = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  const renderCommonFields = () => (
    <>
      <Input
        label="Label"
        value={data.label || ''}
        onChange={(e) => handleChange('label', e.target.value)}
        placeholder={nodeInfo.label}
      />

      {nodeType !== 'start' && nodeType !== 'end' && nodeType !== 'wait' && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Delay (days)"
              type="number"
              min="0"
              value={data.delay_days ?? ''}
              onChange={(e) => handleChange('delay_days', parseInt(e.target.value) || 0)}
            />
            <Input
              label="Delay (hours)"
              type="number"
              min="0"
              max="23"
              value={data.delay_hours ?? 0}
              onChange={(e) => handleChange('delay_hours', parseInt(e.target.value) || 0)}
            />
          </div>

          <Input
            label="Send Time"
            type="time"
            value={data.send_time || ''}
            onChange={(e) => handleChange('send_time', e.target.value)}
            placeholder="09:00"
          />
        </>
      )}
    </>
  );

  const renderTypeSpecificFields = () => {
    switch (nodeType) {
      case 'email':
        return (
          <>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.use_ai_writer || false}
                onChange={(e) => handleChange('use_ai_writer', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Use AI Writer</span>
            </label>

            {data.use_ai_writer && (
              <TextArea
                label="AI Prompt"
                value={data.ai_prompt || ''}
                onChange={(e) => handleChange('ai_prompt', e.target.value)}
                rows={3}
                placeholder="Write a friendly follow-up email..."
              />
            )}

            <Input
              label="Subject"
              value={data.subject || ''}
              onChange={(e) => handleChange('subject', e.target.value)}
              placeholder="Email subject"
            />

            <TextArea
              label="Body"
              value={data.body || ''}
              onChange={(e) => handleChange('body', e.target.value)}
              rows={6}
              placeholder="Email body content..."
            />
          </>
        );

      case 'sms':
        return (
          <>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.use_ai_writer || false}
                onChange={(e) => handleChange('use_ai_writer', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Use AI Writer</span>
            </label>

            <TextArea
              label="Message"
              value={data.message || ''}
              onChange={(e) => handleChange('message', e.target.value)}
              rows={4}
              placeholder="SMS message..."
              maxLength={160}
            />
          </>
        );

      case 'voice_call':
        return (
          <>
            <TextArea
              label="AI Instructions"
              value={data.ai_instructions || ''}
              onChange={(e) => handleChange('ai_instructions', e.target.value)}
              rows={3}
              placeholder="Be friendly and professional..."
            />

            <Input
              label="Conversation Goal"
              value={data.conversation_goal || ''}
              onChange={(e) => handleChange('conversation_goal', e.target.value)}
              placeholder="Schedule a consultation"
            />

            <Input
              label="Max Turns"
              type="number"
              min="1"
              value={data.max_turns ?? 10}
              onChange={(e) => handleChange('max_turns', parseInt(e.target.value) || 10)}
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.enable_barge_in ?? true}
                onChange={(e) => handleChange('enable_barge_in', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Enable Barge-in</span>
            </label>
          </>
        );

      case 'wait':
        return (
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Wait (days)"
              type="number"
              min="0"
              value={data.delay_days ?? 1}
              onChange={(e) => handleChange('delay_days', parseInt(e.target.value) || 0)}
            />
            <Input
              label="Wait (hours)"
              type="number"
              min="0"
              max="23"
              value={data.delay_hours ?? 0}
              onChange={(e) => handleChange('delay_hours', parseInt(e.target.value) || 0)}
            />
          </div>
        );

      case 'condition':
        return (
          <Select
            label="Condition"
            value={data.condition || 'lead_responded'}
            onChange={(e) => handleChange('condition', e.target.value)}
            options={[
              { value: 'lead_responded', label: 'Lead Responded' },
              { value: 'lead_booked', label: 'Lead Booked Appointment' },
              { value: 'email_opened', label: 'Email Opened' },
              { value: 'link_clicked', label: 'Link Clicked' },
            ]}
          />
        );

      case 'smartscan':
        return (
          <>
            <Select
              label="Scan Type"
              value={data.scan_type || 'full'}
              onChange={(e) => handleChange('scan_type', e.target.value)}
              options={[
                { value: 'full', label: 'Full Scan' },
                { value: 'quick', label: 'Quick Scan' },
                { value: 'roof_only', label: 'Roof Only' },
              ]}
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.include_heatmap ?? true}
                onChange={(e) => handleChange('include_heatmap', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Include Heatmap</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.notify_team || false}
                onChange={(e) => handleChange('notify_team', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Notify Team</span>
            </label>
          </>
        );

      case 'task':
        return (
          <>
            <Input
              label="Assignee"
              value={data.assignee || ''}
              onChange={(e) => handleChange('assignee', e.target.value)}
              placeholder="sales_team"
            />

            <Input
              label="Due (days from now)"
              type="number"
              min="0"
              value={data.due_days ?? 1}
              onChange={(e) => handleChange('due_days', parseInt(e.target.value) || 1)}
            />

            <TextArea
              label="Instructions"
              value={data.instructions || ''}
              onChange={(e) => handleChange('instructions', e.target.value)}
              rows={4}
              placeholder="Task instructions..."
            />
          </>
        );

      case 'lead_replacement':
        return (
          <>
            <Input
              label="Quality Threshold (%)"
              type="number"
              min="0"
              max="100"
              value={String(data.quality_threshold ?? 80)}
              onChange={(e) => handleChange('quality_threshold', parseInt(e.target.value) || 80)}
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(data.auto_credit ?? true)}
                onChange={(e) => handleChange('auto_credit', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Auto Credit</span>
            </label>

            <Input
              label="Review Window (hours)"
              type="number"
              min="0"
              value={String(data.review_window_hours ?? 24)}
              onChange={(e) =>
                handleChange('review_window_hours', parseInt(e.target.value) || 24)
              }
            />
          </>
        );

      case 'report':
        return (
          <>
            <Select
              label="Template"
              value={String(data.template || 'standard')}
              onChange={(e) => handleChange('template', e.target.value)}
              options={[
                { value: 'standard', label: 'Standard Report' },
                { value: 'detailed', label: 'Detailed Report' },
                { value: 'executive', label: 'Executive Summary' },
              ]}
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.attach_imagery ?? true}
                onChange={(e) => handleChange('attach_imagery', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Attach Imagery</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.include_financing || false}
                onChange={(e) => handleChange('include_financing', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Include Financing Options</span>
            </label>

            <Select
              label="Delivery Channel"
              value={data.delivery_channel || 'email'}
              onChange={(e) => handleChange('delivery_channel', e.target.value)}
              options={[
                { value: 'email', label: 'Email' },
                { value: 'sms', label: 'SMS' },
                { value: 'both', label: 'Email & SMS' },
              ]}
            />
          </>
        );

      case 'end':
        return (
          <Select
            label="Outcome"
            value={data.outcome || 'completed'}
            onChange={(e) => handleChange('outcome', e.target.value)}
            options={[
              { value: 'completed', label: 'Completed' },
              { value: 'nurture', label: 'Move to Nurture' },
              { value: 'lost', label: 'Lost' },
            ]}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{nodeInfo.icon}</span>
            <h3 className="text-lg font-semibold text-gray-900">{nodeInfo.label}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <p className="text-xs text-gray-500">{nodeInfo.description}</p>
      </div>

      {/* Configuration Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {renderCommonFields()}
        {renderTypeSpecificFields()}

        {/* Review and Manual Send Options */}
        {nodeType !== 'start' && nodeType !== 'end' && nodeType !== 'wait' && nodeType !== 'condition' && (
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.require_review || false}
                onChange={(e) => handleChange('require_review', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Require Review</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.manual_send || false}
                onChange={(e) => handleChange('manual_send', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium">Manual Send Only</span>
            </label>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <Button variant="danger" className="w-full" onClick={onDelete}>
          Delete Node
        </Button>
      </div>
    </div>
  );
};
