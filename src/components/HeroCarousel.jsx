import React, { useState, useEffect, useRef } from 'react';
import { heroBanners } from '../data/products';

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto-scroll every 3 seconds
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroBanners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % heroBanners.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
  };

  return (
    <div 
      style={{
        maxWidth: 780,
        margin: '8px auto 12px',
        padding: '0 12px',
        boxSizing: 'border-box'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Flipkart Full Poster Card with Curved Edges */}
      <div 
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1024 / 499',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          backgroundColor: '#0a0a14'
        }}
      >
        {heroBanners.map((banner, idx) => (
          <div
            key={banner.id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: idx === currentIndex ? 1 : 0,
              transition: 'opacity 0.45s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <img
              src={banner.image}
              alt={banner.title}
              decoding="async"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                borderRadius: 12
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/images/big_billion_days_rohit.png';
              }}
            />
          </div>
        ))}

        {/* Invisible Left Tap Zone */}
        <div
          onClick={prevSlide}
          aria-label="Previous Slide"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '25%',
            height: '100%',
            zIndex: 10,
            cursor: 'pointer',
            background: 'transparent',
            userSelect: 'none'
          }}
        />

        {/* Invisible Right Tap Zone */}
        <div
          onClick={nextSlide}
          aria-label="Next Slide"
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: '25%',
            height: '100%',
            zIndex: 10,
            cursor: 'pointer',
            background: 'transparent',
            userSelect: 'none'
          }}
        />
      </div>

      {/* Indicator Capsule Bars matching exact Flipkart screenshot */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        marginTop: 8
      }}>
        {heroBanners.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrentIndex(i)}
            style={{
              width: i === currentIndex ? 28 : 12,
              height: 4,
              borderRadius: 2,
              backgroundColor: i === currentIndex ? '#111112' : '#dcdcdc',
              cursor: 'pointer',
              transition: 'all 0.25s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
}
