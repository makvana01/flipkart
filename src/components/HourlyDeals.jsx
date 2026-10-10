import React, { useRef, useState } from 'react';

export default function HourlyDeals({ onAddToCart }) {
  const scrollRef = useRef(null);

  const deals = [
    {
      id: 'h1',
      title: 'boAt earphones',
      tag: 'From ₹1,044*',
      price: 1044,
      origPrice: 3990,
      image: 'assets/images/6df257eb0ff7.jpg',
      locked: false
    },
    {
      id: 'h2',
      title: 'Toy cars & more',
      tag: 'Min. 55% Off',
      price: 1299,
      origPrice: 2999,
      image: 'assets/images/feebf38e05b9.jpg',
      locked: false
    },
    {
      id: 'h3',
      title: 'Fitness picks',
      tag: 'From ₹99',
      price: 99,
      origPrice: 499,
      image: 'assets/images/e7751965b214.jpg',
      locked: true,
      timeSlot: '12 PM TO 1 PM'
    },
    {
      id: 'h4',
      title: 'Crocs & more',
      tag: 'Min. 65% Off',
      price: 1199,
      origPrice: 3499,
      image: 'assets/images/22904e578c74.jpg',
      locked: true,
      timeSlot: '1 PM TO 2 PM'
    },
    {
      id: 'h5',
      title: 'Power tools',
      tag: 'Min. 40% Off',
      price: 899,
      origPrice: 1999,
      image: 'assets/images/b2ff04c102c4.jpg',
      locked: true,
      timeSlot: '2 PM TO 3 PM'
    },
    {
      id: 'h6',
      title: 'NIVEA & more',
      tag: 'Under ₹699',
      price: 299,
      origPrice: 699,
      image: 'assets/images/07a4a90d8a5c.jpg',
      locked: true,
      timeSlot: '3 PM TO 4 PM'
    }
  ];

  return (
    <div style={{
      maxWidth: 1400,
      margin: '16px auto',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      background: 'linear-gradient(180deg, #0d276b 0%, #081d52 100%)'
    }}>
      <div style={{ padding: '16px 20px 12px' }}>
        <h2 style={{ color: '#ffffff', fontSize: 22, fontWeight: 700, margin: 0 }}>
          New deals every hour
        </h2>
      </div>

      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: 12,
          padding: '0 16px 16px',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}
      >
        {deals.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              if (!item.locked && onAddToCart) onAddToCart(item);
            }}
            style={{
              flex: '0 0 178px',
              backgroundColor: '#ffffff',
              borderRadius: 12,
              padding: '12px 10px 14px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: item.locked ? 'default' : 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              position: 'relative',
              opacity: item.locked ? 0.95 : 1
            }}
          >
            <div style={{
              width: 140,
              height: 140,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              marginBottom: 10
            }}>
              <img
                src={item.image}
                alt={item.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  filter: item.locked ? 'blur(1.5px) brightness(0.85)' : 'none'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'assets/images/6df257eb0ff7.jpg';
                }}
              />

              {item.locked && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderRadius: 8,
                  color: '#ffffff'
                }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>🔒</div>
                  <div style={{
                    fontSize: 11,
                    fontWeight: 700,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    padding: '2px 8px',
                    borderRadius: 4
                  }}>
                    {item.timeSlot}
                  </div>
                </div>
              )}
            </div>

            <div style={{
              backgroundColor: '#0e38b1',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 6,
              textAlign: 'center',
              width: '100%',
              marginBottom: 8
            }}>
              {item.tag}
            </div>

            <div style={{
              fontSize: 13,
              fontWeight: 500,
              color: '#212121',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%'
            }}>
              {item.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
