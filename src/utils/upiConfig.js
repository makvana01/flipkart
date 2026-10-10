/**
 * UPI Gateway Configuration & Helper Utilities
 * Production-ready utility for high-converting mobile UPI checkouts.
 */

const STORAGE_KEY = 'flipkart_upi_settings';

// Default configuration
const DEFAULT_CONFIG = {
  payeeVpa: 'flipkart.pay@icici',
  payeeName: 'Flipkart India Pvt Ltd',
  merchantCode: '5311', // MCC for Department Stores
  qrExpirySeconds: 300, // 5 minutes
  autoVerifySeconds: 120, // 2 minutes
  notePrefix: 'Order'
};

/**
 * Get current UPI configuration from localStorage or defaults
 */
export function getUpiConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch (err) {
    console.error('Failed to load UPI config from localStorage:', err);
  }
  return { ...DEFAULT_CONFIG };
}

/**
 * Save updated UPI configuration to localStorage
 */
export function saveUpiConfig(newConfig) {
  try {
    const current = getUpiConfig();
    const updated = { ...current, ...newConfig };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save UPI config to localStorage:', err);
    return null;
  }
}

/**
 * Generate a dynamic Order ID in the exact format:
 * RCYYYYMMDDHHMMSSXXXX (e.g., RC202610092245308A9F)
 */
export function generateOrderId() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  
  // 4 random alphanumeric characters (A-Z, 0-9)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `RC${yyyy}${mm}${dd}${hh}${min}${ss}${rand}`;
}

/**
 * Generate all App-Specific Deep Links and Generic Intent Strings
 * 
 * @param {Object} params
 * @param {string} params.vpa Payee UPI VPA (e.g. your-vpa@upi)
 * @param {string} params.payeeName Payee display name
 * @param {number} params.amount Transaction amount
 * @param {string} params.orderId Unique Order ID (RC...)
 * @param {string} [params.merchantCode] Optional MCC code
 * @param {string} [params.note] Payment note description
 */
export function generateUpiDeepLinks({
  vpa,
  payeeName,
  amount,
  orderId,
  merchantCode = '',
  note = ''
}) {
  const formattedAmount = Number(amount || 0).toFixed(2);
  const paymentNote = note || `Order ${orderId}`;
  const encodedName = encodeURIComponent(payeeName);
  const encodedNote = encodeURIComponent(paymentNote);

  // 1. Generic Standard UPI Intent Link (NPCI Spec)
  // upi://pay?pa=...&pn=...&am=...&cu=INR&tn=...&tr=...
  let genericLink = `upi://pay?pa=${vpa}&pn=${encodedName}&am=${formattedAmount}&cu=INR&tn=${encodedNote}&tr=${orderId}`;
  if (merchantCode) {
    genericLink += `&mc=${merchantCode}`;
  }

  // 2. PhonePe Deep Link with base64 encoded p2pPaymentCheckoutParams
  // PhonePe mobile checkout spec
  const phonepePayload = {
    payeeVpa: vpa,
    payeeName: payeeName,
    amount: Math.round(Number(amount) * 100), // amount in paise
    transactionId: orderId,
    transactionRef: orderId,
    note: paymentNote
  };

  let base64CheckoutParams = '';
  try {
    base64CheckoutParams = btoa(unescape(encodeURIComponent(JSON.stringify(phonepePayload))));
  } catch (e) {
    base64CheckoutParams = btoa(JSON.stringify(phonepePayload));
  }

  // PhonePe deep link with base64 params and Android intent fallback
  const phonepeLink = `phonepe://pay?pa=${vpa}&pn=${encodedName}&am=${formattedAmount}&cu=INR&tn=${encodedNote}&tr=${orderId}&p2pPaymentCheckoutParams=${encodeURIComponent(base64CheckoutParams)}`;

  // 3. Paytm Deep Link
  // paytmmp://cash_wallet?pa=...&pn=...&am=...&tn=...
  const paytmLink = `paytmmp://cash_wallet?pa=${vpa}&pn=${encodedName}&am=${formattedAmount}&cu=INR&tn=${encodedNote}&tr=${orderId}`;

  // 4. Google Pay (GPay / Tez) Deep Link
  const gpayLink = `tez://upi/pay?pa=${vpa}&pn=${encodedName}&am=${formattedAmount}&cu=INR&tn=${encodedNote}&tr=${orderId}`;

  // 5. BHIM UPI Link
  const bhimLink = `bhim://pay?pa=${vpa}&pn=${encodedName}&am=${formattedAmount}&cu=INR&tn=${encodedNote}&tr=${orderId}`;

  return {
    generic: genericLink,
    phonepe: phonepeLink,
    paytm: paytmLink,
    gpay: gpayLink,
    bhim: bhimLink,
    base64CheckoutParams
  };
}

/**
 * Trigger mobile app switching with reliable fallbacks
 */
export function openUpiApp(deepLink, genericFallbackLink) {
  // If not on mobile, or user in desktop browser, we still try intent / fallback
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  // Create hidden iframe or direct location change
  const start = Date.now();
  window.location.href = deepLink;

  // Fallback after 1200ms if app didn't open and page remains active
  setTimeout(() => {
    if (Date.now() - start < 1800 && genericFallbackLink && isMobile) {
      // Fallback to standard generic upi://
      window.location.href = genericFallbackLink;
    }
  }, 1200);
}
