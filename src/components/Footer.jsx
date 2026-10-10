import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#f8f9fa',
      borderTop: '1px solid #e9ecef',
      padding: '20px 14px calc(72px + env(safe-area-inset-bottom, 0px))',
      marginTop: 24,
      marginBottom: 0,
      textAlign: 'center',
      fontFamily: 'Inter, Roboto, sans-serif'
    }}>
      {/* Trust Badges */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 14,
        marginBottom: 10,
        color: '#616161',
        fontSize: 11,
        fontWeight: 500
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <span style={{ color: '#26a541', fontSize: 13, fontWeight: 700 }}>✓</span>
          <span>100% Original</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <span style={{ color: '#26a541', fontSize: 13, fontWeight: 700 }}>✓</span>
          <span>7-Day Return</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <span style={{ color: '#26a541', fontSize: 13, fontWeight: 700 }}>✓</span>
          <span>Safe Payments</span>
        </div>
      </div>

      {/* Quick Minimal Links */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 8,
        fontSize: 12,
        color: '#1254e7',
        fontWeight: 500
      }}>
        <a href="#about" onClick={(e) => e.preventDefault()} style={{ color: '#1254e7' }}>About Us</a>
        <span style={{ color: '#b0b0b0' }}>•</span>
        <a href="#help" onClick={(e) => e.preventDefault()} style={{ color: '#1254e7' }}>Help Center</a>
        <span style={{ color: '#b0b0b0' }}>•</span>
        <a href="#terms" onClick={(e) => e.preventDefault()} style={{ color: '#1254e7' }}>Terms</a>
        <span style={{ color: '#b0b0b0' }}>•</span>
        <a href="#privacy" onClick={(e) => e.preventDefault()} style={{ color: '#1254e7' }}>Privacy Policy</a>
      </div>

      {/* Copyright */}
      <div style={{
        fontSize: 11,
        color: '#878787',
        lineHeight: 1.4
      }}>
        © 2007-2026 Flipkart.com | All rights reserved
      </div>
    </footer>
  );
}
