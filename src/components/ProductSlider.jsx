import React, { useRef, useState, useEffect } from 'react';

export default function ProductSlider({ 
  title, 
  subtitle = "Grab Now Before Stock Ends",
  items, 
  onProductClick,
  onAddToCart,
  onBuyNow
}) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const newLeft = scrollLeft > 10;
    const newRight = scrollLeft < scrollWidth - clientWidth - 10;
    setCanScrollLeft(prev => (prev !== newLeft ? newLeft : prev));
    setCanScrollRight(prev => (prev !== newRight ? newRight : prev));
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [items]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -360, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 360, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div style={{
      maxWidth: 1400,
      margin: '12px auto',
      backgroundColor: '#ffffff',
      borderRadius: 4,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Real Flipkart White Section Header */}
      <div style={{
        padding: '16px 20px 14px',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8
      }}>
        <div>
          <h2 style={{
            fontSize: 20,
            fontWeight: 600,
            color: '#212121',
            margin: '0 0 2px',
            letterSpacing: -0.2
          }}>
            {title}
          </h2>
          <span style={{ fontSize: 13, color: '#878787' }}>
            {subtitle} • <span style={{ color: '#388e3c', fontWeight: 600 }}>Cash on Delivery Available</span>
          </span>
        </div>

        <button
          onClick={scrollRight}
          style={{
            backgroundColor: '#2874f0',
            color: '#ffffff',
            border: 'none',
            borderRadius: 2,
            padding: '7px 16px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(40,116,240,0.2)'
          }}
        >
          VIEW ALL &gt;
        </button>
      </div>

      {/* Horizontal Product Box Grid */}
      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        style={{
          display: 'flex',
          gap: 16,
          padding: '16px 20px 20px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollBehavior: 'smooth'
        }}
      >
        {items.map((prod) => (
          <div
            key={prod.id}
            style={{
              flex: '0 0 205px',
              backgroundColor: '#ffffff',
              border: '1px solid #e9e9e9',
              borderRadius: 4,
              padding: '14px 12px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s ease, transform 0.2s ease',
              position: 'relative'
            }}
            onClick={() => onProductClick && onProductClick(prod)}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Real Product Image Box */}
            <div style={{
              width: '100%',
              height: 160,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
              padding: 6
            }}>
              <img
                src={prod.image}
                alt={prod.title}
                loading="lazy"
                decoding="async"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/images/3fbe25902b48.jpg';
                }}
              />
            </div>

            {/* Product Details */}
            <div>
              {/* Product Title */}
              <div style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#212121',
                lineHeight: 1.35,
                height: 38,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                marginBottom: 6
              }}>
                {prod.title}
              </div>

              {/* Star Rating Badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 8
              }}>
                <span style={{
                  backgroundColor: '#388e3c',
                  color: '#ffffff',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <span>{prod.rating || 4.8}</span>
                  <span style={{ fontSize: 9 }}>★</span>
                </span>
                <span style={{ fontSize: 12, color: '#878787' }}>
                  ({prod.ratingsCount || '10,000+'})
                </span>
              </div>

              {/* Price & Discount */}
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 8,
                marginBottom: 10,
                flexWrap: 'wrap'
              }}>
                <span style={{ fontSize: 17, fontWeight: 700, color: '#212121' }}>
                  ₹{prod.price.toLocaleString('en-IN')}
                </span>
                {prod.origPrice && (
                  <span style={{ fontSize: 12, color: '#878787', textDecoration: 'line-through' }}>
                    ₹{prod.origPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span style={{ fontSize: 12, color: '#388e3c', fontWeight: 700 }}>
                  {prod.discount || 'Special Price'}
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 4 }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart && onAddToCart(prod);
                }}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #ff9f00',
                  color: '#ff9f00',
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '7px 4px',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ff9f00';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.color = '#ff9f00';
                }}
              >
                + Cart
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBuyNow && onBuyNow(prod);
                }}
                style={{
                  backgroundColor: '#fb641b',
                  border: '1px solid #fb641b',
                  color: '#ffffff',
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '7px 4px',
                  borderRadius: 2,
                  cursor: 'pointer'
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Prev Navigation Arrow */}
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          style={{
            position: 'absolute',
            left: 0,
            top: '52%',
            transform: 'translateY(-50%)',
            width: 40,
            height: 80,
            borderRadius: '0 4px 4px 0',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <svg width="10" height="18" viewBox="0 0 13 23" fill="none">
            <path d="M11.4 1.4L1.4 11.4L11.4 21.4" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {/* Next Navigation Arrow */}
      {canScrollRight && (
        <button
          onClick={scrollRight}
          style={{
            position: 'absolute',
            right: 0,
            top: '52%',
            transform: 'translateY(-50%)',
            width: 40,
            height: 80,
            borderRadius: '4px 0 0 4px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <svg width="10" height="18" viewBox="0 0 13 23" fill="none">
            <path d="M1.4 1.4L11.4 11.4L1.4 21.4" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}
