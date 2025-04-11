// /app/api/leaderboard/route.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// Singleton pattern
const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function GET() {
  try {
    const data = await prisma.$queryRaw`
      SELECT 
        Request_ID, 
        Toughness, 
        RecordedMass, 
        Toughness / RecordedMass AS leaderboard_result 
      FROM bear_tests 
      WHERE 
        Toughness IS NOT NULL 
        AND Toughness != 0
        AND RecordedMass != -1 
        AND RecordedMass IS NOT NULL 
        AND RecordedMass != 0
      ORDER BY leaderboard_result DESC
      LIMIT 10
    `;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard data", details: error.message },
      { status: 500 }
    );
  }
}
