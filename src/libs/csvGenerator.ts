// src/libs/csvGenerator.ts
// GPT API を使って純粋なCSVデータのみを生成するユーティリティ

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

/**
 * ユーザーの要求に応じて純粋なCSV形式の文字列を生成します。
 * - 説明文やコードブロック、余計な文章を一切含めず、CSVヘッダーとデータ行のみを返すこと。
 * @param userInput ユーザーの自然文入力
 * @param metrics 出力したい指標キーの配列 (例: ['count','avg_mag'])
 * @param groups 比較軸キーの配列 (例: ['year','prefecture'])
 * @param maxRows 最大行数 (無料ユーザー用に制限: デフォルト10)
 * @returns CSVデータの文字列
 */
export async function generateCsv(
  userInput: string,
  metrics: string[],
  groups: string[],
  maxRows = 10
): Promise<string> {
  // 日本語のプロンプトを明確に指定し、純粋なCSVのみを返すように誘導
  const systemPrompt = `あなたはデータアナリストです。以下の条件を必ず守り、余計な説明文やコードブロックを一切含めず、CSVヘッダーとデータ行のみを出力してください。
- カラム: ${[...groups, ...metrics].join(', ')}
- 最大行数: ${maxRows}行
- 出力形式: カンマ区切り、ヘッダー付き、純粋なCSVのみ
`;

  const userPrompt = `ユーザーのリクエスト: 「${userInput}」
metrics: ${metrics.join(', ')}
groups: ${groups.join(', ')}
maxRows: ${maxRows}
CSVのみを返してください。説明や装飾は不要です。
データは大きい順に並べてください。
年や月が横軸の場合は古い順から並べてください。
期間の指定がない場合は過去3年で調査してください。
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
      temperature: 0.5,
      max_tokens: 1500,
    }),
  });

  const json = await res.json();
  const csvText = json.choices?.[0]?.message?.content || '';
  // 前後の空白やバッククォートを除去
  return csvText.replace(/```/g, '').trim();
}
