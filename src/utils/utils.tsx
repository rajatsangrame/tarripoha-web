import moment from 'moment';

function formatTime(timestamp: string): string {
  const date = moment(timestamp);
  const now = moment();

  if (now.diff(date, 'seconds') < 60) {
    return `${now.diff(date, 'seconds')} sec`;
  }

  if (now.diff(date, 'minutes') < 60) {
    return `${now.diff(date, 'minutes')} min`;
  }

  if (now.diff(date, 'hours') < 24) {
    return `${now.diff(date, 'hours')} hr`;
  }

  if (now.diff(date, 'days') === 1) {
    return 'yesterday';
  }

  return date.format('YYYY-MM-DD');
}

export { formatTime };
