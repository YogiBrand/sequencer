import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { NODE_TYPE_INFO } from '../../utils/nodeHelpers';
import type { FlowNode } from '../../types';
import clsx from 'clsx';

/**
 * Enhanced custom node component for React Flow with GoHighLevel-style design
 */
export const SequenceNode: React.FC<NodeProps<FlowNode>> = ({ data, selected }) => {
  const nodeType = (data as any).type;
  const nodeInfo = NODE_TYPE_INFO[nodeType];
  const canHaveInput = nodeType !== 'start';
  const canHaveOutput = nodeType !== 'end';
  const isCondition = nodeType === 'condition';
  const showStats = (data as any).showStats || false;

  // Mock stats data (would come from backend in real app)
  const stats = {
    sent: Math.floor(Math.random() * 100) + 10,
    opened: Math.floor(Math.random() * 80),
    clicked: Math.floor(Math.random() * 40),
    responded: Math.floor(Math.random() * 30),
  };

  return (
    <div
      className={clsx(
        'px-4 py-3 rounded-lg shadow-lg border-2 min-w-[200px] max-w-[280px]',
        'bg-white transition-all duration-200',
        selected ? 'border-blue-500 ring-4 ring-blue-200 shadow-xl' : 'border-gray-300 hover:border-gray-400'
      )}
      style={{
        borderLeftColor: nodeInfo.color,
        borderLeftWidth: '5px',
      }}
    >
      {canHaveInput && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-blue-500 border-2 border-white"
        />
      )}

      {/* Node Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-2xl flex-shrink-0">{nodeInfo.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {nodeInfo.label}
            </div>
            <div className="text-sm font-semibold text-gray-900 truncate mt-0.5">
              {data.label || nodeInfo.label}
            </div>
          </div>
        </div>
        {/* Status Indicator */}
        {data.require_review && (
          <span className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full" title="Requires Review" />
        )}
      </div>

      {/* Node Details */}
      <div className="space-y-1">
        {/* Delay Information */}
        {((data.delay_days || 0) > 0 || (data.delay_hours || 0) > 0) && (
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="text-gray-400">⏱</span>
            <span>
              {data.delay_days > 0 && `${data.delay_days}d `}
              {data.delay_hours > 0 && `${data.delay_hours}h`}
            </span>
          </div>
        )}

        {/* Condition Information */}
        {isCondition && data.condition && (
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="text-gray-400">◇</span>
            <span className="truncate">If: {data.condition}</span>
          </div>
        )}

        {/* AI Enabled */}
        {(data.use_ai_writer || data.ai_instructions) && (
          <div className="flex items-center gap-1.5 text-xs text-purple-600">
            <span>🤖</span>
            <span>AI Enabled</span>
          </div>
        )}

        {/* Manual Send */}
        {data.manual_send && (
          <div className="flex items-center gap-1.5 text-xs text-blue-600">
            <span>👤</span>
            <span>Manual Send</span>
          </div>
        )}
      </div>

      {/* Stats View (when enabled) */}
      {showStats && nodeType !== 'start' && nodeType !== 'end' && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex flex-col">
              <span className="text-gray-500">Sent</span>
              <span className="font-semibold text-gray-900">{stats.sent}</span>
            </div>
            {(nodeType === 'email' || nodeType === 'sms') && (
              <>
                <div className="flex flex-col">
                  <span className="text-gray-500">Opened</span>
                  <span className="font-semibold text-green-600">{stats.opened}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Clicked</span>
                  <span className="font-semibold text-blue-600">{stats.clicked}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Responded</span>
                  <span className="font-semibold text-purple-600">{stats.responded}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {canHaveOutput && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-blue-500 border-2 border-white"
        />
      )}
    </div>
  );
};

export const nodeTypes = {
  start: SequenceNode,
  end: SequenceNode,
  email: SequenceNode,
  sms: SequenceNode,
  voice_call: SequenceNode,
  wait: SequenceNode,
  condition: SequenceNode,
  smartscan: SequenceNode,
  task: SequenceNode,
  lead_replacement: SequenceNode,
  report: SequenceNode,
};
