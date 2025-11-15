import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { NODE_TYPE_INFO } from '../../utils/nodeHelpers';
import type { FlowNode } from '../../types';
import clsx from 'clsx';

/**
 * Custom node component for React Flow
 */
export const SequenceNode: React.FC<NodeProps<FlowNode>> = ({ data, selected }) => {
  const nodeType = (data as any).type;
  const nodeInfo = NODE_TYPE_INFO[nodeType];
  const canHaveInput = nodeType !== 'start';
  const canHaveOutput = nodeType !== 'end';
  const isCondition = nodeType === 'condition';

  return (
    <div
      className={clsx(
        'px-4 py-3 rounded-lg shadow-md border-2 min-w-[180px] max-w-[250px]',
        'bg-white transition-all',
        selected ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'
      )}
      style={{
        borderLeftColor: nodeInfo.color,
        borderLeftWidth: '4px',
      }}
    >
      {canHaveInput && (
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 !bg-gray-400"
        />
      )}

      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{nodeInfo.icon}</span>
        <span className="text-xs font-semibold text-gray-500 uppercase">
          {nodeInfo.label}
        </span>
      </div>

      <div className="text-sm font-medium text-gray-900">
        {data.label || nodeInfo.label}
      </div>

      {/* Show delay if applicable */}
      {((data.delay_days || 0) > 0 || (data.delay_hours || 0) > 0) && (
        <div className="text-xs text-gray-500 mt-1">
          Delay: {data.delay_days || 0}d {data.delay_hours || 0}h
        </div>
      )}

      {/* Show condition type */}
      {isCondition && data.condition && (
        <div className="text-xs text-gray-500 mt-1">
          If: {data.condition}
        </div>
      )}

      {canHaveOutput && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-gray-400"
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
