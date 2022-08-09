import { DateTime, Duration } from 'luxon';

export function formatTournamentDate(
  startDate?: string,
  endDate?: string,
): string | null {
  if (!startDate && !endDate) {
    return null;
  }

  if (startDate && endDate) {
    let lStartDate = DateTime.fromISO(startDate);
    let lEndDate = DateTime.fromISO(endDate);

    if (lStartDate.startOf('day') === lEndDate.startOf('day')) {
      return `${DateTime.fromISO(startDate).toLocaleString(
        DateTime.DATE_MED_WITH_WEEKDAY,
      )}`;
    }

    return `From ${lStartDate.toLocaleString(
      DateTime.DATE_MED_WITH_WEEKDAY,
    )} to ${lEndDate.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}`;
  }

  if (startDate) {
    return formatTournamentStartDate(startDate);
  }

  if (endDate) {
    return formatTournamentEndDate(endDate);
  }

  return '';
}

function formatTournamentStartDate(startDate: string): string {
  return `Starts on ${DateTime.fromISO(startDate).toLocaleString(
    DateTime.DATE_MED_WITH_WEEKDAY,
  )}`;
}

function formatTournamentEndDate(endDate: string): string {
  return `Ends on ${DateTime.fromISO(endDate).toLocaleString(
    DateTime.DATE_MED_WITH_WEEKDAY,
  )}`;
}

export function formatDate(date: string): string {
  return DateTime.fromISO(date).toLocaleString(DateTime.DATE_SHORT);
}

export function formatDateTime(date: string): string {
  return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_SHORT);
}
