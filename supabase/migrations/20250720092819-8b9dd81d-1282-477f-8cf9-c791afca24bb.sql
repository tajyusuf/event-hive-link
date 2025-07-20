-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(event_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE events 
  SET view_count = COALESCE(view_count, 0) + 1 
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql;