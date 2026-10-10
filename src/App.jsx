import React, { useState, useRef, useMemo } from 'react';
import Header from './components/Header';
import CategoryBar from './components/CategoryBar';
import HeroCarousel from './components/HeroCarousel';
import LiveSaleTimer from './components/LiveSaleTimer';
import ProductGrid from './components/ProductGrid';
import ProductDetailModal from './components/ProductDetailModal';
import DirectOrderModal from './components/DirectOrderModal';
import CartDrawer from './components/CartDrawer';
import LocationModal from './components/LocationModal';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import Toast from './components/Toast';
import AdminPanelModal from './components/AdminPanelModal';
import UpiAdminPage from './components/UpiAdminPage';

import { 
  screenshotProducts,
  allProducts 
} from './data/products';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDirectOrderOpen, setIsDirectOrderOpen] = useState(false);
  const [directOrderItems, setDirectOrderItems] = useState([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState(() => {
    try {
      const savedAddr = localStorage.getItem('flipkart_user_address');
      if (savedAddr) {
        const parsed = JSON.parse(savedAddr);
        if (parsed.city && parsed.pincode) return `${parsed.city} ${parsed.pincode}`;
      }
      return localStorage.getItem('fk_delivery_location') || 'Select delivery location';
    } catch (e) {
      return 'Select delivery location';
    }
  });

  // Filter or search state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('For You');

  // Cart items (starts empty by default)
  const [cartItems, setCartItems] = useState([]);

  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    icon: '✓'
  });

  const categorySectionRef = useRef(null);
  const lastBackPressTimeRef = useRef(0);

  // State tracking Ref for popstate listener (avoids stale closures)
  const stateRef = useRef({
    isDetailOpen: false,
    selectedProduct: null,
    isCartOpen: false,
    isDirectOrderOpen: false,
    isLocationOpen: false,
    isAdminOpen: false,
    searchQuery: '',
    activeCategory: 'For You',
    currentPath: window.location.pathname
  });

  // Sync stateRef on state changes
  React.useEffect(() => {
    stateRef.current = {
      isDetailOpen,
      selectedProduct,
      isCartOpen,
      isDirectOrderOpen,
      isLocationOpen,
      isAdminOpen,
      searchQuery,
      activeCategory,
      currentPath
    };
  }, [
    isDetailOpen,
    selectedProduct,
    isCartOpen,
    isDirectOrderOpen,
    isLocationOpen,
    isAdminOpen,
    searchQuery,
    activeCategory,
    currentPath
  ]);

  // Establish base history state on initial mount & handle popstate
  React.useEffect(() => {
    try {
      if (!window.history.state || !window.history.state.fkApp) {
        window.history.replaceState({ fkApp: true, view: 'root' }, '');
        window.history.pushState({ fkApp: true, view: 'home' }, '');
      }
    } catch (e) {}

    const handlePopState = (event) => {
      const current = stateRef.current;
      const targetState = event.state;

      // Sync path if changed (e.g. /upiadmin)
      if (window.location.pathname !== current.currentPath) {
        setCurrentPath(window.location.pathname);
      }

      // 1. Root Exit Guard (protects website from closing on single back tap)
      if (!targetState || targetState.view === 'root') {
        const now = Date.now();
        if (now - lastBackPressTimeRef.current < 2500) {
          // Double tap within 2.5s: allow user to exit
          return;
        }
        // Single tap: keep user on site, show notification, restore home guard
        lastBackPressTimeRef.current = now;
        showToast('Press back again to exit', 'ℹ');
        try {
          window.history.pushState({ fkApp: true, view: 'home' }, '');
        } catch (e) {}
        return;
      }

      // 2. Direct Order Modal open
      if (current.isDirectOrderOpen) {
        if (targetState?.view === 'direct_order') {
          // Internal step change inside Direct Order (handled by DirectOrderModal)
          return;
        }
        setIsDirectOrderOpen(false);
        if (targetState?.view === 'cart') {
          setIsCartOpen(true);
        } else if (targetState?.view === 'detail' && current.selectedProduct) {
          setIsDetailOpen(true);
        }
        return;
      }

      // 3. Cart Drawer open
      if (current.isCartOpen) {
        setIsCartOpen(false);
        if (targetState?.view === 'detail' && current.selectedProduct) {
          setIsDetailOpen(true);
        }
        return;
      }

      // 4. Product Detail Modal open
      if (current.isDetailOpen) {
        setIsDetailOpen(false);
        setSelectedProduct(null);
        return;
      }

      // 5. Location Modal open
      if (current.isLocationOpen) {
        setIsLocationOpen(false);
        return;
      }

      // 6. Admin Panel Modal open
      if (current.isAdminOpen) {
        setIsAdminOpen(false);
        return;
      }

      // 7. Search active
      if (current.searchQuery) {
        setSearchQuery('');
        if (targetState?.view === 'category' && targetState.category) {
          setActiveCategory(targetState.category);
        } else {
          setActiveCategory('For You');
        }
        return;
      }

      // 8. Category filter active
      if (current.activeCategory !== 'For You') {
        setActiveCategory('For You');
        return;
      }

      // Forward browser navigation support
      if (targetState?.view === 'detail' && targetState.productId && !current.isDetailOpen) {
        const prod = allProducts.find(p => String(p.id) === String(targetState.productId));
        if (prod) {
          setSelectedProduct(prod);
          setIsDetailOpen(true);
        }
      } else if (targetState?.view === 'cart' && !current.isCartOpen) {
        setIsCartOpen(true);
      } else if (targetState?.view === 'category' && targetState.category) {
        setActiveCategory(targetState.category);
        setSearchQuery(targetState.category);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path) => {
    try {
      window.history.pushState({ fkApp: true, view: path }, '', path);
    } catch (e) {}
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (message, icon = '✓') => {
    setToast({ isVisible: true, message, icon });
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, 3200);
  };

  // Handlers with browser history synchronization
  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`Added "${product.title.slice(0, 32)}..." to Cart!`);
    handleOpenCart();
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
    } else {
      setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
    try {
      window.history.pushState({ fkApp: true, view: 'detail', productId: product.id }, '');
    } catch (e) {}
  };

  const handleOpenCart = () => {
    setIsCartOpen(true);
    try {
      window.history.pushState({ fkApp: true, view: 'cart' }, '');
    } catch (e) {}
  };

  const handleCloseCart = () => {
    if (window.history.state?.view === 'cart') {
      window.history.back();
    } else {
      setIsCartOpen(false);
    }
  };

  const handleBuyNow = (product) => {
    setDirectOrderItems([{ ...product, quantity: 1 }]);
    setIsDetailOpen(false);
    setIsCartOpen(false);
    setIsDirectOrderOpen(true);
    try {
      window.history.pushState({ fkApp: true, view: 'direct_order', step: 'summary' }, '');
    } catch (e) {}
  };

  const handlePlaceOrderFromCart = (items) => {
    setDirectOrderItems(items);
    setIsCartOpen(false);
    setIsDetailOpen(false);
    setIsDirectOrderOpen(true);
    try {
      window.history.pushState({ fkApp: true, view: 'direct_order', step: 'summary' }, '');
    } catch (e) {}
  };

  const handleOpenDirectOrder = () => {
    if (cartItems.length > 0) {
      setDirectOrderItems(cartItems);
    } else {
      setDirectOrderItems([allProducts[0]]);
    }
    setIsDirectOrderOpen(true);
    try {
      window.history.pushState({ fkApp: true, view: 'direct_order', step: 'summary' }, '');
    } catch (e) {}
  };

  const handleCloseDirectOrder = () => {
    if (window.history.state?.view === 'direct_order') {
      window.history.back();
    } else {
      setIsDirectOrderOpen(false);
    }
  };

  const handleCloseDetail = () => {
    if (window.history.state?.view === 'detail') {
      window.history.back();
    } else {
      setIsDetailOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleOpenLocation = () => {
    setIsLocationOpen(true);
    try {
      window.history.pushState({ fkApp: true, view: 'location' }, '');
    } catch (e) {}
  };

  const handleCloseLocation = () => {
    if (window.history.state?.view === 'location') {
      window.history.back();
    } else {
      setIsLocationOpen(false);
    }
  };

  const handleOpenAdmin = () => {
    setIsAdminOpen(true);
    try {
      window.history.pushState({ fkApp: true, view: 'admin' }, '');
    } catch (e) {}
  };

  const handleCloseAdmin = () => {
    if (window.history.state?.view === 'admin') {
      window.history.back();
    } else {
      setIsAdminOpen(false);
    }
  };

  const handleSelectCategory = (cat) => {
    if (cat === activeCategory) return;
    setActiveCategory(cat);
    if (cat === 'For You') {
      setSearchQuery('');
      try {
        window.history.pushState({ fkApp: true, view: 'home' }, '');
      } catch (e) {}
    } else {
      setSearchQuery(cat);
      try {
        window.history.pushState({ fkApp: true, view: 'category', category: cat }, '');
      } catch (e) {}
    }
  };

  const handleSearch = (term) => {
    setSearchQuery(term);
    if (term) {
      showToast(`Showing results for "${term}"`);
      try {
        window.history.pushState({ fkApp: true, view: 'search', query: term }, '');
      } catch (e) {}
    } else {
      try {
        window.history.pushState({ fkApp: true, view: 'home' }, '');
      } catch (e) {}
    }
  };

  const handleRemoveItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    showToast('Item removed from cart');
  };

  const handleOrderSuccess = (orderData) => {
    showToast(`Order #${orderData.orderId} Confirmed! Delivery Tomorrow.`);
    // If order was from cart, clear cart
    if (directOrderItems.length > 1 || directOrderItems[0]?.id === cartItems[0]?.id) {
      setCartItems([]);
    }
  };

  // Filter products based on search or category
  const displayedProducts = useMemo(() => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      return allProducts.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.highlights && p.highlights.some(h => h.toLowerCase().includes(q))) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }
    if (!activeCategory || activeCategory === 'For You') {
      // Curated 5 products from each of the 11 categories (55 products)
      const forYouList = allProducts.filter(p => p.featuredForYou);
      return forYouList.length > 0 ? forYouList : allProducts;
    }
    const active = activeCategory.toLowerCase();
    const filtered = allProducts.filter(p => {
      const cat = (p.category || '').toLowerCase();
      return cat === active || cat.startsWith(active) || active.startsWith(cat);
    });
    return filtered.length > 0 ? filtered : allProducts;
  }, [searchQuery, activeCategory]);

  // Render /upiadmin Route Page
  if (currentPath === '/upiadmin') {
    return (
      <>
        <UpiAdminPage
          onBackToStore={() => navigateTo('/')}
          onConfigUpdated={(cfg) => {
            showToast(`UPI Payee ID updated to ${cfg.payeeVpa}!`);
          }}
        />
        <Toast
          isVisible={toast.isVisible}
          message={toast.message}
          icon={toast.icon}
        />
      </>
    );
  }

  return (
    <div style={{
      maxWidth: 480,
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      boxShadow: '0 0 24px rgba(0,0,0,0.1)',
      position: 'relative',
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: 0
    }}>
      {/* Header with Search and Direct Order */}
      <Header
        onOpenLocation={handleOpenLocation}
        onOpenCart={handleOpenCart}
        onOpenDirectOrder={handleOpenDirectOrder}
        cartCount={cartItems.length}
        deliveryLocation={deliveryLocation}
        onSearch={handleSearch}
      />

      {/* Main Content */}
      <main style={{ flex: 1 }}>
        <div ref={categorySectionRef}>
          <CategoryBar 
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory} 
          />
        </div>

        <HeroCarousel />

        {/* Live Sale Looping Timer matching user reference screenshot */}
        <LiveSaleTimer />
        <div style={{ height: 8, backgroundColor: '#f1f3f6' }} />

        {/* Search status header */}
        {searchQuery && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 14px 4px'
          }}>
            <h2 style={{ fontSize: 15, color: '#212121', margin: 0, fontWeight: 700 }}>
              Results for "{searchQuery}" ({displayedProducts.length})
            </h2>
            <button
              onClick={() => handleSearch('')}
              style={{
                background: 'none',
                color: '#2874f0',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              Clear ✕
            </button>
          </div>
        )}

        {/* 2-Column Responsive Product Grid with Round Corners */}
        <ProductGrid
          products={displayedProducts}
          title={!searchQuery && activeCategory !== 'For You' ? `${activeCategory} Deals` : null}
          onProductClick={handleProductClick}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation Bar (Hidden when Product Detail or Direct Order is open) */}
      {!isDetailOpen && !isDirectOrderOpen && (
        <MobileBottomNav
          onOpenCart={handleOpenCart}
          onOpenAccount={() => showToast('My Profile & Account')}
          onScrollToCategory={() => {
            categorySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}
          cartCount={cartItems.length}
        />
      )}

      {/* Product Detail Modal with Specs & Real Customer Reviews */}
      {isDetailOpen && selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isDetailOpen}
          onClose={handleCloseDetail}
          onAddToCart={(p) => {
            handleAddToCart(p);
            handleOpenCart();
          }}
          onBuyNow={handleBuyNow}
          cartCount={cartItems.length}
          onOpenCart={handleOpenCart}
          deliveryLocation={deliveryLocation}
          onOpenLocation={handleOpenLocation}
          onSearch={(term) => {
            handleCloseDetail();
            handleSearch(term);
          }}
        />
      )}

      {/* Direct Order Modal (1-Step Fast Checkout - No Login Needed) */}
      <DirectOrderModal
        isOpen={isDirectOrderOpen}
        onClose={handleCloseDirectOrder}
        items={directOrderItems}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={handleCloseCart}
        cartItems={cartItems}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
        onPlaceOrder={handlePlaceOrderFromCart}
        onBuyNow={(item) => handleBuyNow(item)}
        deliveryLocation={deliveryLocation}
      />

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationOpen}
        onClose={handleCloseLocation}
        onSetLocation={(loc) => {
          setDeliveryLocation(loc);
          showToast(`Delivery location set to ${loc}`);
        }}
      />

      {/* UPI Payment & Order Admin Panel */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={handleCloseAdmin}
        onConfigUpdated={(cfg) => {
          showToast(`UPI Payee ID updated to ${cfg.payeeVpa}!`);
        }}
      />

      {/* Toast Alert */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        icon={toast.icon}
      />
    </div>
  );
}
