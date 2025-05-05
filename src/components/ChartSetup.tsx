// src/components/ChartSetup.tsx
import  { useState, useEffect } from 'react';
import { fetchChartOptions, ChartOptions } from '../libs/openai';
import { generateCSV } from '../libs/csvGenerator';
import * as Papa from 'papaparse';
import ChartDisplay from './ChartDisplay';

export default function ChartSetup() {
  const [input, setInput] = useState('');
  const [options, setOptions] = useState<ChartOptions | null>(null);
  const [metrics, setMetrics] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'scatter' | 'pie'>('line');


  // GPT問い合わせ→options取得→初期選択
  const handleAsk = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const res = await fetchChartOptions(input);
    setLoading(false);
    if (res) {
      setOptions(res);
      setMetrics([res.metrics[0].key]);
      setGroups([res.groupBy[0].key]);
    }
  };

  // options/metrics/groupsが変わるたび自動でCSV生成＆パース
  useEffect(() => {
    const run = async () => {
      if (!options || !metrics.length || !groups.length) return;
      setLoading(true);
      const csv = await generateCSV(input, metrics, groups, 25);
      setLoading(false);
      if (!csv) return;
      const { data } = Papa.parse(csv, { header: true });
      setParsedData(data as any[]);
    };
    run();
  }, [options, metrics, groups]);

  const toggleMetric = (key: string) =>
    setMetrics(prev => (prev.includes(key) ? [] : [key]));
  const toggleGroup = (key: string) =>
    setGroups(prev => (prev.includes(key) ? [] : [key]));

  return (
    <div className="container align-items-start justify-content-start">
    <p>AIチャートアシスタントにいろんな質問をしてみましょう。<br/>いつ、どこ、何の状況を知りたいですか？</p>

      <textarea
        className="form-control mb-2"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="例：ここ10年の日本の地震状況を見せて"
        rows={3}
      />

      <button
        className="btn btn-primary mb-4"
        onClick={handleAsk}
        disabled={loading || !input.trim()}
      >
        {loading ? '読み込み中…' : 'GPTに問い合わせる'}
      </button>

      {options && (
        <>
        <div className="d-flex gap-2">
          <div className="mb-3">
            <h5>指標を選択</h5>
            <div className="d-flex flex-wrap">
              {options.metrics.map(opt => (
                <button
                  key={opt.key}
                  className={`btn btn-sm me-2 mb-2 ${
                    metrics.includes(opt.key)
                      ? 'btn-primary'
                      : 'btn-outline-secondary'
                  }`}
                  onClick={() => toggleMetric(opt.key)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h5>比較軸を選択</h5>
            <div className="d-flex flex-wrap">
              {options.groupBy.map(opt => (
                <button
                  key={opt.key}
                  className={`btn btn-sm me-2 mb-2 ${
                    groups.includes(opt.key)
                      ? 'btn-primary'
                      : 'btn-outline-secondary'
                  }`}
                  onClick={() => toggleGroup(opt.key)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        </>
      )}

     {/* ダッシュボードプレビュー */}
     {parsedData.length > 0 && (
       <div className="mb-3">
         <h5>チャートタイプを選択</h5>
         <select
           className="form-select w-auto"
           value={chartType}
           onChange={(e) => setChartType(e.target.value as any)}
         >
           <option value="line">折れ線グラフ</option>
           <option value="bar">棒グラフ</option>
           <option value="scatter">散布図</option>
           <option value="pie">円グラフ</option>
         </select>
       </div>
     )}

      {!!parsedData.length && (
        <>
          <h5 className="mb-3">ダッシュボードプレビュー</h5>
          <div className="row">
            {/* 1つ目：実際のチャート */}
            <div className="col-md-6 mb-4">
              <ChartDisplay
               data={parsedData}
               metrics={metrics}
               groupBy={groups}
               type={chartType}
             />
            </div>
            {/* 残り4つはダミー枠 */}
            {[2, 3, 4, 5].map(i => (
              <div key={i} className="col-md-6 mb-4">
                <div
                  className="border rounded d-flex align-items-center justify-content-center text-muted"
                  style={{ height: 300 }}
                >
                  ダミーチャート{i}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
