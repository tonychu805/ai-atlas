-- Activate AI Atlas data layer.
-- Reshapes the existing tables to faithfully store the app's Product/Supplier
-- shape (see src/lib/data.ts) so a single `select *` rebuilds a ready object.
-- Variable / nested parts (attrs, specs, bom, supply, rels) live in JSONB;
-- the product_suppliers + product_relationships edge tables are dual-written by
-- the ETL for future relational/graph queries.

-- ── products ────────────────────────────────────────────────────────────────
alter table public.products
  add column if not exists sub   text,
  add column if not exists attrs jsonb not null default '{}'::jsonb,
  add column if not exists rels  jsonb not null default '[]'::jsonb;

-- data.ts uses year-month strings ("2026-05"), not full dates.
alter table public.products
  alter column last_verified type text using last_verified::text;

-- bom is null for products without a cost decomposition.
alter table public.products
  alter column bom drop not null;

-- ── suppliers ───────────────────────────────────────────────────────────────
alter table public.suppliers
  add column if not exists models text[] not null default '{}'::text[];

-- ── public read access (this is a read-only public atlas) ─────────────────────
-- RLS stays enabled; anon/authenticated may SELECT, nobody may write via the
-- client. Seeding happens out-of-band (ETL via the management connection).
do $$
declare t text;
begin
  foreach t in array array[
    'products','suppliers','sources','product_suppliers','product_relationships'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists %I on public.%I', t || '_public_read', t);
    execute format(
      'create policy %I on public.%I for select to anon, authenticated using (true)',
      t || '_public_read', t
    );
  end loop;
end $$;
