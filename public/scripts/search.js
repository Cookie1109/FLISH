const input = document.querySelector("[data-search-input]");
const resultsEl = document.querySelector("[data-search-results]");
const statusEl = document.querySelector("[data-search-status]");

let timer = null;

function setStatus(text) {
  if (statusEl) {
    statusEl.textContent = text;
  }
}

function renderResults(results) {
  if (!resultsEl) return;

  if (!results.length) {
    resultsEl.innerHTML = "";
    return;
  }

  resultsEl.innerHTML = results
    .map(
      (item) => `
        <div class="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center hover:border-gray-900 transition-all group shadow-sm hover:shadow-md">
          <div class="min-w-0 flex-1">
            <h3 class="font-bold text-gray-900 group-hover:text-gray-900 transition-colors">${item.word || ""}</h3>
            <p class="text-sm text-gray-500 mt-0.5 line-clamp-2">${item.definition || ""}</p>
            <div class="flex items-center gap-2 mt-2">
              <span class="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Chủ đề:</span>
              <a href="/topics/${item.topicId}" class="text-xs font-medium text-gray-600 hover:text-gray-900 hover:underline transition-colors">${item.topicName || ""}</a>
            </div>
          </div>
          <div class="flex items-center gap-4 ml-4 shrink-0">
            <span class="hidden sm:inline-block text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider ${
              item.masteryLevel === 'mastered' ? 'bg-green-50 text-green-600' : 
              item.masteryLevel === 'learning' ? 'bg-blue-50 text-blue-600' : 
              'bg-amber-50 text-amber-600'
            }">
              ${item.masteryLevel || "new"}
            </span>
            <a href="/topics/${item.topicId}" class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 group-hover:bg-gray-900 group-hover:text-white text-gray-400 transition-all">
              <i data-lucide="arrow-right" class="w-5 h-5"></i>
            </a>
          </div>
        </div>
      `
    )
    .join("");

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

async function fetchResults(query) {
  const token = localStorage.getItem("flish_id_token");
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    throw new Error("Search failed");
  }

  return response.json();
}

function scheduleSearch() {
  const query = input?.value.trim() || "";
  if (!query) {
    setStatus("");
    renderResults([]);
    return;
  }

  setStatus("Searching...");

  if (timer) clearTimeout(timer);
  timer = setTimeout(async () => {
    try {
      const data = await fetchResults(query);
      renderResults(data.results || []);
      setStatus(`Found ${(data.results || []).length} result(s).`);
    } catch (error) {
      setStatus("Search failed.");
    }
  }, 300);
}

if (input) {
  input.addEventListener("input", scheduleSearch);
}
