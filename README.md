# Single Queue

## 场景

在第一次请求回调之前，后续请求入队进行等待，直到请求完成之后，释放队列，共享结果。

## Install & Usage

1. 安装

```shell
npm i @jerryc/single-queue
```

2. 使用

```javascript
const singleQueue = new SingleQueue({ name: 'test-queue' });
const getAssets = async () => API.requestAssets();

const getAssetsProxy = singleQueue.proxy(getAssets);

// 高频并发调用 getAssets，在第一次请求回调之前，后续请求会入队进行等待，直到请求完之后，释放队列，共享结果。
getAssetsProxy().then(result => ...);
getAssetsProxy().then(result => ...);
getAssetsProxy().then(result => ...);
getAssetsProxy().then(result => ...);

// 输出 log
// [single-queue:info] test-queue-任务队列-入列(1/100, id: db3116bd-e4e7-4c6e-9397-32ce015e6225)
// [single-queue:info] test-queue-任务队列-执行目标方法
// [single-queue:info] test-queue-任务队列-入列(2/100, id: a0b206ba-a3af-4e54-9f99-13206595d1df)
// [single-queue:info] test-queue-任务队列-入列(3/100, id: 2dc2f30b-66ff-4101-9eff-56530131689c)
// [single-queue:info] test-queue-任务队列-入列(4/100, id: 580fa99c-8794-495c-b805-8c72978e3fa1)
// [single-queue:info] test-queue-任务队列-消费-resolve(id: 2dc2f30b-66ff-4101-9eff-56530131689c)
// [single-queue:info] test-queue-任务队列-消费-resolve(id: 580fa99c-8794-495c-b805-8c72978e3fa1)
// [single-queue:info] test-queue-任务队列-消费-resolve(id: fa597867-38ef-4e84-ae21-6760a136ab15)
// [single-queue:info] test-queue-任务队列-消费-resolve(id: a9b1f027-c6ba-4895-a5a1-41be45853ba9)
```

## Docs

## Test and Coverage

## CI Config
