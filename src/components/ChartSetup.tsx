// src/components/ChartSetup.tsx
import React, { useState } from 'react';
import { fetchChartOptions } from '@/libs/openai';
import { generateChartData } from '@/libs/chartGenerator';
import SuggestionCards, { Suggestion } from './SuggestionCards';
import ChartDisplay from '@/components/ChartDisplay';
import Breadcrumbs from './Breadcrumbs';



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
  const [error, setError] = useState<string | null>(null);



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
    setError(null);
    if (selectedIds.length === 0) return;
    setLoadingChart(true);

    try{
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
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'データの可視化に失敗しました。');
    } finally {
      setLoadingChart(false);
    }

  };

  return (
    <div className="container py-4">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <Breadcrumbs current={step} onNavigate={setStep} />
      {step === 'input' && (
        <>
          <div className="text-center mb-5">
            <h1 className="display-5">AIチャートアシスタント</h1>
            <p className="text-muted">
              自然言語で「何を」「どう見たいか」を入力するだけで、AIが最適なチャートを提案します。
            </p>
          </div>

          <div className="card mx-auto" style={{ maxWidth: 700 }}>
            <div className="card-body">
              <form>
                {/* ラベル＋テキストエリア */}
                <div className="mb-3">
                  <label htmlFor="userInput" className="form-label">
                    可視化したい内容
                  </label>
                  <textarea
                    className="form-control"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="期間・地域・指標など知りたい情報を自然言語で入力してください。"
                    rows={3}
                  />
                </div>

                {/* 3. よくある例のチップ */}
                <div className="mb-4">
                  <span className="me-2 text-muted">例：</span><br/>
                  {[
                    '今年の吉祥寺のレストラン情報を知りたい',
                    'ここ３年の東京の結婚年齢の状況を教えて',
                    '日本のポップス曲の売上ランキングをしりたい',
                  ].map((ex) => (
                    <label key={ex} className="me-2 mb-2 " style={{ backgroundColor: '#f8f9fa', padding: '5px 10px', borderRadius: '4px' }}>
                      {ex}
                    </label>
                  ))}
                </div>

                {/* 4. アクションボタン */}
                <div className="d-grid">
                  <button
                    className="btn btn-primary"
                    onClick={handleAsk}
                    disabled={loadingOptions}
                  >
                    {loadingOptions ? '解析中…' : 'GPTにおまかせ'}
                  </button>
                </div>
              </form>
            </div>
          </div>
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
