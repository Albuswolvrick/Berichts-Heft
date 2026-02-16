
const {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} = require('../../src/server/utils/errors');

describe('Custom Error Classes', () => {
  it('AppError has correct defaults', () => {
    const err = new AppError('test error');
    expect(err.message).toBe('test error');
    expect(err.statusCode).toBe(500);
    expect(err.name).toBe('AppError');
    expect(err).toBeInstanceOf(Error);
  });

  it('AppError accepts custom status code', () => {
    const err = new AppError('custom', 418);
    expect(err.statusCode).toBe(418);
  });

  it('BadRequestError has status 400', () => {
    const err = new BadRequestError('bad');
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('bad');
  });

  it('BadRequestError has default message', () => {
    const err = new BadRequestError();
    expect(err.message).toBe('Bad request');
  });

  it('UnauthorizedError has status 401', () => {
    const err = new UnauthorizedError();
    expect(err.statusCode).toBe(401);
  });

  it('ForbiddenError has status 403', () => {
    const err = new ForbiddenError();
    expect(err.statusCode).toBe(403);
  });

  it('NotFoundError has status 404', () => {
    const err = new NotFoundError('missing');
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('missing');
  });

  it('ConflictError has status 409', () => {
    const err = new ConflictError();
    expect(err.statusCode).toBe(409);
  });
});
