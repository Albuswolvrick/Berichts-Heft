const authService = require('../services/authService');
const { BadRequestError } = require('../utils/errors');

/**
 * GET /api/users/me
 */
async function getMe(req, res) {
  const user = await authService.getUserById(req.user.id);
  res.status(200).json({ user });
}

/**
 * GET /api/users
 */
async function getAll(req, res) {
  const users = await authService.getAllUsers();
  res.status(200).json(users);
}

/**
 * POST /api/users
 */
async function create(req, res) {
  const user = await authService.createUser(req.body);
  res.status(201).json({ user });
}

/**
 * PUT /api/users/:id
 */
async function update(req, res) {
  const { id } = req.params;
  const { role } = req.body;

  // Prevent admin from demoting themselves
  if (req.user.id === parseInt(id) && req.user.role === 'ADMIN' && role !== 'ADMIN') {
    throw new BadRequestError('Admins cannot change their own role.');
  }

  const user = await authService.updateUser(id, req.body);
  res.status(200).json(user);
}

/**
 * PUT /api/users/:id/password
 */
async function updatePassword(req, res) {
  await authService.updatePassword(req.params.id, req.body.password);
  res.status(200).json({ message: 'Password updated successfully' });
}

/**
 * DELETE /api/users/:id
 */
async function remove(req, res) {
  await authService.deleteUser(req.params.id);
  res.status(204).send();
}

module.exports = { getMe, getAll, create, update, updatePassword, remove };
