const baseUrl =
  process.env.MYMEMORY_BASE_URL ||
  "https://api.mymemory.translated.net/get";

async function translateText(text) {
  const url = `${baseUrl}?q=${encodeURIComponent(text)}&langpair=en|vi`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Translation lookup failed");
  }

  const data = await response.json();
  return data?.responseData?.translatedText || null;
}

module.exports = { translateText };
