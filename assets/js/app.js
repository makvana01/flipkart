/**
 * Flipkart Live Clone - Interactive Engine
 * Replicating 100% Flipkart UI behaviors, carousels, modals, search, and cart.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Flipkart 100% Clone Engine initialized.');

    // Helper: Toast notification
    function showToast(message, icon = '✓') {
        const toast = document.getElementById('fk-custom-toast');
        const msgEl = document.getElementById('toast-msg');
        const iconEl = document.getElementById('toast-icon');
        if (!toast || !msgEl) return;
        
        msgEl.textContent = message;
        if (iconEl) iconEl.textContent = icon;
        toast.style.display = 'flex';
        
        clearTimeout(window.__toastTimeout);
        window.__toastTimeout = setTimeout(() => {
            toast.style.display = 'none';
        }, 3200);
    }

    // ==========================================
    // 1. LOGIN MODULE (DISABLED / REMOVED)
    // ==========================================
    // Login modal has been removed as per user request.
    const loginTriggers = document.querySelectorAll('a._1TOQfO, span.v1zwn28, [title="Login"], [aria-label="Login"]');
    loginTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // No login modal opens
        });
    });

    // ==========================================
    // 2. LOCATION PINCODE MODAL
    // ==========================================
    const locationModal = document.getElementById('location-modal-wrapper');
    const locationBackdrop = document.getElementById('location-modal-backdrop');
    const closeLocationBtn = document.getElementById('close-location-modal');
    const pincodeInput = document.getElementById('pincode-input');
    const pincodeApplyBtn = document.getElementById('pincode-apply-btn');
    const currentLocationBtn = document.getElementById('use-current-location-btn');

    // Find location trigger in header ("Location not set Select delivery location >")
    const locationTriggers = document.querySelectorAll('._328HqJ, [class*="Location"], [class*="location"]');
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('._328HqJ') || e.target.innerText?.includes('Select delivery location')) {
            e.preventDefault();
            if (locationModal) locationModal.style.display = 'block';
        }
    });

    if (closeLocationBtn) closeLocationBtn.addEventListener('click', () => locationModal.style.display = 'none');
    if (locationBackdrop) locationBackdrop.addEventListener('click', () => locationModal.style.display = 'none');

    function updateDeliveryLocation(locName) {
        const allLocationSpans = document.querySelectorAll('span, div');
        allLocationSpans.forEach(el => {
            if (el.textContent.includes('Select delivery location') || el.textContent.includes('Location not set')) {
                el.innerHTML = `Deliver to <strong>${locName}</strong>`;
            }
        });
        if (locationModal) locationModal.style.display = 'none';
        showToast(`Delivery location set to ${locName}`);
    }

    if (pincodeApplyBtn && pincodeInput) {
        pincodeApplyBtn.addEventListener('click', () => {
            const val = pincodeInput.value.trim();
            if (val.length === 6) {
                updateDeliveryLocation(val);
            } else {
                showToast('Please enter a valid 6-digit Pincode', '!');
            }
        });
    }

    if (currentLocationBtn) {
        currentLocationBtn.addEventListener('click', () => {
            updateDeliveryLocation('Ahmedabad 380015');
        });
    }

    // ==========================================
    // 3. CART SYSTEM & DRAWER
    // ==========================================
    const cartDrawer = document.getElementById('cart-drawer-wrapper');
    const cartBackdrop = document.getElementById('cart-drawer-backdrop');
    const closeCartBtn = document.getElementById('close-cart-drawer');
    const cartItemsCount = document.getElementById('cart-items-count');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartItemsList = document.getElementById('cart-items-list');

    let cartState = [
        {
            id: 'c1',
            title: 'Samsung Galaxy S25 5G (Phantom Black, 256 GB)',
            price: 54999,
            origPrice: 79999,
            image: 'assets/images/3fbe25902b48.jpg'
        },
        {
            id: 'c2',
            title: 'boAt Rockerz 450 Bluetooth Headphone (Luscious Black)',
            price: 1044,
            origPrice: 3990,
            image: 'assets/images/6df257eb0ff7.jpg'
        }
    ];

    function renderCart() {
        if (!cartItemsList) return;
        if (cartState.length === 0) {
            cartItemsList.innerHTML = `
                <div style="text-align: center; padding: 60px 20px;">
                    <img src="assets/images/f3f7ca451e50.png" onerror="this.src='https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png'" style="width: 160px; margin-bottom: 16px;">
                    <h4 style="font-size: 18px; color: #212121; margin: 0 0 8px;">Your cart is empty!</h4>
                    <p style="color: #878787; font-size: 13px;">Add items to it now.</p>
                </div>
            `;
            if (cartTotalPrice) cartTotalPrice.textContent = '₹0';
            if (cartItemsCount) cartItemsCount.textContent = '0';
            return;
        }

        let total = 0;
        let html = '';
        cartState.forEach(item => {
            total += item.price;
            html += `
                <div class="fk-cart-item">
                    <img src="${item.image}" onerror="this.src='assets/images/018fe01a5b13.png'" alt="${item.title}">
                    <div class="fk-cart-details">
                        <div class="fk-cart-title">${item.title}</div>
                        <div class="fk-cart-price">₹${item.price.toLocaleString('en-IN')} <span style="font-size: 12px; color: #878787; text-decoration: line-through; font-weight: normal; margin-left: 6px;">₹${item.origPrice.toLocaleString('en-IN')}</span></div>
                        <span class="fk-cart-remove" data-id="${item.id}">Remove</span>
                    </div>
                </div>
            `;
        });

        cartItemsList.innerHTML = html;
        if (cartTotalPrice) cartTotalPrice.textContent = `₹${total.toLocaleString('en-IN')}`;
        if (cartItemsCount) cartItemsCount.textContent = cartState.length.toString();

        // Attach remove events
        cartItemsList.querySelectorAll('.fk-cart-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                cartState = cartState.filter(i => i.id !== id);
                renderCart();
                showToast('Item removed from cart');
            });
        });
    }

    renderCart();

    // Open cart drawer on header cart click
    const cartTriggers = document.querySelectorAll('a._9Wy27C, a[href*="viewcart"], [title="Cart"]');
    cartTriggers.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            if (cartDrawer) {
                cartDrawer.style.display = 'block';
                renderCart();
            }
        });
    });

    if (closeCartBtn) closeCartBtn.addEventListener('click', () => cartDrawer.style.display = 'none');
    if (cartBackdrop) cartBackdrop.addEventListener('click', () => cartDrawer.style.display = 'none');

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cartState.length === 0) {
                showToast('Your cart is empty!', '!');
                return;
            }
            showToast('Order Placed! Thank you for shopping on Flipkart clone.');
            cartState = [];
            renderCart();
            setTimeout(() => {
                if (cartDrawer) cartDrawer.style.display = 'none';
            }, 1200);
        });
    }

    // Allow clicking any product card to Add to Cart
    document.querySelectorAll('a[href*="/p/"]').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const titleEl = card.querySelector('[title]') || card.querySelector('div, span');
            const title = titleEl ? titleEl.textContent.trim() : 'Flipkart Best Deal Product';
            const imgEl = card.querySelector('img');
            const img = imgEl ? imgEl.src : 'assets/images/018fe01a5b13.png';
            
            cartState.push({
                id: 'item_' + Date.now(),
                title: title.slice(0, 50),
                price: 1999,
                origPrice: 4999,
                image: img
            });
            renderCart();
            showToast(`Added "${title.slice(0, 30)}..." to Cart!`);
        });
    });

    // ==========================================
    // 4. HERO CAROUSEL CONTINUOUS AUTO-SLIDER & CONTROLS
    // ==========================================
    const heroCarousel = document.querySelector('.S0f9kM');
    if (heroCarousel) {
        const track = heroCarousel.querySelector('.hKE1H7');
        const slides = Array.from(track ? track.querySelectorAll('.P56aSK') : []);
        const dotsContainer = heroCarousel.querySelector('.DZQ2Mp');
        let dots = Array.from(dotsContainer ? dotsContainer.querySelectorAll('.MwsF52') : []);
        
        if (track && slides.length > 0) {
            let currentIndex = 0;
            let autoSlideTimer = null;
            let isHovered = false;

            // Ensure dot count matches slides count
            if (dotsContainer) {
                while (dots.length < slides.length) {
                    const newDot = document.createElement('div');
                    newDot.className = 'MwsF52';
                    dotsContainer.appendChild(newDot);
                    dots.push(newDot);
                }
            }

            function getSlideWidth() {
                const s = slides[0];
                return s ? s.getBoundingClientRect().width : 492;
            }

            function updateCarousel(instant = false) {
                const slideWidth = getSlideWidth();
                track.style.transition = instant ? 'none' : 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)';
                track.style.transform = `translate3d(-${currentIndex * slideWidth}px, 0px, 0px)`;

                // Update dots
                dots.forEach((dot, idx) => {
                    if (idx === currentIndex) {
                        dot.classList.add('pn1rOC');
                        dot.style.background = '#2874f0';
                        dot.style.width = '20px';
                        dot.style.borderRadius = '4px';
                    } else {
                        dot.classList.remove('pn1rOC');
                        dot.style.background = '#dbdbdb';
                        dot.style.width = '4px';
                        dot.style.borderRadius = '50%';
                    }
                });
            }

            function nextSlide() {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            }

            function prevSlide() {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
            }

            function startAutoSlide() {
                stopAutoSlide();
                autoSlideTimer = setInterval(() => {
                    if (!isHovered) {
                        nextSlide();
                    }
                }, 3000); // Continuous auto slide every 3 seconds
            }

            function stopAutoSlide() {
                if (autoSlideTimer) {
                    clearInterval(autoSlideTimer);
                    autoSlideTimer = null;
                }
            }

            // Create Left and Right Arrow Buttons if not present
            if (!heroCarousel.querySelector('.fk-carousel-nav-btn.prev')) {
                const prevBtn = document.createElement('button');
                prevBtn.className = 'fk-carousel-nav-btn prev';
                prevBtn.setAttribute('aria-label', 'Previous Slide');
                prevBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>';
                prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    prevSlide();
                    startAutoSlide();
                });
                heroCarousel.appendChild(prevBtn);
            }

            if (!heroCarousel.querySelector('.fk-carousel-nav-btn.next')) {
                const nextBtn = document.createElement('button');
                nextBtn.className = 'fk-carousel-nav-btn next';
                nextBtn.setAttribute('aria-label', 'Next Slide');
                nextBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>';
                nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    nextSlide();
                    startAutoSlide();
                });
                heroCarousel.appendChild(nextBtn);
            }

            // Dots click interaction
            dots.forEach((dot, idx) => {
                dot.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentIndex = idx;
                    updateCarousel();
                    startAutoSlide();
                });
            });

            // Pause on hover, resume on leave
            heroCarousel.addEventListener('mouseenter', () => {
                isHovered = true;
            });
            heroCarousel.addEventListener('mouseleave', () => {
                isHovered = false;
            });

            // Touch swipe support (Mobile)
            let touchStartX = 0;
            let touchEndX = 0;
            heroCarousel.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            heroCarousel.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                if (touchStartX - touchEndX > 45) {
                    nextSlide();
                    startAutoSlide();
                } else if (touchEndX - touchStartX > 45) {
                    prevSlide();
                    startAutoSlide();
                }
            }, { passive: true });

            // Window resize & orientation change handler
            window.addEventListener('resize', () => {
                updateCarousel(true);
            });
            window.addEventListener('orientationchange', () => {
                setTimeout(() => updateCarousel(true), 150);
            });

            // Initialize position & start continuous auto-slider
            updateCarousel(true);
            startAutoSlide();
        }
    }

    // Product rows slider next buttons (.nahfZL)
    const nextButtons = document.querySelectorAll('button.nahfZL[aria-label="Next Slide"], button.nahfZL');
    nextButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Find closest scrollable container or preceding sibling row
            let parent = btn.parentElement;
            let scrollable = null;
            
            while (parent && !scrollable) {
                const candidates = parent.querySelectorAll('div');
                for (let c of candidates) {
                    if (c !== btn && (c.scrollWidth > c.clientWidth || window.getComputedStyle(c).overflowX === 'auto' || window.getComputedStyle(c).display === 'flex')) {
                        scrollable = c;
                        break;
                    }
                }
                parent = parent.parentElement;
            }

            if (scrollable) {
                const maxScroll = scrollable.scrollWidth - scrollable.clientWidth;
                if (scrollable.scrollLeft >= maxScroll - 10) {
                    scrollable.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollable.scrollBy({ left: 450, behavior: 'smooth' });
                }
            }
        });
    });

    // ==========================================
    // 5. LIVE SEARCH AUTO-SUGGEST DROPDOWN
    // ==========================================
    const searchInput = document.querySelector('input.zDPLDu, input[title*="Search"], input[placeholder*="Search"]');
    const searchDropdown = document.getElementById('fk-search-dropdown');

    const sampleSuggestions = [
        'samsung galaxy s25 ultra 5g',
        'iphone 17 pro max 256gb',
        'boAt rockerz bluetooth earphones',
        'running sports shoes for men',
        'air conditioner 1.5 ton 5 star inverter',
        'gaming laptop rtx 4060',
        'fastrack smart watch for men',
        '43 inch 4k smart led tv',
        'woodland genuine leather shoes',
        'mixer grinder 750 watt philips'
    ];

    if (searchInput && searchDropdown) {
        function positionDropdown() {
            const rect = searchInput.getBoundingClientRect();
            searchDropdown.style.top = `${rect.bottom + window.scrollY}px`;
            searchDropdown.style.left = `${rect.left + window.scrollX}px`;
            searchDropdown.style.width = `${rect.width}px`;
        }

        function renderSuggestions(query = '') {
            const filtered = sampleSuggestions.filter(s => s.toLowerCase().includes(query.toLowerCase()));
            const list = filtered.length > 0 ? filtered : sampleSuggestions.slice(0, 5);
            
            searchDropdown.innerHTML = `
                <div style="padding: 8px 16px; font-size: 11px; text-transform: uppercase; color: #878787; font-weight: 600; letter-spacing: 0.5px; border-bottom: 1px solid #f0f0f0;">
                    ${query ? 'Matching Products' : 'Trending on Flipkart'}
                </div>
                ${list.map(term => `
                    <div class="fk-suggest-item" data-term="${term}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#878787" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <span>${term}</span>
                    </div>
                `).join('')}
            `;

            searchDropdown.querySelectorAll('.fk-suggest-item').forEach(item => {
                item.addEventListener('click', () => {
                    const term = item.getAttribute('data-term');
                    searchInput.value = term;
                    searchDropdown.style.display = 'none';
                    showToast(`Searching for "${term}"`);
                });
            });
        }

        searchInput.addEventListener('focus', () => {
            positionDropdown();
            renderSuggestions(searchInput.value.trim());
            searchDropdown.style.display = 'block';
        });

        searchInput.addEventListener('input', () => {
            positionDropdown();
            renderSuggestions(searchInput.value.trim());
            searchDropdown.style.display = 'block';
        });

        window.addEventListener('resize', positionDropdown);
        window.addEventListener('scroll', positionDropdown);

        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
                searchDropdown.style.display = 'none';
            }
        });

        const searchForm = searchInput.closest('form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                searchDropdown.style.display = 'none';
                showToast(`Showing results for "${searchInput.value}"`);
            });
        }
    }

    // ==========================================
    // 6. FESTIVE VIBES TAB SWITCHER
    // ==========================================
    const festiveTabs = document.querySelectorAll('div[class*="Festive"] span, div[class*="festive"] span');
    festiveTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            festiveTabs.forEach(t => t.style.borderBottom = 'none');
            tab.style.borderBottom = '3px solid #ffffff';
            showToast(`Browsing ${tab.textContent} collection`);
        });
    });

    // ==========================================
    // 7. FOOTER ACCORDION EXPANSION
    // ==========================================
    const accordionHeader = document.querySelector('div:has(> span:contains("Flipkart - Your go-to place")), [class*="accordion"]');
    document.querySelectorAll('*').forEach(el => {
        if (el.childNodes.length === 1 && el.textContent.includes('Flipkart - Your go-to place for Online Shopping')) {
            el.style.cursor = 'pointer';
            el.addEventListener('click', () => {
                showToast('Flipkart Shopping Guide Expanded');
            });
        }
    });

    // ==========================================
    // 8. ESCAPE KEY MODAL DISMISSAL
    // ==========================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLoginModal();
            if (locationModal) locationModal.style.display = 'none';
            if (cartDrawer) cartDrawer.style.display = 'none';
            if (searchDropdown) searchDropdown.style.display = 'none';
        }
    });
});
