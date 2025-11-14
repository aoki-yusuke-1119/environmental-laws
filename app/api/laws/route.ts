import { NextRequest, NextResponse } from 'next/server';
import { EGovAPIClient } from '@/lib/egov-client';

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const searchParams = request.nextUrl.searchParams;
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const categories = searchParams.get('categories');
    const lawTitle = searchParams.get('law_title');

    console.log(`[API /laws] リクエスト受信: ${dateFrom} ~ ${dateTo}`);
    if (categories) {
      console.log(`[API /laws] カテゴリ指定: ${categories}`);
    }
    if (lawTitle) {
      console.log(`[API /laws] 法令名指定: ${lawTitle}`);
    }

    if (!dateFrom || !dateTo) {
      return NextResponse.json(
        { error: 'date_from and date_to are required' },
        { status: 400 }
      );
    }

    console.log(`[API /laws] e-Gov API呼び出し開始`);
    const categoryCodes = categories ? categories.split(',') : undefined;
    const amendments = await EGovAPIClient.getAmendmentsInPeriod(
      dateFrom,
      dateTo,
      categoryCodes,
      lawTitle || undefined
    );

    const totalTime = Date.now() - startTime;
    console.log(`[API /laws] 完了: ${amendments.length}件, ${totalTime}ms`);

    return NextResponse.json({
      amendments,
      count: amendments.length,
    });
  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error(`[API /laws] エラー: ${totalTime}ms`, error);
    return NextResponse.json(
      { error: 'Failed to fetch laws from e-Gov API' },
      { status: 500 }
    );
  }
}
