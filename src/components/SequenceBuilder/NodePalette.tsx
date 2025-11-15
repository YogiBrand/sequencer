import React from 'react';
import { getNodesByCategory } from '../../utils/nodeHelpers';
import type { SequenceNodeType } from '../../types';

export interface NodePaletteProps {
  onAddNode: (type: SequenceNodeType) => void;
}

/**
 * Palette of available node types that can be added to the sequence
 */
export const NodePalette: React.FC<NodePaletteProps> = ({ onAddNode }) => {
  const nodesByCategory = getNodesByCategory();

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4">
        Add Step
      </h3>

      {Object.entries(nodesByCategory).map(([category, nodes]) => (
        <div key={category} className="mb-6">
          <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">
            {category}
          </h4>
          <div className="space-y-2">
            {nodes.map((nodeInfo) => (
              <button
                key={nodeInfo.type}
                onClick={() => onAddNode(nodeInfo.type)}
                className="w-full flex items-center gap-3 p-3 rounded-md border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
                style={{
                  borderLeftColor: nodeInfo.color,
                  borderLeftWidth: '3px',
                }}
              >
                <span className="text-xl">{nodeInfo.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    {nodeInfo.label}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {nodeInfo.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
