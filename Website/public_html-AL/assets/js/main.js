// Acumen Logic - Main JavaScript
// Core functionality shared across all pages

(function() {
  'use strict';

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

    let lastScroll = 0;
    const scrollThreshold = 50;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;
      
      // Add shadow when scrolled
      if (currentScroll > scrollThreshold) {
        header.classList.add('shadow-lg');
      } else {
        header.classList.remove('shadow-lg');
      }

      // Optional: hide/show header on scroll direction
      if (currentScroll > lastScroll && currentScroll > 200) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      
      lastScroll = currentScroll;
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
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          entry.target.style.opacity = '1';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.style.opacity = '0';
      observer.observe(el);
    });
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

  function initCopyToClipboard() {
    document.querySelectorAll('[data-copy]').forEach(button => {
      button.addEventListener('click', function() {
        const text = this.getAttribute('data-copy');
        navigator.clipboard.writeText(text).then(() => {
          const originalText = this.innerHTML;
          this.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i>';
          lucide.createIcons();
          
          setTimeout(() => {
            this.innerHTML = originalText;
            lucide.createIcons();
          }, 2000);
        });
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
    initCurrentYear();
    initExternalLinks();
    
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