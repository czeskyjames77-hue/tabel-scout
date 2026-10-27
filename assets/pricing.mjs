export const services = {
  deletion: "Bewertungen löschen",
  profile: "Google-Profil optimieren",
  management: "Partnerprogramm & Management",
  advice: "Gemeinsam den Einstieg finden",
};
export const boundedCount = (value, max = 10000) =>
  Math.min(max, Math.max(0, Math.trunc(Number(value) || 0)));
export function deletionQuote(requested, successful = requested) {
  const count = boundedCount(requested);
  const successes = Math.min(count, boundedCount(successful));
  const unit =
    count >= 100 ? 9 : count >= 50 ? 12 : count >= 25 ? 15 : count >= 10 ? 19 : 29;
  return {
    count,
    successes,
    unit,
    total: unit * successes,
    unpaid: count - successes,
    individual: count < 5,
  };
}
export function managementQuote(positive, negative) {
  const count = boundedCount(positive) + boundedCount(negative);
  return {
    count,
    price: count <= 5 ? 39 : count <= 15 ? 69 : count <= 30 ? 99 : 149,
    tier:
      count <= 5
        ? "Bis 5"
        : count <= 15
          ? "6–15"
          : count <= 30
            ? "16–30"
            : "Über 30",
  };
}
