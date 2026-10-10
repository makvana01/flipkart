import React from 'react';
import { categories } from '../data/products';

export default function CategoryBar({ activeCategory = 'For You', onSelectCategory }) {
  return (
    <nav style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
      padding: '6px 0 2px',
      overflowX: 'auto',
      whiteSpace: 'nowrap',
      width: '100%',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      WebkitOverflowScrolling: 'touch'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: 6,
        padding: '0 8px',
        minWidth: 'max-content'
      }}>
        {categories.map((cat, idx) => {
          const isActive = activeCategory === cat.name;
          return (
            <div
              key={idx}
              onClick={() => {
                if (onSelectCategory) onSelectCategory(cat.name);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '2px 4px',
                position: 'relative',
                minWidth: 64,
                userSelect: 'none'
              }}
            >
              {/* Icon Container */}
              <div style={{
                backgroundColor: isActive ? '#eaf3fe' : 'transparent',
                borderRadius: 12,
                padding: '4px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 40,
                transition: 'all 0.15s ease'
              }}>
                <img
                  src={cat.icon}
                  alt={cat.name}
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: 32,
                    height: 32,
                    objectFit: 'contain',
                    display: 'block'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/images/63c46931a5c1.svg';
                  }}
                />
              </div>

              {/* Text Label */}
              <span style={{
                fontSize: 12,
                lineHeight: '16px',
                fontWeight: isActive ? 700 : 500,
                color: '#1f1f1f',
                marginTop: 2,
                textAlign: 'center',
                fontFamily: 'Inter, Roboto, sans-serif'
              }}>
                {cat.name}
              </span>

              {/* Active Blue Indicator Underline */}
              {isActive ? (
                <div style={{
                  width: 34,
                  height: 3,
                  backgroundColor: '#1254e7',
                  borderRadius: '2px 2px 0 0',
                  marginTop: 3
                }} />
              ) : (
                <div style={{ height: 3, marginTop: 3 }} />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
