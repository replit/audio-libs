import * as path from 'path';
import { playFile, playTone } from '../index';
import { getRawSource, sleep } from '../util';
import { WaveType } from '../types';

describe('Creates sources', () => {
  test('Succesfully creates a source', async () => {
    const filePath = path.join(__dirname, '/test.wav');

    const source = await playFile({ filePath });
    expect(source.filePath).toEqual(filePath);
  });

  test('Can pause source', async () => {
    const filePath = '../test.mp3'

    const source = await playFile({ filePath });
    expect(source.filePath).toEqual(filePath);

    source.togglePlaying();
    await sleep(1000);
    expect((await getRawSource(source.ID)).Paused).toEqual(true);

    source.togglePlaying();
    await sleep(1000);
    expect((await getRawSource(source.ID)).Paused).toEqual(false);
  });

  test('Can change volume', async () => {
    const filePath = path.join(__dirname, '/test.wav');

    const source = await playFile({ filePath });

    source.setVolume(2);
    await sleep(1000);
    expect((await getRawSource(source.ID)).Volume).toEqual(2);

    source.setVolume(0.2);
    await sleep(1000);
    expect((await getRawSource(source.ID)).Volume).toEqual(0.2);
  });

  test('Can set loop', async () => {
    const filePath = path.join(__dirname, '/test.wav');

    const source = await playFile({ filePath });

    expect((await getRawSource(source.ID)).Loop).toEqual(0);
    expect(await source.getRemainingLoops()).toEqual(0);

    source.setLoop(2);
    await sleep(1000);
    expect((await getRawSource(source.ID)).Loop).toEqual(2);
    expect(await source.getRemainingLoops()).toEqual(2);
  });

  test('Other functions return properly', async () => {
    const filePath = path.join(__dirname, '/test.wav');

    const source = await playFile({ filePath });
    expect(await source.getStartTime()).toBeTruthy();
    expect(await source.getEndTime()).toBeTruthy();
    expect(await source.getTimeRemaining()).toBeTruthy();
  });

  test('Can play a tone', async () => {
    await playTone({
      seconds: 2,
      pitch: 400,
      type: WaveType.WaveSine,
    });
  });
});
