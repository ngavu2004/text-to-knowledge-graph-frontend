/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
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

export const MindMap: React.FC<MindMapProps> = ({
	data,
	width = 800,
	height = 600,
	className = '',
}) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const [selectedNode, setSelectedNode] = useState<string | null>(null);

	// Color scheme for different node types
	const getNodeColor = (type: string): string => {
		const colorMap: Record<string, string> = {
			Protocol: '#6366f1', // indigo
			Channel: '#8b5cf6', // violet
			Port: '#06b6d4', // cyan
			Service: '#10b981', // emerald
			Process: '#f59e0b', // amber
			File: '#ef4444', // red
			Database: '#8b5cf6', // violet
			Network: '#06b6d4', // cyan
			Security: '#dc2626', // red
			default: '#6b7280', // gray
		};
		return colorMap[type] || colorMap.default;
	};

	const getNodeSize = (node: Node, links: Link[]): number => {
		const connectionCount = links.filter(
			link =>
				(typeof link.source === 'object' ? link.source.id : link.source) ===
					node.id ||
				(typeof link.target === 'object' ? link.target.id : link.target) ===
					node.id
		).length;

		return Math.max(20, Math.min(40, 15 + connectionCount * 3));
	};

	useEffect(() => {
		if (!data || !svgRef.current) return;

		const svg = d3.select(svgRef.current);
		svg.selectAll('*').remove(); // Clear previous render

		// Prepare data
		const nodes: Node[] = data.nodes.map(node => ({
			...node,
			x: width / 2 + (Math.random() - 0.5) * 100,
			y: height / 2 + (Math.random() - 0.5) * 100,
		}));

		const links: Link[] = data.relationships.map(rel => ({
			source: rel.source,
			target: rel.target,
			type: rel.type,
			properties: rel.properties,
		}));

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

		const container = svg.append('g').attr('class', 'mind-map-container');
		const zoom = d3
			.zoom<SVGSVGElement, unknown>()
			.scaleExtent([0.5, 3])
			.on('zoom', event => {
				container.attr('transform', event.transform);
			});

		svg.call(zoom);

		// Create arrow markers for directed edges
		svg
			.append('defs')
			.selectAll('marker')
			.data(['end'])
			.enter()
			.append('marker')
			.attr('id', 'arrow')
			.attr('viewBox', '0 -5 10 10')
			.attr('refX', 15)
			.attr('refY', 0)
			.attr('markerWidth', 6)
			.attr('markerHeight', 6)
			.attr('orient', 'auto')
			.append('path')
			.attr('d', 'M0,-5L10,0L0,5')
			.attr('fill', '#666');

		const link = container
			.append('g')
			.attr('class', 'links')
			.selectAll('line')
			.data(links)
			.enter()
			.append('line')
			.attr('stroke', '#666')
			.attr('stroke-width', 2)
			.attr('marker-end', 'url(#arrow)')
			.attr('opacity', 0.6);

		const linkLabels = container
			.append('g')
			.attr('class', 'link-labels')
			.selectAll('text')
			.data(links)
			.enter()
			.append('text')
			.attr('font-size', '10px')
			.attr('fill', '#666')
			.attr('text-anchor', 'middle')
			.attr('dy', '-5px')
			.text(d => d.type);

		const node = container
			.append('g')
			.attr('class', 'nodes')
			.selectAll('circle')
			.data(nodes)
			.enter()
			.append('circle')
			.attr('r', d => getNodeSize(d, links))
			.attr('fill', d => getNodeColor(d.type))
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

		node
			.on('mouseover', function (event, d) {
				d3.select(this)
					.transition()
					.duration(200)
					.attr('r', getNodeSize(d, links) * 1.2)
					.style('filter', 'drop-shadow(0px 4px 8px rgba(0,0,0,0.2))');

				link.attr('opacity', l =>
					(typeof l.source === 'object' ? l.source.id : l.source) === d.id ||
					(typeof l.target === 'object' ? l.target.id : l.target) === d.id
						? 1
						: 0.1
				);
			})
			.on('mouseout', function (event, d) {
				d3.select(this)
					.transition()
					.duration(200)
					.attr('r', getNodeSize(d, links))
					.style('filter', 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))');

				link.attr('opacity', 0.6);
			})
			.on('click', function (event, d) {
				setSelectedNode(selectedNode === d.id ? null : d.id);

				node.attr('stroke-width', n => (n.id === d.id ? 4 : 2));
			});

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

		// Cleanup
		return () => {
			simulation.stop();
		};
	}, [data, width, height, selectedNode]);

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
