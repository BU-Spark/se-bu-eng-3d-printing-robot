import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

// Instantiate a single Prisma client instance for database access
const prisma = new PrismaClient();

/**
 * GET handler for fetching paginated, sorted, and filterable leaderboard data
 * 
 * This endpoint provides a flexible API for accessing bear test results with:
 * - Pagination controls
 * - Multi-column sorting
 * - Multi-field filtering
 * - Calculated ratio field (Toughness/RecordedMass)
 * 
 * Query Parameters:
 * - page: Current page number (default: 1)
 * - pageSize: Number of items per page (default: 20)
 * - sortBy: Field to sort by (default: "ratio")
 * - sortOrder: Sort direction ("ASC" or "DESC", default: "DESC")
 * - searchField[]: Array of fields to filter on (repeatable)
 * - searchValue[]: Array of values to filter with (repeatable)
 * 
 * @param {Request} request - The incoming HTTP request object
 * @returns {NextResponse} - JSON response containing either:
 *   - Success: Array of bear test records with calculated ratio
 *   - Error: { error: string } with appropriate HTTP status code
 */
export async function GET(request: Request) {
  // Parse query parameters from the request URL
  const { searchParams } = new URL(request.url);
  
  // Pagination parameters with defaults
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 20;
  
  // Sorting parameters with defaults
  const sortBy = searchParams.get("sortBy") || "ratio";
  const sortOrder = searchParams.get("sortOrder")?.toUpperCase() === "ASC" ? "ASC" : "DESC";
  
  // Handle multiple filter pairs (searchField + searchValue)
  const searchFields = searchParams.getAll("searchField");
  const searchValues = searchParams.getAll("searchValue");

  try {
    // base WHERE clause ensuring we only get valid, calculable records
    let whereClause = Prisma.sql`
      Toughness IS NOT NULL
      AND RecordedMass IS NOT NULL
      AND RecordedMass != 0 -- Prevent division by zero in ratio calculation
    `;
    
    // List of fields that can be safely used in filtering
    const validSearchFields = [
      "Request_ID",
      "Toughness",
      "RecordedMass",
      "CriticalStress",
      "TargetHeight",
      "ratio",
    ];
    
    // Process each filter pair to build the WHERE clause
    for (let i = 0; i < searchFields.length; i++) {
      const field = searchFields[i];
      const value = searchValues[i];
      
      // Skip invalid filter pairs
      if (!field || !value || !validSearchFields.includes(field)) continue;
      
      // Special handling for ratio filtering (calculated field)
      if (field === 'ratio') {
        whereClause = Prisma.sql`
          ${whereClause}
          AND CONVERT(Toughness / RecordedMass, CHAR) LIKE CONCAT(${value}, '%')
        `;
      }
      // Standard filtering for other fields 
      else {
        whereClause = Prisma.sql`
          ${whereClause}
          AND CONVERT(${Prisma.raw(field)}, CHAR) LIKE CONCAT(${value}, '%')
        `;
      }
    }
    
    // Build the ORDER BY clause based on sort parameters
    let orderByClause;
    const validSortColumns = [
      "Request_ID",
      "Toughness",
      "RecordedMass",
      "CriticalStress",
      "TargetHeight",
    ];
    
    // Special handling for ratio sorting (calculated field)
    if (sortBy === "ratio") {
      orderByClause = sortOrder === "ASC" 
        ? Prisma.sql`(Toughness / RecordedMass) ASC` 
        : Prisma.sql`(Toughness / RecordedMass) DESC`;
    }
    // Standard sorting for other valid columns 
    else if (validSortColumns.includes(sortBy)) {
      orderByClause = sortOrder === "ASC"
        ? Prisma.sql`${Prisma.raw(sortBy)} ASC`
        : Prisma.sql`${Prisma.raw(sortBy)} DESC`;
    } 
    // Fallback to default sorting (ratio DESC) for invalid sort columns
    else {
      orderByClause = Prisma.sql`(Toughness / RecordedMass) DESC`;
    }
    
    // Execute the final parameterized SQL query
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
    
    // Return the successful response with leaderboard data
    return NextResponse.json(leaderboardData);
  } catch (error) {
    // Log full error details
    console.error("Error fetching leaderboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  } finally {
    // Disconnect Prisma client to prevent memory leaks
    await prisma.$disconnect();
  }
}
