-- 1. Add university column to profiles table
alter table public.profiles 
add column if not exists university text;

-- 2. Update the handle_new_user function to include university
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id, 
    email, 
    first_name, 
    last_name,
    profession_title,
    team_affiliation,
    cohort_year,
    bio,
    linkedin_url,
    phone_number,
    university
  )
  values (
    new.id, 
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'profession_title',
    new.raw_user_meta_data->>'team_affiliation',
    new.raw_user_meta_data->>'cohort_year',
    new.raw_user_meta_data->>'bio',
    new.raw_user_meta_data->>'linkedin_url',
    new.raw_user_meta_data->>'phone_number',
    new.raw_user_meta_data->>'university'
  );
  return new;
end;
$$ language plpgsql security definer;
