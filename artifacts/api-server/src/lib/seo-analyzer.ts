import { logger } from "./logger";

export interface SeoTagCheck {
  tag: string;
  value: string | null;
  status: "pass" | "warn" | "fail";
  message: string;
  recommendation: string | null;
}

export interface SeoScore {
  overall: number;
  general: number;
  openGraph: number;
  twitter: number;
}

export interface GooglePreview {
  title: string | null;
  description: string | null;
  url: string;
  favicon: string | null;
}

export interface OpenGraphPreview {
  title: string | null;
  description: string | null;
  image: string | null;
  url: string | null;
  siteName: string | null;
  type: string | null;
}

export interface TwitterPreview {
  card: string | null;
  title: string | null;
  description: string | null;
  image: string | null;
  site: string | null;
  creator: string | null;
}

export interface SeoAnalysisResult {
  url: string;
  fetchedAt: string;
  score: SeoScore;
  googlePreview: GooglePreview;
  openGraphPreview: OpenGraphPreview;
  twitterPreview: TwitterPreview;
  generalChecks: SeoTagCheck[];
  openGraphChecks: SeoTagCheck[];
  twitterChecks: SeoTagCheck[];
  technicalChecks: SeoTagCheck[];
  rawTags: Record<string, string>;
}

function extractMetaTags(html: string): Record<string, string> {
  const tags: Record<string, string> = {};

  const metaRegex =
    /<meta\s+([^>]+?)(?:\s*\/)?>/gi;
  let match;
  while ((match = metaRegex.exec(html)) !== null) {
    const attrs = match[1];

    const nameMatch =
      /name=["']([^"']+)["']/i.exec(attrs) ||
      /property=["']([^"']+)["']/i.exec(attrs) ||
      /http-equiv=["']([^"']+)["']/i.exec(attrs);
    const contentMatch = /content=["']([^"']*)["']/i.exec(attrs);

    if (nameMatch && contentMatch) {
      tags[nameMatch[1].toLowerCase()] = contentMatch[1];
    }
  }

  return tags;
}

function extractTitle(html: string): string | null {
  const match = /<title[^>]*>([^<]*)<\/title>/i.exec(html);
  return match ? match[1].trim() || null : null;
}

function extractCanonical(html: string): string | null {
  const match =
    /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i.exec(
      html,
    ) ||
    /<link[^>]+href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i.exec(
      html,
    );
  return match ? match[1] : null;
}

function extractRobots(html: string): string | null {
  const metaRobotsMatch =
    /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["'][^>]*>/i.exec(
      html,
    );
  return metaRobotsMatch ? metaRobotsMatch[1] : null;
}

function extractViewport(html: string): string | null {
  const match =
    /<meta[^>]+name=["']viewport["'][^>]+content=["']([^"']*)["'][^>]*>/i.exec(
      html,
    );
  return match ? match[1] : null;
}

function extractFavicon(html: string, baseUrl: string): string | null {
  const iconMatch =
    /<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>/i.exec(
      html,
    );
  if (iconMatch) {
    const href = iconMatch[1];
    if (href.startsWith("http")) return href;
    if (href.startsWith("//")) return `https:${href}`;
    try {
      const base = new URL(baseUrl);
      return new URL(href, base).href;
    } catch {
      return null;
    }
  }
  try {
    const base = new URL(baseUrl);
    return `${base.origin}/favicon.ico`;
  } catch {
    return null;
  }
}

function checkGeneralSeo(
  tags: Record<string, string>,
  title: string | null,
  canonical: string | null,
  robots: string | null,
  viewport: string | null,
): SeoTagCheck[] {
  const checks: SeoTagCheck[] = [];

  if (!title) {
    checks.push({
      tag: "title",
      value: null,
      status: "fail",
      message: "Title tag is missing",
      recommendation:
        "Add a unique, descriptive title tag between 50-60 characters",
    });
  } else if (title.length < 10) {
    checks.push({
      tag: "title",
      value: title,
      status: "warn",
      message: `Title is too short (${title.length} chars)`,
      recommendation: "Aim for 50-60 characters for best display in search results",
    });
  } else if (title.length > 60) {
    checks.push({
      tag: "title",
      value: title,
      status: "warn",
      message: `Title may be truncated in search results (${title.length} chars, ideal: 50-60)`,
      recommendation: "Keep title under 60 characters to avoid truncation in SERPs",
    });
  } else {
    checks.push({
      tag: "title",
      value: title,
      status: "pass",
      message: `Title length is optimal (${title.length} chars)`,
      recommendation: null,
    });
  }

  const desc = tags["description"] ?? null;
  if (!desc) {
    checks.push({
      tag: "description",
      value: null,
      status: "fail",
      message: "Meta description is missing",
      recommendation:
        "Add a compelling meta description between 120-160 characters",
    });
  } else if (desc.length < 70) {
    checks.push({
      tag: "description",
      value: desc,
      status: "warn",
      message: `Meta description is too short (${desc.length} chars, ideal: 120-160)`,
      recommendation: "Expand the description to at least 120 characters",
    });
  } else if (desc.length > 160) {
    checks.push({
      tag: "description",
      value: desc,
      status: "warn",
      message: `Meta description may be truncated (${desc.length} chars, ideal: 120-160)`,
      recommendation: "Keep description under 160 characters to avoid truncation",
    });
  } else {
    checks.push({
      tag: "description",
      value: desc,
      status: "pass",
      message: `Meta description length is optimal (${desc.length} chars)`,
      recommendation: null,
    });
  }

  if (!canonical) {
    checks.push({
      tag: "canonical",
      value: null,
      status: "warn",
      message: "Canonical URL is not specified",
      recommendation:
        'Add <link rel="canonical" href="..."> to prevent duplicate content issues',
    });
  } else {
    checks.push({
      tag: "canonical",
      value: canonical,
      status: "pass",
      message: "Canonical URL is specified",
      recommendation: null,
    });
  }

  if (!viewport) {
    checks.push({
      tag: "viewport",
      value: null,
      status: "fail",
      message: "Viewport meta tag is missing",
      recommendation:
        'Add <meta name="viewport" content="width=device-width, initial-scale=1"> for mobile-friendliness',
    });
  } else {
    checks.push({
      tag: "viewport",
      value: viewport,
      status: "pass",
      message: "Viewport meta tag is present",
      recommendation: null,
    });
  }

  if (robots) {
    const isBlocked =
      robots.includes("noindex") || robots.includes("nofollow");
    checks.push({
      tag: "robots",
      value: robots,
      status: isBlocked ? "warn" : "pass",
      message: isBlocked
        ? "Robots meta tag contains restrictive directives"
        : "Robots meta tag looks good",
      recommendation: isBlocked
        ? "Ensure noindex/nofollow is intentional — this limits search engine visibility"
        : null,
    });
  } else {
    checks.push({
      tag: "robots",
      value: null,
      status: "pass",
      message: "No robots meta tag (defaults to index, follow)",
      recommendation: null,
    });
  }

  const charset =
    /<meta[^>]+charset=["']?([^"'\s>]+)/i.exec("") !== null ? "utf-8" : null;
  checks.push({
    tag: "charset",
    value: charset,
    status: charset ? "pass" : "warn",
    message: charset ? "Charset is declared" : "Charset declaration not found",
    recommendation: charset
      ? null
      : 'Add <meta charset="UTF-8"> near the top of <head>',
  });

  return checks;
}

function checkOpenGraph(
  tags: Record<string, string>,
): SeoTagCheck[] {
  const checks: SeoTagCheck[] = [];

  const ogTitle = tags["og:title"] ?? null;
  if (!ogTitle) {
    checks.push({
      tag: "og:title",
      value: null,
      status: "fail",
      message: "og:title is missing — required for social sharing previews",
      recommendation: "Add <meta property=\"og:title\" content=\"Your Title\">",
    });
  } else if (ogTitle.length > 95) {
    checks.push({
      tag: "og:title",
      value: ogTitle,
      status: "warn",
      message: `og:title is long (${ogTitle.length} chars) — may be truncated on Facebook`,
      recommendation: "Keep og:title under 95 characters",
    });
  } else {
    checks.push({
      tag: "og:title",
      value: ogTitle,
      status: "pass",
      message: "og:title is present and well-formed",
      recommendation: null,
    });
  }

  const ogDesc = tags["og:description"] ?? null;
  if (!ogDesc) {
    checks.push({
      tag: "og:description",
      value: null,
      status: "fail",
      message: "og:description is missing",
      recommendation: "Add <meta property=\"og:description\" content=\"...\">",
    });
  } else if (ogDesc.length > 200) {
    checks.push({
      tag: "og:description",
      value: ogDesc,
      status: "warn",
      message: `og:description may be truncated (${ogDesc.length} chars)`,
      recommendation: "Keep og:description under 200 characters",
    });
  } else {
    checks.push({
      tag: "og:description",
      value: ogDesc,
      status: "pass",
      message: "og:description is present",
      recommendation: null,
    });
  }

  const ogImage = tags["og:image"] ?? null;
  if (!ogImage) {
    checks.push({
      tag: "og:image",
      value: null,
      status: "fail",
      message: "og:image is missing — images greatly increase click-through rate",
      recommendation:
        "Add <meta property=\"og:image\" content=\"https://...\"> with a 1200x630px image",
    });
  } else {
    checks.push({
      tag: "og:image",
      value: ogImage,
      status: "pass",
      message: "og:image is present",
      recommendation: null,
    });
  }

  const ogUrl = tags["og:url"] ?? null;
  if (!ogUrl) {
    checks.push({
      tag: "og:url",
      value: null,
      status: "warn",
      message: "og:url is missing",
      recommendation:
        "Add <meta property=\"og:url\" content=\"https://...\"> with the canonical URL",
    });
  } else {
    checks.push({
      tag: "og:url",
      value: ogUrl,
      status: "pass",
      message: "og:url is present",
      recommendation: null,
    });
  }

  const ogType = tags["og:type"] ?? null;
  if (!ogType) {
    checks.push({
      tag: "og:type",
      value: null,
      status: "warn",
      message: "og:type is missing (defaults to website)",
      recommendation:
        'Add <meta property="og:type" content="website"> or appropriate type',
    });
  } else {
    checks.push({
      tag: "og:type",
      value: ogType,
      status: "pass",
      message: `og:type is set to "${ogType}"`,
      recommendation: null,
    });
  }

  const ogSiteName = tags["og:site_name"] ?? null;
  checks.push({
    tag: "og:site_name",
    value: ogSiteName,
    status: ogSiteName ? "pass" : "warn",
    message: ogSiteName
      ? `og:site_name is set to "${ogSiteName}"`
      : "og:site_name is missing",
    recommendation: ogSiteName
      ? null
      : 'Add <meta property="og:site_name" content="Your Brand">',
  });

  const ogImageWidth = tags["og:image:width"] ?? null;
  const ogImageHeight = tags["og:image:height"] ?? null;
  if (ogImage && (!ogImageWidth || !ogImageHeight)) {
    checks.push({
      tag: "og:image:width/height",
      value: ogImageWidth && ogImageHeight ? `${ogImageWidth}x${ogImageHeight}` : null,
      status: "warn",
      message: "og:image dimensions are not specified",
      recommendation:
        'Add <meta property="og:image:width" content="1200"> and og:image:height for faster rendering',
    });
  } else if (ogImage) {
    checks.push({
      tag: "og:image:width/height",
      value: `${ogImageWidth}x${ogImageHeight}`,
      status: "pass",
      message: "og:image dimensions are specified",
      recommendation: null,
    });
  }

  return checks;
}

function checkTwitterCards(tags: Record<string, string>): SeoTagCheck[] {
  const checks: SeoTagCheck[] = [];

  const card = tags["twitter:card"] ?? null;
  if (!card) {
    checks.push({
      tag: "twitter:card",
      value: null,
      status: "fail",
      message: "twitter:card is missing — required for Twitter/X previews",
      recommendation:
        'Add <meta name="twitter:card" content="summary_large_image">',
    });
  } else {
    const validCards = ["summary", "summary_large_image", "app", "player"];
    checks.push({
      tag: "twitter:card",
      value: card,
      status: validCards.includes(card) ? "pass" : "warn",
      message: validCards.includes(card)
        ? `twitter:card is set to "${card}"`
        : `twitter:card value "${card}" is not standard`,
      recommendation: validCards.includes(card)
        ? null
        : 'Use one of: summary, summary_large_image, app, player',
    });
  }

  const twTitle = tags["twitter:title"] ?? null;
  if (!twTitle) {
    checks.push({
      tag: "twitter:title",
      value: null,
      status: "warn",
      message: "twitter:title is missing (will fall back to og:title)",
      recommendation:
        'Add <meta name="twitter:title" content="..."> for Twitter-specific title',
    });
  } else if (twTitle.length > 70) {
    checks.push({
      tag: "twitter:title",
      value: twTitle,
      status: "warn",
      message: `twitter:title may be truncated (${twTitle.length} chars, ideal: ≤70)`,
      recommendation: "Keep twitter:title under 70 characters",
    });
  } else {
    checks.push({
      tag: "twitter:title",
      value: twTitle,
      status: "pass",
      message: "twitter:title is present",
      recommendation: null,
    });
  }

  const twDesc = tags["twitter:description"] ?? null;
  if (!twDesc) {
    checks.push({
      tag: "twitter:description",
      value: null,
      status: "warn",
      message: "twitter:description is missing (will fall back to og:description)",
      recommendation:
        'Add <meta name="twitter:description" content="...">',
    });
  } else {
    checks.push({
      tag: "twitter:description",
      value: twDesc,
      status: "pass",
      message: "twitter:description is present",
      recommendation: null,
    });
  }

  const twImage = tags["twitter:image"] ?? null;
  if (!twImage) {
    checks.push({
      tag: "twitter:image",
      value: null,
      status: "warn",
      message: "twitter:image is missing (will fall back to og:image)",
      recommendation:
        'Add <meta name="twitter:image" content="https://..."> for Twitter-specific image',
    });
  } else {
    checks.push({
      tag: "twitter:image",
      value: twImage,
      status: "pass",
      message: "twitter:image is present",
      recommendation: null,
    });
  }

  const twSite = tags["twitter:site"] ?? null;
  checks.push({
    tag: "twitter:site",
    value: twSite,
    status: twSite ? "pass" : "warn",
    message: twSite
      ? `twitter:site is set to "${twSite}"`
      : "twitter:site is missing",
    recommendation: twSite
      ? null
      : 'Add <meta name="twitter:site" content="@yourhandle"> for brand attribution',
  });

  const twCreator = tags["twitter:creator"] ?? null;
  checks.push({
    tag: "twitter:creator",
    value: twCreator,
    status: twCreator ? "pass" : "warn",
    message: twCreator
      ? `twitter:creator is "${twCreator}"`
      : "twitter:creator is not set",
    recommendation: twCreator
      ? null
      : 'Optionally add <meta name="twitter:creator" content="@author">',
  });

  return checks;
}

function checkTechnical(
  html: string,
  tags: Record<string, string>,
  url: string,
): SeoTagCheck[] {
  const checks: SeoTagCheck[] = [];

  const isHttps = url.startsWith("https://");
  checks.push({
    tag: "https",
    value: isHttps ? "yes" : "no",
    status: isHttps ? "pass" : "fail",
    message: isHttps
      ? "Site is served over HTTPS"
      : "Site is not served over HTTPS",
    recommendation: isHttps
      ? null
      : "Enable HTTPS — required for SEO and security",
  });

  const hasCharset = /<meta[^>]+charset/i.test(html);
  checks.push({
    tag: "charset",
    value: hasCharset ? "UTF-8" : null,
    status: hasCharset ? "pass" : "warn",
    message: hasCharset
      ? "Character encoding is declared"
      : "Character encoding declaration not found",
    recommendation: hasCharset ? null : 'Add <meta charset="UTF-8"> to <head>',
  });

  const lang = /<html[^>]+lang=["']([^"']+)["']/i.exec(html);
  checks.push({
    tag: "html lang",
    value: lang ? lang[1] : null,
    status: lang ? "pass" : "warn",
    message: lang
      ? `HTML lang attribute is set to "${lang[1]}"`
      : "HTML lang attribute is missing",
    recommendation: lang
      ? null
      : 'Add lang attribute to <html> tag, e.g. <html lang="en">',
  });

  const hasStructuredData =
    /<script[^>]+type=["']application\/ld\+json["']/i.test(html);
  checks.push({
    tag: "structured data (JSON-LD)",
    value: hasStructuredData ? "present" : null,
    status: hasStructuredData ? "pass" : "warn",
    message: hasStructuredData
      ? "JSON-LD structured data is present"
      : "No JSON-LD structured data found",
    recommendation: hasStructuredData
      ? null
      : "Consider adding JSON-LD structured data for rich results (Schema.org)",
  });

  const hasH1 = /<h1[^>]*>/i.test(html);
  checks.push({
    tag: "h1 tag",
    value: hasH1 ? "present" : null,
    status: hasH1 ? "pass" : "warn",
    message: hasH1 ? "H1 tag is present" : "No H1 tag found on the page",
    recommendation: hasH1
      ? null
      : "Add a single H1 tag that contains your primary keyword",
  });

  const imgWithoutAlt = (html.match(/<img(?![^>]*alt=)/gi) || []).length;
  checks.push({
    tag: "image alt attributes",
    value: imgWithoutAlt > 0 ? `${imgWithoutAlt} images missing alt` : "all present",
    status: imgWithoutAlt > 0 ? "warn" : "pass",
    message:
      imgWithoutAlt > 0
        ? `${imgWithoutAlt} image(s) are missing alt attributes`
        : "All images have alt attributes",
    recommendation:
      imgWithoutAlt > 0
        ? "Add descriptive alt attributes to all images for accessibility and SEO"
        : null,
  });

  return checks;
}

function calculateScore(checks: SeoTagCheck[]): number {
  if (checks.length === 0) return 100;
  let score = 0;
  for (const c of checks) {
    if (c.status === "pass") score += 1;
    else if (c.status === "warn") score += 0.5;
  }
  return Math.round((score / checks.length) * 100);
}

export async function analyzeSeo(url: string): Promise<SeoAnalysisResult> {
  logger.info({ url }, "Fetching URL for SEO analysis");

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error("Invalid URL provided");
  }

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; SEOInspector/1.0; +https://seoinspector.app)",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch URL: ${response.status} ${response.statusText}`,
    );
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
    throw new Error(`URL does not return HTML content (got: ${contentType})`);
  }

  const html = await response.text();
  const tags = extractMetaTags(html);
  const title = extractTitle(html);
  const canonical = extractCanonical(html);
  const robots = extractRobots(html);
  const viewport = extractViewport(html);
  const favicon = extractFavicon(html, url);

  const generalChecks = checkGeneralSeo(tags, title, canonical, robots, viewport);
  const openGraphChecks = checkOpenGraph(tags);
  const twitterChecks = checkTwitterCards(tags);
  const technicalChecks = checkTechnical(html, tags, url);

  const generalScore = calculateScore(generalChecks);
  const openGraphScore = calculateScore(openGraphChecks);
  const twitterScore = calculateScore(twitterChecks);
  const technicalScore = calculateScore(technicalChecks);

  const allChecks = [
    ...generalChecks,
    ...openGraphChecks,
    ...twitterChecks,
    ...technicalChecks,
  ];
  const overallScore = calculateScore(allChecks);

  const googlePreview: GooglePreview = {
    title: title ?? tags["og:title"] ?? null,
    description: tags["description"] ?? tags["og:description"] ?? null,
    url: canonical ?? url,
    favicon,
  };

  const openGraphPreview: OpenGraphPreview = {
    title: tags["og:title"] ?? title ?? null,
    description: tags["og:description"] ?? tags["description"] ?? null,
    image: tags["og:image"] ?? null,
    url: tags["og:url"] ?? url,
    siteName: tags["og:site_name"] ?? null,
    type: tags["og:type"] ?? null,
  };

  const twitterPreview: TwitterPreview = {
    card: tags["twitter:card"] ?? null,
    title: tags["twitter:title"] ?? tags["og:title"] ?? title ?? null,
    description:
      tags["twitter:description"] ?? tags["og:description"] ?? tags["description"] ?? null,
    image: tags["twitter:image"] ?? tags["og:image"] ?? null,
    site: tags["twitter:site"] ?? null,
    creator: tags["twitter:creator"] ?? null,
  };

  return {
    url,
    fetchedAt: new Date().toISOString(),
    score: {
      overall: overallScore,
      general: generalScore,
      openGraph: openGraphScore,
      twitter: twitterScore,
    },
    googlePreview,
    openGraphPreview,
    twitterPreview,
    generalChecks,
    openGraphChecks,
    twitterChecks,
    technicalChecks,
    rawTags: tags,
  };
}
