const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const isProduction = process.env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000,
  path: '/'
};

const REFRESH_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: 7 * 24 * 60 * 60 * 1000
};

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, tier: user.tier },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function requireAuth(req, res, next) {
  const token = req.cookies && req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie('token');
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requirePro(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  if (req.user.tier !== 'pro' && req.user.tier !== 'admin') {
    return res.status(403).json({ error: 'Pro subscription required', upgrade: true });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.tier !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

function optionalAuth(req, res, next) {
  const token = req.cookies && req.cookies.token;
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      // Token invalid, continue without auth
    }
  }
  next();
}

module.exports = {
  generateToken,
  generateRefreshToken,
  requireAuth,
  requirePro,
  requireAdmin,
  optionalAuth,
  COOKIE_OPTIONS,
  REFRESH_COOKIE_OPTIONS
};
