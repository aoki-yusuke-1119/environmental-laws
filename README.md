# e-Gov法令改正情報閲覧アプリ (Next.js版)

e-Gov法令APIを使って、指定期間内の法改正情報を閲覧できるWebアプリケーションです。

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router), React, TypeScript
- **スタイリング**: Tailwind CSS
- **バックエンド**: Next.js API Routes
- **外部API**: e-Gov法令API v2

## 機能

- 📅 期間を指定して更新された法令を検索
- 📋 法令一覧の表示（法令名、改正日、施行日など）
- 🔍 個別法令の詳細情報表示
- 📚 改正履歴の一覧表示
- 📖 各版の法令本文の取得

## セットアップ

### 前提条件

- Node.js 18.x 以上
- npm または yarn

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3002 にアクセスすると、アプリケーションが表示されます。

### 3. ビルド（本番環境）

```bash
npm run build
npm start
```

## 使い方

### 基本的な使い方

1. **期間を指定**
   - 「開始日」と「終了日」を入力します
   - デフォルトは2025年4月1日〜9月30日です

2. **検索**
   - 「🔍 検索」ボタンをクリックして法令を取得します

3. **法令を選択**
   - 左側の一覧から確認したい法令をクリックします

4. **詳細を確認**
   - 右側に法令の基本情報、改正情報、改正履歴が表示されます
   - 各履歴の「📖 この版の法令本文を取得」をクリックすると、その時点の法令本文が新しいウィンドウで表示されます

## プロジェクト構造

```
env-laws/
├── app/                    # Next.js App Router
│   ├── api/               # APIルート
│   │   ├── laws/         # 法令一覧取得API
│   │   ├── revisions/    # 改正履歴取得API
│   │   └── law-data/     # 法令本文取得API
│   ├── globals.css       # グローバルスタイル
│   ├── layout.tsx        # ルートレイアウト
│   └── page.tsx          # トップページ
├── components/            # Reactコンポーネント
├── lib/                   # ユーティリティ
│   └── egov-client.ts    # e-Gov APIクライアント
├── types/                 # TypeScript型定義
│   └── law.ts            # 法令関連の型
├── public/               # 静的ファイル
├── next.config.js        # Next.js設定
├── tailwind.config.js    # Tailwind CSS設定
├── tsconfig.json         # TypeScript設定
└── package.json          # プロジェクト設定
```

## API仕様

このアプリケーションは[e-Gov法令API v2](https://laws.e-gov.go.jp/api/2)を使用しています。

### 内部API エンドポイント

#### GET /api/laws
指定期間内の法令一覧を取得

**パラメータ:**
- `date_from` (必須): 開始日 (YYYY-MM-DD)
- `date_to` (必須): 終了日 (YYYY-MM-DD)

#### GET /api/revisions
法令の改正履歴を取得

**パラメータ:**
- `law_id` (必須): 法令ID

#### GET /api/law-data
法令本文を取得

**パラメータ:**
- `law_revision_id` (必須): 法令履歴ID

## カスタマイズ

### デフォルト期間の変更

`app/page.tsx` の以下の部分を編集してください：

```typescript
const [dateFrom, setDateFrom] = useState('2025-04-01');  // ここを変更
const [dateTo, setDateTo] = useState('2025-09-30');      // ここを変更
```

### スタイルのカスタマイズ

`tailwind.config.js` で色やフォントなどを変更できます。

## トラブルシューティング

### APIエラーが発生する場合

- インターネット接続を確認してください
- e-Gov法令APIのサーバーステータスを確認してください
- ブラウザのコンソールでエラーメッセージを確認してください

### ビルドエラーが発生する場合

```bash
# node_modulesを削除して再インストール
rm -rf node_modules
npm install

# .nextディレクトリを削除して再ビルド
rm -rf .next
npm run build
```

## 開発時のポイント

### 型安全性

TypeScriptによる厳密な型チェックを行っています。型定義は `types/law.ts` にあります。

### サーバーサイドとクライアントサイド

- API Routes (`app/api/**/*`): サーバーサイドで実行
- Page Component (`app/page.tsx`): クライアントサイドで実行 (`'use client'` ディレクティブ)

## ライセンス

このプロジェクトはMITライセンスの元で公開されています。

## 参考リンク

- [e-Gov法令検索](https://laws.e-gov.go.jp/)
- [e-Gov法令API v2 ドキュメント](https://laws.e-gov.go.jp/api/2)
- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/docs)
