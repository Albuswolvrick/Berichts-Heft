export function toInputDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function toDisplayDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export function getIsoWeekNumber(inputDate) {
  const date = new Date(inputDate);
  date.setHours(0, 0, 0, 0);

  // Shift date to nearest Thursday for ISO week calculation.my understanding I need to show all of the week
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  const firstThursday = new Date(date.getFullYear(), 0, 4);
  firstThursday.setDate(firstThursday.getDate() + 3 - ((firstThursday.getDay() + 6) % 7));

  const weekNumber = 1 + Math.round((date - firstThursday) / (7 * 24 * 60 * 60 * 1000));
  return weekNumber;
}

export function getWeekRangeFromDate(inputDate) {
  if (!inputDate) return null;

  const date = new Date(inputDate);
  if (Number.isNaN(date.getTime())) return null;

  const dayIndex = (date.getDay() + 6) % 7; // Monday=0 ... Sunday=6
  const weekStartDate = new Date(date);
  weekStartDate.setDate(date.getDate() - dayIndex);
  weekStartDate.setHours(0, 0, 0, 0);

  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekStartDate.getDate() + 6);

  return {
    weekNumber: getIsoWeekNumber(weekStartDate),
    weekStart: toInputDate(weekStartDate),
    weekEnd: toInputDate(weekEndDate),
  };
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' }).format(date);
}
export function getDefaultHoursForDate(dateString) {
  if (!dateString) return '8';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '8';
  const day = date.getDay(); // 0 (Sun) to 6 (Sat)
  return day === 5 ? '6' : '8';
}
