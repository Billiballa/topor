import util from "../util";

export default class StateMixin {
  constructor() {
    // 全局设置
    this._globalOption = {}
    // 注册的插件
    this._plugins = []
    // 注册的元素
    this._elements = {}
    // 元素实例
    this._data = {}
  }

  getOption() {
    return util.clone(this._globalOption);
  }

  setOption(newOption) {
    util.merge(this._globalOption, newOption, true);
    return this.getOption();
  }

  registerPlugin(plugin, option) {
    if (!this._plugins.includes(plugin)) {
      this._plugins.push(plugin);
      plugin.install(this, option);
    }
  }

  registerElement(name, element) {
    if (!(name in this._elements)) {
      this._elements[name] = {
        name,
        handle: element,
        attr: {}
      };
      element.install(this);
    }
  }

  getElAttr(name) {
    let el = this._elements[name];

    if (!el) { return }

    return util.clone(el.attr);
  }

  setElAttr(name, newAttr) {
    let el = this._elements[name];

    if (!el) { return }

    util.merge(el.attr, newAttr, true);

    return this.getElAttr(name)
  }

  addData(data) {
    let elClass = this._elements[data.type];

    if (!elClass) { return }

    let el = new elClass.handle(this, util.clone(data));

    this._data[data.id] = el;

    el.init();

    return el;
  }

  getData(id) {
    if (!(id in this._data)) {
      return null;
    }
    return this._data[id];
  }

  setData(id, newData) {
    let data = this.getData(id);
    if (!data) {
      return this.addData(newData);
    }

    data.update(util.clone(newData));

    return data;
  }

  deleteData(dataId) {
    if (dataId == null) {
      for (const dataId in this._data) {
        this._data[dataId].dispose();
      }
      this._data = {}
    } else if (dataId in this._data) {
      this._data[dataId].dispose();
      delete this._data[dataId];
    }
  }

  dispose() {
    this.deleteData();

    this._globalOption = null;
    this._plugins = null;
    this._elements = null;
    this._data = null;
  }
}