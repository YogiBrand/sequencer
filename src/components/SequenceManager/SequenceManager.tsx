import React, { useState, useEffect } from 'react';
import type { SequenceClient } from '../../api/sequenceClient';
import type { Sequence, SequenceTemplate } from '../../types';
import { Button } from '../common/Button';
import { SequenceCard } from './SequenceCard';
import { TemplateSelector } from './TemplateSelector';
import { createDefaultFlow } from '../../utils/validation';

export interface SequenceManagerProps {
  /** API client instance */
  client: SequenceClient;
  /** Callback when a sequence is selected for editing */
  onSequenceSelected?: (sequence: Sequence) => void;
  /** Callback when a sequence is saved */
  onSequenceSaved?: (sequence: Sequence) => void;
  /** Callback when entering builder mode */
  onEnterBuilder?: (sequence?: Sequence) => void;
}

/**
 * Main sequence manager component for listing and managing sequences
 */
export const SequenceManager: React.FC<SequenceManagerProps> = ({
  client,
  onSequenceSelected,
  onSequenceSaved,
  onEnterBuilder,
}) => {
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [templates, setTemplates] = useState<SequenceTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load sequences on mount
  useEffect(() => {
    loadSequences();
    loadTemplates();
  }, []);

  const loadSequences = async () => {
    try {
      setLoading(true);
      const data = await client.sequences.list();
      setSequences(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load sequences:', err);
      setError('Failed to load sequences');
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const data = await client.sequences.getTemplates();
      setTemplates(data);
    } catch (err) {
      console.error('Failed to load templates:', err);
    }
  };

  const handleCreateBlank = async () => {
    try {
      const newSequence = await client.sequences.create({
        name: 'New Sequence',
        description: 'Click to edit description',
        flow_data: createDefaultFlow(),
      });
      setSequences([newSequence, ...sequences]);
      onEnterBuilder?.(newSequence);
      onSequenceSaved?.(newSequence);
    } catch (err) {
      console.error('Failed to create sequence:', err);
      setError('Failed to create sequence');
    }
  };

  const handleCreateFromTemplate = async (templateName: string) => {
    try {
      const template = templates.find((t) => t.name === templateName);
      const newSequence = await client.sequences.create({
        name: template?.display_name || 'New Sequence',
        description: template?.description,
        template_name: templateName,
      });
      setSequences([newSequence, ...sequences]);
      setShowTemplateSelector(false);
      onEnterBuilder?.(newSequence);
      onSequenceSaved?.(newSequence);
    } catch (err) {
      console.error('Failed to create sequence from template:', err);
      setError('Failed to create sequence from template');
    }
  };

  const handleEdit = (sequence: Sequence) => {
    onSequenceSelected?.(sequence);
    onEnterBuilder?.(sequence);
  };

  const handleDuplicate = async (sequence: Sequence) => {
    try {
      const newSequence = await client.sequences.create({
        name: `${sequence.name} (Copy)`,
        description: sequence.description,
        flow_data: sequence.flow_data ?? undefined,
      });
      setSequences([newSequence, ...sequences]);
      onSequenceSaved?.(newSequence);
    } catch (err) {
      console.error('Failed to duplicate sequence:', err);
      setError('Failed to duplicate sequence');
    }
  };

  const handleDelete = async (sequence: Sequence) => {
    if (!confirm(`Are you sure you want to delete "${sequence.name}"?`)) {
      return;
    }

    try {
      await client.sequences.delete(sequence.id);
      setSequences(sequences.filter((s) => s.id !== sequence.id));
    } catch (err) {
      console.error('Failed to delete sequence:', err);
      setError('Failed to delete sequence');
    }
  };

  const handleToggleActive = async (sequence: Sequence) => {
    try {
      const updated = await client.sequences.update(sequence.id, {
        is_active: !sequence.is_active,
      });
      setSequences(sequences.map((s) => (s.id === sequence.id ? updated : s)));
      onSequenceSaved?.(updated);
    } catch (err) {
      console.error('Failed to update sequence:', err);
      setError('Failed to update sequence');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading sequences...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sequences</h1>
              <p className="mt-1 text-sm text-gray-500">
                Automated workflows to engage and convert leads
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setShowTemplateSelector(true)}>
                Create from Template
              </Button>
              <Button variant="primary" onClick={handleCreateBlank}>
                + New Sequence
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Sequence List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sequences.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sequences yet</h3>
            <p className="text-gray-500 mb-6">
              Get started by creating your first sequence
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={() => setShowTemplateSelector(true)}>
                Use a Template
              </Button>
              <Button variant="primary" onClick={handleCreateBlank}>
                Create from Scratch
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sequences.map((sequence) => (
              <SequenceCard
                key={sequence.id}
                sequence={sequence}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        )}
      </div>

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <TemplateSelector
          templates={templates}
          onSelect={handleCreateFromTemplate}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}
    </div>
  );
};
