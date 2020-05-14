/**
 * The raw data for a source.
 */
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

/**
 * The raw data read from /tmp/audioStatus.json
 */
export interface AudioStatus {
  Sources: Array<SourceData>;
  Running: boolean;
  Disabled: boolean;
}

// The error thrown if a source isn't found.
export class SourceNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SourceNotFoundError';
  }
}
