import * as path from 'path';
import { createSource } from '../index';
import { getRawSource } from '../util'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Creates sources', () => {

	setTimeout(() => {

    callback && callback();
  }, 60000);

  test('Succesfully creates a source', async () => {
    const filePath = path.resolve(__dirname + '/test.wav');

    const source = await createSource(filePath);
		// @ts-ignore
    expect(source.filePath).toEqual(filePath);
  });

	test('Can pause source', async () => {
		const filePath = path.resolve(__dirname + '/test.wav');

    const source = await createSource(filePath);
		// @ts-ignore
    expect(source.filePath).toEqual(filePath);

		source.togglePlaying()

		await sleep(3000)

		source.togglePlaying()

		await sleep(3000)
	})

	test('Can change volume', async () => {
		const filePath = path.resolve(__dirname + '/test.wav');

		const source = await createSource(filePath);

		source.setVolume(2)
		await sleep(3000)
		source.setVolume(.2)
		await sleep(3000)
	});

	test('Can set loop', async () => {
		const filePath = path.resolve(__dirname + '/test.wav');

		const source = await createSource(filePath);

		expect((await getRawSource(source.ID)).Loop).toEqual(0)
		expect(await source.getRemainingLoops()).toEqual(0)

		source.setLoop(2)
		await sleep(3000)
		expect((await getRawSource(source.ID)).Loop).toEqual(2)
		expect(await source.getRemainingLoops()).toEqual(2)

		await sleep(3000)
	})

	test('Other functions return properly', async () => {
		const filePath = path.resolve(__dirname + '/test.wav');

		const source = await createSource(filePath);
		expect(await source.getStartTime).toBeTruthy();
		expect(await source.getEndTime).toBeTruthy();
		expect(await source.getTimeRemaining).toBeTruthy();
	})
});
