export const sectionReveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.7, ease: 'easeInOut' }
};

export const cardHover = {
  whileHover: {
    scale: 1.02,
    y: -4,
    boxShadow: '0 18px 30px rgba(61, 38, 20, 0.14)'
  },
  transition: { duration: 0.35, ease: 'easeInOut' }
};

export const premiumButtonMotion = {
  whileHover: { scale: 1.02, y: -1 },
  whileTap: { scale: 0.97 },
  transition: { type: 'spring', stiffness: 260, damping: 20, mass: 0.8 }
};

export const addToCartMotion = {
  whileHover: { scale: 1.03, boxShadow: '0 10px 22px rgba(61, 38, 20, 0.2)' },
  whileTap: { scale: 0.95 },
  transition: { type: 'spring', stiffness: 320, damping: 18, mass: 0.7 }
};

export const cartPanelTransition = {
  type: 'spring',
  stiffness: 220,
  damping: 24
};
