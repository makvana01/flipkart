import React, { useState } from 'react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [step, setStep] = useState('input'); // 'input' or 'otp'
  const [otp, setOtp] = useState('');

  if (!isOpen) return null;

  const isValid = isEmailMode
    ? phoneNumber.includes('@') && phoneNumber.includes('.')
    : phoneNumber.trim().length >= 10;

  const handleContinue = (e) => {
    e.preventDefault();
    if (!isValid) return;

    if (step === 'input') {
      setStep('otp');
    } else {
      onLoginSuccess(phoneNumber);
      onClose();
      setStep('input');
      setPhoneNumber('');
      setOtp('');
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
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(2px)'
        }}
      />

      {/* Modal Card */}
      <div style={{
        position: 'relative',
        zIndex: 10001,
        width: 750,
        height: 520,
        backgroundColor: '#ffffff',
        borderRadius: 4,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* Close Button '✕' */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 14,
            right: 18,
            background: 'none',
            fontSize: 22,
            color: '#878787',
            fontWeight: 700,
            zIndex: 10,
            cursor: 'pointer'
          }}
        >
          ✕
        </button>

        {/* Left Blue Panel */}
        <div style={{
          width: 300,
          backgroundColor: '#2874f0',
          padding: '40px 32px',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 600, margin: '0 0 16px' }}>
              {step === 'otp' ? 'Verify OTP' : 'Login'}
            </h2>
            <p style={{ fontSize: 16, lineHeight: 1.5, color: '#dbdbdb', margin: 0 }}>
              {step === 'otp' 
                ? `Please enter the OTP sent to ${phoneNumber}`
                : 'Get access to your Orders, Wishlist and Recommendations'}
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <svg width="180" height="120" viewBox="0 0 200 140" fill="none">
              <rect x="25" y="20" width="150" height="90" rx="6" fill="#ffffff" fillOpacity="0.95"/>
              <rect x="35" y="30" width="130" height="60" rx="3" fill="#e8f0fe"/>
              <circle cx="100" cy="55" r="16" fill="#2874f0"/>
              <path d="M80 84c0-11 9-20 20-20s20 9 20 20H80z" fill="#2874f0"/>
              <rect x="15" y="112" width="170" height="8" rx="4" fill="#ffffff"/>
            </svg>
          </div>
        </div>

        {/* Right White Panel */}
        <div style={{
          flex: 1,
          padding: '40px 48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 500, color: '#212121', margin: '0 0 8px' }}>
              Log in for the best experience
            </h3>
            <p style={{ fontSize: 13, color: '#878787', margin: '0 0 32px' }}>
              {step === 'otp' ? 'Enter the 6-digit OTP' : 'Enter your phone number to continue'}
            </p>

            {step === 'input' ? (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #2874f0',
                  borderRadius: 2,
                  padding: '8px 12px',
                  marginBottom: 16
                }}>
                  {!isEmailMode && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 14,
                      color: '#212121',
                      borderRight: '1px solid #e0e0e0',
                      paddingRight: 10,
                      marginRight: 10
                    }}>
                      <span>+91</span>
                      <span style={{ fontSize: 10, color: '#878787' }}>▼</span>
                    </div>
                  )}
                  <input
                    type={isEmailMode ? 'email' : 'tel'}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={isEmailMode ? 'Enter Email ID' : 'Enter Phone Number'}
                    style={{
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      fontSize: 15,
                      color: '#212121'
                    }}
                    autoFocus
                  />
                </div>

                <div 
                  onClick={() => {
                    setIsEmailMode(!isEmailMode);
                    setPhoneNumber('');
                  }}
                  style={{
                    color: '#2874f0',
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    marginBottom: 24,
                    display: 'inline-block'
                  }}
                >
                  {isEmailMode ? 'Use Phone Number' : 'Use Email-ID'}
                </div>
              </>
            ) : (
              <div style={{ marginBottom: 24 }}>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP (e.g. 123456)"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #2874f0',
                    borderRadius: 2,
                    fontSize: 16,
                    letterSpacing: 4,
                    outline: 'none'
                  }}
                  autoFocus
                />
              </div>
            )}

            <p style={{ fontSize: 12, color: '#878787', lineHeight: 1.5, margin: '0 0 24px' }}>
              By continuing, you confirm that you are above 18 years of age, and you agree to Flipkart's{' '}
              <a href="#" style={{ color: '#2874f0' }}>Terms of Use</a> and{' '}
              <a href="#" style={{ color: '#2874f0' }}>Privacy Policy</a>.
            </p>

            <button
              onClick={handleContinue}
              disabled={!isValid}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: isValid ? '#fb641b' : '#c2c2c2',
                color: '#ffffff',
                fontSize: 15,
                fontWeight: 600,
                borderRadius: 2,
                cursor: isValid ? 'pointer' : 'not-allowed',
                boxShadow: isValid ? '0 2px 6px rgba(251,100,27,0.3)' : 'none',
                transition: 'background 0.2s ease'
              }}
            >
              {step === 'otp' ? 'VERIFY & LOGIN' : 'CONTINUE'}
            </button>
          </div>

          <div style={{ textAlign: 'center', fontSize: 14 }}>
            <span style={{ color: '#2874f0', cursor: 'pointer', fontWeight: 500 }}>
              New to Flipkart? Create an account
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
