alter table public.tasks add column category_id uuid references task_categories(id);
alter table public.tasks add column reminder text;
alter table public.tasks add column created_at timestamp without time zone default now();