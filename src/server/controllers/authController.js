const authService = require('../services/authService');

/**
 * POST /api/auth/register
 */
async function register(req, res) {
  const user = await authService.register(req.body);
  req.session.user = { id: user.id, name: user.name, role: user.role };
  res.status(201).json({ user });
}

/**
 * POST /api/auth/login
 */
async function login(req, res) {
  const user = await authService.login(req.body);
  req.session.user = { id: user.id, name: user.name, role: user.role };
  res.status(200).json({ user });
}

/**
 * POST /api/auth/logout
 */
function logout(req, res, next) {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out successfully' });
  });
}

module.exports = { register, login, logout };
