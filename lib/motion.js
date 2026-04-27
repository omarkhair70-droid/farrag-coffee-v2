export const sectionReveal = {
  initial: { opacity: 0, y: 34 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

export const cardHover = {
  whileHover: {
    y: -8,
    scale: 1.015,
    boxShadow: '0 28px 50px rgba(0, 0, 0, 0.45)'
  },
  transition: { type: 'spring', stiffness: 220, damping: 20, mass: 0.85 }
};

export const premiumButtonMotion = {
  whileHover: { scale: 1.03, y: -2 },
  whileTap: { scale: 0.97 },
  transition: { type: 'spring', stiffness: 320, damping: 18, mass: 0.65 }
};

export const addToCartMotion = {
  whileHover: { scale: 1.035, y: -2, boxShadow: '0 12px 30px rgba(217, 177, 111, 0.35)' },
  whileTap: { scale: 0.95 },
  transition: { type: 'spring', stiffness: 350, damping: 18, mass: 0.7 }
};

export const cartPanelTransition = {
  type: 'spring',
  stiffness: 250,
  damping: 24,
  mass: 0.9
};
