import { promises as fs } from 'fs';
import { AudioStatus, SourceData, SourceNotFoundError } from './types';

const audioStatusPath = '/tmp/audioStatus.json';

/**
 * Returns the raw status data in /tmp/audioStatus.json
 *
 * This is an api call, you shouldn't need this for general usage.
 */
export async function getAudioStatus(): Promise<AudioStatus | null> {
  try {
    await fs.access(audioStatusPath);
  } catch (e) {
    // no status found, exit
    return null;
  }

  const data = await fs.readFile(audioStatusPath, { encoding: 'utf8' });
  if (!data) {
    return null;
  }

  let audioStatus: AudioStatus;
  try {
    audioStatus = JSON.parse(data);
  } catch (e) {
    return null;
  }

  // TODO maybe verify data?

  return audioStatus;
}
/**
 * This returns a SourceData object with the given ID.
 *
 * This is an api call, Source objects are returned when they are created.
 */
export async function getRawSource(id: number): Promise<SourceData> {
  const data = await getAudioStatus();

  if (!data) {
    throw new SourceNotFoundError(`Could not find source with ID "${id}.`);
  }

  let source: SourceData | null = null;
  for (const s of data.Sources) {
    if (s.ID === id) {
      source = s;
      break;
    }
  }

  if (!source) {
    throw new SourceNotFoundError(`Could not find source with ID "${id}.`);
  }

  return source;
}

export async function sleep(timeMs: number) {
  return new Promise((r) => setTimeout(r, timeMs));
}
