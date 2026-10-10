import React, { useState } from 'react';
import { festiveVibes } from '../data/products';

export default function FestiveVibes({ onAddToCart }) {
  const [activeTab, setActiveTab] = useState('Navratri');
  const tabs = ['Navratri', 'Durga puja', 'Karwachauth', 'Festive gifting'];
  const items = festiveVibes[activeTab] || [];

  return (
    <div style={{
      maxWidth: 1400,
      margin: '16px auto',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      background: 'linear-gradient(180deg, #153fb5 0%, #0d2875 100%)'
    }}>
      {/* Title */}
      <div style={{ padding: '16px 24px 8px' }}>
        <h2 style={{ color: '#ffffff', fontSize: 22, fontWeight: 700, margin: 0 }}>
          Festive vibes
        </h2>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 36,
        padding: '0 24px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.15)'
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.7)',
                fontWeight: isActive ? 600 : 500,
                fontSize: 14,
                position: 'relative',
                paddingBottom: 6
              }}
            >
              <span>{tab}</span>
              {isActive && (
                <div style={{
                  position: 'absolute',
                  bottom: -1,
                  left: 0,
                  right: 0,
                  height: 3,
                  backgroundColor: '#ffffff',
                  borderRadius: 2
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Tab Items */}
      <div style={{
        display: 'flex',
        gap: 12,
        padding: '16px',
        overflowX: 'auto',
        scrollbarWidth: 'none'
      }}>
        {items.map((prod) => (
          <div
            key={prod.id}
            onClick={() => onAddToCart && onAddToCart(prod)}
            style={{
              flex: '0 0 186px',
              backgroundColor: '#ffffff',
              borderRadius: 12,
              padding: '12px 10px 14px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{
              width: 140,
              height: 140,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10
            }}>
              <img
                src={prod.image}
                alt={prod.title}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'assets/images/737e96b99ca8.jpg';
                }}
              />
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
              {prod.tag}
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
              {prod.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
