// src/libs/openai.ts
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export type ChartOptions = {
  metrics: { key: string; label: string }[];
  groupBy: { key: string; label: string }[];
};

const systemPrompt = `
あなたはデータ可視化アシスタントです。
以下のユーザー入力から、指標と比較軸の候補を**必ずプレーンな JSON のみ**で返してください。
余分な説明文やマークダウンのコードブロックは一切含めないでください。
比較軸に対して、複数の候補を返す場合は、最も一般的なものを先頭に配置してください。

出力形式（例）：
{
  "metrics": [{ "key": "count", "label": "件数" }, …],
  "groupBy": [{ "key": "year", "label": "年ごと" }, …]
}
`;


/**
 * 既存の fetchChartOptions を内部で使いつつ、
 * JSON.parse 前の生レスポンスも一緒に返す
 */
export async function fetchChartOptionsWithRaw(
  userInput: string
): Promise<{ options: ChartOptions; raw: string } | null> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4-1106-preview',
      messages: [
        { role: 'system', content: systemPrompt }, // systemPrompt は既存のもの
        { role: 'user', content: userInput },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!res.ok) {
    console.error('OpenAI error', await res.text());
    return null;
  }

  const json = await res.json();
  const raw = json.choices?.[0]?.message?.content.trim() ?? '';
  let options: ChartOptions;

  try {
    options = JSON.parse(raw);
  } catch (e) {
    console.error('JSON parse failed', raw);
    return null;
  }

  return { options, raw };
}

export async function fetchChartOptions(userInput: string): Promise<ChartOptions | null> {

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4-1106-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userInput }
      ],
      temperature: 0.7,
    }),
  });
  const data = await res.json();
  let text = data.choices?.[0]?.message?.content?.trim() ?? '';

  // ```markdown``` や ```json``` があれば除去
  text = text
    .replace(/^```json\s*/, '')  // 先頭の ```json
    .replace(/^```[\s\S]*?\n/, '') // もし ``` で始まる行があれば取り除き
    .replace(/```$/, '')         // 末尾の ```
    .trim();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error('OpenAI JSON parse error:', text);
    return null;
  }
}
