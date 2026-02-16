/**
 * API Client — handles all communication with the backend
 */
const API = {
  baseUrl: '',
  timeoutMs: 30000,

  async request(method, path, body) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      signal: controller.signal
    };
    if (body) opts.body = JSON.stringify(body);

    let res;
    try {
      res = await fetch(this.baseUrl + path, opts);
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw { status: 0, message: 'Request timed out after ' + (this.timeoutMs / 1000) + 's' };
      }
      throw { status: 0, message: err.message || 'Network error' };
    }
    clearTimeout(timeoutId);

    let data = {};
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try {
        data = await res.json();
      } catch (parseErr) {
        if (res.ok) {
          throw { status: res.status, message: 'Invalid JSON in response' };
        }
      }
    }

    if (!res.ok) {
      if (res.status === 401) {
        Auth.clearUser();
        const currentPage = window.location.pathname;
        const publicPages = ['login', 'register', 'index', 'upgrade'];
        const isPublicPage = publicPages.some(p => currentPage.includes(p)) || currentPage === '/';
        if (!isPublicPage) {
          window.location.href = '/login.html';
        }
      }
      throw { status: res.status, ...data };
    }
    return data;
  },

  get(path) { return this.request('GET', path); },
  post(path, body) { return this.request('POST', path, body); },
  put(path, body) { return this.request('PUT', path, body); },
  del(path) { return this.request('DELETE', path); },

  // Auth
  register(data) { return this.post('/api/auth/register', data); },
  login(data) { return this.post('/api/auth/login', data); },
  googleLogin(credential) { return this.post('/api/auth/google', { credential }); },
  logout() { return this.post('/api/auth/logout'); },
  getMe() { return this.get('/api/auth/me'); },
  updateProfile(data) { return this.put('/api/auth/me', data); },

  // Assessments
  startAssessment(data) { return this.post('/api/assessments/start', data); },
  submitAnswer(sessionId, data) { return this.post(`/api/assessments/${sessionId}/answer`, data); },
  completeAssessment(sessionId) { return this.post(`/api/assessments/${sessionId}/complete`); },
  getResults(sessionId) { return this.get(`/api/assessments/${sessionId}/results`); },

  // Dashboard
  getDashboard() { return this.get('/api/dashboard/summary'); },
  getHistory(limit, offset) { return this.get(`/api/dashboard/history?limit=${limit || 20}&offset=${offset || 0}`); },
  getProgress() { return this.get('/api/dashboard/progress'); },
  getPercentiles(category) { return this.get(`/api/dashboard/percentiles${category ? '?category=' + category : ''}`); },

  // Percentiles
  getPercentileDistribution(category) { return this.get(`/api/percentiles/current${category ? '?category=' + category : ''}`); },
  getPercentileRank(score, category) { return this.get(`/api/percentiles/rank?score=${score}${category ? '&category=' + category : ''}`); }
};
