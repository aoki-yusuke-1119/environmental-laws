# Vercel デプロイ手順

## 前提条件
- GitHubアカウント
- Vercelアカウント（無料）

## 手順

### 1. GitHubリポジトリの作成

```bash
# プロジェクトディレクトリで実行
cd /Users/eitoss/Documents/src/env-laws

# Gitの初期化（まだの場合）
git init

# .gitignoreの確認（.env.localが含まれていることを確認）
echo ".env.local" >> .gitignore
echo "node_modules" >> .gitignore

# コミット
git add .
git commit -m "Initial commit"

# GitHubでリポジトリを作成後、以下を実行
# （GitHubのリポジトリURLに置き換えてください）
git remote add origin https://github.com/YOUR_USERNAME/env-laws.git
git branch -M main
git push -u origin main
```

### 2. Vercelでのデプロイ

1. https://vercel.com にアクセス
2. GitHubアカウントでログイン
3. "Add New Project" をクリック
4. GitHubリポジトリ（env-laws）を選択
5. "Import" をクリック

### 3. 環境変数の設定

Vercelのプロジェクト設定画面で：

1. "Settings" タブをクリック
2. "Environment Variables" をクリック
3. 以下の環境変数を追加：

#### 必須
- `NEXT_PUBLIC_MUI_LICENSE_KEY`: MUI Proライセンスキー

#### IP制限（推奨）
- `ALLOWED_IPS`: 許可するIPアドレス（カンマ区切り）
  - 例: `123.456.789.0,98.765.432.1`
  - 複数のメンバーのIPを登録可能

#### Basic認証（オプション、IP制限と併用推奨）
- `BASIC_AUTH_USER`: ユーザー名（例: admin）
- `BASIC_AUTH_PASSWORD`: パスワード（強力なものを設定）

### 4. デプロイ

環境変数を設定後：
1. "Deployments" タブに戻る
2. "Redeploy" をクリック（環境変数を反映）

### 5. アクセス確認

デプロイ完了後、Vercelが提供するURL（例: `https://env-laws.vercel.app`）にアクセス：
- IP制限を設定した場合、許可IPからのみアクセス可能
- Basic認証を設定した場合、ユーザー名/パスワードが求められる

## メンバーのIP追加方法

新しいメンバーのIPを追加する場合：

1. メンバーに自分のIPアドレスを確認してもらう
   - https://ifconfig.me/ にアクセスすると表示される
2. Vercelの管理画面で "Settings" → "Environment Variables"
3. `ALLOWED_IPS` の値を編集（既存のIPの後ろに `,新しいIP` を追加）
   - 例: `123.456.789.0,98.765.432.1` → `123.456.789.0,98.765.432.1,111.222.333.4`
4. 変更を保存
5. "Deployments" タブから "Redeploy" を実行

## 自動デプロイ

GitHubにpushすると自動的にVercelがデプロイします：

```bash
git add .
git commit -m "Update features"
git push
```

数分後、変更が本番環境に反映されます。

## トラブルシューティング

### アクセスできない場合
1. 自分のIPアドレスを確認: https://ifconfig.me/
2. Vercelの環境変数 `ALLOWED_IPS` に自分のIPが含まれているか確認
3. Redeployを実行

### Basic認証が表示されない
- ブラウザのキャッシュをクリア
- シークレットモード/プライベートブラウジングで試す

### デプロイエラー
- Vercelのログを確認: "Deployments" → 失敗したデプロイをクリック → "Logs"
- ビルドエラーの場合、ローカルで `yarn build` を実行して確認
