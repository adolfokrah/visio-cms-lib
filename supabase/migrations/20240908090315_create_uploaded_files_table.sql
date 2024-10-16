CREATE TABLE
  public.uploaded_files (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    file_name TEXT,
    hashed_file_name TEXT,
    file_width numeric,
    file_height numeric,
    uploaded_at TIMESTAMP WITH TIME ZONE
  );