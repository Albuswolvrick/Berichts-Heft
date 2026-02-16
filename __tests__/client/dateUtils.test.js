import { getIsoWeekNumber, getWeekRangeFromDate } from '../../src/client/utils/dateUtils';

describe('dateUtils', () => {
  it('calculates the ISO week number', () => {
    expect(getIsoWeekNumber('2026-02-18')).toBe(8);
  });

  it('returns Monday-Sunday week range for a selected date', () => {
    const week = getWeekRangeFromDate('2026-02-18');
    expect(week).toEqual({
      weekNumber: 8,
      weekStart: '2026-02-16',
      weekEnd: '2026-02-22',
    });
  });

  it('returns null for invalid input', () => {
    expect(getWeekRangeFromDate('')).toBeNull();
    expect(getWeekRangeFromDate('invalid-date')).toBeNull();
  });
});
