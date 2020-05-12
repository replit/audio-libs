import { promises as fs } from 'fs';

interface ISource {
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

interface SourceData {
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

interface AudioStatus {
	Sources: Array<SourceData>;
	Running: boolean;
	Disabled: boolean;
}


class Source implements ISource {
  constructor(payload: SourceData) {

  }


}

export async function createSource(
  filePath: string,
  volume: number = 1,
  loop: number = 0
): Promise<Source> {
  if (typeof filePath !== 'string') {
    throw Error("File cannot be null.");
  }

	if (filePath.endsWith('.wav') || filePath.endsWith('.aiff')) {
		throw new Error('File must be .wav or .aiff');
	}


}

export function getSources(): Array<Source> {
  // check source data from json file
  // if we don't have a source for any of the sources
  // we create them
  
}


// {"Sources":[],"Running":false,"Disabled":true}