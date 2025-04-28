// Import library for fetching site metadata
import ogs from 'open-graph-scraper';

/**
 * HTTP GET handler to fetch Open Graph metadata from a given URL.
 * 
 * This endpoint:
 * 1. Accepts a URL via query parameter 'url'
 * 2. Fetches and parses the webpage's Open Graph metadata
 * 3. Returns the title, description, image URL, and original URL in a standardized format
 * 
 * @param {Request} request - The incoming HTTP request object
 * @returns {Response} - Returns a JSON response containing either:
 *   - Success: { title, description, image, url }
 *   - Error: { error, [details] } with appropriate HTTP status code
 */
export async function GET(request) {
  // Extract query parameters from the request URL
  const { searchParams } = new URL(request.url);
  // Get the 'url' query parameter that contains the target webpage URL
  const url = searchParams.get("url");

  // Validate that the URL was provided
  if (!url) {
    return new Response(
      JSON.stringify({ error: "URL parameter is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    // Fetch data using the Open Graph Scraper library
    const { result } = await ogs({ 
      url,            // The target URL to scrape
      download: true, // Download images to properly extract images
    });

    /**
     * Extract image URL from Open Graph data, handling different formats:
     * 1. Array format (ogImage: [{url: '...'}, ...])
     * 2. Single image format (ogImage: {url: '...'})
     * 3. Fallback to null if no image found
     */
    const imageUrl = result.ogImage?.[0]?.url ||  // Array format 
                     result.ogImage?.url ||       // Single image format
                     null;                        // Fallback to null

    // Return successfully formatted metadata
    return new Response(
      JSON.stringify({
        title: result.ogTitle || "No title available",
        description: result.ogDescription || "No description available",
        image: imageUrl,
        url: url // Return original URL for linking
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    // Log full error details
    console.error('OGS Error:', error);

    // Return error response with status 500
    return new Response(
      JSON.stringify({
        error: "Failed to fetch metadata",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
