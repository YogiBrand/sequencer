import React from 'react';
import type { SequenceTemplate } from '../../types';
import { Button } from '../common/Button';

export interface TemplateSelectorProps {
  templates: SequenceTemplate[];
  onSelect: (templateName: string) => void;
  onClose: () => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  onSelect,
  onClose,
}) => {
  // Group templates by category
  const templatesByCategory = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, SequenceTemplate[]>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Choose a Template</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Start with a proven sequence template
          </p>
        </div>

        {/* Template List */}
        <div className="flex-1 overflow-y-auto p-6">
          {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
            <div key={category} className="mb-8 last:mb-0">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categoryTemplates.map((template) => (
                  <button
                    key={template.name}
                    onClick={() => onSelect(template.name)}
                    className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
                  >
                    <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600">
                      {template.display_name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>{template.node_count} steps</span>
                      <span>~{template.estimated_duration_days} days</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button variant="secondary" onClick={onClose} className="w-full">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
