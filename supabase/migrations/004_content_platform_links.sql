-- Optional links to digital platforms for Music content (e.g. Spotify, Apple Music)
ALTER TABLE content_feed ADD COLUMN IF NOT EXISTS platform_links JSONB DEFAULT NULL;

COMMENT ON COLUMN content_feed.platform_links IS 'Array of { "name": "Spotify", "url": "https://..." } for Music category';
