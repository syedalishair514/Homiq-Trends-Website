-- Homiq Trends Relational Database Schema Migration Script

-- Helper to automatically update updated_at timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- 1. Profiles Table (Linked to Supabase Auth users)
create table public.profiles (
    id uuid primary key references auth.users on delete cascade,
    updated_at timestamp with time zone,
    username text unique,
    full_name text,
    avatar_url text,
    phone text,
    birthday date,
    location text
);

alter table public.profiles enable row level security;

-- 2. Categories Table
create table public.categories (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    description text,
    image_url text,
    created_at timestamp with time zone default now()
);

alter table public.categories enable row level security;

-- 3. Products Table
create table public.products (
    id uuid primary key default gen_random_uuid(),
    category text not null default 'Decoration',
    name text not null,
    slug text not null unique,
    description text not null,
    short_description text,
    price decimal(10,2) not null,
    sale_price decimal(10,2),
    sku text not null unique,
    stock integer not null default 0,
    rating decimal(3,2) default 5.00,
    reviews_count integer default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

alter table public.products enable row level security;
create trigger update_products_updated_at before update on public.products
    for each row execute procedure update_updated_at_column();

-- 4. Product Images Table (Multi-image support)
create table public.product_images (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references public.products on delete cascade,
    image_url text not null,
    priority integer default 0,
    created_at timestamp with time zone default now()
);

alter table public.product_images enable row level security;

-- 5. Addresses Table (User shipping addresses)
create table public.addresses (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles on delete cascade,
    full_name text not null,
    address_line1 text not null,
    address_line2 text,
    city text not null,
    state text not null,
    postal_code text not null,
    country text not null,
    phone text,
    is_default boolean default false,
    created_at timestamp with time zone default now()
);

alter table public.addresses enable row level security;

-- 6. Orders Table
create table public.orders (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles on delete set null,
    status text not null default 'placed',
    total decimal(10,2) not null,
    tax decimal(10,2) not null default 0.00,
    shipping decimal(10,2) not null default 0.00,
    discount decimal(10,2) not null default 0.00,
    address_id uuid references public.addresses on delete set null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

alter table public.orders enable row level security;
create trigger update_orders_updated_at before update on public.orders
    for each row execute procedure update_updated_at_column();

-- 7. Order Items Table
create table public.order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references public.orders on delete cascade,
    product_id uuid references public.products on delete set null,
    quantity integer not null check (quantity > 0),
    price decimal(10,2) not null,
    created_at timestamp with time zone default now()
);

alter table public.order_items enable row level security;

-- 8. Cart Items Table (Realtime cart storage)
create table public.cart_items (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles on delete cascade,
    product_id uuid not null references public.products on delete cascade,
    quantity integer not null default 1 check (quantity > 0),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique(user_id, product_id)
);

alter table public.cart_items enable row level security;
create trigger update_cart_items_updated_at before update on public.cart_items
    for each row execute procedure update_updated_at_column();

-- 9. Wishlist Items Table
create table public.wishlist_items (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles on delete cascade,
    product_id uuid not null references public.products on delete cascade,
    created_at timestamp with time zone default now(),
    unique(user_id, product_id)
);

alter table public.wishlist_items enable row level security;

-- 10. Reviews Table
create table public.reviews (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references public.products on delete cascade,
    user_id uuid references public.profiles on delete set null,
    rating integer not null check (rating >= 1 and rating <= 5),
    comment text,
    status text not null default 'pending',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

alter table public.reviews enable row level security;
create trigger update_reviews_updated_at before update on public.reviews
    for each row execute procedure update_updated_at_column();

-- 11. Hero Banners Table
create table public.hero_banners (
    id uuid primary key default gen_random_uuid(),
    heading text not null,
    cta_text text,
    cta_link text,
    priority integer default 0,
    image_url text not null,
    starts_at timestamp with time zone,
    ends_at timestamp with time zone,
    status text not null default 'active',
    created_at timestamp with time zone default now()
);

alter table public.hero_banners enable row level security;

-- 12. Announcements Table
create table public.announcements (
    id uuid primary key default gen_random_uuid(),
    text text not null,
    starts_at timestamp with time zone,
    ends_at timestamp with time zone,
    status text not null default 'active',
    created_at timestamp with time zone default now()
);

alter table public.announcements enable row level security;

-- 13. Coupons Table
create table public.coupons (
    id uuid primary key default gen_random_uuid(),
    code text not null unique,
    discount_percent integer not null check (discount_percent > 0 and discount_percent <= 100),
    max_redemptions integer,
    status text not null default 'active',
    expires_at timestamp with time zone,
    created_at timestamp with time zone default now()
);

alter table public.coupons enable row level security;

-- 14. Coupon Usage Table
create table public.coupon_usage (
    id uuid primary key default gen_random_uuid(),
    coupon_id uuid not null references public.coupons on delete cascade,
    user_id uuid not null references public.profiles on delete cascade,
    order_id uuid not null references public.orders on delete cascade,
    created_at timestamp with time zone default now()
);

alter table public.coupon_usage enable row level security;

-- 15. Notifications Table
create table public.notifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles on delete cascade,
    title text not null,
    content text not null,
    is_read boolean default false,
    type text not null default 'system',
    created_at timestamp with time zone default now()
);

alter table public.notifications enable row level security;

-- 16. Settings Table (Store wide metadata config)
create table public.settings (
    id uuid primary key default gen_random_uuid(),
    key text not null unique,
    value jsonb not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

alter table public.settings enable row level security;
create trigger update_settings_updated_at before update on public.settings
    for each row execute procedure update_updated_at_column();

-- 17. Admins Table
create table public.admins (
    id uuid primary key references auth.users on delete cascade,
    role text not null default 'manager',
    created_at timestamp with time zone default now()
);

alter table public.admins enable row level security;


------------------ INDEXES ------------------
create index idx_products_slug on public.products(slug);
create index idx_categories_slug on public.categories(slug);
create index idx_orders_user on public.orders(user_id);
create index idx_cart_items_user on public.cart_items(user_id);
create index idx_wishlist_items_user on public.wishlist_items(user_id);
create index idx_reviews_product on public.reviews(product_id);
create index idx_addresses_user on public.addresses(user_id);


------------------ TRIGGERS ON USER SIGNUP ------------------
-- Link auth.users inserts to profiles table automatically
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, full_name, avatar_url, phone)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', ''),
        coalesce(new.raw_user_meta_data->>'avatar_url', ''),
        coalesce(new.phone, '')
    );
    return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();


------------------ ROW LEVEL SECURITY (RLS) POLICIES ------------------

-- 1. Profiles RLS
create policy "Public profiles are readable by everyone" on public.profiles
    for select using (true);

create policy "Users can update their own profiles" on public.profiles
    for update using (auth.uid() = id);

-- 2. Categories RLS
create policy "Categories are readable by everyone" on public.categories
    for select using (true);

create policy "Admins can insert categories" on public.categories
    for insert with check (exists (select 1 from public.admins where id = auth.uid()));

create policy "Admins can update categories" on public.categories
    for update using (exists (select 1 from public.admins where id = auth.uid()));

create policy "Admins can delete categories" on public.categories
    for delete using (exists (select 1 from public.admins where id = auth.uid()));

-- 3. Products RLS
create policy "Products are readable by everyone" on public.products
    for select using (true);

create policy "Admins can modify products" on public.products
    for all using (exists (select 1 from public.admins where id = auth.uid()));

-- 4. Product Images RLS
create policy "Product images are readable by everyone" on public.product_images
    for select using (true);

create policy "Admins can modify product images" on public.product_images
    for all using (exists (select 1 from public.admins where id = auth.uid()));

-- 5. Addresses RLS
create policy "Users can view their own addresses" on public.addresses
    for select using (auth.uid() = user_id);

create policy "Users can modify their own addresses" on public.addresses
    for all using (auth.uid() = user_id);

-- 6. Orders RLS
create policy "Users can view their own orders" on public.orders
    for select using (auth.uid() = user_id);

create policy "Users can create their own orders" on public.orders
    for insert with check (auth.uid() = user_id);

create policy "Admins can view and update all orders" on public.orders
    for all using (exists (select 1 from public.admins where id = auth.uid()));

-- 7. Order Items RLS
create policy "Users can view their own order items" on public.order_items
    for select using (exists (
        select 1 from public.orders where id = order_id and user_id = auth.uid()
    ));

create policy "Admins can manage all order items" on public.order_items
    for all using (exists (select 1 from public.admins where id = auth.uid()));

-- 8. Cart Items RLS
create policy "Users can manage their own cart" on public.cart_items
    for all using (auth.uid() = user_id);

-- 9. Wishlist Items RLS
create policy "Users can manage their own wishlist" on public.wishlist_items
    for all using (auth.uid() = user_id);

-- 10. Reviews RLS
create policy "Reviews are readable by everyone" on public.reviews
    for select using (true);

create policy "Users can create reviews" on public.reviews
    for insert with check (auth.uid() = user_id);

create policy "Users can modify their own reviews" on public.reviews
    for update using (auth.uid() = user_id);

create policy "Admins can manage all reviews" on public.reviews
    for all using (exists (select 1 from public.admins where id = auth.uid()));

-- 11. Hero Banners RLS
create policy "Active banners are visible by everyone" on public.hero_banners
    for select using (true);

create policy "Admins can manage banners" on public.hero_banners
    for all using (exists (select 1 from public.admins where id = auth.uid()));

-- 12. Announcements RLS
create policy "Announcements are readable by everyone" on public.announcements
    for select using (true);

create policy "Admins can manage announcements" on public.announcements
    for all using (exists (select 1 from public.admins where id = auth.uid()));

-- 13. Coupons RLS
create policy "Only admins or logged-in users can select coupons" on public.coupons
    for select using (auth.role() = 'authenticated');

create policy "Admins can manage coupons" on public.coupons
    for all using (exists (select 1 from public.admins where id = auth.uid()));

-- 14. Coupon Usage RLS
create policy "Users can select their own coupon usage details" on public.coupon_usage
    for select using (auth.uid() = user_id);

-- 15. Notifications RLS
create policy "Users can manage their own notifications" on public.notifications
    for all using (auth.uid() = user_id);

-- 16. Settings RLS
create policy "Settings are readable by everyone" on public.settings
    for select using (true);

create policy "Admins can modify settings" on public.settings
    for all using (exists (select 1 from public.admins where id = auth.uid()));

-- 17. Admins RLS
create policy "Admins check is public readable" on public.admins
    for select using (true);
