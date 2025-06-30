import {
	MindMapData,
	MindMapRelationship,
	MindMapNode,
} from '../types/mindmap';

// Backend data format (what we receive from API)
export interface BackendGraphData {
	nodes: MindMapNode[];
	edges?: Array<{
		source: string;
		target: string;
		relation?: string; // Backend uses 'relation' instead of 'type'
		type?: string;
		properties?: Record<string, unknown>;
	}>;
	relationships?: MindMapRelationship[];
	chunks_processed?: number;
}

/**
 * Transforms backend graph data format to frontend format
 * Backend sends 'edges' with 'relation' field, frontend expects 'relationships' with 'type' field
 */
export function transformGraphData(backendData: BackendGraphData): MindMapData {
	// Transform edges to relationships format
	let relationships: MindMapRelationship[] = [];
	if (backendData.edges) {
		relationships = backendData.edges.map(edge => ({
			source: edge.source,
			target: edge.target,
			type: edge.relation || edge.type || 'RELATES_TO',
			properties: edge.properties || {},
		}));
	} else {
		relationships = backendData.relationships || [];
	}

	return {
		nodes: backendData.nodes || [],
		relationships: relationships,
		chunks_processed: backendData.chunks_processed || 0,
	};
}
