interface SourceInterface {
  ID: number;
  filePath: string;
  volume: number;
  doesLoop: number;
  loopCount: number;

  duration: number;
  timeRemaining: number;

  startTime: Date;
  endTime: Date;

  isPaused: boolean;

  /** Toggle play
   * Toggles between playing and pausing
   * returns a boolean indicating play
   * status. true means playing
   */
  togglePlay(): boolean;
  /** Set Loop
   * Sets the number of times
   * the audio file will loops.
   * Negative n will loop forever
   * Zero will play once.
   */
  setLoop(n: number): void;
  /** Set Volume
   * 0 for 0% and 1 for 100%
   * You can amplify the volume
   */
  setVolume(vol: number): void;
}

export default class Source implements SourceInterface {
  constructor(payload: SourceData) {}
}
