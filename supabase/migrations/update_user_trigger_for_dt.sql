-- Update the function to assign roles based on user count
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count INT;
  assigned_role user_role;
BEGIN
  SELECT count(*) INTO user_count FROM auth.users;

  IF user_count = 1 THEN
    assigned_role := 'dt';
  ELSIF user_count = 2 THEN
    assigned_role := 'super_admin';
  ELSE
    assigned_role := 'player';
  END IF;

  INSERT INTO public.profiles (id, username, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    assigned_role
  );
  RETURN NEW;
END;
$$;
