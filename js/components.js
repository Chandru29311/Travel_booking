/**
 * Wanderlust Luxe - HTML Component Renderers & Helpers
 */

const Components = {
  /**
   * Render Destination Card
   */
  destinationCard(dest) {
    return `
      <div class="destination-card hover-lift" data-aos="fade-up" data-dest-id="${dest.id}" data-dest-name="${dest.name}">
        <div class="dest-img-wrap">
          <img src="${dest.image}" alt="${dest.name}, ${dest.country}" loading="lazy">
          <span class="dest-tag">${dest.tag}</span>
          <span class="dest-rating">
            <i class="fa-solid fa-star"></i> ${dest.rating.toFixed(2)}
          </span>
        </div>
        <div class="dest-body">
          <div class="dest-header">
            <h3 class="dest-title">${dest.name}</h3>
            <p class="dest-country"><i class="fa-solid fa-location-dot"></i> ${dest.country}</p>
          </div>
          <p class="dest-desc">${dest.description}</p>
          <div class="dest-footer">
            <div class="dest-price-box">
              <span class="dest-price-label">From</span>
              <span class="dest-price-val">$${dest.startingPrice}<small style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">/nt</small></span>
            </div>
            <span class="dest-stays-count"><i class="fa-solid fa-hotel"></i> ${dest.staysCount} Stays</span>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render Hotel Listing Card
   */
  hotelCard(hotel, isWishlisted = false, nights = 1) {
    const amenitiesHtml = hotel.amenities.slice(0, 3).map(a => `<span class="amenity-tag">${a}</span>`).join('');
    const totalEst = hotel.price * nights;

    return `
      <div class="hotel-card hover-lift" data-aos="fade-up" data-hotel-id="${hotel.id}">
        <div class="hotel-media">
          <img src="${hotel.image}" alt="${hotel.name}" loading="lazy">
          <span class="hotel-badge">${hotel.badge}</span>
          <button class="hotel-wishlist-btn ${isWishlisted ? 'active' : ''}" 
                  data-wishlist-id="${hotel.id}" 
                  title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}"
                  aria-label="Wishlist">
            <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>
        </div>
        <div class="hotel-details">
          <div class="hotel-top-meta">
            <span class="hotel-location">
              <i class="fa-solid fa-location-dot" style="color:var(--accent);"></i> ${hotel.destination}, ${hotel.country}
            </span>
            <span class="hotel-rating-badge">
              <i class="fa-solid fa-star"></i> ${hotel.rating.toFixed(2)} (${hotel.reviewsCount})
            </span>
          </div>
          
          <h3 class="hotel-name">${hotel.name}</h3>
          
          <div class="hotel-amenities-list">
            ${amenitiesHtml}
          </div>

          <div class="hotel-pricing-row">
            <div class="price-meta">
              ${hotel.originalPrice ? `<span class="original-price">$${hotel.originalPrice}</span>` : ''}
              <div>
                <span class="current-price">$${hotel.price}</span>
                <span class="per-night">/ night</span>
              </div>
              ${nights > 1 ? `<span style="font-size:0.75rem; color:var(--secondary); font-weight:600;">~$${totalEst} for ${nights} nights</span>` : ''}
            </div>

            <div class="hotel-action-btns">
              <a href="404.html" class="btn btn-secondary btn-sm btn-quick-estimate" title="Calculate total booking price">
                <i class="fa-solid fa-calculator"></i>
              </a>
              <a href="404.html" class="btn btn-primary btn-sm btn-book-stay">
                Book Stay
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render Special Promotional Offer Card
   */
  offerCard(promo) {
    return `
      <div class="offer-card" data-aos="fade-up">
        <div class="offer-media">
          <img src="${promo.image}" alt="${promo.title}" loading="lazy">
          <span class="offer-discount-badge">${promo.discount}</span>
        </div>
        <div class="offer-content">
          <div>
            <span class="offer-badge-tag">${promo.badge}</span>
            <h3 class="offer-title">${promo.title}</h3>
            <p class="offer-sub">${promo.subtitle}</p>
          </div>

          <div>
            <div class="offer-code-box">
              <div class="code-details">
                <span class="code-title">Promo Code</span>
                <span class="coupon-code">${promo.code}</span>
              </div>
              <button class="copy-coupon-btn" data-coupon="${promo.code}">
                <i class="fa-regular fa-copy"></i> Copy
              </button>
            </div>

            <div class="offer-meta-row">
              <span><i class="fa-regular fa-clock"></i> Expires: ${promo.validUntil}</span>
              <a href="404.html" class="btn-apply-deal" style="color:var(--accent); font-weight:700; font-size:0.8rem; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
                Apply Deal <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render Testimonial Slide
   */
  testimonialSlide(item) {
    const stars = Array(item.rating).fill('<i class="fa-solid fa-star"></i>').join('');
    return `
      <div class="testimonial-slide">
        <div class="testimonial-card">
          <i class="fa-solid fa-quote-right quote-icon-decor"></i>
          <div class="test-stars">${stars}</div>
          <p class="test-quote">"${item.review}"</p>
          <div class="test-author-row">
            <div class="author-profile">
              <img src="${item.avatar}" alt="${item.name}" class="author-avatar" loading="lazy">
              <div class="author-details">
                <h4>${item.name}</h4>
                <p>${item.role} • ${item.location}</p>
              </div>
            </div>
            <div class="stay-badge">
              <i class="fa-solid fa-circle-check"></i> Stayed in ${item.destination}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render Feature Card
   */
  featureCard(feat) {
    return `
      <div class="feature-card" data-aos="fade-up">
        <div class="feature-icon-wrap">
          <i class="fa-solid ${feat.icon}"></i>
        </div>
        <h3 class="feature-title">${feat.title}</h3>
        <p class="feature-desc">${feat.description}</p>
      </div>
    `;
  },

  /**
   * Render Wishlist Drawer Item
   */
  wishlistItem(hotel) {
    return `
      <div class="wishlist-item" data-wishlist-item-id="${hotel.id}">
        <img src="${hotel.image}" alt="${hotel.name}" class="wishlist-thumb">
        <div class="wishlist-info">
          <div>
            <h4>${hotel.name}</h4>
            <p><i class="fa-solid fa-location-dot"></i> ${hotel.destination}, ${hotel.country}</p>
          </div>
          <div class="wishlist-actions">
            <span class="wishlist-price">$${hotel.price}<small style="font-weight:normal; font-size:0.75rem; color:var(--text-muted)">/nt</small></span>
            <div style="display:flex; align-items:center; gap:8px;">
              <a href="404.html" class="btn btn-primary btn-sm btn-book-from-wishlist">Book</a>
              <button class="wishlist-remove-btn" data-remove-id="${hotel.id}" title="Remove item">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};

/**
 * Toast Notification Dispatcher
 */
const Toast = {
  show(title, message, type = 'info', duration = 3500) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = {
      success: 'fa-circle-check',
      warning: 'fa-triangle-exclamation',
      error: 'fa-circle-xmark',
      info: 'fa-circle-info'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <i class="fa-solid ${icons[type] || icons.info} toast-icon"></i>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};
