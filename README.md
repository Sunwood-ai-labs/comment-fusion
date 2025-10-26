<div align="center">
  <img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
  <h1>Comment Fusion (投コメがったい)</h1>
  <p>
    <a href="https://react.dev/">
      <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&amp;logo=react&amp;logoColor=61DAFB" alt="React" />
    </a>
    <a href="https://vitejs.dev/">
      <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&amp;logo=vite&amp;logoColor=white" alt="Vite" />
    </a>
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&amp;logo=typescript&amp;logoColor=white" alt="TypeScript" />
    </a>
    <a href="https://tailwindcss.com/">
      <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&amp;logo=tailwind-css&amp;logoColor=white" alt="Tailwind CSS" />
    </a>
  </p>
</div>

Comment Fusion は、複数のコメント JSON を時間順にマージし、整形された 1 つのファイルにまとめてくれる React + Vite 製のシンプルなウェブアプリです。大量の投コメを扱う配信者さんや編集担当さんが、手作業では大変なコメント統合作業を効率良く進められるようにすることを目指しています。

View your app in AI Studio: https://ai.studio/apps/drive/13kwLL3i2ycH_zMTO7POOiqMwEzvMfxG6

## 主な機能

- 最大 6 つの JSON ファイルを入力し、`time`・`command`・`comment` をバリデーションした上で結合
- 文字列として保存されている `time` を比較し、昇順で自動ソート
- 元ファイルのコメント件数やマージ後の件数を集計してダッシュボード表示
- ワンクリックで整形済み JSON をクリップボードへコピー
- Tailwind CSS を利用したシンプルで読みやすい UI

## 使い方 (ローカル環境)

### 必要要件

- [Node.js](https://nodejs.org/) 18 以上

### セットアップ

1. 依存関係をインストール

   ```bash
   npm install
   ```

2. (任意) Gemini API を利用する場合は、リポジトリルートに `.env.local` を作成し、以下の環境変数を設定します。

   ```bash
   GEMINI_API_KEY="your-api-key"
   ```

3. 開発サーバーを起動

   ```bash
   npm run dev
   ```

   ブラウザで `http://localhost:3000` を開くとアプリを利用できます。

## ビルド

静的ファイルを生成するには以下を実行します。

```bash
npm run build
```

`dist/` ディレクトリにビルド成果物が出力されます。

## GitHub Pages へのデプロイ

このリポジトリには GitHub Pages へ自動デプロイするワークフロー (`.github/workflows/static-site.yml`) が含まれています。`main` ブランチに push すると以下が自動的に実行されます。

1. Node.js をセットアップし、依存関係をインストール
2. Vite ビルドを実行 (`VITE_BASE_PATH` 環境変数を `/<リポジトリ名>/` に設定)
3. 生成された `dist/` を GitHub Pages に公開

独自にビルドする場合は、環境変数 `VITE_BASE_PATH` をデプロイ先のベースパスに合わせて指定してください。GitHub Pages (ユーザー/組織ページ以外) では通常 `/<repository-name>/` となります。

## プロジェクト構成

```
.
├── App.tsx              # UI とコメント統合ロジック
├── index.html           # Vite エントリーポイント
├── index.tsx            # React ルートレンダリング
├── types.ts             # コメントデータ型定義
├── vite.config.ts       # Vite 設定 (環境変数やエイリアス)
└── .github/workflows/   # CI/CD ワークフロー
```

## ライセンス

このプロジェクトのライセンス情報は付属していません。必要に応じて追加してください。
