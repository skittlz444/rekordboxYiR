import { StatsResponse } from '../../src/shared/types';

/**
 * Mock stats data for E2E testing
 */
export const mockStatsResponse: StatsResponse = {
  year: '2024',
  stats: {
    totalTracks: 1250,
    totalPlaytimeSeconds: 450000, // ~125 hours
    totalSessions: 85,
    libraryGrowth: {
      total: 5420,
      added: 320,
    },
    longestSession: {
      date: '2024-07-15T20:00:00.000Z',
      count: 45,
      durationSeconds: 14400, // 4 hours
    },
    busiestMonth: {
      month: '2024-08',
      count: 185,
    },
    topTracks: [
      { Title: 'Test Track 1', Artist: 'Test Artist 1', count: 50 },
      { Title: 'Test Track 2', Artist: 'Test Artist 2', count: 45 },
      { Title: 'Test Track 3', Artist: 'Test Artist 3', count: 40 },
      { Title: 'Test Track 4', Artist: 'Test Artist 4', count: 35 },
      { Title: 'Test Track 5', Artist: 'Test Artist 5', count: 30 },
    ],
    topArtists: [
      { Name: 'Test Artist 1', count: 150 },
      { Name: 'Test Artist 2', count: 120 },
      { Name: 'Test Artist 3', count: 100 },
      { Name: 'Test Artist 4', count: 85 },
      { Name: 'Test Artist 5', count: 70 },
    ],
    topGenres: [
      { Name: 'House', count: 450 },
      { Name: 'Techno', count: 380 },
      { Name: 'Drum & Bass', count: 220 },
    ],
    topBPMs: [
      { BPM: 128, count: 200 },
      { BPM: 130, count: 180 },
      { BPM: 125, count: 150 },
    ],
  },
  comparison: {
    year: '2023',
    stats: {
      totalTracks: 1000,
      totalPlaytimeSeconds: 380000,
      totalSessions: 70,
      libraryGrowth: {
        total: 5100,
        added: 280,
      },
      longestSession: {
        date: '2023-06-10T19:00:00.000Z',
        count: 38,
        durationSeconds: 12000,
      },
      busiestMonth: {
        month: '2023-07',
        count: 165,
      },
      topTracks: [
        { Title: 'Old Track 1', Artist: 'Old Artist 1', count: 40 },
        { Title: 'Old Track 2', Artist: 'Old Artist 2', count: 35 },
        { Title: 'Old Track 3', Artist: 'Old Artist 3', count: 30 },
        { Title: 'Old Track 4', Artist: 'Old Artist 4', count: 28 },
        { Title: 'Old Track 5', Artist: 'Old Artist 5', count: 25 },
      ],
      topArtists: [
        { Name: 'Old Artist 1', count: 130 },
        { Name: 'Old Artist 2', count: 110 },
        { Name: 'Old Artist 3', count: 90 },
        { Name: 'Old Artist 4', count: 75 },
        { Name: 'Old Artist 5', count: 60 },
      ],
      topGenres: [
        { Name: 'House', count: 400 },
        { Name: 'Techno', count: 320 },
        { Name: 'Drum & Bass', count: 180 },
      ],
      topBPMs: [
        { BPM: 128, count: 180 },
        { BPM: 130, count: 160 },
        { BPM: 125, count: 140 },
      ],
    },
    diffs: {
      tracksPercentage: 25.0,
      playtimePercentage: 18.42,
      sessionPercentage: 20.0,
      totalSessionsPercentage: 21.43,
    },
  },
};
