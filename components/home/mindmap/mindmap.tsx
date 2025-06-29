/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { MindMapData } from '@/types/mindmap';

interface MindMapProps {
	data: MindMapData;
	width?: number;
	height?: number;
	className?: string;
}

interface Node extends d3.SimulationNodeDatum {
	id: string;
	type: string;
	properties: Record<string, any>;
	x?: number;
	y?: number;
	fx?: number | null;
	fy?: number | null;
}

interface Link extends d3.SimulationLinkDatum<Node> {
	source: Node | string;
	target: Node | string;
	type: string;
	properties: Record<string, any>;
}

// Create the actual D3 component
const D3MindMapComponent: React.FC<MindMapProps> = ({
	data,
	width = 800,
	height = 600,
	className = '',
}) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const [selectedNode, setSelectedNode] = useState<string | null>(null);
	const [d3, setD3] = useState<typeof import('d3') | null>(null);
	const simulationRef = useRef<d3.Simulation<Node, Link> | null>(null);

	// Load D3 only on client side
	useEffect(() => {
		let isMounted = true;

		const loadD3 = async () => {
			try {
				const d3Module = await import('d3');
				if (isMounted) {
					setD3(d3Module);
				}
			} catch (error) {
				console.error('Failed to load D3:', error);
			}
		};

		loadD3();

		return () => {
			isMounted = false;
		};
	}, []);

	// Color scheme for different node types based on their relationships
	const getNodeColor = useCallback((node: Node, links: Link[]): string => {
		// Get all relationship types for this node
		const nodeRelationships = links.filter(
			link =>
				(typeof link.source === 'object' ? link.source.id : link.source) ===
					node.id ||
				(typeof link.target === 'object' ? link.target.id : link.target) ===
					node.id
		);

		if (nodeRelationships.length === 0) {
			return '#74C69D'; // light green for isolated nodes
		}

		// Count relationship types and find the most common one
		const relationshipCounts: Record<string, number> = {};
		nodeRelationships.forEach(rel => {
			relationshipCounts[rel.type] = (relationshipCounts[rel.type] || 0) + 1;
		});

		// Get the dominant relationship type
		const dominantRelationship = Object.entries(relationshipCounts).sort(
			([, a], [, b]) => b - a
		)[0][0];

		// Color nodes based on their dominant relationship type using green palette
		const relationshipColorMap: Record<string, string> = {
			// Technical relationships - Green shades
			connects_to: '#52B788', // medium green
			uses: '#40916C', // main green
			depends_on: '#2D6A4F', // dark green
			contains: '#1B4332', // very dark green
			implements: '#081C15', // darkest green
			extends: '#52B788', // medium green
			inherits: '#40916C', // main green

			// Data relationships - Light green shades
			stores: '#95D5B2', // light green
			processes: '#74C69D', // medium light green
			reads: '#B7E4C7', // very light green
			writes: '#D8F3DC', // lightest green
			accesses: '#52B788', // medium green

			// Network relationships - Medium green tones
			communicates_with: '#40916C', // main green
			sends_to: '#52B788', // medium green
			receives_from: '#74C69D', // medium light green
			routes_to: '#2D6A4F', // dark green

			// Security relationships - Darker green tones
			authenticates: '#1B4332', // very dark green
			authorizes: '#081C15', // darkest green
			encrypts: '#2D6A4F', // dark green
			protects: '#40916C', // main green

			// Generic relationships - Various green shades
			related_to: '#74C69D', // medium light green
			associated_with: '#52B788', // medium green
			part_of: '#40916C', // main green
			belongs_to: '#2D6A4F', // dark green

			default: '#52B788', // medium green as fallback
		};

		return (
			relationshipColorMap[dominantRelationship.toLowerCase()] ||
			relationshipColorMap.default
		);
	}, []);

	// Color scheme for different relationship types
	const getLinkColor = useCallback((type: string): string => {
		const colorMap: Record<string, string> = {
			// Technical relationships - Various green shades
			connects_to: '#52B788', // medium green
			uses: '#40916C', // main green
			depends_on: '#74C69D', // medium light green
			contains: '#2D6A4F', // dark green
			implements: '#1B4332', // very dark green
			extends: '#95D5B2', // light green
			inherits: '#B7E4C7', // very light green

			// Data relationships - Light to medium greens
			stores: '#74C69D', // medium light green
			processes: '#52B788', // medium green
			reads: '#95D5B2', // light green
			writes: '#B7E4C7', // very light green
			accesses: '#40916C', // main green

			// Network relationships - Medium greens
			communicates_with: '#40916C', // main green
			sends_to: '#52B788', // medium green
			receives_from: '#74C69D', // medium light green
			routes_to: '#2D6A4F', // dark green

			// Security relationships - Darker greens
			authenticates: '#1B4332', // very dark green
			authorizes: '#081C15', // darkest green
			encrypts: '#2D6A4F', // dark green
			protects: '#40916C', // main green

			// Generic relationships - Various green tones
			related_to: '#74C69D', // medium light green
			associated_with: '#52B788', // medium green
			part_of: '#40916C', // main green
			belongs_to: '#2D6A4F', // dark green

			default: '#52B788', // medium green as default
		};
		return colorMap[type.toLowerCase()] || colorMap.default;
	}, []);

	// Get link opacity based on relationship importance
	const getLinkOpacity = useCallback((type: string): number => {
		const importantTypes = [
			'connects_to',
			'uses',
			'depends_on',
			'contains',
			'implements',
		];
		return importantTypes.includes(type.toLowerCase()) ? 0.8 : 0.6;
	}, []);

	const getNodeSize = useCallback((node: Node, links: Link[]): number => {
		const connectionCount = links.filter(
			link =>
				(typeof link.source === 'object' ? link.source.id : link.source) ===
					node.id ||
				(typeof link.target === 'object' ? link.target.id : link.target) ===
					node.id
		).length;

		return Math.max(20, Math.min(40, 15 + connectionCount * 3));
	}, []);

	// Initialize D3 visualization
	useEffect(() => {
		if (!d3 || !data || !svgRef.current) return;

		const svg = d3.select(svgRef.current);
		svg.selectAll('*').remove(); // Clear previous render

		// Stop any existing simulation
		if (simulationRef.current) {
			simulationRef.current.stop();
		}

		// Prepare data
		const nodes: Node[] = data.nodes.map(node => ({
			...node,
			x: width / 2 + (Math.random() - 0.5) * 100,
			y: height / 2 + (Math.random() - 0.5) * 100,
		}));

		// Create a set of valid node IDs for faster lookup
		const nodeIds = new Set(nodes.map(node => node.id));

		// Debug: Log data statistics
		console.log(
			`Processing mind map with ${nodes.length} nodes and ${data.relationships.length} relationships`
		);

		// Filter out relationships that reference non-existent nodes
		const validLinks = data.relationships.filter(rel => {
			const sourceExists = nodeIds.has(rel.source);
			const targetExists = nodeIds.has(rel.target);

			if (!sourceExists || !targetExists) {
				console.warn(
					`Skipping invalid relationship: ${rel.source} -> ${rel.target}`,
					{
						sourceExists,
						targetExists,
						relationship: rel,
					}
				);
				return false;
			}
			return true;
		});

		// Debug: Log filtering results
		const filteredCount = data.relationships.length - validLinks.length;
		if (filteredCount > 0) {
			console.warn(
				`Filtered out ${filteredCount} invalid relationships out of ${data.relationships.length} total`
			);
		}

		const links: Link[] = validLinks.map(rel => ({
			source: rel.source,
			target: rel.target,
			type: rel.type,
			properties: rel.properties,
		}));

		// Early return if no valid data
		if (nodes.length === 0) {
			console.warn('No nodes to render');
			return;
		}

		const simulation = d3
			.forceSimulation<Node>(nodes)
			.force(
				'link',
				d3
					.forceLink<Node, Link>(links)
					.id(d => d.id)
					.distance(100)
					.strength(0.5)
			)
			.force('charge', d3.forceManyBody().strength(-300))
			.force('center', d3.forceCenter(width / 2, height / 2))
			.force(
				'collision',
				d3.forceCollide().radius(d => getNodeSize(d as Node, links) + 5)
			);

		simulationRef.current = simulation;

		const container = svg.append('g').attr('class', 'mind-map-container');

		// Add zoom behavior
		const zoom = d3
			.zoom<SVGSVGElement, unknown>()
			.scaleExtent([0.5, 3])
			.on('zoom', event => {
				container.attr('transform', event.transform);
			});

		svg.call(zoom);

		// Create arrow markers for directed edges with dynamic colors
		const defs = svg.append('defs');

		// Create multiple arrow markers for different colors
		const uniqueLinkTypes = [...new Set(links.map(l => l.type))];
		uniqueLinkTypes.forEach(type => {
			defs
				.append('marker')
				.attr('id', `arrow-${type.replace(/[^a-zA-Z0-9]/g, '')}`)
				.attr('viewBox', '0 -5 10 10')
				.attr('refX', 15)
				.attr('refY', 0)
				.attr('markerWidth', 6)
				.attr('markerHeight', 6)
				.attr('orient', 'auto')
				.append('path')
				.attr('d', 'M0,-5L10,0L0,5')
				.attr('fill', getLinkColor(type));
		});

		// Create links with colored strokes
		const link = container
			.append('g')
			.attr('class', 'links')
			.selectAll('line')
			.data(links)
			.enter()
			.append('line')
			.attr('stroke', d => getLinkColor(d.type))
			.attr('stroke-width', 2)
			.attr(
				'marker-end',
				d => `url(#arrow-${d.type.replace(/[^a-zA-Z0-9]/g, '')})`
			)
			.attr('opacity', d => getLinkOpacity(d.type))
			.style('transition', 'all 0.3s ease');

		// Create link labels with matching colors
		const linkLabels = container
			.append('g')
			.attr('class', 'link-labels')
			.selectAll('text')
			.data(links)
			.enter()
			.append('text')
			.attr('font-size', '10px')
			.attr('fill', d => getLinkColor(d.type))
			.attr('text-anchor', 'middle')
			.attr('dy', '-5px')
			.attr('font-weight', '500')
			.style('text-shadow', '1px 1px 2px rgba(255,255,255,0.8)')
			.text(d => d.type.replace(/_/g, ' ').toUpperCase());

		// Create nodes
		const node = container
			.append('g')
			.attr('class', 'nodes')
			.selectAll('circle')
			.data(nodes)
			.enter()
			.append('circle')
			.attr('r', d => getNodeSize(d, links))
			.attr('fill', d => getNodeColor(d, links))
			.attr('stroke', '#fff')
			.attr('stroke-width', 2)
			.attr('cursor', 'pointer')
			.style('filter', 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))')
			.call(
				d3
					.drag<SVGCircleElement, Node>()
					.on('start', (event, d) => {
						if (!event.active) simulation.alphaTarget(0.3).restart();
						d.fx = d.x;
						d.fy = d.y;
					})
					.on('drag', (event, d) => {
						d.fx = event.x;
						d.fy = event.y;
					})
					.on('end', (event, d) => {
						if (!event.active) simulation.alphaTarget(0);
						d.fx = null;
						d.fy = null;
					})
			);

		// Create node labels
		const labels = container
			.append('g')
			.attr('class', 'labels')
			.selectAll('text')
			.data(nodes)
			.enter()
			.append('text')
			.attr('font-size', '12px')
			.attr('font-weight', '500')
			.attr('fill', '#1f2937')
			.attr('text-anchor', 'middle')
			.attr('dy', '0.35em')
			.attr('pointer-events', 'none')
			.text(d => d.id);

		// Add node type labels
		const typeLabels = container
			.append('g')
			.attr('class', 'type-labels')
			.selectAll('text')
			.data(nodes)
			.enter()
			.append('text')
			.attr('font-size', '8px')
			.attr('fill', '#6b7280')
			.attr('text-anchor', 'middle')
			.attr('dy', '25px')
			.attr('pointer-events', 'none')
			.text(d => d.type);

		// Add node interactions
		node
			.on('mouseover', function (event, d) {
				d3.select(this)
					.transition()
					.duration(200)
					.attr('r', getNodeSize(d, links) * 1.2)
					.style('filter', 'drop-shadow(0px 4px 8px rgba(0,0,0,0.2))');

				// Highlight connected links with enhanced colors
				link
					.transition()
					.duration(200)
					.attr('opacity', l => {
						const isConnected =
							(typeof l.source === 'object' ? l.source.id : l.source) ===
								d.id ||
							(typeof l.target === 'object' ? l.target.id : l.target) === d.id;
						return isConnected ? 1 : 0.15;
					})
					.attr('stroke-width', l => {
						const isConnected =
							(typeof l.source === 'object' ? l.source.id : l.source) ===
								d.id ||
							(typeof l.target === 'object' ? l.target.id : l.target) === d.id;
						return isConnected ? 3 : 2;
					});

				// Highlight connected link labels
				linkLabels
					.transition()
					.duration(200)
					.attr('opacity', l => {
						const isConnected =
							(typeof l.source === 'object' ? l.source.id : l.source) ===
								d.id ||
							(typeof l.target === 'object' ? l.target.id : l.target) === d.id;
						return isConnected ? 1 : 0.2;
					})
					.attr('font-weight', l => {
						const isConnected =
							(typeof l.source === 'object' ? l.source.id : l.source) ===
								d.id ||
							(typeof l.target === 'object' ? l.target.id : l.target) === d.id;
						return isConnected ? '600' : '500';
					});
			})
			.on('mouseout', function (event, d) {
				d3.select(this)
					.transition()
					.duration(200)
					.attr('r', getNodeSize(d, links))
					.style('filter', 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))');

				// Reset link styles
				link
					.transition()
					.duration(200)
					.attr('opacity', l => getLinkOpacity(l.type))
					.attr('stroke-width', 2);

				// Reset link label styles
				linkLabels
					.transition()
					.duration(200)
					.attr('opacity', 1)
					.attr('font-weight', '500');
			})
			.on('click', function (event, d) {
				setSelectedNode(prev => (prev === d.id ? null : d.id));
			});

		// Update positions on simulation tick
		simulation.on('tick', () => {
			link
				.attr('x1', d => (d.source as Node).x!)
				.attr('y1', d => (d.source as Node).y!)
				.attr('x2', d => (d.target as Node).x!)
				.attr('y2', d => (d.target as Node).y!);

			linkLabels
				.attr('x', d => ((d.source as Node).x! + (d.target as Node).x!) / 2)
				.attr('y', d => ((d.source as Node).y! + (d.target as Node).y!) / 2);

			node.attr('cx', d => d.x!).attr('cy', d => d.y!);

			labels.attr('x', d => d.x!).attr('y', d => d.y!);

			typeLabels.attr('x', d => d.x!).attr('y', d => d.y!);
		});

		// Cleanup function
		return () => {
			if (simulationRef.current) {
				simulationRef.current.stop();
			}
		};
	}, [
		d3,
		data,
		width,
		height,
		getNodeColor,
		getNodeSize,
		getLinkColor,
		getLinkOpacity,
	]);

	// Update selected node styling
	useEffect(() => {
		if (!d3 || !svgRef.current) return;

		const svg = d3.select(svgRef.current);
		const nodes = svg.selectAll('.nodes circle');

		nodes.attr('stroke-width', (d: any) => (d.id === selectedNode ? 4 : 2));
	}, [selectedNode, d3]);

	if (!d3) {
		return (
			<div className={`mind-map-wrapper ${className}`}>
				<div
					className="flex items-center justify-center border border-gray-200 rounded-lg bg-white"
					style={{ width, height }}
				>
					<div className="text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
						<p className="text-gray-500 text-sm">Loading mind map...</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={`mind-map-wrapper ${className}`}>
			<svg
				ref={svgRef}
				width={width}
				height={height}
				className="border border-gray-200 rounded-lg bg-white"
				style={{ cursor: 'grab' }}
			/>

			{selectedNode && (
				<div className="mt-4 p-4 bg-gray-50 rounded-lg">
					<h3 className="font-semibold text-gray-900">
						Selected Node: {selectedNode}
					</h3>
					<div className="mt-2 text-sm text-gray-600">
						{(() => {
							const node = data.nodes.find(n => n.id === selectedNode);
							const connections = data.relationships.filter(
								r => r.source === selectedNode || r.target === selectedNode
							);
							return (
								<div>
									<p>
										<strong>Type:</strong> {node?.type}
									</p>
									<p>
										<strong>Connections:</strong> {connections.length}
									</p>
									{connections.length > 0 && (
										<div className="mt-2">
											<strong>Related to:</strong>
											<ul className="list-disc list-inside ml-2">
												{connections.map((conn, i) => (
													<li key={i}>
														{conn.source === selectedNode
															? conn.target
															: conn.source}{' '}
														({conn.type})
													</li>
												))}
											</ul>
										</div>
									)}
								</div>
							);
						})()}
					</div>
				</div>
			)}
		</div>
	);
};

// Use Next.js dynamic import with no SSR
export const MindMap = dynamic(() => Promise.resolve(D3MindMapComponent), {
	ssr: false,
	loading: () => (
		<div className="mind-map-wrapper">
			<div
				className="flex items-center justify-center border border-gray-200 rounded-lg bg-white"
				style={{ width: 800, height: 600 }}
			>
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-2"></div>
					<p className="text-gray-500 text-sm">Loading mind map...</p>
				</div>
			</div>
		</div>
	),
});
