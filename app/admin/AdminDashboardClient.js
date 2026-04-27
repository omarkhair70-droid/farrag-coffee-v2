'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import styles from './page.module.css';

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 2
  }).format(Number(value));
};

const formatDate = (value) => {
  if (!value) return '—';

  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
};

const toWhatsappLink = (phone) => {
  const cleanPhone = String(phone || '').replace(/[^\d+]/g, '');
  const normalized = cleanPhone.startsWith('+') ? cleanPhone.slice(1) : cleanPhone;
  return `https://wa.me/${normalized}`;
};

const emptyProductForm = {
  id: '',
  name: '',
  category: '',
  type: '',
  weight: '',
  price: 0,
  description: '',
  is_active: true,
  sort_order: 0
};

export default function AdminDashboardClient() {
  const [orders, setOrders] = useState([]);
  const [itemsByOrder, setItemsByOrder] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState(emptyProductForm);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!supabase) {
        setError('إعدادات Supabase غير متوفرة.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      const normalizeOrder = (order) => ({
        ...order,
        name: order.name || null
      });

      const { data: joinedOrders, error: joinedOrdersError } = await supabase
        .from('orders')
        .select(`
          id,
          name,
          phone,
          notes,
          total,
          created_at,
          order_items (
            id,
            order_id,
            product_name,
            quantity,
            price
          )
        `)
        .order('created_at', { ascending: false });

      if (!joinedOrdersError) {
        const normalizedOrders = (joinedOrders || []).map(normalizeOrder);
        const mappedItems = normalizedOrders.reduce((acc, order) => {
          acc[order.id] = order.order_items || [];
          return acc;
        }, {});

        setOrders(normalizedOrders);
        setItemsByOrder(mappedItems);
        setLoading(false);
        return;
      }

      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('id, name, phone, notes, total, created_at')
        .order('created_at', { ascending: false });

      if (ordersError) {
        setError(`تعذر تحميل الطلبات حالياً: ${ordersError.message}`);
        setLoading(false);
        return;
      }

      const normalizedOrders = (ordersData || []).map(normalizeOrder);
      const orderIds = normalizedOrders.map((order) => order.id);
      let mappedItems = {};

      if (orderIds.length) {
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('id, order_id, product_name, quantity, price')
          .in('order_id', orderIds)
          .order('id', { ascending: true });

        if (itemsError) {
          setError(`تم تحميل الطلبات لكن تعذر تحميل تفاصيل الأصناف: ${itemsError.message}`);
        } else {
          mappedItems = (itemsData || []).reduce((acc, item) => {
            const key = item.order_id;
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
          }, {});
        }
      }

      setOrders(normalizedOrders);
      setItemsByOrder(mappedItems);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    setProductsLoading(true);
    setProductsError('');

    try {
      const response = await fetch('/api/admin/products', { cache: 'no-store' });
      const payload = await response.json();

      if (!response.ok || !Array.isArray(payload.products)) {
        throw new Error(payload.error || 'تعذر تحميل المنتجات.');
      }

      setProducts(payload.products);
    } catch (fetchError) {
      setProductsError(fetchError.message || 'تعذر تحميل المنتجات.');
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const hasOrders = useMemo(() => orders.length > 0, [orders]);

  const startEditing = (product) => {
    setEditingId(product.id);
    setSaveMessage('');
    setForm({
      id: product.id,
      name: product.name,
      category: product.category,
      type: product.type,
      weight: product.weight,
      price: product.price,
      description: product.description,
      is_active: product.is_active,
      sort_order: product.sort_order
    });
  };

  const cancelEditing = () => {
    setEditingId('');
    setForm(emptyProductForm);
    setSaveMessage('');
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    setSaveMessage('');

    if (Number(form.price) < 0) {
      setSaveMessage('السعر لا يمكن أن يكون سالباً.');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          sort_order: Number(form.sort_order)
        })
      });

      const payload = await response.json();

      if (!response.ok || !payload.product) {
        throw new Error(payload.error || 'تعذر حفظ بيانات المنتج.');
      }

      setProducts((prev) => prev.map((item) => (item.id === payload.product.id ? payload.product : item)));
      setSaveMessage('تم حفظ التعديلات بنجاح.');
      setEditingId('');
    } catch (saveError) {
      setSaveMessage(saveError.message || 'تعذر حفظ بيانات المنتج.');
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>لوحة تحكم الطلبات والمنتجات</h1>
            <p className={styles.subtitle}>إدارة طلبات ومنتجات بن فراج في مكان واحد.</p>
          </div>
          <button className={styles.logoutBtn} onClick={logout} type="button">تسجيل الخروج</button>
        </header>

        <h2 className={styles.panelTitle}>الطلبات</h2>

        {loading ? <p className={styles.stateBox}>جاري تحميل الطلبات...</p> : null}
        {!loading && error ? <p className={styles.stateBox}>{error}</p> : null}
        {!loading && !error && !hasOrders ? <p className={styles.stateBox}>لا توجد طلبات حالياً.</p> : null}

        {!loading && hasOrders ? (
          <div className={styles.list}>
            {orders.map((order) => (
              <article key={order.id} className={styles.orderCard}>
                <div className={styles.orderTop}>
                  <h2 className={styles.customerName}>{order.name || 'بدون اسم'}</h2>
                  <a className={styles.whatsappBtn} href={toWhatsappLink(order.phone)} target="_blank" rel="noreferrer">
                    تواصل واتساب
                  </a>
                </div>

                <div className={styles.infoGrid}>
                  <p><strong>الهاتف:</strong> {order.phone || '—'}</p>
                  <p><strong>الإجمالي:</strong> {formatCurrency(order.total)}</p>
                  <p><strong>التاريخ:</strong> {formatDate(order.created_at)}</p>
                </div>

                <p className={styles.notes}><strong>ملاحظات:</strong> {order.notes || 'لا توجد ملاحظات'}</p>

                <div className={styles.itemsWrap}>
                  <h3 className={styles.itemsTitle}>الأصناف</h3>
                  {itemsByOrder[order.id]?.length ? (
                    <ul className={styles.itemsList}>
                      {itemsByOrder[order.id].map((item) => (
                        <li key={item.id} className={styles.itemRow}>
                          <span>{item.product_name}</span>
                          <span>الكمية: {item.quantity}</span>
                          <span>{formatCurrency(item.price)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.noItems}>لا توجد أصناف مرتبطة بهذا الطلب.</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : null}

        <h2 className={styles.panelTitle}>المنتجات</h2>

        {productsLoading ? <p className={styles.stateBox}>جاري تحميل المنتجات...</p> : null}
        {!productsLoading && productsError ? <p className={styles.stateBox}>{productsError}</p> : null}

        {!productsLoading && !productsError ? (
          <div className={styles.productsWrap}>
            {products.map((product) => (
              <article key={product.id} className={styles.productCard}>
                <div className={styles.productTop}>
                  <div>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productMeta}>ID: {product.id}</p>
                  </div>
                  <button className={styles.editBtn} onClick={() => startEditing(product)} type="button">تعديل</button>
                </div>

                <p className={styles.productMeta}>{product.category} • {product.type} • {product.weight}</p>
                <p className={styles.productMeta}>{formatCurrency(product.price)}</p>
                <p className={styles.productMeta}>{product.is_active ? 'نشط' : 'غير نشط'} • ترتيب: {product.sort_order}</p>
                <p className={styles.notes}>{product.description}</p>
              </article>
            ))}
          </div>
        ) : null}

        {editingId ? (
          <form className={styles.editForm} onSubmit={saveProduct}>
            <h3 className={styles.itemsTitle}>تعديل المنتج: {form.id}</h3>
            <div className={styles.formGrid}>
              <label>الاسم<input value={form.name} onChange={(event) => updateField('name', event.target.value)} required /></label>
              <label>الفئة<input value={form.category} onChange={(event) => updateField('category', event.target.value)} required /></label>
              <label>النوع<input value={form.type} onChange={(event) => updateField('type', event.target.value)} required /></label>
              <label>الوزن<input value={form.weight} onChange={(event) => updateField('weight', event.target.value)} required /></label>
              <label>السعر (جنيه)
                <input type="number" min="0" step="0.01" value={form.price} onChange={(event) => updateField('price', event.target.value)} required />
              </label>
              <label>الترتيب
                <input type="number" step="1" value={form.sort_order} onChange={(event) => updateField('sort_order', event.target.value)} required />
              </label>
              <label className={styles.fullWidth}>الوصف
                <textarea rows={4} value={form.description} onChange={(event) => updateField('description', event.target.value)} required />
              </label>
              <label className={styles.switchRow}>
                <input type="checkbox" checked={form.is_active} onChange={(event) => updateField('is_active', event.target.checked)} />
                <span>منتج نشط (يظهر في الصفحة الرئيسية)</span>
              </label>
            </div>

            <div className={styles.formActions}>
              <button className={styles.saveBtn} type="submit" disabled={saving}>{saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}</button>
              <button className={styles.cancelBtn} type="button" onClick={cancelEditing}>إلغاء</button>
            </div>

            {saveMessage ? <p className={styles.stateBox}>{saveMessage}</p> : null}
          </form>
        ) : null}
      </section>
    </main>
  );
}
