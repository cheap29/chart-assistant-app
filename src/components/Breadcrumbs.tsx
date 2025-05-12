// src/components/Breadcrumbs.tsx
import React from 'react';
import { Breadcrumb } from 'react-bootstrap';

type Crumb = {
  label: string;
  step: 'input' | 'suggestions' | 'detail';
};

interface BreadcrumbsProps {
  current: 'input' | 'suggestions' | 'detail';
  onNavigate: (step: 'input' | 'suggestions' | 'detail') => void;
}

const crumbs: Crumb[] = [
  { label: '入力',        step: 'input' },
  { label: '提案リスト',  step: 'suggestions' },
  { label: 'ダッシュボード', step: 'detail' },
];

export default function Breadcrumbs({ current, onNavigate }: BreadcrumbsProps) {
  return (
    <Breadcrumb>
      {crumbs.map((c) => (
        <Breadcrumb.Item
          key={c.step}
          active={c.step === current}
          onClick={() => onNavigate(c.step)}
          linkAs="button"
          linkProps={{ style: { border: 'none', background: 'none', padding: 0 } }}
        >
          {c.label}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
}
