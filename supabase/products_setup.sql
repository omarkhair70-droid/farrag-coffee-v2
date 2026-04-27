-- Products table for Farrag Coffee V2 admin product management
create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null,
  type text not null,
  weight text not null,
  price numeric not null check (price >= 0),
  description text not null,
  image text null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

alter table public.products enable row level security;

-- Public read-only active products
drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
using (is_active = true);

-- Seed existing static products while preserving IDs
insert into public.products (id, name, category, type, weight, price, description, image, is_active, sort_order)
values
  ('brazilian-plain', 'برازيلي سادة', 'قهوة برازيلي', 'سادة', '250 جم', 60, 'تحميص متوسط بنكهة متوازنة وقوام ناعم مناسب للقهوة اليومية.', '/images/product-sada.jpeg', true, 0),
  ('brazilian-blend', 'برازيلي محوج', 'قهوة برازيلي', 'محوج', '250 جم', 60, 'خلطة برازيلي محوجة بعطر غني ولمسة بهارات دافئة.', '/images/product-mahmoog.jpeg', true, 1),
  ('turkish-plain', 'تركي سادة', 'قهوة تركي', 'سادة', '250 جم', 50, 'قهوة تركي سادة بطحن ناعم وقوام مركز لعشاق المذاق الصافي.', '/images/product-sada.jpeg', true, 2),
  ('turkish-blend', 'تركي محوج', 'قهوة تركي', 'محوج', '250 جم', 50, 'قهوة تركي محوجة بطابع شرقي فاخر ورائحة مميزة.', '/images/product-mahmoog.jpeg', true, 3),
  ('yemeni-plain', 'يمني سادة', 'قهوة يمني', 'سادة', '250 جم', 80, 'بن يمني فاخر بنغمات عميقة وحموضة خفيفة متوازنة.', '/images/product-sada.jpeg', true, 4),
  ('yemeni-blend', 'يمني محوج', 'قهوة يمني', 'محوج', '250 جم', 85, 'خلطة يمني محوجة بنكهة قوية وعمق واضح في كل فنجان.', '/images/product-mahmoog.jpeg', true, 5),
  ('espresso', 'إسبريسو', 'قهوة إسبريسو', 'محمص', '1000 جم', 300, 'حبوب إسبريسو احترافية بكريمة ثابتة ونكهة شوكولاتة مكثفة.', '/images/product-mahmoog.jpeg', true, 6)
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  type = excluded.type,
  weight = excluded.weight,
  price = excluded.price,
  description = excluded.description,
  image = excluded.image,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
