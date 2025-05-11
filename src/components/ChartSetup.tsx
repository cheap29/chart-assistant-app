// src/components/ChartSetup.tsx
import React, { useState } from 'react';
import { fetchChartOptions, ChartOptions } from '@/libs/openai';
import { generateChartData } from '@/libs/chartGenerator';
import SuggestionCards, { Suggestion } from './SuggestionCards';
import ChartDisplay from '@/components/ChartDisplay';

export default function ChartSetup() {
  const [input, setInput] = useState('');
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [step, setStep] = useState<'input' | 'suggestions' | 'detail'>('input');

  // AIからの提案データ
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  // 選択された提案のID
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // 選択後のチャート結果（複数）
  const [chartResults, setChartResults] = useState<{ suggestion: Suggestion; data: any[] }[]>([]);
  const [loadingChart, setLoadingChart] = useState(false);

  // Step1: 自然文から提案取得
  const handleAsk = async () => {
    if (!input.trim()) return;
    setLoadingOptions(true);
    const res = await fetchChartOptions(input);
    setLoadingOptions(false);
    if (res) {
      // 指標×軸 の組み合わせを提案カードとして生成
      const combos: Suggestion[] = [];
      res.metrics.forEach(m => {
        res.groupBy.forEach(g => {
          combos.push({
            id: `${m.key}-${g.key}`,
            metrics: [m.key],
            groupBy: [g.key],
            title: `${m.label} の ${g.label} 推移`,
          });
        });
      });
      setSuggestions(combos.slice(0, 6));
      setSelectedIds([]);
      setChartResults([]);
      setStep('suggestions');
    }
  };

  // Step2: 選択提案で各チャート生成
  const handleGenerateAll = async () => {
    if (selectedIds.length === 0) return;
    setLoadingChart(true);
    const results: { suggestion: Suggestion; data: any[] }[] = [];
    for (const id of selectedIds) {
      const suggestion = suggestions.find(s => s.id === id);
      if (suggestion) {
        const data = await generateChartData(input, suggestion.metrics, suggestion.groupBy);
        results.push({ suggestion, data });
      }
    }
    setChartResults(results);
    setLoadingChart(false);
    setStep('detail');
  };

  return (
    <div className="container py-4">
      {step === 'input' && (
        <>
          <h1 className="mb-3">AIチャートアシスタント</h1>
          <div className="mb-3">
            <textarea
              className="form-control"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="例：ここ10年の日本の地震状況を見せて"
              rows={3}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={handleAsk}
            disabled={loadingOptions}
          >
            {loadingOptions ? '解析中…' : 'GPTにおまかせ'}
          </button>
        </>
      )}

      {step === 'suggestions' && (
        <>
          <h2 className="mb-3">AIからの提案 (複数選択可)</h2>
          <SuggestionCards
            suggestions={suggestions}
            selectedIds={selectedIds}
            onChange={setSelectedIds}
          />
          <button
            className="btn btn-success mt-3"
            onClick={handleGenerateAll}
            disabled={loadingChart || selectedIds.length === 0}
          >
            {loadingChart ? '生成中…' : 'ダッシュボード生成'}
          </button>
          <button className="btn btn-secondary mt-3 ms-2" onClick={() => setStep('input')}>
            戻る
          </button>
        </>
      )}

      {step === 'detail' && (
        <>
          <h2 className="mb-3">ダッシュボード結果</h2>
          <button className="btn btn-secondary mb-3" onClick={() => setStep('suggestions')}>
            ← 提案に戻る
          </button>
          <div className="row">
            {chartResults.map(({ suggestion, data }) => (
              <div key={suggestion.id} className="col-md-6 mb-4">
                <h5>{suggestion.title}</h5>
                <ChartDisplay
                  data={data}
                  xKey={suggestion.groupBy[0]}
                  yKeys={suggestion.metrics}
                  nameKey={suggestion.groupBy[0]}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
