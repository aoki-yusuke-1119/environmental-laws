'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Alert,
} from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom color="error">
              認証エラー
            </Typography>
          </Box>

          <Alert severity="error" sx={{ mb: 3 }}>
            {error === 'Configuration' && 'サーバーの設定に問題があります。管理者に連絡してください。'}
            {error === 'AccessDenied' && 'アクセスが拒否されました。'}
            {error === 'Verification' && '認証トークンの検証に失敗しました。'}
            {!error && '認証中に予期しないエラーが発生しました。'}
          </Alert>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              component={Link}
              href="/auth/signin"
              variant="contained"
              startIcon={<HomeIcon />}
            >
              ログイン画面に戻る
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
