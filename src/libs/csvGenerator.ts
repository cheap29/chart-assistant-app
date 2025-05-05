// src/libs/csvGenerator.ts
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

/**
 * GPTに仮想CSVデータを生成させる
 * @param prompt 元の自然文入力
 * @param metrics 選択した指標キーの配列
 * @param groupBy 選択した比較軸キーの配列
 * @param maxRows 生成する行数の上限（無料ユーザーは25行など）
 * @returns CSV文字列 or null
 */
export async function generateCSV(
  prompt: string,
  metrics: string[],
  groupBy: string[],
  maxRows = 25
): Promise<string | null> {
  const systemPrompt = `
あなたはデータアナリストです。以下の条件を厳守し、**純粋なCSVテキスト**（コードブロックや余計な説明文は一切含めない）で出力してください。

【出力要件】
1. ユーザー入力: ${prompt}
2. 指標 (columns): ${metrics.join(',')}
3. 比較軸 (groupBy): ${groupBy.join(',')}
4. データ生成手順:
   a. 指定の比較軸 (${groupBy.join(',')}) ごとにグループ化  
   b. 数値指標は「合計」または「平均」のいずれかで集計  
      - 量的な指標（CountやSumなど）は合計  
      - 平均が意味を持つ指標（MagnitudeやDepthなど）は平均  
   c. グループ化後の行数は最大${maxRows}行  
   d. 行はグループキーの昇順でソート
5. 列ヘッダーは「比較軸のキー名」と「指標のキー名」を**小文字**のスネークケース**で**出力  
   （例: year, count, magnitude）
6. 比較軸が日付や年月である場合は、YYYY-MM-DD または YYYY のフォーマットで  
7. カテゴリ軸（地域や範囲）であれば、そのまま文字列キーとして出力
8. コードブロックや注釈を一切含めないこと
9. 列は必ずcolumnsとgroupByのキーのみで構成すること

【出力例】  
year,count,magnitude  
2013,15,5.2  
2014,20,5.6

# 余分な説明文やマークダウンのコードブロックは一切含めないでください。
# データのキーとなる部分は指標 (columns)と比較軸 (groupBy)にしてください。
...
`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4-1106-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!res.ok) {
    console.error('generateCSV API Error', await res.text());
    return null;
  }

  // レスポンス全体のJSONを取得
  const json = await res.json();
  // content部だけ取り出し
  let csv = json.choices?.[0]?.message?.content.trim() ?? '';
  // 万が一コードブロックが混ざっていたら除去
  if (csv.startsWith('```')) {
    csv = csv
      .replace(/^```(?:csv)?\s*/, '')
      .replace(/```$/, '')
      .trim();
  }

  return csv;
}
