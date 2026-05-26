import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Lotus Pro Decks';
const SITE_URL  = 'https://lotusprodecks.com';
const DEFAULT_DESC = 'Expert-built Commander decks that are ready to play out of the box. Better than precons — handcrafted builds with pilot guides, upgrade paths, and full synergy breakdowns. Not mass-produced.';
const DEFAULT_IMAGE = `${SITE_URL}/images/og-default.png`;

export default function SEO({
  title,
  description = DEFAULT_DESC,
  image,
  path = '',
  type = 'website',
  jsonLd,
  noindex = false,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Expert-Built. Beginner-Ready.`;
  const canonical = `${SITE_URL}${path}`;
  const ogImage   = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:site_name"   content={SITE_NAME} />
      <meta property="og:type"        content={type} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image"       content={ogImage} />
      <meta property="og:url"         content={canonical} />

      {/* Twitter */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={ogImage} />

      {/* Structured data */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
