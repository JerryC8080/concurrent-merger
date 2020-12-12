import uuid from '../utils/uuid';

import { logger } from './logger';

/**
 * 单任务队列
 * 1. 被修饰的函数，同一时间只允许执行一个异步请求。
 * 2. 在异步请求完成之前，其他调用请求会被进入队列。
 * 3. 异步请求完成之后，队列中的请求会被释放，共用同一个结果。
 *
 * 使用场景：高并发秒杀场景、刷新登录态场景等
 */
export class ConcurrentMerger {
  // 最大队列负载
  public queueMaxLength = 100;
  // 单队列名称
  public name = 'unnamed';
  // 异步状态
  private locked = false;
  // 异步队列
  private queue: Array<any> = [];

  constructor({
    queueMaxLength,
    name,
  }: {
    queueMaxLength?: typeof ConcurrentMerger.prototype.queueMaxLength;
    name?: typeof ConcurrentMerger.prototype.name;
  }) {
    if (queueMaxLength) this.queueMaxLength = queueMaxLength;
    if (name) this.name = name;
  }

  private addJob(job: Array<any>) {
    const id = uuid();
    if (this.queue.length >= this.queueMaxLength) {
      throw new Error(`${this.name}-任务队列-超出容量：${this.queueMaxLength}`);
    }

    logger.info(
      `${this.name}-任务队列-入列(${this.queue.length + 1}/${
        this.queueMaxLength
      }, id: ${id})`
    );

    this.queue.push([...job, id]);
  }

  private consumeAllAsSuccess(result) {
    // eslint-disable-next-line functional/no-loop-statement
    while (this.queue.length > 0) {
      const [resolve, , id] = this.queue.shift();
      logger.info(`${this.name}-任务队列-消费-resolve(id: ${id})`);
      resolve(result);
    }
  }

  private consumeAllAsFail(error) {
    // eslint-disable-next-line functional/no-loop-statement
    while (this.queue.length > 0) {
      const [, reject, id] = this.queue.shift();
      logger.info(`${this.name}-任务队列-消费-reject(id: ${id})`);
      reject(error);
    }
  }

  public proxy(originMethods: (...any) => Promise<any>) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;

    return function (this: any, ...args) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        // 先入队
        that.addJob([resolve, reject]);

        // 通道被 locked，等待队列被消费。
        if (that.locked) return;

        // 发起原方法异步调用，然后 lock
        that.locked = true;
        logger.info(`${that.name}-任务队列-执行目标方法`);
        try {
          const result = await originMethods.apply(this, args);
          // 3. 结束之后，消费 queue
          that.consumeAllAsSuccess(result);
        } catch (error) {
          that.consumeAllAsFail(error);
        }
        // 4. 解除 lock
        that.locked = false;
      });
    };
  }
}
