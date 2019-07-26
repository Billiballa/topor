import zrender from 'zrender'
import util from '../util'
// import InitMixin from '../common/state'
import StateMixin from '../common/state'
import EventMixin from '../common/event'
import initElement from '../element'
import initPlugin from '../plugins'

/**
 * 拓扑基础容器
 * 包含容器的基础属性
 *
 * dom: 页面容器dom节点
 * data: 拓扑数据
 * zrender: zrender实例
 * root: 根节点  zrende.Group 实例
 * @extends InitMixin、StateMixin、EventMixin
 */
export default class BaseGraph extends util.mix(StateMixin, EventMixin) {
  constructor(dom, options) {
    super();

    this.dom = dom;
    this.zrender = zrender.init(dom, options);
    this.root = new zrender.Group();
    this.zrender.add(this.root);

    initElement(this)
    initPlugin(this)
  }

  /**
   * set data并开始绘制元素
   * @param  {Object} data 数据
   * @return {BaseGraph}
   */
  render(data) {
    this.setOptions({
      styles: data.styles,
      attrs: data.attrs
    });

    data.els.forEach(el => {
      this.addData(el);
    });

    return this;
  }

  /**
   * 更新数据
   * @param  {Object} data 数据
   * @return {BaseGraph}
   */
  update(data) {
    // TODO 待实现
    console.log(data)
    return this;
  }

  /**
   * 销毁容器 同时销毁容器下所有的元素
   * @return {[type]} [description]
   */
  dispose() {
    StateMixin.prototype.dispose.call(this);
    EventMixin.prototype.dispose.call(this);
    return this;
  }

  /**
   * 根据id查找节点数据
   * @param  {String} id
   * @return {Object}
   */
  findDataById(id) {
    let el = this.findElementById(id)
    return el ? el.data : null
  }

  /**
   * 根据id查找节点元素
   * @param  {String} id
   * @return {BaseElement}
   */
  findElementById(id) {
    return this.getData(id);
  }

  exportImage() { }
}
