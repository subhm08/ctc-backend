// utils/apiKeyMiddleware.js
module.exports = (req, res, next) => {
    const key = req.headers['x-api-key'];
    if (key !== process.env.API_KEY) {
      return res.status(403).json({ message: 'Forbidden: Invalid API Key' });
    }
    next();
  };
  