'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import styles from './page.module.css';

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '—';
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 2
  }).format(Number(value));
};

const formatDate = (value) => {
  if (!value) return '—';

  return new Intl.DateTimeFormat('ar-SA', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
};

const toWhatsappLink = (phone) => {
  const cleanPhone = String(phone || '').replace(/[^\d+]/g, '');
  const normalized = cleanPhone.startsWith('+') ? cleanPhone.slice(1) : cleanPhone;
  return `https://wa.me/${normalized}`;
};

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [itemsByOrder, setItemsByOrder] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        customer_name: order.customer_name || order.name || null
      });

      const { data: joinedOrders, error: joinedOrdersError } = await supabase
        .from('orders')
        .select(`
          id,
          customer_name,
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
        .select('id, customer_name, name, phone, notes, total, created_at')
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

  const hasOrders = useMemo(() => orders.length > 0, [orders]);

  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <header className={styles.header}>
          <h1 className={styles.title}>لوحة تحكم الطلبات</h1>
          <p className={styles.subtitle}>إدارة وعرض طلبات بن فراج بشكل سريع وواضح.</p>
        </header>

        {loading ? <p className={styles.stateBox}>جاري تحميل الطلبات...</p> : null}

        {!loading && error ? <p className={styles.stateBox}>{error}</p> : null}

        {!loading && !error && !hasOrders ? (
          <p className={styles.stateBox}>لا توجد طلبات حالياً.</p>
        ) : null}

        {!loading && hasOrders ? (
          <div className={styles.list}>
            {orders.map((order) => (
              <article key={order.id} className={styles.orderCard}>
                <div className={styles.orderTop}>
                  <h2 className={styles.customerName}>{order.customer_name || 'بدون اسم'}</h2>
                  <a
                    className={styles.whatsappBtn}
                    href={toWhatsappLink(order.phone)}
                    target="_blank"
                    rel="noreferrer"
                  >
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
      </section>
    </main>
  );
}
