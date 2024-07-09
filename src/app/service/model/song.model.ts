export interface TitleVO {
  value?: string;
}

export interface ArtistVO {
  value?: string;
}

export interface SongBase {
  publicID?: string;
  title?: TitleVO;
  artist?: ArtistVO;
}

export interface SaveSong extends SongBase {
  file?: File;
  fileContentType?: string;
  cover?: File;
  coverContentType?: string;
}

export interface ReadSong extends SongBase {
  cover?: string;
  coverContentType?: string;
  favorite: boolean;
  displayPlay: boolean;
}

export interface SongContent extends ReadSong {
  file?: string;
  fileContentType?: string;
}
