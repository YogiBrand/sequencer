/**
 * Validation utilities for sequence flows
 */

import type {
  FlowData,
  FlowNode,
  FlowEdge,
  SequenceValidationError,
  SequenceValidationResult,
} from '../types';

/**
 * Validate a sequence flow
 *
 * Checks for:
 * - Exactly one start node
 * - At least one end node
 * - All condition nodes have both true and false branches
 * - No orphaned nodes (all nodes reachable from start)
 * - No invalid edges
 *
 * @param flowData - The flow data to validate
 * @returns Validation result with any errors found
 */
export function validateSequenceFlow(flowData: FlowData | null): SequenceValidationResult {
  const errors: SequenceValidationError[] = [];

  if (!flowData || !flowData.nodes || flowData.nodes.length === 0) {
    errors.push({
      message: 'Sequence must have at least one node',
    });
    return { valid: false, errors };
  }

  const { nodes, edges } = flowData;

  // Check for exactly one start node
  const startNodes = nodes.filter((node) => node.type === 'start');
  if (startNodes.length === 0) {
    errors.push({
      message: 'Sequence must have exactly one start node',
    });
  } else if (startNodes.length > 1) {
    errors.push({
      message: 'Sequence can only have one start node',
    });
  }

  // Check for at least one end node
  const endNodes = nodes.filter((node) => node.type === 'end');
  if (endNodes.length === 0) {
    errors.push({
      message: 'Sequence must have at least one end node',
    });
  }

  // Check condition nodes have both true and false branches
  const conditionNodes = nodes.filter((node) => node.type === 'condition');
  conditionNodes.forEach((conditionNode) => {
    const outgoingEdges = edges.filter((edge) => edge.source === conditionNode.id);
    const hasTrueBranch = outgoingEdges.some(
      (edge) => edge.data?.condition === 'true' || (edge.data?.condition as any) === true
    );
    const hasFalseBranch = outgoingEdges.some(
      (edge) => edge.data?.condition === 'false' || (edge.data?.condition as any) === false
    );

    if (!hasTrueBranch || !hasFalseBranch) {
      errors.push({
        message: `Condition node "${conditionNode.data.label || conditionNode.id}" must have both true and false branches`,
        node_id: conditionNode.id,
      });
    }
  });

  // Check for orphaned nodes (nodes not reachable from start)
  if (startNodes.length === 1) {
    const reachableNodes = findReachableNodes(startNodes[0], nodes, edges);
    const orphanedNodes = nodes.filter(
      (node) => node.type !== 'start' && !reachableNodes.has(node.id)
    );

    orphanedNodes.forEach((node) => {
      errors.push({
        message: `Node "${node.data.label || node.id}" is not reachable from the start node`,
        node_id: node.id,
      });
    });
  }

  // Check for invalid edges (edges pointing to non-existent nodes)
  const nodeIds = new Set(nodes.map((node) => node.id));
  edges.forEach((edge) => {
    if (!nodeIds.has(edge.source)) {
      errors.push({
        message: `Edge has invalid source node: ${edge.source}`,
      });
    }
    if (!nodeIds.has(edge.target)) {
      errors.push({
        message: `Edge has invalid target node: ${edge.target}`,
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Find all nodes reachable from a given node via DFS
 */
function findReachableNodes(
  startNode: FlowNode,
  _allNodes: FlowNode[],
  edges: FlowEdge[]
): Set<string> {
  const reachable = new Set<string>();
  const visited = new Set<string>();
  const stack = [startNode.id];

  while (stack.length > 0) {
    const nodeId = stack.pop()!;
    if (visited.has(nodeId)) continue;

    visited.add(nodeId);
    reachable.add(nodeId);

    // Find all outgoing edges from this node
    const outgoingEdges = edges.filter((edge) => edge.source === nodeId);
    outgoingEdges.forEach((edge) => {
      if (!visited.has(edge.target)) {
        stack.push(edge.target);
      }
    });
  }

  return reachable;
}

/**
 * Create a basic valid flow with start and end nodes
 *
 * @returns A minimal valid flow structure
 */
export function createDefaultFlow(): FlowData {
  return {
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        position: { x: 250, y: 50 },
        data: { label: 'Start' },
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 250, y: 300 },
        data: { label: 'End', outcome: 'completed' },
      },
    ],
    edges: [
      {
        source: 'start-1',
        target: 'end-1',
      },
    ],
  };
}

/**
 * Generate a unique node ID
 */
export function generateNodeId(type: string): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a unique edge ID
 */
export function generateEdgeId(source: string, target: string): string {
  return `edge-${source}-${target}-${Math.random().toString(36).substr(2, 9)}`;
}
