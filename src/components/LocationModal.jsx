import React, { useState } from 'react';

export default function LocationModal({ isOpen, onClose, onSetLocation }) {
  const [pincode, setPincode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const pin = pincode.trim();
    if (pin.length === 6) {
      fetch(`https://api.postalpincode.in/pincode/${pin}`)
        .then((r) => r.json())
        .then((data) => {
          if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
            const po = data[0].PostOffice[0];
            const city = po.District || po.Block || '';
            onSetLocation(`${city} ${pin}`.trim());
          } else {
            onSetLocation(`Pincode ${pin}`);
          }
          onClose();
        })
        .catch(() => {
          onSetLocation(`Pincode ${pin}`);
          onClose();
        });
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
            .then((r) => r.json())
            .then((data) => {
              const city = data.address?.city || data.address?.town || data.address?.suburb || 'Current Location';
              const postcode = data.address?.postcode || '';
              onSetLocation(`${city} ${postcode}`.trim());
              onClose();
            })
            .catch(() => {
              onSetLocation('Current Location');
              onClose();
            });
        },
        () => {
          onSetLocation('Current Location');
          onClose();
        }
      );
    } else {
      onSetLocation('Current Location');
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)'
        }}
      />

      <div style={{
        position: 'relative',
        zIndex: 10001,
        width: 440,
        backgroundColor: '#ffffff',
        borderRadius: 4,
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#212121' }}>
            Choose your delivery location
          </h3>
          <span 
            onClick={onClose}
            style={{ cursor: 'pointer', fontSize: 20, color: '#878787', fontWeight: 'bold' }}
          >
            ✕
          </span>
        </div>

        <div style={{ padding: '24px' }}>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: '#878787' }}>
            Enter your Pincode to check product availability and delivery options
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <input
              type="text"
              maxLength={6}
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Enter 6-digit Pincode"
              style={{
                flex: 1,
                padding: '10px 14px',
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                fontSize: 14,
                outline: 'none'
              }}
              autoFocus
            />
            <button
              type="submit"
              disabled={pincode.trim().length !== 6}
              style={{
                backgroundColor: pincode.trim().length === 6 ? '#2874f0' : '#c2c2c2',
                color: '#ffffff',
                padding: '0 20px',
                fontWeight: 600,
                fontSize: 14,
                borderRadius: 2,
                cursor: pincode.trim().length === 6 ? 'pointer' : 'not-allowed'
              }}
            >
              Submit
            </button>
          </form>

          <div
            onClick={handleUseCurrentLocation}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              color: '#2874f0',
              fontSize: 14,
              fontWeight: 600,
              padding: '8px 0'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2874f0" strokeWidth="2.2">
              <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
            </svg>
            <span>Use my current location</span>
          </div>
        </div>
      </div>
    </div>
  );
}
