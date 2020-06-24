import { promises as fs } from 'fs';
import Source from './source';
import { getAudioStatus, sleep } from './util';
import { SourceData, RequestData, FileTypes, ReaderType, WaveType } from './types';
/**
 * A list of known source IDs used
 * to determine new sources.
 */
const knownIds: Array<number> = [];

let namesUsed = 0;

/**
 * Returns a unique name for a decoder.
 */
function getName(): string {
  namesUsed++;

  return namesUsed.toString();
}

/**
 * Waits for pid1 to add the source with the provided name.
 */
async function getNewSource(name: string): Promise<SourceData> {
  // Wait forapid1 to pickup new source from /tmp/audio
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
      if (sourceData.Name !== name) {
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

  return getSourceData();
}

/**
 * Used to start playing a file.
 */
export async function playFile({
  /**
   * The path to the file. Can be relative.
   */
  filePath,
  /**
   * The volume the file will be played at (1 being 100%).
   */
  volume = 1,
  /**
   * How many times the file should be restarted.
   */
  loop = 0,
  /**
   * The name you want the file to have.
   */
  name = getName(),
}: {
  filePath: string;
  volume?: number;
  loop?: number;
  name?: string;
}): Promise<Source> {
  if (typeof filePath !== 'string') {
    throw Error('File cannot be null.');
  }

  let isValid = false;
  let fileType: ReaderType = ReaderType.WavFile;
  for (const type of FileTypes) {
    if (filePath.endsWith(`.${type.toString()}`)) {
      isValid = true;
      fileType = type;
      break;
    }
  }

  if (!isValid) {
    throw new Error('Invalid file type.');
  }

  // Check if file exists
  try {
    await fs.access(filePath);
  } catch (e) {
    throw new Error('File not found');
  }

  const data: RequestData = {
    Volume: volume,
    DoesLoop: loop !== 0,
    LoopCount: loop,
    Type: fileType,
    Name: name,
    Args: {
      Path: filePath,
    },
  };

  const jsonData = JSON.stringify(data);
  await fs.writeFile('/tmp/audio', jsonData);

  const payload = await getNewSource(name);
  knownIds.push(payload.ID);

  return new Source(payload);
}

/**
 * Used to start playing a tone.
 */
export async function playTone({
  /**
   * How long the tone should play.
   */
  seconds,
  /**
   * The type of the tone.
   */
  type,
  /**
   * The frequency of the tone.
   */
  pitch,
  /**
   * The name of the tone.
   */
  name = getName(),
  /**
   * How many times the tone should be played.
   */
  loop = 0,
  /**
   * The volume of the tone (1 being 100%).
   */
  volume = 1,
}: {
  seconds: number;
  type: WaveType;
  pitch: number;
  name?: string;
  loop?: number;
  volume?: number;
}): Promise<Source> {
  const data: RequestData = {
    Volume: volume,
    Name: name,
    Type: ReaderType.Tone,
    DoesLoop: loop !== 0,
    LoopCount: loop,
    Args: {
      Seconds: seconds,
      WaveType: type,
      Pitch: pitch,
    },
  };

  const jsonData = JSON.stringify(data);

  await fs.writeFile('/tmp/audio', jsonData);

  const payload = await getNewSource(name);

  return new Source(payload);
}
