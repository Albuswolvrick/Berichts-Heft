
const { asyncHandler } = require('../../src/server/utils/asyncHandler');

describe('asyncHandler', () => {
  it('calls the handler and resolves normally', async () => {
    const handler = vi.fn((req, res) => {
      res.json({ ok: true });
    });
    const req = {};
    const res = { json: vi.fn() };
    const next = vi.fn();

    await asyncHandler(handler)(req, res, next);

    expect(handler).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  it('catches errors and passes them to next', async () => {
    const error = new Error('test error');
    const handler = vi.fn(() => {
      throw error;
    });
    const req = {};
    const res = {};
    const next = vi.fn();

    await asyncHandler(handler)(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('catches async errors and passes them to next', async () => {
    const error = new Error('async error');
    const handler = vi.fn(async () => {
      throw error;
    });
    const req = {};
    const res = {};
    const next = vi.fn();

    await asyncHandler(handler)(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
