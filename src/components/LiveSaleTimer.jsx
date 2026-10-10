import React, { useState, useEffect } from 'react';

// Continuous 10-minute looping countdown based on epoch time
export function useLiveSaleTimer() {
  const calculateTime = () => {
    const cycleMs = 10 * 60 * 1000; // 10 minutes in ms
    const remainingMs = cycleMs - (Date.now() % cycleMs);
    const totalSec = Math.floor(remainingMs / 1000);
    return {
      minutes: Math.floor(totalSec / 60),
      seconds: totalSec % 60
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

export default function LiveSaleTimer() {
  const timeLeft = useLiveSaleTimer();

  const [viewerCount, setViewerCount] = useState(() => {
    const base = 14352;
    const offset = Math.floor((Date.now() / 5000) % 60);
    return base + offset;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Subtle realistic fluctuation for live visitors
      const base = 14320;
      const offset = Math.floor((Date.now() / 5000) % 75);
      setViewerCount(base + offset);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      textAlign: 'center',
      padding: '12px 16px 14px',
      margin: '0 auto',
      maxWidth: 780
    }}>
      {/* Live Sale Countdown Header */}
      <div style={{
        fontSize: 19,
        fontWeight: 700,
        color: '#212121',
        letterSpacing: '0.2px',
        lineHeight: 1.3
      }}>
        Live Sale : <span style={{ color: '#e05a38', fontWeight: 800 }}>
          {timeLeft.minutes}min {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}sec
        </span>
      </div>

      {/* People Watching Count */}
      <div style={{
        fontSize: 13.5,
        fontWeight: 600,
        color: '#1b8941',
        marginTop: 5,
        letterSpacing: '0.1px'
      }}>
        {viewerCount.toLocaleString('en-IN')} People watching this sale
      </div>
    </div>
  );
}
