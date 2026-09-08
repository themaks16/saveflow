create table if not exists public.recurring_expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  amount numeric not null check (amount > 0),
  category text not null default 'Other',
  payment_method text not null default 'card' check (payment_method in ('cash','card')),
  frequency text not null default 'monthly' check (frequency in ('weekly','monthly','yearly')),
  next_date date not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists recurring_expenses_user_id_idx on public.recurring_expenses(user_id);
create index if not exists recurring_expenses_next_date_idx on public.recurring_expenses(user_id,next_date);

alter table public.recurring_expenses enable row level security;

drop policy if exists "recurring_select_own" on public.recurring_expenses;
drop policy if exists "recurring_insert_own" on public.recurring_expenses;
drop policy if exists "recurring_update_own" on public.recurring_expenses;
drop policy if exists "recurring_delete_own" on public.recurring_expenses;

create policy "recurring_select_own" on public.recurring_expenses for select using (auth.uid() = user_id);
create policy "recurring_insert_own" on public.recurring_expenses for insert with check (auth.uid() = user_id);
create policy "recurring_update_own" on public.recurring_expenses for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "recurring_delete_own" on public.recurring_expenses for delete using (auth.uid() = user_id);

grant select, insert, update, delete on public.recurring_expenses to authenticated;
