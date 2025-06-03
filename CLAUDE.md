# Claude Code プロジェクト情報

## プロジェクト概要
福島のこころ - 福島県の魅力を発信するキャラクターマッチングアプリのフロントエンド

## 開発環境セットアップ

### 必要な依存関係のインストール
```bash
npm install
```

### 開発サーバーの起動
```bash
npm run dev
```

### コード品質チェック

#### リンティング
```bash
npm run lint          # リンティングチェック
npm run lint:fix      # リンティング自動修正
```

#### フォーマッティング
```bash
npm run format        # フォーマットチェック
npm run format:fix    # フォーマット自動修正
```

#### 統合チェック
```bash
npm run check         # リンティング + フォーマット統合チェック
npm run check:fix     # リンティング + フォーマット自動修正
```

### ビルド
```bash
npm run build         # TypeScript コンパイル + Vite ビルド
npm run preview       # ビルド結果のプレビュー
```

## 技術スタック
- **React** - UIライブラリ
- **TypeScript** - 型安全性
- **Chakra UI** - UIコンポーネントライブラリ
- **Framer Motion** - アニメーション
- **React Router** - ルーティング
- **Jotai** - 状態管理
- **Axios** - HTTP クライアント
- **Vite** - ビルドツール
- **Biome** - リンター・フォーマッター

## プロジェクト構成
```
src/
├── components/
│   ├── atoms/          # 基本コンポーネント
│   ├── molecules/      # 複合コンポーネント
│   ├── organisms/      # レイアウトコンポーネント
│   └── pages/          # ページコンポーネント
├── lib/
│   ├── atom/          # Jotai atoms
│   ├── domain/        # ドメインロジック
│   ├── infrastructure/ # API クライアント
│   ├── provider/      # コンテキストプロバイダー
│   ├── route/         # ルーティング設定
│   └── types/         # TypeScript 型定義
└── assets/            # 静的ファイル
```

## 重要なページ
- `/` - ランディングページ
- `/login` - ログインページ
- `/register` - 新規登録ページ（3ステップウィザード）
- `/home` - ホームページ（認証必須）
- `/tutorial` - チュートリアルページ

## デザインシステム
- **Chakra UI** を使用したレスポンシブデザイン
- **Framer Motion** によるスムーズなアニメーション
- **purple/blue/teal** を基調としたカラーパレット
- モバイルファーストな設計

## 注意事項
- Docker環境との競合を避けるため、`npm run` 系のコマンドは慎重に実行
- TypeScript エラーがないことを確認してからビルド
- Biome による統一されたコードスタイルを維持