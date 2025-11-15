import React from 'react';
import type { Sequence } from '../../types';
import clsx from 'clsx';

export interface SequenceCardProps {
  sequence: Sequence;
  onEdit: (sequence: Sequence) => void;
  onDuplicate: (sequence: Sequence) => void;
  onDelete: (sequence: Sequence) => void;
  onToggleActive: (sequence: Sequence) => void;
}

export const SequenceCard: React.FC<SequenceCardProps> = ({
  sequence,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleActive,
}) => {
  const conversionRate = sequence.conversion_rate
    ? (sequence.conversion_rate * 100).toFixed(1)
    : '0.0';

  return (
    <div className="sequence-card group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{sequence.name}</h3>
          {sequence.description && (
            <p className="text-sm text-gray-500 line-clamp-2">{sequence.description}</p>
          )}
        </div>
        <div
          className={clsx(
            'ml-3 px-2 py-1 rounded text-xs font-medium',
            sequence.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-600'
          )}
        >
          {sequence.is_active ? 'Active' : 'Inactive'}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <div className="text-2xl font-bold text-gray-900">
            {sequence.total_enrolled || 0}
          </div>
          <div className="text-xs text-gray-500">Enrolled</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">
            {sequence.total_completed || 0}
          </div>
          <div className="text-xs text-gray-500">Completed</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{conversionRate}%</div>
          <div className="text-xs text-gray-500">Conversion</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
        <button
          onClick={() => onEdit(sequence)}
          className="flex-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition"
        >
          Edit
        </button>
        <button
          onClick={() => onToggleActive(sequence)}
          className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition"
        >
          {sequence.is_active ? 'Deactivate' : 'Activate'}
        </button>
        <div className="relative group/menu">
          <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded">⋯</button>
          <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 hidden group-hover/menu:block z-10">
            <button
              onClick={() => onDuplicate(sequence)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Duplicate
            </button>
            <button
              onClick={() => onDelete(sequence)}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
