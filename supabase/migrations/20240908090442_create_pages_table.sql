CREATE TABLE
  pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    author UUID NOT NULL REFERENCES users (id),
    status jsonb,
    tags TEXT,
    seo jsonb,
    blocks_dev jsonb,
    blocks jsonb,
    folder_id UUID REFERENCES folders (id),
    publish_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );