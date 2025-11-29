import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

// Instantiate a single Prisma client instance for database access
const prisma = new PrismaClient();

/**
 * GET handler for fetching bear status data
 *
 * This endpoint provides:
 * - Current request status from bear_inprogress table
 * - Paginated requests from bear_inprogress table with corresponding test results from bear_tests table
 *
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Number of items per page (default: 5)
 *
 * @param {Request} request - The incoming HTTP request object
 * @returns {NextResponse} - JSON response containing either:
 *   - Success: { current: object, previous: array, hasMore: boolean }
 *   - Error: { error: string } with appropriate HTTP status code
 */
export async function GET(request: Request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const offset = (page - 1) * limit;

    // Get current request (always the latest one)
    const currentRecord = await prisma.$queryRaw`
      SELECT RequestID, Status
      FROM bear_inprogress
      ORDER BY RequestID DESC
      LIMIT 1
    `;

    const currentRecords = currentRecord as Array<{
      RequestID: number;
      Status: number;
    }>;

    if (currentRecords.length === 0) {
      return NextResponse.json(
        { error: "No data found in bear_inprogress table" },
        { status: 404 },
      );
    }

    const current = currentRecords[0];

    // Get paginated previous requests (skip the current one)
    const previousInProgressRecords = await prisma.$queryRaw`
      SELECT RequestID, Status
      FROM bear_inprogress
      WHERE RequestID < ${current.RequestID}
      ORDER BY RequestID DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const _previousInProgress = previousInProgressRecords as Array<{
      RequestID: number;
      Status: number;
    }>;

    // Check if there are more records for pagination in bear_inprogress
    const nextPageRecords = await prisma.$queryRaw`
      SELECT RequestID
      FROM bear_inprogress
      WHERE RequestID < ${current.RequestID}
      ORDER BY RequestID DESC
      LIMIT 1
      OFFSET ${offset + limit}
    `;

    const hasMore =
      (nextPageRecords as Array<{ RequestID: number }>).length > 0;

    // Get RequestIDs and Status from bear_inprogress
    const inProgressRequestIds = _previousInProgress.map(
      (record) => record.RequestID,
    );

    // Now find the corresponding test data in bear_tests for these RequestIDs
    let previousWithTestResults: Array<{
      RequestID: number;
      Status: number;
      Toughness: number | null;
      RecordedMass: number | null;
      CriticalStress: number | null;
      TargetHeight: number | null;
      TimePrintStarted: number | null;
      TimeInstronCrushed: number | null;
    }> = [];

    if (inProgressRequestIds.length > 0) {
      // Build the IN clause using Prisma.join for proper parameterization
      const testResults = await prisma.$queryRaw`
        SELECT 
          Request_ID,
          Toughness,
          RecordedMass,
          CriticalStress,
          TargetHeight,
          TimePrintStarted,
          TimeInstronCrushed
        FROM bear_tests
        WHERE Request_ID IN (${Prisma.join(inProgressRequestIds)})
      `;

      const testResultsTyped = testResults as Array<{
        Request_ID: number;
        Toughness: number;
        RecordedMass: number;
        CriticalStress: number;
        TargetHeight: number;
        TimePrintStarted: number;
        TimeInstronCrushed: number;
      }>;

      // Combine bear_inprogress data (RequestID + Status) with bear_tests data
      previousWithTestResults = _previousInProgress.map((inProgressRecord) => {
        const testResult = testResultsTyped.find(
          (test) => test.Request_ID === inProgressRecord.RequestID,
        );

        return {
          RequestID: inProgressRecord.RequestID,
          Status: inProgressRecord.Status, // Status from bear_inprogress
          Toughness: testResult?.Toughness || null,
          RecordedMass: testResult?.RecordedMass || null,
          CriticalStress: testResult?.CriticalStress || null,
          TargetHeight: testResult?.TargetHeight || null,
          TimePrintStarted: testResult?.TimePrintStarted || null,
          TimeInstronCrushed: testResult?.TimeInstronCrushed || null,
        };
      });
    }

    return NextResponse.json({
      current,
      previous: previousWithTestResults,
      hasMore,
    });
  } catch (error) {
    // Log full error details
    console.error("Error fetching bear status data:", error);
    return NextResponse.json(
      { error: "Failed to fetch bear status data" },
      { status: 500 },
    );
  } finally {
    // Disconnect Prisma client to prevent memory leaks
    await prisma.$disconnect();
  }
}
