# Concurrent Merger - 并发调用合并器

[![CircleCI](https://img.shields.io/circleci/build/github/JerryC8080/concurrent-merger/master?style=for-the-badge)](https://circleci.com/gh/JerryC8080/concurrent-merger/tree/master)
[![Coveralls github branch](https://img.shields.io/coveralls/github/JerryC8080/concurrent-merger/master?style=for-the-badge)](https://coveralls.io/github/JerryC8080/concurrent-merger?branch=master)
[![NPM Version](https://img.shields.io/npm/v/@jerryc/concurrent-merger.svg?style=for-the-badge)](https://www.npmjs.com/package/@jerryc/concurrent-merger)
[![NPM Downloads](https://img.shields.io/npm/dm/@jerryc/concurrent-merger.svg?style=for-the-badge)](https://www.npmjs.com/package/@jerryc/module-seed)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@jerryc/mini-logger.svg?style=for-the-badge)

## 说明

在一次异步调用完成之前，所有后续调用进行等待，直到函数完成，共享调用结果。

![设计图](https://bluesun-1252625244.cos.ap-guangzhou.myqcloud.com/img/20201212113844.png)

> 注意：该设计模式，由于多次调用共享一次调用结果，对函数有幂等和入参固定的要求。

## Quick Usage

1. 安装

```shell
npm i @jerryc/concurrent-merger
```

2. 使用

```javascript
import { ConcurrentMerger } from '@jerryc/concurrent-merger';

// 一个请求远程资源的异步函数
const getAssets = async () => API.requestAssets();

// 创建 ConcurrentMerger 实例
const concurrentMerger = new ConcurrentMerger({ name: 'test-merger' });
// 代理原函数
const getAssetsProxy = concurrentMerger.proxy(getAssets);

// 高频并发调用 getAssetsProxy，在第一次请求回调之前，后续请求会入队进行等待，直到请求完之后，释放队列，共享结果。
getAssetsProxy().then(result => ...);
getAssetsProxy().then(result => ...);
getAssetsProxy().then(result => ...);
getAssetsProxy().then(result => ...);

// 输出 log
// [concurrent-merger:info] test-merger-任务队列-入列(1/100, id: db3116bd-e4e7-4c6e-9397-32ce015e6225)
// [concurrent-merger:info] test-merger-任务队列-执行目标方法
// [concurrent-merger:info] test-merger-任务队列-入列(2/100, id: a0b206ba-a3af-4e54-9f99-13206595d1df)
// [concurrent-merger:info] test-merger-任务队列-入列(3/100, id: 2dc2f30b-66ff-4101-9eff-56530131689c)
// [concurrent-merger:info] test-merger-任务队列-入列(4/100, id: 580fa99c-8794-495c-b805-8c72978e3fa1)
// [concurrent-merger:info] test-merger-任务队列-消费-resolve(id: 2dc2f30b-66ff-4101-9eff-56530131689c)
// [concurrent-merger:info] test-merger-任务队列-消费-resolve(id: 580fa99c-8794-495c-b805-8c72978e3fa1)
// [concurrent-merger:info] test-merger-任务队列-消费-resolve(id: fa597867-38ef-4e84-ae21-6760a136ab15)
// [concurrent-merger:info] test-merger-任务队列-消费-resolve(id: a9b1f027-c6ba-4895-a5a1-41be45853ba9)
```

## Senior Usage

### 1. Decorator

如果你的项目中支持 `TS` 或者 `ES Decorator`，那么 `ConcurrentMerger` 提供了快捷使用的装饰器。

```javascript
import { decorator as concurrentMerger } from '@jerryc/concurrent-merger';

@concurrentMerger({ name: 'test-merger' })
async function getAsset() {
  return API.requestAssets();
};
```

### 2. Modify Log Level

`ConcurrentMerger` 内置了一个迷你 logger（power by [@jerryc/mini-logger](https://github.com/JerryC8080/mini-logger)），方便内部日志打印，外部可以获得 `Logger` 的实例，进行 log level 的控制。

```javascript
import {
  logger,
  LoggerLevel,
  ConcurrentMerger,
} from '@jerryc/concurrent-merger';

// 创建 ConcurrentMerger 实例
const concurrentMerger = new ConcurrentMerger({ name: 'test-merger' });

// 下调 Log level
logger.level = LoggerLevel.ERROR;
```

关于 Log Level 的详细，查看：[@jerryc/mini-logger](https://github.com/JerryC8080/mini-logger)

## API

详见：https://jerryc8080.github.io/concurrent-merger/

## 测试覆盖率

详见：https://jerryc8080.github.io/concurrent-merger/coverage/index.html
