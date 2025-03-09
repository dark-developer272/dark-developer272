export interface LanyardResponse {
  success: boolean;
  data: {
    spotify: {
      track_id: string;
      timestamps: {
        start: number;
        end: number;
      };
      song: string;
      artist: string;
      album_art_url: string;
      album: string;
    } | null;
    discord_status: 'online' | 'idle' | 'dnd' | 'offline';
    discord_user: {
      username: string;
      public_flags: number;
      id: string;
      discriminator: string;
      avatar: string;
    };
  };
}