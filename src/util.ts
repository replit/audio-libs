import { promises as fs } from "fs";
import { AudioStatus, SourceData, SourceNotFoundError } from "./types";

const audioStatusPath = "/tmp/audioStatus.json";

export async function getAudioStatus(): Promise<AudioStatus | null> {
  try {
    await fs.access(audioStatusPath);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(audioStatusPath, "not found", e);

    // no status found, exit
    return null;
  }

  const data = await fs.readFile(audioStatusPath, { encoding: "utf8" });
  if (!data) {
    // eslint-disable-next-line no-console
    console.error("No data from", audioStatusPath);

    return null;
  }

  let audioStatus: AudioStatus;
  try {
    audioStatus = JSON.parse(data);
  } catch (e) {
    console.error("JSON parse error", audioStatusPath);
    return null;
  }

  // TODO maybe verify data?

  return audioStatus;
}

export async function getRawSource(id: number): Promise<SourceData> {
  const data = await getAudioStatus();
  let source: SourceData;
  for (const s of data.Sources) {
    if (s.ID == id) {
      source = s;
      break;
    }
  }

  if (!source) {
    throw new SourceNotFoundError(`Could not find source with ID "${id}.`);
  }

  return source;
}
