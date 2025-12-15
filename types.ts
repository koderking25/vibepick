
export interface WatchRecommendation {
  primary: {
    title: string;
    year: number;
    runtime: string;
    description: string;
    trailerUrl: string;
    moodMatch: string;
  };
  backups: {
    title: string;
    year: number;
    runtime: string;
  }[];
}

export interface MusicRecommendation {
  primary: {
    title: string;
    artist: string;
    moodMatch: string;
    vibe: string;
    links: {
      spotify?: string;
      appleMusic?: string;
      youtube?: string;
      deezer?: string;
    };
  };
  backups: {
    title: string;
    artist: string;
  }[];
}
