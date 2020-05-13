import { promises as fs } from 'fs';
import { AudioStatus, SourceData, SourceNotFoundError } from './types';

const audioStatusPath = '/tmp/audioStatus.json';

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
