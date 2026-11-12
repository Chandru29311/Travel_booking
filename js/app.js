/**
 * Wanderlust Luxe - Main Application Logic
 * Pure Vanilla JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. Application State & Storage
  // -------------------------------------------------------------------------
  const AppState = {
    destinationCategory: 'All',
    hotelFilters: {
      search: '',
      destination: 'All',
      type: 'All',
      maxPrice: 500,
      minRating: 0,
      sortBy: 'recommended'
    },
    dates: {
      checkIn: '',
      checkOut: '',
      nights: 1
    },
    guests: {
      adults: 2,
      children: 0,
      rooms: 1
    },
    wishlist: JSON.parse(localStorage.getItem('wanderlust_wishlist')) || [],
    bookings: JSON.parse(localStorage.getItem('wanderlust_bookings')) || [],
    subscribers: JSON.parse(localStorage.getItem('wanderlust_subscribers')) || [],
    activePromoCode: '',
    selectedHotelForBooking: null,
    currentTestimonialIndex: 0,
    testimonialTimer: null
  };

  // -------------------------------------------------------------------------
  // 2. DOM Elements Cache
  // -------------------------------------------------------------------------
  const elements = {
    // Navigation
    header: document.querySelector('.site-header'),
    hamburgerBtn: document.getElementById('hamburgerBtn'),
    navLinks: document.getElementById('navLinks'),
    wishlistTrigger: document.getElementById('wishlistTrigger'),
    wishlistCountBadge: document.getElementById('wishlistCountBadge'),

    // Hero Search
    heroSearchForm: document.getElementById('heroSearchForm'),
    searchDestSelect: document.getElementById('searchDestSelect'),
    checkInInput: document.getElementById('checkInInput'),
    checkOutInput: document.getElementById('checkOutInput'),
    guestSelectorBtn: document.getElementById('guestSelectorBtn'),
    guestSummaryText: document.getElementById('guestSummaryText'),
    guestPopover: document.getElementById('guestPopover'),
    heroQuickTags: document.getElementById('heroQuickTags'),

    // Guest Popover Steppers
    adultsVal: document.getElementById('adultsVal'),
    childrenVal: document.getElementById('childrenVal'),
    roomsVal: document.getElementById('roomsVal'),
    adultsDec: document.getElementById('adultsDec'),
    adultsInc: document.getElementById('adultsInc'),
    childrenDec: document.getElementById('childrenDec'),
    childrenInc: document.getElementById('childrenInc'),
    roomsDec: document.getElementById('roomsDec'),
    roomsInc: document.getElementById('roomsInc'),

    // Destinations Section
    destinationsGrid: document.getElementById('destinationsGrid'),
    categoryTabs: document.getElementById('categoryTabs'),

    // Hotels Section
    hotelsGrid: document.getElementById('hotelsGrid'),
    hotelSearchInput: document.getElementById('hotelSearchInput'),
    hotelDestFilter: document.getElementById('hotelDestFilter'),
    hotelPriceSlider: document.getElementById('hotelPriceSlider'),
    hotelPriceVal: document.getElementById('hotelPriceVal'),
    hotelRatingFilter: document.getElementById('hotelRatingFilter'),
    hotelSortFilter: document.getElementById('hotelSortFilter'),
    hotelTypePills: document.getElementById('hotelTypePills'),
    clearFiltersBtn: document.getElementById('clearFiltersBtn'),
    resultsCount: document.getElementById('resultsCount'),

    // Offers Section
    offersGrid: document.getElementById('offersGrid'),

    // Features Section
    featuresGrid: document.getElementById('featuresGrid'),

    // Testimonials Section
    testimonialTrack: document.getElementById('testimonialTrack'),
    prevTestimonialBtn: document.getElementById('prevTestimonialBtn'),
    nextTestimonialBtn: document.getElementById('nextTestimonialBtn'),
    sliderDotsContainer: document.getElementById('sliderDotsContainer'),

    // Newsletter Section
    newsletterForm: document.getElementById('newsletterForm'),
    newsletterEmail: document.getElementById('newsletterEmail'),

    // Wishlist Drawer
    wishlistDrawer: document.getElementById('wishlistDrawer'),
    drawerBackdrop: document.getElementById('drawerBackdrop'),
    closeDrawerBtn: document.getElementById('closeDrawerBtn'),
    wishlistItemsList: document.getElementById('wishlistItemsList'),
    clearWishlistBtn: document.getElementById('clearWishlistBtn'),

    // Booking Price Estimator Modal
    bookingModal: document.getElementById('bookingModal'),
    modalBackdrop: document.getElementById('modalBackdrop'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    bookingHotelSelect: document.getElementById('bookingHotelSelect'),
    modalHotelImg: document.getElementById('modalHotelImg'),
    modalHotelName: document.getElementById('modalHotelName'),
    modalHotelLoc: document.getElementById('modalHotelLoc'),
    modalHotelRate: document.getElementById('modalHotelRate'),
    modalCheckIn: document.getElementById('modalCheckIn'),
    modalCheckOut: document.getElementById('modalCheckOut'),
    modalRooms: document.getElementById('modalRooms'),
    modalGuests: document.getElementById('modalGuests'),
    addonTransfer: document.getElementById('addonTransfer'),
    addonBreakfast: document.getElementById('addonBreakfast'),
    addonSpa: document.getElementById('addonSpa'),
    modalCouponInput: document.getElementById('modalCouponInput'),
    modalApplyCouponBtn: document.getElementById('modalApplyCouponBtn'),
    couponFeedback: document.getElementById('couponFeedback'),
    calcBaseRate: document.getElementById('calcBaseRate'),
    calcAddons: document.getElementById('calcAddons'),
    calcTaxes: document.getElementById('calcTaxes'),
    calcDiscountRow: document.getElementById('calcDiscountRow'),
    calcDiscount: document.getElementById('calcDiscount'),
    calcTotal: document.getElementById('calcTotal'),
    confirmBookingBtn: document.getElementById('confirmBookingBtn')
  };

  // -------------------------------------------------------------------------
  // Unified Background Scroll Lock Controller
  // -------------------------------------------------------------------------
  const ScrollLock = {
    savedScrollY: 0,
    activeLocks: new Set(),

    lock(reason) {
      if (window.lenis) {
        window.lenis.stop();
      }
      if (this.activeLocks.size === 0) {
        this.savedScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.savedScrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.bottom = '0';
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
      }
      this.activeLocks.add(reason);
      document.body.classList.add(`${reason}-open`);
      document.documentElement.classList.add(`${reason}-open`);
    },

    unlock(reason) {
      this.activeLocks.delete(reason);
      document.body.classList.remove(`${reason}-open`);
      document.documentElement.classList.remove(`${reason}-open`);

      if (this.activeLocks.size === 0) {
        document.body.style.removeProperty('position');
        document.body.style.removeProperty('top');
        document.body.style.removeProperty('left');
        document.body.style.removeProperty('right');
        document.body.style.removeProperty('bottom');
        document.body.style.removeProperty('width');
        document.body.style.removeProperty('overflow');
        document.documentElement.style.removeProperty('overflow');
        window.scrollTo(0, this.savedScrollY);
        if (window.lenis) {
          window.lenis.start();
        }
      }
    },

    isLocked() {
      return this.activeLocks.size > 0 || document.body.classList.contains('menu-open') || document.body.classList.contains('wishlist-open');
    }
  };

  // -------------------------------------------------------------------------
  // 3. Date Validation & Default Initialization
  // -------------------------------------------------------------------------
  function setupDateInputs() {
    const today = new Date();
    const defaultCheckIn = new Date(today);
    defaultCheckIn.setDate(today.getDate() + 7);

    const defaultCheckOut = new Date(today);
    defaultCheckOut.setDate(today.getDate() + 12);

    const formatISO = (d) => d.toISOString().split('T')[0];

    const todayStr = formatISO(today);
    const inStr = formatISO(defaultCheckIn);
    const outStr = formatISO(defaultCheckOut);

    // Set min boundaries
    elements.checkInInput.min = todayStr;
    elements.checkInInput.value = inStr;

    elements.checkOutInput.min = inStr;
    elements.checkOutInput.value = outStr;

    // Synchronize modal date inputs
    elements.modalCheckIn.min = todayStr;
    elements.modalCheckIn.value = inStr;
    elements.modalCheckOut.min = inStr;
    elements.modalCheckOut.value = outStr;

    AppState.dates.checkIn = inStr;
    AppState.dates.checkOut = outStr;
    recalculateNights();

    // Event listeners for check-in change
    elements.checkInInput.addEventListener('change', (e) => {
      handleCheckInChange(e.target.value, elements.checkOutInput);
    });

    elements.checkOutInput.addEventListener('change', (e) => {
      handleCheckOutChange(e.target.value, elements.checkInInput);
    });

    elements.modalCheckIn.addEventListener('change', (e) => {
      handleCheckInChange(e.target.value, elements.modalCheckOut);
      updateBookingModalCalculations();
    });

    elements.modalCheckOut.addEventListener('change', (e) => {
      handleCheckOutChange(e.target.value, elements.modalCheckIn);
      updateBookingModalCalculations();
    });
  }

  function handleCheckInChange(newInVal, targetCheckOutElem) {
    if (!newInVal) return;
    AppState.dates.checkIn = newInVal;
    
    // Check-out must be at least next day
    const inDate = new Date(newInVal);
    const minOut = new Date(inDate);
    minOut.setDate(inDate.getDate() + 1);
    const minOutStr = minOut.toISOString().split('T')[0];

    targetCheckOutElem.min = minOutStr;

    if (new Date(targetCheckOutElem.value) <= inDate) {
      targetCheckOutElem.value = minOutStr;
      AppState.dates.checkOut = minOutStr;
      Toast.show('Dates Updated', 'Check-out automatically adjusted to ensure a valid stay length.', 'info');
    }

    recalculateNights();
    renderHotels();
  }

  function handleCheckOutChange(newOutVal, targetCheckInElem) {
    if (!newOutVal) return;
    const inDate = new Date(targetCheckInElem.value);
    const outDate = new Date(newOutVal);

    if (outDate <= inDate) {
      Toast.show('Invalid Date', 'Check-out date must be after check-in date.', 'warning');
      const resetOut = new Date(inDate);
      resetOut.setDate(inDate.getDate() + 1);
      elements.checkOutInput.value = resetOut.toISOString().split('T')[0];
      AppState.dates.checkOut = elements.checkOutInput.value;
    } else {
      AppState.dates.checkOut = newOutVal;
    }

    recalculateNights();
    renderHotels();
  }

  function recalculateNights() {
    const d1 = new Date(AppState.dates.checkIn);
    const d2 = new Date(AppState.dates.checkOut);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    AppState.dates.nights = diffDays > 0 ? diffDays : 1;
  }

  // -------------------------------------------------------------------------
  // 4. Guest & Room Selector Popover
  // -------------------------------------------------------------------------
  function setupGuestSelector() {
    elements.guestSelectorBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      elements.guestPopover.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!elements.guestPopover.contains(e.target) && !elements.guestSelectorBtn.contains(e.target)) {
        elements.guestPopover.classList.remove('active');
      }
    });

    const updateUI = () => {
      elements.adultsVal.textContent = AppState.guests.adults;
      elements.childrenVal.textContent = AppState.guests.children;
      elements.roomsVal.textContent = AppState.guests.rooms;

      elements.adultsDec.disabled = AppState.guests.adults <= 1;
      elements.adultsInc.disabled = AppState.guests.adults >= 10;
      elements.childrenDec.disabled = AppState.guests.children <= 0;
      elements.childrenInc.disabled = AppState.guests.children >= 6;
      elements.roomsDec.disabled = AppState.guests.rooms <= 1;
      elements.roomsInc.disabled = AppState.guests.rooms >= 5;

      const totalGuests = AppState.guests.adults + AppState.guests.children;
      const guestText = `${totalGuests} Guest${totalGuests > 1 ? 's' : ''}, ${AppState.guests.rooms} Room${AppState.guests.rooms > 1 ? 's' : ''}`;
      elements.guestSummaryText.textContent = guestText;

      // Update modal defaults
      elements.modalGuests.value = totalGuests;
      elements.modalRooms.value = AppState.guests.rooms;
    };

    elements.adultsInc.addEventListener('click', (e) => { e.stopPropagation(); AppState.guests.adults++; updateUI(); });
    elements.adultsDec.addEventListener('click', (e) => { e.stopPropagation(); if (AppState.guests.adults > 1) AppState.guests.adults--; updateUI(); });

    elements.childrenInc.addEventListener('click', (e) => { e.stopPropagation(); AppState.guests.children++; updateUI(); });
    elements.childrenDec.addEventListener('click', (e) => { e.stopPropagation(); if (AppState.guests.children > 0) AppState.guests.children--; updateUI(); });

    elements.roomsInc.addEventListener('click', (e) => { e.stopPropagation(); AppState.guests.rooms++; updateUI(); });
    elements.roomsDec.addEventListener('click', (e) => { e.stopPropagation(); if (AppState.guests.rooms > 1) AppState.guests.rooms--; updateUI(); });

    updateUI();
  }

  // -------------------------------------------------------------------------
  // 5. Render Destinations
  // -------------------------------------------------------------------------
  function renderDestinations() {
    const filtered = AppState.destinationCategory === 'All'
      ? TRAVEL_DATA.destinations
      : TRAVEL_DATA.destinations.filter(d => d.category.toLowerCase() === AppState.destinationCategory.toLowerCase());

    elements.destinationsGrid.innerHTML = filtered.map(d => Components.destinationCard(d)).join('');

    // Attach click events to destination cards to filter hotels and scroll
    elements.destinationsGrid.querySelectorAll('.destination-card').forEach(card => {
      card.addEventListener('click', () => {
        const destName = card.getAttribute('data-dest-name');
        applyDestinationFilterFromCard(destName);
      });
    });

    if (window.AOS) AOS.refresh();
  }

  function setupDestinationCategoryTabs() {
    elements.categoryTabs.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        elements.categoryTabs.querySelector('.tab-btn.active')?.classList.remove('active');
        btn.classList.add('active');
        AppState.destinationCategory = btn.getAttribute('data-category');
        renderDestinations();
      });
    });
  }

  function applyDestinationFilterFromCard(destName) {
    elements.hotelDestFilter.value = destName;
    AppState.hotelFilters.destination = destName;
    renderHotels();

    // Smooth scroll down to hotel section
    const hotelsSection = document.getElementById('hotelsSection');
    hotelsSection.scrollIntoView({ behavior: 'smooth' });

    Toast.show('Filter Applied', `Showing available stays in ${destName}.`, 'info');
  }

  // -------------------------------------------------------------------------
  // 6. Render Hotels & Advanced Filters
  // -------------------------------------------------------------------------
  function renderHotels() {
    let filtered = [...TRAVEL_DATA.hotels];

    // Filter by destination
    if (AppState.hotelFilters.destination !== 'All') {
      filtered = filtered.filter(h => h.destination.toLowerCase() === AppState.hotelFilters.destination.toLowerCase());
    }

    // Filter by hotel type
    if (AppState.hotelFilters.type !== 'All') {
      filtered = filtered.filter(h => h.type.toLowerCase() === AppState.hotelFilters.type.toLowerCase());
    }

    // Filter by search query (name, country, destination)
    if (AppState.hotelFilters.search.trim()) {
      const q = AppState.hotelFilters.search.toLowerCase().trim();
      filtered = filtered.filter(h => 
        h.name.toLowerCase().includes(q) || 
        h.destination.toLowerCase().includes(q) ||
        h.country.toLowerCase().includes(q)
      );
    }

    // Filter by max price
    filtered = filtered.filter(h => h.price <= AppState.hotelFilters.maxPrice);

    // Filter by rating
    if (AppState.hotelFilters.minRating > 0) {
      filtered = filtered.filter(h => h.rating >= AppState.hotelFilters.minRating);
    }

    // Sorting
    switch (AppState.hotelFilters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
      default:
        // 'recommended' - featured first then rating
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating);
    }

    // Update results count indicator
    elements.resultsCount.textContent = `Showing ${filtered.length} stay${filtered.length !== 1 ? 's' : ''}`;

    if (filtered.length === 0) {
      elements.hotelsGrid.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-hotel"></i>
          <h3>No hotels found matching your criteria</h3>
          <p>Try resetting or broadening your price, destination, or rating filters.</p>
          <button class="btn btn-primary btn-sm" id="resetEmptyFilterBtn">Reset Filters</button>
        </div>
      `;
      document.getElementById('resetEmptyFilterBtn')?.addEventListener('click', resetHotelFilters);
      return;
    }

    elements.hotelsGrid.innerHTML = filtered.map(hotel => {
      const isWishlisted = AppState.wishlist.includes(hotel.id);
      return Components.hotelCard(hotel, isWishlisted, AppState.dates.nights);
    }).join('');

    attachHotelCardEvents();
    if (window.AOS) AOS.refresh();
  }

  function attachHotelCardEvents() {
    // Wishlist Toggle Buttons
    elements.hotelsGrid.querySelectorAll('.hotel-wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const hotelId = btn.getAttribute('data-wishlist-id');
        toggleWishlist(hotelId);
      });
    });

    // Book Stay and Quick Estimate Buttons (redirects to 404 error page)
    elements.hotelsGrid.querySelectorAll('.btn-book-stay, .btn-quick-estimate').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        window.location.href = '404.html';
      });
    });
  }

  function setupHotelFilterListeners() {
    // Search input
    elements.hotelSearchInput.addEventListener('input', (e) => {
      AppState.hotelFilters.search = e.target.value;
      renderHotels();
    });

    // Destination select
    elements.hotelDestFilter.addEventListener('change', (e) => {
      AppState.hotelFilters.destination = e.target.value;
      renderHotels();
    });

    // Price range slider
    elements.hotelPriceSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      AppState.hotelFilters.maxPrice = val;
      elements.hotelPriceVal.textContent = `$${val}`;
      renderHotels();
    });

    // Star rating filter
    elements.hotelRatingFilter.addEventListener('change', (e) => {
      AppState.hotelFilters.minRating = parseFloat(e.target.value);
      renderHotels();
    });

    // Sorting filter
    elements.hotelSortFilter.addEventListener('change', (e) => {
      AppState.hotelFilters.sortBy = e.target.value;
      renderHotels();
    });

    // Type pills
    elements.hotelTypePills.querySelectorAll('.type-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        elements.hotelTypePills.querySelector('.type-pill-btn.active')?.classList.remove('active');
        btn.classList.add('active');
        AppState.hotelFilters.type = btn.getAttribute('data-type');
        renderHotels();
      });
    });

    // Clear filters button
    elements.clearFiltersBtn.addEventListener('click', resetHotelFilters);
  }

  function resetHotelFilters() {
    AppState.hotelFilters = {
      search: '',
      destination: 'All',
      type: 'All',
      maxPrice: 500,
      minRating: 0,
      sortBy: 'recommended'
    };

    elements.hotelSearchInput.value = '';
    elements.hotelDestFilter.value = 'All';
    elements.hotelPriceSlider.value = 500;
    elements.hotelPriceVal.textContent = '$500';
    elements.hotelRatingFilter.value = '0';
    elements.hotelSortFilter.value = 'recommended';

    elements.hotelTypePills.querySelector('.type-pill-btn.active')?.classList.remove('active');
    elements.hotelTypePills.querySelector('.type-pill-btn[data-type="All"]')?.classList.add('active');

    renderHotels();
    Toast.show('Filters Reset', 'All hotel filters restored to default.', 'info');
  }

  // -------------------------------------------------------------------------
  // 7. Hero Search Form Submit & Quick Tags
  // -------------------------------------------------------------------------
  function setupHeroSearch() {
    // Populate Hero Destination Dropdown
    const destOptions = TRAVEL_DATA.destinations.map(d => `<option value="${d.name}">${d.name}, ${d.country}</option>`).join('');
    elements.searchDestSelect.innerHTML = `<option value="All">All Worldwide Destinations</option>${destOptions}`;
    elements.hotelDestFilter.innerHTML = `<option value="All">All Destinations</option>${destOptions}`;

    // Populate Booking Modal Dropdown
    elements.bookingHotelSelect.innerHTML = TRAVEL_DATA.hotels.map(h => `<option value="${h.id}">${h.name} (${h.destination}) - $${h.price}/nt</option>`).join('');

    elements.heroSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const chosenDest = elements.searchDestSelect.value;
      AppState.hotelFilters.destination = chosenDest;
      elements.hotelDestFilter.value = chosenDest;

      recalculateNights();
      renderHotels();

      const hotelsSection = document.getElementById('hotelsSection');
      hotelsSection.scrollIntoView({ behavior: 'smooth' });

      Toast.show('Search Updated', `Found stays for ${AppState.dates.nights} night(s) in ${chosenDest}.`, 'success');
    });

    // Quick tag pills (Trending)
    elements.heroQuickTags.querySelectorAll('.quick-tag-pill').forEach(tag => {
      tag.addEventListener('click', () => {
        const dest = tag.getAttribute('data-dest');
        elements.searchDestSelect.value = dest;
        elements.hotelDestFilter.value = dest;
        AppState.hotelFilters.destination = dest;
        renderHotels();
        document.getElementById('hotelsSection').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // -------------------------------------------------------------------------
  // 8. Wishlist Logic (LocalStorage)
  // -------------------------------------------------------------------------
  function updateWishlistBadge() {
    const count = AppState.wishlist.length;
    elements.wishlistCountBadge.textContent = count;
    elements.wishlistCountBadge.style.display = count > 0 ? 'flex' : 'none';
  }

  function toggleWishlist(hotelId) {
    const index = AppState.wishlist.indexOf(hotelId);
    const hotel = TRAVEL_DATA.hotels.find(h => h.id === hotelId);

    if (index > -1) {
      AppState.wishlist.splice(index, 1);
      Toast.show('Removed from Wishlist', `${hotel ? hotel.name : 'Stay'} removed from your saved list.`, 'info');
    } else {
      AppState.wishlist.push(hotelId);
      Toast.show('Saved to Wishlist', `${hotel ? hotel.name : 'Stay'} added to your wishlist!`, 'success');
    }

    localStorage.setItem('wanderlust_wishlist', JSON.stringify(AppState.wishlist));
    updateWishlistBadge();
    renderHotels();
    renderWishlistDrawer();
  }

  function renderWishlistDrawer() {
    if (AppState.wishlist.length === 0) {
      elements.wishlistItemsList.innerHTML = `
        <div style="text-align:center; padding: 40px 10px; color:var(--text-muted);">
          <i class="fa-regular fa-heart" style="font-size:2.5rem; margin-bottom:12px; color:var(--text-light);"></i>
          <p style="font-weight:600; color:var(--primary);">Your wishlist is empty</p>
          <p style="font-size:0.85rem; margin-top:4px;">Tap the heart icon on any hotel card to save your favorite luxury stays.</p>
        </div>
      `;
      return;
    }

    const savedHotels = TRAVEL_DATA.hotels.filter(h => AppState.wishlist.includes(h.id));
    elements.wishlistItemsList.innerHTML = savedHotels.map(h => Components.wishlistItem(h)).join('');

    // Attach actions inside drawer
    elements.wishlistItemsList.querySelectorAll('.wishlist-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-remove-id');
        toggleWishlist(id);
      });
    });

    elements.wishlistItemsList.querySelectorAll('.btn-book-from-wishlist').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '404.html';
      });
    });
  }

  function openWishlistDrawer() {
    renderWishlistDrawer();
    elements.wishlistDrawer.classList.add('active');
    elements.drawerBackdrop.classList.add('active');
    ScrollLock.lock('wishlist');
  }

  function closeWishlistDrawer() {
    elements.wishlistDrawer.classList.remove('active');
    elements.drawerBackdrop.classList.remove('active');
    ScrollLock.unlock('wishlist');
  }

  function setupWishlist() {
    updateWishlistBadge();

    elements.wishlistTrigger.addEventListener('click', openWishlistDrawer);
    elements.closeDrawerBtn.addEventListener('click', closeWishlistDrawer);
    elements.drawerBackdrop.addEventListener('click', closeWishlistDrawer);

    const exploreBtn = elements.wishlistDrawer.querySelector('a[href="#hotelsSection"]');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', closeWishlistDrawer);
    }

    elements.clearWishlistBtn.addEventListener('click', () => {
      if (AppState.wishlist.length === 0) return;
      AppState.wishlist = [];
      localStorage.setItem('wanderlust_wishlist', JSON.stringify(AppState.wishlist));
      updateWishlistBadge();
      renderHotels();
      renderWishlistDrawer();
    });
  }

  // -------------------------------------------------------------------------
  // 9. Special Promotional Offers & Coupon Copying
  // -------------------------------------------------------------------------
  function renderPromotions() {
    elements.offersGrid.innerHTML = TRAVEL_DATA.promotions.map(p => Components.offerCard(p)).join('');

    // Coupon copying event listener
    elements.offersGrid.querySelectorAll('.copy-coupon-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.getAttribute('data-coupon');
        copyCouponCode(code, btn);
      });
    });

    // Apply Deal buttons (redirects to 404 error page)
    elements.offersGrid.querySelectorAll('.btn-apply-deal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '404.html';
      });
    });
  }

  function copyCouponCode(code, btnElement) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(() => {
        handleCopiedState(btnElement, code);
      }).catch(() => fallbackCopy(code, btnElement));
    } else {
      fallbackCopy(code, btnElement);
    }
  }

  function fallbackCopy(code, btnElement) {
    const tempInput = document.createElement('input');
    tempInput.value = code;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    handleCopiedState(btnElement, code);
  }

  function handleCopiedState(btnElement, code) {
    btnElement.classList.add('copied');
    btnElement.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
    Toast.show('Coupon Copied!', `Promo code "${code}" is copied to your clipboard.`, 'success');

    setTimeout(() => {
      btnElement.classList.remove('copied');
      btnElement.innerHTML = '<i class="fa-regular fa-copy"></i> Copy';
    }, 3000);
  }

  // -------------------------------------------------------------------------
  // 10. Why Choose Us Section
  // -------------------------------------------------------------------------
  function renderFeatures() {
    elements.featuresGrid.innerHTML = TRAVEL_DATA.features.map(f => Components.featureCard(f)).join('');
  }

  // -------------------------------------------------------------------------
  // 11. Customer Testimonial Slider
  // -------------------------------------------------------------------------
  function renderTestimonials() {
    elements.testimonialTrack.innerHTML = TRAVEL_DATA.testimonials.map(t => Components.testimonialSlide(t)).join('');

    // Render dot indicators
    elements.sliderDotsContainer.innerHTML = TRAVEL_DATA.testimonials.map((_, i) => 
      `<div class="slider-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>`
    ).join('');

    setupTestimonialControls();
  }

  function setupTestimonialControls() {
    const totalSlides = TRAVEL_DATA.testimonials.length;

    const goToSlide = (idx) => {
      AppState.currentTestimonialIndex = (idx + totalSlides) % totalSlides;
      elements.testimonialTrack.style.transform = `translateX(-${AppState.currentTestimonialIndex * 100}%)`;

      // Update dots
      elements.sliderDotsContainer.querySelectorAll('.slider-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === AppState.currentTestimonialIndex);
      });
    };

    elements.prevTestimonialBtn.addEventListener('click', () => {
      goToSlide(AppState.currentTestimonialIndex - 1);
      resetAutoPlay();
    });

    elements.nextTestimonialBtn.addEventListener('click', () => {
      goToSlide(AppState.currentTestimonialIndex + 1);
      resetAutoPlay();
    });

    elements.sliderDotsContainer.querySelectorAll('.slider-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-index'), 10);
        goToSlide(idx);
        resetAutoPlay();
      });
    });

    // Auto Play with hover pause
    function startAutoPlay() {
      AppState.testimonialTimer = setInterval(() => {
        goToSlide(AppState.currentTestimonialIndex + 1);
      }, 5500);
    }

    function resetAutoPlay() {
      clearInterval(AppState.testimonialTimer);
      startAutoPlay();
    }

    const sliderWrapper = document.querySelector('.testimonial-slider-container');
    sliderWrapper.addEventListener('mouseenter', () => clearInterval(AppState.testimonialTimer));
    sliderWrapper.addEventListener('mouseleave', startAutoPlay);

    startAutoPlay();
  }

  // -------------------------------------------------------------------------
  // 12. Dynamic Booking Price Estimation Modal
  // -------------------------------------------------------------------------
  function openBookingModal(hotelId, prefillCoupon = '') {
    const hotel = TRAVEL_DATA.hotels.find(h => h.id === hotelId) || TRAVEL_DATA.hotels[0];
    AppState.selectedHotelForBooking = hotel;

    elements.bookingHotelSelect.value = hotel.id;
    updateModalHotelInfo(hotel);

    // Sync dates and rooms
    elements.modalCheckIn.value = AppState.dates.checkIn;
    elements.modalCheckOut.value = AppState.dates.checkOut;
    elements.modalRooms.value = AppState.guests.rooms;
    elements.modalGuests.value = AppState.guests.adults + AppState.guests.children;

    if (prefillCoupon) {
      elements.modalCouponInput.value = prefillCoupon;
      AppState.activePromoCode = prefillCoupon;
    } else {
      elements.modalCouponInput.value = '';
      AppState.activePromoCode = '';
    }

    elements.couponFeedback.textContent = '';
    updateBookingModalCalculations();

    elements.bookingModal.classList.add('active');
    elements.modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeBookingModal() {
    elements.bookingModal.classList.remove('active');
    elements.modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateModalHotelInfo(hotel) {
    elements.modalHotelImg.src = hotel.image;
    elements.modalHotelName.textContent = hotel.name;
    elements.modalHotelLoc.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${hotel.destination}, ${hotel.country}`;
    elements.modalHotelRate.textContent = `$${hotel.price} / night`;
  }

  function updateBookingModalCalculations() {
    if (!AppState.selectedHotelForBooking) return;

    const hotel = AppState.selectedHotelForBooking;
    const inD = new Date(elements.modalCheckIn.value);
    const outD = new Date(elements.modalCheckOut.value);
    const diffNights = Math.max(1, Math.ceil((outD - inD) / (1000 * 60 * 60 * 24)));
    const rooms = parseInt(elements.modalRooms.value, 10) || 1;

    // Base accommodation calculation
    const baseTotal = hotel.price * diffNights * rooms;
    elements.calcBaseRate.textContent = `$${baseTotal} ($${hotel.price} x ${diffNights}nt x ${rooms}rm)`;

    // Addons calculation
    let addonsTotal = 0;
    if (elements.addonTransfer.checked) addonsTotal += 45;
    if (elements.addonBreakfast.checked) addonsTotal += (25 * diffNights * parseInt(elements.modalGuests.value, 10));
    if (elements.addonSpa.checked) addonsTotal += 60;
    elements.calcAddons.textContent = `$${addonsTotal}`;

    // Taxes & Fees (12% of base + addons)
    const taxes = Math.round((baseTotal + addonsTotal) * 0.12);
    elements.calcTaxes.textContent = `$${taxes}`;

    // Promotional Coupon Discount
    let discountAmount = 0;
    const promo = TRAVEL_DATA.promotions.find(p => p.code.toUpperCase() === AppState.activePromoCode.toUpperCase());
    
    if (promo) {
      if (promo.type === 'percentage') {
        discountAmount = Math.round((baseTotal + addonsTotal) * promo.value);
      } else if (promo.type === 'flat') {
        discountAmount = promo.value;
      }
      elements.calcDiscountRow.style.display = 'flex';
      elements.calcDiscount.textContent = `-$${discountAmount} (${promo.discount})`;
      elements.couponFeedback.textContent = `Promo applied: ${promo.title}`;
      elements.couponFeedback.style.color = 'var(--secondary)';
    } else {
      elements.calcDiscountRow.style.display = 'none';
    }

    // Grand total
    const grandTotal = Math.max(0, (baseTotal + addonsTotal + taxes) - discountAmount);
    elements.calcTotal.textContent = `$${grandTotal}`;
  }

  function setupBookingModal() {
    elements.closeModalBtn.addEventListener('click', closeBookingModal);
    elements.modalBackdrop.addEventListener('click', closeBookingModal);

    // Hotel selector change inside modal
    elements.bookingHotelSelect.addEventListener('change', (e) => {
      const selected = TRAVEL_DATA.hotels.find(h => h.id === e.target.value);
      if (selected) {
        AppState.selectedHotelForBooking = selected;
        updateModalHotelInfo(selected);
        updateBookingModalCalculations();
      }
    });

    // Checkbox toggles and inputs
    [elements.addonTransfer, elements.addonBreakfast, elements.addonSpa, elements.modalRooms, elements.modalGuests].forEach(input => {
      input.addEventListener('change', updateBookingModalCalculations);
    });

    // Coupon code apply button
    elements.modalApplyCouponBtn.addEventListener('click', () => {
      const enteredCode = elements.modalCouponInput.value.trim().toUpperCase();
      if (!enteredCode) {
        Toast.show('Empty Code', 'Please enter a promotional code.', 'warning');
        return;
      }

      const found = TRAVEL_DATA.promotions.find(p => p.code.toUpperCase() === enteredCode);
      if (found) {
        AppState.activePromoCode = enteredCode;
        Toast.show('Coupon Applied!', `Applied ${found.discount} discount!`, 'success');
      } else {
        AppState.activePromoCode = '';
        elements.couponFeedback.textContent = 'Invalid promo code. Check our Special Offers!';
        elements.couponFeedback.style.color = 'var(--coral)';
        Toast.show('Invalid Coupon', 'The entered code does not exist or has expired.', 'error');
      }
      updateBookingModalCalculations();
    });

    // Confirm Booking
    elements.confirmBookingBtn.addEventListener('click', () => {
      const bookingRef = 'WNDR-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const newBooking = {
        ref: bookingRef,
        hotel: AppState.selectedHotelForBooking.name,
        destination: AppState.selectedHotelForBooking.destination,
        checkIn: elements.modalCheckIn.value,
        checkOut: elements.modalCheckOut.value,
        guests: elements.modalGuests.value,
        rooms: elements.modalRooms.value,
        total: elements.calcTotal.textContent,
        createdAt: new Date().toISOString()
      };

      AppState.bookings.push(newBooking);
      localStorage.setItem('wanderlust_bookings', JSON.stringify(AppState.bookings));

      closeBookingModal();
      Toast.show('Booking Confirmed! 🎉', `Ref: ${bookingRef}. A confirmation summary has been saved to your account.`, 'success', 5000);
    });
  }

  // -------------------------------------------------------------------------
  // 13. Newsletter Form Validation
  // -------------------------------------------------------------------------
  function setupNewsletter() {
    elements.newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Inline required HTML5 validation check (no popups)
      if (!elements.newsletterEmail.checkValidity()) {
        elements.newsletterEmail.reportValidity();
        return;
      }

      const email = elements.newsletterEmail.value.trim();
      if (email) {
        if (!AppState.subscribers.includes(email)) {
          AppState.subscribers.push(email);
          localStorage.setItem('wanderlust_subscribers', JSON.stringify(AppState.subscribers));
        }
        // Redirect to 404 error page on successful submission
        window.location.href = '404.html';
      }
    });
  }

  // -------------------------------------------------------------------------
  // 14. Mobile Navigation & Header Scroll State
  // -------------------------------------------------------------------------
  function setupNavigation() {
    window.addEventListener('scroll', () => {
      if (ScrollLock.isLocked()) {
        window.scrollTo(0, ScrollLock.savedScrollY);
        return;
      }
      if (window.scrollY > 40) {
        elements.header.classList.add('scrolled');
      } else {
        elements.header.classList.remove('scrolled');
      }
    });

    elements.hamburgerBtn.addEventListener('click', () => {
      const isOpen = elements.navLinks.classList.toggle('mobile-open');
      elements.hamburgerBtn.classList.toggle('active', isOpen);
      
      if (isOpen) {
        ScrollLock.lock('menu');
      } else {
        ScrollLock.unlock('menu');
      }
    });

    // Close menu when clicking nav links
    elements.navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        elements.navLinks.classList.remove('mobile-open');
        elements.hamburgerBtn.classList.remove('active');
        ScrollLock.unlock('menu');
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (elements.navLinks.classList.contains('mobile-open')) {
          elements.navLinks.classList.remove('mobile-open');
          elements.hamburgerBtn.classList.remove('active');
          ScrollLock.unlock('menu');
        }
        if (elements.wishlistDrawer.classList.contains('active')) {
          closeWishlistDrawer();
        }
      }

      // Block keyboard navigation scrolling when background is locked
      if (ScrollLock.isLocked()) {
        if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
          if (!e.target.closest('#wishlistDrawer')) {
            e.preventDefault();
          }
        }
      }
    });

    // Prevent any background scrolling on window and document
    const preventScrollAction = (e) => {
      if (document.body.classList.contains('menu-open')) {
        e.preventDefault();
        return;
      }
      if (document.body.classList.contains('wishlist-open')) {
        // If event is outside the wishlist drawer, block background scrolling completely
        if (!e.target.closest('#wishlistDrawer')) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener('wheel', preventScrollAction, { passive: false });
    document.addEventListener('wheel', preventScrollAction, { passive: false });

    window.addEventListener('touchmove', preventScrollAction, { passive: false });
    document.addEventListener('touchmove', preventScrollAction, { passive: false });
  }

  // -------------------------------------------------------------------------
  // 15. AOS (Animate on Scroll) Initialization
  // -------------------------------------------------------------------------
  function initAOS() {
    if (window.AOS) {
      AOS.init({
        duration: 750,
        easing: 'ease-out-cubic',
        once: false,
        mirror: true,
        offset: 60
      });
    }
  }

  // -------------------------------------------------------------------------
  // 16. Preloading Animation
  // -------------------------------------------------------------------------
  function setupPreloader() {
    const preloader = document.getElementById('preloader');
    const preloaderBar = document.querySelector('.preloader-bar');
    if (!preloader) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 25) + 20;
      if (progress > 100) progress = 100;
      if (preloaderBar) preloaderBar.style.width = `${progress}%`;

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          preloader.classList.add('loaded');
          if (window.AOS) AOS.refresh();
          if (window.lenis) window.lenis.resize();
        }, 220);
      }
    }, 60);

    // Safety fallback
    window.addEventListener('load', () => {
      setTimeout(() => {
        if (!preloader.classList.contains('loaded')) {
          if (preloaderBar) preloaderBar.style.width = '100%';
          setTimeout(() => {
            preloader.classList.add('loaded');
            if (window.AOS) AOS.refresh();
            if (window.lenis) window.lenis.resize();
          }, 150);
        }
      }, 500);
    });
  }

  // -------------------------------------------------------------------------
  // 17. Lenis Smooth Scrolling Animation (Mobile Responsive Safe)
  // -------------------------------------------------------------------------
  function initLenis() {
    if (typeof window.Lenis === 'undefined') return;

    // Respect reduced motion settings
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    window.lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false, // Guarantees 100% native mobile responsiveness without lag or touch gesture conflicts
      touchMultiplier: 1.5,
      infinite: false
    });

    // Synchronize scroll events with AOS animations
    window.lenis.on('scroll', () => {
      if (window.AOS) {
        AOS.refresh();
      }
    });

    function raf(time) {
      if (window.lenis) {
        window.lenis.raf(time);
      }
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // -------------------------------------------------------------------------
  // Application Bootstrap
  // -------------------------------------------------------------------------
  function init() {
    setupPreloader();
    setupNavigation();
    setupDateInputs();
    setupGuestSelector();
    renderDestinations();
    setupDestinationCategoryTabs();
    setupHeroSearch();
    renderHotels();
    setupHotelFilterListeners();
    renderPromotions();
    renderFeatures();
    renderTestimonials();
    setupWishlist();
    setupBookingModal();
    setupNewsletter();
    initAOS();
    initLenis();
  }

  init();
});
