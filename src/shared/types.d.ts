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

export interface StatsResponse {
  year: string;
  topTracks: TrackStat[];
  topArtists: ArtistStat[];
  topGenres: GenreStat[];
  topBPMs: BPMStat[];
}
