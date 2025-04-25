// /pages/api/fetch-metadata.js
import ogs from "open-graph-scraper";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return new Response(
      JSON.stringify({ error: "URL parameter is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    const { result } = await ogs({
      url,
      download: true, // Ensures images are properly fetched
    });

    // Handle both single and array-based Open Graph image declarations
    const imageUrl =
      result.ogImage?.[0]?.url || // Array format
      result.ogImage?.url || // Single image format
      null;

    return new Response(
      JSON.stringify({
        title: result.ogTitle || "No title available",
        description: result.ogDescription || "No description available",
        image: imageUrl,
        url: url, // Return original URL for linking
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("OGS Error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch metadata",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
