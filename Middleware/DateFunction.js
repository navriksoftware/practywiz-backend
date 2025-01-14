export function extractDateFromISOString(utcDateStr) {
  // Create a new Date object from the UTC string
  const date = new Date(utcDateStr);

  // Extract the year, month, and day from the Date object
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getUTCDate()).padStart(2, "0");

  // Combine into a YYYY-MM-DD string
  return `${year}-${month}-${day}`;
}

export function convertISTtoUTC(dateStr, timeStr) {
  // Combine the date and time into a single string
  const istDateTimeStr = `${dateStr} ${timeStr}`;
  // Parse the combined string as a Date object assuming the time is in IST
  const istDateTime = new Date(istDateTimeStr);
  // Convert to UTC by subtracting 5 hours and 30 minutes (IST offset)
  const utcDateTime = new Date(istDateTime.getTime() + 5.5 * 60 * 60 * 1000);
  // Return the UTC date-time in ISO format
  return utcDateTime.toISOString();
}
