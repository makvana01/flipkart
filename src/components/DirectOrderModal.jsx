import React, { useState, useEffect, useMemo, useRef } from 'react';
import UpiPaymentFlow from './UpiPaymentFlow';

// Offline Pincode Database for instant resolution of thousands of Indian pincodes
const PINCODE_MAP = {
  '395003': { city: 'Surat', state: 'Gujarat', area: 'Haripura, Ruwala Tekra Station Road, Mahidharpura, Begampura' },
  '395001': { city: 'Surat', state: 'Gujarat', area: 'Nanpura, Athwagate' },
  '395002': { city: 'Surat', state: 'Gujarat', area: 'Sayedpura, Bhagal' },
  '395004': { city: 'Surat', state: 'Gujarat', area: 'Katargam' },
  '395006': { city: 'Surat', state: 'Gujarat', area: 'Varachha' },
  '395007': { city: 'Surat', state: 'Gujarat', area: 'Vesu, VIP Road' },
  '395009': { city: 'Surat', state: 'Gujarat', area: 'Adajan, Pal' },
  '365555': { city: 'Amreli', state: 'Gujarat', area: 'Dungar, Sanjana Road, Near Essar Patrol' },
  '365601': { city: 'Amreli', state: 'Gujarat', area: 'Amreli Main' },
  '380015': { city: 'Ahmedabad', state: 'Gujarat', area: 'Satellite, Bodakdev' },
  '380001': { city: 'Ahmedabad', state: 'Gujarat', area: 'Bhadra, Lal Darwaja' },
  '380009': { city: 'Ahmedabad', state: 'Gujarat', area: 'Navrangpura, Ashram Road' },
  '380054': { city: 'Ahmedabad', state: 'Gujarat', area: 'Thaltej, SG Highway' },
  '360001': { city: 'Rajkot', state: 'Gujarat', area: 'Dharmendrasinhji Road, Rajkot' },
  '360005': { city: 'Rajkot', state: 'Gujarat', area: 'Kalawad Road, Rajkot' },
  '390001': { city: 'Vadodara', state: 'Gujarat', area: 'Alkapuri, Vadodara' },
  '390007': { city: 'Vadodara', state: 'Gujarat', area: 'Fatehgunj, Vadodara' },
  '400001': { city: 'Mumbai', state: 'Maharashtra', area: 'Fort, Colaba' },
  '400050': { city: 'Mumbai', state: 'Maharashtra', area: 'Bandra West' },
  '400053': { city: 'Mumbai', state: 'Maharashtra', area: 'Andheri West' },
  '411001': { city: 'Pune', state: 'Maharashtra', area: 'Shivajinagar, Pune' },
  '110001': { city: 'New Delhi', state: 'Delhi', area: 'Connaught Place' },
  '110017': { city: 'New Delhi', state: 'Delhi', area: 'Malviya Nagar, Saket' },
  '110092': { city: 'New Delhi', state: 'Delhi', area: 'Laxmi Nagar, Anand Vihar' },
  '201301': { city: 'Noida', state: 'Uttar Pradesh', area: 'Sector 18, Noida' },
  '122001': { city: 'Gurugram', state: 'Haryana', area: 'Cyber City, Gurugram' },
  '560001': { city: 'Bengaluru', state: 'Karnataka', area: 'MG Road, Shivaji Nagar' },
  '560034': { city: 'Bengaluru', state: 'Karnataka', area: 'Koramangala, 5th Block' },
  '560038': { city: 'Bengaluru', state: 'Karnataka', area: 'Indiranagar 100ft Road' },
  '560100': { city: 'Bengaluru', state: 'Karnataka', area: 'Electronic City' },
  '600001': { city: 'Chennai', state: 'Tamil Nadu', area: 'George Town, Parry Corner' },
  '600034': { city: 'Chennai', state: 'Tamil Nadu', area: 'Nungambakkam' },
  '700001': { city: 'Kolkata', state: 'West Bengal', area: 'BBD Bagh, Dalhousie' },
  '500001': { city: 'Hyderabad', state: 'Telangana', area: 'Abids, Koti' },
  '500081': { city: 'Hyderabad', state: 'Telangana', area: 'Hitec City, Madhapur' },
  '302001': { city: 'Jaipur', state: 'Rajasthan', area: 'MI Road, C-Scheme' },
  '226001': { city: 'Lucknow', state: 'Uttar Pradesh', area: 'Hazratganj, Lucknow' }
};

function getPostalInfoByPin(pin) {
  if (PINCODE_MAP[pin]) return PINCODE_MAP[pin];
  const p2 = pin.substring(0, 2);
  const p3 = pin.substring(0, 3);

  let state = 'India';
  let city = 'City';

  if (p2 === '11') { state = 'Delhi'; city = 'New Delhi'; }
  else if (p2 === '12' || p2 === '13') { state = 'Haryana'; city = 'Gurugram'; }
  else if (p2 === '14' || p2 === '15') { state = 'Punjab'; city = 'Ludhiana'; }
  else if (p2 === '16') { state = 'Chandigarh'; city = 'Chandigarh'; }
  else if (['20','21','22','24','25','26','27','28'].includes(p2)) { state = 'Uttar Pradesh'; city = 'Lucknow'; }
  else if (['30','31','32','33','34'].includes(p2)) { state = 'Rajasthan'; city = 'Jaipur'; }
  else if (['36','37','38','39'].includes(p2)) {
    state = 'Gujarat';
    if (p3 === '395') city = 'Surat';
    else if (p3 === '380') city = 'Ahmedabad';
    else if (p3 === '360') city = 'Rajkot';
    else if (p3 === '390') city = 'Vadodara';
    else if (p3 === '365') city = 'Amreli';
    else city = 'Gujarat';
  }
  else if (['40','41','42','43','44'].includes(p2)) { state = 'Maharashtra'; city = p2 === '40' ? 'Mumbai' : 'Pune'; }
  else if (['45','46','47','48'].includes(p2)) { state = 'Madhya Pradesh'; city = 'Indore'; }
  else if (['50','51','52','53'].includes(p2)) { state = 'Telangana'; city = 'Hyderabad'; }
  else if (['56','57','58','59'].includes(p2)) { state = 'Karnataka'; city = 'Bengaluru'; }
  else if (['60','61','62','63','64'].includes(p2)) { state = 'Tamil Nadu'; city = 'Chennai'; }
  else if (['67','68','69'].includes(p2)) { state = 'Kerala'; city = 'Kochi'; }
  else if (['70','71','72','73','74'].includes(p2)) { state = 'West Bengal'; city = 'Kolkata'; }
  else if (['80','81','82','83','84','85'].includes(p2)) { state = 'Bihar'; city = 'Patna'; }

  return { city, state, area: `${city} Central Area` };
}

function getSavedUserAddress() {
  try {
    const saved = localStorage.getItem('flipkart_user_address');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return null;
}

function CheckoutStepperHeader({ currentStep, onBack, title }) {
  // 1: address, 2: summary, 3: payment
  const step = currentStep === 'address' ? 1 : currentStep === 'summary' ? 2 : 3;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: '#ffffff',
      padding: '12px 14px 14px',
      borderBottom: '1px solid #f0f0f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
    }}>
      {/* Title Bar with Back Arrow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        <button
          onClick={onBack}
          aria-label="Back"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: 2,
            color: '#111112'
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111112" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#111112', letterSpacing: '-0.2px' }}>
          {title}
        </h2>
      </div>

      {/* 3-Step Stepper (Address -> Order Summary -> Payment) matching screenshot */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'relative'
      }}>
        {/* Step 1: Address */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60, zIndex: 2 }}>
          <div style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            backgroundColor: step === 1 ? '#2874f0' : '#ffffff',
            border: step > 1 ? '1.8px solid #2874f0' : step === 1 ? 'none' : '1.8px solid #d4d5d9',
            color: step === 1 ? '#ffffff' : '#2874f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: step > 1 ? 12 : 11,
            fontWeight: 800,
            marginBottom: 4,
            transition: 'all 0.2s ease'
          }}>
            {step > 1 ? '✓' : '1'}
          </div>
          <span style={{
            fontSize: 12,
            fontWeight: step === 1 ? 700 : 500,
            color: step === 1 ? '#111112' : '#717478',
            whiteSpace: 'nowrap'
          }}>
            Address
          </span>
        </div>

        {/* Connecting Line 1 -> 2 */}
        <div style={{
          flex: 1,
          height: 2,
          backgroundColor: step >= 2 ? '#2874f0' : '#e0e0e0',
          margin: '-18px 6px 0',
          transition: 'background-color 0.25s ease'
        }} />

        {/* Step 2: Order Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 90, zIndex: 2 }}>
          <div style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            backgroundColor: step === 2 ? '#2874f0' : '#ffffff',
            border: step === 2 ? 'none' : step > 2 ? '1.8px solid #2874f0' : '1.8px solid #d4d5d9',
            color: step === 2 ? '#ffffff' : step > 2 ? '#2874f0' : '#717478',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: step > 2 ? 12 : 11,
            fontWeight: 800,
            marginBottom: 4,
            transition: 'all 0.2s ease'
          }}>
            {step > 2 ? '✓' : '2'}
          </div>
          <span style={{
            fontSize: 12,
            fontWeight: step === 2 ? 700 : 500,
            color: step === 2 ? '#111112' : '#717478',
            whiteSpace: 'nowrap'
          }}>
            Order Summary
          </span>
        </div>

        {/* Connecting Line 2 -> 3 */}
        <div style={{
          flex: 1,
          height: 2,
          backgroundColor: step >= 3 ? '#2874f0' : '#e0e0e0',
          margin: '-18px 6px 0',
          transition: 'background-color 0.25s ease'
        }} />

        {/* Step 3: Payment */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60, zIndex: 2 }}>
          <div style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            backgroundColor: step === 3 ? '#2874f0' : '#ffffff',
            border: step === 3 ? 'none' : '1.8px solid #d4d5d9',
            color: step === 3 ? '#ffffff' : '#888888',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 800,
            marginBottom: 4,
            transition: 'all 0.2s ease'
          }}>
            3
          </div>
          <span style={{
            fontSize: 12,
            fontWeight: step === 3 ? 700 : 500,
            color: step === 3 ? '#111112' : '#888888',
            whiteSpace: 'nowrap'
          }}>
            Payment
          </span>
        </div>
      </div>
    </header>
  );
}

export default function DirectOrderModal({ isOpen, onClose, items = [], onOrderSuccess }) {
  const savedAddress = useMemo(() => getSavedUserAddress(), [isOpen]);

  // Step State: 'address' -> 'summary' -> 'payment' -> 'placed' -> 'confirmed'
  const [currentStep, setCurrentStep] = useState(() => (savedAddress?.name && savedAddress?.pincode ? 'summary' : 'address'));

  // Address Form State - User-specific, empty for new users or loaded from localStorage
  const [flat, setFlat] = useState(() => savedAddress?.flat || '');
  const [pincode, setPincode] = useState(() => savedAddress?.pincode || '');
  const [city, setCity] = useState(() => savedAddress?.city || '');
  const [state, setState] = useState(() => savedAddress?.state || '');
  const [area, setArea] = useState(() => savedAddress?.area || '');
  const [name, setName] = useState(() => savedAddress?.name || '');
  const [phone, setPhone] = useState(() => savedAddress?.phone || '');
  const [altPhone, setAltPhone] = useState(() => savedAddress?.altPhone || '');
  const [addressType, setAddressType] = useState(() => savedAddress?.addressType || 'Home');
  const [isEditingArea, setIsEditingArea] = useState(false);

  // Errors state
  const [errors, setErrors] = useState({});

  // When modal opens, sync with saved address if available
  useEffect(() => {
    if (isOpen) {
      const saved = getSavedUserAddress();
      if (saved && saved.name && saved.pincode) {
        setName(saved.name || '');
        setPhone(saved.phone || '');
        setAltPhone(saved.altPhone || '');
        setPincode(saved.pincode || '');
        setFlat(saved.flat || '');
        setArea(saved.area || '');
        setCity(saved.city || '');
        setState(saved.state || '');
        setAddressType(saved.addressType || 'Home');
        setCurrentStep('summary');
      } else {
        setCurrentStep('address');
      }
    }
  }, [isOpen]);

  // Sync internal steps with browser history
  useEffect(() => {
    if (!isOpen) return;

    const handleStepPopState = (e) => {
      const s = e.state;
      if (s?.view === 'direct_order') {
        const targetStep = s.step || 'summary';
        if (targetStep !== currentStep) {
          setCurrentStep(targetStep);
        }
      }
    };

    window.addEventListener('popstate', handleStepPopState);
    return () => window.removeEventListener('popstate', handleStepPopState);
  }, [isOpen, currentStep]);

  const goToStep = (nextStep) => {
    if (nextStep === currentStep) return;
    try {
      window.history.pushState({ fkApp: true, view: 'direct_order', step: nextStep }, '');
    } catch (e) {}
    setCurrentStep(nextStep);
  };

  // Summary State
  const [quantity, setQuantity] = useState(1);
  const [donationAmount, setDonationAmount] = useState(0);

  // Payment State
  const [selectedPayment, setSelectedPayment] = useState('phonepe');
  const [customUpi, setCustomUpi] = useState('');
  const [showCodWarning, setShowCodWarning] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [processingStatusText, setProcessingStatusText] = useState('Connecting to Bank...');
  const [qrTimer, setQrTimer] = useState(599);

  // Countdown timer for QR code
  useEffect(() => {
    if (currentStep !== 'payment') return;
    const timer = setInterval(() => {
      setQrTimer((prev) => (prev > 0 ? prev - 1 : 599));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentStep]);

  // Auto-fill City & State whenever 6 digits are typed into Pincode
  const handlePincodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(val);

    if (val.length === 6) {
      // 1. Instant offline resolution
      const local = getPostalInfoByPin(val);
      if (local) {
        setCity(local.city);
        setState(local.state);
        setArea(local.area);
      }

      // 2. Official live postal API lookup
      fetch(`https://api.postalpincode.in/pincode/${val}`)
        .then((r) => r.json())
        .then((data) => {
          if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
            const po = data[0].PostOffice[0];
            const dist = po.District || po.Block || po.Circle;
            const st = po.State;
            if (dist) setCity(dist);
            if (st) setState(st);
            if (po.Name) {
              setArea(`${po.Name}, ${dist}`);
            }
          }
        })
    }
  };

  // Primary item being purchased
  const primaryItem = useMemo(() => {
    if (items && items.length > 0) {
      return items[0];
    }
    return {
      id: 'prod_sneaker',
      title: 'Jumpink Sneakers For Women',
      fullTitle: 'Jumpink Sneakers For Women (Size: 8, White , 8)',
      price: 448,
      origPrice: 1499,
      discount: '70% off',
      rating: 3.9,
      ratingsCount: '473',
      image: '/assets/images/bersache_shoes.png',
      selectedVariants: { size: '8', color: 'White' }
    };
  }, [items]);

  const itemTotal = useMemo(() => {
    if (items && items.length > 1) {
      return items.reduce((acc, it) => acc + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0);
    }
    return (primaryItem.price || 448) * (primaryItem.quantity || quantity);
  }, [items, primaryItem, quantity]);

  const itemOrigTotal = useMemo(() => {
    if (items && items.length > 1) {
      return items.reduce((acc, it) => acc + (Number(it.origPrice) || Math.round((Number(it.price) || 0) * 1.4)) * (Number(it.quantity) || 1), 0);
    }
    return (primaryItem.origPrice || 1499) * (primaryItem.quantity || quantity);
  }, [items, primaryItem, quantity]);

  const protectFee = 10;
  const finalPayable = itemTotal + protectFee + donationAmount;
  const totalSavings = itemOrigTotal - itemTotal;

  // Address Form Validation
  const handleValidateAndSaveAddress = (e) => {
    e.preventDefault();
    const errs = {};

    if (!flat.trim()) {
      errs.flat = 'Please enter Flat / House / Building name';
    }

    if (!name.trim() || name.trim().length < 2) {
      errs.name = 'Please enter your full name';
    }

    // Strict Indian 10-digit mobile number: must start with 6,7,8,9
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      errs.phone = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (pincode.length !== 6) {
      errs.pincode = 'Please enter a valid 6-digit Pincode';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});

    // Save this user's details to localStorage
    try {
      const userAddress = {
        name: name.trim(),
        phone: cleanPhone,
        altPhone: altPhone.trim(),
        pincode: pincode.trim(),
        flat: flat.trim(),
        area: area.trim() || `${city || 'City'} Area`,
        city: city.trim() || 'City',
        state: state.trim() || 'State',
        addressType
      };
      localStorage.setItem('flipkart_user_address', JSON.stringify(userAddress));
      if (city && pincode) {
        localStorage.setItem('fk_delivery_location', `${city} ${pincode}`);
      }
    } catch (err) {}

    if (window.history.state?.step === 'address') {
      window.history.back();
    } else {
      setCurrentStep('summary');
    }
  };

  // Process Online Payment
  const handleExecutePayment = () => {
    setIsProcessingPayment(true);
    setProcessingStatusText('Connecting to Bank Gateway...');

    setTimeout(() => {
      setProcessingStatusText('Authorizing UPI Transaction...');
    }, 800);

    setTimeout(() => {
      setProcessingStatusText('Payment Confirmed!');
    }, 1500);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setCurrentStep('placed');

      if (onOrderSuccess) {
        onOrderSuccess({
          orderId: 'OD' + Math.floor(100000000000 + Math.random() * 900000000000),
          customerName: name,
          phone,
          address: `${flat}, ${area}, ${city}, ${state} - ${pincode}`,
          amount: finalPayable
        });
      }

      // Automatically transition from "Order Placed" celebration to Confirmation Receipt
      setTimeout(() => {
        setCurrentStep('confirmed');
      }, 2600);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100%',
      maxHeight: '100dvh',
      zIndex: 99999,
      backgroundColor: 'rgba(0,0,0,0.65)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'stretch'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 480,
        height: '100%',
        maxHeight: '100dvh',
        backgroundColor: currentStep === 'placed' ? '#eaf8f0' : '#ffffff',
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: '0 0 24px rgba(0,0,0,0.25)',
        WebkitOverflowScrolling: 'touch'
      }}>

        {/* ========================================================
            STEP 1: ADDRESS FORM (Screenshot 1)
        ======================================================== */}
        {currentStep === 'address' && (
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
            {/* Top Bar with Stepper */}
            <CheckoutStepperHeader
              currentStep="address"
              title={name ? "Edit delivery address" : "Add delivery address"}
              onBack={() => {
                const saved = getSavedUserAddress();
                if (saved && saved.name && saved.pincode) {
                  if (window.history.state?.step === 'address') {
                    window.history.back();
                  } else {
                    setCurrentStep('summary');
                  }
                } else {
                  onClose();
                }
              }}
            />

            {/* Address Form Container */}
            <form onSubmit={handleValidateAndSaveAddress} style={{ padding: '16px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Flat / House / Building name */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  border: errors.flat ? '1.5px solid #d32f2f' : '1.5px solid #2874f0',
                  borderRadius: 6,
                  padding: '8px 12px',
                  backgroundColor: '#ffffff'
                }}>
                  <label style={{
                    display: 'block',
                    fontSize: 11,
                    color: errors.flat ? '#d32f2f' : '#2874f0',
                    fontWeight: 600,
                    marginBottom: 2
                  }}>
                    Flat/House/building name *
                  </label>
                  <input
                    type="text"
                    value={flat}
                    onChange={(e) => setFlat(e.target.value)}
                    placeholder="e.g. Flat 402, Shivam Residency"
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      fontSize: 14,
                      color: '#212121',
                      padding: 0
                    }}
                  />
                </div>
                {errors.flat && (
                  <span style={{ fontSize: 11, color: '#d32f2f', marginTop: 3, display: 'block' }}>
                    {errors.flat}
                  </span>
                )}
              </div>

              {/* Area / Sector / Locality (Screenshot 1 Box) */}
              <div style={{
                backgroundColor: '#f5f5f6',
                borderRadius: 8,
                padding: '12px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 10
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: '#717478', marginBottom: 2 }}>
                    Area / Sector / Locality
                  </div>
                  {isEditingArea ? (
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      onBlur={() => setIsEditingArea(false)}
                      autoFocus
                      style={{
                        width: '100%',
                        fontSize: 13,
                        padding: '4px 6px',
                        borderRadius: 4,
                        border: '1px solid #2874f0',
                        color: '#212121'
                      }}
                    />
                  ) : (
                    <>
                      <div style={{ fontSize: 13, color: '#212121', fontWeight: 500, lineHeight: 1.35 }}>
                        {area || (pincode ? 'Area / Locality' : 'Enter 6-digit Pincode to auto-fill area')}
                      </div>
                      <div style={{ fontSize: 13, color: '#111112', fontWeight: 700, marginTop: 3 }}>
                        {city && state ? `${city}, ${state}${pincode ? ` - ${pincode}` : ''}` : (pincode ? `Pincode: ${pincode}` : 'City & State')}
                      </div>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingArea(!isEditingArea)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #2874f0',
                    color: '#2874f0',
                    padding: '6px 12px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isEditingArea ? 'Done' : 'Change'}
                </button>
              </div>

              {/* Enter your full name */}
              <div>
                <input
                  type="text"
                  placeholder="Enter your full name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 6,
                    border: errors.name ? '1.5px solid #d32f2f' : '1px solid #d4d5d9',
                    fontSize: 14,
                    color: '#212121',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                />
                {errors.name && (
                  <span style={{ fontSize: 11, color: '#d32f2f', marginTop: 3, display: 'block' }}>
                    {errors.name}
                  </span>
                )}
              </div>

              {/* 10-digit mobile number */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  border: errors.phone ? '1.5px solid #d32f2f' : '1px solid #d4d5d9',
                  borderRadius: 6,
                  padding: '6px 12px',
                  backgroundColor: '#ffffff'
                }}>
                  <label style={{ display: 'block', fontSize: 11, color: '#717478', marginBottom: 2 }}>
                    10-digit mobile number *
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14, color: '#555', fontWeight: 600 }}>+91</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10-digit mobile number"
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        fontSize: 15,
                        fontWeight: 600,
                        color: '#212121',
                        padding: 0
                      }}
                    />
                  </div>
                </div>
                {errors.phone && (
                  <span style={{ fontSize: 11, color: '#d32f2f', marginTop: 3, display: 'block' }}>
                    {errors.phone}
                  </span>
                )}
              </div>

              {/* Alternate phone number (Optional) */}
              <div>
                <input
                  type="tel"
                  placeholder="Alternate phone number (Optional)"
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 6,
                    border: '1px solid #d4d5d9',
                    fontSize: 14,
                    color: '#212121',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>

              {/* Pincode Input (Triggers auto City/State fill) */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: errors.pincode ? '1.5px solid #d32f2f' : '1px solid #d4d5d9',
                  borderRadius: 6,
                  padding: '8px 12px',
                  backgroundColor: '#ffffff'
                }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 11, color: '#717478', marginBottom: 2 }}>
                      6-digit Pincode *
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={handlePincodeChange}
                      placeholder="6-digit Pincode"
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#212121',
                        padding: 0
                      }}
                    />
                  </div>
                  {pincode.length === 6 && (
                    <span style={{ fontSize: 11, color: '#108435', fontWeight: 700, backgroundColor: '#e8f5e9', padding: '2px 8px', borderRadius: 4 }}>
                      ✓ Auto-detected
                    </span>
                  )}
                </div>
                {errors.pincode && (
                  <span style={{ fontSize: 11, color: '#d32f2f', marginTop: 3, display: 'block' }}>
                    {errors.pincode}
                  </span>
                )}
              </div>

              {/* Type of address: Home / Work */}
              <div style={{ marginTop: 4 }}>
                <div style={{ fontSize: 12, color: '#717478', marginBottom: 8 }}>
                  Type of address
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setAddressType('Home')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '8px 16px',
                      borderRadius: 20,
                      border: addressType === 'Home' ? '1.5px solid #2874f0' : '1px solid #d4d5d9',
                      backgroundColor: addressType === 'Home' ? '#f0f5ff' : '#ffffff',
                      color: addressType === 'Home' ? '#2874f0' : '#444444',
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: 'pointer'
                    }}
                  >
                    <span>🏠</span> Home
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddressType('Work')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '8px 16px',
                      borderRadius: 20,
                      border: addressType === 'Work' ? '1.5px solid #2874f0' : '1px solid #d4d5d9',
                      backgroundColor: addressType === 'Work' ? '#f0f5ff' : '#ffffff',
                      color: addressType === 'Work' ? '#2874f0' : '#444444',
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: 'pointer'
                    }}
                  >
                    <span>🏢</span> Work
                  </button>
                </div>
              </div>

              {/* Save Address Button */}
              <div style={{ marginTop: 'auto', paddingTop: 16 }}>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    backgroundColor: '#1c68f2',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 24,
                    height: 48,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(28,104,242,0.3)',
                    transition: 'background-color 0.15s ease'
                  }}
                >
                  Save address
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================
            STEP 2: ORDER SUMMARY (Screenshot 2)
        ======================================================== */}
        {currentStep === 'summary' && (
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
            {/* Top Bar with Stepper */}
            <CheckoutStepperHeader
              currentStep="summary"
              title="Order Summary"
              onBack={onClose}
            />

            {/* Scrollable Summary Body */}
            <div style={{ flex: 1, padding: '14px 14px 80px' }}>
              {/* Delivery Address Card with Change button */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                padding: '12px 14px',
                marginBottom: 14,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}>
                <div style={{ flex: 1, paddingRight: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, color: '#717478' }}>Deliver to:</span>
                    <strong style={{ fontSize: 13, color: '#111112' }}>{name || 'Customer'}</strong>
                    <span style={{
                      backgroundColor: '#e8f0fe',
                      color: '#1a73e8',
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: 4
                    }}>
                      {addressType}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#444444', lineHeight: 1.4 }}>
                    {flat ? `${flat}, ` : ''}{area}{city ? `, ${city}` : ''}{state ? `, ${state}` : ''} - <strong>{pincode}</strong>
                  </div>
                  <div style={{ fontSize: 12, color: '#666666', marginTop: 3 }}>
                    Phone: <strong>{phone}</strong>{altPhone ? `, ${altPhone}` : ''}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => goToStep('address')}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #2874f0',
                    color: '#2874f0',
                    padding: '5px 12px',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Change
                </button>
              </div>

              {/* Product Card */}
              <div style={{ display: 'flex', gap: 12, paddingBottom: 14, borderBottom: '1px solid #f0f0f0' }}>
                {/* Thumbnail */}
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: 6,
                  border: '1px solid #eeeeee',
                  backgroundColor: '#fcfcfc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 4,
                  flexShrink: 0
                }}>
                  <img
                    src={primaryItem.image}
                    alt={primaryItem.title}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/images/bersache_shoes.png';
                    }}
                  />
                </div>

                {/* Details */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#212121', lineHeight: 1.35 }}>
                    {primaryItem.fullTitle || primaryItem.title}
                  </div>
                  <div style={{ fontSize: 12, color: '#717478', marginTop: 2 }}>
                    Size: {primaryItem.selectedVariants?.size || '8'}, {primaryItem.selectedVariants?.color || 'Standard'}
                  </div>

                  {/* Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: 12 }}>
                    <span style={{ color: '#108435', fontWeight: 700 }}>★★★★☆</span>
                    <span style={{ color: '#108435', fontWeight: 700 }}>3.9</span>
                    <span style={{ color: '#717478' }}>• (473)</span>
                  </div>

                  {/* Pricing row */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
                    <span style={{ color: '#108435', fontSize: 14, fontWeight: 700 }}>
                      ↓{primaryItem.discount || '70%'}
                    </span>
                    <span style={{ color: '#717478', fontSize: 13, textDecoration: 'line-through' }}>
                      ₹{primaryItem.origPrice?.toLocaleString('en-IN') || '1,499'}
                    </span>
                    <span style={{ color: '#111112', fontSize: 17, fontWeight: 800 }}>
                      ₹{primaryItem.price?.toLocaleString('en-IN') || '448'}
                    </span>
                  </div>

                  {/* Qty dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      border: '1px solid #d4d5d9',
                      borderRadius: 4,
                      padding: '2px 8px',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#212121',
                      cursor: 'pointer'
                    }}>
                      Qty: {quantity} ▾
                    </div>
                    <span style={{ fontSize: 12, color: '#108435', fontWeight: 600 }}>
                      Delivery by Oct 19, Mon
                    </span>
                  </div>
                </div>
              </div>

              {/* Open Box Delivery Card */}
              <div style={{
                marginTop: 14,
                backgroundColor: '#ffffff',
                border: '1px solid #f0f0f0',
                borderRadius: 8,
                padding: '12px 14px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 16 }}>📦</span>
                  <strong style={{ fontSize: 13, color: '#111112' }}>
                    Rest assured with Open Box Delivery
                  </strong>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: '#555555', lineHeight: 1.45 }}>
                  Delivery agent will open the package so you can check for correct product, damage or missing items. Share OTP to accept the delivery. <span style={{ color: '#2874f0', fontWeight: 600, cursor: 'pointer' }}>Why?</span>
                </p>
              </div>

              {/* Donate to Flipkart Foundation */}
              <div style={{
                marginTop: 14,
                backgroundColor: '#ffffff',
                border: '1px solid #f0f0f0',
                borderRadius: 8,
                padding: '12px 14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#111112' }}>
                      Donate to Flipkart Foundation
                    </div>
                    <div style={{ fontSize: 11, color: '#717478', marginTop: 2 }}>
                      Support transformative social work in India
                    </div>
                  </div>
                  <img
                    src="/assets/images/flipkart_foundation.png"
                    alt="Flipkart Foundation"
                    style={{ width: 68, height: 42, objectFit: 'cover', borderRadius: 4 }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  {[10, 20, 50, 100].map((amt) => {
                    const isSelected = donationAmount === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDonationAmount(isSelected ? 0 : amt)}
                        style={{
                          flex: 1,
                          padding: '6px 0',
                          borderRadius: 20,
                          border: isSelected ? '1.5px solid #2874f0' : '1px solid #d4d5d9',
                          backgroundColor: isSelected ? '#f0f5ff' : '#ffffff',
                          color: isSelected ? '#2874f0' : '#212121',
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: 'pointer'
                        }}
                      >
                        ₹{amt}
                      </button>
                    );
                  })}
                </div>
                <div style={{ fontSize: 10, color: '#888888', marginTop: 6 }}>
                  Note: GST and No cost EMI will not be applicable
                </div>
              </div>

              {/* Price Details Card */}
              <div style={{
                marginTop: 14,
                backgroundColor: '#f9f9fa',
                borderRadius: 8,
                padding: '12px 14px'
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111112', marginBottom: 10 }}>
                  Price Details
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#444444', marginBottom: 6 }}>
                  <span>MRP (incl. of all taxes)</span>
                  <span>₹{itemOrigTotal.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#444444', marginBottom: 6 }}>
                  <span>Fees ▾</span>
                  <span>₹{protectFee}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#444444', marginBottom: 6 }}>
                  <span>Delivery Charges</span>
                  <span style={{ color: '#108435', fontWeight: 600 }}>FREE</span>
                </div>
                {donationAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#444444', marginBottom: 6 }}>
                    <span>Flipkart Foundation Donation</span>
                    <span>₹{donationAmount}</span>
                  </div>
                )}
                <div style={{
                  borderTop: '1px solid #e0e0e0',
                  marginTop: 8,
                  paddingTop: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 14,
                  fontWeight: 800,
                  color: '#111112'
                }}>
                  <span>Total Amount</span>
                  <span>₹{finalPayable.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Green savings badge */}
              <div style={{
                marginTop: 10,
                backgroundColor: '#e8f5e9',
                color: '#108435',
                padding: '8px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                <span>🏷️</span>
                <span>You'll save ₹{totalSavings.toLocaleString('en-IN')} on this order!</span>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div style={{
              position: 'sticky',
              bottom: 0,
              backgroundColor: '#ffffff',
              borderTop: '1px solid #e0e0e0',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 50,
              boxShadow: '0 -2px 8px rgba(0,0,0,0.06)'
            }}>
              <div>
                <div style={{ fontSize: 11, color: '#717478', textDecoration: 'line-through' }}>
                  ₹{itemOrigTotal.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#111112', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span>₹{finalPayable.toLocaleString('en-IN')}</span>
                  <span style={{ fontSize: 11, color: '#888', fontWeight: 'normal' }}>ⓘ</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => goToStep('payment')}
                style={{
                  backgroundColor: '#ffc200',
                  color: '#111112',
                  border: 'none',
                  borderRadius: 4,
                  padding: '12px 32px',
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 3: PAYMENTS GATEWAY (User-Specified UPI & QR)
        ======================================================== */}
        {/* ========================================================
            STEP 3: PRODUCTION UPI PAYMENTS GATEWAY
        ======================================================== */}
        {currentStep === 'payment' && (
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', backgroundColor: '#ffffff' }}>
            {/* Top Bar with Stepper */}
            <CheckoutStepperHeader
              currentStep="payment"
              title="Payments"
              onBack={() => {
                if (window.history.state?.step === 'payment') {
                  window.history.back();
                } else {
                  setCurrentStep('summary');
                }
              }}
            />

            <UpiPaymentFlow
              amount={finalPayable}
              customerInfo={{
                name,
                phone,
                address: `${flat}, ${area}, ${city}, ${state} - ${pincode}`
              }}
              items={items.length > 0 ? items : [primaryItem]}
              onCancel={() => {
                if (window.history.state?.step === 'payment') {
                  window.history.back();
                } else {
                  setCurrentStep('summary');
                }
              }}
              onPaymentSuccess={(orderData) => {
                setCurrentStep('placed');
                if (onOrderSuccess) {
                  onOrderSuccess(orderData);
                }
                setTimeout(() => {
                  setCurrentStep('confirmed');
                }, 2600);
              }}
            />
          </div>
        )}

        {/* ========================================================
            STEP 4: ANIMATED ORDER PLACED (Screenshot 3)
        ======================================================== */}
        {currentStep === 'placed' && (
          <div
            onClick={() => setCurrentStep('confirmed')}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ebfbf2',
              padding: '24px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            {/* Concentric Glowing Rings Animation */}
            <div style={{ position: 'relative', width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Outer soft ring */}
              <div style={{
                position: 'absolute',
                width: 200,
                height: 200,
                borderRadius: '50%',
                backgroundColor: 'rgba(76, 175, 80, 0.12)',
                animation: 'pulse 2s infinite ease-in-out'
              }} />

              {/* Middle ring */}
              <div style={{
                position: 'absolute',
                width: 150,
                height: 150,
                borderRadius: '50%',
                backgroundColor: 'rgba(76, 175, 80, 0.22)'
              }} />

              {/* Floating lightning bolt coins ⚡ */}
              <div style={{ position: 'absolute', top: 20, right: 10, fontSize: 22 }}>🪙</div>
              <div style={{ position: 'absolute', top: 30, left: 15, fontSize: 20 }}>⚡</div>
              <div style={{ position: 'absolute', bottom: 35, left: 10, fontSize: 18 }}>⚡</div>
              <div style={{ position: 'absolute', bottom: 15, right: 25, fontSize: 20 }}>🪙</div>

              {/* Sparkles */}
              <div style={{ position: 'absolute', top: 40, left: 60, color: '#4caf50', fontSize: 16 }}>✦</div>
              <div style={{ position: 'absolute', top: 50, right: 55, color: '#4caf50', fontSize: 16 }}>✦</div>
              <div style={{ position: 'absolute', bottom: 50, left: 55, color: '#4caf50', fontSize: 16 }}>✦</div>

              {/* Main Green Center Circle with checkmark */}
              <div style={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                backgroundColor: '#57c77c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: 44,
                fontWeight: 900,
                boxShadow: '0 8px 24px rgba(87,199,124,0.4)',
                zIndex: 2
              }}>
                ✓
              </div>
            </div>

            {/* Title: Order Placed */}
            <h1 style={{
              fontSize: 26,
              fontWeight: 800,
              color: '#111112',
              margin: '24px 0 8px'
            }}>
              Order Placed
            </h1>

            {/* Subtitle: You saved ₹X */}
            <div style={{
              fontSize: 16,
              fontWeight: 600,
              color: '#2e7d32',
              marginTop: 4
            }}>
              You saved ₹{totalSavings.toLocaleString('en-IN')}
            </div>

            <div style={{ marginTop: 36, fontSize: 12, color: '#717478' }}>
              Tap anywhere to view receipt &gt;
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 5: ORDER RECEIPT & CONFIRMATION (Screenshot 4)
        ======================================================== */}
        {currentStep === 'confirmed' && (
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', backgroundColor: '#ffffff' }}>
            {/* Header with ✕ close button */}
            <header style={{
              padding: '16px 14px 10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <button
                onClick={onClose}
                aria-label="Close"
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 22,
                  fontWeight: 600,
                  color: '#212121',
                  cursor: 'pointer',
                  padding: 2
                }}
              >
                ✕
              </button>
            </header>

            {/* Content Body */}
            <div style={{ flex: 1, padding: '0 14px 20px' }}>
              {/* Thanks for shopping with us! */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                <div>
                  <h2 style={{ fontSize: 19, fontWeight: 700, color: '#111112', margin: '0 0 6px' }}>
                    Thanks for shopping with us!
                  </h2>
                  <div style={{ fontSize: 13, color: '#212121', marginTop: 2 }}>
                    Delivery by <strong>Mon, Oct 19th '26</strong>
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <span style={{ color: '#2874f0', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                      Track & manage order
                    </span>
                  </div>
                </div>

                {/* Right Green Seal */}
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  backgroundColor: '#e8f5e9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    backgroundColor: '#57c77c',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    fontWeight: 900
                  }}>
                    ✓
                  </div>
                </div>
              </div>

              {/* Scratch for iPhone 18 Pro Chance Banner */}
              <div style={{
                marginTop: 14,
                backgroundColor: '#fffdf6',
                border: '1px solid #ffecb3',
                borderRadius: 8,
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    backgroundColor: '#ff9800',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18
                  }}>
                    🎁
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#111112' }}>
                      Scratch for iPhone 18 Pro Chance!
                    </div>
                    <div style={{ fontSize: 11, color: '#717478' }}>
                      Exclusive festival lucky reward
                    </div>
                  </div>
                </div>
                <span style={{ color: '#2874f0', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  Claim Now &gt;
                </span>
              </div>

              {/* Delivery Timeline info */}
              <div style={{ marginTop: 16, fontSize: 14, fontWeight: 700, color: '#111112' }}>
                Delivery by Mon, Oct 19th '26
              </div>

              {/* Delivery Address Card (Matching Screenshot 4) */}
              <div style={{
                marginTop: 10,
                backgroundColor: '#f9f9fa',
                border: '1px solid #eeeeee',
                borderRadius: 8,
                padding: '14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <strong style={{ fontSize: 15, color: '#111112' }}>
                    {name || 'Customer'}
                  </strong>
                  <button
                    onClick={() => setCurrentStep('address')}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #2874f0',
                      color: '#2874f0',
                      padding: '4px 10px',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Change
                  </button>
                </div>

                <div style={{ fontSize: 13, color: '#444444', lineHeight: 1.45, marginTop: 6 }}>
                  {flat ? `${flat}, ` : ''}{area}
                </div>
                <div style={{ fontSize: 13, color: '#111112', fontWeight: 600, marginTop: 2 }}>
                  {city}, {state} - {pincode}
                </div>
                <div style={{ fontSize: 12, color: '#666666', marginTop: 8 }}>
                  Phone number: <strong>{phone}</strong>{altPhone ? `, ${altPhone}` : ''}
                </div>
              </div>

              {/* Continue Shopping Button */}
              <div style={{ marginTop: 20 }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    width: '100%',
                    backgroundColor: '#1c68f2',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 6,
                    height: 46,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(28,104,242,0.3)'
                  }}
                >
                  Continue Shopping
                </button>
              </div>

              {/* SMS tracking note */}
              <div style={{
                marginTop: 16,
                fontSize: 12,
                color: '#666666',
                lineHeight: 1.45
              }}>
                We have shared the order tracking with <strong>{phone}</strong> used in the address. Tracking link is shared via SMS.
              </div>

              {/* Manage who can access link */}
              <div style={{
                marginTop: 16,
                paddingTop: 12,
                borderTop: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 13,
                color: '#212121',
                cursor: 'pointer'
              }}>
                <span>Manage who can access</span>
                <span style={{ color: '#888888' }}>&gt;</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
