import moment from 'moment';

function formatTime(timestamp: string): string {
  const date = moment(timestamp);
  const now = moment();

  if (now.diff(date, 'seconds') < 60) {
    return `${now.diff(date, 'seconds')} seconds ago`;
  }

  if (now.diff(date, 'minutes') < 60) {
    return `${now.diff(date, 'minutes')} minutes ago`;
  }

  if (now.diff(date, 'hours') < 24) {
    return `${now.diff(date, 'hours')} hours ago`;
  }

  if (now.diff(date, 'days') === 1) {
    return 'Yesterday';
  }

  return date.format('YYYY-MM-DD');
}

export { formatTime };
