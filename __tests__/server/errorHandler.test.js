
const { AppError, NotFoundError } = require('../../src/server/utils/errors');

// Mock logger to avoid console output during tests
vi.mock('../../src/server/utils/logger', () => {
  return { warn: vi.fn(), error: vi.fn(), info: vi.fn() };
});

const { errorHandler } = require('../../src/server/middleware/errorHandler');

function createMockRes() {
  const res = {
    statusCode: 200,
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return res;
}

describe('errorHandler middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { path: '/test' };
    res = createMockRes();
    next = vi.fn();
  });

  it('handles AppError with correct status and message', () => {
    const err = new NotFoundError('Item not found');
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Item not found' });
  });

  it('handles Prisma P2002 unique constraint error', () => {
    const err = { code: 'P2002', message: 'Unique constraint' };
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ error: 'A record with this value already exists' });
  });

  it('handles Prisma P2025 not found error', () => {
    const err = { code: 'P2025', message: 'Record not found' };
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Record not found' });
  });

  it('handles unexpected errors with 500 status', () => {
    const err = new Error('Something unexpected');
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});
