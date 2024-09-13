CREATE OR REPLACE FUNCTION verify_password(password text)
RETURNS BOOLEAN SECURITY DEFINER AS
$$
BEGIN
  RETURN EXISTS (
    SELECT id 
    FROM auth.users 
    WHERE id = auth.uid() AND encrypted_password = crypt(password::text, auth.users.encrypted_password)
  );
END;
$$ LANGUAGE plpgsql;