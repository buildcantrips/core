function normalizeString(string) {
  return string
    .split("/")
    .join("-")
    .toLowerCase()
}

function isNormalizedString(string) {
  return !string.includes("/") && string === string.toLowerCase()
}

module.exports = {
  isNormalizedString,
  normalizeString
}
