import { NextRequest, NextResponse } from 'next/server';
import { EGovAPIClient } from '@/lib/egov-client';

// 動的レンダリングを強制（searchParamsを使用するため）
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lawId = searchParams.get('law_id');

    if (!lawId) {
      return NextResponse.json(
        { error: 'law_id is required' },
        { status: 400 }
      );
    }

    const revisions = await EGovAPIClient.getLawRevisions(lawId);

    return NextResponse.json(revisions);
  } catch (error) {
    console.error('Error fetching revisions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revisions from e-Gov API' },
      { status: 500 }
    );
  }
}
