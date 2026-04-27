'use client';

import { useState } from 'react';
import styles from '../page.module.css';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'تعذر تسجيل الدخول.');
      }

      window.location.href = '/admin';
    } catch (loginError) {
      setError(loginError.message || 'تعذر تسجيل الدخول.');
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <header className={styles.header}>
          <h1 className={styles.title}>تسجيل دخول الإدارة</h1>
          <p className={styles.subtitle}>أدخل بيانات الإدارة للوصول للوحة التحكم.</p>
        </header>

        <form className={styles.editForm} onSubmit={onSubmit}>
          <div className={styles.formGrid}>
            <label>اسم المستخدم
              <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required />
            </label>
            <label>كلمة المرور
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
            </label>
          </div>

          <div className={styles.formActions}>
            <button className={styles.saveBtn} type="submit" disabled={loading}>{loading ? 'جاري تسجيل الدخول...' : 'دخول'}</button>
          </div>

          {error ? <p className={styles.stateBox}>{error}</p> : null}
        </form>
      </section>
    </main>
  );
}
