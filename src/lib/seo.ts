export type JsonLd = Record<string, unknown>;
export type SiteLike = URL | string | undefined;

export const SITE_NAME = "thehardparts.dev";
export const SITE_BRAND_NAME = "The Hard Parts";
export const SITE_TAGLINE =
  "The Hard Parts. An engineering reference for recurring software failures, warning signals, hard decisions, and practical playbooks.";
export const SITE_AUTHOR = "The Hard Parts";
export const DEFAULT_OG_IMAGE_ALT =
  "The Hard Parts. An engineering reference. Failure modes. Red flags. Trade-offs. Playbooks.";

export function absoluteUrl(pathOrUrl: string, site: SiteLike): string {
  return new URL(pathOrUrl, site ?? "https://thehardparts.dev").toString();
}

export function siteRoot(site: SiteLike): string {
  return absoluteUrl("/", site);
}

export function organizationJsonLd(site: SiteLike): JsonLd {
  const root = siteRoot(site);
  return {
    "@type": "Organization",
    "@id": `${root}#organization`,
    name: SITE_BRAND_NAME,
    url: root,
    logo: absoluteUrl("/og-default.png", site),
  };
}

export function webSiteJsonLd(site: SiteLike): JsonLd {
  const root = siteRoot(site);
  return {
    "@type": "WebSite",
    "@id": `${root}#website`,
    url: root,
    name: SITE_BRAND_NAME,
    alternateName: SITE_NAME,
    description: SITE_TAGLINE,
    inLanguage: "en",
    publisher: { "@id": `${root}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl("/search", site)}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function webPageJsonLd(args: {
  site: SiteLike;
  url: string;
  name: string;
  description: string;
}): JsonLd {
  const root = siteRoot(args.site);
  return {
    "@type": "WebPage",
    "@id": `${args.url}#webpage`,
    url: args.url,
    name: args.name,
    description: args.description,
    isPartOf: { "@id": `${root}#website` },
    inLanguage: "en",
  };
}

export function breadcrumbJsonLd(
  items: ReadonlyArray<{ name: string; path: string }>,
  site: SiteLike,
): JsonLd {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, site),
    })),
  };
}

export function articleJsonLd(args: {
  site: SiteLike;
  url: string;
  title: string;
  description: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  articleSection?: string;
  keywords?: readonly string[];
  type?: "Article" | "TechArticle";
}): JsonLd {
  const root = siteRoot(args.site);
  return {
    "@type": args.type ?? "Article",
    "@id": `${args.url}#article`,
    headline: args.title,
    name: args.title,
    description: args.description,
    url: args.url,
    mainEntityOfPage: { "@id": `${args.url}#webpage` },
    image: args.image ? absoluteUrl(args.image, args.site) : absoluteUrl("/og-default.png", args.site),
    datePublished: args.datePublished,
    dateModified: args.dateModified ?? args.datePublished,
    articleSection: args.articleSection,
    keywords: args.keywords?.filter(Boolean).join(", "),
    author: { "@id": `${root}#organization` },
    publisher: { "@id": `${root}#organization` },
    inLanguage: "en",
  };
}

export function collectionPageJsonLd(args: {
  site: SiteLike;
  url: string;
  name: string;
  description: string;
}): JsonLd {
  const root = siteRoot(args.site);
  return {
    "@type": "CollectionPage",
    "@id": `${args.url}#collection`,
    url: args.url,
    name: args.name,
    description: args.description,
    isPartOf: { "@id": `${root}#website` },
    inLanguage: "en",
  };
}

export function itemListJsonLd(
  items: ReadonlyArray<{ name: string; path: string }>,
  site: SiteLike,
): JsonLd {
  return {
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path, site),
    })),
  };
}

export function jsonLdGraph(items: ReadonlyArray<JsonLd>): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": items,
  };
}
