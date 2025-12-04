'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { cayzenLogout } from '@cayzen/nextauth';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  LinearProgress,
  TextField,
  Typography,
  Alert,
  AppBar,
  Toolbar,
  Stack,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Search as SearchIcon,
  Article as ArticleIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { DataGridPro, GridColDef, GridRowSelectionModel, LicenseInfo } from '@mui/x-data-grid-pro';
import { AmendmentSummary, LawRevision, LAW_CATEGORIES } from '@/types/law';
import { EGovAPIClient } from '@/lib/egov-client';
import LawDetailDialog from '@/components/LawDetailDialog';

// MUI X ライセンスキーの設定
if (process.env.NEXT_PUBLIC_MUI_LICENSE_KEY) {
  LicenseInfo.setLicenseKey(process.env.NEXT_PUBLIC_MUI_LICENSE_KEY);
}

export default function Home() {
  const { data: session } = useSession();
  const [dateFrom, setDateFrom] = useState('2025-04-01');
  const [dateTo, setDateTo] = useState('2025-09-30');
  const [lawNameFilter, setLawNameFilter] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [allAmendments, setAllAmendments] = useState<AmendmentSummary[]>([]);
  const [selectedLaw, setSelectedLaw] = useState<AmendmentSummary | null>(null);
  const [revisions, setRevisions] = useState<LawRevision[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // 全件表示（フィルタリングはAPI側で実施）
  const amendments = allAmendments;

  const handleCategoryToggle = (categoryCode: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryCode)
        ? prev.filter((c) => c !== categoryCode)
        : [...prev, categoryCode]
    );
  };

  const handleSearch = async () => {
    setLoading(true);
    setLoadingMessage('APIリクエストを送信中...');
    setError(null);

    const startTime = Date.now();
    console.log(`[${new Date().toISOString()}] 検索開始: ${dateFrom} ~ ${dateTo}`);
    if (selectedCategories.length > 0) {
      console.log(`[${new Date().toISOString()}] カテゴリ絞り込み: ${selectedCategories.join(', ')}`);
    }
    if (lawNameFilter.trim()) {
      console.log(`[${new Date().toISOString()}] 法令名絞り込み: ${lawNameFilter.trim()}`);
    }

    try {
      setLoadingMessage('e-Gov APIから法令データを取得中...');
      const categoryParam = selectedCategories.length > 0
        ? `&categories=${selectedCategories.join(',')}`
        : '';
      const lawTitleParam = lawNameFilter.trim()
        ? `&law_title=${encodeURIComponent(lawNameFilter.trim())}`
        : '';
      const response = await fetch(
        `/api/laws?date_from=${dateFrom}&date_to=${dateTo}${categoryParam}${lawTitleParam}`
      );

      const fetchTime = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] APIレスポンス受信: ${fetchTime}ms`);

      if (!response.ok) {
        throw new Error('法令データの取得に失敗しました');
      }

      setLoadingMessage('データを処理中...');
      const data = await response.json();

      const totalTime = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] 処理完了: ${data.amendments.length}件, ${totalTime}ms`);

      setAllAmendments(data.amendments);
      setSelectedLaw(null);
      setRevisions([]);
    } catch (err) {
      console.error('[検索エラー]', err);
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handleSelectLaw = (amendment: AmendmentSummary) => {
    setSelectedLaw(amendment);
    setRevisions([]); // 改正履歴をクリア
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleFetchRevisions = async () => {
    if (!selectedLaw) return;

    setLoading(true);
    setError(null);

    const startTime = Date.now();
    console.log(`[${new Date().toISOString()}] 改正履歴取得開始: ${selectedLaw.law_id}`);

    try {
      const response = await fetch(`/api/revisions?law_id=${selectedLaw.law_id}`);

      const fetchTime = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] 改正履歴レスポンス受信: ${fetchTime}ms`);

      if (!response.ok) {
        throw new Error('改正履歴の取得に失敗しました');
      }

      const data = await response.json();
      const totalTime = Date.now() - startTime;
      console.log(`[${new Date().toISOString()}] 改正履歴取得完了: ${data.revisions?.length || 0}件, ${totalTime}ms`);

      setRevisions(data.revisions || []);
    } catch (err) {
      console.error('[改正履歴取得エラー]', err);
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      setRevisions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewLawData = async (lawRevisionId: string) => {
    try {
      const response = await fetch(
        `/api/law-data?law_revision_id=${lawRevisionId}`
      );

      if (!response.ok) {
        throw new Error('法令本文の取得に失敗しました');
      }

      const data = await response.json();

      // 新しいウィンドウでJSON表示
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(
          `<pre>${JSON.stringify(data, null, 2)}</pre>`
        );
        newWindow.document.title = '法令本文';
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '不明なエラーが発生しました');
    }
  };

  const handleLogout = () => {
    cayzenLogout({
      oauthIssuer: process.env.NEXT_PUBLIC_OAUTH_ISSUER!,
    });
  };

  // DataGrid用のカラム定義
  const columns: GridColDef[] = [
    {
      field: 'law_title',
      headerName: '法令名',
      flex: 2,
      minWidth: 300,
    },
    {
      field: 'amendment_promulgate_date',
      headerName: '改正公布日',
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => params.value || 'N/A',
    },
    {
      field: 'amendment_enforcement_date',
      headerName: '改正施行日',
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => params.value || 'N/A',
    },
    {
      field: 'category',
      headerName: '分類',
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => params.value || 'N/A',
    },
  ];

  // DataGrid用にidを付与
  const rows = amendments.map((amendment, index) => ({
    id: index,
    ...amendment,
  }));

  const handleRowSelectionModelChange = (selectionModel: GridRowSelectionModel) => {
    if (selectionModel.length > 0) {
      const selectedIndex = selectionModel[0] as number;
      handleSelectLaw(amendments[selectedIndex]);
    }
  };

  return (
    <Stack direction="column" sx={{ flexGrow: 1, bgcolor: 'grey.50', minHeight: '100vh' }}>
      {/* ヘッダー */}
      <AppBar position="sticky" sx={{ top: 0, left: 0, right: 0 }}>
        <Toolbar>
          <ArticleIcon sx={{ mr: 2 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
              e-Gov法令改正情報検索
            </Typography>
          </Box>
          {session?.user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">
                {session.user.name || session.user.email}
              </Typography>
              <IconButton
                color="inherit"
                onClick={handleLogout}
                size="small"
                title="ログアウト"
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* 検索フォーム */}
      <Accordion defaultExpanded sx={{ position: 'sticky', top: 64, zIndex: 1000 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">検索条件</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            改正法令の公布日または施行日が期間内にある法令を検索します
          </Typography>

          {/* 期間指定 */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <TextField
              sx={{ width: 180 }}
              size="small"
              label="改正日（開始）"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              sx={{ width: 180 }}
              size="small"
              label="改正日（終了）"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              sx={{ flex: 1 }}
              size="small"
              label="法令名で絞り込み（検索時に適用）"
              placeholder="例: 電波法、労働安全"
              value={lawNameFilter}
              onChange={(e) => setLawNameFilter(e.target.value)}
              disabled={loading}
            />
          </Stack>

          {/* 進捗表示 */}
          {loading && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">{loadingMessage}</Typography>
              {progress.total > 0 && (
                <Box sx={{ mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(progress.current / progress.total) * 100}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                    {progress.current} / {progress.total} 件取得中
                  </Typography>
                </Box>
              )}
            </Alert>
          )}

          {/* カテゴリフィルタ */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              カテゴリで絞り込み（検索時に適用、複数選択可）
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {LAW_CATEGORIES.map((category) => (
                <Chip
                  key={category.code}
                  label={category.name}
                  onClick={() => handleCategoryToggle(category.code)}
                  color={selectedCategories.includes(category.code) ? 'primary' : 'default'}
                  disabled={loading}
                  title={category.description}
                />
              ))}
            </Box>
            {selectedCategories.length > 0 && (
              <Button
                size="small"
                startIcon={<ClearIcon />}
                onClick={() => setSelectedCategories([])}
                disabled={loading}
                sx={{ mt: 1 }}
              >
                すべて解除
              </Button>
            )}
          </Box>

          {/* 検索ボタン */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSearch}
              disabled={loading}
              startIcon={<SearchIcon />}
              sx={{ minWidth: 200 }}
            >
              {loading ? '検索中...' : '検索'}
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {amendments.length > 0 ? (
          <>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  法令一覧 ({amendments.length}件)
                </Typography>
                <Box sx={{ height: 600, width: '100%' }}>
                  <DataGridPro
                    rows={rows}
                    columns={columns}
                    rowSelectionModel={
                      selectedLaw
                        ? [amendments.findIndex((a) => a.law_id === selectedLaw.law_id)]
                        : []
                    }
                    onRowSelectionModelChange={handleRowSelectionModelChange}
                    pageSizeOptions={[10, 25, 50, 100]}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 25 } },
                    }}
                    disableMultipleRowSelection
                  />
                </Box>
              </CardContent>
            </Card>

            <LawDetailDialog
              open={dialogOpen}
              onClose={handleCloseDialog}
              selectedLaw={selectedLaw}
              revisions={revisions}
              loading={loading}
              onViewLawData={handleViewLawData}
              onFetchRevisions={handleFetchRevisions}
            />
          </>
        ) : (
          !loading && (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  👈 期間を指定して検索してください
                </Typography>
                <Box sx={{ maxWidth: 'md', mx: 'auto', mt: 3, textAlign: 'left' }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    使い方
                  </Typography>
                  <ol>
                    <li>開始日と終了日を指定</li>
                    <li>「検索」ボタンをクリック</li>
                    <li>法令一覧から確認したい法令を選択</li>
                    <li>改正履歴や詳細情報を確認</li>
                    <li>各履歴から法令本文を取得可能</li>
                  </ol>
                </Box>
              </CardContent>
            </Card>
          )
        )}
      </Container>
    </Stack>
  );
}
