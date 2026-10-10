import React from 'react';

export default function TravelBanner() {
  return (
    <div style={{
      maxWidth: 1400,
      margin: '12px auto',
      backgroundColor: '#ffffff',
      borderRadius: 4,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      cursor: 'pointer'
    }}>
      <div style={{
        background: 'linear-gradient(90deg, #1a237e 0%, #283593 40%, #0288d1 100%)',
        padding: '20px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{
              backgroundColor: '#ffc200',
              color: '#212121',
              padding: '2px 8px',
              borderRadius: 2,
              fontWeight: 700,
              fontSize: 11
            }}>
              FLIPKART TRAVEL
            </span>
            <span style={{ color: '#ffffff', opacity: 0.9, fontSize: 13 }}>Special IndiGo &amp; Air India Offers</span>
          </div>
          <h3 style={{ color: '#ffffff', fontSize: 24, fontWeight: 700, margin: '0 0 4px' }}>
            Book Domestic Flights with Zero Convenience Fee
          </h3>
          <p style={{ color: '#ffffff', fontSize: 16, fontWeight: 500, margin: 0, opacity: 0.95 }}>
            Flat 15% Instant Discount on First Booking • Use Code: <strong style={{ color: '#ffc200' }}>FLYFK</strong>
          </p>
        </div>

        <button style={{
          backgroundColor: '#ffffff',
          color: '#1a237e',
          border: 'none',
          padding: '10px 24px',
          borderRadius: 2,
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
        }}>
          BOOK NOW
        </button>
      </div>
    </div>
  );
}
