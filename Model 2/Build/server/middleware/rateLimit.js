const rateLimitMap = {};

function createRateLimit(windowMs, maxRequests) {
  return function rateLimit(req, res, next) {
    const key = (req.user && req.user.id) || req.ip || 'unknown';
    const now = Date.now();

    if (!rateLimitMap[key]) {
      rateLimitMap[key] = [];
    }

    rateLimitMap[key] = rateLimitMap[key].filter(ts => now - ts < windowMs);

    if (rateLimitMap[key].length >= maxRequests) {
      return res.status(429).json({ error: 'Too many requests. Please wait.' });
    }

    rateLimitMap[key].push(now);
    next();
  };
}

// Clean up periodically
setInterval(() => {
  const now = Date.now();
  for (const key in rateLimitMap) {
    rateLimitMap[key] = rateLimitMap[key].filter(ts => now - ts < 300000);
    if (rateLimitMap[key].length === 0) delete rateLimitMap[key];
  }
}, 5 * 60 * 1000);

module.exports = {
  authLimit: createRateLimit(60000, 5),
  apiLimit: createRateLimit(60000, 60),
  assessmentLimit: createRateLimit(60000, 10)
};
