const PALETTE = [
  { color: "#2563EB", text: "#ffffff" },
  { color: "#EA580C", text: "#ffffff" },
  { color: "#16A34A", text: "#ffffff" },
  { color: "#0F766E", text: "#ffffff" },
  { color: "#DC2626", text: "#ffffff" },
  { color: "#0F172A", text: "#ffffff" },
];

function hashString(value) {
  let hash = 0;
  const str = String(value || "");
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getTopicAccent(topic) {
  const idx = hashString(topic?.id || topic?.name) % PALETTE.length;
  return PALETTE[idx];
}

function getTopicInitial(topic) {
  const name = topic?.name || "Topic";
  return name.charAt(0).toUpperCase();
}

module.exports = {
  getTopicAccent,
  getTopicInitial,
};
