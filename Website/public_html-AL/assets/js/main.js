// Acumen Logic - Main JavaScript
// Core functionality shared across all pages

(function() {
  'use strict';

  document.documentElement.classList.add('js');
  const gaMeta = document.querySelector('meta[name="ga-measurement-id"]');
  const GA_MEASUREMENT_ID = (window.ACUMEN_GA_MEASUREMENT_ID || (gaMeta && gaMeta.content) || '').trim();
  const COOKIE_CONSENT_KEY = 'acumenCookieConsentV1';
  const COOKIE_CONSENT_VALUES = {
    accepted: 'accepted',
    rejected: 'rejected'
  };
  let gaLoaded = false;

  // ============================================
  // MOBILE MENU
  // ============================================

  function initMobileMenu() {
    const menuButton = document.querySelector('[data-mobile-menu-button]');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!menuButton || !mobileMenu) return;
    
    menuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
      const isOpen = !mobileMenu.classList.contains('hidden');
      menuButton.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!mobileMenu.contains(e.target) && !menuButton.contains(e.target)) {
        mobileMenu.classList.add('hidden');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ============================================
  // STICKY HEADER
  // ============================================

  function initStickyHeader() {
    const header = document.getElementById('navbar');
    if (!header) return;

    const scrollThreshold = 50;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > scrollThreshold) {
        header.classList.add('navbar-scrolled');
      } else {
        header.classList.remove('navbar-scrolled');
      }
    }, { passive: true });
  }

  // ============================================
  // SMOOTH SCROLL
  // ============================================

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      });
    });
  }

  // ============================================
  // SCROLL REVEAL ANIMATION
  // ============================================

  function initScrollReveal() {
    const targets = document.querySelectorAll('.reveal, [data-reveal]');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach(el => {
        if (el.classList.contains('reveal')) {
          el.classList.add('active');
        } else {
          el.classList.add('animate-fade-in');
          el.style.opacity = '1';
        }
      });
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('reveal')) {
            entry.target.classList.add('active');
          } else {
            entry.target.classList.add('animate-fade-in');
            entry.target.style.opacity = '1';
          }
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    targets.forEach(el => {
      observer.observe(el);
    });

    // Fallback: ensure content is visible even if observers fail
    setTimeout(() => {
      document.querySelectorAll('.reveal:not(.active)').forEach(el => {
        el.classList.add('active');
      });
      document.querySelectorAll('[data-reveal]').forEach(el => {
        if (!el.style.opacity || el.style.opacity === '0') {
          el.style.opacity = '1';
        }
      });
    }, 500);
  }

  // ============================================
  // FORM VALIDATION
  // ============================================

  function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
      form.addEventListener('submit', function(e) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
          if (!field.value.trim()) {
            isValid = false;
            field.classList.add('border-red-400');
          } else {
            field.classList.remove('border-red-400');
          }
        });

        // Email validation
        const emailField = form.querySelector('input[type="email"]');
        if (emailField && emailField.value) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(emailField.value)) {
            isValid = false;
            emailField.classList.add('border-red-400');
          }
        }

        if (!isValid) {
          e.preventDefault();
        }
      });
    });
  }

  // ============================================
  // COPY TO CLIPBOARD
  // ============================================

  function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise((resolve, reject) => {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (successful) {
          resolve();
        } else {
          reject(new Error('Copy command failed'));
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  function initCopyToClipboard() {
    document.querySelectorAll('[data-copy]').forEach(button => {
      button.addEventListener('click', function() {
        const text = this.getAttribute('data-copy');
        copyTextToClipboard(text).then(() => {
          const originalText = this.innerHTML;
          this.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
          if (typeof lucide !== 'undefined') lucide.createIcons();
          
          setTimeout(() => {
            this.innerHTML = originalText;
            if (typeof lucide !== 'undefined') lucide.createIcons();
          }, 2000);
        }).catch(() => {
          this.classList.add('border-rose-300');
          setTimeout(() => this.classList.remove('border-rose-300'), 1500);
        });
      });
    });
  }

  // ============================================
  // SHARE BUTTONS
  // ============================================

  function initShareButtons() {
    const shareButtons = document.querySelectorAll('[data-share]');
    if (!shareButtons.length) return;

    const pageUrl = window.location.href.split('#')[0];
    const pageTitle = document.title;

    shareButtons.forEach(button => {
      button.addEventListener('click', function() {
        const platform = this.getAttribute('data-share');

        if (platform === 'linkedin') {
          const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
          window.open(shareUrl, '_blank', 'noopener,noreferrer');
          return;
        }

        if (platform === 'x') {
          const shareUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(pageTitle)}`;
          window.open(shareUrl, '_blank', 'noopener,noreferrer');
          return;
        }

        if (platform === 'copy') {
          const originalHtml = this.innerHTML;
          copyTextToClipboard(pageUrl).then(() => {
            this.innerHTML = '<i data-lucide="check" class="w-5 h-5"></i>';
            if (typeof lucide !== 'undefined') lucide.createIcons();

            setTimeout(() => {
              this.innerHTML = originalHtml;
              if (typeof lucide !== 'undefined') lucide.createIcons();
            }, 1500);
          }).catch(() => {
            this.classList.add('border-rose-300');
            setTimeout(() => this.classList.remove('border-rose-300'), 1500);
          });
        }
      });
    });
  }

  // ============================================
  // CURRENT YEAR (Footer)
  // ============================================

  function initCurrentYear() {
    const yearElements = document.querySelectorAll('[data-year]');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(el => {
      el.textContent = currentYear;
    });
  }

  // ============================================
  // EXTERNAL LINKS (New Tab)
  // ============================================

  function initExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(link => {
      if (!link.href.includes(window.location.hostname)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  // ============================================
  // LOADING STATE
  // ============================================

  function initLoadingState() {
    document.body.classList.add('loaded');
  }

  // ============================================
  // COOKIE CONSENT + ANALYTICS
  // ============================================

  function readLocalStorage(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (err) {
      return null;
    }
  }

  function writeLocalStorage(key, value) {
    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (err) {
      return false;
    }
  }

  function isValidGaId(id) {
    return /^G-[A-Z0-9]+$/i.test(id || '');
  }

  function getCookieConsent() {
    const value = readLocalStorage(COOKIE_CONSENT_KEY);
    if (value === COOKIE_CONSENT_VALUES.accepted || value === COOKIE_CONSENT_VALUES.rejected) {
      return value;
    }
    return null;
  }

  function hideCookieBanner() {
    const banner = document.getElementById('cookieConsentBanner');
    if (!banner) return;
    banner.classList.add('hidden');
    banner.setAttribute('aria-hidden', 'true');
  }

  function showCookieBanner() {
    const banner = document.getElementById('cookieConsentBanner');
    if (!banner) return;
    banner.classList.remove('hidden');
    banner.setAttribute('aria-hidden', 'false');
  }

  function loadGoogleAnalytics() {
    if (gaLoaded || window.__acumenGaLoaded) return;
    if (!isValidGaId(GA_MEASUREMENT_ID)) return;

    if (document.getElementById('acumen-ga-script')) {
      gaLoaded = true;
      window.__acumenGaLoaded = true;
      return;
    }

    window[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      anonymize_ip: true
    });

    const gaScript = document.createElement('script');
    gaScript.id = 'acumen-ga-script';
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
    document.head.appendChild(gaScript);

    gaLoaded = true;
    window.__acumenGaLoaded = true;
  }

  function disableGoogleAnalytics() {
    if (!isValidGaId(GA_MEASUREMENT_ID)) return;
    window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
  }

  function setCookieConsent(choice) {
    if (choice !== COOKIE_CONSENT_VALUES.accepted && choice !== COOKIE_CONSENT_VALUES.rejected) return;
    writeLocalStorage(COOKIE_CONSENT_KEY, choice);

    if (choice === COOKIE_CONSENT_VALUES.accepted) {
      loadGoogleAnalytics();
      hideCookieBanner();
      return;
    }

    disableGoogleAnalytics();
    hideCookieBanner();

    // If analytics was loaded earlier in this session, reload so it stays off.
    if (gaLoaded || window.__acumenGaLoaded) {
      window.location.reload();
    }
  }

  function createCookieBanner() {
    if (document.getElementById('cookieConsentBanner')) return;

    const banner = document.createElement('section');
    banner.id = 'cookieConsentBanner';
    banner.className = 'fixed bottom-4 left-4 right-4 z-50 max-w-3xl mx-auto rounded-xl border border-navy-200 bg-white shadow-2xl shadow-navy-900/10 p-4 sm:p-5 hidden';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Cookie preferences');
    banner.setAttribute('aria-hidden', 'true');
    banner.innerHTML = `
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div class="pr-0 sm:pr-4">
          <p class="text-sm font-semibold text-navy-700">Cookie preferences</p>
          <p class="mt-1 text-sm text-navy-500">
            We use essential storage for site functions and optional analytics cookies for Google Analytics.
          </p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button type="button" data-cookie-reject class="px-3 py-2 text-sm font-medium rounded-md border border-navy-200 text-navy-600 hover:bg-navy-50 transition-colors">
            Reject analytics
          </button>
          <button type="button" data-cookie-accept class="px-3 py-2 text-sm font-semibold rounded-md bg-navy-700 text-white hover:bg-navy-800 transition-colors">
            Accept analytics
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    const acceptBtn = banner.querySelector('[data-cookie-accept]');
    const rejectBtn = banner.querySelector('[data-cookie-reject]');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => setCookieConsent(COOKIE_CONSENT_VALUES.accepted));
    }
    if (rejectBtn) {
      rejectBtn.addEventListener('click', () => setCookieConsent(COOKIE_CONSENT_VALUES.rejected));
    }
  }

  function injectCookiePreferenceLinks() {
    const footerBars = document.querySelectorAll('footer .border-t');
    if (!footerBars.length) return;

    footerBars.forEach(bar => {
      if (bar.querySelector('[data-cookie-preferences]')) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('data-cookie-preferences', 'true');
      button.className = 'text-sm text-navy-500 hover:text-gold-400 transition-colors';
      button.textContent = 'Cookie preferences';
      button.addEventListener('click', () => {
        showCookieBanner();
      });
      bar.appendChild(button);
    });
  }

  function initCookieConsent() {
    createCookieBanner();
    injectCookiePreferenceLinks();

    const consent = getCookieConsent();
    if (consent === COOKIE_CONSENT_VALUES.accepted) {
      loadGoogleAnalytics();
      hideCookieBanner();
      return;
    }

    if (consent === COOKIE_CONSENT_VALUES.rejected) {
      disableGoogleAnalytics();
      hideCookieBanner();
      return;
    }

    showCookieBanner();
  }

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  window.acumenUtils = {
    // Debounce function
    debounce: function(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    // Format number with commas
    formatNumber: function(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    // Format currency
    formatCurrency: function(num, currency = '£') {
      return currency + this.formatNumber(num.toFixed(2));
    },

    // Format percentage
    formatPercent: function(num, decimals = 1) {
      return num.toFixed(decimals) + '%';
    },

    // Scroll to element
    scrollTo: function(elementId, offset = 80) {
      const element = document.getElementById(elementId);
      if (!element) return;
      
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // ============================================
  // INITIALISE
  // ============================================

  function init() {
    initMobileMenu();
    initStickyHeader();
    initSmoothScroll();
    initScrollReveal();
    initFormValidation();
    initCopyToClipboard();
    initShareButtons();
    initCurrentYear();
    initExternalLinks();
    initCookieConsent();
    
    // Initialise Lucide icons if available
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Trigger loading state
    window.addEventListener('load', initLoadingState);
  }

  // Run initialisation
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
