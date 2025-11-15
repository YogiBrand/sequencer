import { useState } from 'react';
import { SequenceManager } from './components/SequenceManager/SequenceManager';
import { SequenceBuilder } from './components/SequenceBuilder/SequenceBuilder';
import { createSequenceClient } from './api/sequenceClient';
import type { Sequence } from './types';

// Create API client (using mock backend in development)
const client = createSequenceClient({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
});

/**
 * Demo application showing the Sequence Builder in action
 */
function App() {
  const [currentView, setCurrentView] = useState<'manager' | 'builder'>('manager');
  const [selectedSequence, setSelectedSequence] = useState<Sequence | undefined>();

  const handleEnterBuilder = (sequence?: Sequence) => {
    setSelectedSequence(sequence);
    setCurrentView('builder');
  };

  const handleExitBuilder = () => {
    setCurrentView('manager');
    setSelectedSequence(undefined);
  };

  const handleSave = async (sequenceData: Partial<Sequence>) => {
    try {
      let savedSequence: Sequence;

      if (sequenceData.id) {
        // Update existing
        savedSequence = await client.sequences.update(sequenceData.id, {
          name: sequenceData.name,
          description: sequenceData.description ?? undefined,
          is_active: sequenceData.is_active,
          flow_data: sequenceData.flow_data ?? undefined,
        });
      } else {
        // Create new
        savedSequence = await client.sequences.create({
          name: sequenceData.name!,
          description: sequenceData.description,
          flow_data: sequenceData.flow_data ?? undefined,
        });
      }

      console.log('Sequence saved:', savedSequence);
      handleExitBuilder();
    } catch (error) {
      console.error('Failed to save sequence:', error);
      alert('Failed to save sequence. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'manager' ? (
        <SequenceManager
          client={client}
          onEnterBuilder={handleEnterBuilder}
          onSequenceSelected={(seq) => console.log('Selected:', seq)}
          onSequenceSaved={(seq) => console.log('Saved:', seq)}
        />
      ) : (
        <SequenceBuilder
          sequenceId={selectedSequence?.id}
          initialSequence={selectedSequence}
          onSave={handleSave}
          onClose={handleExitBuilder}
        />
      )}
    </div>
  );
}

export default App;
