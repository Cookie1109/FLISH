const baseUrl = process.env.UNSPLASH_BASE_URL || "https://api.unsplash.com";

async function fetchImageUrl(query) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    throw new Error("Unsplash access key missing");
  }

  const url = `${baseUrl}/search/photos?query=${encodeURIComponent(
    query
  )}&per_page=1`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unsplash lookup failed");
  }

  const data = await response.json();
  const photo = data?.results?.[0];
  return photo?.urls?.regular || photo?.urls?.small || null;
}

module.exports = { fetchImageUrl };
