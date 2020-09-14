export interface IState {
  profile: {
    email?: string;
    token?: string;
    display_name?: string;
    country?: string;
    spotifyToken?: string;
    spotifyRefreshToken?: string;
    spotifyExeTime?: Date
  };
}