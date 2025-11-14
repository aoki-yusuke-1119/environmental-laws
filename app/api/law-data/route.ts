import { NextRequest, NextResponse } from 'next/server';
import { EGovAPIClient } from '@/lib/egov-client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lawRevisionId = searchParams.get('law_revision_id');

    if (!lawRevisionId) {
      return NextResponse.json(
        { error: 'law_revision_id is required' },
        { status: 400 }
      );
    }

    const lawData = await EGovAPIClient.getLawData(lawRevisionId);

    return NextResponse.json(lawData);
  } catch (error) {
    console.error('Error fetching law data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch law data from e-Gov API' },
      { status: 500 }
    );
  }
}
