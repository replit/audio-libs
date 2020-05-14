import { promises as fs } from 'fs';
import Source from './source';
import { getAudioStatus, sleep } from './util';
import { SourceData } from './types';
/**
 * A list of known source IDs used
 * to determine new sources.
 */
const knownIds: Array<number> = [];

/**
 * Used to create a new audio source.
 */
export async function createSource({
  filePath,
  volume = 1,
  loop = 0,
}: {
  filePath: string;
  volume: number;
  loop: number;
}): Promise<Source> {
  if (typeof filePath !== 'string') {
    throw Error('File cannot be null.');
  }

  if (!filePath.endsWith('.wav') && !filePath.endsWith('.aiff')) {
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
    if (retries > 20) {
      throw new Error('Failed to retrieve audio status');
    }

    const audioStatus = await getAudioStatus();

    if (!audioStatus) {
      // We don't have an audio status, wait and retry
      await sleep(100);

      return getSourceData();
    }

    for (const sourceData of audioStatus.Sources) {
      if (sourceData.Name !== filePath) {
        // Check if we there's any source with our filename
        continue;
      }

      if (knownIds.includes(sourceData.ID)) {
        // If it is a known it means we didn't create this
        continue;
      }

      return sourceData;
    }

    // We didn't find our source, wait and retry
    await sleep(100);

    return getSourceData();
  };

  const payload = await getSourceData();
  knownIds.push(payload.ID);

  return new Source(payload);
}
