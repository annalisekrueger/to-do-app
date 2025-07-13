-- Drop foreign key constraint first
alter table public.tasks drop constraint if exists tasks_category_id_fkey;

-- Drop old tables (no data to preserve)
drop table if exists public.task_categories;
drop table if exists public.life_categories;

-- Create new simplified categories table
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type text not null
);

-- Update tasks table to reference new categories table
alter table public.tasks add constraint tasks_category_id_fkey 
  foreign key (category_id) references public.categories(id);
