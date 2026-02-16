/**
 * Auth State Manager
 */
const Auth = {
  user: null,

  async init() {
    try {
      const data = await API.getMe();
      this.user = data.user;
      this.updateUI();
      return true;
    } catch (e) {
      this.user = null;
      this.updateUI();
      return false;
    }
  },

  setUser(user) {
    this.user = user;
    this.updateUI();
  },

  clearUser() {
    this.user = null;
    this.updateUI();
  },

  isLoggedIn() {
    return !!this.user;
  },

  isPro() {
    return this.user && (this.user.tier === 'pro' || this.user.tier === 'admin');
  },

  isAdmin() {
    return this.user && this.user.tier === 'admin';
  },

  getInitials() {
    if (!this.user || !this.user.name) return '?';
    return this.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  },

  updateUI() {
    const authElements = document.querySelectorAll('[data-auth]');
    authElements.forEach(el => {
      const req = el.dataset.auth;
      if (req === 'logged-in') el.style.display = this.isLoggedIn() ? '' : 'none';
      if (req === 'logged-out') el.style.display = !this.isLoggedIn() ? '' : 'none';
      if (req === 'pro') el.style.display = this.isPro() ? '' : 'none';
      if (req === 'free') el.style.display = !this.isPro() && this.isLoggedIn() ? '' : 'none';
      if (req === 'admin') el.style.display = this.isAdmin() ? '' : 'none';
    });

    const nameEls = document.querySelectorAll('[data-user-name]');
    nameEls.forEach(el => { el.textContent = this.user ? this.user.name : ''; });

    const avatarEls = document.querySelectorAll('[data-user-avatar]');
    avatarEls.forEach(el => { el.textContent = this.getInitials(); });

    const tierEls = document.querySelectorAll('[data-user-tier]');
    tierEls.forEach(el => {
      if (this.user) {
        el.textContent = this.user.tier.charAt(0).toUpperCase() + this.user.tier.slice(1);
        el.className = 'badge ' + (this.isPro() ? 'badge-pro' : 'badge-gold');
      }
    });

    // Lock pro features for free users
    const proLocks = document.querySelectorAll('.pro-lock');
    proLocks.forEach(el => {
      if (this.isPro()) {
        el.classList.remove('locked');
      } else {
        el.classList.add('locked');
      }
    });
  },

  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = '/login.html';
      return false;
    }
    return true;
  },

  requirePro() {
    if (!this.isPro()) {
      window.location.href = '/upgrade.html';
      return false;
    }
    return true;
  }
};
