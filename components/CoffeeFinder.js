'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './CoffeeFinder.module.css';
import { premiumButtonMotion, sectionReveal } from '../lib/motion';

const questions = [
  {
    id: 'taste',
    label: 'بتحب القهوة عاملة إزاي؟',
    options: ['هادية ومتوازنة', 'ريحتها محوجة وواضحة', 'تقيلة وفاخرة', 'مركزة للماكينة']
  },
  {
    id: 'method',
    label: 'هتعملها بإيه؟',
    options: ['كنكة', 'ماكينة', 'فنجان تركي', 'مش فارقة']
  },
  {
    id: 'style',
    label: 'تحبها سادة ولا محوج؟',
    options: ['سادة', 'محوج', 'مش عارف']
  }
];

const whatsappNumber = '201005009908';

function getRecommendation(answers) {
  if (answers.taste === 'مركزة للماكينة' || answers.method === 'ماكينة') {
    return {
      productId: 'espresso',
      name: 'إسبريسو',
      reason: 'اختياراتك بتشير إنك عايز مذاق مركز يناسب الماكينة بثبات وكريمة أوضح.'
    };
  }

  if (answers.taste === 'تقيلة وفاخرة') {
    return {
      productId: 'yemeni-plain',
      name: 'يمني',
      reason: 'واضح إنك تفضّل طعم عميق وتقيل، واليمني مناسب للمذاق الفاخر.'
    };
  }

  if (answers.taste === 'ريحتها محوجة وواضحة' || answers.style === 'محوج') {
    return {
      productId: 'turkish-blend',
      name: 'تركي محوج',
      reason: 'ترشيحنا ليك محوج واضح الرائحة بطابع شرقي غني.'
    };
  }

  return {
    productId: 'brazilian-plain',
    name: 'برازيلي سادة',
    reason: 'اختيار متوازن وناعم يناسب القهوة اليومية بدون تعقيد.'
  };
}

export default function CoffeeFinder() {
  const [answers, setAnswers] = useState({
    taste: '',
    method: '',
    style: ''
  });

  const recommendation = useMemo(() => {
    if (!answers.taste || !answers.method || !answers.style) return null;
    return getRecommendation(answers);
  }, [answers]);

  const handleQuickOrder = () => {
    if (!recommendation) return;
    const message = encodeURIComponent(
      `مرحباً بن فراج، أريد طلب:\nالمنتج: ${recommendation.name}\nالكمية: 1\nمن موقع بن فراج.`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.section
      id="finder"
      className={`section ${styles.finder}`}
      initial={sectionReveal.initial}
      whileInView={sectionReveal.whileInView}
      viewport={sectionReveal.viewport}
      transition={sectionReveal.transition}
    >
      <h2 className="sectionTitle">اختار قهوتك في ٣ أسئلة</h2>
      <p className={styles.subtitle}>جاوب بسرعة، وخلّي فراج يرشحلك أنسب نوع.</p>

      <div className={styles.questions}>
        {questions.map((question) => (
          <div key={question.id} className={styles.questionBlock}>
            <p className={styles.questionTitle}>{question.label}</p>
            <div className={styles.options}>
              {question.options.map((option) => {
                const isActive = answers[question.id] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    className={`${styles.option} ${isActive ? styles.optionActive : ''}`}
                    onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: option }))}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {recommendation ? (
        <motion.div className={styles.result} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <p className={styles.resultTitle}>أنسب اختيار ليك</p>
          <h3>{recommendation.name}</h3>
          <p>{recommendation.reason}</p>
          <div className={styles.resultActions}>
            <motion.a href="#products" className="btn btnPrimary" {...premiumButtonMotion}>
              شوف المنتج
            </motion.a>
            <motion.button type="button" className="btn btnSecondary" onClick={handleQuickOrder} {...premiumButtonMotion}>
              اطلبه فورًا على واتساب
            </motion.button>
          </div>
        </motion.div>
      ) : null}
    </motion.section>
  );
}
