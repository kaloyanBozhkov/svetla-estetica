import { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow all AI bots to crawl public content
      {
        userAgent: "GPTBot",
        allow: ["/", "/prodotti", "/trattamenti", "/chi-siamo", "/contatti"],
        disallow: ["/admin/", "/api/", "/account/", "/carrello/", "/auth/", "/prenota/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/", "/prodotti", "/trattamenti", "/chi-siamo", "/contatti"],
        disallow: ["/admin/", "/api/", "/account/", "/carrello/", "/auth/", "/prenota/"],
      },
      {
        userAgent: "Claude-Web",
        allow: ["/", "/prodotti", "/trattamenti", "/chi-siamo", "/contatti"],
        disallow: ["/admin/", "/api/", "/account/", "/carrello/", "/auth/", "/prenota/"],
      },
      {
        userAgent: "ClaudeBot",
        allow: ["/", "/prodotti", "/trattamenti", "/chi-siamo", "/contatti"],
        disallow: ["/admin/", "/api/", "/account/", "/carrello/", "/auth/", "/prenota/"],
      },
      {
        userAgent: "Anthropic-AI",
        allow: ["/", "/prodotti", "/trattamenti", "/chi-siamo", "/contatti"],
        disallow: ["/admin/", "/api/", "/account/", "/carrello/", "/auth/", "/prenota/"],
      },
      {
        userAgent: "Google-Extended",
        allow: ["/", "/prodotti", "/trattamenti", "/chi-siamo", "/contatti"],
        disallow: ["/admin/", "/api/", "/account/", "/carrello/", "/auth/", "/prenota/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/", "/prodotti", "/trattamenti", "/chi-siamo", "/contatti"],
        disallow: ["/admin/", "/api/", "/account/", "/carrello/", "/auth/", "/prenota/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/", "/account/", "/carrello/", "/auth/", "/prenota/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/admin/", "/api/", "/account/", "/carrello/", "/auth/", "/prenota/"],
      },
      // Default rule for all other bots
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/account/", "/carrello/", "/auth/", "/prenota/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
