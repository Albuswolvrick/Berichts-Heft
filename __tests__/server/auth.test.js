
const { UnauthorizedError, ForbiddenError } = require('../../src/server/utils/errors');
const { isAuthenticated, isAdminOrManager, hasRole } = require('../../src/server/middleware/auth');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { session: {}, user: null };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
  });

  describe('isAuthenticated', () => {
    it('calls next and sets req.user when session has user', () => {
      req.session.user = { id: 1, name: 'Test', role: 'TRAINEE' };
      isAuthenticated(req, res, next);

      expect(req.user).toEqual({ id: 1, name: 'Test', role: 'TRAINEE' });
      expect(next).toHaveBeenCalledWith();
    });

    it('calls next with UnauthorizedError when no session user', () => {
      isAuthenticated(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });

  describe('isAdminOrManager', () => {
    it('calls next for ADMIN role', () => {
      req.user = { id: 1, role: 'ADMIN' };
      isAdminOrManager(req, res, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('calls next for MANAGER role', () => {
      req.user = { id: 1, role: 'MANAGER' };
      isAdminOrManager(req, res, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('calls next with ForbiddenError for TRAINEE role', () => {
      req.user = { id: 1, role: 'TRAINEE' };
      isAdminOrManager(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });

    it('calls next with ForbiddenError when no user', () => {
      isAdminOrManager(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });
  });

  describe('hasRole', () => {
    it('calls next when user has required role', () => {
      req.user = { id: 1, role: 'ADMIN' };
      hasRole(['ADMIN'])(req, res, next);
      expect(next).toHaveBeenCalledWith();
    });

    it('calls next with ForbiddenError when user lacks role', () => {
      req.user = { id: 1, role: 'TRAINEE' };
      hasRole(['ADMIN'])(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });

    it('calls next with ForbiddenError when no user', () => {
      hasRole(['ADMIN'])(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });
  });
});
