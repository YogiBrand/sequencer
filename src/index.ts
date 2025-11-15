/**
 * @fishmouth/sequence-builder
 *
 * Modern, production-ready Sequence Builder UI for FishMouth
 * GoHighLevel-inspired workflow designer
 */

// Export main components
export { SequenceManager } from './components/SequenceManager/SequenceManager';
export type { SequenceManagerProps } from './components/SequenceManager/SequenceManager';

export { SequenceBuilder } from './components/SequenceBuilder/SequenceBuilder';
export type { SequenceBuilderProps } from './components/SequenceBuilder/SequenceBuilder';

// Export API client
export { createSequenceClient } from './api/sequenceClient';
export type { SequenceClient, SequenceClientConfig, SequenceAPI } from './api/sequenceClient';

// Export all types
export * from './types';

// Export utilities
export {
  validateSequenceFlow,
  createDefaultFlow,
  generateNodeId,
  generateEdgeId,
} from './utils/validation';

export {
  NODE_TYPE_INFO,
  getDefaultNodeData,
  getNodesByCategory,
} from './utils/nodeHelpers';

// Export mocks for testing/development
export { handlers, resetMockDatabase } from './mocks/handlers';
export { worker, startMocking } from './mocks/browser';
export { MockDatabase, mockSequences, mockTemplates } from './mocks/data';
