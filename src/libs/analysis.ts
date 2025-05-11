// src/libs/analysis.ts
// AIにチャートデータの分析を依頼し、要約テキストを返すユーティリティ

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

/**
 * チャートデータのポイントをAIに要約分析してもらう
 * @param data チャート表示用のデータ配列
 * @param xKey X軸のキー名
 * @param yKeys Y軸のキー名配列
 * @returns AIによる分析結果のテキスト
 */
export async function fetchChartAnalysis(
  data: Record<string, any>[],
  xKey: string,
  yKeys: string[]
): Promise<string> {
  // 上位5件のデータ例をプロンプトに含める
  const sample = data.slice(0, 5);

  const systemPrompt = `あなたはデータ分析の専門家です。以下のデータ構造とサンプルデータを元に、主要な傾向や気づきを簡潔に日本語で分析してください。`;

  const userPrompt = `
データ構造:
  X軸: ${xKey}
  Y軸: ${yKeys.join(', ')}
例:
${JSON.stringify(sample, null, 2)}
…（省略）
このデータの要点を5〜7文程度で説明してください。
`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4-1106-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 300,
    }),
  });

  const json = await res.json();
  const text = json.choices?.[0]?.message?.content || '';
  return text.trim();
}
