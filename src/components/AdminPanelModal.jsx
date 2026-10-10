import React, { useState, useEffect } from 'react';
import { getUpiConfig, saveUpiConfig } from '../utils/upiConfig';
import { getAllOrders, updateOrderStatus, deleteOrder, seedSampleOrdersIfEmpty } from '../utils/orderStorage';

export default function AdminPanelModal({ isOpen, onClose, onConfigUpdated }) {
  const [activeTab, setActiveTab] = useState('settings'); // 'settings' | 'orders' | 'diagnostics'
  
  // Settings Form State
  const [config, setConfig] = useState(getUpiConfig());
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testAmount, setTestAmount] = useState('100');

  // Orders State
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('ALL'); // 'ALL' | 'PAID' | 'PENDING_VERIFICATION'
  const [previewImage, setPreviewImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      seedSampleOrdersIfEmpty();
      setConfig(getUpiConfig());
      setOrders(getAllOrders());
      setSaveSuccess(false);
    }
  }, [isOpen]);

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

  if (!isOpen) return null;

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

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10000,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 780,
        maxHeight: '92vh',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid #e2e8f0'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20
            }}>
              ⚙️
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>
                UPI Payment & Order Admin Panel
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: 12, opacity: 0.85 }}>
                Configure live payee UPI ID, inspect customer UTRs & verify orders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              color: '#ffffff',
              width: 32,
              height: 32,
              borderRadius: '50%',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          padding: '0 16px'
        }}>
          {[
            { id: 'settings', label: '💳 UPI Gateway Settings' },
            { id: 'orders', label: `📦 Orders & UTR (${orders.length})` },
            { id: 'diagnostics', label: '📊 Revenue & Analytics' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 18px',
                fontSize: 13,
                fontWeight: 600,
                border: 'none',
                background: 'none',
                color: activeTab === tab.id ? '#2563eb' : '#64748b',
                borderBottom: activeTab === tab.id ? '2.5px solid #2563eb' : '2.5px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          
          {/* TAB 1: UPI SETTINGS */}
          {activeTab === 'settings' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 240px', gap: 24 }}>
              <form onSubmit={handleSaveConfig} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {saveSuccess && (
                  <div style={{
                    padding: '10px 14px',
                    backgroundColor: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    borderRadius: 8,
                    color: '#065f46',
                    fontSize: 13,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <span>✓</span> UPI configuration updated successfully! Changes are active immediately.
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
                    Payee UPI VPA ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={config.payeeVpa}
                    onChange={(e) => setConfig({ ...config, payeeVpa: e.target.value.trim() })}
                    placeholder="e.g. yourname@icici or 9876543210@paytm"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1.5px solid #cbd5e1',
                      fontSize: 14,
                      outline: 'none',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      color: '#0f172a'
                    }}
                  />
                  <span style={{ fontSize: 11, color: '#64748b', marginTop: 4, display: 'block' }}>
                    All customer payments and QR codes will directly route to this UPI ID.
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
                    Payee / Merchant Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={config.payeeName}
                    onChange={(e) => setConfig({ ...config, payeeName: e.target.value })}
                    placeholder="e.g. Flipkart India Pvt Ltd or Store Name"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1.5px solid #cbd5e1',
                      fontSize: 14,
                      outline: 'none',
                      color: '#0f172a'
                    }}
                  />
                  <span style={{ fontSize: 11, color: '#64748b', marginTop: 4, display: 'block' }}>
                    Shown to customer on PhonePe, GPay, and Paytm payment screens.
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
                      QR Expiry Timer
                    </label>
                    <select
                      value={config.qrExpirySeconds}
                      onChange={(e) => setConfig({ ...config, qrExpirySeconds: Number(e.target.value) })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: '1.5px solid #cbd5e1',
                        fontSize: 13,
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <option value={180}>3 Minutes (180s)</option>
                      <option value={300}>5 Minutes (300s) - Recommended</option>
                      <option value={600}>10 Minutes (600s)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
                      Auto-Verify Countdown
                    </label>
                    <select
                      value={config.autoVerifySeconds}
                      onChange={(e) => setConfig({ ...config, autoVerifySeconds: Number(e.target.value) })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: '1.5px solid #cbd5e1',
                        fontSize: 13,
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <option value={60}>1 Minute (60s)</option>
                      <option value={120}>2 Minutes (120s) - Spec</option>
                      <option value={180}>3 Minutes (180s)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>
                    Merchant Category Code (MCC)
                  </label>
                  <input
                    type="text"
                    value={config.merchantCode}
                    onChange={(e) => setConfig({ ...config, merchantCode: e.target.value.trim() })}
                    placeholder="e.g. 5311"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: '1.5px solid #cbd5e1',
                      fontSize: 13,
                      fontFamily: 'monospace'
                    }}
                  />
                </div>

                <div style={{ marginTop: 8 }}>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      padding: '12px 24px',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: 'none',
                      boxShadow: '0 2px 6px rgba(37, 99, 235, 0.35)'
                    }}
                  >
                    💾 Save UPI Configuration
                  </button>
                </div>
              </form>

              {/* Live QR Tester Panel */}
              <div style={{
                backgroundColor: '#f8fafc',
                borderRadius: 12,
                padding: '16px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: 6 }}>
                  Live Test QR
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 12 }}>
                  Scan with your PhonePe / GPay app to test your receiver UPI ID
                </div>

                <div style={{
                  width: 170,
                  height: 170,
                  backgroundColor: '#ffffff',
                  padding: 8,
                  borderRadius: 10,
                  border: '2px solid #2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`upi://pay?pa=${config.payeeVpa}&pn=${encodeURIComponent(config.payeeName)}&am=${testAmount}&cu=INR&tn=AdminTest`)}`}
                    alt="Test QR"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>

                <div style={{ marginTop: 12, width: '100%' }}>
                  <label style={{ fontSize: 11, color: '#475569', fontWeight: 600, display: 'block', marginBottom: 2 }}>
                    Test Amount (₹):
                  </label>
                  <input
                    type="number"
                    value={testAmount}
                    onChange={(e) => setTestAmount(e.target.value)}
                    style={{
                      width: '80px',
                      padding: '4px 8px',
                      fontSize: 12,
                      textAlign: 'center',
                      borderRadius: 4,
                      border: '1px solid #cbd5e1'
                    }}
                  />
                </div>

                <div style={{
                  marginTop: 10,
                  fontSize: 10,
                  color: '#2563eb',
                  wordBreak: 'break-all',
                  fontWeight: 600,
                  backgroundColor: '#eff6ff',
                  padding: '4px 8px',
                  borderRadius: 4
                }}>
                  {config.payeeVpa}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS & UTR MANAGEMENT */}
          {activeTab === 'orders' && (
            <div>
              {/* Filter and Search Bar */}
              <div style={{
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['ALL', 'PAID', 'PENDING_VERIFICATION'].map(f => (
                    <button
                      key={f}
                      onClick={() => setOrderFilter(f)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
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
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    fontSize: 12,
                    minWidth: 220
                  }}
                />
              </div>

              {filteredOrders.length === 0 ? (
                <div style={{
                  padding: 40,
                  textAlign: 'center',
                  backgroundColor: '#f8fafc',
                  borderRadius: 12,
                  border: '1px dashed #cbd5e1',
                  color: '#64748b'
                }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>No orders found matching your filter</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {filteredOrders.map(order => (
                    <div
                      key={order.orderId}
                      style={{
                        padding: 14,
                        borderRadius: 10,
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                      }}
                    >
                      {/* Top Bar of Card */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 14, color: '#0f172a' }}>
                            {order.orderId}
                          </span>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: 12,
                            fontSize: 11,
                            fontWeight: 700,
                            backgroundColor: order.status === 'PAID' ? '#dcfce7' : order.status === 'PENDING_VERIFICATION' ? '#fef3c7' : '#fee2e2',
                            color: order.status === 'PAID' ? '#15803d' : order.status === 'PENDING_VERIFICATION' ? '#b45309' : '#b91c1c'
                          }}>
                            {order.status === 'PAID' ? '✓ PAID' : order.status === 'PENDING_VERIFICATION' ? '⏱ PENDING VERIFICATION' : 'FAILED'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
                            ₹{Number(order.amount).toLocaleString('en-IN')}
                          </span>
                          <button
                            onClick={() => handleDeleteOrder(order.orderId)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#94a3b8',
                              cursor: 'pointer',
                              fontSize: 14
                            }}
                            title="Delete record"
                          >
                            🗑
                          </button>
                        </div>
                      </div>

                      {/* Details Row */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8, fontSize: 12, color: '#475569' }}>
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
                          <strong>UTR / Ref No:</strong>{' '}
                          {order.utrNumber ? (
                            <span style={{ fontFamily: 'monospace', color: '#1d4ed8', fontWeight: 700 }}>
                              {order.utrNumber}
                            </span>
                          ) : (
                            <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Auto Verified / None</span>
                          )}
                        </div>
                      </div>

                      {/* Screenshot proof if present */}
                      {order.proofScreenshot && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, backgroundColor: '#f1f5f9', padding: '6px 10px', borderRadius: 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>📸 Payment Screenshot Attached:</span>
                          <button
                            onClick={() => setPreviewImage(order.proofScreenshot)}
                            style={{
                              backgroundColor: '#2563eb',
                              color: '#ffffff',
                              border: 'none',
                              padding: '2px 8px',
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            View Proof Image
                          </button>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: 8, borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
                        {order.status !== 'PAID' && (
                          <button
                            onClick={() => handleStatusChange(order.orderId, 'PAID')}
                            style={{
                              backgroundColor: '#16a34a',
                              color: '#ffffff',
                              border: 'none',
                              padding: '4px 12px',
                              borderRadius: 4,
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
                              padding: '4px 12px',
                              borderRadius: 4,
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Mark Pending
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DIAGNOSTICS & STATS */}
          {activeTab === 'diagnostics' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                <div style={{ backgroundColor: '#eff6ff', padding: 16, borderRadius: 10, border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: 12, color: '#1e40af', fontWeight: 600 }}>Total Paid Revenue</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#1e3a8a', marginTop: 4 }}>
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </div>
                </div>

                <div style={{ backgroundColor: '#f0fdf4', padding: 16, borderRadius: 10, border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: 12, color: '#166534', fontWeight: 600 }}>Total Orders Placed</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#14532d', marginTop: 4 }}>
                    {orders.length}
                  </div>
                </div>

                <div style={{ backgroundColor: '#fffbeb', padding: 16, borderRadius: 10, border: '1px solid #fde68a' }}>
                  <div style={{ fontSize: 12, color: '#92400e', fontWeight: 600 }}>Pending UTR Verification</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#78350f', marginTop: 4 }}>
                    {pendingCount}
                  </div>
                </div>
              </div>

              {/* Data actions */}
              <div style={{ backgroundColor: '#f8fafc', padding: 16, borderRadius: 10, border: '1px solid #e2e8f0', marginTop: 10 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                  Database Maintenance
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
                  Clear stored test orders or download the raw JSON backup.
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(orders, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute("href", dataStr);
                      downloadAnchor.setAttribute("download", `flipkart_orders_${Date.now()}.json`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    📥 Export Orders Backup (JSON)
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Clear all orders from database?')) {
                        localStorage.removeItem('flipkart_orders_database');
                        setOrders([]);
                      }
                    }}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: '#fee2e2',
                      color: '#b91c1c',
                      border: '1px solid #fca5a5',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    🗑 Clear All Orders
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Image Preview Modal */}
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
            <div style={{ maxWidth: 450, maxHeight: '80vh', position: 'relative' }}>
              <img
                src={previewImage}
                alt="Proof Screenshot"
                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 8 }}
              />
              <button
                onClick={() => setPreviewImage(null)}
                style={{
                  position: 'absolute',
                  top: -12,
                  right: -12,
                  backgroundColor: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  fontSize: 16,
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
