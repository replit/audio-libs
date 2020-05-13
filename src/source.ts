import { promises as fs } from 'fs';
import { SourceData } from './types';
import { getRawSource } from './util';

interface SourceInterface {
  ID: number;
  filePath: string;
  volume: number;
  doesLoop: boolean;
  loopCount: number;
  duration: number;
  isPaused: boolean;

  /** Toggle Playing
   * Toggles between playing and pausing
   * returns a boolean indicating play
   * status. true means playing
   */
  togglePlaying(): Promise<boolean>;
  /** Set Loop
   * Sets the number of times
   * the audio file will loops.
   * Negative n will loop forever
   * Zero will play once.
   */
  setLoop(n: number): Promise<void>;
  /** Set Volume
   * 0 for 0% and 1 for 100%
   * You can amplify the volume
   */
  setVolume(vol: number): Promise<void>;

  /** Get Time getTimeRemaining
   * Get the estimated time (in millaseconds)
   * Remaining for the source.
   */
  getTimeRemaining(): Promise<number>;

  /** Get the estimated end time
   * for the source.
   */
  getEndTime(): Promise<Date>;

  /** Get Start Time
   * Get when the source started
   * playing on the current loop.
   */
  getStartTime(): Promise<Date>;

  /** Get Remaining Loops
   * Get the remaining times the
   * source will restart.
   */
  getRemainingLoops(): Promise<number>;

  /** Write Data
   * Write data to /tmp/audio.
   */
  writeData(): Promise<void>;
}

export default class Source implements SourceInterface {
  ID: number;

  filePath: string;

  volume: number;

  doesLoop: boolean;

  loopCount: number;

  duration: number;

  isPaused: boolean;

  constructor(payload: SourceData) {
    this.volume = payload.Volume;
    this.doesLoop = payload.DoesLoop;
    this.loopCount = payload.LoopCount;
    this.duration = payload.Duration;
    this.ID = payload.ID;
    this.filePath = payload.Name;
    this.isPaused = payload.Paused;
  }

  writeData = async () => {
    const data = JSON.stringify({
      ID: this.ID,
      Volume: this.volume,
      DoesLoop: this.doesLoop,
      LoopCount: this.loopCount,
      Paused: this.isPaused,
    });
    await fs.writeFile('/tmp/audio', data);
  };

  togglePlaying = async () => {
    this.isPaused = !this.isPaused;
    await this.writeData();

    return this.isPaused;
  };

  setLoop = async (n: number) => {
    this.loopCount = n;
    const x = n !== 0;
    this.doesLoop = x;
    await this.writeData();
  };

  setVolume = async (n: number) => {
    this.volume = n;
    await this.writeData();
  };

  getTimeRemaining = async () => {
    const endTime = await this.getEndTime();
    const now = new Date();

    return endTime.getMilliseconds() - now.getMilliseconds();
  };

  getEndTime = async () => {
    const payload = await getRawSource(this.ID);

    return new Date(payload.EndTime);
  };

  getStartTime = async () => {
    const payload = await getRawSource(this.ID);

    return new Date(payload.StartTime);
  };

  getRemainingLoops = async () => {
    const payload = await getRawSource(this.ID);
    this.loopCount = payload.LoopCount;

    return payload.LoopCount;
  };
}