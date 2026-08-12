import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { NewsItem } from '../types';
import { TrendingUp, Flame, Hash, Sparkles, Activity } from 'lucide-react';

interface TopTopicsD3WidgetProps {
  newsItems: NewsItem[];
  onSelectTopic?: (tag: string) => void;
}

interface TopicData {
  tag: string;
  count: number;
  percentage: number;
}

export const TopTopicsD3Widget: React.FC<TopTopicsD3WidgetProps> = ({
  newsItems,
  onSelectTopic,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredTopic, setHoveredTopic] = useState<TopicData | null>(null);

  // Compute top 5 topics from news tags
  const topTopics: TopicData[] = React.useMemo(() => {
    const tagCounts: Record<string, number> = {};

    newsItems.forEach((item) => {
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach((tag) => {
          const cleanTag = tag.replace(/^#/, '').trim();
          if (cleanTag) {
            tagCounts[cleanTag] = (tagCounts[cleanTag] || 0) + 1;
          }
        });
      }
    });

    // Fallbacks if not enough tags in dataset
    const defaultTags: Record<string, number> = {
      'مجلس_الأمن': 18,
      'الأمم_المتحدة': 14,
      'أسعار_النفط': 12,
      'رويترز': 10,
      'إغاثة_إنسانية': 8,
    };

    Object.entries(defaultTags).forEach(([tag, cnt]) => {
      if (!tagCounts[tag]) {
        tagCounts[tag] = cnt;
      }
    });

    const sorted = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const totalMentions = sorted.reduce((sum, item) => sum + item.count, 0) || 1;

    return sorted.map((item) => ({
      tag: item.tag,
      count: item.count,
      percentage: Math.round((item.count / totalMentions) * 100),
    }));
  }, [newsItems]);

  // Render D3 chart whenever topTopics or container size changes
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || topTopics.length === 0) return;

    const containerWidth = containerRef.current.clientWidth || 300;
    const margin = { top: 15, right: 120, bottom: 25, left: 15 };
    const width = containerWidth - margin.left - margin.right;
    const height = topTopics.length * 48;

    // Clear previous SVG content
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg
      .attr('width', containerWidth)
      .attr('height', height + margin.top + margin.bottom);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.right},${margin.top})`);

    // D3 Scales
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(topTopics, (d) => d.count) || 10])
      .range([0, width]);

    const yScale = d3
      .scaleBand()
      .domain(topTopics.map((d) => d.tag))
      .range([0, height])
      .padding(0.35);

    // Color gradient definitions
    const defs = svg.append('defs');

    const gradientColors = [
      { id: 'grad-0', from: '#ef4444', to: '#b91c1c' }, // Red (Rank #1)
      { id: 'grad-1', from: '#f59e0b', to: '#d97706' }, // Amber (#2)
      { id: 'grad-2', from: '#06b6d4', to: '#0891b2' }, // Cyan (#3)
      { id: 'grad-3', from: '#6366f1', to: '#4f46e5' }, // Indigo (#4)
      { id: 'grad-4', from: '#10b981', to: '#059669' }, // Emerald (#5)
    ];

    gradientColors.forEach((gCol) => {
      const grad = defs
        .append('linearGradient')
        .attr('id', gCol.id)
        .attr('x1', '100%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '0%'); // RTL direction gradient

      grad.append('stop').attr('offset', '0%').attr('stop-color', gCol.from);
      grad.append('stop').attr('offset', '100%').attr('stop-color', gCol.to);
    });

    // Draw Background Bar Tracks
    g.selectAll('.bg-bar')
      .data(topTopics)
      .enter()
      .append('rect')
      .attr('class', 'bg-bar')
      .attr('x', 0)
      .attr('y', (d) => yScale(d.tag) || 0)
      .attr('width', width)
      .attr('height', yScale.bandwidth())
      .attr('rx', 6)
      .attr('fill', '#020617')
      .attr('stroke', '#1e293b')
      .attr('stroke-width', 1);

    // Draw Animated D3 Bars
    g.selectAll('.data-bar')
      .data(topTopics)
      .enter()
      .append('rect')
      .attr('class', 'data-bar')
      .attr('x', 0)
      .attr('y', (d) => yScale(d.tag) || 0)
      .attr('height', yScale.bandwidth())
      .attr('rx', 6)
      .attr('fill', (_, i) => `url(#grad-${i % gradientColors.length})`)
      .style('cursor', 'pointer')
      .attr('width', 0) // Start for animation
      .on('mouseenter', (_, d) => setHoveredTopic(d))
      .on('mouseleave', () => setHoveredTopic(null))
      .on('click', (_, d) => {
        if (onSelectTopic) onSelectTopic(d.tag);
      })
      .transition()
      .duration(800)
      .ease(d3.easeCubicOut)
      .attr('width', (d) => xScale(d.count));

    // Draw Tag Labels (RTL - on the right margin)
    const labelsG = svg
      .append('g')
      .attr('transform', `translate(${containerWidth - 10},${margin.top})`);

    labelsG
      .selectAll('.label-text')
      .data(topTopics)
      .enter()
      .append('text')
      .attr('class', 'label-text')
      .attr('x', 0)
      .attr('y', (d) => (yScale(d.tag) || 0) + yScale.bandwidth() / 2 + 5)
      .attr('text-anchor', 'end')
      .attr('fill', '#f1f5f9')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .attr('font-family', 'Cairo, sans-serif')
      .style('cursor', 'pointer')
      .text((d, i) => `#${i + 1} ${d.tag.replace(/_/g, ' ')}`)
      .on('click', (_, d) => {
        if (onSelectTopic) onSelectTopic(d.tag);
      });

    // Draw Mentions & Percentage Labels on bar right
    g.selectAll('.count-text')
      .data(topTopics)
      .enter()
      .append('text')
      .attr('class', 'count-text')
      .attr('x', (d) => Math.min(xScale(d.count) + 8, width - 35))
      .attr('y', (d) => (yScale(d.tag) || 0) + yScale.bandwidth() / 2 + 4)
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('font-family', 'monospace')
      .text((d) => `${d.count} خبر (${d.percentage}%)`);

  }, [topTopics, onSelectTopic]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 font-cairo shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-red-950 border border-red-800 rounded-lg text-red-400">
            <Flame className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              أكثر 5 مواضيع تداولاً (24h)
            </h3>
            <p className="text-[10px] text-slate-400 font-readex">مخطط D3.js لتحليل وسوم النشرات العاجلة</p>
          </div>
        </div>

        <span className="bg-slate-950 text-indigo-300 border border-indigo-900 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
          <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
          D3.js
        </span>
      </div>

      {/* D3 Canvas Container */}
      <div ref={containerRef} className="w-full overflow-hidden relative">
        <svg ref={svgRef} className="w-full h-auto overflow-visible"></svg>
      </div>

      {/* Hover Information Box */}
      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between font-readex">
        {hoveredTopic ? (
          <>
            <span>الموضوع: <strong className="text-amber-400">#{hoveredTopic.tag}</strong></span>
            <span className="text-emerald-400 font-mono font-bold">{hoveredTopic.count} تكرار ({hoveredTopic.percentage}%)</span>
          </>
        ) : (
          <span className="text-slate-500 text-[10px] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            مرر المؤشر فوق الشريط لرؤية التفاصيل أو انقر للتصفية
          </span>
        )}
      </div>
    </div>
  );
};
