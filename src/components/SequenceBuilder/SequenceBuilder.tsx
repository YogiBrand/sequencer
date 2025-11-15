import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
} from '@xyflow/react';
import { nodeTypes } from './SequenceNode';
import { NodePalette } from './NodePalette';
import { NodeConfigurator } from '../NodeConfigurator/NodeConfigurator';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import type { Sequence, FlowData, FlowNode as TypeFlowNode, SequenceNodeType } from '../../types';
import { generateNodeId, generateEdgeId } from '../../utils/validation';
import { getDefaultNodeData } from '../../utils/nodeHelpers';

export interface SequenceBuilderProps {
  /** Sequence ID if editing existing sequence */
  sequenceId?: number;
  /** Initial sequence data */
  initialSequence?: Sequence | null;
  /** Callback when save is requested */
  onSave?: (sequence: Partial<Sequence>) => void | Promise<void>;
  /** Callback when close is requested */
  onClose?: () => void | Promise<void>;
  /** Read-only mode */
  readonly?: boolean;
}

/**
 * Main Sequence Builder component with visual flow editor
 */
export const SequenceBuilder: React.FC<SequenceBuilderProps> = ({
  sequenceId,
  initialSequence,
  onSave,
  onClose,
  readonly = false,
}) => {
  // Sequence metadata
  const [name, setName] = useState(initialSequence?.name || '');
  const [description, setDescription] = useState(initialSequence?.description || '');
  const [isActive, setIsActive] = useState(initialSequence?.is_active || false);

  // Convert TypeFlowNode to React Flow Node format
  const convertToReactFlowNode = (node: TypeFlowNode): Node => ({
    id: node.id,
    type: node.type,
    position: node.position,
    data: { ...node.data, type: node.type },
  });

  // Convert React Flow Node to TypeFlowNode format
  const convertFromReactFlowNode = (node: Node): TypeFlowNode => ({
    id: node.id,
    type: node.type as SequenceNodeType,
    position: node.position,
    data: node.data,
  });

  // Initialize nodes and edges from initialSequence
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

  // Handle node click
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Handle connection between nodes
  const onConnect = useCallback(
    (connection: Connection) => {
      const edge: Edge = {
        id: generateEdgeId(connection.source!, connection.target!),
        source: connection.source!,
        target: connection.target!,
        type: 'smoothstep',
      };
      setEdges((eds) => addEdge(edge, eds) as any);
    },
    [setEdges]
  );

  // Add a new node to the canvas
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
    },
    [setNodes]
  );

  // Delete selected node
  const handleDeleteNode = useCallback(() => {
    if (!selectedNode) return;

    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) =>
      eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id)
    );
    setSelectedNode(null);
  }, [selectedNode, setNodes, setEdges]);

  // Update node data
  const handleUpdateNode = useCallback(
    (nodeId: string, data: Record<string, any>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: { ...node.data, ...data },
              }
            : node
        )
      );
    },
    [setNodes]
  );

  // Handle save
  const handleSave = useCallback(async () => {
    const flowData: FlowData = {
      nodes: nodes.map(convertFromReactFlowNode),
      edges: edges.map((edge) => ({
        source: edge.source,
        target: edge.target,
        data: edge.data,
      })),
    };

    const sequenceData: Partial<Sequence> = {
      name,
      description: description || null,
      is_active: isActive,
      flow_data: flowData,
    };

    if (sequenceId) {
      sequenceData.id = sequenceId;
    }

    await onSave?.(sequenceData);
  }, [nodes, edges, name, description, isActive, sequenceId, onSave]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 max-w-2xl">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sequence Name"
              className="text-lg font-semibold"
              disabled={readonly}
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                disabled={readonly}
                className="rounded"
              />
              <span className="text-sm font-medium">Active</span>
            </label>
            {!readonly && (
              <>
                <Button variant="secondary" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleSave}>
                  Save
                </Button>
              </>
            )}
          </div>
        </div>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          disabled={readonly}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Node Palette */}
        {!readonly && (
          <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
            <NodePalette onAddNode={handleAddNode} />
          </div>
        )}

        {/* Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes as any}
            fitView
            className="bg-gray-50"
          >
            <Background />
            <Controls />
            <MiniMap
              className="bg-white"
              nodeColor={() => '#e5e7eb'}
            />
          </ReactFlow>
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
    </div>
  );
};
