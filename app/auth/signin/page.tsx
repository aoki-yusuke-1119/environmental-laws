'use client';

import { useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  // エラーがない場合は自動的にサインインにリダイレクト
  useEffect(() => {
    if (!error) {
      signIn('oauth', {
        callbackUrl: '/',
      });
    }
  }, [error]);

  const handleSignIn = () => {
    signIn('oauth', {
      callbackUrl: '/',
    });
  };

  // エラーがない場合はリダイレクト中の表示
  if (!error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Card>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Cayzenの認証ページにリダイレクトしています...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              自動的にリダイレクトされない場合は、下のボタンをクリックしてください
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={handleSignIn}
              sx={{ mt: 2 }}
            >
              手動でログイン
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // エラーがある場合の表示
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              e-Gov法令改正情報検索
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cayzenのアカウントでログインしてください
            </Typography>
          </Box>

          <Alert severity="error" sx={{ mb: 3 }}>
            {error === 'OAuthSignin' && 'OAuth認証の開始に失敗しました'}
            {error === 'OAuthCallback' && 'OAuth認証の完了に失敗しました'}
            {error === 'OAuthCreateAccount' && 'アカウントの作成に失敗しました'}
            {error === 'EmailCreateAccount' && 'メールアカウントの作成に失敗しました'}
            {error === 'Callback' && 'コールバック処理に失敗しました'}
            {error === 'OAuthAccountNotLinked' && 'このアカウントは別の方法で登録されています'}
            {error === 'EmailSignin' && 'メール送信に失敗しました'}
            {error === 'CredentialsSignin' && '認証に失敗しました'}
            {error === 'SessionRequired' && 'ログインが必要です'}
            {!['OAuthSignin', 'OAuthCallback', 'OAuthCreateAccount', 'EmailCreateAccount', 'Callback', 'OAuthAccountNotLinked', 'EmailSignin', 'CredentialsSignin', 'SessionRequired'].includes(error) && '認証エラーが発生しました'}
          </Alert>

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleSignIn}
            startIcon={<LoginIcon />}
            sx={{ py: 1.5 }}
          >
            Cayzenでログイン
          </Button>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3, textAlign: 'center' }}>
            Cayzenのアカウントをお持ちでない方は、<br />
            管理者にお問い合わせください
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
