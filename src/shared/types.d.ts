declare module "*.wasm" {
  const content: WebAssembly.Module;
  export default content;
}

export interface TrackStat {
  Title: string;
  Artist: string;
  count: number;
}

export interface ArtistStat {
  Name: string;
  count: number;
}

export interface GenreStat {
  Name: string;
  count: number;
}

export interface BPMStat {
  BPM: number;
  count: number;
}

export interface YearStats {
  totalTracks: number;
  totalPlaytimeSeconds: number;
  totalSessions: number;
  libraryGrowth: {
    total: number;
    added: number;
  };
  longestSession: {
    date: string;
    count: number;
    durationSeconds?: number;
  };
  busiestMonth: {
    month: string;
    count: number;
  };
  topTracks: TrackStat[];
  topArtists: ArtistStat[];
  topGenres: GenreStat[];
  topBPMs: BPMStat[];
}

export interface StatsResponse {
  success: true;
  year: string;
  stats: YearStats;
  comparison?: {
    year: string;
    stats: YearStats;
    diffs: {
      tracksPercentage: number;
      playtimePercentage: number;
      sessionPercentage: number;
      totalSessionsPercentage: number;
    }
  };
}

export type WorkerErrorCode =
  | 'DECRYPTION_FAILED'
  | 'INVALID_DATABASE'
  | 'QUERY_FAILED'
  | 'DECOMPRESSION_FAILED'
  | 'NO_FILE_PROVIDED'
  | 'UNKNOWN_ERROR';

export interface WorkerErrorResponse {
  success: false;
  error: {
    code: WorkerErrorCode;
    message: string;
  };
}

declare module '@7mind.io/sqlcipher-wasm/dist/sqlcipher.mjs';
declare module '@7mind.io/sqlcipher-wasm';
