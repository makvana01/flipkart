import React, { useState } from 'react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onRemoveItem, 
  onPlaceOrder,
  onUpdateQuantity,
  onBuyNow,
  deliveryLocation = 'Select delivery location'
}) {
  const [hasProtection, setHasProtection] = useState(false);
  const [isProtectionDismissed, setIsProtectionDismissed] = useState(false);

  if (!isOpen) return null;

  // Calculations
  const getItemOrigPrice = (item) => {
    if (item.origPrice && Number(item.origPrice) > Number(item.price)) {
      return Number(item.origPrice);
    }
    if (item.discount && typeof item.discount === 'string') {
      const match = item.discount.match(/(\d+)%/);
      if (match) {
        const pct = parseInt(match[1], 10);
        if (pct > 0 && pct < 100) {
          return Math.round(Number(item.price) / (1 - pct / 100));
        }
      }
    }
    return Math.round((Number(item.price) || 0) * 1.4);
  };

  const getItemProtectFee = (item) => {
    if (item.protectFee !== undefined && item.protectFee !== null) {
      return Number(item.protectFee);
    }
    const p = Number(item.price) || 0;
    return p > 20000 ? 256 : p > 5000 ? 149 : p > 1000 ? 99 : 49;
  };

  const rawItemTotal = cartItems.reduce((acc, item) => acc + (getItemOrigPrice(item) * (Number(item.quantity) || 1)), 0);
  const itemsDiscountedTotal = cartItems.reduce((acc, item) => acc + ((Number(item.price) || 0) * (Number(item.quantity) || 1)), 0);
  const discountTotal = Math.max(0, rawItemTotal - itemsDiscountedTotal);
  const protectPromiseFee = cartItems.length > 0 ? Math.max(...cartItems.map(getItemProtectFee)) : 0;
  const tabletProtectionFee = hasProtection ? 299 : 0;
  const grandTotal = itemsDiscountedTotal + protectPromiseFee + tabletProtectionFee;

  return (
    <div 
      aria-label="My Cart View"
      style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        height: '100vh',
        backgroundColor: '#ffffff',
        zIndex: 100002,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 0 24px rgba(0,0,0,0.15)',
        fontFamily: 'Inter, Roboto, sans-serif',
        overflow: 'hidden'
      }}
    >
      {/* 1. TOP HEADER: ← My Cart */}
      <div style={{
        height: 52,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 16,
        flexShrink: 0
      }}>
        {/* Back Arrow Button */}
        <button
          onClick={onClose}
          aria-label="Back to shopping"
          style={{
            background: 'none',
            border: 'none',
            padding: 4,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1f1f1f'
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1f1f1f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>

        <h1 style={{
          fontSize: 18,
          fontWeight: 700,
          color: '#1f1f1f',
          margin: 0,
          letterSpacing: '-0.2px'
        }}>
          My Cart
        </h1>
      </div>

      {/* SCROLLABLE CART CONTENT */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        backgroundColor: '#f1f2f4',
        WebkitOverflowScrolling: 'touch'
      }}>
        {/* 3. OFFER PROGRESS BANNER (Soft yellow) */}
        {cartItems.length > 0 && (
          <div style={{
            backgroundColor: '#fffde7',
            borderBottom: '1px solid #fff9c4',
            padding: '10px 16px',
            marginBottom: 8
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 6
            }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#1f1f1f' }}>
                Add 1 more item to get <strong style={{ color: '#26a541' }}>2% off</strong>
              </span>
              <button
                onClick={onClose}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #c2d6ff',
                  color: '#1254e7',
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '3px 14px',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}
              >
                Add
              </button>
            </div>

            {/* Blue Progress Bar */}
            <div style={{
              width: '100%',
              height: 4,
              backgroundColor: '#e0e0e0',
              borderRadius: 2,
              overflow: 'hidden'
            }}>
              <div style={{
                width: '50%',
                height: '100%',
                backgroundColor: '#1254e7',
                borderRadius: 2
              }} />
            </div>
          </div>
        )}

        {/* 4. CART ITEMS LIST */}
        {cartItems.length === 0 ? (
          <div style={{
            backgroundColor: '#ffffff',
            padding: '50px 20px',
            textAlign: 'center',
            margin: '8px 0'
          }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🛍️</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#212121', margin: '0 0 6px' }}>Your Cart is Empty</h3>
            <p style={{ fontSize: 13, color: '#717478', margin: '0 0 16px' }}>Add items to see them here.</p>
            <button
              onClick={onClose}
              style={{
                backgroundColor: '#2874f0',
                color: '#ffffff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: 4,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Shop Now
            </button>
          </div>
        ) : (
          cartItems.map((item) => {
            const itemPrice = Number(item.price) || 0;
            const itemOrig = getItemOrigPrice(item);
            const discountPct = Math.max(5, Math.round(((itemOrig - itemPrice) / itemOrig) * 100));
            const itemProtectFee = getItemProtectFee(item);

            return (
              <div 
                key={item.id}
                style={{
                  backgroundColor: '#ffffff',
                  marginBottom: 8,
                  padding: '14px 16px 0'
                }}
              >
                {/* Main Item Row */}
                <div style={{ display: 'flex', gap: 14, marginBottom: 10 }}>
                  {/* Left Column: Image & Qty Dropdown */}
                  <div style={{ width: 80, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: 76,
                      height: 80,
                      backgroundColor: '#ffffff',
                      border: '1px solid #ebebeb',
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 4,
                      overflow: 'hidden',
                      marginBottom: 8
                    }}>
                      <img
                        src={item.image || '/assets/images/cart_ipad.png'}
                        alt={item.title}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/assets/images/cart_ipad.png';
                        }}
                      />
                    </div>

                    {/* Quantity Picker Pill */}
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      border: '1px solid #d4d5d9',
                      borderRadius: 4,
                      backgroundColor: '#ffffff',
                      padding: '1px 3px'
                    }}>
                      <select
                        value={item.quantity || 1}
                        onChange={(e) => onUpdateQuantity && onUpdateQuantity(item.id, Number(e.target.value))}
                        style={{
                          border: 'none',
                          outline: 'none',
                          backgroundColor: 'transparent',
                          fontSize: 12,
                          fontWeight: 600,
                          color: '#212121',
                          cursor: 'pointer'
                        }}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                          <option key={n} value={n}>Qty: {n}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Right Column: Title, Ratings, Price, Fee */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Title */}
                    <h2 style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: '#212121',
                      margin: '0 0 4px',
                      lineHeight: '18px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }} title={item.fullTitle || item.title}>
                      {item.title}
                    </h2>

                    {/* Ratings & Flipkart Assured row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginBottom: 6,
                      flexWrap: 'wrap'
                    }}>
                      {/* Green Stars */}
                      <span style={{ color: '#26a541', fontSize: 11, letterSpacing: 0.5 }}>
                        ★★★★☆
                      </span>
                      <span style={{ fontSize: 11, color: '#717478', fontWeight: 500 }}>
                        {item.rating || 4.7} • ({item.ratingsCount || '16,363'})
                      </span>

                      {/* Flipkart Assured Badge */}
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 2,
                        marginLeft: 2
                      }}>
                        <span style={{
                          backgroundColor: '#002f6c',
                          color: '#ffc200',
                          fontWeight: 900,
                          fontSize: 8,
                          fontStyle: 'italic',
                          padding: '1px 3px',
                          borderRadius: 2
                        }}>
                          f
                        </span>
                        <span style={{
                          color: '#002f6c',
                          fontWeight: 800,
                          fontStyle: 'italic',
                          fontSize: 10,
                          letterSpacing: '-0.2px'
                        }}>
                          Assured
                        </span>
                      </span>
                    </div>

                    {/* Price Row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 8,
                      marginBottom: 4
                    }}>
                      <span style={{ color: '#26a541', fontSize: 13, fontWeight: 700 }}>
                        ↓{discountPct}%
                      </span>
                      {itemOrig && (
                        <span style={{
                          color: '#878787',
                          textDecoration: 'line-through',
                          fontSize: 13
                        }}>
                          ₹{itemOrig.toLocaleString('en-IN')}
                        </span>
                      )}
                      <span style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: '#212121'
                      }}>
                        ₹{itemPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Protect Promise Fee row */}
                    <div style={{
                      fontSize: 11,
                      color: '#212121',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <span>+ ₹{itemProtectFee} Protect Promise Fee</span>
                      <span style={{ color: '#717478', cursor: 'pointer', fontSize: 12 }}>ⓘ</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Date */}
                <div style={{
                  fontSize: 12,
                  color: '#212121',
                  padding: '4px 0 10px',
                  fontWeight: 500
                }}>
                  {item.deliveryDate || 'Delivery by Fri Oct 16'}
                </div>

                {/* 3 Action Buttons Row: Save for later | Remove | Buy this now */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  borderTop: '1px solid #f0f0f0',
                  margin: '0 -16px'
                }}>
                  {/* Save for later */}
                  <button
                    onClick={() => onRemoveItem && onRemoveItem(item.id)}
                    style={{
                      padding: '12px 6px',
                      background: 'none',
                      border: 'none',
                      borderRight: '1px solid #f0f0f0',
                      fontSize: 12,
                      fontWeight: 500,
                      color: '#424242',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#717478" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <line x1="9" y1="12" x2="15" y2="12" />
                      <line x1="12" y1="9" x2="12" y2="15" />
                    </svg>
                    <span>Save for later</span>
                  </button>

                  {/* Remove */}
                  <button
                    onClick={() => onRemoveItem && onRemoveItem(item.id)}
                    style={{
                      padding: '12px 6px',
                      background: 'none',
                      border: 'none',
                      borderRight: '1px solid #f0f0f0',
                      fontSize: 12,
                      fontWeight: 500,
                      color: '#424242',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#717478" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-2 14H7L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                    </svg>
                    <span>Remove</span>
                  </button>

                  {/* Buy this now */}
                  <button
                    onClick={() => onBuyNow ? onBuyNow(item) : onPlaceOrder([item])}
                    style={{
                      padding: '12px 6px',
                      background: 'none',
                      border: 'none',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#1254e7',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1254e7" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    <span>Buy this now</span>
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* 5. COMPLETE TABLET PROTECTION (2 YEAR) ADD-ON BOX */}
        {cartItems.length > 0 && !isProtectionDismissed && (
          <div style={{
            backgroundColor: '#ffffff',
            margin: '8px 10px',
            borderRadius: 10,
            border: '1px solid #e1effe',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            overflow: 'hidden'
          }}>
            {/* Box Header */}
            <div style={{
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f6faff',
              borderBottom: '1px solid #eaf3fe'
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1f1f1f' }}>
                Complete Tablet Protection (2 Year)
              </span>
              <button
                onClick={() => setIsProtectionDismissed(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 15,
                  color: '#717478',
                  cursor: 'pointer',
                  padding: 2
                }}
              >
                ✕
              </button>
            </div>

            {/* Box Content */}
            <div style={{
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img
                  src="/assets/images/tablet_protection.png"
                  alt="Protection"
                  style={{
                    width: 38,
                    height: 38,
                    objectFit: 'contain'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1f1f1f', marginBottom: 2 }}>
                    Total Tablet Protection 2 Years
                  </div>
                  <div style={{ fontSize: 12, color: '#717478' }}>
                    ₹299 • 2 Years
                  </div>
                </div>
              </div>

              <button
                onClick={() => setHasProtection(!hasProtection)}
                style={{
                  backgroundColor: hasProtection ? '#26a541' : '#1254e7',
                  color: '#ffffff',
                  border: 'none',
                  padding: '6px 18px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
              >
                {hasProtection ? 'Added ✓' : 'Add'}
              </button>
            </div>
          </div>
        )}

        {/* 6. PRICE DETAILS SECTION */}
        {cartItems.length > 0 && (
          <div style={{
            backgroundColor: '#ffffff',
            margin: '8px 10px',
            borderRadius: 12,
            border: '1px solid #ebebeb',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            padding: '14px 16px'
          }}>
            <h3 style={{
              fontSize: 15,
              fontWeight: 700,
              color: '#1f1f1f',
              margin: '0 0 12px',
              letterSpacing: '-0.2px'
            }}>
              Price Details
            </h3>

            {/* Row 1: Price (item count) */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 13,
              color: '#212121',
              marginBottom: 10
            }}>
              <span style={{ borderBottom: '1px dotted #9e9e9e' }}>
                Price ({cartItems.reduce((acc, i) => acc + (i.quantity || 1), 0)} item{cartItems.reduce((acc, i) => acc + (i.quantity || 1), 0) > 1 ? 's' : ''})
              </span>
              <span>₹{rawItemTotal.toLocaleString('en-IN')}</span>
            </div>

            {/* Row 2: Discount */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 13,
              marginBottom: 10
            }}>
              <span>Discount</span>
              <span style={{ color: '#26a541', fontWeight: 600 }}>
                - ₹{discountTotal.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Row 3: Delivery Charges */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 13,
              marginBottom: 10
            }}>
              <span>Delivery Charges</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#878787', textDecoration: 'line-through' }}>₹70</span>
                <span style={{ color: '#26a541', fontWeight: 600 }}>FREE</span>
              </div>
            </div>

            {/* Row 4: Protect Promise Fee */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 13,
              color: '#212121',
              marginBottom: hasProtection ? 10 : 0
            }}>
              <span style={{ borderBottom: '1px dotted #9e9e9e' }}>
                Protect Promise Fee
              </span>
              <span>₹{protectPromiseFee.toLocaleString('en-IN')}</span>
            </div>

            {/* Optional Row: Tablet Protection */}
            {hasProtection && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 13,
                color: '#212121'
              }}>
                <span>Tablet Protection (2 Years)</span>
                <span>₹299</span>
              </div>
            )}

            {/* Dashed Divider */}
            <div style={{
              borderTop: '1px dashed #e0e0e0',
              margin: '12px 0 10px'
            }} />

            {/* Row 5: Total Amount */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 15,
              fontWeight: 700,
              color: '#1f1f1f',
              padding: '2px 0'
            }}>
              <span>Total Amount</span>
              <span style={{ fontSize: 16 }}>₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>

            {/* Savings Banner */}
            {discountTotal > 0 && (
              <div style={{
                borderTop: '1px solid #f0f0f0',
                marginTop: 10,
                paddingTop: 10,
                fontSize: 13,
                fontWeight: 600,
                color: '#26a541',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                <span>You will save ₹{discountTotal.toLocaleString('en-IN')} on this order</span>
              </div>
            )}
          </div>
        )}

        {/* 7. ALL LOCATIONS AVAILABILITY CONFIRMATION */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '10px 16px 18px',
            fontSize: 12,
            color: '#26a541',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <span style={{ fontSize: 14 }}>✓</span>
            <span>All items are in stock &amp; available for delivery to all locations across India</span>
          </div>
        )}
      </div>

      {/* 8. STICKY BOTTOM CHECKOUT BAR */}
      {cartItems.length > 0 && (
        <div style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e0e0e0',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          boxShadow: '0 -2px 8px rgba(0,0,0,0.06)'
        }}>
          {/* Price display */}
          <div>
            <div style={{
              fontSize: 12,
              color: '#878787',
              textDecoration: 'line-through',
              lineHeight: 1
            }}>
              ₹{rawItemTotal.toLocaleString('en-IN')}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              marginTop: 2
            }}>
              <span style={{
                fontSize: 18,
                fontWeight: 800,
                color: '#212121'
              }}>
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: 13, color: '#717478', cursor: 'pointer' }}>ⓘ</span>
            </div>
          </div>

          {/* Place Order Button (Active Flipkart Orange) */}
          <button
            onClick={() => onPlaceOrder(cartItems)}
            style={{
              backgroundColor: '#fb641b',
              color: '#ffffff',
              border: 'none',
              padding: '12px 32px',
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(251,100,27,0.3)',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f4511e'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fb641b'}
          >
            Place Order
          </button>
        </div>
      )}

      {/* 9. BOTTOM NAVIGATION (Home, Categories, Account, Cart) */}
      <nav 
        aria-label="Cart Bottom Navigation"
        style={{
          height: 56,
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          flexShrink: 0
        }}
      >
        {/* Home */}
        <div 
          onClick={onClose}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            flex: 1
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#717478" strokeWidth="1.8">
            <path d="M3 10.5L12 3l9 7.5v9.5a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 11, color: '#1f1f1f', marginTop: 2, fontWeight: 500 }}>
            Home
          </span>
        </div>

        {/* Categories */}
        <div 
          onClick={onClose}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            flex: 1
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#717478" strokeWidth="1.8">
            <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
            <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
            <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
            <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
          </svg>
          <span style={{ fontSize: 11, color: '#1f1f1f', marginTop: 2, fontWeight: 500 }}>
            Categories
          </span>
        </div>

        {/* Account */}
        <div 
          onClick={onClose}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            flex: 1
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#717478" strokeWidth="1.8">
            <circle cx="12" cy="7.5" r="3.8" />
            <path d="M5 20.5c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 11, color: '#1f1f1f', marginTop: 2, fontWeight: 500 }}>
            Account
          </span>
        </div>

        {/* Cart (Active) */}
        <div 
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            flex: 1
          }}
        >
          <div style={{ position: 'relative' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1254e7" strokeWidth="2">
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M1 1.5h3.5l2.6 12.8a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6l1.6-8.3H5.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{
              position: 'absolute',
              top: -6,
              right: -9,
              backgroundColor: '#ff6161',
              color: '#ffffff',
              fontSize: 10,
              fontWeight: 700,
              borderRadius: 10,
              minWidth: 16,
              height: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px'
            }}>
              {cartItems.reduce((acc, i) => acc + (i.quantity || 1), 0)}
            </span>
          </div>
          <span style={{ fontSize: 11, color: '#1254e7', marginTop: 2, fontWeight: 600 }}>
            Cart
          </span>
        </div>
      </nav>
    </div>
  );
}
