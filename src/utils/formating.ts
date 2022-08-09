import { DateTime } from 'luxon';

export function formatTournamentDate(
  startDate?: string,
  endDate?: string,
): string {
  if (!startDate && !endDate) {
    return 'Date unknown';
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
