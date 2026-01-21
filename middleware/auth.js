const jwt = require('jsonwebtoken');
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access denied' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Admin access required' });
  next();
};
const managerOrAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin' && req.user.role !== 'Manager') return res.status(403).json({ message: 'Manager or Admin access required' });
  next();
};
module.exports = { auth, adminOnly, managerOrAdmin };