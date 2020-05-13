import { promises as fs } from "fs";
import Source from "./source";
import { getAudioStatus } from "./util";
import { AudioStatus, SourceData } from "./types";

async function sleep(timeMs: number) {
  return new Promise((r) => setTimeout(r, timeMs));
}

const knownIds: Array<number> = [];
export async function createSource(
  filePath: string,
  volume = 1,
  loop = 0
): Promise<Source> {
  if (typeof filePath !== "string") {
    throw Error("File cannot be null.");
  }

  if (!filePath.endsWith(".wav") && !filePath.endsWith(".aiff")) {
    throw new Error("File must be .wav or .aiff");
  }

  // Check if file exists
  try {
    await fs.access(filePath);
  } catch (e) {
    throw new Error("File not found");
  }

  const data = JSON.stringify({
    File: filePath,
    Volume: volume,
    DoesLoop: loop !== 0,
    LoopCount: loop,
  });

  await fs.writeFile("/tmp/audio", data);

  // Wait for pid1 to pickup new source from /tmp/audio
  // we will timeout after 2 seconds if there's no response
  let retries = 0;
  const getSourceData = async (): Promise<SourceData> => {
    retries++;
    if (retries > 20) {
      throw new Error("Failed to retrieve audio status");
    }

    const audioStatus = await getAudioStatus();
   
    if (!audioStatus) {
      // We don't have an audio status
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

    // We didn't find our source
    await sleep(100);

    return getSourceData();
  };

  const payload = await getSourceData();
  knownIds.push(payload.ID);

  return new Source(payload);
}

// export function getSources(): Array<Source> {
//   // check source data from json file
//   // if we don't have a source for any of the sources
//   // we create them
// }
