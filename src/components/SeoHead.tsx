import { Helmet } from "react-helmet-async";
import { SEO_CONFIG, absoluteUrl } from "@/config/seo";

export interface SeoHeadProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  noindex?: boolean;
  /** Optional JSON-LD object or array (e.g. Article, BreadcrumbList) */
  jsonLd?: object | object[];
}

export default function SeoHead({
  title,
  description,
  canonicalPath = "",
  ogImage,
  noindex = false,
  jsonLd,
}: SeoHeadProps) {
  const siteTitle = SEO_CONFIG.defaultTitle;
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const desc = description ?? SEO_CONFIG.defaultDescription;
  const canonical = absoluteUrl(canonicalPath || "/");
  const image = ogImage?.startsWith("http") ? ogImage : absoluteUrl(ogImage || SEO_CONFIG.defaultOgImage);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content={SEO_CONFIG.locale} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SEO_CONFIG.twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
