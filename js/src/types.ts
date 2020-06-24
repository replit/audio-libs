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
  Request: RequestData;
}

/**
 * The enum for the available tone wave types.
 */
export enum WaveType {
  WaveSine = 0,
  WaveTriangle,
  WaveSaw,
  WaveSqr,
}

/**
 * The enum type for the different source types.
 */
export enum ReaderType {
  WavFile = 'wav',
  AiffFile = 'aiff',
  MP3File = 'mp3',
  Tone = 'tone',
}

/**
 * The file types in an array.
 */
export const FileTypes: Array<ReaderType> = [
  ReaderType.WavFile,
  ReaderType.AiffFile,
  ReaderType.MP3File,
];

/**
 * Arguments in a request.
 */
export interface RequestArgs {
  /**
   * The pitch/frequency of the tone.
   */
  Pitch?: number;
  /**
   * The duration for the tone to be played.
   */
  Seconds?: number;
  /**
   * The wave type of the tone.
   */
  WaveType?: WaveType;
  // {"Volume":1,"DoesLoop":false,"LoopCount":0,"Type":"mp3","Name":"2","Args":{"Path":"../te
  // st.mp3"}}

  /**
   * Path to the file (if reading from a file)
   */
  Path?: string;
}
/**
 * The data / payload for a request.
 */
export interface RequestData {
  /**
   * The ID of the source, only needed if used for updating a prexisting source.
   */
  ID?: number;
  /**
   * Wether the source should be paused or not, can only be set when updating a source.
   */
  Paused?: boolean;
  /**
   * The volume the source should be set to.
   */
  Volume: number;
  /**
   * Wether the source loops or not.
   */
  DoesLoop: boolean;
  /**
   * How many times the source should loop.
   */
  LoopCount: number;
  /**
   * The arguments needed for the source's type.
   */
  Args: RequestArgs;

  /**
   * The name of the reader. If not provided, pid1 will set it to the decoders id.
   */
  Name?: string;

  /**
   * The type of the source.
   */
  Type: ReaderType;
}

/**
 * The raw data read from /tmp/audioStatus.json
 */
export interface AudioStatus {
  Sources: Array<SourceData>;
  Running: boolean;
  Disabled: boolean;
}

/**
 * The error thrown if a source isn't found.
 */
export class SourceNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SourceNotFoundError';
  }
}
