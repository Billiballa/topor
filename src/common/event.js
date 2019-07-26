/**
 * 基类， 主要是封装事件模块
 */
export default class EventMixin {
  constructor() {
    this._listeners = {};
  }

  // 触发事件
  emit(event, data) {
    let handlers = this._listeners[event];
    if (handlers) {
      for (let handler of handlers) {
        handler(data);
      }
    }
    return this;
  }

  // 监听事件
  on(event, handler) {
    let handlers = this._listeners[event];
    if (!handlers) {
      this._listeners[event] = handlers = [];
    }
    handlers.push(handler);

    return this;
  }

  // 取消事件
  off(event, handler) {
    if (!event) {
      this._listeners = {};
      return this;
    }

    for (let eventName of this._listeners) {
      if (event !== eventName) continue;

      if (!handler) {
        delete this._listeners[eventName];
        return this;
      }

      let handlers = this._listeners[eventName];
      for (let i = 0; i < handlers.length; i++) {
        if (handlers[i] === handler) {
          handlers.splice(i, 1);
          if (handlers.length === 0) delete this._listeners[eventName];
          return this;
        }
      }
    }

    return this;
  }

  // 销毁实例
  dispose() {
    this.off();
    return this;
  }

  // ********** 需要子类实现的方法 ***********
  // render(data){return this; }
  // update(data){return this; }
  // updateStatus(data){return this; }
  // exportData(data){return null; }
}
