const bcrypt = require('bcrypt');
const { prisma } = require('../config/database');
const { env } = require('../config/env');
const { BadRequestError, ConflictError, UnauthorizedError, NotFoundError } = require('../utils/errors');

/**
 * Registers a new user. First user becomes ADMIN.
 */
async function register({ name, email, password }) {
  if (!name || !email || !password) {
    throw new BadRequestError('Name, email, and password are required');
  }

  const userCount = await prisma.user.count();
  // BUGFIX: Changed role from 'TRAINEE' to 'USER'.
  // The 'TRAINEE' role was removed from the 'UserRole' enum in the Prisma schema,
  // causing an error when creating new users. This change ensures that new
  // users are assigned a valid role.
  // needs some work 
  const role = userCount === 0 ? 'ADMIN' : 'USER';
  const passwordHash = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);

  try {
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role },
    });
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  } catch (error) {
    if (error.code === 'P2002') {
      throw new ConflictError('Email already in use');
    }
    throw error;
  }
}

/**
 * Authenticates a user with email and password.
 */
async function login({ email, password, ip }) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: email },
        { name: email }
      ]
    }
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Update last login info
  await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLoginAt: new Date(),
      lastLoginIp: ip,
    },
  });

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

/**
 * Retrieves a user by ID.
 */
async function getUserById(id) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

/**
 * Retrieves all users (admin only).
 */
async function getAllUsers() {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
  });
}

/**
 * Creates a new user (admin only).
 */
async function createUser({ name, email, password, role }) {
  if (!name || !email || !password || !role) {
    throw new BadRequestError('Name, email, password, and role are required');
  }

  const passwordHash = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);

  try {
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role },
    });
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  } catch (error) {
    if (error.code === 'P2002') {
      throw new ConflictError('Email already in use');
    }
    throw error;
  }
}

/**
 * Updates a user's profile (admin only).
 */
async function updateUser(id, { name, email, role }) {
  const user = await prisma.user.update({
    where: { id: parseInt(id) },
    data: { name, email, role },
    select: { id: true, name: true, email: true, role: true },
  });
  return user;
}

/**
 * Updates a user's password (admin only).
 */
async function updatePassword(id, password) {
  if (!password) {
    throw new BadRequestError('Password is required');
  }
  const passwordHash = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
  await prisma.user.update({
    where: { id: parseInt(id) },
    data: { passwordHash },
  });
}

/**
 * Deletes a user (admin only).
 */
async function deleteUser(id) {
  await prisma.user.delete({ where: { id: parseInt(id) } });
}

module.exports = {
  register,
  login,
  getUserById,
  getAllUsers,
  createUser,
  updateUser,
  updatePassword,
  deleteUser,
};
