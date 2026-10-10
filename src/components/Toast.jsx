import React from 'react';

export default function Toast({ message, icon = '✓', isVisible }) {
  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#212121',
      color: '#ffffff',
      padding: '12px 24px',
      borderRadius: 4,
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      zIndex: 20000,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      fontSize: 14,
      fontWeight: 500,
      fontFamily: 'Roboto, Arial, sans-serif',
      animation: 'toastSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <span style={{
        backgroundColor: '#388e3c',
        color: '#ffffff',
        width: 20,
        height: 20,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 'bold'
      }}>
        {icon}
      </span>
      <span>{message}</span>
    </div>
  );
}
