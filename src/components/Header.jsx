import React, { useState, useRef, useEffect } from 'react';

export default function Header({ 
  onOpenLocation, 
  onOpenCart, 
  onOpenDirectOrder,
  cartCount = 0, 
  deliveryLocation = 'Location not set',
  onSearch 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useState('flipkart'); // 'flipkart' | 'travel'
  const searchRef = useRef(null);

  const sampleSuggestions = [
    'iPhone 16 Pro Max 256GB Desert Titanium',
    'Samsung Galaxy S25 Ultra 5G',
    'Google Pixel 9 Pro XL',
    'JBL Flip 6 Wireless Bluetooth Speaker',
    'boAt Rockerz 450 Bluetooth Headphone',
    'Apple 20W USB-C Fast Adapter',
    'Fastrack Smartwatch',
    'Kurtas & Ethnic Dresses',
    'Running Shoes & Sneakers'
  ];

  const filteredSuggestions = sampleSuggestions.filter(item => 
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
    setIsSearchFocused(false);
  };

  const handleSuggestionClick = (item) => {
    setSearchTerm(item);
    if (onSearch) onSearch(item);
    setIsSearchFocused(false);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'linear-gradient(180deg, #bfe3fc 0%, #d8effe 35%, #ebf5fe 70%, #ffffff 100%)',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      width: '100%',
      transition: 'all 0.2s ease'
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '8px 12px 10px'
      }}>
        {/* ROW 1: Switcher Tabs (Flipkart yellow / Travel white) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 8
        }}>
          {/* Flipkart Tab */}
          <div 
            onClick={() => setActiveTab('flipkart')}
            style={{
              flex: 1,
              height: 44,
              backgroundColor: activeTab === 'flipkart' ? '#ffe51f' : '#ffffff',
              borderRadius: 12,
              border: '1.4px solid ' + (activeTab === 'flipkart' ? 'rgba(255,255,255,0.6)' : '#e0e0e0'),
              boxShadow: activeTab === 'flipkart' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {/* Blue 'f' logo */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#2874f0">
              <path d="M19.36 10.04L20.5 4H14.5C10.9 4 8 6.9 8 10.5V12H4v4h4v8h4v-8h4.5l.86-4H12v-1.5c0-.83.67-1.5 1.5-1.5h5.86z"/>
            </svg>
            <span style={{
              fontFamily: 'Inter, Roboto, sans-serif',
              fontWeight: 800,
              fontSize: 16,
              fontStyle: 'italic',
              color: '#1f1f1f',
              letterSpacing: '-0.3px'
            }}>
              Flipkart
            </span>
          </div>

          {/* Travel Tab */}
          <div 
            onClick={() => setActiveTab('travel')}
            style={{
              flex: 1,
              height: 44,
              backgroundColor: activeTab === 'travel' ? '#ffe51f' : '#ffffff',
              borderRadius: 12,
              border: '1.4px solid ' + (activeTab === 'travel' ? 'rgba(255,255,255,0.6)' : '#e0e0e0'),
              boxShadow: activeTab === 'travel' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {/* Orange airplane icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#f2575b">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
            <span style={{
              fontFamily: 'Inter, Roboto, sans-serif',
              fontWeight: 800,
              fontSize: 16,
              fontStyle: 'italic',
              color: '#1f1f1f',
              letterSpacing: '-0.3px'
            }}>
              Travel
            </span>
          </div>
        </div>

        {/* ROW 2: Search Bar & Cart Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10
        }}>
          <div ref={searchRef} style={{ position: 'relative', flex: 1 }}>
            <form 
              onSubmit={handleSearchSubmit}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                border: '2px solid #2ea1ff',
                borderRadius: 12,
                height: 44,
                padding: '0 14px',
                gap: 10,
                boxShadow: '0 2px 4px rgba(46, 161, 255, 0.08)'
              }}
            >
              {/* Search Icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z" stroke="#2EA1FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 16L21 21" stroke="#2EA1FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>

              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search for Products"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: 15,
                  color: '#212121',
                  fontFamily: 'Inter, Roboto, sans-serif'
                }}
              />

              {searchTerm && (
                <button 
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    if (onSearch) onSearch('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 4,
                    cursor: 'pointer',
                    color: '#9e9e9e',
                    fontSize: 16
                  }}
                >
                  ✕
                </button>
              )}
            </form>

            {/* Autocomplete Suggestions Dropdown */}
            {isSearchFocused && filteredSuggestions.length > 0 && (
              <div style={{
                position: 'absolute',
                top: 48,
                left: 0,
                right: 0,
                backgroundColor: '#ffffff',
                borderRadius: 12,
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                zIndex: 1100,
                overflow: 'hidden',
                border: '1px solid #e0e0e0'
              }}>
                {filteredSuggestions.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSuggestionClick(item)}
                    style={{
                      padding: '10px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      cursor: 'pointer',
                      fontSize: 14,
                      color: '#212121',
                      borderBottom: idx !== filteredSuggestions.length - 1 ? '1px solid #f0f0f0' : 'none'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f8fe'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#717478" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Icon in Header */}
          <button
            type="button"
            onClick={onOpenCart}
            aria-label="Shopping Cart"
            style={{
              position: 'relative',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#1f1f1f" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: '#d32f2f',
                color: '#ffffff',
                fontSize: 10,
                fontWeight: 700,
                borderRadius: 10,
                minWidth: 16,
                height: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 3px',
                border: '1.5px solid #ffffff'
              }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
