import { SingleQueue } from './single-queue';

export default function singleQueue({
  queueMaxLength,
  name,
}: {
  queueMaxLength?: typeof SingleQueue.prototype.queueMaxLength;
  name?: typeof SingleQueue.prototype.name;
} = {}) {
  const singleQueue = new SingleQueue({ queueMaxLength, name });

  return function (
    _target: Record<string, any>,
    _propertyName: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => any>
  ) {
    const method = descriptor.value;
    if (method)
      // async 包一层，兼容 method 非异步函数情况
      descriptor.value = singleQueue.proxy(async function (this: any, ...arg) {
        return method.apply(this, arg);
      });
  };
}
