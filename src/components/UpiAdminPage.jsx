import React, { useState, useEffect } from 'react';
import { getUpiConfig, saveUpiConfig } from '../utils/upiConfig';
import { getAllOrders, updateOrderStatus, deleteOrder, seedSampleOrdersIfEmpty } from '../utils/orderStorage';

export default function UpiAdminPage({ onBackToStore, onConfigUpdated }) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('upi_admin_authenticated') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard Tab State
  const [activeTab, setActiveTab] = useState('settings'); // 'settings' | 'orders' | 'diagnostics'

  // Settings State
  const [config, setConfig] = useState(getUpiConfig());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testAmount, setTestAmount] = useState('100');

  // Orders State
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('ALL');
  const [previewImage, setPreviewImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      seedSampleOrdersIfEmpty();
      setConfig(getUpiConfig());
      setOrders(getAllOrders());
      setSaveSuccess(false);
    }
  }, [isAuthenticated]);

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    // Credentials required by user:
    // username: spider
    // password: spider123
    if (username.trim() === 'spider' && password === 'spider123') {
      try {
        sessionStorage.setItem('upi_admin_authenticated', 'true');
      } catch (err) {}
      setIsAuthenticated(true);
    } else {
      setLoginError('Invalid credentials! Username or password incorrect.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    try {
      sessionStorage.removeItem('upi_admin_authenticated');
    } catch (e) {}
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  // Save UPI Gateway Config
  const handleSaveConfig = (e) => {
    e.preventDefault();
    if (!config.payeeVpa || !config.payeeVpa.includes('@')) {
      alert('Please enter a valid UPI VPA containing "@" (e.g. yourname@upi)');
      return;
    }
    const saved = saveUpiConfig(config);
    if (saved) {
      setSaveSuccess(true);
      if (onConfigUpdated) onConfigUpdated(saved);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    const updated = updateOrderStatus(orderId, newStatus);
    if (updated) {
      setOrders(getAllOrders());
    }
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm(`Delete order ${orderId}?`)) {
      deleteOrder(orderId);
      setOrders(getAllOrders());
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    const matchFilter = orderFilter === 'ALL' || o.status === orderFilter;
    const matchSearch = !searchQuery || 
      o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customerName && o.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.phone && o.phone.includes(searchQuery)) ||
      (o.utrNumber && o.utrNumber.includes(searchQuery));
    return matchFilter && matchSearch;
  });

  const totalRevenue = orders
    .filter(o => o.status === 'PAID')
    .reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

  const pendingCount = orders.filter(o => o.status === 'PENDING_VERIFICATION').length;

  // =========================================================================
  // VIEW 1: LOGIN GATE (If not authenticated)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          width: '100%',
          maxWidth: 420,
          backgroundColor: '#1e293b',
          borderRadius: 20,
          border: '1px solid #334155',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          padding: '36px 28px',
          color: '#ffffff'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              marginBottom: 14,
              boxShadow: '0 8px 16px rgba(37, 99, 235, 0.35)'
            }}>
              🔒
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              UPI Admin Portal
            </h1>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
              Route: <span style={{ fontFamily: 'monospace', color: '#60a5fa' }}>/upiadmin</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {loginError && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #ef4444',
                color: '#fca5a5',
                padding: '10px 14px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600
              }}>
                ⚠️ {loginError}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#cbd5e1', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Username
              </label>
              <input
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username (spider)"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 10,
                  backgroundColor: '#0f172a',
                  border: '1.5px solid #334155',
                  color: '#ffffff',
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#cbd5e1', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (spider123)"
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 14px',
                    borderRadius: 10,
                    backgroundColor: '#0f172a',
                    border: '1.5px solid #334155',
                    color: '#ffffff',
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: 14,
                    padding: 4
                  }}
                >
                  {showPassword ? '👁️' : '🔒'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: 6,
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                padding: '13px',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
                transition: 'background 0.15s ease'
              }}
            >
              Sign In to Admin Portal →
            </button>
          </form>

          {/* Quick Return to Store */}
          {onBackToStore && (
            <div style={{ textAlign: 'center', marginTop: 22 }}>
              <button
                type="button"
                onClick={onBackToStore}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#60a5fa',
                  fontSize: 13,
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                ← Return to Flipkart Store
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED ADMIN DASHBOARD
  // =========================================================================
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f1f5f9',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Top Navigation Bar */}
      <header style={{
        backgroundColor: '#1e3a8a',
        color: '#ffffff',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 12px rgba(30, 58, 138, 0.25)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {onBackToStore && (
            <button
              type="button"
              onClick={onBackToStore}
              title="Return to Flipkart Customer Store"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              ← Back to Store
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>⚙️</span>
            <div>
              <h1 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>
                Flipkart UPI Admin Portal
              </h1>
              <span style={{ fontSize: 11, opacity: 0.85, fontFamily: 'monospace' }}>
                Route: /upiadmin • Active Payee: {config.payeeVpa}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            padding: '4px 10px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600
          }}>
            👤 User: <strong>spider</strong>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              backgroundColor: '#ef4444',
              color: '#ffffff',
              border: 'none',
              padding: '6px 14px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div style={{
        maxWidth: 1100,
        width: '100%',
        margin: '24px auto',
        padding: '0 16px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }}>
        {/* Navigation Tabs */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 12,
          padding: '6px 12px',
          display: 'flex',
          gap: 8,
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          {[
            { id: 'settings', label: '💳 UPI Gateway Settings' },
            { id: 'orders', label: `📦 Orders & UTR Proofs (${orders.length})` },
            { id: 'diagnostics', label: '📊 Revenue & Analytics' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 18px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                border: 'none',
                backgroundColor: activeTab === tab.id ? '#2563eb' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : '#64748b',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: UPI Gateway Settings */}
        {activeTab === 'settings' && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 14,
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 280px',
            gap: 32
          }}>
            <form onSubmit={handleSaveConfig} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {saveSuccess && (
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: 8,
                  color: '#065f46',
                  fontSize: 13,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <span>✓</span> Receiver UPI Settings Saved! All customer QR codes and intent links updated instantly.
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                  Payee UPI VPA ID (Receiver UPI) *
                </label>
                <input
                  type="text"
                  required
                  value={config.payeeVpa}
                  onChange={(e) => setConfig({ ...config, payeeVpa: e.target.value.trim() })}
                  placeholder="e.g. yourname@icici or 9876543210@paytm"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 8,
                    border: '1.5px solid #cbd5e1',
                    fontSize: 15,
                    outline: 'none',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: '#0f172a',
                    boxSizing: 'border-box'
                  }}
                />
                <span style={{ fontSize: 12, color: '#64748b', marginTop: 4, display: 'block' }}>
                  Payments will be directly transferred to this UPI address.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                  Payee / Merchant Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={config.payeeName}
                  onChange={(e) => setConfig({ ...config, payeeName: e.target.value })}
                  placeholder="e.g. Flipkart India Pvt Ltd or Store Name"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 8,
                    border: '1.5px solid #cbd5e1',
                    fontSize: 14,
                    outline: 'none',
                    color: '#0f172a',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                    QR Expiry Duration
                  </label>
                  <select
                    value={config.qrExpirySeconds}
                    onChange={(e) => setConfig({ ...config, qrExpirySeconds: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '11px 12px',
                      borderRadius: 8,
                      border: '1.5px solid #cbd5e1',
                      fontSize: 13,
                      backgroundColor: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value={180}>3 Minutes (180s)</option>
                    <option value={300}>5 Minutes (300s) - Recommended</option>
                    <option value={600}>10 Minutes (600s)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                    Auto-Verification Window
                  </label>
                  <select
                    value={config.autoVerifySeconds}
                    onChange={(e) => setConfig({ ...config, autoVerifySeconds: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '11px 12px',
                      borderRadius: 8,
                      border: '1.5px solid #cbd5e1',
                      fontSize: 13,
                      backgroundColor: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value={60}>1 Minute (60s)</option>
                    <option value={120}>2 Minutes (120s) - Circular Timer</option>
                    <option value={180}>3 Minutes (180s)</option>
                  </select>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    padding: '13px 28px',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: 'none',
                    boxShadow: '0 4px 10px rgba(37, 99, 235, 0.35)'
                  }}
                >
                  💾 Save & Apply UPI Configuration
                </button>
              </div>
            </form>

            {/* Live QR Tester Panel */}
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: 12,
              padding: '20px 16px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', marginBottom: 4 }}>
                Live Test QR Code
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 14 }}>
                Scan with PhonePe, GPay, or Paytm to verify receiver VPA
              </div>

              <div style={{
                width: 190,
                height: 190,
                backgroundColor: '#ffffff',
                padding: 8,
                borderRadius: 12,
                border: '2px solid #2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.08)'
              }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`upi://pay?pa=${config.payeeVpa}&pn=${encodeURIComponent(config.payeeName)}&am=${testAmount}&cu=INR&tn=AdminTest`)}`}
                  alt="Live Test QR"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>

              <div style={{ marginTop: 14, width: '100%' }}>
                <label style={{ fontSize: 11, color: '#475569', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  Test Amount (₹):
                </label>
                <input
                  type="number"
                  value={testAmount}
                  onChange={(e) => setTestAmount(e.target.value)}
                  style={{
                    width: '90px',
                    padding: '5px 8px',
                    fontSize: 13,
                    textAlign: 'center',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    fontWeight: 700
                  }}
                />
              </div>

              <div style={{
                marginTop: 10,
                fontSize: 11,
                color: '#1d4ed8',
                wordBreak: 'break-all',
                fontWeight: 700,
                backgroundColor: '#eff6ff',
                padding: '6px 10px',
                borderRadius: 6,
                fontFamily: 'monospace'
              }}>
                {config.payeeVpa}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Orders & UTR Proofs */}
        {activeTab === 'orders' && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 14,
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
          }}>
            {/* Filter and Search Bar */}
            <div style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {['ALL', 'PAID', 'PENDING_VERIFICATION'].map(f => (
                  <button
                    key={f}
                    onClick={() => setOrderFilter(f)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      border: '1px solid',
                      borderColor: orderFilter === f ? '#2563eb' : '#e2e8f0',
                      backgroundColor: orderFilter === f ? '#eff6ff' : '#ffffff',
                      color: orderFilter === f ? '#2563eb' : '#64748b',
                      cursor: 'pointer'
                    }}
                  >
                    {f.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Search by Order ID, Phone or UTR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: 13,
                  minWidth: 260
                }}
              />
            </div>

            {filteredOrders.length === 0 ? (
              <div style={{
                padding: 48,
                textAlign: 'center',
                backgroundColor: '#f8fafc',
                borderRadius: 12,
                border: '1px dashed #cbd5e1',
                color: '#64748b'
              }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>No orders found</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {filteredOrders.map(order => (
                  <div
                    key={order.orderId}
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 15, color: '#0f172a' }}>
                          {order.orderId}
                        </span>
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: 12,
                          fontSize: 11,
                          fontWeight: 800,
                          backgroundColor: order.status === 'PAID' ? '#dcfce7' : order.status === 'PENDING_VERIFICATION' ? '#fef3c7' : '#fee2e2',
                          color: order.status === 'PAID' ? '#15803d' : order.status === 'PENDING_VERIFICATION' ? '#b45309' : '#b91c1c'
                        }}>
                          {order.status === 'PAID' ? '✓ PAID' : order.status === 'PENDING_VERIFICATION' ? '⏱ PENDING VERIFICATION' : 'FAILED'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                          ₹{Number(order.amount).toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() => handleDeleteOrder(order.orderId)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            fontSize: 15
                          }}
                          title="Delete record"
                        >
                          🗑
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, fontSize: 13, color: '#475569' }}>
                      <div>
                        <strong>Customer:</strong> {order.customerName || 'N/A'} ({order.phone || 'N/A'})
                      </div>
                      <div>
                        <strong>Method:</strong> {order.paymentMethod || 'UPI'}
                      </div>
                      <div>
                        <strong>Date:</strong> {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                      </div>
                      <div>
                        <strong>12-Digit UTR:</strong>{' '}
                        {order.utrNumber ? (
                          <span style={{ fontFamily: 'monospace', color: '#1d4ed8', fontWeight: 800, backgroundColor: '#eff6ff', padding: '2px 6px', borderRadius: 4 }}>
                            {order.utrNumber}
                          </span>
                        ) : (
                          <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Auto Verified</span>
                        )}
                      </div>
                    </div>

                    {order.proofScreenshot && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>📸 Payment Screenshot Attached:</span>
                        <button
                          onClick={() => setPreviewImage(order.proofScreenshot)}
                          style={{
                            backgroundColor: '#2563eb',
                            color: '#ffffff',
                            border: 'none',
                            padding: '4px 10px',
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          View Full Screenshot Proof
                        </button>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 10, borderTop: '1px solid #f1f5f9', paddingTop: 10 }}>
                      {order.status !== 'PAID' && (
                        <button
                          onClick={() => handleStatusChange(order.orderId, 'PAID')}
                          style={{
                            backgroundColor: '#16a34a',
                            color: '#ffffff',
                            border: 'none',
                            padding: '6px 14px',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          ✓ Approve & Mark Paid
                        </button>
                      )}
                      {order.status !== 'PENDING_VERIFICATION' && (
                        <button
                          onClick={() => handleStatusChange(order.orderId, 'PENDING_VERIFICATION')}
                          style={{
                            backgroundColor: '#f59e0b',
                            color: '#ffffff',
                            border: 'none',
                            padding: '6px 14px',
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Mark Pending Verification
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Diagnostics & Stats */}
        {activeTab === 'diagnostics' && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 14,
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: 20
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <div style={{ backgroundColor: '#eff6ff', padding: 20, borderRadius: 12, border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: 13, color: '#1e40af', fontWeight: 700 }}>Total Paid Revenue</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#1e3a8a', marginTop: 6 }}>
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </div>
              </div>

              <div style={{ backgroundColor: '#f0fdf4', padding: 20, borderRadius: 12, border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: 13, color: '#166534', fontWeight: 700 }}>Total Orders Recorded</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#14532d', marginTop: 6 }}>
                  {orders.length}
                </div>
              </div>

              <div style={{ backgroundColor: '#fffbeb', padding: 20, borderRadius: 12, border: '1px solid #fde68a' }}>
                <div style={{ fontSize: 13, color: '#92400e', fontWeight: 700 }}>Pending UTR Verification</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#78350f', marginTop: 6 }}>
                  {pendingCount}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Lightbox Preview */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 11000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
        >
          <div style={{ maxWidth: 460, maxHeight: '85vh', position: 'relative' }}>
            <img
              src={previewImage}
              alt="Proof Screenshot"
              style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 8 }}
            />
            <button
              onClick={() => setPreviewImage(null)}
              style={{
                position: 'absolute',
                top: -14,
                right: -14,
                backgroundColor: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: 32,
                height: 32,
                fontSize: 16,
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
