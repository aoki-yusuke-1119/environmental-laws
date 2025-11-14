import {
  LawsResponse,
  LawRevisionsResponse,
  LawDataResponse,
  AmendmentSummary,
} from '@/types/law';

/**
 * e-Gov法令API v2クライアント
 */
export class EGovAPIClient {
  private static readonly BASE_URL = 'https://laws.e-gov.go.jp/api/2';

  /**
   * 法令一覧を取得
   */
  static async getLaws(params: {
    limit?: number;
    offset?: number;
    category_codes?: string[];
    law_title?: string;
  }): Promise<LawsResponse> {
    const queryParams = new URLSearchParams();

    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset !== undefined) queryParams.append('offset', params.offset.toString());

    if (params.category_codes && params.category_codes.length > 0) {
      queryParams.append('category_cd', params.category_codes.join(','));
    }
    if (params.law_title) {
      queryParams.append('law_title', params.law_title);
    }

    // 廃止されていない法令のみ取得
    queryParams.append('repeal_status', 'None');

    console.log(`[getLaws] API呼び出し: ${queryParams.toString()}`);

    const response = await fetch(
      `${this.BASE_URL}/laws?${queryParams.toString()}`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 法令の改正履歴一覧を取得
   */
  static async getLawRevisions(
    lawId: string,
    params?: {
      amendment_promulgate_date_from?: string;
      amendment_promulgate_date_to?: string;
    }
  ): Promise<LawRevisionsResponse> {
    const queryParams = new URLSearchParams();

    if (params?.amendment_promulgate_date_from) {
      queryParams.append('amendment_promulgate_date_from', params.amendment_promulgate_date_from);
    }
    if (params?.amendment_promulgate_date_to) {
      queryParams.append('amendment_promulgate_date_to', params.amendment_promulgate_date_to);
    }

    const response = await fetch(
      `${this.BASE_URL}/law_revisions/${lawId}?${queryParams.toString()}`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 法令本文を取得
   */
  static async getLawData(lawRevisionId: string): Promise<LawDataResponse> {
    const response = await fetch(
      `${this.BASE_URL}/law_data/${lawRevisionId}?response_format=json`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 指定期間内の改正法令情報を取得
   */
  static async getAmendmentsInPeriod(
    dateFrom: string,
    dateTo: string,
    categoryCodes?: string[],
    lawTitle?: string
  ): Promise<AmendmentSummary[]> {
    const allAmendments: AmendmentSummary[] = [];
    let offset = 0; // 0からスタート（1件目から取得）
    const limit = 10000; // 大きな値に設定
    let pageCount = 0;

    console.log(`[EGovClient] 改正日期間検索開始: ${dateFrom} ~ ${dateTo}`);
    if (categoryCodes && categoryCodes.length > 0) {
      console.log(`[EGovClient] カテゴリ絞り込み: ${categoryCodes.join(', ')}`);
    } else {
      console.log(`[EGovClient] 全法令を対象に改正情報を取得します`);
    }
    if (lawTitle) {
      console.log(`[EGovClient] 法令名絞り込み: ${lawTitle}`);
    }

    while (true) {
      pageCount++;
      const pageStartTime = Date.now();

      console.log(`[EGovClient] ページ ${pageCount} 取得中 (offset: ${offset}, limit: ${limit})`);

      const response = await this.getLaws({
        limit,
        offset,
        category_codes: categoryCodes,
        law_title: lawTitle,
      });

      const pageTime = Date.now() - pageStartTime;
      console.log(`[EGovClient] ページ ${pageCount} 取得完了: ${response.laws?.length || 0}件, ${pageTime}ms`);

      const laws = response.laws || [];
      if (laws.length === 0) break;

      for (const law of laws) {
        const lawInfo = law.law_info;
        const revisionInfo = law.revision_info;

        allAmendments.push({
          law_id: lawInfo.law_id,
          law_num: lawInfo.law_num,
          law_title: revisionInfo.law_title,
          law_type: revisionInfo.law_type,
          category: revisionInfo.category,
          amendment_promulgate_date: revisionInfo.amendment_promulgate_date,
          amendment_enforcement_date: revisionInfo.amendment_enforcement_date,
          amendment_law_id: revisionInfo.amendment_law_id,
          amendment_law_title: revisionInfo.amendment_law_title,
          amendment_law_num: revisionInfo.amendment_law_num,
          amendment_type: revisionInfo.amendment_type,
          mission: revisionInfo.mission,
          updated: revisionInfo.updated,
          law_revision_id: revisionInfo.law_revision_id,
        });
      }

      const totalCount = response.total_count || 0;
      console.log(`[EGovClient] 全体: ${totalCount}件, 現在取得: ${allAmendments.length}件`);

      if (offset + limit >= totalCount) break;

      offset += limit;
    }

    // 改正公布日または改正施行日でフィルタリング
    const filteredAmendments = allAmendments.filter((amendment) => {
      const promulgateDate = amendment.amendment_promulgate_date;
      const enforcementDate = amendment.amendment_enforcement_date;

      // 公布日が期間内
      const isPromulgateInRange = promulgateDate &&
        promulgateDate >= dateFrom &&
        promulgateDate <= dateTo;

      // 施行日が期間内
      const isEnforcementInRange = enforcementDate &&
        enforcementDate >= dateFrom &&
        enforcementDate <= dateTo;

      // どちらか一方でも期間内ならtrue
      return isPromulgateInRange || isEnforcementInRange;
    });

    console.log(
      `[EGovClient] 改正日フィルタリング完了: ${allAmendments.length}件 → ${filteredAmendments.length}件`
    );

    return filteredAmendments;
  }

  /**
   * 改正種別コードを日本語に変換
   */
  static formatAmendmentType(amendmentType?: string): string {
    if (!amendmentType) return 'N/A';

    const typeMap: Record<string, string> = {
      '1': '新規制定',
      '2': '全部改正',
      '3': '被改正法',
      '4': '一部改正附則',
      '8': '廃止',
    };

    return typeMap[amendmentType] || `その他(${amendmentType})`;
  }

  /**
   * ミッション種別を日本語に変換
   */
  static formatMission(mission?: string): string {
    if (!mission) return 'N/A';

    const missionMap: Record<string, string> = {
      New: '新規制定・被改正法',
      Partial: '一部改正法',
    };

    return missionMap[mission] || mission;
  }
}
