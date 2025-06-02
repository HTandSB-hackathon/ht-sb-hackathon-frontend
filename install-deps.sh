#!/bin/bash
# 必要な依存関係をインストールするスクリプト

echo "📦 つな農プロジェクトの依存関係をインストールしています..."

# Jotai（状態管理）
npm install jotai

# Framer Motion（アニメーション）
npm install framer-motion

# その他の型定義
npm install --save-dev @types/node

echo "✅ 依存関係のインストールが完了しました！"
