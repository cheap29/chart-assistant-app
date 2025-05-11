// src/components/ChartDisplay.tsx
import React, { useState } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,CartesianGrid, LabelList
} from 'recharts';
import AnalysisModal from '@/components/AnalysisModal';
import { fetchChartAnalysis } from '@/libs/analysis';

type ChartType = 'line' | 'bar' | 'pie';

interface ChartDisplayProps {
  data: Record<string, any>[];
  xKey: string;
  yKeys: string[];
  nameKey?: string;
}

export default function ChartDisplay({ data, xKey, yKeys, nameKey }: ChartDisplayProps) {
  // 初期状態はすべて bar
  const [types, setTypes] = useState<Record<string, ChartType>>(Object.fromEntries(
    yKeys.map(k => [k, 'bar' as ChartType])
  ));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const allPie = yKeys.every(key => types[key] === 'pie');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisText, setAnalysisText] = useState('');
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const handleAnalysis = async () => {
    setAnalysisLoading(true);
    const text = await fetchChartAnalysis(data, xKey, yKeys);
    setAnalysisText(text);
    setAnalysisLoading(false);
    setShowAnalysis(true);
  };

  
  return (
    <div className="chart-block mb-5">
      {/* チャートタイプ選択 */}
      <div className="mb-4 d-flex flex-wrap gap-3">
        {yKeys.map((key, idx) => (
          <div key={key}>
            <label className="form-label me-2">{key}:</label>
            <select
              className="form-select d-inline-block w-auto"
              value={types[key]}
              onChange={e =>
                setTypes(prev => ({ ...prev, [key]: e.target.value as ChartType }))
              }
            >
              <option value="bar">棒グラフ</option>
              <option value="line">折れ線</option>
              <option value="pie">円グラフ</option>
            </select>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        {!allPie ? (
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            {/* グリッド線を追加 */}
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {yKeys.map((key, idx) =>
              types[key] === 'line' ? (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={key}
                  stroke={COLORS[idx % COLORS.length]}
                  dot={{ r: 4 }}
                >
                  {/* 線上にポイントごとのラベルを表示 */}
                  <LabelList dataKey={key} position="top" style={{ fontSize: 12, fill: '#333' }} />
                </Line>
              ) : (
                <Bar
                  key={key}
                  dataKey={key}
                  name={key}
                  fill={COLORS[idx % COLORS.length]}
                >
                  <LabelList dataKey={key} position="top" style={{ fontSize: 12, fill: '#333' }} />
                </Bar>
              )
            )}
          </ComposedChart>
        ) : (
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
             data={data}
             dataKey={yKeys[0]}
             nameKey={nameKey}
             cx="50%"
             cy="50%"
             outerRadius={100}
             label
           >
             {data.map((_, idx) => (
               <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
             ))}
           </Pie>
         </PieChart>
        )}
        <button
          className="btn btn-outline-info mb-3"
          onClick={handleAnalysis}
          disabled={analysisLoading}
        >
          {analysisLoading ? '分析中…' : 'AIせんせいによる分析'}
        </button>
        <AnalysisModal
          show={showAnalysis}
          onClose={() => setShowAnalysis(false)}
          title={`${xKey}＋${yKeys.join(', ')}`}
          content={analysisText}
        />
      </ResponsiveContainer>
    </div>
  );
}