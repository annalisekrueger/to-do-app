-- Disable Row Level Security for personal app (no authentication needed)
alter table public.tasks disable row level security;
alter table public.categories disable row level security;
