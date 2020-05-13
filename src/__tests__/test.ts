import * as path from 'path';
import { createSource } from '../index';
import { getRawSource } from '../util';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('Creates sources', () => {
  test('Succesfully creates a source', async () => {
    const filePath = path.join(__dirname, '/test.wav');

    const source = await createSource(filePath);
    expect(source.filePath).toEqual(filePath);
  });

  test('Can pause source', async () => {
    const filePath = path.join(__dirname, '/test.wav');

    const source = await createSource(filePath);
    expect(source.filePath).toEqual(filePath);

    source.togglePlaying();
    await sleep(1000);
    expect((await getRawSource(source.ID)).Paused).toEqual(false);

    source.togglePlaying();
    await sleep(1000);
    expect((await getRawSource(source.ID)).Paused).toEqual(true);
  });

  test('Can change volume', async () => {
    const filePath = path.join(__dirname, '/test.wav');

    const source = await createSource(filePath);

    source.setVolume(2);
    await sleep(1000);
    expect((await getRawSource(source.ID)).Volume).toEqual(2);

    source.setVolume(0.2);
    await sleep(1000);
    expect((await getRawSource(source.ID)).Volume).toEqual(0.2);
  });

  test('Can set loop', async () => {
    const filePath = path.join(__dirname, '/test.wav');

    const source = await createSource(filePath);

    expect((await getRawSource(source.ID)).LoopCount).toEqual(0);
    expect(await source.getRemainingLoops()).toEqual(0);

    source.setLoop(2);
    await sleep(1000);
    expect((await getRawSource(source.ID)).LoopCount).toEqual(2);
    expect(await source.getRemainingLoops()).toEqual(2);
  });

  test('Other functions return properly', async () => {
    const filePath = path.join(__dirname, '/test.wav');

    const source = await createSource(filePath);
    expect(await source.getStartTime).toBeTruthy();
    expect(await source.getEndTime).toBeTruthy();
    expect(await source.getTimeRemaining).toBeTruthy();
  });
});
