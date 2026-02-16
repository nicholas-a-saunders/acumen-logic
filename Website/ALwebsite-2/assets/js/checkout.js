// Acumen Logic - Checkout & ThriveCart Integration
// Handles payment buttons, pricing display, and post-purchase actions

(function() {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================

  const CONFIG = {
    // ThriveCart checkout URLs
    CHECKOUT_URLS: {
      STANDARD: 'https://pay.thrivecart.com/acumen-logic-training',
      FOUNDING_1_10: 'https://pay.thrivecart.com/acumen-logic-training-founding', // £99
      FOUNDING_11_50: 'https://pay.thrivecart.com/acumen-logic-training' // £199 with coupon
    },
    
    // Pricing tiers
    PRICING: {
      FOUNDING_1_10: {
        price: 99,
        label: 'Founding Member (First 10)',
        available: 10,
        description: 'Lifetime access, direct feedback loop, testimonial exchange'
      },
      FOUNDING_11_50: {
        price: 199,
        label: 'Founding Member (Spots 11-50)',
        available: 40,
        description: 'Early access pricing before standard rate'
      },
      STANDARD: {
        price: 299,
        label: 'Standard',
        available: null,
        description: 'Full programme access'
      }
    },
    
    // ThriveCart Learn course ID for verification
    COURSE_ID: 'acumen-logic-training-2024',
    
    // Webhook endpoints for post-purchase
    WEBHOOKS: {
      ZAPIER: 'https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/',
      KIT: 'https://api.convertkit.com/v3/courses/YOUR_COURSE_ID/subscribe'
    }
  };

  function isConfiguredEndpoint(url) {
    if (!url || typeof url !== 'string') return false;
    return !(
      url.includes('YOUR_WEBHOOK_ID') ||
      url.includes('YOUR_COURSE_ID') ||
      url.includes('example.com')
    );
  }

  // ============================================
  // PRICING DISPLAY
  // ============================================

  const PricingDisplay = {
    
    /**
     * Get current pricing tier based on sales count
     * In production, this would query your backend/ThriveCart API
     */
    getCurrentTier: function() {
      // Check for stored count in localStorage (fallback)
      const storedCount = parseInt(localStorage.getItem('acumenSalesCount') || '0');
      
      if (storedCount < 10) {
        return { ...CONFIG.PRICING.FOUNDING_1_10, tier: 'FOUNDING_1_10', spotsRemaining: 10 - storedCount };
      } else if (storedCount < 50) {
        return { ...CONFIG.PRICING.FOUNDING_11_50, tier: 'FOUNDING_11_50', spotsRemaining: 50 - storedCount };
      } else {
        return { ...CONFIG.PRICING.STANDARD, tier: 'STANDARD', spotsRemaining: null };
      }
    },

    /**
     * Update all pricing displays on page
     */
    updateDisplays: function() {
      const tier = this.getCurrentTier();
      
      // Update price displays
      document.querySelectorAll('[data-price-display]').forEach(el => {
        el.textContent = `£${tier.price}`;
      });
      
      // Update tier labels
      document.querySelectorAll('[data-tier-label]').forEach(el => {
        el.textContent = tier.label;
      });
      
      // Update urgency messaging
      document.querySelectorAll('[data-urgency]').forEach(el => {
        if (tier.spotsRemaining && tier.spotsRemaining <= 5) {
          el.textContent = `Only ${tier.spotsRemaining} spots remaining at this price`;
          el.classList.remove('hidden');
        } else if (tier.spotsRemaining) {
          el.textContent = `${tier.spotsRemaining} spots remaining before price increases to £${CONFIG.PRICING.STANDARD.price}`;
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      });
      
      // Update checkout buttons
      document.querySelectorAll('[data-checkout-button]').forEach(el => {
        const url = this.getCheckoutUrl(tier.tier);
        el.href = url;
        el.setAttribute('data-tier', tier.tier);
      });
      
      // Update original price strikethrough if applicable
      document.querySelectorAll('[data-original-price]').forEach(el => {
        if (tier.price < CONFIG.PRICING.STANDARD.price) {
          el.textContent = `£${CONFIG.PRICING.STANDARD.price}`;
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      });
    },

    /**
     * Get appropriate checkout URL
     */
    getCheckoutUrl: function(tier) {
      switch(tier) {
        case 'FOUNDING_1_10':
          return CONFIG.CHECKOUT_URLS.FOUNDING_1_10;
        case 'FOUNDING_11_50':
          // Apply coupon code for £199 price
          return `${CONFIG.CHECKOUT_URLS.STANDARD}?coupon=FOUNDING199`;
        default:
          return CONFIG.CHECKOUT_URLS.STANDARD;
      }
    }
  };

  // ============================================
  // CHECKOUT HANDLER
  // ============================================

  const CheckoutHandler = {
    
    /**
     * Initialise checkout buttons
     */
    init: function() {
      // Track button clicks
      document.querySelectorAll('[data-checkout-button], a[href*="thrivecart"]').forEach(button => {
        button.addEventListener('click', (e) => {
          this.trackClick(e, button);
        });
      });
      
      // Check for returning customers
      this.checkReturningCustomer();
    },

    /**
     * Track checkout click for analytics
     */
    trackClick: function(event, button) {
      const tier = button.getAttribute('data-tier') || 'UNKNOWN';
      const price = button.getAttribute('data-price') || PricingDisplay.getCurrentTier().price;
      
      // Google Analytics 4 event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'begin_checkout', {
          currency: 'GBP',
          value: parseFloat(price),
          items: [{
            item_name: 'Acumen Logic Training',
            item_id: CONFIG.COURSE_ID,
            price: parseFloat(price),
            quantity: 1,
            item_category: tier
          }]
        });
      }
      
      // Meta Pixel event
      if (typeof fbq !== 'undefined') {
        fbq('track', 'InitiateCheckout', {
          content_ids: [CONFIG.COURSE_ID],
          content_type: 'product',
          value: parseFloat(price),
          currency: 'GBP'
        });
      }
      
      // Store intent for abandonment recovery
      sessionStorage.setItem('acumenCheckoutIntent', JSON.stringify({
        timestamp: Date.now(),
        tier: tier,
        price: price
      }));
    },

    /**
     * Check if user is returning from checkout
     */
    checkReturningCustomer: function() {
      const urlParams = new URLSearchParams(window.location.search);
      const status = urlParams.get('checkout');
      
      if (status === 'success') {
        this.handleSuccessReturn(urlParams);
      } else if (status === 'cancelled') {
        this.handleCancelledReturn();
      }
    },

    /**
     * Handle successful return from ThriveCart
     */
    handleSuccessReturn: function(params) {
      // Clear checkout intent
      sessionStorage.removeItem('acumenCheckoutIntent');
      
      // Get order details from URL or ThriveCart webhook data
      const orderId = params.get('order_id');
      const email = params.get('email');
      
      // Track purchase
      this.trackPurchase(orderId, email);
      
      // Show success message
      this.showSuccessMessage();
      
      // Trigger course access provisioning
      this.provisionAccess(email);
    },

    /**
     * Handle cancelled checkout
     */
    handleCancelledReturn: function() {
      // Track abandonment
      if (typeof gtag !== 'undefined') {
        gtag('event', 'checkout_cancelled');
      }
      
      // Show recovery message
      const recoveryMsg = document.getElementById('checkout-recovery');
      if (recoveryMsg) {
        recoveryMsg.classList.remove('hidden');
      }
      
      // Trigger abandonment email if email captured
      const intent = JSON.parse(sessionStorage.getItem('acumenCheckoutIntent') || '{}');
      if (intent.email) {
        this.triggerAbandonmentEmail(intent.email);
      }
    },

    /**
     * Track purchase completion
     */
    trackPurchase: function(orderId, email) {
      const tier = PricingDisplay.getCurrentTier();
      
      // Google Analytics 4
      if (typeof gtag !== 'undefined') {
        gtag('event', 'purchase', {
          transaction_id: orderId,
          currency: 'GBP',
          value: tier.price,
          items: [{
            item_name: 'Acumen Logic Training',
            item_id: CONFIG.COURSE_ID,
            price: tier.price,
            quantity: 1
          }]
        });
      }
      
      // Meta Pixel
      if (typeof fbq !== 'undefined') {
        fbq('track', 'Purchase', {
          content_ids: [CONFIG.COURSE_ID],
          content_type: 'product',
          value: tier.price,
          currency: 'GBP',
          order_id: orderId
        });
      }
    },

    /**
     * Show post-purchase success message
     */
    showSuccessMessage: function() {
      const modal = document.getElementById('success-modal');
      if (modal) {
        modal.classList.remove('hidden');
      }
      
      // Redirect to ThriveCart Learn after delay
      setTimeout(() => {
        window.location.href = 'https://thrivecart.com/learn/acumen-logic';
      }, 3000);
    },

    /**
     * Provision course access via ThriveCart Learn
     */
    provisionAccess: function(email) {
      // This would typically be handled by ThriveCart webhook
      // But we can pre-warm the cache here
      if (!isConfiguredEndpoint(CONFIG.WEBHOOKS.ZAPIER)) return;

      fetch(CONFIG.WEBHOOKS.ZAPIER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'purchase_completed',
          email: email,
          course_id: CONFIG.COURSE_ID,
          timestamp: new Date().toISOString()
        }),
        mode: 'no-cors'
      }).catch(() => console.log('Provisioning webhook failed'));
    },

    /**
     * Trigger abandonment recovery email
     */
    triggerAbandonmentEmail: function(email) {
      if (!isConfiguredEndpoint(CONFIG.WEBHOOKS.KIT)) return;

      fetch(CONFIG.WEBHOOKS.KIT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          tags: ['checkout-abandoned'],
          trigger: 'abandonment_sequence'
        }),
        mode: 'no-cors'
      }).catch(() => console.log('Abandonment trigger failed'));
    }
  };

  // ============================================
  // THRIVECART WEBHOOK HANDLER
  // ============================================

  const WebhookHandler = {
    
    /**
     * Process incoming ThriveCart webhook (for server-side)
     * This would be implemented in your backend
     */
    processThriveCartWebhook: function(payload) {
      const event = payload.event;
      
      switch(event) {
        case 'order.success':
          return this.handleOrderSuccess(payload);
        case 'order.refund':
          return this.handleRefund(payload);
        case 'subscription.cancelled':
          return this.handleCancellation(payload);
        default:
          console.log('Unhandled webhook event:', event);
      }
    },

    /**
     * Handle successful order
     */
    handleOrderSuccess: function(payload) {
      const customer = payload.customer;
      const order = payload.order;
      
      // Update sales count
      this.incrementSalesCount();
      
      // Add to Kit with tags
      this.addToKit(customer, order);
      
      // Send to Google Sheets
      this.logToSheet(customer, order);
      
      return { status: 'success', message: 'Order processed' };
    },

    /**
     * Increment sales counter
     */
    incrementSalesCount: function() {
      const current = parseInt(localStorage.getItem('acumenSalesCount') || '0');
      localStorage.setItem('acumenSalesCount', (current + 1).toString());
    },

    /**
     * Add customer to Kit (ConvertKit)
     */
    addToKit: function(customer, order) {
      if (!isConfiguredEndpoint(CONFIG.WEBHOOKS.KIT)) return;

      const tier = this.determineTier(order.amount);
      
      const payload = {
        email: customer.email,
        first_name: customer.first_name,
        tags: ['customer', 'training-purchased', `tier-${tier.toLowerCase()}`],
        fields: {
          purchase_date: new Date().toISOString(),
          purchase_amount: order.amount,
          order_id: order.id
        }
      };
      
      // Send to Kit API
      fetch(CONFIG.WEBHOOKS.KIT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors'
      }).catch(() => console.log('Kit webhook failed'));
    },

    /**
     * Log to Google Sheets via Zapier
     */
    logToSheet: function(customer, order) {
      if (!isConfiguredEndpoint(CONFIG.WEBHOOKS.ZAPIER)) return;

      const payload = {
        timestamp: new Date().toISOString(),
        email: customer.email,
        name: `${customer.first_name} ${customer.last_name}`,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        tier: this.determineTier(order.amount)
      };
      
      fetch(CONFIG.WEBHOOKS.ZAPIER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors'
      }).catch(() => console.log('Sheet logging failed'));
    },

    /**
     * Determine tier from purchase amount
     */
    determineTier: function(amount) {
      if (amount <= 99) return 'FOUNDING_1_10';
      if (amount <= 199) return 'FOUNDING_11_50';
      return 'STANDARD';
    },

    handleRefund: function(payload) {
      // Handle refund logic
      console.log('Refund processed:', payload);
    },

    handleCancellation: function(payload) {
      // Handle cancellation logic
      console.log('Cancellation processed:', payload);
    }
  };

  // ============================================
  // CHECKOUT FLOW UI
  // ============================================

  const CheckoutUI = {
    
    /**
     * Initialise checkout flow components
     */
    init: function() {
      this.initPricingToggle();
      this.initPaymentOptions();
      this.initTrustSignals();
    },

    /**
     * Toggle between pricing options if applicable
     */
    initPricingToggle: function() {
      const toggle = document.querySelector('[data-pricing-toggle]');
      if (!toggle) return;
      
      toggle.addEventListener('change', (e) => {
        const isAnnual = e.target.checked;
        document.querySelectorAll('[data-price]').forEach(el => {
          const monthlyPrice = el.getAttribute('data-price-monthly');
          const annualPrice = el.getAttribute('data-price-annual');
          el.textContent = isAnnual ? annualPrice : monthlyPrice;
        });
      });
    },

    /**
     * Show payment method options
     */
    initPaymentOptions: function() {
      // ThriveCart handles this, but we can show accepted methods
      const options = document.querySelectorAll('[data-payment-method]');
      options.forEach(opt => {
        opt.addEventListener('click', () => {
          options.forEach(o => o.classList.remove('active'));
          opt.classList.add('active');
        });
      });
    },

    /**
     * Initialise trust signal animations
     */
    initTrustSignals: function() {
      // Rotate through testimonials
      const testimonials = document.querySelectorAll('[data-testimonial]');
      if (testimonials.length > 1) {
        let current = 0;
        setInterval(() => {
          testimonials[current].classList.add('hidden');
          current = (current + 1) % testimonials.length;
          testimonials[current].classList.remove('hidden');
        }, 8000);
      }
    },

    /**
     * Show urgency messaging
     */
    showUrgency: function(spotsRemaining) {
      const elements = document.querySelectorAll('[data-urgency-display]');
      elements.forEach(el => {
        if (spotsRemaining && spotsRemaining <= 3) {
          el.innerHTML = `<span class="text-red-400 font-semibold">⚠ Only ${spotsRemaining} spots left!</span>`;
        } else if (spotsRemaining) {
          el.innerHTML = `<span class="text-gold-400">${spotsRemaining} spots remaining</span>`;
        }
      });
    }
  };

  // ============================================
  // PUBLIC API
  // ============================================

  window.Checkout = {
    // Configuration
    config: CONFIG,
    
    // Methods
    getCurrentPrice: function() {
      return PricingDisplay.getCurrentTier();
    },
    
    updatePricing: function() {
      PricingDisplay.updateDisplays();
    },
    
    trackEvent: function(eventName, data) {
      if (typeof gtag !== 'undefined') {
        gtag('event', eventName, data);
      }
    },
    
    // Initialise everything
    init: function() {
      PricingDisplay.updateDisplays();
      CheckoutHandler.init();
      CheckoutUI.init();
      
      // Check URL for returning customers
      CheckoutHandler.checkReturningCustomer();
    }
  };

  // Auto-initialise if on checkout-relevant page
  if (document.querySelector('[data-checkout-button]') || 
      window.location.pathname.includes('masterclass')) {
    document.addEventListener('DOMContentLoaded', window.Checkout.init);
  }

})();
