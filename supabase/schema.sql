-- ----------------------------------------------------
-- ANTIGRAVITY PLATFORM DATABASE SCHEMA DDL
-- ----------------------------------------------------

-- Clean up existing (for testing/resetting if needed)
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- DROP FUNCTION IF EXISTS public.handle_new_user();

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------
-- 1. CATEGORIES TABLE
-- ----------------------------------------------------
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexing for categories slug
CREATE INDEX idx_categories_slug ON public.categories(slug);

-- ----------------------------------------------------
-- 2. PROFILES TABLE (Linked to Supabase Auth Users)
-- ----------------------------------------------------
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name VARCHAR(150),
    avatar_url TEXT,
    is_admin BOOLEAN DEFAULT FALSE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexing for user roles
CREATE INDEX idx_profiles_is_admin ON public.profiles(is_admin);

-- ----------------------------------------------------
-- 3. PRODUCTS TABLE (Book / Literary Catalog)
-- ----------------------------------------------------
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CONSTRAINT positive_price CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CONSTRAINT positive_stock CHECK (stock >= 0),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    theme_tags TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    images TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Indexing for catalog search and filters
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_genre ON public.products(genre);

-- ----------------------------------------------------
-- 4. DISCOUNT CODES TABLE
-- ----------------------------------------------------
CREATE TABLE public.discount_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL CONSTRAINT valid_discount_type CHECK (type IN ('percentage', 'fixed')),
    value NUMERIC(10, 2) NOT NULL CONSTRAINT positive_value CHECK (value > 0),
    active BOOLEAN DEFAULT TRUE NOT NULL,
    max_uses INTEGER,
    uses_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_discount_codes_code ON public.discount_codes(code);

-- ----------------------------------------------------
-- 5. ORDERS TABLE
-- ----------------------------------------------------
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'pending'::character varying NOT NULL CONSTRAINT valid_order_status CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled')),
    subtotal NUMERIC(10, 2) NOT NULL,
    discount_code_id UUID REFERENCES public.discount_codes(id) ON DELETE SET NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    tax NUMERIC(10, 2) NOT NULL,
    shipping NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    shipping_address_line1 VARCHAR(255) NOT NULL,
    shipping_address_line2 VARCHAR(255),
    shipping_city VARCHAR(100) NOT NULL,
    shipping_state VARCHAR(100) NOT NULL,
    shipping_postal_code VARCHAR(20) NOT NULL,
    shipping_country VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);

-- ----------------------------------------------------
-- 6. ORDER ITEMS TABLE
-- ----------------------------------------------------
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CONSTRAINT positive_quantity CHECK (quantity > 0),
    price_at_purchase NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_order_items_product ON public.order_items(product_id);

-- ----------------------------------------------------
-- 7. INVENTORY LOGS TABLE
-- ----------------------------------------------------
CREATE TABLE public.inventory_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    change_amount INTEGER NOT NULL,
    reason VARCHAR(255) NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX idx_inventory_logs_product ON public.inventory_logs(product_id);

-- ----------------------------------------------------
-- 8. BLOG POSTS TABLE
-- ----------------------------------------------------
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL CONSTRAINT valid_post_category CHECK (category IN ('trail-review', 'reading-list', 'editorial')),
    published_at TIMESTAMP WITH TIME ZONE,
    cover_image TEXT,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_posts_slug ON public.posts(slug);
CREATE INDEX idx_posts_author ON public.posts(author_id);

-- ----------------------------------------------------
-- 9. USER SIGNUP PROFILE CREATION TRIGGER
-- ----------------------------------------------------
-- Create user profile handler
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, is_admin)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', new.email),
        COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
        CASE WHEN new.email = 'admin@antigravity.com' THEN TRUE ELSE FALSE END -- Default admin assignment by email
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------
-- 10. ROW-LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Category Policies
CREATE POLICY "Public Read Access on Categories" ON public.categories 
    FOR SELECT TO public USING (true);
CREATE POLICY "Admin Write Access on Categories" ON public.categories 
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
    );

-- Profile Policies
CREATE POLICY "Public profiles are readable by everyone" ON public.profiles 
    FOR SELECT TO public USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles 
    FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Admins have full access to profiles" ON public.profiles
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
    );

-- Product Policies
CREATE POLICY "Public Read Access on Products" ON public.products 
    FOR SELECT TO public USING (true);
CREATE POLICY "Admin Write Access on Products" ON public.products 
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
    );

-- Discount Code Policies
CREATE POLICY "Admins have full access to discount codes" ON public.discount_codes
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
    );
CREATE POLICY "Public can read active discount codes" ON public.discount_codes
    FOR SELECT TO public USING (active = true);

-- Order Policies
CREATE POLICY "Users can read their own orders" ON public.orders
    FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own orders" ON public.orders
    FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins have full access to all orders" ON public.orders
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
    );

-- Order Item Policies
CREATE POLICY "Users can read their own order items" ON public.order_items
    FOR SELECT TO authenticated USING (
        EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
    );
CREATE POLICY "Users can insert their own order items" ON public.order_items
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
    );
CREATE POLICY "Admins have full access to all order items" ON public.order_items
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
    );

-- Inventory Log Policies
CREATE POLICY "Admins have full access to inventory logs" ON public.inventory_logs
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
    );

-- Blog Post Policies
CREATE POLICY "Public Read Access on Published Posts" ON public.posts
    FOR SELECT TO public USING (published_at IS NOT NULL);
CREATE POLICY "Admin Write Access on Posts" ON public.posts
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
    );
