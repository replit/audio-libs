export interface SourceData {
  Name: string;
  FileType: string;
  Volume: number;
  Duration: number;
  Remaining: number;
  Paused: boolean;
  Loop: number;
  ID: number;
  EndTime: string;
  StartTime: string;
}

export interface AudioStatus {
  Sources: Array<SourceData>;
  Running: boolean;
  Disabled: boolean;
}
