import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Pagination
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 20;
  
  // Sorting
  const sortBy = searchParams.get("sortBy") || "ratio";
  const sortOrder = searchParams.get("sortOrder")?.toUpperCase() === "ASC" ? "ASC" : "DESC";
  
  // Filtering - handle multiple filters
  const searchFields = searchParams.getAll("searchField");
  const searchValues = searchParams.getAll("searchValue");
  
  try {
    let whereClause = Prisma.sql`
      Toughness IS NOT NULL
      AND RecordedMass IS NOT NULL
      AND RecordedMass != 0
    `;
    
    // Combine multiple filters with AND conditions
    const validSearchFields = [
      'Request_ID', 
      'Toughness', 
      'RecordedMass', 
      'CriticalStress', 
      'TargetHeight',
      'ratio'
    ];
    
    for (let i = 0; i < searchFields.length; i++) {
      const field = searchFields[i];
      const value = searchValues[i];
      
      if (!field || !value || !validSearchFields.includes(field)) continue;
      
      if (field === 'ratio') {
        whereClause = Prisma.sql`
          ${whereClause}
          AND CONVERT(Toughness / RecordedMass, CHAR) LIKE CONCAT(${value}, '%')
        `;
      } else if (field === 'Request_ID') {
        whereClause = Prisma.sql`
          ${whereClause}
          AND CONVERT(${Prisma.raw(field)}, CHAR) LIKE CONCAT(${value}, '%')
        `;
      } else {
        whereClause = Prisma.sql`
          ${whereClause}
          AND CONVERT(${Prisma.raw(field)}, CHAR) LIKE CONCAT(${value}, '%')
        `;
      }
    }
    
    let orderByClause;
    const validSortColumns = [
      'Request_ID', 
      'Toughness', 
      'RecordedMass', 
      'CriticalStress', 
      'TargetHeight'
    ];
    
    if (sortBy === "ratio") {
      orderByClause = sortOrder === "ASC" 
        ? Prisma.sql`(Toughness / RecordedMass) ASC` 
        : Prisma.sql`(Toughness / RecordedMass) DESC`;
    } else if (validSortColumns.includes(sortBy)) {
      orderByClause = sortOrder === "ASC"
        ? Prisma.sql`${Prisma.raw(sortBy)} ASC`
        : Prisma.sql`${Prisma.raw(sortBy)} DESC`;
    } else {
      // Default fallback if invalid sort column provided
      orderByClause = Prisma.sql`(Toughness / RecordedMass) DESC`;
    }
    
    // Execute the query with all parameterized values
    const leaderboardData = await prisma.$queryRaw`
      SELECT
        Request_ID,
        Toughness,
        RecordedMass,
        CriticalStress,
        TargetHeight,
        Toughness / RecordedMass AS ratio
      FROM
        bear_tests
      WHERE
        ${whereClause}
      ORDER BY
        ${orderByClause}
      LIMIT ${pageSize}
      OFFSET ${(page - 1) * pageSize}
    `;
    
    return NextResponse.json(leaderboardData);
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}