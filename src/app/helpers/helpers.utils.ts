export function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

export function formatDateToYYYYMMDD(date) {
  date = new Date(date);
  const year = date.getFullYear();

  // getMonth() returns month index from 0 (Jan) to 11 (Dec), so add 1
  let month = date.getMonth() + 1;
  month = month < 10 ? '0' + month : month;

  let day = date.getDate();
  day = day < 10 ? '0' + day : day;

  return `${year}-${month}-${day}`;
}
