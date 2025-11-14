// e-Gov法令API v2のレスポンス型定義

export interface LawInfo {
  law_id: string;
  law_num: string;
  law_num_era?: string;
  law_num_year?: number;
  law_num_type?: string;
  law_num_num?: string;
  promulgation_date?: string;
}

export interface RevisionInfo {
  law_revision_id: string;
  law_type: string;
  law_title: string;
  law_title_kana?: string;
  abbrev?: string;
  category?: string;
  updated: string;
  amendment_promulgate_date?: string;
  amendment_enforcement_date?: string;
  amendment_enforcement_comment?: string;
  amendment_scheduled_enforcement_date?: string;
  amendment_law_id?: string;
  amendment_law_title?: string;
  amendment_law_title_kana?: string;
  amendment_law_num?: string;
  amendment_type?: string;
  repeal_status?: string;
  repeal_date?: string;
  remain_in_force?: boolean;
  mission?: string;
  current_revision_status?: string;
}

export interface Law {
  law_info: LawInfo;
  revision_info: RevisionInfo;
  current_revision_info?: RevisionInfo;
}

export interface LawsResponse {
  laws: Law[];
  total_count: number;
  offset: number;
  limit: number;
}

export interface LawRevision {
  law_revision_id: string;
  law_type: string;
  law_title: string;
  law_title_kana?: string;
  abbrev?: string;
  category?: string;
  updated: string;
  amendment_promulgate_date?: string;
  amendment_enforcement_date?: string;
  amendment_enforcement_comment?: string;
  amendment_scheduled_enforcement_date?: string;
  amendment_law_id?: string;
  amendment_law_title?: string;
  amendment_law_title_kana?: string;
  amendment_law_num?: string;
  amendment_type?: string;
  repeal_status?: string;
  repeal_date?: string;
  remain_in_force?: boolean;
  mission?: string;
  current_revision_status?: string;
}

export interface LawRevisionsResponse {
  law_info: LawInfo;
  revisions: LawRevision[];
}

export interface LawDataResponse {
  law_info: LawInfo;
  revision_info: RevisionInfo;
  law_full_text: any; // XMLまたはJSON構造
}

export interface AmendmentSummary {
  law_id: string;
  law_num: string;
  law_title: string;
  law_type: string;
  category?: string;
  amendment_promulgate_date?: string;
  amendment_enforcement_date?: string;
  amendment_law_id?: string;
  amendment_law_title?: string;
  amendment_law_num?: string;
  amendment_type?: string;
  mission?: string;
  updated: string;
  law_revision_id: string;
}

// 製造業関連のカテゴリ定義
export interface CategoryDefinition {
  code: string;
  name: string;
  description?: string;
}

export const LAW_CATEGORIES: CategoryDefinition[] = [
  { code: '001', name: '憲法' },
  { code: '002', name: '刑事' },
  { code: '003', name: '財務通則' },
  { code: '004', name: '水産業' },
  { code: '005', name: '観光' },
  { code: '006', name: '国会' },
  { code: '007', name: '警察' },
  { code: '008', name: '国有財産' },
  { code: '009', name: '鉱業' },
  { code: '010', name: '郵務' },
  { code: '011', name: '行政組織' },
  { code: '012', name: '消防' },
  { code: '013', name: '国税' },
  { code: '014', name: '工業' },
  { code: '015', name: '電気通信' },
  { code: '016', name: '国家公務員' },
  { code: '017', name: '国土開発' },
  { code: '018', name: '事業' },
  { code: '019', name: '商業' },
  { code: '020', name: '労働' },
  { code: '021', name: '行政手続' },
  { code: '022', name: '土地' },
  { code: '023', name: '国債' },
  { code: '024', name: '金融・保険' },
  { code: '025', name: '環境保全' },
  { code: '026', name: '統計' },
  { code: '027', name: '都市計画' },
  { code: '028', name: '教育' },
  { code: '029', name: '外国為替・貿易' },
  { code: '030', name: '厚生' },
  { code: '031', name: '地方自治' },
  { code: '032', name: '道路' },
  { code: '033', name: '文化' },
  { code: '034', name: '陸運' },
  { code: '035', name: '社会福祉' },
  { code: '036', name: '地方財政' },
  { code: '037', name: '河川' },
  { code: '038', name: '産業通則' },
  { code: '039', name: '海運' },
  { code: '040', name: '社会保険' },
  { code: '041', name: '司法' },
  { code: '042', name: '災害対策' },
  { code: '043', name: '農業' },
  { code: '044', name: '航空' },
  { code: '045', name: '防衛' },
  { code: '046', name: '民事' },
  { code: '047', name: '建築・住宅' },
  { code: '048', name: '林業' },
  { code: '049', name: '貨物運送' },
  { code: '050', name: '外事' },
];
