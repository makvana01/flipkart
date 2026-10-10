import React, { useState } from 'react';

export default function MobileBottomNav({ 
  onOpenCart, 
  onOpenAccount, 
  onScrollToCategory, 
  cartCount = 0 
}) {
  const [activeNav, setActiveNav] = useState('Home');

  const handleNavClick = (name, action) => {
    setActiveNav(name);
    if (action) action();
  };

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: 480,
        width: '100%',
        height: 56,
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 1000,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }} 
      className="fk-mobile-bottom-bar"
    >
      {/* 1. Home (Active Blue) */}
      <div 
        onClick={() => handleNavClick('Home', () => window.scrollTo({ top: 0, behavior: 'smooth' }))}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flex: 1,
          height: '100%',
          userSelect: 'none'
        }}
      >
        {/* Solid Blue Home Icon */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill={activeNav === 'Home' ? '#1254e7' : 'none'} stroke={activeNav === 'Home' ? '#1254e7' : '#717478'} strokeWidth="1.8">
          <path d="M3 10.5L12 3l9 7.5v9.5a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z" strokeLinejoin="round" />
        </svg>
        <span style={{
          fontSize: 11,
          fontWeight: activeNav === 'Home' ? 600 : 500,
          color: activeNav === 'Home' ? '#1254e7' : '#1f1f1f',
          marginTop: 2,
          fontFamily: 'Inter, Roboto, sans-serif'
        }}>
          Home
        </span>
      </div>

      {/* 2. Categories (4 Rounded Squares Icon) */}
      <div 
        onClick={() => handleNavClick('Categories', onScrollToCategory)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flex: 1,
          height: '100%',
          userSelect: 'none'
        }}
      >
        {/* 4 Rounded Squares 2x2 Grid Icon */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={activeNav === 'Categories' ? '#1254e7' : '#717478'} strokeWidth="1.8">
          <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
        </svg>
        <span style={{
          fontSize: 11,
          fontWeight: activeNav === 'Categories' ? 600 : 500,
          color: activeNav === 'Categories' ? '#1254e7' : '#1f1f1f',
          marginTop: 2,
          fontFamily: 'Inter, Roboto, sans-serif'
        }}>
          Categories
        </span>
      </div>

      {/* 3. Account (User Outline Icon) */}
      <div 
        onClick={() => handleNavClick('Account', onOpenAccount)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flex: 1,
          height: '100%',
          userSelect: 'none'
        }}
      >
        {/* User Profile Outline Icon */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={activeNav === 'Account' ? '#1254e7' : '#717478'} strokeWidth="1.8">
          <circle cx="12" cy="7.5" r="3.8" />
          <path d="M5 20.5c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5" strokeLinecap="round" />
        </svg>
        <span style={{
          fontSize: 11,
          fontWeight: activeNav === 'Account' ? 600 : 500,
          color: activeNav === 'Account' ? '#1254e7' : '#1f1f1f',
          marginTop: 2,
          fontFamily: 'Inter, Roboto, sans-serif'
        }}>
          Account
        </span>
      </div>

      {/* 4. Cart (Shopping Cart Icon) */}
      <div 
        onClick={() => handleNavClick('Cart', onOpenCart)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flex: 1,
          height: '100%',
          position: 'relative',
          userSelect: 'none'
        }}
      >
        {/* Shopping Cart Outline Icon */}
        <div style={{ position: 'relative' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={activeNav === 'Cart' ? '#1254e7' : '#717478'} strokeWidth="1.8">
            <circle cx="9" cy="20" r="1.5" />
            <circle cx="18" cy="20" r="1.5" />
            <path d="M1 1.5h3.5l2.6 12.8a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6l1.6-8.3H5.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {cartCount > 0 && (
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
              {cartCount}
            </span>
          )}
        </div>
        <span style={{
          fontSize: 11,
          fontWeight: activeNav === 'Cart' ? 600 : 500,
          color: activeNav === 'Cart' ? '#1254e7' : '#1f1f1f',
          marginTop: 2,
          fontFamily: 'Inter, Roboto, sans-serif'
        }}>
          Cart
        </span>
      </div>
    </nav>
  );
}
