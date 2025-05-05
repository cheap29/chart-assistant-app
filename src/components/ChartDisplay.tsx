
// src/components/ChartDisplay.tsx
import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

type ChartDisplayProps = {
  data: Record<string, any>[];
  metrics: string[];
  groupBy: string[];
  type: 'line' | 'bar' | 'scatter' | 'pie';
};

export default function ChartDisplay({
  data,
  metrics,
  groupBy,
  type,
}: ChartDisplayProps) {
  if (!data.length || !metrics.length || !groupBy.length) return null;

  // 全て小文字化した metrics と groupBy
  const lcMetrics = metrics.map(k => k.toLowerCase());
  const lcGroupBy = groupBy.map(k => k.toLowerCase());

  // データ整形: キーを小文字に変換し、数値化 & 日付→year 変換
  const normalizedData = data.map(row => {
    const lower: Record<string, any> = {};
    Object.entries(row).forEach(([origKey, value]) => {
      const key = origKey.toLowerCase();
      // 数値っぽい場合は Number 変換、そうでない場合はそのまま
      lower[key] = !isNaN(Number(value)) ? Number(value) : value;
    });
    // 日付キーがある場合に year を追加
    if (lower.date && !lower.year) {
      lower.year = new Date(lower.date).getFullYear();
    }
    return lower;
  });

  // X 軸キーの自動判定 (groupBy -> year -> date の順)
  const xCandidates = [...lcGroupBy, 'year', 'date'];
  const xKey = xCandidates.find(k => normalizedData[0][k] !== undefined) as string;

  // チャート用データ: X 軸と metrics の数値のみ
  const chartData = normalizedData.map(row => {
    const obj: any = { [xKey]: row[xKey] };
    lcMetrics.forEach(key => {
      obj[key] = row[key] !== undefined ? Number(row[key]) : 0;
    });
    return obj;
  });

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a4de6c'];

  // 子要素を一つにまとめて変数に格納
  let ChartElement: React.ReactElement;
  switch (type) {
    case 'bar':
      ChartElement = (
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {lcMetrics.map((key, i) => (
            <Bar key={key} dataKey={key} fill={COLORS[i % COLORS.length]} />
          ))}
        </BarChart>
      );
      break;
    case 'scatter':
      ChartElement = (
        <ScatterChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {lcMetrics.map((key, i) => (
            <Scatter
              key={key}
              name={key}
              data={chartData}
              dataKey={key}
              fill={COLORS[i % COLORS.length]}
            />
          ))}
        </ScatterChart>
      );
      break;
    case 'pie':
      ChartElement = (
        <PieChart data={chartData}>
          <Tooltip />
          <Legend />
          <Pie
            data={chartData}
            dataKey={lcMetrics[0]}
            nameKey={xKey}
            outerRadius={100}
            label
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      );
      break;
    default:
      ChartElement = (
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          {lcMetrics.map((key, i) => (
            <Line
              key={key}
              dataKey={key}
              stroke={COLORS[i % COLORS.length]}
              dot={false}
            />
          ))}
        </LineChart>
      );
  }

  // ResponsiveContainer の子要素は単一 ReactElement
  return (
    <ResponsiveContainer width="100%" height={300}>
      {ChartElement}
    </ResponsiveContainer>
  );
}

