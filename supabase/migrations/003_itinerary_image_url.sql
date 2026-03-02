-- Add optional image for itinerary events (e.g. poster/cover)
ALTER TABLE itinerary ADD COLUMN IF NOT EXISTS image_url TEXT;
