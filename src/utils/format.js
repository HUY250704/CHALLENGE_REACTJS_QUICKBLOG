export function formatDate(date) {
  if (!date) return "Unknown date";
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function stripHtml(value = "") {
  return decodeHtmlEntities(value.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

export function truncate(value = "", length = 120) {
  if (value.length <= length) return value;
  return `${value.slice(0, length).trim()}...`;
}

function decodeHtmlEntities(value = "") {
  if (typeof document === "undefined") {
    const entities = {
      amp: "&",
      apos: "'",
      gt: ">",
      lt: "<",
      nbsp: " ",
      quot: '"',
      agrave: "à",
      aacute: "á",
      acirc: "â",
      atilde: "ã",
      egrave: "è",
      eacute: "é",
      ecirc: "ê",
      igrave: "ì",
      iacute: "í",
      ograve: "ò",
      oacute: "ó",
      ocirc: "ô",
      otilde: "õ",
      ugrave: "ù",
      uacute: "ú",
      yacute: "ý",
    };

    return value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
      const normalized = entity.toLowerCase();
      if (normalized.startsWith("#x")) return String.fromCodePoint(Number.parseInt(normalized.slice(2), 16));
      if (normalized.startsWith("#")) return String.fromCodePoint(Number.parseInt(normalized.slice(1), 10));
      return entities[normalized] || match;
    });
  }

  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}
