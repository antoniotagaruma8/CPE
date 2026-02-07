'use server';

export async function fetchStockImageAction(query: string) {
  const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

  if (!PEXELS_API_KEY) {
    return { success: false, error: "Server Error: PEXELS_API_KEY is not set in environment variables." };
  }

  try {
    // Requesting landscape orientation for better fit in exam layout
    // Using the query directly to find relevant stock photos
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
      next: { revalidate: 3600 } // Cache results for an hour
    });

    if (!response.ok) {
      return { success: false, error: `Pexels API returned ${response.status}` };
    }

    const data = await response.json();
    
    if (data.photos && data.photos.length > 0) {
      // Use large2x for high quality, or large as fallback
      return { success: true, imageUrl: data.photos[0].src.large2x || data.photos[0].src.large };
    }
    
    return { success: false, error: "No relevant stock photos found for this description." };
  } catch (error) {
    console.error("Error fetching stock image:", error);
    return { success: false, error: "Failed to fetch image." };
  }
}