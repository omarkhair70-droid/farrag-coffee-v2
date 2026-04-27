import { NextResponse } from 'next/server';
import { requireAdminFromRequest } from '../../../../lib/server/adminApi';
import { getSupabaseAdmin } from '../../../../lib/server/supabaseAdmin';
import { normalizeProducts } from '../../../../lib/products';

const sanitizeProductPayload = (body = {}) => {
  const payload = {
    name: String(body.name || '').trim(),
    category: String(body.category || '').trim(),
    type: String(body.type || '').trim(),
    weight: String(body.weight || '').trim(),
    description: String(body.description || '').trim(),
    is_active: Boolean(body.is_active),
    sort_order: Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : 0
  };

  const numericPrice = Number(body.price);
  if (!Number.isFinite(numericPrice) || numericPrice < 0) {
    throw new Error('السعر يجب أن يكون رقماً موجباً أو صفراً.');
  }

  payload.price = numericPrice;

  const requiredFields = ['name', 'category', 'type', 'weight', 'description'];
  const missingField = requiredFields.find((field) => !payload[field]);

  if (missingField) {
    throw new Error('جميع الحقول الأساسية مطلوبة.');
  }

  return payload;
};

export async function GET(request) {
  const { errorResponse } = requireAdminFromRequest(request);
  if (errorResponse) return errorResponse;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('products')
      .select('id, name, category, type, weight, price, description, image, is_active, sort_order, updated_at')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const normalized = normalizeProducts(data).map((item) => {
      const original = (data || []).find((row) => row.id === item.id);
      return {
        ...item,
        updated_at: original?.updated_at || null
      };
    });

    return NextResponse.json({ products: normalized });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'تعذر تحميل المنتجات.' }, { status: 500 });
  }
}

export async function PATCH(request) {
  const { errorResponse } = requireAdminFromRequest(request);
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const id = String(body?.id || '').trim();

    if (!id) {
      return NextResponse.json({ error: 'معرف المنتج مطلوب.' }, { status: 400 });
    }

    const payload = sanitizeProductPayload(body);
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select('id, name, category, type, weight, price, description, image, is_active, sort_order, updated_at')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      product: {
        ...normalizeProducts([data])[0],
        updated_at: data.updated_at
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'تعذر حفظ المنتج.' }, { status: 400 });
  }
}
