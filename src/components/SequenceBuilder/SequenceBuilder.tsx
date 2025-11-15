import React, { useCallback, useState, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
  Panel,
} from '@xyflow/react';
import { nodeTypes } from './SequenceNode';
import { NodePalette } from './NodePalette';
import { NodeConfigurator } from '../NodeConfigurator/NodeConfigurator';
import type { Sequence, FlowData, FlowNode as TypeFlowNode, SequenceNodeType } from '../../types';
import { generateNodeId, generateEdgeId, validateSequenceFlow } from '../../utils/validation';
import { getDefaultNodeData } from '../../utils/nodeHelpers';

export interface SequenceBuilderProps {
  sequenceId?: number;
  initialSequence?: Sequence | null;
  onSave?: (sequence: Partial<Sequence>) => void | Promise<void>;
  onClose?: () => void | Promise<void>;
  readonly?: boolean;
}

/**
 * Enhanced Sequence Builder with GoHighLevel-style interface
 */
export const SequenceBuilder: React.FC<SequenceBuilderProps> = ({
  sequenceId,
  initialSequence,
  onSave,
  onClose,
  readonly = false,
}) => {
  const { fitView } = useReactFlow();

  // Sequence metadata
  const [name, setName] = useState(initialSequence?.name || '');
  const [description, setDescription] = useState(initialSequence?.description || '');
  const [isPublished, setIsPublished] = useState(initialSequence?.is_active || false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);

  // Convert functions
  const convertToReactFlowNode = (node: TypeFlowNode): Node => ({
    id: node.id,
    type: node.type,
    position: node.position,
    data: { ...node.data, type: node.type },
  });

  const convertFromReactFlowNode = (node: Node): TypeFlowNode => ({
    id: node.id,
    type: node.type as SequenceNodeType,
    position: node.position,
    data: node.data,
  });

  const initialNodes = initialSequence?.flow_data?.nodes?.map(convertToReactFlowNode) || [];
  const initialEdges =
    initialSequence?.flow_data?.edges?.map((edge, idx) => ({
      id: edge.id || `edge-${idx}`,
      source: edge.source,
      target: edge.target,
      data: edge.data,
      type: edge.data?.condition ? 'smoothstep' : 'default',
      label: edge.data?.condition ? (edge.data.condition === 'true' ? 'Yes' : 'No') : undefined,
    })) || [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Track changes
  const markAsChanged = () => setHasUnsavedChanges(true);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onConnect = useCallback(
    (connection: Connection) => {
      const edge: Edge = {
        id: generateEdgeId(connection.source!, connection.target!),
        source: connection.source!,
        target: connection.target!,
        type: 'smoothstep',
      };
      setEdges((eds) => addEdge(edge, eds) as any);
      markAsChanged();
    },
    [setEdges]
  );

  const handleAddNode = useCallback(
    (type: SequenceNodeType) => {
      const id = generateNodeId(type);
      const newNode: Node = {
        id,
        type,
        position: {
          x: Math.random() * 400 + 100,
          y: Math.random() * 400 + 100,
        },
        data: {
          ...getDefaultNodeData(type),
          type,
        },
      };
      setNodes((nds) => [...nds, newNode]);
      markAsChanged();
    },
    [setNodes]
  );

  const handleDeleteNode = useCallback(() => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) =>
      eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id)
    );
    setSelectedNode(null);
    markAsChanged();
  }, [selectedNode, setNodes, setEdges]);

  const handleUpdateNode = useCallback(
    (nodeId: string, data: Record<string, any>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
        )
      );
      markAsChanged();
    },
    [setNodes]
  );

  const handleSave = useCallback(async () => {
    const flowData: FlowData = {
      nodes: nodes.map(convertFromReactFlowNode),
      edges: edges.map((edge) => ({
        source: edge.source,
        target: edge.target,
        data: edge.data,
      })),
    };

    // Validate before save
    const validation = validateSequenceFlow(flowData);
    if (!validation.valid) {
      alert(`Validation errors:\n${validation.errors.map(e => `• ${e.message}`).join('\n')}`);
      return;
    }

    const sequenceData: Partial<Sequence> = {
      name,
      description: description || null,
      is_active: isPublished,
      flow_data: flowData,
    };

    if (sequenceId) {
      sequenceData.id = sequenceId;
    }

    await onSave?.(sequenceData);
    setHasUnsavedChanges(false);
  }, [nodes, edges, name, description, isPublished, sequenceId, onSave]);

  const handleTest = () => {
    setTestMode(!testMode);
    alert(testMode ? 'Test mode disabled' : 'Test mode enabled - workflow will simulate execution');
  };

  const handleFitToScreen = () => {
    fitView({ duration: 200, padding: 0.2 });
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Bar - GoHighLevel Style */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        {/* Left Side - Stats Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowStats(!showStats)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              showStats
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>📊</span>
            <span>Stats View</span>
          </button>
          <div className="h-6 w-px bg-gray-300" />
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); markAsChanged(); }}
            className="text-xl font-semibold border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
            placeholder="Workflow Name"
            disabled={readonly}
          />
        </div>

        {/* Right Side - Main Controls */}
        <div className="flex items-center gap-3">
          {/* Draft/Publish Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Draft</span>
            <button
              onClick={() => { setIsPublished(!isPublished); markAsChanged(); }}
              disabled={readonly}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isPublished ? 'bg-green-500' : 'bg-gray-300'
              } ${readonly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isPublished ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm font-medium text-gray-900">Publish</span>
          </div>

          <div className="h-6 w-px bg-gray-300" />

          {/* History Button */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            title="Version History"
          >
            <span>🕐</span>
            <span>History</span>
          </button>

          {/* Test Workflow Button */}
          <button
            onClick={handleTest}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              testMode
                ? 'bg-orange-50 text-orange-700 border border-orange-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>🧪</span>
            <span>{testMode ? 'Testing...' : 'Test'}</span>
          </button>

          {/* Save Button with Indicator */}
          <button
            onClick={handleSave}
            disabled={readonly}
            className={`relative flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              readonly
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {hasUnsavedChanges && !readonly && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
            )}
            <span>💾</span>
            <span>Save</span>
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <span>✕</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Node Palette */}
        {!readonly && (
          <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <NodePalette onAddNode={handleAddNode} />
          </div>
        )}

        {/* Canvas */}
        <div className="flex-1 relative bg-gray-50">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={(changes) => {
              onNodesChange(changes);
              markAsChanged();
            }}
            onEdgesChange={(changes) => {
              onEdgesChange(changes);
              markAsChanged();
            }}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes as any}
            fitView
            className="bg-gray-50"
            snapToGrid
            snapGrid={[15, 15]}
          >
            <Background color="#e5e7eb" gap={15} />

            {/* Bottom Left Controls */}
            <Panel position="bottom-left" className="flex flex-col gap-2">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
                <button
                  onClick={handleFitToScreen}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors w-full"
                  title="Fit to Screen"
                >
                  <span>🔍</span>
                  <span>Fit to Screen</span>
                </button>
              </div>

              {/* AI Assistant Toggle */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2">
                <button
                  onClick={() => setShowAiAssistant(!showAiAssistant)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors w-full ${
                    showAiAssistant
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>🤖</span>
                  <span>AI Assistant</span>
                </button>
              </div>
            </Panel>

            {/* Minimap - Bottom Right */}
            <MiniMap
              position="bottom-right"
              className="bg-white border border-gray-200 rounded-lg shadow-lg"
              nodeColor={() => '#e5e7eb'}
              maskColor="rgba(0, 0, 0, 0.1)"
            />

            {/* Default Controls (Zoom) */}
            <Controls
              position="bottom-left"
              className="bg-white border border-gray-200 rounded-lg shadow-lg !ml-0 !mb-32"
              showInteractive={false}
            />
          </ReactFlow>

          {/* Test Mode Overlay */}
          {testMode && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg font-medium text-sm">
              🧪 Test Mode Active - Simulating Workflow
            </div>
          )}
        </div>

        {/* Node Configurator Panel */}
        {selectedNode && !readonly && (
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <NodeConfigurator
              node={selectedNode}
              onUpdate={(data) => handleUpdateNode(selectedNode.id, data)}
              onDelete={handleDeleteNode}
              onClose={() => setSelectedNode(null)}
            />
          </div>
        )}
      </div>

      {/* AI Assistant Drawer */}
      {showAiAssistant && (
        <div className="absolute bottom-20 left-4 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <span>🤖</span>
              <span>Workflow AI Assistant</span>
            </h3>
            <button
              onClick={() => setShowAiAssistant(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="text-sm text-gray-600 space-y-2">
            <p>💡 <strong>Suggestions:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Add a wait step after email sends</li>
              <li>Use conditions to branch based on responses</li>
              <li>Consider adding a goal action</li>
            </ul>
          </div>
        </div>
      )}

      {/* Version History Panel */}
      {showHistory && (
        <div className="absolute top-16 right-4 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Version History</h3>
            <button
              onClick={() => setShowHistory(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-blue-900">Current Version</span>
                <span className="text-xs text-blue-600">Just now</span>
              </div>
              <p className="text-xs text-blue-700">Latest changes</p>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md opacity-60">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900">Version 1</span>
                <span className="text-xs text-gray-600">2 hours ago</span>
              </div>
              <p className="text-xs text-gray-700">Initial setup</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
