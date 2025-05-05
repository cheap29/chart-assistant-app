# AI Chart Assistant

AI Chart Assistant は、ユーザーの自然言語入力から GPT API を使って仮想 CSV データを生成し、Recharts と Bootstrap を組み合わせたダッシュボード形式で可視化する Web アプリです。

---

## 主な機能

- **自然言語入力** からチャートの指標・比較軸を AI が提案  
- **GPT API** による仮想データの生成（CSV 形式）  
- **Bootstrap** によるレスポンシブなレイアウト  
- **Recharts** を利用した折れ線／棒／散布図／円グラフの切り替え表示  
- **トグルボタン** で指標・比較軸を変更すると、即時チャートを再描画  
- **ダッシュボード** 形式で 5 つのチャート枠を配置（1 つ目は実チャート、残りはダミー）

---

## デモ

TODO:画像を追加する


---

## 要件

- Node.js >= 14  
- npm >= 6  
- Vite  

---

## セットアップ

1. リポジトリをクローン:
   ```bash
   git clone https://github.com/cheap29/chart-assistant-app.git
   cd chart-assistant-app
