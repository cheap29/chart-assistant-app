// src/components/SuggestionCards.tsx
import React from 'react';

export type Suggestion = {
  id: string;
  metrics: string[];
  groupBy: string[];
  title: string;
};

interface SuggestionCardsProps {
  suggestions: Suggestion[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

/**
 * マルチセレクト可能な提案カードコンポーネント
 */
export default function SuggestionCards({ suggestions, selectedIds, onChange }: SuggestionCardsProps) {
  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(i => i !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="row">
      {suggestions.map(s => {
        const isSelected = selectedIds.includes(s.id);
        return (
          <div key={s.id} className="col-md-4 mb-3">
            <div className={`card h-100 ${isSelected ? 'border-primary' : ''}`}>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{s.title}</h5>
                <p className="card-text">指標: {s.metrics.join(', ')}</p>
                <p className="card-text">軸: {s.groupBy.join(', ')}</p>
                <button
                  className={`mt-auto btn ${isSelected ? 'btn-secondary' : 'btn-outline-primary'}`}
                  onClick={() => toggle(s.id)}
                >
                  {isSelected ? '解除選択' : '選択'}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

