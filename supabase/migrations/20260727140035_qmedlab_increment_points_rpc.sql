/*
# Add increment_points RPC

Adds a stored procedure to atomically increment a user's points.
Used by the frontend after experiment completion.
*/

CREATE OR REPLACE FUNCTION public.increment_points(user_id uuid, pts integer)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET points = points + pts
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
