'use client';

import React, { useState } from 'react';
import { CategoryNode } from '@/types/category';

interface Props {
  nodes: CategoryNode[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}

export const CategoryTreeSelect = ({ nodes, value, onChange, disabled }: Props) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderNode = (node: CategoryNode, level = 0) => {
    const indent = '— '.repeat(level);
    const isExpanded = expandedIds.has(node.id);

    return (
      <div key={node.id}>
        <div>
          <button type="button" onClick={() => toggle(node.id)} aria-label="toggle">
            {node.children.length > 0 ? (isExpanded ? '▾' : '▸') : '•'}
          </button>
          <label>
            <input
              type="radio"
              name="category"
              value={node.id}
              checked={value === node.id}
              onChange={() => onChange(node.id)}
              disabled={disabled}
            />
            <span>{indent}{node.title}</span>
          </label>
        </div>

        {isExpanded && node.children.length > 0 && (
          <div>
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {nodes.map(n => renderNode(n, 0))}
    </div>
  );
};

export default CategoryTreeSelect;
