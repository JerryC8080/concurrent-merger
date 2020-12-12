import test from 'ava';

import { ConcurrentMerger, logger, LoggerLevel } from '../index';

logger.level = LoggerLevel.INFO;

test('concurrent-merger unit test', (t) => {
  // prepare material
  const name = 'test-merger';
  const result = 'the result';
  let tasksWasDone = false;
  const concurrentMerger = new ConcurrentMerger({ name });
  const method = () =>
    Promise.resolve().then(() => {
      tasksWasDone = true;
      logger.info('async tasks was run');
      return result;
    });
  const methodProxy = concurrentMerger.proxy(method);

  // name should be ok;
  t.is(concurrentMerger['name'], name);

  // call methods as sync
  const arr = new Array(6).fill('');

  // after consume, should share result
  arr.forEach(() => methodProxy().then((res) => t.is(res, result)));

  // sync jobs should all in the queue;
  t.is(concurrentMerger['queue'].length, arr.length);

  // and the async task should not be run yet;
  t.is(tasksWasDone, false);

  // at next event loop
  setTimeout(() => {
    // queue should be consume
    t.is(concurrentMerger['queue'].length, 0);

    // and the async tasks was done
    t.is(tasksWasDone, true);
  }, 0);
});
