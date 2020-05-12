import { promises as fs } from 'fs';
import Source from './source';
import { AudioStatus, SourceData } from './types';

const audioStatusPath = '/tmp/audioStatus.json';
async function getAudioStatus(): Promise<AudioStatus | null> {
  try {
    await fs.access(audioStatusPath);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(audioStatusPath, 'not found');

    // no status found, exit
    return null;
  }

  const data = await fs.readFile(audioStatusPath, { encoding: 'utf8' });
  if (!data) {
    // eslint-disable-next-line no-console
    console.error('No data from', audioStatusPath);

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

async function sleep(timeMs: number) {
  return new Promise((r) => setTimeout(r, timeMs));
}

const cachedSources: Record<number, Source> = {};
export async function createSource(filePath: string, volume = 1, loop = 0): Promise<Source> {
  if (typeof filePath !== 'string') {
    throw Error('File cannot be null.');
  }

  if (filePath.endsWith('.wav') || filePath.endsWith('.aiff')) {
    throw new Error('File must be .wav or .aiff');
  }

  // Check if file exists
  try {
    await fs.access(filePath);
  } catch (e) {
    throw new Error('File not found');
  }

  const data = JSON.stringify({
    File: filePath,
    Volume: volume,
    DoesLoop: loop !== 0,
    LoopCount: loop,
  });

  await fs.writeFile('/tmp/audio', data);

  // Wait for pid1 to pickup new source from /tmp/audio
  // we will timeout after 2 seconds if there's no response
  let retries = 0;
  const getSourceData = async (): Promise<SourceData> => {
    retries++;
    if (retries > 10) {
      throw new Error('Failed to retrieve audio status');
    }

    const s = await getAudioStatus();
    if (!s) {
      // We don't have an audio status
      await sleep(200);

      return getSourceData();
    }

    // Check if we there's any source with our filename
  };
}

export function getSources(): Array<Source> {
  // check source data from json file
  // if we don't have a source for any of the sources
  // we create them
}
