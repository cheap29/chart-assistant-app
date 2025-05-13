# AI Chart Assistant

AI Chart Assistant は、ユーザーの自然言語入力から OpenAI GPT-4 を使って仮想 CSV データを生成し、Bootstrap と Recharts を組み合わせた直感的なダッシュボード形式で可視化する Web アプリです。

## 🚀 主な機能

### 自然言語入力 + AI アシスト
- ユーザーのクエリ（例：「ここ3年の府中のレストラン情報を知りたい」）を AI が解析
- メトリクス（指標）× グループ軸（比較軸）のおすすめ組み合わせカードを複数提案

### マルチセレクト ダッシュボード
- 提案カードを複数選択し、**「ダッシュボード生成」**で一括表示
- 1画面に複数チャートを並べて俯瞰可能

### 動的チャート表示
- 折れ線＋棒グラフの混在描画（ComposedChart）
- 円グラフモード（PieChart）
- データラベル（LabelList）／グリッド線（CartesianGrid）で数値を一目把握

### インタラクティブ操作
- チャートごとの表示タイプ切り替え（折れ線・棒・円）
- AI先生による分析ボタンで、モーダルに要点解説を表示

### レスポンシブ & 高速開発
- Bootstrap のグリッドでスマホ⇔PC 両対応
- Vite + React + TypeScript でホットリロード開発

### キャプチャ


![image](https://github.com/user-attachments/assets/0efbbfdd-9133-48e9-a057-1b38c509b3f3)


![image](https://github.com/user-attachments/assets/8b6464e6-810a-48af-b5f7-8b439898b330)

![image](https://github.com/user-attachments/assets/b0eaa37b-cbb8-4408-aa93-de50d2c3dcab)


## 🛠️ 技術スタック

| カテゴリ | 技術スタック |
|---------|------------|
| フロントエンド | React + TypeScript + Vite |
| UI レイアウト | Bootstrap 5 |
| グラフ描画 | Recharts |
| AI 連携 | OpenAI GPT-4 (gpt-4-1106-preview) |
| データ処理 | PapaParse |

## ⚙️ セットアップ方法

```bash
# リポジトリをクローン
git clone <repo-url>
cd chart-assistant-app

# 依存パッケージをインストール
npm install

# 環境変数に OpenAI API キーを設定（.env ファイル）
# VITE_OPENAI_API_KEY=sk-...キーをここに

# 開発サーバー起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスすると起動します。

## 📂 ディレクトリ構成（抜粋）

```
src/
├── components/
│   ├── ChartSetup.tsx      # 入力 → AI提案 → ダッシュボード生成
│   ├── SuggestionCards.tsx  # AI 提案カード UI
│   ├── ChartDisplay.tsx     # ダッシュボード＆チャート描画
│   ├── AnalysisModal.tsx    # AI 分析モーダル
│   └── ToggleTags.tsx       # （旧）タグ型選択 UI
├── libs/
│   ├── openai.ts           # GPT 通信ラッパー
│   ├── chartGenerator.ts    # CSV 生成 → パース
│   └── analysis.ts          # AI 分析ラッパー
├── pages/                   # Vite pages 構成（index.tsx）
└── main.tsx                # エントリポイント
```

## 🎯 今後の展望

- チャートサムネイルプレビュー機能
- ドリルダウン・フィルタリングによる詳細分析

## 📄 ライセンス

MIT
