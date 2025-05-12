// src/libs/chartGenerator.ts
// CSV生成からパースまでを一気通貫で行い、チャート表示用のデータ配列を返却するユーティリティ

import { generateCsv } from './csvGenerator';
import Papa from 'papaparse';

/**
 * ユーザー入力・選択指標・比較軸をもとに、
 * 仮想CSVを生成し、JSON配列として返します。
 * @param userInput ユーザーの自然言語リクエスト
 * @param metrics 出力したい指標キーの配列
 * @param groups 比較軸キーの配列
 * @param maxRows CSVの最大行数（オプション、未指定時は generateCsv のデフォルト）
 * @returns パース済みデータのオブジェクト配列
 */
export async function generateChartData(
  userInput: string,
  metrics: string[],
  groups: string[],
  maxRows?: number
): Promise<Record<string, any>[]> {
  // 1. 仮想CSVを生成
  const csvText = await generateCsv(userInput, metrics, groups, maxRows);

  // 2. CSVをパース
  const { data, errors } = Papa.parse<Record<string, any>>(csvText.trim(), {
    header: true,
    dynamicTyping: true,
  });

  if (errors.length) {
    console.warn('CSV parse errors:', errors);
  }
  const invalid = data.some(row =>
    metrics.some(m => !(m in row)) || groups.some(g => !(g in row))
  );
  if (invalid || data.length === 0) {
    // 例外を投げて上流でキャッチ
    throw new Error('可視化に必要なフィールドが含まれていません。');
  }
  // 3. データ配列を返却
  return data;
}
