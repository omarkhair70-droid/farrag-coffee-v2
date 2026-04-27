import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { normalizeProducts } from '../../../lib/products';

const createAnonClient = () => {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
};

export async function GET() {
  const supabase = createAnonClient();

  if (!supabase) {
    return NextResponse.json({ error: 'Supabase credentials are missing.' }, { status: 500 });
  }

  const { data, error } = await supabase
    .from('products')
    .select('id, name, category, type, weight, price, description, image, is_active, sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const products = normalizeProducts(data);

  if (!products.length) {
    return NextResponse.json({ error: 'No valid products found.' }, { status: 502 });
  }

  return NextResponse.json({ products });
}
