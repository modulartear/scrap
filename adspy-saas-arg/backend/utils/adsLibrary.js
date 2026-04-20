/**
 * Facebook Ads Library URL generator for Argentina
 */

const generateFalUrl = (query) => {
  const params = new URLSearchParams({
    active_status: 'all',
    ad_type: 'all',
    country: 'AR',
    q: query,
    search_type: 'keyword_unordered',
    media_type: 'all'
  });
  
  return `https://www.facebook.com/ads/library/?${params.toString()}`;
};

const generateFalDomainUrl = (domain) => {
  return generateFalUrl(domain);
};

module.exports = { generateFalUrl, generateFalDomainUrl };

