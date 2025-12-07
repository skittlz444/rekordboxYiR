/**
 * Applies the average track played percentage to playtime statistics.
 * The SQL returns 100% playtime (full track lengths), and this function
 * scales it based on the user's average track played percentage setting.
 * 
 * @param playtimeSeconds - The full playtime in seconds from SQL
 * @param percentage - The average track played percentage (0-1, default 0.75)
 * @returns The adjusted playtime in seconds
 */
export function applyPlaytimePercentage(playtimeSeconds: number, percentage: number = 0.75): number {
  return Math.round(playtimeSeconds * percentage);
}

/**
 * Formats playtime seconds into hours and minutes
 * @param seconds - Playtime in seconds
 * @returns Object with hours and minutes
 */
export function formatPlaytime(seconds: number): { hours: number; minutes: number } {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return { hours, minutes };
}
