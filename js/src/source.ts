import { promises as fs } from 'fs';
import { SourceData, RequestData, FileTypes } from './types';
import { getRawSource } from './util';

interface SourceInterface {
  /**
   * The ID of the source.
   */
  ID: number;

  /**
   * The path of the file.
   * This should be what you
   * provided when you created
   * the source.
   */
  filePath: string | undefined;

  /**
   * The volume the source is currently set to.
   */
  volume: number;

  /**
   * The estimated duration of the file.
   */
  duration: number;

  /**
   * Wether the source is paused or not.
   */
  isPaused: boolean;

  /**
   * Toggles between playing and pausing
   * returns a boolean indicating play
   * status. true means playing
   */
  togglePlaying(): Promise<boolean>;

  /**
   * Sets the number of times
   * the audio file will loops.
   * Negative n will loop forever
   * Zero will play once.
   */
  setLoop(n: number): Promise<void>;

  /**
   * 0 for 0% and 1 for 100%
   * You can amplify the volume
   */
  setVolume(vol: number): Promise<void>;

  /**
   * Get the estimated time (in millaseconds)
   * Remaining for the source.
   */
  getTimeRemaining(): Promise<number>;

  /**
   * Get the estimated end time
   * for the source.
   */
  getEndTime(): Promise<Date>;

  /**
   * Get when the source started
   * playing on the current loop.
   */
  getStartTime(): Promise<Date>;

  /**
   * Get the remaining times the
   * source will restart.
   */
  getRemainingLoops(): Promise<number>;
}

export default class Source implements SourceInterface {
  /**
   * The ID of the source.
   */
  ID: number;

  /**
   * The path of the file.
   * This should be what you
   * provided when you created
   * the source.
   */
  filePath: string | undefined;

  /**
   * The volume the source is currently set to.
   */
  volume: number;

  private loop: number;

  /**
   * The estimated duration of the file.
   * (In milliseconds)
   */
  duration: number;

  /**
   * Wether the source is paused or not.
   */
  isPaused: boolean;

  /**
   * The name of the source.
   */
  name: string;

  /**
   * The request used to get this source.
   */
  request: RequestData;

  constructor(payload: SourceData) {
    this.volume = payload.Volume;
    this.loop = payload.Loop;
    this.duration = payload.Duration;
    this.ID = payload.ID;
    if (FileTypes.includes(payload.Request.Type)) {
      this.filePath = payload.Request.Args.Path;
    }
    this.isPaused = payload.Paused;
    this.name = payload.Name;
    this.request = payload.Request;
  }

  /**
   * Write data to /tmp/audio.
   */
  private writeData = async () => {
    const data = JSON.stringify({
      ID: this.ID,
      Volume: this.volume,
      DoesLoop: this.loop !== 0,
      LoopCount: this.loop,
      Paused: this.isPaused,
    });
    await fs.writeFile('/tmp/audio', data);
  };

  /**
   * Toggles between playing and pausing
   * returns a boolean indicating play
   * status. true means playing
   */
  togglePlaying = async () => {
    this.isPaused = !this.isPaused;
    await this.writeData();

    return this.isPaused;
  };

  /**
   * Sets the number of times
   * the audio file will loops.
   * Negative n will loop forever
   * Zero will play once.
   */
  setLoop = async (n: number) => {
    this.loop = n;
    await this.writeData();
  };

  /**
   * Get the estimated time (in millaseconds)
   * Remaining for the source.
   */
  setVolume = async (n: number) => {
    this.volume = n;
    await this.writeData();
  };

  /**
   * Get the estimated time (in millaseconds)
   * Remaining for the source.
   */
  getTimeRemaining = async () => {
    const endTime = await this.getEndTime();
    const now = new Date();

    return endTime.getTime() - now.getTime();
  };

  /**
   * Get the estimated end time
   * for the source.
   */
  getEndTime = async () => {
    const payload = await getRawSource(this.ID);

    return new Date(payload.EndTime);
  };

  /**
   * Get when the source started
   * playing on the current loop.
   */
  getStartTime = async () => {
    const payload = await getRawSource(this.ID);

    return new Date(payload.StartTime);
  };

  /**
   * Get the remaining times the
   * source will restart.
   */
  getRemainingLoops = async () => {
    const payload = await getRawSource(this.ID);
    this.loop = payload.Loop;

    return payload.Loop;
  };
}
