import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RainSafeRoute — Flood-Aware Safe Navigation for Monsoons" },
      {
        name: "description",
        content:
          "Find the safest route during monsoon flooding using rainfall data, historical flood hotspots and community waterlogging reports across Indian cities.",
      },
      { property: "og:title", content: "RainSafeRoute — Flood-Aware Safe Navigation" },
      {
        property: "og:description",
        content:
          "Safety-first navigation for monsoon-prone regions: live rainfall, flood hotspots, community reports and risk-scored routes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <iframe
      src="/app/index.html"
      title="RainSafeRoute"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: "none" }}
    />
  );
}
