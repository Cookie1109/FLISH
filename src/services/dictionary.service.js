const baseUrl =
  process.env.FREE_DICTIONARY_BASE_URL ||
  "https://api.dictionaryapi.dev/api/v2/entries/en";

async function lookupDictionary(word) {
  const url = `${baseUrl}/${encodeURIComponent(word)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Dictionary lookup failed");
  }

  const data = await response.json();
  const entry = Array.isArray(data) ? data[0] : null;
  if (!entry) return null;

  const phonetic =
    entry.phonetic || entry.phonetics?.find((p) => p.text)?.text || null;
  const audioUrl = entry.phonetics?.find((p) => p.audio)?.audio || null;
  
  const meaning = entry.meanings?.[0];
  const definition = meaning?.definitions?.[0]?.definition || null;
  const partOfSpeech = meaning?.partOfSpeech || null;

  let exampleSentence = null;
  if (entry.meanings) {
    for (const m of entry.meanings) {
      if (m.definitions) {
        const defWithExample = m.definitions.find(d => d.example);
        if (defWithExample) {
          exampleSentence = defWithExample.example;
          break;
        }
      }
    }
  }

  return {
    phonetic,
    audioUrl,
    partOfSpeech,
    definition,
    exampleSentence,
  };
}

module.exports = { lookupDictionary };
