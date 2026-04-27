'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './Cart.module.css';
import { cartPanelTransition, premiumButtonMotion, sectionReveal } from '../lib/motion';
import { supabase } from '../lib/supabase';

const whatsappNumber = '201005009908';

function buildMessage({ customerName, phone, notes, items, subtotal, total }) {
  const lines = items.map(
    (item, index) => `${index + 1}- ${item.name} | الطحنة: ${item.grind || 'ناعم تركي'} | الكمية: ${item.quantity} | السعر: ${item.price * item.quantity} جنيه`
  );

  return [
    'مرحباً بن فراج، أريد تأكيد الطلب التالي:',
    `الاسم: ${customerName}`,
    `رقم الهاتف: ${phone}`,
    `ملاحظات: ${notes || 'لا يوجد'}`,
    '--- المنتجات ---',
    ...lines,
    `المجموع الفرعي: ${subtotal} جنيه`,
    `الإجمالي: ${total} جنيه`
  ].join('\n');
}

export default function Cart({ items, total, onUpdateQuantity, onRemoveItem }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = useMemo(() => total, [total]);

  const handleCheckout = async (event) => {
    event.preventDefault();
    setCheckoutError('');
    setIsSubmitting(true);

    const message = encodeURIComponent(buildMessage({ customerName, phone, notes, items, subtotal, total }));

    try {
      if (!supabase) {
        throw new Error('خدمة حفظ الطلب غير متاحة حالياً.');
      }

      const { data, error } = await supabase
        .from('orders')
        .insert([{ name: customerName, phone, notes, total }])
        .select('id')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      const orderItems = items.map((item) => ({
        order_id: data.id,
        product_name: `${item.name} - ${item.grind || 'ناعم تركي'}`,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: orderItemsError } = await supabase.from('order_items').insert(orderItems);

      if (orderItemsError) {
        throw new Error(orderItemsError.message);
      }
    } catch (error) {
      setCheckoutError('تعذر حفظ الطلب تلقائياً، لكن تم تحويلك مباشرةً لواتساب لإكمال الطلب.');
      console.error('Supabase checkout warning:', error);
    }

    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  return (
    <motion.section
      id="cart"
      className="section"
      initial={sectionReveal.initial}
      whileInView={sectionReveal.whileInView}
      viewport={sectionReveal.viewport}
      transition={sectionReveal.transition}
    >
      <h2 className="sectionTitle">راجع طلبك</h2>
      {items.length === 0 ? (
        <div className={styles.emptyWrap}>
          <p className={styles.empty}>السلة لسه فاضية — اختار قهوتك المفضلة وابدأ الطلب.</p>
        </div>
      ) : (
        <>
          <motion.div className={styles.list} layout>
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={item.cartKey || `${item.id}-${item.grind || 'naem'}`}
                  className={styles.row}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div>
                    <h3>{item.name}</h3>
                    <p className={styles.grindText}>الطحنة: {item.grind || 'ناعم تركي'}</p>
                    <p>{item.price} جنيه × {item.quantity}</p>
                  </div>
                  <div className={styles.controls}>
                    <motion.button className="btn btnSecondary" onClick={() => onUpdateQuantity(item.cartKey, item.quantity - 1)} {...premiumButtonMotion}>-</motion.button>
                    <span>{item.quantity}</span>
                    <motion.button className="btn btnSecondary" onClick={() => onUpdateQuantity(item.cartKey, item.quantity + 1)} {...premiumButtonMotion}>+</motion.button>
                    <motion.button className={styles.removeBtn} onClick={() => onRemoveItem(item.cartKey)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.25, ease: 'easeInOut' }}>
                      إزالة
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          <p className={styles.total}>الإجمالي: {total} جنيه</p>
          <motion.button className="btn btnPrimary" onClick={() => setIsModalOpen(true)} {...premiumButtonMotion}>
            ابعت الطلب لفراج
          </motion.button>

          <motion.div className={styles.stickyBar} layout transition={cartPanelTransition}>
            <span>{items.length} منتجات • {total} جنيه</span>
            <motion.button className="btn btnPrimary" onClick={() => setIsModalOpen(true)} {...premiumButtonMotion}>
              متابعة الطلب
            </motion.button>
          </motion.div>
        </>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <motion.div className={styles.overlay} onClick={() => setIsModalOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }}>
            <motion.form className={styles.modal} onSubmit={handleCheckout} onClick={(event) => event.stopPropagation()} initial={{ opacity: 0, y: 22, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }} transition={cartPanelTransition}>
              <h3>تفاصيل الطلب</h3>
              <label>الاسم<input value={customerName} onChange={(event) => setCustomerName(event.target.value)} required /></label>
              <label>رقم الهاتف<input value={phone} onChange={(event) => setPhone(event.target.value)} required /></label>
              <label>ملاحظات<textarea rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} /></label>
              {checkoutError ? <p className={styles.warning}>{checkoutError}</p> : null}
              <motion.button className="btn btnPrimary" type="submit" disabled={isSubmitting} {...premiumButtonMotion}>
                {isSubmitting ? 'جاري إرسال الطلب...' : 'إرسال الطلب على واتساب'}
              </motion.button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
