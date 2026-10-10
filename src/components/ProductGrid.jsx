import React from 'react';

export default function ProductGrid({ products, title, onProductClick, onAddToCart, onBuyNow }) {
  if (!products || products.length === 0) return null;

  return (
    <div style={{
      padding: '8px 10px 20px',
      maxWidth: 1200,
      margin: '0 auto'
    }}>
      {title && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
          padding: '0 4px'
        }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#1f1f1f',
            margin: 0,
            fontFamily: 'Inter, Roboto, sans-serif'
          }}>
            {title}
          </h2>
          <span style={{ fontSize: 12, color: '#717478', fontWeight: 500 }}>
            {products.length} Items
          </span>
        </div>
      )}

      {/* 2-Column Responsive Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 10
      }}>
        {products.map((item) => {
          const isCover = item.imageFit === 'cover' || item.id?.startsWith('prod_') || item.category === 'Fashion';

          return (
            <div
              key={item.id}
              onClick={() => onProductClick && onProductClick(item)}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 16, // Beautiful rounded corner container
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                border: '1px solid #e8eaed',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
            >
              {/* Image Container with Round Top Corners */}
              <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1 / 1.15',
                backgroundColor: '#f8f9fa',
                overflow: 'hidden',
                borderRadius: '16px 16px 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: isCover ? 0 : 8
              }}>
                {/* Product Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: isCover ? 'cover' : 'contain',
                    display: 'block'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/images/smartbuy_case.png';
                  }}
                />

                {/* Top-Left Badge (Value 365, Hero Deal, or Sale Badge) */}
                {item.badge && (
                  <div style={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    backgroundColor: item.badgeColor || '#e3122e',
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 6,
                    letterSpacing: '0.2px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    zIndex: 2
                  }}>
                    {item.badge}
                  </div>
                )}

                {/* Bottom-Left Rating Pill */}
                {(item.ratingPill || item.rating) && (
                  <div style={{
                    position: 'absolute',
                    bottom: 8,
                    left: 8,
                    backgroundColor: '#ffffff',
                    borderRadius: 10,
                    padding: '2px 6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#1f1f1f',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
                    zIndex: 2
                  }}>
                    <span>{item.rating || 4.5}</span>
                    <span style={{ color: '#26a541', fontSize: 10 }}>★</span>
                    {item.ratingsCount && (
                      <span style={{ color: '#717478', fontSize: 10, marginLeft: 2 }}>
                        ({item.ratingsCount})
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Product Details with Round Bottom Corners */}
              <div style={{
                padding: '9px 10px 11px',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'space-between',
                backgroundColor: '#ffffff',
                borderRadius: '0 0 16px 16px'
              }}>
                <div>
                  {/* Title */}
                  <h3 style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#212121',
                    margin: '0 0 5px 0',
                    lineHeight: '17px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontFamily: 'Inter, Roboto, sans-serif'
                  }} title={item.fullTitle || item.title}>
                    {item.title}
                  </h3>

                  {/* Price Row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginBottom: 3,
                    flexWrap: 'wrap'
                  }}>
                    {item.origPrice && (
                      <span style={{
                        color: '#878787',
                        textDecoration: 'line-through',
                        fontSize: 12,
                        fontWeight: 400
                      }}>
                        ₹{item.origPrice.toLocaleString('en-IN')}
                      </span>
                    )}

                    {item.priceStyle === 'red-pill' ? (
                      <span style={{
                        backgroundColor: '#e3122e',
                        color: '#ffffff',
                        fontSize: 12,
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: 4
                      }}>
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                    ) : (
                      <span style={{
                        color: '#212121',
                        fontSize: 14,
                        fontWeight: 700
                      }}>
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                    )}

                    {item.discount && item.priceStyle !== 'red-pill' && (
                      <span style={{
                        color: '#388e3c',
                        fontSize: 11,
                        fontWeight: 700
                      }}>
                        {item.discount}
                      </span>
                    )}
                  </div>

                  {/* Offer Row */}
                  {item.offer ? (
                    <div style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#1254e7',
                      lineHeight: '15px',
                      fontFamily: 'Inter, Roboto, sans-serif'
                    }}>
                      {item.offer}
                    </div>
                  ) : (
                    <div style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#388e3c',
                      lineHeight: '15px',
                      fontFamily: 'Inter, Roboto, sans-serif'
                    }}>
                      Bank &amp; Special Offers
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
