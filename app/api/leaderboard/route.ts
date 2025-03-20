// app/api/leaderboard/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;

  try {
    const leaderboardData = await prisma.$queryRaw`
      SELECT
        Request_ID,
        Toughness,
        RecordedMass,
        Toughness / RecordedMass AS ratio
      FROM
        bear_tests
      WHERE
        Toughness IS NOT NULL
        AND RecordedMass IS NOT NULL
        AND RecordedMass != 0
      ORDER BY
        ratio DESC
      LIMIT 20
      OFFSET ${(page - 1) * 20}
    `;

    return NextResponse.json(leaderboardData);
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}