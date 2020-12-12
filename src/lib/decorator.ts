import { ConcurrentMerger } from './concurrent-merger';

export default function concurrentMerger({
  queueMaxLength,
  name,
}: {
  queueMaxLength?: typeof ConcurrentMerger.prototype.queueMaxLength;
  name?: typeof ConcurrentMerger.prototype.name;
} = {}) {
  const concurrentMerger = new ConcurrentMerger({ queueMaxLength, name });

  return function (
    _target: Record<string, any>,
    _propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
  ) {
    const method = descriptor.value;
    if (method)
      // async 包一层，兼容 method 非异步函数情况
      descriptor.value = concurrentMerger.proxy(async function (
        this: any,
        ...arg
      ) {
        return method.apply(this, arg);
      });
  };
}
