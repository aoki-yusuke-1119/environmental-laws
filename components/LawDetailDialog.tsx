'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Stack,
  Paper,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { AmendmentSummary, LawRevision } from '@/types/law';
import { EGovAPIClient } from '@/lib/egov-client';

interface LawDetailDialogProps {
  open: boolean;
  onClose: () => void;
  selectedLaw: AmendmentSummary | null;
  revisions: LawRevision[];
  loading: boolean;
  onViewLawData: (lawRevisionId: string) => void;
  onFetchRevisions: () => void;
}

export default function LawDetailDialog({
  open,
  onClose,
  selectedLaw,
  revisions,
  loading,
  onViewLawData,
  onFetchRevisions,
}: LawDetailDialogProps) {
  if (!selectedLaw) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">詳細情報</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          {/* 基本情報 */}
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              📋 基本情報
            </Typography>
            <Stack spacing={1}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  法令名
                </Typography>
                <Typography variant="body2">{selectedLaw.law_title}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  法令番号
                </Typography>
                <Typography variant="body2">{selectedLaw.law_num}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  法令ID
                </Typography>
                <Typography variant="body2">{selectedLaw.law_id}</Typography>
              </Box>
              {selectedLaw.category && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    分類
                  </Typography>
                  <Typography variant="body2">{selectedLaw.category}</Typography>
                </Box>
              )}
            </Stack>
          </Paper>

          {/* 最新の改正情報 */}
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              🔄 最新の改正情報
            </Typography>
            <Stack spacing={1}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  改正法令
                </Typography>
                <Typography variant="body2">
                  {selectedLaw.amendment_law_title || 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  改正法令番号
                </Typography>
                <Typography variant="body2">
                  {selectedLaw.amendment_law_num || 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  改正公布日
                </Typography>
                <Typography variant="body2">
                  {selectedLaw.amendment_promulgate_date || 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  改正施行日
                </Typography>
                <Typography variant="body2">
                  {selectedLaw.amendment_enforcement_date || 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  改正種別
                </Typography>
                <Typography variant="body2">
                  {EGovAPIClient.formatAmendmentType(selectedLaw.amendment_type)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  ミッション
                </Typography>
                <Typography variant="body2">
                  {EGovAPIClient.formatMission(selectedLaw.mission)}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* アクションボタン */}
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => onViewLawData(selectedLaw.law_revision_id)}
              fullWidth
            >
              📖 最新の改正条文を取得
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={onFetchRevisions}
              disabled={loading}
              fullWidth
            >
              {loading ? '取得中...' : '📚 改正履歴を取得'}
            </Button>
          </Stack>

          {/* 改正履歴 */}
          {revisions.length > 0 && (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                📚 改正履歴一覧
              </Typography>
              <Box>
                {revisions.map((revision, index) => (
                  <Accordion key={index}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="body2">
                        {revision.law_title} - {revision.amendment_promulgate_date || 'N/A'}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={1}>
                        <Typography variant="caption">
                          <strong>改正法令:</strong> {revision.amendment_law_title || 'N/A'}
                        </Typography>
                        <Typography variant="caption">
                          <strong>改正公布日:</strong> {revision.amendment_promulgate_date || 'N/A'}
                        </Typography>
                        <Typography variant="caption">
                          <strong>改正施行日:</strong> {revision.amendment_enforcement_date || 'N/A'}
                        </Typography>
                        <Typography variant="caption">
                          <strong>改正種別:</strong>{' '}
                          {EGovAPIClient.formatAmendmentType(revision.amendment_type)}
                        </Typography>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => onViewLawData(revision.law_revision_id)}
                          sx={{ mt: 1 }}
                        >
                          📖 この版の法令本文を取得
                        </Button>
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Box>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
