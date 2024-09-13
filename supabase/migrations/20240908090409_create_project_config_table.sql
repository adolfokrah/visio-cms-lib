CREATE TABLE
  project_configuration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    theme jsonb,
    global_blocks jsonb,
    scripts jsonb
  );